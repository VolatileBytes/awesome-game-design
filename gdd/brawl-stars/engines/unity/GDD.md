---
id: brawl-stars
title: Brawl Stars — Unity Implementation
version: 0.1.0
description: Unity-specific implementation guide for a Brawl Stars-style 3v3 real-time mobile shooter. Server-authoritative, deterministic sim, short matches.
tags: [unity, mobile, real-time, pvp, netcode, urp, hero-shooter]
---

# Brawl Stars — Unity Implementation

Engine overlay for the Brawl Stars GDD. Assumes familiarity with the base [GDD.md](../../GDD.md).

## Target

- **Unity:** 2022.3 LTS or later
- **Render pipeline:** URP with 2D or 3D (the game uses 3D models with a flat-look shader)
- **Input:** New Input System, dual virtual sticks
- **Platforms:** iOS + Android primary; PC/Tablet/Switch tertiary
- **Networking:** server-authoritative real-time sim

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP |
| `com.unity.inputsystem` | Virtual sticks, touch |
| `com.unity.cinemachine` | Camera follow with offset-toward-aim |
| `com.unity.addressables` | Brawler asset loading on demand |
| `com.unity.textmeshpro` | UI |
| `com.unity.ugui` | Canvas, UI |
| `com.unity.localization` | Multi-language |
| `com.unity.mathematics` | Fixed-point sim math |
| `com.unity.burst` | Sim hot paths |

Third-party:
- **DOTween** — UI tweens, hit-flashes
- **MessagePack-CSharp** — wire format

## Core Architecture

### Deterministic Sim (Server-Authoritative)

Same pattern as clash-royale:
- 20–30 Hz fixed tick
- Fixed-point math for positions (Q16.16)
- No Unity physics
- No `Random` without seeded RNG
- Sim isolated from View

Brawl Stars is **real-time**. Tick rate is as important as for clash-royale; possibly higher (30 Hz minimum, 60 Hz for "tight aim" feel).

### Client Prediction + Server Reconciliation

Typical rollback pattern:
- Client sends inputs (move vector + fire intent) at input rate (60 Hz)
- Server receives + runs sim at tick rate (30 Hz)
- Server broadcasts authoritative state at tick rate
- Client applies client-predicted state locally until server confirms
- On server divergence, client rolls back and replays inputs up to "now"

### Separation of Sim and Presentation

- `Game.Sim` — pure C#, no Unity references
- `Game.View` — MonoBehaviours rendering sim state

Any violation of this boundary breaks determinism.

## Project Layout

```
Assets/
  _Project/
    Art/
      Brawlers/
      VFX/
      UI/
    Data/
      Brawlers/          # ScriptableObject per brawler
      Supers/
      Gadgets/
      StarPowers/
      Hypercharges/
      Modes/             # mode definitions
      Maps/              # map definitions
    Prefabs/
      Brawlers/          # visual prefabs
      Projectiles/
      VFX/
      UI/
    Scenes/
      Boot.unity
      Menu.unity
      Match.unity
    Scripts/
      Core/
      Sim/               # deterministic sim
      View/              # presentation
      Net/               # networking
      Matchmaking/
      Brawlers/
      Abilities/
      Modes/
      Maps/
      UI/
      Input/
      Economy/
      Club/
```

## Brawler System

### ScriptableObject Definition

```csharp
[CreateAssetMenu]
public class BrawlerDefinition : ScriptableObject {
    public string Id;
    public Role Role;
    public Rarity Rarity;
    public int[] HpPerPowerLevel;
    public int[] DamagePerPowerLevel;
    public float Speed;
    public float Range;
    public float ReloadSeconds;
    public int AmmoMax;
    public ProjectilePattern AttackPattern;
    public SuperDefinition Super;
    public List<GadgetDefinition> Gadgets;
    public List<StarPowerDefinition> StarPowers;
    public HyperchargeDefinition Hypercharge; // optional
    public GameObject ViewPrefab;
}
```

### Attack Pattern Strategy Pattern

```csharp
public interface IAttackPattern {
    IEnumerable<ProjectileSpawn> Fire(
        Brawler b, Vector2 origin, Vector2 aim, float timeTick
    );
}
```

Implementations:
- `SingleProjectile` (Colt: 6 shots in a line)
- `Cone` (Shelly: shotgun spread)
- `Piercing` (Brock: rocket that pierces walls)
- `Thrown` (Barley: arc-throw)
- `BurstRapidFire` (Bo: 3-arrow burst)
- `Melee` (Bull: up close)
- `Channeling` (Carl: returning boomerang)
- `RangedLaser` (Piper: snipe scaling with range)

