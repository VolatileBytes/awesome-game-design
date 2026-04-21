# Systems → Scripts Map

## Namespaces

- `Game.Sim` — deterministic attack simulation
- `Game.View` — MonoBehaviour presenters for attack scene
- `Game.Village` — the home village (MonoBehaviour-heavy, non-deterministic)
- `Game.Data` — ScriptableObjects
- `Game.Network` — server comms, snapshot sync
- `Game.Meta` — shop, progression, clan

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | Load Addressables, auth, chain to Village |
| `SceneRouter` | MonoBehaviour | Transition between Village / Attack / Replay scenes |
| `Player` | class (singleton) | Player identity + mirrored progression snapshot |

## Village

| Class | Kind | Responsibility |
|---|---|---|
| `Village` | MonoBehaviour | Root of the village scene; owns grid + buildings + camera |
| `Grid` | class | 44×44 grid; tile occupancy |
| `Building` | MonoBehaviour | One building — prefab with def, level, upgrade state, resource output (if collector) |
| `Wall` | MonoBehaviour | A wall segment with level |
| `Trap` | MonoBehaviour | Placeable trap; invisible during attacks (visual hidden) |
| `Hero` | MonoBehaviour | Village-resident hero; sleeping/upgrading states |
| `Camera.VillagePanZoom` | MonoBehaviour | Pan/pinch/rotate within bounds |
| `EditMode` | MonoBehaviour | Layout editing; drag-drop buildings, save layouts |
| `UpgradeController` | MonoBehaviour | Timed upgrades; hooks to server |
| `Collector` | MonoBehaviour | Gold / elixir / dark elixir generator; fills over time |
| `ClanCastle` | MonoBehaviour | Troops storage (for donations and CC defense) |
| `ArmyController` | MonoBehaviour | Train queue, spell queue |

## Attack Scene

| Class | Kind | Responsibility |
|---|---|---|
| `AttackScene` | MonoBehaviour | Loads a target snapshot, initialises Sim.Attack, owns timer |
| `Sim.Attack` | pure class | Root sim object; ticks 30 Hz |
| `Sim.Grid` | struct | Grid tile occupancy + wall edges |
| `Sim.Unit` | struct | Unit state — pos, hp, target, ai cooldown |
| `Sim.UnitSystem` | function | Ticks all units |
| `Sim.Building` | struct | Building state — hp, cooldown, target |
| `Sim.BuildingSystem` | function | Ticks all buildings (defences scan + fire) |
| `Sim.Projectile` | struct | In-flight projectile |
| `Sim.ProjectileSystem` | function | Ticks all projectiles |
| `Sim.Spell` | struct | Active spell effect |
| `Sim.SpellSystem` | function | Ticks spells (duration, AoE ticks) |
| `Sim.Hero` | struct | Hero as unit + abilityCooldown |
| `Sim.HeroSystem` | function | Ticks heroes; handles ability activation |
| `Sim.Trap` | struct | Armed/triggered state |
| `Sim.TrapSystem` | function | Triggers traps on unit overlap |
| `Sim.Pathing` | function | Flow field generation, A* |
| `Sim.Scoring` | function | Tracks % destroyed, star threshold, TH destroyed |

## Presenters (Attack View)

| Class | Kind | Responsibility |
|---|---|---|
| `View.AttackPresenter` | MonoBehaviour | Subscribes to sim events, drives pools |
| `View.BuildingView` | MonoBehaviour | Visual per building; plays hit flash, destruction |
| `View.UnitView` | MonoBehaviour | Visual per unit; lerp to sim pos, play walk/attack animations |
| `View.ProjectileView` | MonoBehaviour | Visual for projectiles |
| `View.SpellView` | MonoBehaviour | Visual for spell effects |
| `View.TrapView` | MonoBehaviour | Trap explosion VFX |
| `View.DamageNumberPool` | MonoBehaviour | Pooled damage numbers |
| `View.HUD` | MonoBehaviour | Timer, stars earned, destruction % |
| `View.ArmyBar` | MonoBehaviour | Deployable troops + spells + heroes bar |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `InputReader` | ScriptableObject | Emits Touch events |
| `DeployIntent` | struct | What the player wants to deploy + where |
| `AttackInputController` | MonoBehaviour | Converts touches → DeployIntents; forwards to Sim + records in input log |

## Replay

| Class | Kind | Responsibility |
|---|---|---|
| `ReplayLog` | struct | Ordered input events by tick |
| `ReplayRecorder` | class | Appends DeployIntents as they occur |
| `ReplayPlayer` | class | Feeds a ReplayLog into Sim.Attack in replay mode (no live input) |
| `AttackSubmission` | struct | Snapshot hash + replay log + seed + final-state hash, sent to server |

## Progression & Economy

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.BuildingsInventory` | class | Levels + upgrade timers mirror |
| `Meta.ResourceWallet` | class | Gold, elixir, DE, gems; server-authoritative |
| `Meta.Shop` | class | Offers, Gold Pass status |
| `Meta.LabController` | class | Troop/spell upgrade queue |
| `Meta.ClanService` | class | Clan ops — join, request, donate, war |

## Network

| Class | Kind | Responsibility |
|---|---|---|
| `Net.ApiClient` | class | REST + WS transport |
| `Net.SnapshotService` | class | Fetch target village snapshot before an attack |
| `Net.ProgressionService` | class | Upgrade start/finish/collect calls |
| `Net.AttackSubmitService` | class | POST the replay submission; await server verdict |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UIManager` | MonoBehaviour | Panel stack (home, shop, clan, profile, settings) |
| `VillagePanel` | MonoBehaviour | Bottom-bar main actions |
| `AttackSearchPanel` | MonoBehaviour | "Find a Match" → shows targets |
| `ScoutView` | MonoBehaviour | Pre-deploy scouting camera + building info on tap |
| `ArmyBar` | MonoBehaviour | Deploy bar during attack |
| `ResultsScreen` | MonoBehaviour | Stars earned, loot, shield granted |
| `ClanPanel` | MonoBehaviour | Clan chat, war roster, donations |
| `ShopPanel` | MonoBehaviour | Offers, Gold Pass, magic items |
| `GoldPassPanel` | MonoBehaviour | Season tier track |

## Data Flow (Attack Submission)

```
Player selects target
   ↓
Net.SnapshotService.Fetch(targetPlayerId) → snapshot JSON
   ↓
AttackScene.Load(snapshot, seed)
   ↓
Player deploys → DeployIntent → Sim.Attack.AddInput(tick, intent) + ReplayRecorder.Append(tick, intent)
   ↓
Sim ticks 30 Hz until timer 0 or all defences destroyed
   ↓
AttackSubmission { snapshotHash, replayLog, seed, finalStateHash } → Net.AttackSubmitService.Post(...)
   ↓
Server re-runs Sim → verifies final hash → awards stars + loot → broadcasts to defender's mailbox
   ↓
Client receives ResultsScreen with reward
```

Server's sim is either the same C# code (shared DLL) or a reimplementation in the server's language. The identical-output requirement is strong enough that maintaining two versions is a real cost — most studios share a single library.

## Testing

- **Attack sim replay tests**: take recorded replays, re-run the sim, verify identical final state. Run every CI.
- **Fuzz tests**: randomly generated troop placements on randomly generated bases; check for crashes, NaN positions, infinite loops.
- **Performance tests**: simulate a max-density attack (200 units + full building roster); must complete 3 min of sim in < 1 min wall time on a low-end mobile (so device doesn't heat up during live play).
- **Server–client parity tests**: run the same attack on client and server implementations; assert identical final state to the bit.
