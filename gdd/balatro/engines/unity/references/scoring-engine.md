# Scoring Engine — Unity

The scoring pipeline is the heart of Balatro. Every Joker, enhancement, edition, and seal plugs into a single event-driven executor.

## Pipeline Order

```
1. Evaluate hand type (which 5 cards score)
2. Apply base chips/mult from HandTypeTable + hand level
3. For each SCORING card (left to right):
    a. Add rank chips
    b. Card's enhancement trigger
    c. Card's edition trigger
    d. Card's seal trigger
    e. Retrigger hooks (red seal, Hack, Dusk, etc.)
    f. "OnCardScored" Jokers (L→R) — Greedy, Lusty, Scholar, Even Steven, etc.
4. For each HELD card in hand:
    a. "OnHeld" enhancement triggers (Steel ×1.5 mult)
    b. "OnHeld" Jokers (Mime retriggers, etc.)
5. For each Joker (L→R):
    a. Independent effect (flat +chips/+mult/×mult/conditional check)
6. Multiply: final = chips * mult
```

Every step is an event emitted for the View to animate.

## Core Types

```csharp
public class EffectContext {
    public RunState Run;
    public ScoringState Scoring;        // mutable: accumulates chips + mult
    public CardInstance CurrentCard;    // non-null during steps 3 and 4
    public JokerInstance CurrentJoker;  // non-null during step 5
    public List<CardInstance> ScoringCards;
    public List<CardInstance> FullPlayedHand;
    public List<CardInstance> HeldCards;
    public SimRandom Rng;
}

public class ScoringState {
    public double Chips;
    public double Mult;
    public int RetriggerCounter;  // for nested retriggers
}
```

## Effect Node Base

```csharp
public abstract class EffectNode : ScriptableObject {
    public abstract IEnumerable<ScoreEvent> Execute(EffectContext ctx);
}
```

## Concrete Nodes

### Add Chips

```csharp
[CreateAssetMenu(menuName = "Balatro/Effect/AddChips")]
public class AddChipsEffect : EffectNode {
    public double Amount;
    public override IEnumerable<ScoreEvent> Execute(EffectContext ctx) {
        ctx.Scoring.Chips += Amount;
        yield return new ChipsAdded(Amount, ctx.CurrentCard, ctx.CurrentJoker);
    }
}
```

### Add Mult

```csharp
[CreateAssetMenu(menuName = "Balatro/Effect/AddMult")]
public class AddMultEffect : EffectNode {
    public double Amount;
    public override IEnumerable<ScoreEvent> Execute(EffectContext ctx) {
        ctx.Scoring.Mult += Amount;
        yield return new MultAdded(Amount, ctx.CurrentCard, ctx.CurrentJoker);
    }
}
```

### xMult

```csharp
[CreateAssetMenu(menuName = "Balatro/Effect/XMult")]
public class XMultEffect : EffectNode {
    public double Factor;
    public override IEnumerable<ScoreEvent> Execute(EffectContext ctx) {
        ctx.Scoring.Mult *= Factor;
        yield return new MultMultiplied(Factor, ctx.CurrentCard, ctx.CurrentJoker);
    }
}
```

### Conditional

```csharp
[CreateAssetMenu(menuName = "Balatro/Effect/Conditional")]
public class ConditionalEffect : EffectNode {
    public Condition Condition;      // CardIsSuit, CardIsRankOdd, CardIsFace, HandIsType, ...
    public EffectNode Then;
    public EffectNode Else;

    public override IEnumerable<ScoreEvent> Execute(EffectContext ctx) {
        var branch = Condition.Evaluate(ctx) ? Then : Else;
        if (branch == null) yield break;
        foreach (var ev in branch.Execute(ctx)) yield return ev;
    }
}
```

### Retrigger

```csharp
[CreateAssetMenu(menuName = "Balatro/Effect/Retrigger")]
public class RetriggerEffect : EffectNode {
    public int Times = 1;

    public override IEnumerable<ScoreEvent> Execute(EffectContext ctx) {
        yield return new RetriggerScheduled(ctx.CurrentCard, Times);
        // Actual retrigger handled by ScoringEngine via a queue
    }
}
```

The engine maintains a retrigger queue per card: when retrigger effects stack (Seltzer + red seal + Hack on a 2), the card scores (1 + retriggerCount) times.

### Sequence

```csharp
[CreateAssetMenu(menuName = "Balatro/Effect/Sequence")]
public class SequenceEffect : EffectNode {
    public List<EffectNode> Steps;
    public override IEnumerable<ScoreEvent> Execute(EffectContext ctx) {
        foreach (var step in Steps)
            foreach (var ev in step.Execute(ctx)) yield return ev;
    }
}
```

## Composing a Joker

### "The Joker" (+4 mult)

```
JokerDefinition "Joker"
  Rarity: Common
  BaseCost: 2
  Triggers: Independent
  Effect:
    AddMult { Amount: 4 }
```

### "Greedy Joker" (+3 mult per diamond played)

