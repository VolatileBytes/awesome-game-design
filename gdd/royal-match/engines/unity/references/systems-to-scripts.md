# Systems → Scripts Map

## Namespaces

- `Game.Sim` — match-3 simulation
- `Game.View` — presentation + juice
- `Game.Net` — networking
- `Game.Data` — ScriptableObjects
- `Game.Meta` — menus, shop, palace
- `Game.Story` — visual novel

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | App init, auth, addressables |
| `SceneRouter` | MonoBehaviour | Menu ↔ Level ↔ Palace transitions |
| `Level` | MonoBehaviour | Root of level scene |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Grid` | class | Grid state: pieces, obstacles, spawners, holes |
| `Sim.Piece` | struct/class | Cell contents: type, power-up, obstacle, id |
| `Sim.GridSim` | class | Top-level sim: Swap, Resolve, Apply Gravity |
| `Sim.MatchFinder` | class | Find matches (3+, L, T, etc.) |
| `Sim.MatchResolver` | class | Process matches: emit events, replace with power-ups |
| `Sim.PowerUpResolver` | class | Fire power-ups with correct patterns |
| `Sim.ObstacleResolver` | class | Handle box / jelly / ice / chain interactions |
| `Sim.GravitySystem` | class | Pieces fall down |
| `Sim.RefillSystem` | class | New pieces spawn from top |
| `Sim.ObjectiveTracker` | class | Track objective progress per level |
| `Sim.Events` | struct | Match, Cascade, PowerUpFire, ObjectiveProgress, etc. |

## Levels

| Class | Kind | Responsibility |
|---|---|---|
| `LevelDefinition` | ScriptableObject | Grid layout + objectives + moves + mechanics |
| `ObjectiveEntry` | struct | Objective type + target count |
| `InitialState` | struct | Pre-placed obstacles + power-ups |
| `LevelLoader` | class | Load LevelDefinition; initialize Sim.Grid |
| `LevelProgressService` | class | Track clear state + stars earned |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.LevelPresenter` | MonoBehaviour | Subscribe to sim events, drive view |
| `View.GridView` | MonoBehaviour | Render grid; spawn/despawn pieces |
| `View.PieceView` | MonoBehaviour | Individual piece: animator + juice |
| `View.PowerUpView` | MonoBehaviour | Power-up rendering with creation animation |
| `View.ObstacleView` | MonoBehaviour | Obstacle rendering |
| `View.VFXPool` | MonoBehaviour | Pool of particle effects |
| `View.JuicyCamera` | MonoBehaviour | Screen shake, zoom, flash |
| `View.PopupView` | MonoBehaviour | "Sweet!" / "+5" floating text |
| `View.CharacterReactionView` | MonoBehaviour | King Robert reactions |
| `View.ObjectivePanelView` | MonoBehaviour | Top-of-screen objective display |
| `View.MoveCounterView` | MonoBehaviour | Move limit display |
| `View.BoosterBarView` | MonoBehaviour | Active boosters at bottom |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.SwipeDetector` | MonoBehaviour | Tap + swipe direction |
| `Input.GridInputMapper` | MonoBehaviour | Screen to grid coordinates |
| `Input.PowerUpTapper` | MonoBehaviour | Tap placed power-up to fire |
| `Input.PauseButton` | MonoBehaviour | Pause menu access |

## Networking

| Class | Kind | Responsibility |
|---|---|---|
| `Net.AccountClient` | class | Sync: lives, progress, palace state |
| `Net.LevelSubmissionService` | class | Send level outcome for validation |
| `Net.EventService` | class | Event state sync |
| `Net.RoyalPassService` | class | Battle pass progress |
| `Net.TeamService` | class | Team membership + chat |
| `Net.LifeService` | class | Server-side life tracking (anti-cheat) |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.PlayerProgress` | class | Level + stars + palace state |
| `Meta.StarInventory` | class | Stars earned, stars spent |
| `Meta.BoosterInventory` | class | Owned boosters |
| `Meta.CurrencyService` | class | Coins, gems |
| `Meta.MissionService` | class | Daily missions |
| `Meta.EventService` | class | Event progress |
| `Meta.LoginRewardService` | class | Daily login chain |

## Palace

| Class | Kind | Responsibility |
|---|---|---|
| `Palace.PalaceScene` | MonoBehaviour | Palace meta scene |
| `Palace.AreaView` | MonoBehaviour | Individual area rendering |
| `Palace.TaskPin` | MonoBehaviour | Tappable restoration pin |
| `Palace.RestorationAnimator` | MonoBehaviour | Play restoration cinematic |
| `Palace.AreaProgressService` | class | Per-area progress tracking |
| `Palace.StoryTrigger` | class | Trigger story scenes on progress |

## Story (Visual Novel)

| Class | Kind | Responsibility |
|---|---|---|
| `Story.VNPlayer` | MonoBehaviour | Play story scenes |
| `Story.SceneDefinition` | ScriptableObject | Story script data |
| `Story.CharacterSprite` | MonoBehaviour | Character portrait in VN |
| `Story.DialogueBubble` | MonoBehaviour | Dialog text + animations |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UIManager` | MonoBehaviour | Panel stack |
| `HUD` | MonoBehaviour | In-level HUD |
| `LevelSelectPanel` | MonoBehaviour | Scrolling level path |
| `PauseMenu` | MonoBehaviour | Settings + give up + buy moves |
| `OutOfMovesPanel` | MonoBehaviour | +5 moves offer |
| `LevelCompletePanel` | MonoBehaviour | Stars + coins + palace prompt |
| `PalacePanel` | MonoBehaviour | Palace UI |
| `ShopPanel` | MonoBehaviour | IAP store |
| `BoosterShopPanel` | MonoBehaviour | Booster bundles |
| `RoyalPassPanel` | MonoBehaviour | Battle pass |
| `KingdomPanel` | MonoBehaviour | Team overview + chat |
| `DailyRewardsPanel` | MonoBehaviour | Login rewards |

## Juice

| Class | Kind | Responsibility |
|---|---|---|
| `Juice.TweenPool` | class | Pool DOTween tweens for reuse |
| `Juice.ParticlePool` | class | Pool ParticleSystems |
| `Juice.ScreenShake` | class | Camera shake |
| `Juice.Haptic` | class | Platform-specific haptic feedback |
| `Juice.SoundPlayer` | class | Layered SFX playback |

## Data Flow (In-Level)

```
Player swipes pieces
   ↓
Input.SwipeDetector → GridView.AttemptSwap(a, b)
   ↓
Sim.GridSim.Swap(a, b)
   ↓
Sim returns list of events (match, cascade, etc.)
   ↓
View.LevelPresenter enqueues events in sequence
   ↓
JuiceSequencer plays each event with timing:
   PieceView.Bounce → VFX → Popup → Audio → Haptic
   ↓
Check ObjectiveTracker; if all goals met → LevelComplete
   ↓
LevelCompletePanel appears
```

## Testing

- **Sim correctness**: deterministic given seed + moves
- **Match finding**: all valid matches detected
- **Power-up combos**: specific tests for each combo (Rocket+Rocket, etc.)
- **Objective tracking**: objectives update correctly
- **Level balance**: automated solver runs the level, reports solvability + min moves
- **Monte Carlo**: 1000 random-play trials per level, measure clear rate
- **Regression**: prior-approved level outcomes re-run on each patch
