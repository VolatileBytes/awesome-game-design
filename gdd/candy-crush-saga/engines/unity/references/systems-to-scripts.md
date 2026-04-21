# Systems → Scripts Map

## Namespaces

- `Game.Sim` — match-3 simulation
- `Game.View` — presentation
- `Game.Net` — networking
- `Game.Data` — ScriptableObjects
- `Game.Map` — saga map rendering
- `Game.Meta` — lives, gold, inventory
- `Game.Social` — friends, tournaments

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | App init, auth, addressables init |
| `SceneRouter` | MonoBehaviour | Map ↔ Level transitions |
| `Level` | MonoBehaviour | Root of level scene |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Grid` | class | Grid state: candies, obstacles |
| `Sim.Candy` | class | Cell contents: color, special, id |
| `Sim.GridSim` | class | Swap / Resolve / Gravity / Refill |
| `Sim.MatchFinder` | class | Find matches (3+, L, T) |
| `Sim.MatchResolver` | class | Process matches, spawn specials |
| `Sim.SpecialResolver` | class | Fire striped/wrapped/color bomb |
| `Sim.ComboResolver` | class | Handle special+special swap combos |
| `Sim.ObstacleResolver` | class | Jelly / chocolate / lock / meringue |
| `Sim.GravitySystem` | class | Pieces fall |
| `Sim.RefillSystem` | class | New candies from spawners |
| `Sim.SugarCrush` | class | Level-complete auto-fire sequence |
| `Sim.ObjectiveTracker` | class | Objective progress |
| `Sim.ScoreTracker` | class | Score + star threshold tracking |
| `Sim.Events` | struct | Match, Cascade, SpecialFire, Complete events |

## Levels

| Class | Kind | Responsibility |
|---|---|---|
| `LevelDefinition` | ScriptableObject | Grid + objective + moves + stars |
| `EpisodeDefinition` | ScriptableObject | 15-level group: theme, backdrop, intro |
| `LevelLoader` | class | Load LevelDefinition via Addressables |
| `LevelProgressService` | class | Clear state + stars per level |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.LevelPresenter` | MonoBehaviour | Sim events → View pipeline |
| `View.GridView` | MonoBehaviour | Render grid state |
| `View.CandyView` | MonoBehaviour | Individual candy anim |
| `View.SpecialCandyView` | MonoBehaviour | Striped/Wrapped/ColorBomb render |
| `View.ObstacleView` | MonoBehaviour | Obstacle visuals |
| `View.VFXPool` | MonoBehaviour | Particle pool |
| `View.ScorePopupPool` | MonoBehaviour | Floating "+60" text pool |
| `View.VoiceLinePlayer` | MonoBehaviour | Mr. Toffee voice randomizer |
| `View.TiffiView` | MonoBehaviour | Character reactions |
| `View.SugarCrushPlayer` | MonoBehaviour | Level-complete finale |
| `View.JuicyCamera` | MonoBehaviour | Screen shake + zoom |

## Map

| Class | Kind | Responsibility |
|---|---|---|
| `Map.SagaMap` | MonoBehaviour | Scrolling saga map |
| `Map.LevelNode` | MonoBehaviour | Individual level icon |
| `Map.LevelNodePool` | MonoBehaviour | Pool of level nodes for virtualization |
| `Map.EpisodeBackdrop` | MonoBehaviour | Episode art rendering |
| `Map.FriendAvatarOverlay` | MonoBehaviour | Friends on map |
| `Map.PlayerAvatar` | MonoBehaviour | Tiffi's current position |
| `Map.TicketGate` | MonoBehaviour | Gate node with unlock options |
| `Map.ChapterIntroPlayer` | MonoBehaviour | Episode intro/outro cinematic |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.SwipeDetector` | MonoBehaviour | Tap + swipe |
| `Input.GridInputMapper` | MonoBehaviour | Screen → grid cell |
| `Input.SpecialCandyTapper` | MonoBehaviour | Tap a placed special |
| `Input.MapScroller` | MonoBehaviour | Saga map scroll behavior |

## Networking

| Class | Kind | Responsibility |
|---|---|---|
| `Net.AccountClient` | class | Sync progress, lives, gold |
| `Net.LevelSubmissionService` | class | Server-validate level outcomes |
| `Net.EventService` | class | Sugar Drop, Jam Session sync |
| `Net.TournamentService` | class | Weekly tournament standings |
| `Net.SocialService` | class | Friend list, life gifts |
| `Net.FacebookBridge` | class | Facebook login |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.PlayerProgress` | class | Level + stars total |
| `Meta.LifeService` | class | Life count + regen timer |
| `Meta.GoldService` | class | Gold balance + IAP |
| `Meta.BoosterInventory` | class | Owned boosters |
| `Meta.PiggyBank` | class | Piggy bank fill + break |
| `Meta.DailyRewardService` | class | Daily spin + Mr. Toffee's cookie |

