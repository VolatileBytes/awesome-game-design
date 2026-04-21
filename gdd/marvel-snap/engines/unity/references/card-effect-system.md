# Card Effect System

The card effect system is the backbone. Hundreds of cards, each with small but specific behaviors. Location effects layer on top. The design must be data-driven and extensible.

## Goals

- Add a new card with a few lines of Unity editor work + a short script
- Card behaviors are testable in isolation
- The resolution order is deterministic and inspectable
- Non-engineers (designers) can prototype cards with minimal friction

## Architecture

### Abilities as Components

Each card's behavior is a `CardAbility` subclass. A card has **zero or one** ability.

```csharp
public abstract class CardAbility : ScriptableObject {
    public virtual void OnReveal(SimContext ctx, CardInstance self) { }
    public virtual int ModifyPower(SimContext ctx, CardInstance self, int currentPower) => currentPower;
    public virtual void OnTurnEnd(SimContext ctx, CardInstance self) { }
    public virtual void OnCardPlayedAnywhere(SimContext ctx, CardInstance self, CardInstance played) { }
    public virtual void OnCardDestroyed(SimContext ctx, CardInstance self, CardInstance destroyed) { }
    public virtual void OnCardDiscarded(SimContext ctx, CardInstance self, CardInstance discarded) { }
    public virtual void OnCardMoved(SimContext ctx, CardInstance self, CardInstance moved, int fromLane, int toLane) { }
}
```

Each card's `CardDefinition.Ability` references a specific subclass ScriptableObject.

### Why Not Visual Scripting

Visual scripting (Bolt, PlayMaker) can be attractive for card designs but:
- Hundreds of cards with varied logic → graphs become spaghetti
- Designers want to prototype quickly, but engineers ship quality; hybrid ScriptableObjects with script-backed behavior is cleaner

### SimContext

`SimContext` is the argument passed to every hook:

```csharp
public struct SimContext {
    public SimState State;
    public int CurrentTurn;
    public int OwnerPlayerId;
    public EventType TriggeringEvent;
    public Random Rng;
}
```

Every side-effect a card has takes a `SimContext` and modifies `State`. No global state. No Unity references. Makes testing easy.

### Trigger Resolution

When the reveal engine processes a card:

1. Check if this card's `OnReveal()` applies
2. If yes, invoke it → it may schedule more triggers
3. Each location's `CanPlayCardHere`/`OnCardPlayed` is consulted
4. Other in-play cards' `OnCardPlayedAnywhere` is invoked

Triggers are **queued and processed in deterministic order** (owner priority, then lane, then play-order within a lane).

## Example: Wong

Wong's ability: "Ongoing: On Reveal abilities at this location happen twice"

```csharp
[CreateAssetMenu]
public class WongAbility : CardAbility {
    public override void OnCardPlayedAnywhere(SimContext ctx, CardInstance self, CardInstance played) {
        if (played.Lane != self.Lane) return;
        if (!played.HasOnReveal()) return;
        // Schedule the OnReveal trigger twice
        ctx.State.ScheduleExtraOnReveal(played);
    }
}
```

## Example: Odin

"On Reveal: Re-activate the On Reveal abilities of other cards at this location."

```csharp
[CreateAssetMenu]
public class OdinAbility : CardAbility {
    public override void OnReveal(SimContext ctx, CardInstance self) {
        var cardsAtLane = ctx.State.GetCardsAtLane(self.Lane, self.OwnerPlayerId)
                                   .Where(c => c != self && c.HasOnReveal());
        foreach (var c in cardsAtLane) {
            c.Ability.OnReveal(ctx, c);
        }
    }
}
```

## Example: Enchantress

"On Reveal: Remove the abilities from all Ongoing cards at a location."

