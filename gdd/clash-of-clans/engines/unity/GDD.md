---
id: clash-of-clans
title: Clash of Clans — Unity Implementation
version: 0.1.0
description: Unity-specific implementation guide for a Clash of Clans-style asynchronous base-builder with 3-minute raids and replay system.
tags: [unity, mobile, async-pvp, base-builder, urp, deterministic-sim]
---

# Clash of Clans — Unity Implementation

Engine-specific overlay for the Clash of Clans GDD. Assumes familiarity with the base [GDD.md](../../GDD.md).

## Target

- **Unity:** 2022.3 LTS or later
- **Render pipeline:** URP (3D, stylised shaders)
- **Input:** New Input System with touch
- **Platforms:** iOS + Android primary; PC/tablet tablets a close second
- **Networking:** Async — no real-time PvP. Attack simulation runs **entirely on the client** but is validated server-side on submission.

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP |
| `com.unity.inputsystem` | Touch |
| `com.unity.cinemachine` | Camera for village + attack views |
| `com.unity.addressables` | Loading village chunks, attack scenes, cosmetic packs |
| `com.unity.textmeshpro` | UI |
| `com.unity.ugui` | Canvas, UI |
| `com.unity.localization` | Languages |
| `com.unity.mathematics` | Fixed-point math |
| `com.unity.burst` | Sim hot paths |

Optional:
- **DOTween** — UI tweens
- **Odin Inspector** — data authoring (many SOs)
- **MessagePack-CSharp** — snapshot serialisation

## Core Architecture

### Two Major Scene Modes

**Village Scene** — the home base. Interactive, editable, asynchronous. No simulation pressure; frame-rate driven.

**Attack Scene** — a copy of a target's village, loaded from a snapshot. 3-minute deterministic simulation of a raid. **Frame-rate independent** — the sim ticks on a fixed timestep.

### Determinism in the Attack Scene

Because every attack is replayable and defender-verifiable, the attack simulation must be **bit-exact deterministic**.

- **Fixed-timestep sim**: 30 Hz tick
- **Fixed-point math** for unit positions / velocities / damage (Q16.16 or similar)
- **Seeded RNG** per attack (seed sent with the attack replay)
- **No Unity physics** for gameplay
- **No `Time.deltaTime`** in sim
- **No unordered collections** in sim (no Dictionary iteration; use deterministic sorted lookups)

### Separation of Sim and Presentation

Same pattern as clash-royale:
- `Sim/` — pure C#, no Unity
- `View/` — MonoBehaviours that mirror sim state

The village side (no sim) can freely use standard Unity patterns, but the attack side must be airtight.

## Project Layout

```
Assets/
  _Project/
    Art/
      Buildings/
      Troops/
      VFX/
      UI/
    Data/
      Buildings/         # ScriptableObject per building type
      Troops/
      Spells/
      Heroes/
      Levels/            # progression tables
      Traps/
    Prefabs/
      Village/
      AttackScene/
      UI/
    Scenes/
      Boot.unity
      Village.unity
      Attack.unity
    Scripts/
      Core/
      Village/
      Attack/
        Sim/             # deterministic sim
        View/            # presentation
      Buildings/
      Units/
      Heroes/
      Spells/
      Traps/
      Economy/
      Clan/
      Network/
      UI/
```

## Village System

### Buildings as ScriptableObjects

```csharp
[CreateAssetMenu]
public class BuildingDefinition : ScriptableObject {
    public string Id;
    public BuildingKind Kind; // Defense, Resource, Army, Wall, Hero, TownHall, ClanCastle, ...
    public int[] CostPerLevel;      // gold or elixir
    public CurrencyKind UpgradeCost;
    public float[] UpgradeHoursPerLevel;
    public int[] HpPerLevel;
    public int[] DpsPerLevel;       // 0 if non-offensive
    public float Range;
    public TargetFilter Targets;    // ground/air/both
    public Vector2Int FootprintTiles; // 1x1, 3x3, etc.
    public GameObject Prefab;
}
```

### Village Grid

- 44×44 tile grid (configurable)
- Each tile can be **empty**, **building-occupied**, or **wall-occupied**
- Buildings have multi-tile footprints
- Pathfinding for ground troops uses this grid; walls block until broken

### Village Persistence

