---
id: pokemon-unite
title: Pokémon Unite — Unity Implementation
version: 0.1.0
description: Unity-specific implementation guide for a 5v5 mobile MOBA with lanes, jungle, objectives, and scoring.
tags: [unity, mobile, moba, real-time, netcode, urp]
---

# Pokémon Unite — Unity Implementation

Engine overlay for the Pokémon Unite GDD. See [GDD.md](../../GDD.md).

## Target

- **Unity**: 2022.3 LTS or later
- **Render pipeline**: URP (3D Pokémon characters, stylized)
- **Input**: New Input System, dual virtual sticks + action buttons
- **Platforms**: iOS + Android primary; Nintendo Switch secondary
- **Networking**: server-authoritative real-time sim, 20–30 Hz tick

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP |
| `com.unity.inputsystem` | Dual sticks + buttons |
| `com.unity.cinemachine` | Follow cam + cinematic Unite casts |
| `com.unity.addressables` | Pokémon / VFX loaded on demand |
| `com.unity.textmeshpro` | UI |
| `com.unity.ugui` | Canvas, UI |
| `com.unity.localization` | Multi-language |
| `com.unity.animation.rigging` | Pokémon skeletal rigging |
| `com.unity.mathematics` | Fixed-point math |

Third-party:
- **DOTween** — UI tweens
- **MessagePack-CSharp** — wire format
- **Photon Quantum** (optional) — deterministic sim framework

## Core Architecture

### Server-Authoritative 5v5

- Server runs authoritative sim at 30 Hz
- Clients send inputs at 60 Hz
- Server broadcasts state at 30 Hz to all 10 players
- Client predicts own character; reconciles on divergence

### Sim / View Separation

- `Game.Sim` — pure C# MOBA simulation
- `Game.View` — MonoBehaviours rendering sim state
- 10 Pokémon + wild Pokémon + projectiles + VFX → keep the sim lean

## Project Layout

```
Assets/
  _Project/
    Art/
      Pokemon/                 # character models + animations
      Wild/                    # wild Pokémon
      VFX/
      Arenas/                  # map prefabs
      UI/
    Data/
      Pokemon/                 # ScriptableObject per playable Pokémon
      Moves/                   # each move's data + behavior
      UniteMoves/
      HeldItems/
      BattleItems/
      Wild/                    # wild Pokémon data
      Objectives/              # Drednaw, Zapdos
      Maps/
    Prefabs/
      PokemonBody/
      ProjectileFX/
      VFX/
      UI/
    Scenes/
      Boot.unity
      Menu.unity
      Match.unity
    Scripts/
      Core/
      Sim/
      View/
      Net/
      Pokemon/
      Moves/
      Items/
      Objectives/
      Maps/
      UI/
      Matchmaking/
```

## Pokémon System

### ScriptableObject Definition

```csharp
[CreateAssetMenu]
public class PokemonDefinition : ScriptableObject {
    public string Id;
    public string DisplayName;
    public Role Role;
    public int[] HpPerLevel;
    public int[] AttackPerLevel;
    public int[] DefensePerLevel;
    public float MoveSpeed;
    public float AttackRange;
    public float AttackCooldown;
    public EvolutionStage[] Evolutions;  // stage, level requirement
    public List<MoveBranchDefinition> Move1Branches;  // at level 5
    public List<MoveBranchDefinition> Move2Branches;  // at level 7
    public UniteMoveDefinition UniteMove;
    public GameObject[] ViewPrefabs;  // one per evolution stage
}

[Serializable]
public class EvolutionStage {
    public int RequiredLevel;
    public int HpAtEvolveLevel;
    // ...base stats for this stage
}

[Serializable]
public class MoveBranchDefinition {
    public MoveDefinition OptionA;
    public MoveDefinition OptionB;
}
```

### Moves

```csharp
[CreateAssetMenu]
public class MoveDefinition : ScriptableObject {
    public string Id;
    public string DisplayName;
    public float Cooldown;
    public TargetingMode Targeting;  // AutoTarget, Directional, Self, Ground
    public MoveEffect Effect;        // reference to behavior script
    public GameObject CastVFX;
}

public abstract class MoveEffect : ScriptableObject {
    public abstract void Execute(SimContext ctx, PokemonInstance caster, MoveInput input);
}
```

