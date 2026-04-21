# Systems → Scripts Map

## Namespaces

- `Game.Sim` — deterministic turn-based rules engine
- `Game.View` — presentation
- `Game.Net` — networking
- `Game.Data` — ScriptableObjects
- `Game.Collection` — card inventory, variants
- `Game.Meta` — menus, shop, season pass

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | Loads addressables, auth, chain to main menu |
| `SceneRouter` | MonoBehaviour | Menu ↔ Match scene transitions |
| `Matchmaker` | class | Queue for matchmaking; receive match assignment |
| `Match` | MonoBehaviour | Root of a match scene; holds sim + view + net client |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Match` | pure class | State + CommitTurn() + resolve |
| `Sim.Player` | struct | Hand, deck, discard, mana pool |
| `Sim.CardInstance` | class | Runtime card: ref to def + modifiers + state flags |
| `Sim.LocationInstance` | class | Runtime location: ref to def + modifiers + lock state |
| `Sim.Board` | struct | 3 lanes × (player + opponent) × up to 4 cards |
| `Sim.RevealEngine` | class | Resolves reveal sequence; emits `RevealEvent` list |
| `Sim.TurnResolver` | class | Coordinates card reveals, location effects, end-of-turn triggers |
| `Sim.SnapResolver` | class | Handles Snap / retreat / cube calculations |
| `Sim.Events` | struct | Emitted for View (CardPlayed, CardMoved, CardDestroyed, etc.) |

## Cards

| Class | Kind | Responsibility |
|---|---|---|
| `CardDefinition` | ScriptableObject | Card metadata + ability ref + art |
| `CardAbility` (base) | abstract | Hook methods: OnReveal, Ongoing, etc. |
| `WongAbility` (and many more) | CardAbility impl | Card-specific logic |
| `CardInstance` | class | Runtime state per copy of a card in a match |

## Locations

| Class | Kind | Responsibility |
|---|---|---|
| `LocationDefinition` | ScriptableObject | Location metadata + effect ref + backdrop |
| `LocationEffect` (base) | abstract | Hook methods: CanPlayCardHere, ModifyPower, etc. |
| `EgoLocationEffect` (and many more) | LocationEffect impl | Location-specific logic |
| `LocationInstance` | class | Runtime state per location in a match |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.MatchPresenter` | MonoBehaviour | Subscribes to sim events, drives animations |
| `View.CardView` | MonoBehaviour | Card GameObject; portrait, power, cost |
| `View.HandView` | MonoBehaviour | Player hand layout with drag support |
| `View.LaneView` | MonoBehaviour | One of three lanes; accepts drag drops |
| `View.BoardView` | MonoBehaviour | Central board with 3 lanes |
| `View.RevealAnimator` | MonoBehaviour | Plays back RevealEvents with pacing + audio |
| `View.SnapIndicator` | MonoBehaviour | Shows cube stake + Snap animation |
| `View.CardInfoPopup` | MonoBehaviour | Long-press preview |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.DragController` | MonoBehaviour | Card drag-and-drop on touch |
| `Input.TouchManager` | MonoBehaviour | Long-press, tap, double-tap |
| `Input.EndTurnButton` | MonoBehaviour | Commit turn trigger |
| `Input.SnapButton` | MonoBehaviour | Snap action |
| `Input.RetreatMenu` | MonoBehaviour | Retreat confirmation |

## Networking

| Class | Kind | Responsibility |
|---|---|---|
| `Net.MatchClient` | MonoBehaviour | WebSocket to game server |
| `Net.TurnCommitter` | class | Send turn input, receive reveal sequence |
| `Net.MatchState` | struct | Wire format for board state updates |

## Collection

| Class | Kind | Responsibility |
|---|---|---|
| `Collection.Inventory` | class | Owned cards + variants |
| `Collection.DeckBuilder` | MonoBehaviour | Build / save / edit decks (12 cards) |
| `Collection.VariantStore` | class | Manages card art variants |
| `Collection.CollectionLevel` | class | CL tracking |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.SeasonPassService` | class | Track season pass progress |
| `Meta.ShopService` | class | Offers, bundles |
| `Meta.SpotlightCacheService` | class | Weekly spotlight rotation + open animation |
| `Meta.MissionService` | class | Daily / weekly / season missions |
| `Meta.LadderService` | class | Ranked cube tracking |
| `Meta.ConquestService` | class | Conquest tournament state |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UIManager` | MonoBehaviour | Panel stack |
| `HUD` | MonoBehaviour | In-match HUD |
| `CollectionPanel` | MonoBehaviour | Cards owned + variants |
| `DeckEditorPanel` | MonoBehaviour | Build decks |
| `ShopPanel` | MonoBehaviour | Shop offers |
| `SeasonPassPanel` | MonoBehaviour | Season pass tiers |
| `SpotlightCachePanel` | MonoBehaviour | Open cache animation |

## Data Flow (In-Match)

```
Turn start
   ↓
Player drags cards to lanes (client-side visual)
   ↓
Player taps End Turn
   ↓
Net.TurnCommitter.Commit(plays)
   ↓
Server waits for both players
   ↓
Server runs Sim.Match.CommitTurn()
   ↓
Sim.RevealEngine generates RevealEvent[]
   ↓
Server broadcasts RevealEvent[] to both clients
   ↓
View.RevealAnimator plays back events with pacing
   ↓
Next turn begins
```

## Testing

- **Sim correctness tests**: given turn inputs, assert resolved state
- **Card ability tests**: isolate each card, verify its triggers
- **Location effect tests**: isolate each location, verify its modifiers
- **Reveal order tests**: priority & lane ordering
- **Integration tests**: full 6-turn matches with set decks
- **Balance tests**: Monte Carlo 10k matches between known decks, check win rates