```csharp
[CreateAssetMenu]
public class EnchantressAbility : CardAbility {
    public override void OnReveal(SimContext ctx, CardInstance self) {
        var targets = ctx.State.GetCardsAtLane(self.Lane)
                               .Where(c => c.HasOngoing());
        foreach (var t in targets) {
            t.SetAbilityDisabled(true);
        }
    }
}
```

## Location Effects

Location effects are the **board-level** version of card abilities. Same shape, different hooks.

```csharp
public abstract class LocationEffect : ScriptableObject {
    public virtual bool CanPlayCardHere(SimContext ctx, CardInstance card, int lane) => true;
    public virtual int ModifyPower(SimContext ctx, CardInstance card, int currentPower) => currentPower;
    public virtual void OnCardPlayed(SimContext ctx, CardInstance card, int lane) { }
    public virtual void OnTurnEnd(SimContext ctx, int turn, int lane) { }
    public virtual void OnLocationReveal(SimContext ctx, int lane) { }
}
```

Example: Ego

```csharp
[CreateAssetMenu]
public class EgoLocationEffect : LocationEffect {
    public override int ModifyPower(SimContext ctx, CardInstance card, int currentPower) {
        if (card.Lane != ctx.State.LocationLaneOf(this)) return currentPower;
        return currentPower + 2;
    }
}
```

## Power Calculation

Power is **computed on demand**, not stored:

```csharp
public int CalculatePower(CardInstance card) {
    int p = card.BasePower;
    // Apply ongoing modifiers from all cards at the same lane
    foreach (var c in State.GetCardsAtLane(card.Lane)) {
        p = c.Ability?.ModifyPower(ctx, c, p) ?? p;
    }
    // Apply location modifier
    p = State.LocationAt(card.Lane).Effect.ModifyPower(ctx, card, p);
    return p;
}
```

This keeps **ongoing** buffs dynamic — add a Kazoo → all 1-costs get +1 immediately.

## Edge Case: Cards That Modify Themselves

Some cards (like **Bucky Barnes** who dies and returns as a different card) mutate. Handle by:
- Swapping in a new `CardInstance` with the new definition
- Broadcast `CardTransformed` event to the view
- Old card's ongoing effects are cleaned up first

## Edge Case: Infinite Loops

Pairing `Mr. Negative` (swap costs+powers) with `Invisible Woman` (next turn: duplicate ability) could recurse. Add:
- Recursion depth limit on ability resolution
- "Already processed this turn" flags on per-card state

## Edge Case: Destroy Cascades

Venom destroys Ant-Man which triggers Knull which triggers more... Handle via a **trigger queue** that processes destructions FIFO and keeps order deterministic.

## Testing Strategy

Each card has an isolated test:

```csharp
[Test]
public void Wong_doubles_OnReveal_at_same_lane() {
    var state = TestStateBuilder.With(new Card("Wong", lane: 0))
                                 .With(new Card("Hawkeye", lane: 0));  // OnReveal: +2 power
    state.PlayTurn();
    Assert.AreEqual(expected: 4, state.PowerOf("Hawkeye"));  // 2 base + 2*1 bonus
}
```

Write these tests for every card. Designers can review.

## Designer Workflow

1. **Pitch** a card idea in Notion
2. **Add** a `CardDefinition` asset in the Unity editor
3. **Write** a CardAbility script (or ask engineer for help)
4. **Test** in a local match vs. a bot
5. **Submit** to the team playtest pool

Most cards are 5–20 lines of code. The pattern scales.

## Performance

Ability resolution is fast (microseconds). Power recalculation is the hot path — optimize with:
- Cached power per card per turn; invalidate on state change
- Spatial cache of "cards at lane" keyed by lane index

## Anti-Patterns

- **Storing game state in MonoBehaviours**: breaks determinism and replays
- **Mutable static fields in ability scripts**: per-match state bleeds between sessions
- **Triggering effects in `Start()` or `Update()`**: must be called by sim, never by Unity lifecycle
- **Physics for card movement**: use tweens, never physics (non-deterministic)
