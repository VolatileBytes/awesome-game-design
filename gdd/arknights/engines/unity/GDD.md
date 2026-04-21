---
id: arknights
title: Arknights — Unity Implementation
version: 0.1.0
description: Unity-specific implementation guide for a tile-based real-time tower defense with deep roster, data-driven Operators, and puzzle-like stages.
tags: [unity, mobile, tower-defense, gacha, rpg, urp]
---

# Arknights — Unity Implementation

Engine overlay for the Arknights GDD. See [GDD.md](../../GDD.md).

## Target

- **Unity**: 2022.3 LTS or later
- **Render pipeline**: URP with custom 2D/3D hybrid (stage is top-down with 2D sprites + 3D effects)
- **Input**: New Input System, touch-first
- **Platforms**: iOS + Android primary; PC (Mumu/BlueStacks common), tablet
- **Networking**: online-required for account sync; stages are client-side simulated

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP |
| `com.unity.inputsystem` | Touch / drag |
| `com.unity.addressables` | Operator art, skill VFX, stage assets |
| `com.unity.textmeshpro` | UI |
| `com.unity.ugui` | Canvas |
| `com.unity.localization` | Multi-language (essential for global) |
| `com.unity.animation.rigging` | Live2D-style dorm animations |
| `com.unity.timeline` | Story scenes |
| `com.unity.addressables` | Asset loading |

Third-party:
- **Live2D Cubism SDK** — for Home scene Operator animations
- **DOTween** — UI tweens
- **Spine** or **Unity Skeleton** — sprite-sheet skeletal animation for in-stage Operators
- **MessagePack-CSharp** — wire format for state/save
- **YooAsset** (alternative to Addressables) — asset bundle management

## Core Architecture

### Stage-Scoped Deterministic Sim

Arknights stages are **solved puzzles** — the game benefits if the sim is deterministic (supports replays + Auto-Deploy). Approach:
- Fixed-point math for positions
- Seeded RNG for any randomness
- Deterministic tick (30 Hz) for sim updates
- Client-side sim (no server sim during stage; stage outcome reported on completion)

### Server-Validated Outcomes

For competitive integrity:
- Final stage outcome (cleared, stars, loot) is validated by server via inputs replay
- Inputs + seed sent to server → server replays → must match client-reported outcome
- Mismatch → mark as suspicious, escalate

### Sim / View Separation

- `Game.Sim` — pure C# tower-defense simulation
- `Game.View` — MonoBehaviours rendering sim state

## Project Layout

```
Assets/
  _Project/
    Art/
      Operators/              # full portraits, E2 variants, skins
      OperatorSprites/        # in-stage chibis (Spine/Skeleton)
      VFX/                    # skill effects
      Stages/                 # stage backgrounds, tile art
      UI/
    Data/
      Operators/              # ScriptableObject per operator
      Skills/                 # skills as assets
      Talents/
      Enemies/                # ScriptableObject per enemy
      Stages/                 # stage definition SOs with wave scripts
      Modules/                # endgame equipment
      Bases/                  # infrastructure rooms
    Prefabs/
      OperatorChibi/
      EnemyUnit/
      ProjectileFX/
      VFX/
      StageTile/
      UI/
    Scenes/
      Boot.unity
      Menu.unity
      Stage.unity
      Home.unity              # dorm / Operator social scene
    Scripts/
      Core/
      Sim/
      View/
      Net/
      Operators/
      Skills/
      Enemies/
      Stages/
      Base/
      UI/
      Story/                  # visual novel system
      Gacha/
      Meta/
```

## Operator System

### ScriptableObject Definition

```csharp
[CreateAssetMenu]
public class OperatorDefinition : ScriptableObject {
    public string Id;
    public string DisplayName;
    public Rarity Rarity;  // 1-6 star
    public OperatorClass Class;
    public string SubArchetype;
    public RangePattern Range;  // tiles attackable
    public int BlockCount;  // 0, 1, 2, 3
    public int[] HPByElite;  // E0, E1, E2
    public int[] AtkByElite;
    public int[] DefByElite;
    public int[] ResByElite;
    public float AttackSpeed;
    public int DpCost;
    public float RedeployTime;
    public List<SkillDefinition> Skills;
    public List<TalentDefinition> Talents;
    public List<ModuleDefinition> Modules;
    public Sprite Portrait;
    public SpineAsset ChibiAnimation;
    public Live2DModel HomeAnimation;
    public AudioClip[] VoiceLines;
}
```

### Skill System

```csharp
[CreateAssetMenu]
public class SkillDefinition : ScriptableObject {
    public string Id;
    public string DisplayName;
    public int Level;  // 1-10 (skill level + mastery)
    public SkillTriggerType Trigger;  // Auto, Manual, Passive
    public SPGenerationType SPGen;  // PerSecond, PerAttack, Defensive
    public int SPCost;
    public float Duration;
    public SkillEffect Effect;
    public string Description;
}

public abstract class SkillEffect : ScriptableObject {
    public abstract void OnStart(SimContext ctx, OperatorInstance self);
    public abstract void OnTick(SimContext ctx, OperatorInstance self, float dt);
    public abstract void OnEnd(SimContext ctx, OperatorInstance self);
}
```

Examples:
- `AtkBoostSkill` — +70% ATK for 15s
- `AoEBurstSkill` — instant AoE damage in range
- `SummonSkill` — spawn a summoned unit
- `TrueDamageSkill` — ignore DEF for X attacks

