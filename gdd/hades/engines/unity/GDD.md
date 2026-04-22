---
id: hades
title: Hades — Unity Implementation
version: 0.1.0
description: Unity-specific implementation overlay for Hades — isometric 2D action roguelite with Boon-driven build variance and dynamic VO-driven narrative.
tags: [unity, action, roguelike, isometric-2d]
---

# Hades — Unity Implementation

Engine overlay for Hades. See [base GDD](../../GDD.md).

> Original game uses Supergiant's proprietary **SGE** engine (C# + custom 2D). Unity 2022.3 LTS is a reasonable rebuild target for cross-platform reach.

## Target

- **Unity**: 2022.3 LTS
- **Render pipeline**: URP 2D (sprite-lit for character/background layers)
- **Input**: New Input System (gamepad primary, K+M supported)
- **Platforms**: PC, Mac, Switch, iOS, Android, Steam Deck
- **Networking**: none

## Packages

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP 2D |
| `com.unity.inputsystem` | Input |
| `com.unity.textmeshpro` | Tooltips, captions |
| `com.unity.addressables` | Character/VO/background loading |
| `com.unity.localization` | 12-language strings + VO routing |
| `com.unity.cinemachine` | 2D room camera |
| `com.unity.2d.animation` | Zagreus rig + enemy rigs |

Third-party:
- **FMOD Studio** — audio middleware (VO triggers, dynamic music).
- **DOTween Pro** — UI tweens.
- **Newtonsoft.Json** — save files.

## Core Architecture

### Sim / View / Narrative Split

- **`Sim.CombatState`** — pure per-run data: HP, obol, Boons, current room.
- **`Sim.CombatSim`** — room logic, damage, AI ticking. Deterministic given seed.
- **`View.CombatView`** — Unity MonoBehaviours rendering sim state.
- **`Narrative.DialogueEngine`** — queue system (see narrative-system.md).

Sim is 60 Hz fixed tick. View syncs to sim on each tick; interpolates between ticks.

### Data-Driven Content

Everything is ScriptableObjects:

```csharp
[CreateAssetMenu(menuName = "Hades/Weapon")]
public class WeaponDefinition : ScriptableObject {
    public string Id;
    public List<AspectDefinition> Aspects;
    public ComboDefinition Combo;
    public SpecialDefinition Special;
    public CastDefinition Cast;
    public DashStrikeDefinition DashStrike;
}

[CreateAssetMenu(menuName = "Hades/Boon")]
public class BoonDefinition : ScriptableObject {
    public string Id;
    public GodId God;
    public BoonSlot Slot;
    public Rarity Rarity;
    public List<BoonRef> DuoPrereqs;
    public EffectNode Effect;       // shared effect graph
    public float[] TierValues;      // per-Pom level
}

[CreateAssetMenu(menuName = "Hades/Enemy")]
public class EnemyDefinition : ScriptableObject {
    public string Id;
    public int MaxHP;
    public float Speed;
    public List<AttackPattern> Attacks;
    public IAIDefinition AI;
    public Sprite Sprite;
    public EnemyKind Kind;   // Normal, Armored, Elite, Miniboss, Boss
}
```

### Effect Graph

Boons share the effect node system from Slay the Spire / Balatro GDDs:

```csharp
public abstract class EffectNode : ScriptableObject {
    public abstract void Execute(EffectContext ctx);
}

public class DealDamageNode : EffectNode { public float Damage; public DamageType Type; }
public class ApplyStatusNode : EffectNode { public StatusId Status; public int Stacks; public float Duration; }
public class SpawnProjectileNode : EffectNode { public ProjectileDefinition Proj; }
public class ForEachHitNode : EffectNode { public EffectNode PerHit; }
public class WithProbabilityNode : EffectNode { public float Chance; public EffectNode Effect; }
public class GrantTempStatNode : EffectNode { public StatId Stat; public float Value; public float Duration; }
```

Boons subscribe to events: `OnAttackHit`, `OnDashStrike`, `OnCastDetonate`, `OnRoomStart`, `OnTakeDamage`.

### Deterministic RNG

```csharp
public class SimRandom {
    public SimRandom ForStream(string name);  // "rooms", "boons", "drops", "npc_dialog"
    public uint Next();
    public int Range(int min, int max);
    public T PickWeighted<T>(IReadOnlyList<(T item, float weight)> options);
}
```

Streams isolated so rerolling a Boon doesn't shift other RNG chains.

