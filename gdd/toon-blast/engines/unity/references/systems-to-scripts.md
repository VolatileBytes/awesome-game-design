# Systems → Scripts Map — Toon Blast

## Namespaces

- `Game.Sim` — blast-3 simulation
- `Game.View` — presentation
- `Game.Net` — networking
- `Game.Data` — ScriptableObjects
- `Game.Map` — saga map
- `Game.Team` — team UI / meta
- `Game.Meta` — coins, lives, boosters
- `Game.Social` — chat, friends

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | App init, auth, addressables |
| `SceneRouter` | MonoBehaviour | Map ↔ Level ↔ Team transitions |
| `Level` | MonoBehaviour | Level scene root |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Grid` | class | Grid state |
| `Sim.Cube` | class | Cell contents: color, power-up, id |
| `Sim.GridSim` | class | Top-level sim |
| `Sim.BlastResolver` | class | Tap → flood-fill → blast |
| `Sim.FloodFiller` | class | Group detection |
| `Sim.PowerUpResolver` | class | Fire patterns for rockets/bombs/disco ball |
| `Sim.ComboResolver` | class | Two-power-up combo effects |
| `Sim.ObstacleResolver` | class | Crates/ice/chains/portals/bubbles |
| `Sim.GravitySystem` | class | Pieces fall |
| `Sim.RefillSystem` | class | New cubes from spawners |
| `Sim.SugarCrush` | class | Level-complete auto-fire sequence |
| `Sim.ObjectiveTracker` | class | Objective progress |
| `Sim.Events` | struct | Blast, Cascade, PowerUpFire, Complete |

## Levels

| Class | Kind | Responsibility |
|---|---|---|
| `LevelDefinition` | ScriptableObject | Grid + objective + moves + stars |
| `NeighborhoodDefinition` | ScriptableObject | Theme + backdrop + character cameo |
| `LevelLoader` | class | Load via Addressables |
| `LevelProgressService` | class | Stars per level |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.LevelPresenter` | MonoBehaviour | Sim events → View |
| `View.GridView` | MonoBehaviour | Renders grid |
| `View.CubeView` | MonoBehaviour | Individual cube |
| `View.PowerUpView` | MonoBehaviour | Power-up render + fire |
| `View.ObstacleView` | MonoBehaviour | Obstacle visuals |
| `View.VFXPool` | MonoBehaviour | Particle pool |
| `View.ScorePopupPool` | MonoBehaviour | Floating "+100" popups |
| `View.CharacterReactionView` | MonoBehaviour | Bruno/Cooper/Wally reactions |
| `View.VoiceLinePlayer` | MonoBehaviour | Character voice randomizer |
| `View.SugarCrushPlayer` | MonoBehaviour | Auto-fire finale |
| `View.JuicyCamera` | MonoBehaviour | Shake, zoom |

## Map

| Class | Kind | Responsibility |
|---|---|---|
| `Map.SagaMap` | MonoBehaviour | Vertical scrolling path |
| `Map.LevelNode` | MonoBehaviour | Level icon on map |
| `Map.LevelNodePool` | MonoBehaviour | Virtualized pool |
| `Map.NeighborhoodBackdrop` | MonoBehaviour | Theme art rendering |
| `Map.CharacterCameo` | MonoBehaviour | Character at neighborhood boundary |
| `Map.PlayerAvatar` | MonoBehaviour | Player's current position |

## Team