Village state serialises to a JSON/MessagePack blob:
```json
{
  "version": 1,
  "townHallLevel": 12,
  "buildings": [
    { "id": "cannon_lvl12", "x": 18, "y": 10, "level": 12, "upgradeTimerSecondsLeft": 0 },
    { "id": "gold_storage", "x": 20, "y": 12, "level": 11 },
    ...
  ],
  "walls": [
    { "x1": 10, "y1": 10, "x2": 20, "y2": 10, "level": 10 },
    ...
  ],
  "traps": [...],
  "resources": { "gold": 123456, "elixir": 98765, "darkElixir": 1234, "gems": 200 },
  "heroes": [
    { "id": "barbarianKing", "level": 45, "upgrading": false }
  ],
  "lastLoginUnix": 1716000000
}
```

The server stores the canonical blob; the client has a local cached copy for offline viewing.

## Attack System

### Attack Entry Point

When the player picks a target:
1. Client downloads target's village snapshot (JSON/MessagePack) + target's Clan Castle troops
2. Client builds an `AttackScene` from the snapshot
3. Player scouts for up to 30 seconds
4. Player deploys first troop → 3-minute timer starts
5. `Sim.Attack` runs at 30 Hz; view renders from sim state
6. Timer hits zero OR all defences destroyed → attack ends
7. Client sends the **input log + seed + initial snapshot hash** to server
8. Server re-runs the attack on its own sim, verifies result, awards stars/loot

### Input Log

```
Tick 0:   (player deploys 3 Giants at tile (4, 5))
Tick 12:  (player deploys 10 Archers along line (6,6)→(12,6))
Tick 24:  (player casts Rage spell at (15, 10))
Tick 37:  (player activates Barbarian King ability)
...
```

Replays are exactly this input log + the initial snapshot + the seed.

### Sim Components

| Class | Responsibility |
|---|---|
| `Sim.Attack` | Root object. `Tick()` advances one step. |
| `Sim.Building` | Runtime building state (hp, cooldown, target) |
| `Sim.Unit` | Runtime unit state (pos, hp, target, cooldown) |
| `Sim.Hero` | Same as unit but with ability, unique id |
| `Sim.Spell` | Active spell effect (rage bubble, heal bubble, freeze area) |
| `Sim.Trap` | State: armed/triggered |
| `Sim.Grid` | Tile occupancy, pathfinding, wall graph |
| `Sim.Events` | Emits SpawnedUnit, UnitMoved, UnitDamaged, BuildingDestroyed, etc. |

### Pathfinding

- **A\*** on the grid, with walls as expensive edges (more expensive = higher wall level)
- Units don't always path "around" walls — the designed behaviour is **prefer breaking walls that lead to the current target** if the wall-break cost is lower than the path-around cost
- Pathfinding re-runs when walls are destroyed (edges change)
- Cache paths per unit; only re-path on grid change

Optimisation: pre-compute the "flow field" per troop target priority (e.g. for Giants, flow field to nearest defence). Much cheaper than per-unit A*.

## Village View (Not Sim)

Freely use standard Unity patterns in the village:
- Each building is a GameObject with a `BuildingBehaviour`
- Tap to select → open side-panel UI (upgrade, move, boost)
- Drag to move (edit mode)
- Timed upgrades schedule a `Coroutine` or check against real-time stamps

## Replay System

### Recording

Every attack **is** a replay. The input log (timestamps + deploys + hero abilities + spell casts) is the recording.

### Playback

A separate mode launches `Attack` scene with:
- The original snapshot (target's village at attack time)
- The original seed
- The original input log

The sim runs in "replay" mode — ignoring live input, consuming the log. Presentation renders normally.

### Sharing

Replays are stored server-side and referenced by a short code. Sharing a replay = sharing a URL like `game://replay/abc123`.

## Save & Load

See [references/save-and-replay.md](references/save-and-replay.md). Key points:
- **Village state is server-authoritative**. Every building placement, upgrade start, resource collection is a server call.
- **Attack replays are server-authoritative**. Server re-runs the sim on each submission.
- **Local cache is read-only**. No client-side progression changes.

## Performance

Village: ~150 buildings × 1 MonoBehaviour each = manageable. The village is not a bottleneck.

Attack: up to ~200 active units + ~30 projectiles + ~150 buildings + ~50 traps. Not trivial; profile carefully.

- Pool units, projectiles, VFX
- Use Burst + Jobs for the hottest sim loops (targeting scans, projectile integration)
- Bake village lighting
- Use atlased sprites/textures for UI and building art
- Disable Animators for buildings; use simple texture-swap or shader effects

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Save & Replay Architecture](references/save-and-replay.md)
