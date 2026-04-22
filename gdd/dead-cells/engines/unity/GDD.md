---
id: dead-cells
title: Dead Cells — Unity Implementation
version: 0.1.0
description: Unity-specific implementation overlay for Dead Cells — 2D pixel-art action roguelite with hand-authored rooms composed into procedural biomes.
tags: [unity, action, roguelike, metroidvania, 2d-platformer]
---

# Dead Cells — Unity Implementation

Engine overlay for Dead Cells. See [base GDD](../../GDD.md).

> Original: Haxe + Heaps (Motion Twin's in-house). Rebuild target: Unity 2022.3 LTS.

## Target

- **Unity**: 2022.3 LTS
- **Render pipeline**: URP 2D (for 2D lighting on pixel art)
- **Input**: New Input System
- **Platforms**: PC, Mac, Switch, iOS, Android, Steam Deck
- **Target fps**: 60

## Packages

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP 2D |
| `com.unity.inputsystem` | Input |
| `com.unity.textmeshpro` | UI text |
| `com.unity.2d.tilemap` | Tilemap rendering |
| `com.unity.2d.animation` | Sprite-sheet animation |
| `com.unity.addressables` | Room/asset streaming |
| `com.unity.cinemachine` | Camera follow + clamp |
| `com.unity.localization` | i18n |

Third-party:
- **Rewired** (optional) — mature input remapping.
- **DOTween Pro** — UI tweens.
- **Odin Inspector** (optional) — editor tooling for designers.

## Core Architecture

### Fixed-Tick Sim

Combat + movement at 60Hz fixed tick for frame-perfect feel:

```csharp
public class CombatSim {
    public const float TickDelta = 1f / 60f;
    public void Tick() {
        PlayerTick();
        foreach (var e in _enemies) e.Tick();
        ProjectileTick();
        ResolveCollisions();
        ResolveDamage();
        TickStatuses();
    }
}
```

### Data-Driven Content

Everything is ScriptableObjects:

```csharp
[CreateAssetMenu(menuName = "DeadCells/Weapon")]
public class WeaponDefinition : ScriptableObject {
    public string Id;
    public WeaponCategory Category;       // Sword, Dagger, Bow, Shield...
    public WeaponAffinity[] Affinities;   // Red/Purple/Green weights
    public int BaseDamage;
    public AnimationClip[] ComboClips;
    public HitboxDefinition[] HitFrames;  // frame-by-frame hitbox activation
    public List<StatusApply> OnHit;
    public AudioClip HitSfx;
}

[CreateAssetMenu(menuName = "DeadCells/Enemy")]
public class EnemyDefinition : ScriptableObject {
    public string Id;
    public int MaxHP;
    public List<AttackPattern> AttackPatterns;
    public IAIDefinition AI;
    public AnimatorController AnimController;
}

[CreateAssetMenu(menuName = "DeadCells/Biome")]
public class BiomeDefinition : ScriptableObject {
    public string Id;
    public List<RoomPrefabRef> RoomPool;
    public List<WeightedEnemy> EnemyPool;
    public List<BiomeRef> ExitBiomes;
    public int TargetRoomCount;
    public int BossCellDifficultyAdjust;
}
```

### Hitboxes as Data

Frame-perfect hitboxes are critical. Define as SO per weapon:

```csharp
public class HitboxDefinition {
    public int StartFrame;
    public int EndFrame;
    public Vector2 Offset;     // relative to player
    public Vector2 Size;
    public int Damage;         // base
    public List<StatusApply> Effects;
}
```

At runtime, the combat sim checks active hitboxes against enemy colliders each tick.

### Deterministic RNG

```csharp
public class SimRandom {
    public SimRandom ForStream(string name);
    public uint Next();
    public int Range(int min, int max);
}
```

Streams: `layout`, `enemies`, `drops`, `mutations`, `cursed_chest_roll`.

Same seed = same biome layout + drops.

## Project Layout

```
Assets/
  _Project/
    Art/
      Prisoner/         # player sprite sheets
      Enemies/
      Bosses/
      Tilesets/         # per-biome palette
      VFX/
      UI/
    Audio/
      SFX/
      Music/
    Data/
      Weapons/          # ~200 SOs
      Skills/
      Mutations/
      Enemies/
      Biomes/
      RoomPrefabs/
      Blueprints/
      StatusEffects/
    Rooms/              # room prefabs organized by biome
      PrisonersQuarters/
      Promenade/
      ...
    Prefabs/
      Projectiles/
      EnemyPrefabs/
      EntityMarkers/
    Scenes/
      Boot.unity
      Title.unity
      Run.unity         # persistent scene, rooms additively loaded
    Scripts/
      Sim/
        Combat/
        Generator/
      View/
      UI/
      Input/
      Save/
      Meta/
```

## Room Loading

Rooms are additively loaded via Addressables:
1. Biome generator produces a room graph.
2. Player in room N; preload N+1 async.
3. When player passes door, activate N+1, unload N-1.

This keeps memory low while hiding load times.

## Combat Systems

### Weapon Combo

A weapon combo is defined as an ordered list of `HitboxDefinition`s with per-hit cancelable frames:

```csharp
public class ComboDefinition {
    public List<ComboHit> Hits;
    public int CancelableFromFrame;   // e.g. 10 — can roll after frame 10
}
```

Input buffer: 6-frame queue for next combo input.

### Parry

Shield parry is a timing window on shield input release:

```csharp
public class ShieldParry : EffectNode {
    public const int PerfectWindowStart = 8;
    public const int PerfectWindowEnd = 12;
    public void Execute(EffectContext ctx) {
        if (ctx.ElapsedFrames between 8 and 12)
            ReflectProjectile(ctx) + StunAttacker(ctx);
        else
            AbsorbDamage(ctx);
    }
}
```

### Enemy AI

Each enemy is a Finite State Machine or Behavior Tree with 3–6 states:

```
Idle → Patrol → Detect → Windup → Attack → Recover → Idle
```

Defined in SO + small scripting nodes for unique behaviors.

## Save / Load

JSON:

```csharp
public class SaveData {
    public ProfileData Profile;
    public RunSnapshot CurrentRun;  // nullable
}
public class ProfileData {
    public List<string> UnlockedBlueprints;
    public int ForgeTier;
    public int BossCellsUnlocked;
    public List<string> RunesFound;
    public int TotalRunCount;
    public int TotalCellsEver;
    public Dictionary<string, int> ScrollRatings;  // biome → max stat
}
public class RunSnapshot {
    public string Seed;
    public string CurrentBiome, CurrentRoom;
    public int HP;
    public int Gold, Cells;
    public List<WeaponSnapshot> Weapons;
    public List<SkillSnapshot> Skills;
    public List<MutationSnapshot> Mutations;
    public int RedScrolls, PurpleScrolls, GreenScrolls;
    public Dictionary<string, int> CursedChestProgress;
}
```

Save on room entry.

## Performance Budgets

- **Max active enemies per room**: 25.
- **Projectile pool**: 200.
- **VFX pool**: 50 simultaneous.
- **Tilemap chunks loaded**: 2 rooms at a time.
- Target: 60fps on Switch handheld.

## Godot Alternative

The user requested Godot as an alternative engine. Notes:
- Godot's 2D pipeline is comparable to Unity URP 2D.
- GDScript or C# both work; C# gives data-driven SOs-equivalent via Resource classes.
- Smaller binary, open-source alignment with Motion Twin spirit.
- See `engines/godot/GDD.md` (not included in this pass — can be added as a sibling overlay).

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Biome Generation](../../references/biome-generation.md)