| Class | Kind | Responsibility |
|---|---|---|
| `Team.TeamScene` | MonoBehaviour | Team UI container |
| `Team.TeamView` | MonoBehaviour | Team main panel |
| `Team.ChatPanel` | MonoBehaviour | Real-time chat |
| `Team.MessageBubble` | MonoBehaviour | Chat bubble |
| `Team.LeaderboardPanel` | MonoBehaviour | League standings |
| `Team.MemberList` | MonoBehaviour | Team roster + contributions |
| `Team.LifeRequestPanel` | MonoBehaviour | Ask for lives |
| `Team.LeagueTierBadge` | MonoBehaviour | Current league tier display |
| `Team.RecruitPanel` | MonoBehaviour | Invite friends |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.TapDetector` | MonoBehaviour | Single-tap detection |
| `Input.GridInputMapper` | MonoBehaviour | Screen → grid cell |
| `Input.PowerUpTapper` | MonoBehaviour | Tap placed power-up (double-tap for combo) |
| `Input.BoosterDragHandler` | MonoBehaviour | Drag booster to use |

## Networking

| Class | Kind | Responsibility |
|---|---|---|
| `Net.AccountClient` | class | Progress + inventory sync |
| `Net.LevelSubmissionService` | class | Server-validate outcomes |
| `Net.TeamService` | class | Team data + membership |
| `Net.LeagueService` | class | Weekly league standings |
| `Net.ChatClient` | class | Real-time chat (PubNub or WebSocket) |
| `Net.EventService` | class | Team events |
| `Net.FriendsService` | class | Facebook / platform friends |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.PlayerProgress` | class | Levels + stars |
| `Meta.CoinService` | class | Coin balance |
| `Meta.LifeService` | class | Life count + regen + team-gift hooks |
| `Meta.BoosterInventory` | class | Booster counts |
| `Meta.PiggyBank` | class | Fills + breakable |
| `Meta.DailyTaskService` | class | Daily objective tracking |

## Social

| Class | Kind | Responsibility |
|---|---|---|
| `Social.FriendsService` | class | Friend list |
| `Social.LifeGiftService` | class | Send/receive lives |
| `Social.ProfileService` | class | Friend profiles |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UIManager` | MonoBehaviour | Panel stack |
| `HUD` | MonoBehaviour | In-level HUD |
| `LevelStartModal` | MonoBehaviour | Pre-level booster offer |
| `PauseMenu` | MonoBehaviour | Settings / give up |
| `OutOfMovesPanel` | MonoBehaviour | +5 moves offer |
| `LevelCompletePanel` | MonoBehaviour | Stars + coins |
| `ShopPanel` | MonoBehaviour | Coins + boosters IAP |
| `PiggyBankPanel` | MonoBehaviour | Break piggy bank |
| `TeamInvitationPanel` | MonoBehaviour | Join team prompts |
| `EventsPanel` | MonoBehaviour | Daily + team events |
| `CharacterStoryPanel` | MonoBehaviour | Story beats UI |

## Juice

| Class | Kind | Responsibility |
|---|---|---|
| `Juice.TweenPool` | class | DOTween pool |
| `Juice.ParticlePool` | class | ParticleSystem pool |
| `Juice.ScreenShake` | class | Camera shake |
| `Juice.Haptic` | class | Platform haptic |
| `Juice.SoundLayer` | class | Layered SFX |

## Data Flow (In-Level)

```
Player taps cube
   ↓
Input.TapDetector → GridView.AttemptBlast(pos)
   ↓
Sim.GridSim.Blast(pos)
   ↓
Flood-fill finds group; if ≥2: blast
   ↓
Sim returns events (blast, power-up-create, power-up-fire)
   ↓
View.LevelPresenter enqueues events
   ↓
JuiceSequencer plays each event:
   CubeView.Blast → VFX → Popup → Audio → Haptic
   ↓
Gravity + refill
   ↓
If objective met → SugarCrush → LevelComplete
```

## Data Flow (Map → Level → Map)

```
Saga map → tap level node
   ↓
LifeService.TryConsume(1) → load level
   ↓
Addressables loads LevelDefinition
   ↓
Level.unity scene
   ↓
Player plays
   ↓
Level complete/fail
   ↓
LevelSubmissionService submits (gold + star reward)
   ↓
LeagueService updates team score (if win)
   ↓
Back to saga map (or Team scene if event triggered)
```

## Data Flow (Team Scene)

```
Tap "Team" button
   ↓
Team.unity scene loads (or panel swap)
   ↓
TeamService fetches team state
   ↓
Subscribe to ChatClient for live messages
   ↓
LeaderboardPanel updates every 30s
   ↓
Member taps "Request Life" → broadcasts to team chat
   ↓
Teammate taps grant → Net.LifeGiftService
   ↓
Requester's LifeService updates
```

## Testing

- **Blast correctness**: flood-fill detects all contiguous groups
- **Power-up spawn**: group size → correct power-up
- **Combo correctness**: each combo triggers correct pattern
- **Sim determinism**: same seed + tap log → same final state
- **Objective tracking**: all objective types correctness
- **Level balance**: solver runs 1000 random plays → clear-rate
- **Team chat**: message delivery E2E
- **League scoring**: star contribution correctness
- **Regression**: prior-approved level outcomes re-run each patch
