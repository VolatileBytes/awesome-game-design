---
id: risk-of-rain-2
title: Risk of Rain 2 — Unity Implementation
version: 0.1.0
description: Unity-specific implementation overlay for Risk of Rain 2 — third-person 3D roguelike shooter with 200+ stacking items, scaling difficulty timer, 4-player co-op.
tags: [unity, shooter, third-person, 3d, roguelike, co-op]
---

# Risk of Rain 2 — Unity Implementation

Engine overlay for Risk of Rain 2. See [base GDD](../../GDD.md).

> Original game is built in Unity (Hopoo Games). This doc is a fresh-rebuild spec assuming Unity 2022.3 LTS + modern URP.

## Target

- **Unity**: 2022.3 LTS
- **Render pipeline**: URP 3D (Forward+ renderer for many dynamic lights).
- **Input**: New Input System.
- **Networking**: Mirror (or Netcode for GameObjects).
- **Platforms**: PC, Mac, PS5, Xbox, Switch (mobile out of scope for MVP).
- **Target fps**: 60.

## Packages

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP 3D |
| `com.unity.inputsystem` | Input |
| `com.unity.addressables` | Stage / asset streaming |
| `com.unity.textmeshpro` | UI |
| `com.unity.cinemachine` | Third-person follow + aim |
| `com.unity.netcode.gameobjects` | Multiplayer |
| `com.unity.localization` | i18n |

Third-party:
- **Mirror** (alternate NGO) — proven in Risk of Rain 2's space.
- **FMOD Studio** — dynamic music/sfx.
- **ProBuilder** — stage gray-box authoring.
- **DOTween Pro** — UI tweens.

## Core Architecture

### Server-Authoritative Sim

Multiplayer makes determinism critical. Design principles:
- **Server owns the truth** for enemy state, damage, item drops, teleporter progress.
- **Client prediction** for local player position + camera.
- **Event-based replication**: item pickups, damage, deaths, teleporter events broadcast via RPC.
- **Seed synced at run start** — used for drop rolls on server.

### Tick Rate

- **Simulation tick**: 30Hz (sufficient for third-person shooting).
- **Render tick**: 60fps (interpolate between sim ticks).
- **Input tick**: per-frame (buffered, flushed at sim tick).

### Data-Driven Content

```csharp
[CreateAssetMenu(menuName = "RoR2/Survivor")]
public class SurvivorDefinition : ScriptableObject {
    public string Id;
    public GameObject PlayerPrefab;
    public SkillSlot Primary, Secondary, Utility, Special;
    public List<SkillAltDefinition> Alts;
    public int BaseHP;
    public float BaseSpeed;
    public UnlockCondition Unlock;
}

[CreateAssetMenu(menuName = "RoR2/Item")]
public class ItemDefinition : ScriptableObject {
    public string Id;
    public ItemTier Tier;
    public ItemCategory Category;
    public bool Stackable;
    public float[] PerStackEffect;
    public List<TriggerHook> Triggers;
    public EffectGraph Effect;
    public Mesh InventoryIcon;
}

[CreateAssetMenu(menuName = "RoR2/Enemy")]
public class EnemyDefinition : ScriptableObject {
    public string Id;
    public GameObject Prefab;
    public int BaseHP;
    public float BaseDamage;
    public float HPScalePerLevel = 0.3f;
    public float DMGScalePerLevel = 0.2f;
    public List<AttackPattern> Attacks;
    public IAIDefinition AI;
}
```

### Effect Graph (shared pattern)

Items/skills/equipment share the effect node pattern from Slay the Spire / Balatro / Hades GDDs:

```csharp
public abstract class EffectNode : ScriptableObject {
    public abstract void Execute(EffectContext ctx);
}

public class DealDamageNode : EffectNode { /* ... */ }
public class SpawnProjectileNode : EffectNode { /* ... */ }
public class ApplyStatusNode : EffectNode { /* ... */ }
public class ForEachEnemyInRadiusNode : EffectNode { /* ... */ }
public class WithProcCoefficientNode : EffectNode { /* ... */ }
```

**Proc coefficient** is crucial — it's the multiplier for chance-based items (Ukelele, Ceremonial Dagger). Every hit has a proc coefficient; 1.0 = full chance, 0.5 = half, 0 = no triggers.

## Project Layout

```
Assets/
  _Project/
    Art/
      Survivors/
      Enemies/
      Items/
      Bosses/
      Stages/
      VFX/
      UI/
    Audio/
      SFX/
      Music/
    Data/
      Survivors/
      Items/            # ~200 SOs
      Equipment/
      Enemies/
      Stages/
      Elites/
      Artifacts/
    Prefabs/
      PlayerPrefabs/    # per-survivor
      EnemyPrefabs/
      ProjectilePool/
      StageSet/         # stage-specific props
    Stages/             # stage scenes as Addressables
      TitanicPlains.unity
      DistantRoost.unity
      ...
    Scenes/
      Boot.unity
      Title.unity
      Lobby.unity       # multiplayer lobby
      Run.unity         # persistent; stages load additively
    Scripts/
      Sim/
      Net/
      View/
      UI/
      Input/
      Meta/
      Save/
```

## Stage Streaming

Stages are full Unity scenes loaded additively. On stage complete:
- Teleport all players to new stage's spawn.
- Unload old stage (GC cleanup).
- Respawn chest/shrine/teleporter/drone prefabs based on stage config.

## Enemy AI

Behavior trees (custom) or MonoBehaviour state machines per enemy type:

```csharp
public class LemurianBrain : MonoBehaviour, IEnemyAI {
    enum State { Wander, Chase, Attack, Retreat, Fireball }
    private State _state;

    public void Tick(CombatContext ctx) {
        switch (_state) {
            case State.Wander: /* ... */ break;
            case State.Chase: /* ... */ break;
            // ...
        }
    }
}
```

Larger enemies (bosses, titans) may have scripted attack phases.

## Networking

### Replication strategy

- **Player position**: client-authoritative with server reconciliation (laggy enemy shots are OK; laggy movement is not).
- **Enemy state**: server-authoritative.
- **Damage**: server-authoritative; client shows predicted hitfx but damage number arrives from server.
- **Item pickups**: server-authoritative; client sees the chest open via RPC.
- **Teleporter state**: synced via NetworkVariable.

### Proc chain determinism

Proc items trigger with `SimRandom` seeded per-shot. Server rolls; client shows effects.

## Performance Budgets

- **Active enemies at peak**: 80 (teleporter event on monsoon loop 2).
- **Projectile pool**: 500.
- **Item VFX pool**: ~30 simultaneous.
- **Draw calls**: < 3000 per frame.
- **Memory**: < 8GB RAM for 4-player session.

## Save / Profile

Per-profile permanent data:

```csharp
public class ProfileData {
    public List<string> UnlockedSurvivors;
    public List<string> UnlockedItems;
    public Dictionary<string, List<string>> UnlockedAlts;  // survivor → alt ids
    public List<string> CompletedChallenges;
    public int LunarCoins;
    public Dictionary<string, int> EclipseLevels;          // survivor → max E tier beaten
    public Dictionary<string, EnemyLogbookEntry> Logbook;
    public RunStatistics LifetimeStats;
}
```

Per-run state is server-side memory; not saved (no mid-run save, runs are quick).

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Item System](../../references/item-system.md)
