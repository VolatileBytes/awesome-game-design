# Effect System

Hearthstone has ~4000+ unique card effects. The system must let engineers and designers add new cards fast, keep effects isolated and testable, and resolve correctly in edge cases (chained triggers, damage cascades, deathrattles, auras).

## Design Goals

- **Data-driven**: most cards are ScriptableObject + a small effect script
- **Isolated**: each card's effect is testable on its own
- **Deterministic**: given the same inputs, always produce the same output
- **Extensible**: new keywords/mechanics shouldn't require rewriting the core

## Card Effect Base Class

```csharp
public abstract class CardEffect : ScriptableObject {
    // Minion lifecycle
    public virtual void OnBattlecry(SimContext ctx, MinionInstance self, TargetSpec target) { }
    public virtual void OnDeathrattle(SimContext ctx, MinionInstance self) { }
    public virtual void OnTurnStart(SimContext ctx, MinionInstance self) { }
    public virtual void OnTurnEnd(SimContext ctx, MinionInstance self) { }
    public virtual void OnAttack(SimContext ctx, MinionInstance self, CharacterInstance target) { }
    public virtual void OnDamageTaken(SimContext ctx, MinionInstance self, int damage, CharacterInstance source) { }

    // Spell lifecycle
    public virtual void OnSpellCast(SimContext ctx, SpellContext spell, TargetSpec target) { }

    // Trigger subscriptions
    public virtual void OnAnyCardPlayed(SimContext ctx, MinionInstance self, CardInstance played) { }
    public virtual void OnAnyMinionDied(SimContext ctx, MinionInstance self, MinionInstance died) { }
    public virtual void OnAnyDamageDealt(SimContext ctx, MinionInstance self, int damage, CharacterInstance source, CharacterInstance target) { }

    // Aura (applied to other minions/cards)
    public virtual int ModifyAttack(SimContext ctx, MinionInstance self, MinionInstance other, int currentAttack) => currentAttack;
    public virtual int ModifyHP(SimContext ctx, MinionInstance self, MinionInstance other, int currentHP) => currentHP;
    public virtual int ModifyCost(SimContext ctx, MinionInstance self, CardInstance other, int currentCost) => currentCost;
}
```

Each card's `CardDefinition.Effect` references a subclass. Most cards implement just 1–2 hooks.

## Example: Yeti (vanilla)

```csharp
// No effect, just stats. No CardEffect needed (Effect ref is null).
```

## Example: Flamestrike (spell)

"Deal 4 damage to all enemy minions."

```csharp
[CreateAssetMenu]
public class FlamestrikeEffect : CardEffect {
    public override void OnSpellCast(SimContext ctx, SpellContext spell, TargetSpec target) {
        var enemyBoard = ctx.State.Board(ctx.OpponentOf(spell.CasterId));
        foreach (var minion in enemyBoard.ToList()) {
            ctx.DealDamage(spell.CasterId, minion, 4);
        }
    }
}
```

## Example: Ragnaros the Firelord (minion)

"Can't attack. At the end of your turn, deal 8 damage to a random enemy."

```csharp
[CreateAssetMenu]
public class RagnarosEffect : CardEffect {
    public override void OnTurnEnd(SimContext ctx, MinionInstance self) {
        if (self.Owner != ctx.CurrentTurnPlayer) return;
        var enemies = ctx.State.GetAllEnemyCharacters(self.Owner);
        if (enemies.Count == 0) return;
        var target = enemies[ctx.Rng.Next(enemies.Count)];
        ctx.DealDamage(self, target, 8);
    }
}
```

## Example: Leeroy Jenkins (legendary)

"Battlecry: Summon two 1/1 Whelps for your opponent."

```csharp
[CreateAssetMenu]
public class LeeroyJenkinsEffect : CardEffect {
    [SerializeField] CardDefinition whelpDef;
    public override void OnBattlecry(SimContext ctx, MinionInstance self, TargetSpec target) {
        var opponent = ctx.OpponentOf(self.Owner);
        ctx.SummonMinion(whelpDef, opponent);
        ctx.SummonMinion(whelpDef, opponent);
    }
}
```

## Example: Ysera (legendary)

"At the end of your turn, add a Dream Card to your hand."

```csharp
[CreateAssetMenu]
public class YseraEffect : CardEffect {
    [SerializeField] List<CardDefinition> dreamCards;
    public override void OnTurnEnd(SimContext ctx, MinionInstance self) {
        if (self.Owner != ctx.CurrentTurnPlayer) return;
        var dream = dreamCards[ctx.Rng.Next(dreamCards.Count)];
        ctx.AddCardToHand(self.Owner, dream);
    }
}
```

## Event Subscription

For triggers that listen to "any event" (like "Whenever you cast a spell, draw a card"), cards register via hooks:

```csharp
public override void OnAnyCardPlayed(SimContext ctx, MinionInstance self, CardInstance played) {
    if (self.Owner != played.Owner) return;  // only own plays
    if (played.Type != CardType.Spell) return;
    ctx.DrawCard(self.Owner);
}
```

The sim's event dispatcher iterates over all minions with this hook and invokes in a deterministic order (board position: own minions left-to-right, then opponent's).