Example moves:
- `FireballMove` (Charizard Move 1, branch A) — ranged projectile, damage
- `FlameBurstMove` (Charizard Move 1, branch B) — AoE explosion
- `DashMove` (Talonflame Move 2) — gap-close with damage

### Unite Moves

```csharp
[CreateAssetMenu]
public class UniteMoveDefinition : ScriptableObject {
    public string Id;
    public float Cooldown;  // usually ~90s base, earned via damage
    public UniteMoveEffect Effect;
    public GameObject CinematicPrefab;
}
```

## Simulation

- `Sim.Match` — the root sim
- `Sim.PokemonInstance` — runtime state (pos, HP, mana, XP, buffs, debuffs, cooldowns)
- `Sim.WildInstance` — wild Pokémon
- `Sim.ProjectileInstance` — moves that fire projectiles
- `Sim.ObjectiveInstance` — boss monsters (Drednaw, Zapdos)
- `Sim.GoalInstance` — team goals with HP

### Tick Loop

At 30 Hz:
1. Process received inputs from all 10 players
2. Update Pokémon positions (client-predicted; server authoritative)
3. Update wild Pokémon AI
4. Process ongoing effects (DoTs, buffs)
5. Check objective spawns (Drednaw, Rotom, Zapdos timing)
6. Broadcast state delta

## Networking

See [references/netcode-architecture.md](references/netcode-architecture.md).

- Server ticks at 30 Hz
- Client input rate 60 Hz
- Lag compensation for hit detection
- Region-affinity matchmaking

## AI (Wild Pokémon + Bots)

- Wild Pokémon behavior tree: aggro radius, attack-when-attacked, return-to-spawn
- Bot players: utility-scoring AI for lane/jungle/objective decisions
- Bots fill empty slots in matchmaking
- Bots used in beginner matchmaking as training

## Maps

- `MapDefinition` (ScriptableObject): spawn points, goal locations, wild spawn tables, objective timings
- `ArenaPrefab`: visual environment
- Collision mesh for terrain (walls block, low-walls block moves but not sight)

## Objectives

### Objective Controller

```csharp
public abstract class ObjectiveController {
    public float SpawnTime;
    public bool HasSpawned;
    public abstract void OnSpawn(SimState state);
    public abstract void OnKilledBy(Team team, SimState state);
}
```

Implementations:
- `DrednawController` — spawns at T-7:00, grants shield + speed buff
- `RotomController` — spawns at T-5:00, minion for killing team
- `ZapdosController` — spawns at T-2:00, grants instant dunks + 2x scoring

## Scoring

```csharp
public class ScoreService {
    public void Attempt(PokemonId id, GoalInstance goal);  // begin channel
    public void OnChannelComplete(PokemonId id, GoalInstance goal);
    public void OnChannelInterrupted(PokemonId id);
}
```

Dunking = timed channel; interrupts on damage (unless Held Item mitigates).

## View

- `View.MatchPresenter` — orchestrates view from sim events
- `View.PokemonView` — Pokémon GameObject with animator, moves, VFX
- `View.HealthBar` — HP + shield bar (above head)
- `View.ProjectileView` — pooled projectiles
- `View.UniteCinematic` — plays Unite Move casting animation
- `View.EvolutionAnimator` — plays evolution sequence
- `View.CameraController` — Cinemachine follow

## UI

- **HUD**: minimap, score, timer, move cooldowns, HP, XP, energy held
- **Pre-match panel**: Pokémon pick + item loadout
- **Victory screen**: MVP + stats
- **Item menu**: Held Item selection + upgrade

## Performance

- 10 Pokémon + ~20 wild + ~50 projectiles = 80 entities at peak
- Pool everything; Animator only for Pokémon (not wild)
- GPU instancing for wild Pokémon models
- URP with single-pass forward rendering on mobile
- **60 FPS target** on mid-range phones
- **30 FPS minimum** on low-end

## Common Unity Pitfalls

- **Physics raycast for attack targeting** → non-deterministic; use grid/overlap sphere in sim
- **Instantiate projectiles** → GC; pool aggressively
- **Animator Play per cast** → use direct tween + animation override
- **Unity audio spam** → channel-limit; 3D-spatial source pool
- **UI canvas over-rebuild** → isolate health bars from main HUD canvas

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Netcode Architecture](references/netcode-architecture.md)
