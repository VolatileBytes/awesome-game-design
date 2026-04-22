# Boon Effect Graph — Unity

Boons in Hades are not hardcoded. Each one subscribes to a combat event and executes an effect graph. This is the same pattern as card effects in Slay the Spire / Balatro.

## Subscription Model

Every Boon has a **trigger** (when) and an **effect graph** (what).

```csharp
public class BoonInstance {
    public BoonDefinition Def;
    public int Tier;              // 1..10 from Pom of Power

    public void Bind(BoonEventBus bus, CombatState state) {
        foreach (var trigger in Def.Triggers)
            trigger.Subscribe(bus, state, this);
    }

    public void Unbind(BoonEventBus bus) {
        foreach (var trigger in Def.Triggers)
            trigger.Unsubscribe(bus);
    }
}
```

## Event Bus

```csharp
public enum BoonEventType {
    OnAttackHit, OnSpecialHit, OnCastHit, OnDashStrikeHit,
    OnDashThrough, OnEnemyKilled, OnTakeDamage, OnRoomStart, OnRoomCleared,
    OnBoonAcquired, OnProjectileFired, PerSecond
}

public class BoonEvent {
    public BoonEventType Type;
    public PlayerState Player;
    public EnemyState Target;
    public float Damage;
    public DamageType DamageType;
    public object Payload;  // polymorphic
}

public class BoonEventBus {
    private Dictionary<BoonEventType, List<Action<BoonEvent>>> _handlers = new();
    public void Subscribe(BoonEventType type, Action<BoonEvent> h) { ... }
    public void Unsubscribe(BoonEventType type, Action<BoonEvent> h) { ... }
    public void Fire(BoonEvent evt) {
        if (_handlers.TryGetValue(evt.Type, out var list))
            foreach (var h in list) h(evt);
    }
}
```

## Trigger Types

Each Boon references one or more **trigger definitions**:

```csharp
[CreateAssetMenu(menuName = "Hades/Trigger/OnAttackHit")]
public class OnAttackHitTrigger : TriggerDefinition {
    public EffectNode Effect;
    public TargetFilter Filter;  // e.g. "only diamond-shaped enemies"
    public override void Subscribe(BoonEventBus bus, CombatState state, BoonInstance boon) { ... }
}
```

