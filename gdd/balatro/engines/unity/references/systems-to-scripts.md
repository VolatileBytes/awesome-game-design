# Systems → Scripts Map — Balatro

## Namespaces

- `Balatro.Sim` — pure scoring + state
- `Balatro.Sim.Scoring` — scoring engine
- `Balatro.Sim.Shop` — shop generation + purchases
- `Balatro.View` — presentation + animation
- `Balatro.Data` — ScriptableObjects
- `Balatro.Meta` — unlocks, completion grid
- `Balatro.Save` — persistence
- `Balatro.Input` — input routing

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | Load data, boot save, transition to title |
| `TitleController` | MonoBehaviour | Title + deck/stake selection |
| `RunController` | MonoBehaviour | Drives a single run; owns `RunState` |
| `RunState` | class | Seed, deck, Jokers, consumables, ante, money, HP-less (hand count based) |
| `BlindController` | class | Drives a single blind (set target, track hands/discards) |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.HandState` | class | Currently-held 8 cards, selected subset |
| `Sim.DeckState` | class | Full deck composition + draw pile pointer |
| `Sim.CardInstance` | class | Runtime card (suit/rank/enhancement/edition/seal/id) |
| `Sim.JokerInstance` | class | Runtime joker (def ref + order position + accumulated state like Obelisk's counter) |
| `Sim.ConsumableInstance` | class | Runtime consumable |
| `Sim.Scoring.ScoringEngine` | class | Applies the full scoring pipeline |
| `Sim.Scoring.HandEvaluator` | class | Identify poker hand from 5 cards |
| `Sim.Scoring.EffectContext` | class | Current chips + mult + scoring card + hand + state pointer |
| `Sim.Scoring.EffectExecutor` | class | Runs effect graphs |
| `Sim.Scoring.ScoreEvent` | struct | Event stream for View |
| `Sim.Shop.ShopState` | class | Current shop roll (items, packs, reroll count) |
| `Sim.Shop.ShopGenerator` | class | Roll shop contents based on seed + stake |
| `Sim.Shop.PurchaseHandler` | class | Buy / sell / reroll actions |
| `Sim.SimRandom` | class | Seeded, stream-partitioned RNG |

## Data

| Class | Kind | Responsibility |
|---|---|---|
| `Data.JokerDefinition` | ScriptableObject | Joker metadata + effect graph |
| `Data.ConsumableDefinition` | ScriptableObject | Tarot / Planet / Spectral effect |
| `Data.BlindDefinition` | ScriptableObject | Blind (small/big/boss) name, modifier |
| `Data.VoucherDefinition` | ScriptableObject | Shop voucher effect |
| `Data.DeckDefinition` | ScriptableObject | Starting deck variant (Red, Blue, ..., Plasma) |
| `Data.ChallengeDefinition` | ScriptableObject | Challenge run constraints + starting state |
| `Data.EffectNode` | ScriptableObject (abstract) | Atomic effect (+chips, +mult, xmult, retrigger, draw, etc.) |
| `Data.HandTypeTable` | ScriptableObject | Base chips/mult + per-level bonuses |
| `Data.StakeDefinition` | ScriptableObject | Stake tier modifier |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.TableView` | MonoBehaviour | Root; consumes `ScoreEvent`s and shop events |
| `View.HandView` | MonoBehaviour | Layout + drag + select |
| `View.PlayingCardView` | MonoBehaviour | One card's visual (rank, suit, enhancement, edition, seal) |
| `View.JokerRowView` | MonoBehaviour | Layout + drag-reorder Jokers |
| `View.JokerCardView` | MonoBehaviour | Joker visual + trigger flash |
| `View.ConsumableSlotView` | MonoBehaviour | Consumable slot |
| `View.ScoreReadout` | MonoBehaviour | Chips + mult display + multiplication punch |
| `View.DeckView` | MonoBehaviour | Face-down pile left side |
| `View.DiscardView` | MonoBehaviour | Face-down pile right side |
| `View.BlindInfoView` | MonoBehaviour | Target + current progress + boss modifier |
| `View.CRTPostProcessor` | MonoBehaviour | CRT scanline post-process feature |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UI.HUD` | MonoBehaviour | Money, hands/discards, ante counter |
| `UI.ShopPanel` | MonoBehaviour | Shop slots, packs, reroll, skip |
| `UI.BoosterPackPanel` | MonoBehaviour | Draft UI for opened pack |
| `UI.BlindSelectPanel` | MonoBehaviour | Small/Big/Boss select with skip options |
| `UI.RunInfoPanel` | MonoBehaviour | Full deck view, Joker order, hand level stats |
| `UI.TooltipLayer` | MonoBehaviour | Hover tooltips for Jokers/cards |
| `UI.GameOverPanel` | MonoBehaviour | Run summary + return to title |
| `UI.TitleDeckSelect` | MonoBehaviour | Deck + stake picker |
| `UI.CompletionGrid` | MonoBehaviour | Decks × Stakes sticker grid |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.UnlockService` | class | Track run conditions → unlock deck/stake/Joker |
| `Meta.CompletionService` | class | Deck × Stake grid state |
| `Meta.ChallengeService` | class | Challenge run progress |
| `Meta.StatsService` | class | Run stats (playtime, wins, highest score) |

