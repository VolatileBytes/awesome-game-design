---
id: marvel-snap
title: Marvel Snap — Unity Implementation
version: 0.1.0
description: Unity-specific implementation guide for a 3-lane, 6-turn simultaneous card battler with rich location effects. Server-authoritative, turn-based.
tags: [unity, mobile, card-game, simultaneous, urp]
---

# Marvel Snap — Unity Implementation

Engine overlay for the Marvel Snap GDD. See [GDD.md](../../GDD.md).

## Target

- **Unity**: 2022.3 LTS or later
- **Render pipeline**: URP (2D-biased, 3D characters stylized flat)
- **Input**: New Input System, touch-first
- **Platforms**: iOS + Android primary; PC/Tablet secondary
- **Networking**: server-authoritative turn-based

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP |
| `com.unity.inputsystem` | Touch + drag |
| `com.unity.addressables` | Card art + location backdrops loaded on demand |
| `com.unity.textmeshpro` | UI |
| `com.unity.ugui` | Canvas, UI |
| `com.unity.localization` | Multi-language (Snap is global) |

Third-party:
- **DOTween** — card fly-in, reveal sequence tweens
- **MessagePack-CSharp** — wire format
- **SignalR** or custom WebSocket — real-time matchmaking + game flow

## Core Architecture

### Server-Authoritative

Card games are trivially cheatable if the client runs authority. The server:
- Owns the shuffled decks + draw piles (hidden from client)
- Owns the mana + board state
- Resolves reveal sequences
- Validates every card play

### Separation of Sim and View

- `Game.Sim` — pure C#, game rules engine, runs on server (and optionally in-client for prediction/animation timing)
- `Game.View` — MonoBehaviours rendering board state

Client can mirror sim forward for animation timing, but **server is truth**.

### Simultaneous Commit Flow

Each turn:
1. Both players drag cards to lanes (locally, visible only to self)
2. Player taps **End Turn** → client sends commit packet to server
3. Server waits for both commits (with deadline; auto-end if deadline exceeded)
4. Server resolves the reveal sequence (card-by-card with timing)
5. Server broadcasts the ordered reveal events back to both clients
6. Both clients **play back** the reveal animation; end of animation → next turn

## Project Layout

```
Assets/
  _Project/
    Art/
      Cards/                 # card portraits + variants
      Locations/             # location backdrops
      VFX/
      UI/
    Data/
      Cards/                 # ScriptableObject per card
      Locations/             # ScriptableObject per location
      Seasons/               # season pass data
    Prefabs/
      CardView
      LocationView
      HandView
      BoardView
      UI/
    Scenes/
      Boot.unity
      Menu.unity
      Match.unity
    Scripts/
      Core/
      Sim/                    # card & board rules engine
      View/                   # presentation
      Net/                    # networking
      Cards/
      Locations/
      UI/
      Matchmaking/
      Collection/
      Economy/
```

## Card System

### ScriptableObject Definition

```csharp
[CreateAssetMenu]
public class CardDefinition : ScriptableObject {
    public string Id;
    public string DisplayName;
    public int Cost;
    public int Power;
    public CardKeyword Keyword;   // OnReveal, Ongoing, EndOfTurn, Move, Discard, Destroy, None
    public string AbilityTextTemplate;
    public Sprite Portrait;
    public Sprite FullArt;
    public Rarity BaseRarity;
    public CardAbility Ability;   // reference to a behavior asset or script
    public List<CardVariant> Variants;
}
```

### Ability Strategy Pattern

```csharp
public interface ICardAbility {
    void OnReveal(SimState state, CardInstance self);
    void OnEndTurn(SimState state, CardInstance self);
    void OnCardEntered(SimState state, CardInstance self, CardInstance other);
    void OnCardDestroyed(SimState state, CardInstance self, CardInstance destroyed);
    void OnCardDiscarded(SimState state, CardInstance self, CardInstance discarded);
    void OnCardMoved(SimState state, CardInstance self, CardInstance moved);
    // ...event methods for each trigger
}
```

Each card has one behavior asset. Some cards have composite behaviors (e.g., On Reveal + Ongoing); they implement multiple interface methods.

