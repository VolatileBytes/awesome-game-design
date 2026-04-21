# Systems → Scripts Map

## Namespaces

- `Game.Sim` — deterministic rules engine
- `Game.View` — presentation
- `Game.Net` — networking
- `Game.Data` — ScriptableObjects
- `Game.Collection` — card inventory
- `Game.Meta` — menus, shop, season
- `Game.Arena` — draft + arena matches
- `Game.BG` — Battlegrounds

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | App init, auth, addressables |
| `SceneRouter` | MonoBehaviour | Menu ↔ Match ↔ Collection transitions |
| `Matchmaker` | class | Ranked / Casual / Arena queuing |
| `Match` | MonoBehaviour | Root of a match scene |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Match` | class | Root sim object; holds SimState + TurnProcessor |
| `Sim.SimState` | class | Full game state (both players, board, decks) |
| `Sim.Player` | class | Hero, deck, hand, graveyard, mana, weapon |
| `Sim.Hero` | struct | HP, armor, attack, weapon, hero power state |
| `Sim.MinionInstance` | class | Runtime minion: attack, hp, keywords, auras applied |
| `Sim.WeaponInstance` | class | Runtime weapon |
| `Sim.CardInstance` | class | Card in hand (base of minion/spell/weapon) |
| `Sim.SpellContext` | class | Context for cast spells |
| `Sim.TurnProcessor` | class | PlayCard, Attack, UseHeroPower, EndTurn |
| `Sim.ActionValidator` | class | Check legality (mana, targets, keywords) |
| `Sim.StatCalculator` | class | Compute effective attack/hp with auras |
| `Sim.DamageResolver` | class | Sequence damage, death, deathrattles |
| `Sim.DrawEngine` | class | Draw, Fatigue, shuffle |
| `Sim.Events` | struct | Emitted events for View + logging |

## Effects

| Class | Kind | Responsibility |
|---|---|---|
| `CardDefinition` | ScriptableObject | Card metadata + effect ref |
| `CardEffect` (base) | abstract | Override hooks (OnBattlecry, OnDeathrattle, etc.) |
| `FireballEffect`, etc. | CardEffect impl | Per-card logic |
| `Aura` | ScriptableObject | Passive modifier applied to other minions |
| `EnrageEffect` (etc.) | CardEffect impl | Class-specific mechanics |

## Classes & Hero Powers

| Class | Kind | Responsibility |
|---|---|---|
| `HeroClassDefinition` | ScriptableObject | Class metadata + starting hero power + portrait |
| `HeroPowerDefinition` | ScriptableObject | 2-mana ability data |
| `HeroPowerExecution` (base) | abstract | Execute on invocation |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.MatchPresenter` | MonoBehaviour | Subscribes to sim events, orchestrates animations |
| `View.CardView` | MonoBehaviour | Card in hand: drag, hover, flip |
| `View.MinionView` | MonoBehaviour | Minion on board: idle, attack, take-damage, die |
| `View.HeroView` | MonoBehaviour | Hero portrait: HP, armor, attacks, emotes |
| `View.HeroPowerView` | MonoBehaviour | Hero power button, targeting arrow |
| `View.WeaponView` | MonoBehaviour | Equipped weapon + durability |
| `View.ManaTrayView` | MonoBehaviour | Mana crystal bar |
| `View.BoardView` | MonoBehaviour | Layout all minions on board |
| `View.HandView` | MonoBehaviour | Layout cards in fan |
| `View.RopeTimerView` | MonoBehaviour | Turn timer |
| `View.TargetArrowView` | MonoBehaviour | Targeting ghost arrow |
| `View.SpellVFXPool` | MonoBehaviour | Pool VFX prefabs |
| `View.EventPlayer` | class | Dequeue + play events with timing |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.DragController` | MonoBehaviour | Drag-and-drop card plays |
| `Input.AttackController` | MonoBehaviour | Click minion → click target |
| `Input.HeroPowerController` | MonoBehaviour | Hero Power click + target |
| `Input.EndTurnButton` | MonoBehaviour | Commit turn |
| `Input.EmoteWheel` | MonoBehaviour | Quick emotes |
| `Input.SettingsButton` | MonoBehaviour | Menu access |

## Networking

| Class | Kind | Responsibility |
|---|---|---|
| `Net.MatchClient` | MonoBehaviour | WebSocket to game server |
| `Net.ActionSender` | class | Send action + receive event stream |
| `Net.ReconnectService` | class | Resume mid-match on disconnect |
| `Net.MatchState` | struct | Wire format for public state |

## Collection

| Class | Kind | Responsibility |
|---|---|---|
| `Collection.CardInventory` | class | Owned cards (base + golden counts) |
| `Collection.DeckBuilder` | MonoBehaviour | Build / save / edit 30-card decks |
| `Collection.CraftingService` | class | Dust ↔ Cards |
| `Collection.CollectionPanel` | MonoBehaviour | Browse cards UI |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.SeasonService` | class | Seasonal ladder rank tracking |
| `Meta.QuestService` | class | Daily / weekly quest state |
| `Meta.RewardsTrackService` | class | XP + battle pass tiers |
| `Meta.TavernPassService` | class | Paid battle pass |
| `Meta.ShopService` | class | Packs + bundles |
| `Meta.AchievementService` | class | Achievement progress |

## Arena

| Class | Kind | Responsibility |
|---|---|---|
| `Arena.DraftService` | class | Server-side 30-pick draft |
| `Arena.RunService` | class | Track current run: wins, losses |
| `Arena.RunPanel` | MonoBehaviour | Draft UI + match starts |

## Battlegrounds

| Class | Kind | Responsibility |
|---|---|---|
| `BG.LobbyService` | class | 8-player lobby queue |
| `BG.ShopPhase` | class | Buy/sell minions each round |
| `BG.BattlePhase` | class | Auto-resolve combat |
| `BG.HeroPicker` | MonoBehaviour | Pick 1 of N heroes at start |
| `BG.LeaderboardService` | class | Track rating + global rank |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UIManager` | MonoBehaviour | Panel stack |
| `HUD` | MonoBehaviour | In-match HUD |
| `DeckEditorPanel` | MonoBehaviour | Build decks |
| `ShopPanel` | MonoBehaviour | Packs + bundles |
| `QuestPanel` | MonoBehaviour | Daily quests |

## Data Flow (In-Match)

```
Turn start
   ↓
Server emits TurnStart event
   ↓
Client renders: hero portraits, mana fills, cards drawn
   ↓
Player taps a card → drags to board or target
   ↓
Client validates locally (mana check, target legal)
   ↓
Net.ActionSender.Send(PlayCard)
   ↓
Server: TurnProcessor.PlayCard()
   ↓
Sim emits events: MinionSummoned, BattlecryTriggered, DamageDealt, etc.
   ↓
Server broadcasts event list
   ↓
View.EventPlayer plays back with timing
```

## Testing

- **Rules-engine tests** (pure C#): assert correct state transitions
- **Card effect tests**: one test per card's main ability
- **Integration tests**: full 10-turn matches with scripted decks
- **Replay regression**: each patch re-runs stored replays; any state divergence = a bug
- **Balance tests**: Monte Carlo deck vs. deck; produce winrate reports
- **Client-server tests**: disconnect/reconnect mid-match
