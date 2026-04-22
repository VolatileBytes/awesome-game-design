# Systems → Scripts Map — Among Us (Unity)

## Namespace Layout

| Namespace | Purpose |
|---|---|
| `AmongUs.Sim` | Match state, rules |
| `AmongUs.Sim.Tasks` | Task logic |
| `AmongUs.Sim.Sabotage` | Sabotage state machine |
| `AmongUs.Sim.Meetings` | Meeting + voting |
| `AmongUs.Player` | Player state + movement |
| `AmongUs.Role` | Role logic (crew / impostor / variants) |
| `AmongUs.Map` | Map data + vent network |
| `AmongUs.Cosmetics` | Hats / skins / visors / pets |
| `AmongUs.Net` | Networking (NGO) |
| `AmongUs.UI` | HUD + menus |
| `AmongUs.Input` | Input binding |
| `AmongUs.Audio` | Music + SFX |
| `AmongUs.Save` | Profile + progression |
| `AmongUs.Shop` | IAP + cosmetic shop |

## Match Orchestration

| Class | Responsibility |
|---|---|
| `Sim.MatchController` | Lifecycle: lobby → roles → active → meeting → results |
| `Sim.MatchConfig` | Host-configured settings (speed, vision, impostors, etc.) |
| `Sim.GameMode` | Classic / Roles / Hide-n-Seek mode switch |
| `Sim.RoleAssigner` | Randomize impostor assignment |
| `Sim.TaskAssigner` | Randomize task assignment per crewmate |
| `Sim.WinConditionChecker` | Crew task win / impostor parity / sabotage timeout |
| `Sim.TaskBarController` | Aggregate task progress |

## Player

| Class | Responsibility |
|---|---|
| `Player.PlayerState` | Network-sync struct |
| `Player.PlayerController` | Root MonoBehaviour |
| `Player.PlayerMovement` | Input → translate + sync |
| `Player.VisionController` | Radius-based fog-of-war |
| `Player.DeathController` | Body spawn on death |
| `Player.ContextActionController` | Dynamic context button resolver |
| `Player.InteractionRange` | Detect nearby interactable |
| `Player.GhostController` | Post-death state (walk-through-walls, task-only) |

## Role

| Class | Responsibility |
|---|---|
| `Role.Role` | Enum (Crewmate, Impostor) + variants |
| `Role.CrewmateRole` | Base crew capabilities |
| `Role.ImpostorRole` | Kill + vent + sabotage |
| `Role.EngineerRole` | Crew with limited vent access |
| `Role.ScientistRole` | Crew with remote vitals |
| `Role.GuardianAngelRole` | Ghost crew with shield |
| `Role.ShapeshifterRole` | Impostor with disguise |
| `Role.KillCooldownTracker` | Per-impostor cooldown state |

## Tasks

| Class | Responsibility |
|---|---|
| `Sim.Tasks.TaskDef` | SO: task category, room, duration, panel prefab |
| `Sim.Tasks.TaskInstance` | Runtime task state |
| `Sim.Tasks.TaskAssigner` | Distribute per-crewmate lists |
| `Sim.Tasks.TaskPanel` | Base class for minigame UI |
| `Sim.Tasks.WireTask` | Connect wires |
| `Sim.Tasks.CardSwipeTask` | Swipe card with speed gate |
| `Sim.Tasks.ScanTask` | Medbay scan (visual) |
| `Sim.Tasks.GarbageTask` | Dump garbage (visual) |
| `Sim.Tasks.AsteroidTask` | Clear asteroids (visual) |
| `Sim.Tasks.UploadTask` | Long task (start here, finish elsewhere) |
| `Sim.Tasks.DownloadTask` | Data download with timer |
| `Sim.Tasks.CommonTaskRegistry` | All-crewmates-get-this pool |

## Sabotage

| Class | Responsibility |
|---|---|
| `Sim.Sabotage.SabotageController` | State machine, timers |
| `Sim.Sabotage.SabotageDef` | SO: type, duration, fix locations |
| `Sim.Sabotage.SabotageType` | Enum (Lights, O2, Reactor, Comms, Doors) |
| `Sim.Sabotage.FixTerminal` | Interactable that contributes to fix |
| `Sim.Sabotage.DoorSabotage` | Map-door closure |
| `Sim.Sabotage.LightsSabotage` | Vision reduction |
| `Sim.Sabotage.ReactorSabotage` | Dual-fix timer |
| `Sim.Sabotage.O2Sabotage` | Dual-fix timer |

## Meetings

| Class | Responsibility |
|---|---|
| `Sim.Meetings.MeetingController` | Start, discussion, voting phases |
| `Sim.Meetings.MeetingTable` | Teleport anchor for all players |
| `Sim.Meetings.VoteRecord` | Who voted for whom |
| `Sim.Meetings.VoteResolver` | Majority / tie / skip |
| `Sim.Meetings.EjectController` | Eject animation + role reveal option |
| `Sim.Meetings.EmergencyButton` | Press handler in cafeteria |
| `Sim.Meetings.BodyReporter` | Report interaction |