### Talent System

```csharp
[CreateAssetMenu]
public class TalentDefinition : ScriptableObject {
    public string Id;
    public int UnlockElite;  // 0, 1, or 2
    public int UnlockPotential;  // P1-P6
    public TalentEffect Effect;
}

public abstract class TalentEffect : ScriptableObject {
    public virtual void ApplyPassive(SimContext ctx, OperatorInstance self) { }
    public virtual void OnAttack(...) { }
    public virtual void OnDeploy(...) { }
    // more hooks
}
```

## Stage System

```csharp
[CreateAssetMenu]
public class StageDefinition : ScriptableObject {
    public string Id;
    public string Chapter;
    public int SanityCost;
    public int DeployLimit;
    public int InitialDP;
    public float DPGenRate;
    public int MaxLeaks;
    public TileGrid Grid;  // map layout
    public List<Vector2Int> Spawners;
    public List<Vector2Int> Exits;
    public WaveScript Waves;
    public List<Vector2Int> DeployTiles;
    public List<EnvironmentMechanic> Mechanics;
}

[Serializable]
public class WaveScript {
    public List<SpawnEvent> Events;  // [time, enemyId, spawnerId, path]
}
```

### Enemy System

```csharp
[CreateAssetMenu]
public class EnemyDefinition : ScriptableObject {
    public string Id;
    public int HP;
    public int Atk;
    public int Def;
    public int Res;
    public float Speed;
    public AttackType AttackType;
    public List<EnemyAbility> Abilities;
    public GameObject ChibiPrefab;
}
```

## Simulation

- `Sim.Stage` — root sim
- `Sim.Grid` — tile grid with path data
- `Sim.OperatorInstance` — deployed operator: pos, HP, SP, active skill, buffs
- `Sim.EnemyInstance` — live enemy: pos, HP, path progress, buffs, debuffs
- `Sim.ProjectileInstance` — ranged attacks
- `Sim.DPService` — DP accumulation + spend
- `Sim.WaveRunner` — scripted spawn processor
- `Sim.CombatResolver` — damage calc, DoTs, heals
- `Sim.Events` — emitted for View

### Tick Loop

30 Hz:
1. Process wave spawns for this tick
2. Update enemy pathing (enemies move toward exits)
3. Update operator targeting (find valid targets)
4. Apply attacks (damage + effects)
5. Update SP and trigger auto-skills if full
6. Process player actions (deploy, skill, retreat)
7. Update DP generation
8. Check win/loss conditions

## View

- `View.StagePresenter` — subscribe to sim events, drive animations
- `View.OperatorChibiView` — sprite/spine chibi on tile
- `View.EnemyChibiView` — enemy rendering
- `View.ProjectileView` — ranged attack visuals
- `View.SkillVFXPool` — pool of skill effects
- `View.TileGridView` — rendered grid with tile highlights
- `View.DPView` — top-left DP counter
- `View.DeployBenchView` — draggable operator bench at bottom
- `View.PauseButton` — pause / speed toggle

## Controls

- **Drag operator portrait** from bench to a tile
- **Drag facing direction** before releasing
- **Tap operator** → action menu (skill, retreat)
- **Pause button** top-right
- **Speed toggle** (1x, 2x)
- **Restart button** in pause menu

## Gacha / Headhunting

Implemented as a non-match service:
- Server: manages pulls, banner state, pity counters
- Client: animations + reveals
- No client-side RNG (server authoritative)
- Cached rate tables per banner

## Base (Infrastructure) Scene

Separate scene: multi-room base view
- Each room is a zone with animated Operators
- **Tap a room** → management UI (assign operators, upgrade, collect)
- **Offline income** computed on login (base generates while away)

## Home / Dormitory Scene

- Live2D animated Operators in their room
- Tap them for voice lines + dialogue
- **Trust rank** increments with time and interaction
- Chair in the center: player's "office"

## Story Scenes (Visual Novel)

- Story is presented via a visual-novel system
- **Sprite + dialog box**
- Choice nodes for some story beats
- Fully voiced (many languages)
- Uses Unity Timeline + custom VN system

## Networking

- **Login sync**: server is source of truth for roster, inventory, story flags
- **Stage completion**: replay + seed sent to server for validation
- **Gacha**: atomic server transactions
- **Base passive income**: computed on login
- **Event shops**: server-tracked currency balances

## Anti-Cheat

- Stage outcome validated server-side by replay
- Gacha RNG server-side
- No client-editable inventory
- Hash comparisons for state integrity

## Performance

- ~30 entities on screen peak (ops + enemies + projectiles)
- URP with single-pass forward rendering
- Sprite atlas for chibis
- Pool all effect GameObjects
- Spine/Skeleton animations are cheap vs full bones

## UI

- Bottom bench with draggable portraits
- Top bar: DP, Kills, Leaks, Time, Speed controls
- Right: Operator management bench
- Floating SP indicator above operators
- Skill button pops up when SP full

## Common Unity Pitfalls

- **Physics for enemy movement** → non-deterministic; use sim-driven movement only
- **Animator per chibi** → 30 active Animators hit performance; use Spine / sprite atlas tween
- **Canvas-rebuild hell**: separate HUD canvas from game-world HP-bar canvas
- **Drag-accept radius too tight**: users mis-drop operators; widen hit-test with a ring

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Stage Sim Architecture](references/stage-sim-architecture.md)