## Social

| Class | Kind | Responsibility |
|---|---|---|
| `Social.FriendsService` | class | Friend list from Facebook / King |
| `Social.LifeGiftService` | class | Send/request lives |
| `Social.ProfileService` | class | Friend profiles on saga map |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UIManager` | MonoBehaviour | Panel stack |
| `HUD` | MonoBehaviour | In-level HUD |
| `LevelStartModal` | MonoBehaviour | Pre-level booster offer |
| `PauseMenu` | MonoBehaviour | Settings, give up, buy moves |
| `OutOfMovesPanel` | MonoBehaviour | +5 moves offer |
| `LevelCompletePanel` | MonoBehaviour | Stars + score |
| `ShopPanel` | MonoBehaviour | Gold + booster IAP |
| `PiggyBankPanel` | MonoBehaviour | Break piggy bank |
| `TournamentPanel` | MonoBehaviour | Weekly leaderboard |
| `EventsPanel` | MonoBehaviour | Sugar Drop, Jam Session |
| `DailyRewardsPanel` | MonoBehaviour | Daily spin |

## Juice

| Class | Kind | Responsibility |
|---|---|---|
| `Juice.TweenPool` | class | DOTween tween pool |
| `Juice.ParticlePool` | class | ParticleSystem pool |
| `Juice.ScreenShake` | class | Camera shake |
| `Juice.Haptic` | class | Platform haptic |
| `Juice.SoundLayer` | class | Layered SFX |

## Data Flow (In-Level)

```
Player swipes candies
   ↓
Input.SwipeDetector → GridView.AttemptSwap(a, b)
   ↓
Sim.GridSim.Swap(a, b)
   ↓
Sim returns list of events (match, cascade, special-fire, combo)
   ↓
View.LevelPresenter enqueues events
   ↓
JuiceSequencer plays each event:
   CandyView.Bounce → VFX → Popup → Audio → Haptic
   ↓
Check ObjectiveTracker; all goals met → Sugar Crush → LevelComplete
   ↓
LevelCompletePanel appears
```

## Data Flow (Map → Level → Map)

```
Saga map → tap unlocked level node
   ↓
LifeService.TryConsume(1) → if ok, load level
   ↓
Addressables loads LevelDefinition
   ↓
Level.unity scene loads
   ↓
Player plays; Sim → View loop
   ↓
Level complete/fail
   ↓
Net.LevelSubmissionService submits (validate, earn gold)
   ↓
SceneRouter → back to saga map
   ↓
Map updates level node state (1/2/3 stars)
   ↓
If episode complete → episode-complete cinematic
   ↓
If ticket gate → prompt friends/wait/pay
```

## Testing

- **Sim determinism**: same seed + moves → same result
- **Match finding**: all valid matches detected
- **Special combos**: explicit test per combo type
- **Sugar Crush**: correct auto-fire behavior
- **Objective tracking**: all objective types pass correctness tests
- **Level balance**: automated solver reports clear-rate per level
- **Monte Carlo**: 1000 random-play trials per level
- **Regression**: prior level outcomes re-run on every patch