## Map

| Class | Responsibility |
|---|---|
| `Map.MapDef` | SO: rooms, vents, spawn points, sabotage locations |
| `Map.RoomDef` | SO: name, bounds, task slots |
| `Map.VentNetwork` | Graph of linked vents |
| `Map.Vent` | MonoBehaviour: enter/exit interaction |
| `Map.SecurityCamera` | Cam feed source |
| `Map.AdminMap` | Player-count-per-room overlay data |
| `Map.Vitals` | Live / dead / disconnected status |
| `Map.Doorlog` | Last-N-entries ring buffer (MIRA) |
| `Map.Binoculars` | Fungle player locator |

## Cosmetics

| Class | Responsibility |
|---|---|
| `Cosmetics.HatDef` | SO |
| `Cosmetics.SkinDef` | SO |
| `Cosmetics.VisorDef` | SO |
| `Cosmetics.PetDef` | SO |
| `Cosmetics.NameplateDef` | SO |
| `Cosmetics.CosmicubeDef` | SO: themed bundle |
| `Cosmetics.CosmeticInventory` | Per-player owned list |
| `Cosmetics.CosmeticApplier` | Apply cosmetics to player sprite |

## Net

| Class | Responsibility |
|---|---|
| `Net.GameHost` | Host-authoritative controller |
| `Net.LobbyController` | Public/private lobby discovery |
| `Net.RelayConnection` | NAT traversal via Relay |
| `Net.HostMigration` | Best-effort host reassignment |
| `Net.PlayerNetSync` | Position + state replication |
| `Net.ChatNetSync` | Meeting chat RPCs |
| `Net.QuickChatRegistry` | Preset phrase catalog |

## UI

| Widget | Role |
|---|---|
| `UI.HUD.TaskListHUD` | Crewmate task checklist |
| `UI.HUD.TaskBar` | Match-wide progress bar |
| `UI.HUD.SabotageMenu` | Impostor sabotage buttons |
| `UI.HUD.ContextActionButton` | Dynamic bottom-right button |
| `UI.HUD.MinimapOverlay` | Tap-open minimap |
| `UI.HUD.SabotageWarning` | Red HUD banner + countdown |
| `UI.Meeting.MeetingScreen` | Avatar grid + vote buttons |
| `UI.Meeting.ChatLog` | Scrolling chat history |
| `UI.Meeting.QuickChatPicker` | Preset phrase picker |
| `UI.Lobby.LobbyScreen` | Player list + settings |
| `UI.Customization.CustomizerScreen` | Cosmetic picker |
| `UI.Shop.ShopScreen` | IAP + cosmicube shop |
| `UI.Results.ResultsScreen` | Win/loss + MVP |

## Input

| Class | Responsibility |
|---|---|
| `Input.InputDispatcher` | New Input System root |
| `Input.TouchJoystick` | Mobile virtual stick |
| `Input.KeyboardBinding` | WASD + E + Space + etc. |
| `Input.GamepadBinding` | Console controllers |

## Audio

| Class | Responsibility |
|---|---|
| `Audio.MusicDirector` | Lobby / match / meeting / victory cues |
| `Audio.SfxController` | Kill, report, vent, sabotage sounds |
| `Audio.FootstepController` | Surface-aware footsteps (subtle) |
| `Audio.ChatAudio` | Chat open / message ding |

## Save / Progression

| Class | Responsibility |
|---|---|
| `Save.PlayerProfile` | Level, XP, stats, owned cosmetics, beans, stars |
| `Save.StatsTracker` | Match wins/losses per role, tasks completed |
| `Save.QuestController` | Daily/weekly quest tracking |
| `Save.RankedMMR` | Ranked mode skill rating |
| `Save.SaveSystem` | Cloud + local save |

## Shop

| Class | Responsibility |
|---|---|
| `Shop.ShopController` | Cosmicube + DLC catalog |
| `Shop.IAPManager` | Platform-specific billing |
| `Shop.AdController` | Mobile ad integration |
| `Shop.CurrencyManager` | Beans + stars |

## Tests

| Test | Covers |
|---|---|
| `MatchFlowTests` | Role assignment, win conditions |
| `TaskAssignmentTests` | Correct distribution of common/short/long |
| `VoteResolutionTests` | Majority, tie, skip |
| `SabotageFixTests` | Dual-terminal, single-terminal |
| `KillValidationTests` | Range + cooldown enforcement |
| `VentNetworkTests` | Valid vent links + round-trip |
| `VisionTests` | Radius + blockers + lights |
| `CosmeticInventoryTests` | Owned cosmetic applies correctly |