Common triggers:
- `OnAttackHitTrigger` — when Zag's attack hits an enemy.
- `OnDashStrikeTrigger` — dash-strike specifically.
- `OnRoomStartTrigger` — beginning of each room.
- `OnEnemyKilledTrigger` — kill event.
- `OnTakeDamageTrigger` — defensive/reactive Boons.
- `PerSecondTrigger` — ticking (Fiery Presence's kill-streak).

## Effect Nodes

Shared with cards / Jokers (see Slay the Spire / Balatro GDDs for base pattern).

### Damage

```csharp
[CreateAssetMenu(menuName = "Hades/Effect/DealDamage")]
public class DealDamageEffect : EffectNode {
    public FloatExpr Amount;            // supports formulas like "tier * 15"
    public DamageType Type;
    public TargetKind Target;           // Triggering, Nearby, All, Self

    public override void Execute(EffectContext ctx) {
        foreach (var t in ctx.ResolveTargets(Target)) {
            var dmg = Amount.Evaluate(ctx);
            ctx.Combat.DamageSystem.Queue(ctx.Source, t, dmg, Type);
        }
    }
}
```

### Apply Status

```csharp
public class ApplyStatusEffect : EffectNode {
    public StatusId Status;
    public IntExpr Stacks;
    public FloatExpr Duration;
    public override void Execute(EffectContext ctx) { ... }
}
```

### Spawn Projectile

```csharp
public class SpawnProjectileEffect : EffectNode {
    public ProjectileDefinition Proj;
    public Vec2Expr Direction;
    public FloatExpr Speed;
    public override void Execute(EffectContext ctx) { ... }
}
```

### Temp Stat Buff

```csharp
public class GrantTempStatEffect : EffectNode {
    public StatId Stat;              // Damage, MoveSpeed, DashCooldown
    public FloatExpr Value;
    public FloatExpr Duration;
    public StackingMode Mode;        // Stack, Refresh, ReplaceIfHigher
}
```

### Conditional

```csharp
public class WithConditionEffect : EffectNode {
    public ConditionNode Condition;  // HpBelow, EnemyHasStatus, IsCrit
    public EffectNode Then, Else;
}
```

### Sequence

```csharp
public class SequenceEffect : EffectNode {
    public List<EffectNode> Steps;
}
```

### Chance Roll

```csharp
public class WithProbabilityEffect : EffectNode {
    public FloatExpr Chance;        // 0..1
    public EffectNode OnSuccess, OnFailure;
    // uses SimRandom stream "boons"
}
```

## Full Boon Example

### Zeus — Lightning Strike (Attack)

```
BoonDefinition "Lightning Strike"
  god: Zeus
  slot: Attack
  rarity: Common
  tierValues: [24, 32, 40, 48, 56, 64, 72, 80, 90, 100]   // damage per tier
  triggers:
    - OnAttackHit:
        effect:
          Sequence:
            - ApplyStatus { status: Jolted, duration: 4 }
            - ChainLightning { from: target, chains: 3, dmgExpr: "tier * 0.5" }
```

### Zeus — Heaven's Vengeance (Legendary)

```
BoonDefinition "Heaven's Vengeance"
  god: Zeus
  rarity: Legendary
  prereqs: [ZeusEpicAny]
  triggers:
    - OnTakeDamage:
        effect:
          IncrementCounter { key: "hits_taken" }
    - WithCondition { condition: CounterAtLeast("hits_taken", 5),
        then:
          Sequence:
            - ResetCounter { key: "hits_taken" }
            - SpawnAoE { radius: 4, damage: "tier * 100", type: Shock } }
```

### Athena — Divine Dash (Dash)

```
BoonDefinition "Divine Dash"
  god: Athena
  slot: Dash
  triggers:
    - OnDashStart:
        effect: GrantTempStat { stat: DeflectProjectiles, value: 1, duration: 0.25 }
```

## Tier Values

Boons scale linearly with Pom level (cap ~10). Each tier adds a fixed delta stored in the SO. Formula is `base + (tier - 1) * delta`, or for xmult Boons, `base * pow(multiplier, tier - 1)`.

For cleaner design, SOs store the **full array**:

```
tierValues: [24, 32, 40, 48, 56, 64, 72, 80, 90, 100]
```

Designers can tune each tier individually; no magic formula.

## Expressions (FloatExpr)

Small scripting DSL to reference runtime context:

```
"tier * 15"
"base * (1 + weak_stacks * 0.1)"
"enemy.hp_percent < 0.3 ? 100 : 50"
```

Pre-compiled at load into a callable delegate. Use **expression trees** (System.Linq.Expressions) or hand-rolled parser.

## Duo Boon Resolution

At Boon offer time:

```csharp
BoonOffer GenerateOffer(GodId god, CombatState state) {
    var pool = GetBoonPool(god);
    // Filter by owned prereqs
    var validDuos = pool.Where(b => b.IsDuo && AllPrereqsMet(b, state.OwnedBoons));
    var weighted = new WeightedList();
    weighted.AddRange(pool.Where(b => !b.IsDuo), commonWeights);
    weighted.AddRange(validDuos, duoChance: 0.1f);
    return weighted.PickN(3, state.Rng.ForStream("boons"));
}
```

Duo appearance chance boosts when the god sees its prereqs satisfied.

## Unity-Specific Notes

- **Effect graphs are ScriptableObjects** — workflow: right-click Project → Create → Hades → Effect → ...
- **Composite SOs**: a single Boon SO references a tree of EffectNode SOs. Use Unity's **sub-asset** system to bundle graphs into one .asset file for cleanliness.
- **Hot reload**: in editor, changing an effect SO should re-bind Boons in the next frame for iteration.

## Testing Pattern

```csharp
[Test]
public void LightningStrike_Applied_DealsShockDamageAndJolts() {
    var state = CombatStateBuilder.Fresh()
        .WithEnemy(hp: 100)
        .WithBoon(Boons.LightningStrike.Tier(1))
        .Build();

    state.PlayerAttack(state.Enemies[0]);

    var enemy = state.Enemies[0];
    // Base attack damage + Lightning Strike triggered amount
    Assert.AreEqual(baseDmg + 24, 100 - enemy.HP);
    Assert.That(enemy.Statuses[StatusId.Jolted], Is.GreaterThan(0));
}
```

Coverage target: every Boon × at least one hit scenario. ~300 tests.

## Performance

- Event-bus subscription count is small (≤ 20 Boons × ≤ 2 triggers each = 40 subs).
- No per-frame allocation: pool `BoonEvent` structs.
- Effect graph execution: depth ≤ 5 in practice. No recursion danger.

## Modding

Effect nodes as SOs + AssetBundle pattern means modders can compose new Boons without code. Exotic mechanics need custom EffectNode subclasses in a .dll — same pattern as Slay the Spire / Balatro.