## Save

| Class | Kind | Responsibility |
|---|---|---|
| `Save.SaveService` | class | Load/save profile + in-progress run |
| `Save.ProfileData` | class | Unlocks, completion grid, stats |
| `Save.RunSnapshot` | class | Full serializable run state (see unity/GDD.md) |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.CardDragHandler` | MonoBehaviour | Drag to select / reorder hand |
| `Input.JokerDragHandler` | MonoBehaviour | Drag to reorder Joker row |
| `Input.HotkeyRouter` | MonoBehaviour | 1–8 select, Space play, D discard, S sort, R rank/suit toggle |
| `Input.GamepadRouter` | MonoBehaviour | Gamepad cursor + button mapping |

## Data Flow (Play Hand)

```
Player clicks "Play Hand"
   ↓
Input.HotkeyRouter / button → TableView.PlayHand(selectedIndices)
   ↓
Sim.ScoringEngine.Score(hand, state)
   ↓ yields events:
BaseHandEvaluated(type, baseChips, baseMult)
   → View.ScoreReadout.ShowBase()
CardScored(cardIndex, addedChips, addedMult)  (per scoring card)
   → View.PlayingCardView.Flash() + ScoreReadout.Tick()
JokerTriggered(jokerIndex, delta)  (per Joker, L→R)
   → View.JokerCardView.Flash() + ScoreReadout.Tick()
FinalScoreCalculated(chips, mult, total)
   → View.ScoreReadout.ResolveMultiply()
   ↓
RunState.CurrentBlindScore += total
   ↓
If score ≥ target: BlindCleared → open shop
Else if hands == 0: RunEnded → game over
```

## Data Flow (Blind Transition)

```
Shop "Skip" or final purchase →
   BlindController.Advance() →
   Current blind index +=1 (or ante +=1 if boss cleared)
   Generate next blind state, next shop for between
   BlindSelectPanel (for small/big): offer Skip Tag option
```

## Data Flow (Run Start)

```
Title → DeckSelect → StakeSelect (capped by unlocks)
   ↓
RunController.NewRun(deckId, stakeId, seed)
   ↓
Generate full starting deck from DeckDefinition
Generate ante 1 blinds via SimRandom
Load Run scene (if not already loaded)
   ↓
Show BlindSelectPanel
```

## Testing

- **Scoring determinism**: seed + action log → identical final scores.
- **Hand evaluation**: every 5-card combo → correct poker hand classification.
- **Effect correctness**: each Joker × common hand scenarios → expected delta.
- **Shop determinism**: seed + purchase log → identical shop rolls.
- **Boss blind modifiers**: each boss applies its debuff correctly.
- **Challenge runs**: each challenge completable in theory (spot-check winning seeds).
- **Save round-trip**: mid-run save → reload → identical state.
- **Big number handling**: verify Endless mode scores beyond 2^53 stay consistent.
- **Balance probes**: simulate 10,000 runs with greedy-play AI per deck × stake; report win-rate.
