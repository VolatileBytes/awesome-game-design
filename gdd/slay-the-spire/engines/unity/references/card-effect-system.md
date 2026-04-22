# Card Effect System — Unity

The effect system turns cards from hardcoded functions into data-authored graphs. New cards ship as ScriptableObjects, not new code.

## Why a Graph

With 75+ cards per character × 4 characters × 4 rarities × keywords, hardcoding per-card logic produces a maintenance nightmare. A graph-based effect system lets designers compose:

```
Bash = DealDamage(8) → ApplyStatus(Vulnerable, 2)
Iron Wave = DealDamage(5) → GainBlock(5)
Bludgeon = DealDamage(32)
Whirlwind = Loop(X) { DealDamageAll(5) }
```

Each node is reused across dozens of cards.

## Effect Node Base

```csharp
[CreateAssetMenu(menuName = "Spire/Effects/...")]
public abstract class EffectNode : ScriptableObject {
    public abstract IEnumerable<CombatEvent> Execute(EffectContext ctx);
}

public class EffectContext {
    public CombatState State;
    public CardInstance SourceCard;
    public EnemyState Target;       // null if non-targeted
    public SimRandom Rng;
    public int UpgradeLevel;        // 0 = normal, 1 = upgraded
}
```

## Concrete Nodes

### Damage

```csharp
[CreateAssetMenu(menuName = "Spire/Effects/Damage")]
public class DealDamageEffect : EffectNode {
    public int Amount;
    public int UpgradedAmount;
    public TargetKind Target = TargetKind.ChosenEnemy;  // ChosenEnemy, AllEnemies, RandomEnemy, Self

    public override IEnumerable<CombatEvent> Execute(EffectContext ctx) {
        var amt = ctx.UpgradeLevel > 0 ? UpgradedAmount : Amount;
        // Apply strength, weak, vulnerable
        amt = DamageFormula.Compute(ctx.State.Player, ctx.Target, amt);

        foreach (var target in ResolveTargets(ctx))
            yield return ApplyDamage(target, amt);
    }
}
```

### Block

```csharp
[CreateAssetMenu(menuName = "Spire/Effects/Block")]
public class GainBlockEffect : EffectNode {
    public int Amount;
    public int UpgradedAmount;

    public override IEnumerable<CombatEvent> Execute(EffectContext ctx) {
        var amt = ctx.UpgradeLevel > 0 ? UpgradedAmount : Amount;
        amt = BlockFormula.Compute(ctx.State.Player, amt);   // dexterity, frail
        ctx.State.Player.Block += amt;
        yield return new BlockGained(amt);
    }
}
```

### Status

```csharp
[CreateAssetMenu(menuName = "Spire/Effects/Status")]
public class ApplyStatusEffect : EffectNode {
    public StatusType Status;       // Vulnerable, Weak, Poison, Strength, etc.
    public int Stacks;
    public int UpgradedStacks;
    public TargetKind Target;

    public override IEnumerable<CombatEvent> Execute(EffectContext ctx) {
        var stacks = ctx.UpgradeLevel > 0 ? UpgradedStacks : Stacks;
        foreach (var target in ResolveTargets(ctx)) {
            target.Statuses[Status] = (target.Statuses.TryGetValue(Status, out var s) ? s : 0) + stacks;
            yield return new StatusApplied(target, Status, stacks);
        }
    }
}
```

### Draw

```csharp
public class DrawCardsEffect : EffectNode {
    public int Amount;
    public int UpgradedAmount;

    public override IEnumerable<CombatEvent> Execute(EffectContext ctx) {
        var n = ctx.UpgradeLevel > 0 ? UpgradedAmount : Amount;
        for (int i = 0; i < n; i++) {
            var card = DrawCardFromPile(ctx.State);
            if (card == null) break;
            yield return new CardDrawn(card);
        }
    }
}
```

### Energy

```csharp
public class GainEnergyEffect : EffectNode {
    public int Amount;
    public override IEnumerable<CombatEvent> Execute(EffectContext ctx) {
        ctx.State.Energy += Amount;
        yield return new EnergyGained(Amount);
    }
}
```

### Exhaust / Discard self

```csharp
public class ExhaustSelfEffect : EffectNode { ... }
public class DiscardRandomEffect : EffectNode { public int Count; ... }
```

### Iteration