### Examples

- `Cyclops`: 3-cost, 4-power, vanilla — no ability script
- `Wong`: 4-cost, 2-power, Ongoing — buffs On Reveal cards at the same location
- `Odin`: 6-cost, 8-power, On Reveal — re-activate On Reveal abilities at his location

## Location System

### ScriptableObject Definition

```csharp
[CreateAssetMenu]
public class LocationDefinition : ScriptableObject {
    public string Id;
    public string DisplayName;
    public string EffectTextTemplate;
    public Sprite Backdrop;
    public LocationEffectCategory Category;  // Restrictive, Rewarding, Disruptive, etc.
    public LocationEffect Effect;  // reference to effect asset
    public int Weight;  // rotation frequency weight
}
```

### Location Effect Interface

```csharp
public interface ILocationEffect {
    bool CanPlayCardHere(SimState state, CardInstance card, int lane);
    int ModifyPower(SimState state, CardInstance card, int lane);
    void OnCardPlayed(SimState state, CardInstance card, int lane);
    void OnTurnStart(SimState state, int lane);
    void OnTurnEnd(SimState state, int lane);
    void OnLocationReveal(SimState state, int lane);
}
```

Each location implements the methods it cares about.

### Examples

- `Ego`: `ModifyPower()` returns `card.Power + 2`
- `Death's Domain`: `OnCardPlayed()` destroys the card
- `The Vault`: `OnTurnEnd(turn=3)` marks the lane as locked (no new cards)

## Sim

```csharp
public class SnapSim {
    SimState State;
    public void CommitTurn(TurnInput playerInput, TurnInput opponentInput);
    public IEnumerable<RevealEvent> GetRevealSequence();
    public SimState GetState();
}
```

The sim is **deterministic** given the full turn history. Replays are the history log.

### Reveal Sequence

- Each card played has a **reveal priority**:
  1. Cards of the player with priority for this turn reveal first
  2. Within a player, cards reveal in order of lane (left to right)
  3. Each card reveal triggers its On Reveal effect, which may chain
- The sim produces a list of `RevealEvent` objects that the view plays back

## View

- `CardView` — a single card; can animate fly-in, flip, move
- `LaneView` — one of the three lanes; hosts CardViews
- `BoardView` — the three lanes + center info
- `HandView` — player's hand at bottom
- `RevealAnimator` — plays back RevealEvents with DOTween

## Networking

- **Turn commit**: client sends `{turn: N, plays: [{cardId, lane}]}` via WebSocket
- **Server validation**: check mana, card-in-hand, lane cap, location constraints
- **Reveal broadcast**: server sends ordered reveal events
- **Simultaneous decoder**: client plays back reveals with appropriate timing

Snap uses a reliable, in-order channel; not UDP-sensitive because turns are discrete.

## Anti-Cheat

- Server owns deck list + draw order (seeded, server-side RNG)
- Server validates every play
- Client can't see opponent's hand or the undrawn deck

## Performance

- ~15 cards per match visible at peak → trivial
- Location effects can cascade (Wong → Odin → each trigger creates 1–3 more cards on reveal); batch these and apply VFX pool

## UI

- Snap button (top-center) glows when snap is possible
- End Turn button (bottom-right) big and tappable
- Cube counter (top-center) animates when stakes change
- Retreat menu accessible via hamburger or swipe
- Card info via long-press (prevents accidental drag)

## Bots (For PvE / AI Opponents)

- Utility-scoring bots evaluate play options at each turn
- Deterministic for replay
- Deck-typed: Zoo bot, Destroy bot, etc.

## Replay

- **Deterministic** by design — sim is pure function of shuffled decks + turn commits
- Store: deck hashes + seed + turn commits → replay any match

## Common Unity Pitfalls

- **Drag-and-drop on touch**: use New Input System's PointerEventData, not GetMouseButton
- **Animator on many cards**: Animator is GC-heavy; use MaterialPropertyBlock + direct tweens
- **Canvas over-rebuild**: split UI canvases so hand changes don't redraw the board
- **Too many cards in hand + board + location**: pool CardView GameObjects aggressively

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Card Effect System](references/card-effect-system.md)