```
JokerDefinition "Greedy Joker"
  Rarity: Common
  BaseCost: 5
  Triggers: OnCardScored
  Effect:
    Conditional {
      Condition: CardIsSuit(Diamond)
      Then: AddMult { Amount: 3 }
    }
```

### "Obelisk" (×0.2 mult per consecutive round playing the same hand)

```
JokerDefinition "Obelisk"
  Rarity: Rare
  BaseCost: 8
  Triggers: Independent
  Effect:
    XMult { Factor: Expr("1 + 0.2 * run.obeliskStreak") }
```

(Runtime-evaluated expression node for formula-based scaling. Expression nodes are pre-compiled at load.)

### "Blueprint" (copy the Joker to the right)

```
JokerDefinition "Blueprint"
  Rarity: Rare
  BaseCost: 10
  Triggers: Independent
  Effect:
    CopyAdjacentJoker { Direction: Right }
```

`CopyAdjacentJoker` resolves the target Joker's effect graph in the current context, as if Blueprint were that Joker. Careful: chaining Blueprint → Blueprint is allowed (copies the chain); design this explicitly.

## Card Enhancements

Each enhancement is a `CardEnhancementDefinition` — a small SO with `OnScoredEffect`, `OnHeldEffect`, `OnPlayedEffect` graphs. Example:

```
CardEnhancementDefinition "Glass"
  OnScoredEffect:
    Sequence:
      - XMult { Factor: 2 }
      - RollChance { OneIn: 4, OnSuccess: DestroySelf }
```

```
CardEnhancementDefinition "Steel"
  OnHeldEffect:
    XMult { Factor: 1.5 }
```

## Editions

Same pattern, applied after enhancement:

```
CardEditionDefinition "Polychrome"
  OnScoredEffect:
    XMult { Factor: 1.5 }

CardEditionDefinition "Holographic"
  OnScoredEffect:
    AddMult { Amount: 10 }
```

## Seals

Seals are yet another layer:

```
CardSealDefinition "Red"
  OnScoredEffect:
    Retrigger { Times: 1 }

CardSealDefinition "Gold"
  OnHeldEffect:
    // at round end, +3 gold per gold seal held
    AddGoldAtRoundEnd { Amount: 3 }
```

## Event Stream

The View subscribes to `ScoreEvent`s:

```csharp
public abstract record ScoreEvent;
public record BaseHandEvaluated(HandType Type, double Chips, double Mult) : ScoreEvent;
public record ChipsAdded(double Amount, CardInstance Card, JokerInstance Joker) : ScoreEvent;
public record MultAdded(double Amount, CardInstance Card, JokerInstance Joker) : ScoreEvent;
public record MultMultiplied(double Factor, CardInstance Card, JokerInstance Joker) : ScoreEvent;
public record CardScoredStart(CardInstance Card) : ScoreEvent;
public record CardScoredEnd(CardInstance Card) : ScoreEvent;
public record JokerTriggeredStart(JokerInstance Joker) : ScoreEvent;
public record JokerTriggeredEnd(JokerInstance Joker) : ScoreEvent;
public record FinalScoreCalculated(double Chips, double Mult, double Total) : ScoreEvent;
```

View plays these with a coroutine that inserts animation delays, producing the signature "tally" feel.

## Testing

Scoring is Unity-independent — pure C# — so tests run fast:

```csharp
[Test]
public void GreedyJoker_DiamondAce_AddsFourMultPerDiamond() {
    var run = RunBuilder.Fresh()
        .WithJokers("Greedy Joker")
        .Build();

    var hand = new[] {
        Cards.AceOf(Suit.Diamond),
        Cards.KingOf(Suit.Diamond),
        Cards.QueenOf(Suit.Heart),
        Cards.JackOf(Suit.Heart),
        Cards.TenOf(Suit.Club),
    };

    var events = ScoringEngine.Score(hand, run).ToList();
    var final = events.OfType<FinalScoreCalculated>().Single();

    // High card base = 5 chips, 1 mult
    // Aces +11 + Kings +10 + Queens +10 + Jacks +10 + 10 +10 → 51 chips from ranks
    // Wait — only Ace scores for HighCard → 5 + 11 = 16 chips
    // Greedy fires once (Ace of diamonds) → +3 mult → mult = 4
    Assert.AreEqual(16, final.Chips);
    Assert.AreEqual(4, final.Mult);
    Assert.AreEqual(64, final.Total);
}
```

Coverage target: every Joker, every enhancement, every edition, every seal, every boss blind modifier, every consumable. ~400 tests.

## Modding

ScriptableObject + Effect graph + AssetBundle = modders ship new Jokers without source access. Exotic behaviors need custom `EffectNode` subclasses in a .dll. Mirrors Slay the Spire modding pattern (see that GDD's Unity card-effect-system reference).

## Performance Notes

- Scoring loop runs once per hand played (~seconds between each). Budget is generous.
- Retrigger explosions can spawn hundreds of ScoreEvents in one hand; batch them in a list instead of yielding a coroutine per event on low-end mobile.
- Big-number path: check for `chips > 1e15` and swap to big-float representation before further math.
