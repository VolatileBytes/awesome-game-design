# Systems → Scripts Map

## Namespaces

- `Game.Sim` — deterministic real-time simulation
- `Game.View` — presentation layer
- `Game.Net` — networking
- `Game.Data` — ScriptableObjects
- `Game.Meta` — menus, shop, progression
- `Game.Club` — guild/club features

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | Loads addressables, auth, chain to main menu |
| `SceneRouter` | MonoBehaviour | Menu ↔ Match scene transitions |
| `Matchmaker` | class | Queue for matchmaking; receive match assignment |
| `Match` | MonoBehaviour | Root of a match scene; holds sim + view + net clients |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Match` | pure class | Deterministic root; `Tick()` advances one step |
| `Sim.Brawler` | struct | Pos, hp, ammo, super charge, hyper charge, active buffs |
| `Sim.Projectile` | struct | Position, velocity, owner, damage, lifetime, special flags (pierce, bounce) |
| `Sim.SpellEffect` | struct | Active super effect (heal bubble, summon ref, buff marker) |
| `Sim.Grid` | struct | Tile occupancy + LOS helpers |
| `Sim.BrawlerSystem` | function | Ticks brawler movement, ammo reload, state |
| `Sim.ProjectileSystem` | function | Ticks projectile movement + collision |
| `Sim.SpellSystem` | function | Ticks active effects |
| `Sim.TrapSystem` | function | For maps/objects like bombs |
| `Sim.ScoreSystem` | function | Mode-specific scoring |
| `Sim.Events` | struct | Fired from systems; consumed by View |

## Brawler Abilities

| Class | Kind | Responsibility |
|---|---|---|
| `BrawlerDefinition` | ScriptableObject | Brawler metadata, attack pattern ref, super ref, stat arrays |
| `AttackPattern` (SO + impl) | data + strategy | Projectile spawning pattern for attack |
| `SuperDefinition` | ScriptableObject | Super effect ref + parameters |
| `SuperExecution` (impl) | class | Runtime super behaviour |
| `GadgetDefinition` + impl | pair | Gadget data + behaviour |
| `StarPowerDefinition` + impl | pair | Passive modifier data + hook point |
| `HyperchargeDefinition` + impl | pair | Hypercharge boost data + behaviour |

## Mode Controllers

| Class | Kind | Responsibility |
|---|---|---|
| `ModeController` | abstract | OnStart, OnTick, CheckEnd, ResolveResult |
| `GemGrabController` | ModeController | Gem pit spawn + hold timer |
| `BountyController` | ModeController | Star accumulation |
| `BrawlBallController` | ModeController | Ball physics + goals |
| `HeistController` | ModeController | Safe HP + timer |
| `HotZoneController` | ModeController | Zone contest + points |
| `KnockoutController` | ModeController | Round-based elimination |
| `ShowdownController` | ModeController | Shrinking gas + last-standing |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.MatchPresenter` | MonoBehaviour | Subscribes to sim events, drives pools |
| `View.BrawlerView` | MonoBehaviour | Visual per brawler; lerp to sim pos, animate, hit-flash |
| `View.ProjectileView` | MonoBehaviour | Visual for projectiles |
| `View.VFXPool` | MonoBehaviour | Pool of spell VFX, hit effects, death particles |
| `View.DamageNumberPool` | MonoBehaviour | Damage number UI |
| `View.CameraController` | MonoBehaviour | Cinemachine + offset-toward-aim logic |
| `View.MinimapView` | MonoBehaviour | Top-corner minimap |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `InputReader` | ScriptableObject | Abstract input events (Move, Fire, Super, Gadget, Hyper) |
| `VirtualStickLeft` | MonoBehaviour | On-screen stick that emits Move vector |
| `VirtualStickRightAim` | MonoBehaviour | On-screen drag area for aim; emits fire angle |
| `ButtonSuper` | MonoBehaviour | Super activation button |
| `ButtonGadget` | MonoBehaviour | Gadget activation |
| `ButtonHyper` | MonoBehaviour | Hypercharge activation |
| `InputController` | MonoBehaviour | Aggregates into `InputIntent` per tick; forwards to sim via Net |

## Networking

| Class | Kind | Responsibility |
|---|---|---|
| `Net.MatchClient` | MonoBehaviour | Websocket/UDP client to game server |
| `Net.InputBuffer` | class | Sends input at 60 Hz, receives server state at 30 Hz |
| `Net.StateReconciler` | class | Reconciles client prediction with server state |
| `Net.MatchState` | struct | Wire format for state deltas |
| `Net.LagMeter` | class | RTT / jitter monitoring |

## Maps

| Class | Kind | Responsibility |
|---|---|---|
| `MapDefinition` | ScriptableObject | Tile grid + mode + environmental objects |
| `MapLoader` | MonoBehaviour | Instantiates the map prefab and decorates with runtime objects |
| `Sim.GridBuilder` | function | Constructs `Sim.Grid` from `MapDefinition` |

## Progression

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.BrawlerInventory` | class | Unlocked brawlers + their levels + power points |
| `Meta.TrophyService` | class | Trophy gain/loss, milestone unlocks |
| `Meta.BrawlPassService` | class | Tokens + tier rewards |
| `Meta.ShopService` | class | Daily / featured offers |
| `Meta.MasteryService` | class | Per-brawler mastery tier |
| `Meta.QuestService` | class | Daily / weekly / mastery quests |

## Power League / Ranked

| Class | Kind | Responsibility |
|---|---|---|
| `Ranked.DraftPhase` | MonoBehaviour | Ban-pick UI and state machine |
| `Ranked.SeasonService` | class | Season tier + placement |

## Club

| Class | Kind | Responsibility |
|---|---|---|
| `Club.Service` | class | Join, leave, request, donate (if relevant), chat |
| `Club.ChatPanel` | MonoBehaviour | Chat UI |
| `Club.LeaguePanel` | MonoBehaviour | Biweekly club league |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UIManager` | MonoBehaviour | Panel stack |
| `HUD` | MonoBehaviour | In-match HUD |
| `BrawlerSelect` | MonoBehaviour | Choose brawler + gadget + star power before match |
| `MatchResultsScreen` | MonoBehaviour | End-of-match stars, trophies, rewards, star drop |
| `TrophyRoadPanel` | MonoBehaviour | Milestones + claim |
| `BrawlPassPanel` | MonoBehaviour | Tiers + claim + token progress |
| `ShopPanel` | MonoBehaviour | Offers |
| `ClubPanel` | MonoBehaviour | Club overview |

## Data Flow (In-Match)

```
Input (left stick + right aim + buttons)
   ↓
InputController → InputIntent (move + fire + super + gadget)
   ↓
Net.MatchClient.SendInput(intent, tick)
   ↓
Server: receive intent → validate → queue for tick
   ↓
Server sim ticks → emits StateDelta
   ↓
Net.MatchClient.OnStateDelta → Sim.Match.ApplyDelta
   ↓
Sim.Match events → View.MatchPresenter
   ↓
BrawlerView.LerpTo / ProjectileView.Update / VFXPool.Play / HUD.UpdateSuperCharge
```

Client-predicted shortcut: client applies its own inputs to sim immediately; reconciles when server delta arrives with possibly different state.

## Testing

- **Sim determinism tests**: given input log + seed + initial state, assert final sim state.
- **Replay tests**: record production matches, re-run sim, verify identical.
- **Network tests**: simulate packet loss, latency, reordering; assert reconciliation works.
- **Bot matches**: automated bots running full matches, surfacing balance / crash / performance issues.
- **Performance tests**: 3v3 match with maximum VFX / projectiles active; assert 60 FPS on target devices.