## Order of Operations

### Playing a Minion

1. Pay mana
2. Minion enters play (board slot chosen)
3. All **Battlecries** trigger in order: this minion's, then any chained effects
4. Other minions' **OnAnyCardPlayed** triggers fire (in board order)
5. Aura recalculation
6. Process any deaths (minions reduced to 0 HP)
7. Deathrattles fire in death order

### Casting a Spell

1. Pay mana
2. Spell target selected
3. **OnSpellCast** fires (main effect)
4. Other minions' **OnAnyCardPlayed** triggers (spells are cards)
5. Deaths processed
6. Deathrattles fire

### Attack

1. Attacker chosen (minion or hero)
2. Target chosen
3. **OnAttack** triggers for the attacker
4. Damage applied simultaneously (both take their opponent's attack value)
5. Deaths processed
6. Deathrattles fire

## Chained Triggers

Triggers can **cascade**: a deathrattle summons a minion, whose battlecry kills another, whose deathrattle does damage, etc.

The sim uses a **trigger queue**:

```csharp
public class TriggerQueue {
    Queue<Trigger> Pending;
    public void Enqueue(Trigger t) { Pending.Enqueue(t); }
    public void ProcessAll() {
        while (Pending.Count > 0) {
            var t = Pending.Dequeue();
            t.Execute(ctx);
            // New triggers from this execution are added to the end
        }
    }
}
```

**Cycle protection**: cap on depth (~30) — some cards design for infinite combos are legal but need a hard stop.

## Aura Calculation

Auras (e.g., "+1/+1 to other Beasts") are calculated **on-demand** when stats are read:

```csharp
public int GetEffectiveAttack(MinionInstance minion) {
    int atk = minion.BaseAttack;
    foreach (var m in State.Board(minion.Owner)) {
        if (m != minion && m.Effect != null) {
            atk = m.Effect.ModifyAttack(ctx, m, minion, atk);
        }
    }
    return atk;
}
```

Caching: invalidate when any minion enters/leaves the board.

## Silence Handling

"Silence" removes all effects from a minion. Implementation:

```csharp
public void Silence(MinionInstance m) {
    m.IsSilenced = true;
    // Recalculate stats without any auras/modifiers from this minion
}
```

Silenced minions keep their base stats but lose all keyword triggers, auras, deathrattles.

## Transform Handling

"Polymorph" transforms a minion into a Sheep. Old minion is replaced with a new `MinionInstance` of the Sheep def. Auras & triggers previously tied to the old minion no longer apply.

## Weapons

Weapons are a special card type:
- Equip = replace hero's weapon (destroy prior one, triggering deathrattle-like effects)
- Weapon has Attack + Durability
- Hero attacks consume 1 Durability
- Durability 0 = weapon breaks

## Discover

"Discover a spell" = present 3 random spells; player picks 1 → added to hand.

```csharp
public void Discover(PlayerId id, Predicate<CardDefinition> filter) {
    var options = ctx.AllCards.Where(filter).Random(3, ctx.Rng);
    ctx.SendDiscoverRequest(id, options);
    // Wait for player choice → add chosen card to hand
}
```

## Secret Cards

Secrets are spells that remain hidden until their trigger condition is met.

```csharp
public abstract class SecretEffect : CardEffect {
    public abstract bool ShouldTrigger(SimContext ctx, SimEvent evt);
    public abstract void OnTrigger(SimContext ctx, MinionInstance self);
}
```

Secrets sit in a special "secret zone" on the hero portrait; icons show but effect is hidden from opponent.

## Testing

```csharp
[Test]
public void Flamestrike_deals_4_damage_to_all_enemy_minions() {
    var state = TestState.With(
        new Minion("MyMinion", owner: PlayerA),
        new Minion("EnemyMinion1", owner: PlayerB, hp: 3),
        new Minion("EnemyMinion2", owner: PlayerB, hp: 5)
    );
    state.CastSpell(PlayerA, "Flamestrike", target: null);
    Assert.IsNull(state.Find("MyMinion") == null);  // should still exist
    Assert.IsNull(state.Find("EnemyMinion1"));  // dead (3 HP - 4 dmg)
    Assert.AreEqual(1, state.Find("EnemyMinion2").HP);  // 5 - 4 = 1
}
```

Each card has at least one effect test. Automated regression against released cards.

## Designer Workflow

1. **Pitch** card in doc
2. **Add** CardDefinition asset + art
3. **Write** effect script (or reuse a shared effect)
4. **Test** in a sandbox match
5. **Playtest** internally
6. **Balance tweak** pre-release

Most cards are < 30 lines of code. Shared effects (e.g., "deal N damage to target") are reusable across many cards.

## Anti-Patterns

- **Effect stored on MonoBehaviour**: non-deterministic, breaks replays
- **Effect with side-effects on Unity APIs**: never call SceneManager, Resources, etc. from a CardEffect
- **Unbounded recursion**: always have a depth guard
- **Static state in effect classes**: per-match state must live in SimContext
- **Effect-order bugs**: ensure deterministic iteration of boards (left-to-right, own-first)