## Scenes

```
Boot.unity           # loads data tables, save
MainMenu.unity
House.unity          # hub
Combat.unity         # persistent combat scene; rooms swap via additive loading
GameOver.unity       # brief, transitions to House
```

Combat is a **single scene** — rooms are prefab chunks loaded/unloaded as you move. This keeps transitions seamless.

## Room Streaming

Rooms are addressable prefabs. Workflow:

1. On entering a region, precache the next 3 possible room prefabs.
2. When current room cleared, pick next room via seeded roll.
3. Animate camera + door transition; despawn old room after fade.

Rooms are small (fits on screen), ~80 base templates per region × 4 regions = ~320 prefabs.

## Project Layout

```
Assets/
  _Project/
    Art/
      Zag/
      Enemies/
      Bosses/
      Gods/
      Portraits/         # dialog camera shots
      VFX/
      UI/
    Audio/
      VO/                # FMOD banks per NPC
      SFX/
      Music/
    Data/
      Weapons/
      Boons/             # ~350 Boon SOs
      Enemies/
      Rooms/             # room prefab manifests
      NPCs/
      Dialogue/          # CSV → SOs
      Keepsakes/
      MirrorNodes/
      PactHeatOptions/
    Prefabs/
      Rooms/
      EnemyPrefabs/
      ProjectilePool/
    Scenes/
    Scripts/
      Sim/
      View/
      Narrative/
      UI/
      Input/
      Save/
      Meta/
```

## Enemy AI

Per the base GDD, AI is explicit behavior — no NavMesh. Each enemy is a state machine:

```csharp
public interface IAIDefinition {
    IEnemyAI Instantiate();
}
public interface IEnemyAI {
    void Tick(EnemyState self, CombatState combat, float dt);
}
```

Typical state machine:
- **Idle** → chase if player in range
- **Windup** → telegraph attack (0.4–0.8s)
- **Attack** → fire pattern
- **Recover** → vulnerable
- **Stagger** → hit interrupted

Pathfinding inside rooms uses **grid-based A*** over a pre-baked navigation grid per room prefab.

## Combat Loop Pseudocode

```csharp
// 60Hz fixed update
void SimTick(float dt) {
    combatState.Player.Tick(dt);
    foreach (var e in combatState.Enemies) e.Tick(dt, combatState);
    combatState.ProjectilePool.Tick(dt);
    ResolveCollisions();
    ResolveDamageQueue();
    PruneDead();
    TickStatuses(dt);
    BoonEventBus.FlushFrame();
}
```

## Boon Event Bus

```csharp
public class BoonEventBus {
    public void Fire(BoonEvent evt);
    public void Subscribe(BoonEventType type, Action<BoonEvent> handler);
}
```

Each active Boon registers handlers at run start, unregisters at run end. Events include:
- `AttackLanded(source, target, damage)`
- `SpecialLanded(...)`
- `CastLanded(...)`
- `DashStrikeLanded(...)`
- `EnemyKilled(...)`
- `TookDamage(amount, source)`
- `RoomEntered(roomId)`

This keeps Boon logic **declarative** — a Boon is a subscription + effect graph.

## Dialogue Integration

See [narrative-system.md](../../references/narrative-system.md). Unity integration:

- NPCs in House scene have `NpcInteractable` component subscribed to `DialogueEngine.QueryLine(npcId)`.
- FMOD event for voice clip (FMOD tracks the play state; Unity just fires the event).
- Captions rendered via TextMeshPro with localized string tokens.

## Save / Load

JSON + Newtonsoft.Json:

```csharp
public class SaveData {
    public ProfileData Profile;         // permanent unlocks, relationships
    public RunSnapshot CurrentRun;      // in-progress run, nullable
}
public class RunSnapshot {
    public string Seed;
    public string WeaponId, AspectId;
    public int CurrentRoomIndex;
    public int HP, MaxHP, Obol;
    public List<BoonSnapshot> Boons;
    public List<DialogueState> DialogueQueueStates;
    // ...
}
```

Auto-save on room entry. Full backup on escape completion.

## Performance Budgets

- **Target**: 60fps on Steam Deck, iPhone 11, Switch handheld.
- **Max active enemies per room**: ~15 (rare; most rooms 3–8).
- **Max active VFX**: 30.
- **Projectile pool size**: 200.
- **Sprite atlases**: per-region to keep texture memory < 512MB.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Boon Effect Graph](references/boon-effect-graph.md)