```csharp
public class ForEachOrbEffect : EffectNode {
    public EffectNode Body;
    public override IEnumerable<CombatEvent> Execute(EffectContext ctx) {
        foreach (var orb in ctx.State.Player.Orbs)
            foreach (var ev in Body.Execute(ctx.WithOrbContext(orb)))
                yield return ev;
    }
}

public class RepeatEffect : EffectNode {
    public int Count;
    public EffectNode Body;
    // ...
}
```

### Conditional

```csharp
public class IfEffect : EffectNode {
    public Condition Condition;     // e.g. HpBelowThreshold, HasStatus
    public EffectNode Then;
    public EffectNode Else;
}
```

## Composition: Full Card Example

### Bash (Ironclad starter)

```
CardDefinition "Bash"
  Cost: 2
  Effect:
    Sequence:
      - DealDamage { Amount: 8, UpgradedAmount: 10, Target: ChosenEnemy }
      - ApplyStatus { Status: Vulnerable, Stacks: 2, UpgradedStacks: 3, Target: ChosenEnemy }
```

### Whirlwind (Ironclad, X-cost)

```
CardDefinition "Whirlwind"
  Cost: -1  // X = all remaining energy
  Effect:
    ForEachEnergy:
      Body:
        DealDamageAll { Amount: 5, UpgradedAmount: 8 }
```

### Catalyst (Silent)

```
CardDefinition "Catalyst"
  Cost: 1
  Effect:
    Custom:
      // Double poison on target; upgrade triples
      ctx.Target.Statuses[Poison] *= (UpgradeLevel > 0 ? 3 : 2);
```

Not every card fits the graph cleanly — edge cases get small custom nodes (one class per oddball card). Target: ~90% graph-composed, ~10% custom.

## Sequencing in View

The Sim returns `IEnumerable<CombatEvent>`. The View plays them with a coroutine:

```csharp
async UniTask PlayEventStream(IEnumerable<CombatEvent> events) {
    foreach (var ev in events) {
        switch (ev) {
            case DamageDealt d:
                await PlayDamageAnim(d.Target, d.Amount);
                break;
            case StatusApplied s:
                await PlayStatusAnim(s.Target, s.Status, s.Stacks);
                break;
            case CardDrawn c:
                await PlayDrawAnim(c.Card);
                break;
            // ...
        }
    }
}
```

Each event pauses the next by its animation duration. For fast-play mode, reduce durations or batch events.

## Relic Hooks

Relics modify the effect pipeline via pre/post hooks:

```csharp
public interface IRelic {
    void OnCombatStart(CombatState state) { }
    void OnCardPlayed(CardInstance card, CombatState state) { }
    void OnDamageDealt(ref int amount, CombatState state) { }
    void OnDamageTaken(ref int amount, CombatState state) { }
    void OnTurnStart(CombatState state) { }
    void OnTurnEnd(CombatState state) { }
}
```

Example: **Vajra** — "At combat start, gain 1 Strength."

```csharp
public class VajraRelic : IRelic {
    public void OnCombatStart(CombatState state) {
        state.Player.Statuses[StatusType.Strength] =
            state.Player.Statuses.GetValueOrDefault(StatusType.Strength) + 1;
    }
}
```

Relics are ScriptableObjects + (when needed) small script classes. Simple stat-change relics can be data-only; conditional relics get code.

## Testing

Effect graphs are unit-testable without Unity:

```csharp
[Test]
public void Bash_DealsDamage_AppliesVulnerable() {
    var combat = CombatStateBuilder.Fresh()
        .WithEnemy(hp: 50)
        .Build();

    var bash = Cards.Bash.Instance();
    var events = combat.PlayCard(bash, combat.Enemies[0]).ToList();

    Assert.That(combat.Enemies[0].CurrentHP, Is.EqualTo(42));
    Assert.That(combat.Enemies[0].Statuses[Vulnerable], Is.EqualTo(2));
    Assert.That(events, Has.One.TypeOf<DamageDealt>());
    Assert.That(events, Has.One.TypeOf<StatusApplied>());
}
```

Coverage target: every card, every relic, every status, every boss AI path.

## Modding

Expose the ScriptableObject pipeline via AssetBundles:
- Modder creates `MyCard.asset` referencing stock EffectNodes (or their own custom nodes in a .dll).
- Game discovers mod bundles in `Mods/` folder, appends card defs to character pools.

Follows original game's proven mod pattern.