## Super / Gadget / Star Power

Each is a **data asset + behaviour pair**.

```csharp
public interface ISuperExecution {
    void Execute(Sim.Brawler b, Vector2 aimDir, SimState state);
}
```

Super types:
- `BurstDamage` — AoE damage at target
- `Summon` — place a unit (turret, ally)
- `Transform` — temporary state (bigger, stronger, invisible)
- `Mobility` — jump/teleport/dash
- `Heal` — area heal
- `Zone` — persistent effect area
- `LockOut` — reposition enemies (pull, push)

Gadgets reuse the same infrastructure with cooldown + different execution. Star Powers hook into brawler events (on-hit, on-ammo, etc.).

## Maps

Maps are **grid-based** (tile data) with **environment objects**.

```csharp
[CreateAssetMenu]
public class MapDefinition : ScriptableObject {
    public string Id;
    public string Mode;
    public Vector2Int GridSize;
    public TileKind[,] Tiles;   // Empty, Wall, Bush, Water, Lava
    public Vector2Int[] SpawnsTeamA;
    public Vector2Int[] SpawnsTeamB;
    public ModeSpecificData ModeData;
    public GameObject ArenaPrefab;  // visual
}
```

### Pathfinding

- A* on the tile grid, walls block, bushes don't
- For brawler movement, A* is optional — most brawlers are stick-driven and move where the stick points
- A* is used for **AI bots** and **long-range weapon trajectory planning** (some projectiles predict enemy movement)

## Modes

Each mode is a **state machine**:
- Setup (players drop in, 3s countdown)
- Active (players fight, score accumulates)
- End (one condition met, freeze and declare)

```csharp
public abstract class ModeController {
    public abstract void OnStart();
    public abstract void OnTick(SimState state);
    public abstract bool CheckEndCondition(SimState state);
    public abstract MatchResult ResolveResult(SimState state);
}
```

Mode-specific logic:
- `GemGrabController` — track gem pit, hold timer
- `BountyController` — star collection
- `BrawlBallController` — ball physics, goal detection
- `HeistController` — safe damage scoring
- `ShowdownController` — shrinking gas zone, last-standing detection

## Networking

See [references/netcode-architecture.md](references/netcode-architecture.md). Summary:
- Server-authoritative
- Input rate 60 Hz (client), sim rate 30 Hz (server)
- State broadcast 30 Hz to all players
- Client prediction + reconciliation on divergence
- MessagePack serialisation; UDP (with custom reliable-ordered layer) preferred over TCP

## Bots & AI

Every match has backfilled bots for:
- Matchmaking failures (can't find 3v3 → bot the missing slots)
- PvE modes (Boss Fight, Robo Rumble)
- Training mode (vs. bot team)

Bot AI is a **state machine** with utility scoring:
- `Seek` — path toward nearest enemy or objective
- `Attack` — fire at visible enemy in range
- `Retreat` — when HP low, kite back toward teammates
- `Objective` — grab gems / push ball / capture zone

Bots are deterministic, which is important for replays (yes, brawl-stars-style PvE is often replayable).

## Performance

Targets:
- **60 FPS** on mid-range iOS/Android
- **30 FPS** minimum on low-end
- **< 300 MB** initial install; Addressables for brawler-specific content
- **6–12 entities** max in a match (6 brawlers + projectiles + objectives) — manageable

Optimisation:
- Single canvas for HUD; CanvasRaycaster disabled where possible
- Pool projectiles (each brawler shoots many)
- Pool VFX
- Disable Animator for non-hero objects (turrets, summons) — use scripted sprite swap
- Bake lighting; dynamic lights only on heroes if at all

## UI

- **Virtual sticks**: anchor to bottom-left and bottom-right of screen; scale with aspect ratio
- **Fire button**: tap or drag-aim; show trajectory indicator while dragging
- **Super button**: glows when charged; animate the charge ring per damage
- **Gadget button**: cooldown ring
- **Hypercharge button**: secondary meter

## Common Unity Pitfalls

- Running sim in `Update()` → non-deterministic
- Using `Physics.Raycast` for line-of-sight → use grid-based LOS instead
- `Animator.Play` per sprite → GC; use `MaterialPropertyBlock` for sprite state changes
- Not pooling projectiles → GC hitches
- Overdrawing UI canvases → battery drain on mobile

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Netcode Architecture](references/netcode-architecture.md)
