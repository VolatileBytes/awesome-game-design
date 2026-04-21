# Systems → Scripts Map

## Namespaces

- `Game.Sim` — deterministic TD sim
- `Game.View` — presentation
- `Game.Net` — networking
- `Game.Data` — ScriptableObjects
- `Game.Meta` — menus, shop, gacha, base
- `Game.Story` — visual novel system

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | App init, auth, addressables |
| `SceneRouter` | MonoBehaviour | Menu ↔ Stage ↔ Home ↔ Base transitions |
| `Stage` | MonoBehaviour | Root of stage scene |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Stage` | class | Root deterministic stage sim |
| `Sim.Grid` | class | Tile grid + path data |
| `Sim.OperatorInstance` | class | Runtime operator: HP, SP, buffs, skill state |
| `Sim.EnemyInstance` | class | Runtime enemy: HP, path progress, buffs |
| `Sim.ProjectileInstance` | struct | Ranged attack |
| `Sim.SummonInstance` | class | Spawned minions |
| `Sim.DPService` | class | DP accumulation + spend |
| `Sim.WaveRunner` | class | Process scripted spawns |
| `Sim.CombatResolver` | class | Damage calc, types, reductions |
| `Sim.PathingService` | class | Enemy path following |
| `Sim.ObstacleService` | class | Block counts + congestion |
| `Sim.Events` | struct | Emitted for View |

## Operator Abilities

| Class | Kind | Responsibility |
|---|---|---|
| `OperatorDefinition` | ScriptableObject | Operator metadata + stats + skills + talents |
| `SkillDefinition` | ScriptableObject | Skill data + effect ref |
| `SkillEffect` (base) | abstract | OnStart, OnTick, OnEnd |
| `AtkBoostSkill`, etc. | SkillEffect impl | Per-skill logic |
| `TalentDefinition` | ScriptableObject | Passive talent data |
| `TalentEffect` (base) | abstract | Apply passive hooks |
| `ModuleDefinition` | ScriptableObject | Endgame module data |
| `ModuleEffect` (base) | abstract | Module effect hook |

## Enemies

| Class | Kind | Responsibility |
|---|---|---|
| `EnemyDefinition` | ScriptableObject | Enemy metadata + stats + abilities |
| `EnemyAbility` (base) | abstract | Boss / elite special behaviors |
| `PhaseTransition` | script | Boss phase changes |

## Stages

| Class | Kind | Responsibility |
|---|---|---|
| `StageDefinition` | ScriptableObject | Stage layout + waves + rewards |
| `WaveScript` | struct | Scripted spawn events |
| `EnvironmentMechanic` (base) | abstract | Toxic tiles, doors, conveyors, etc. |
| `TileDefinition` | ScriptableObject | Tile type + pathing info |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.StagePresenter` | MonoBehaviour | Subscribe to sim events, drive animations |
| `View.OperatorChibiView` | MonoBehaviour | Sprite / Spine animator for operator |
| `View.EnemyChibiView` | MonoBehaviour | Sprite for enemy |
| `View.ProjectileView` | MonoBehaviour | Ranged attack |
| `View.SkillVFXPool` | MonoBehaviour | Pool of skill / hit / summon effects |
| `View.TileGridView` | MonoBehaviour | Rendered grid with highlight states |
| `View.DeployBenchView` | MonoBehaviour | Bottom draggable bench |
| `View.OperatorInfoPopup` | MonoBehaviour | Pop on tap: skill, retreat, stats |
| `View.SPBarView` | MonoBehaviour | Operator SP progress |
| `View.DPView` | MonoBehaviour | Top DP counter |
| `View.EnemyLeakView` | MonoBehaviour | Flash when an enemy leaks |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.DeployDragController` | MonoBehaviour | Drag operator portrait to tile with facing |
| `Input.OperatorTapController` | MonoBehaviour | Tap operator for action menu |
| `Input.SkillButtonController` | MonoBehaviour | Manual skill fire |
| `Input.RetreatButtonController` | MonoBehaviour | Retreat confirmation |
| `Input.PauseButton` | MonoBehaviour | Pause / resume |
| `Input.SpeedToggleButton` | MonoBehaviour | 1x / 2x speed |

## Networking

| Class | Kind | Responsibility |
|---|---|---|
| `Net.ApiClient` | class | REST / WebSocket to game server |
| `Net.StageCompletionService` | class | Send completion replay for validation |
| `Net.GachaService` | class | Gacha transactions (server RNG) |
| `Net.InventoryService` | class | Sync roster, mats, currencies |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.OperatorInventory` | class | Owned operators + their Elite / Level / Skill state |
| `Meta.MaterialInventory` | class | Owned materials + tokens |
| `Meta.GachaService` | class | Gacha pulls, pity, banner state |
| `Meta.RecruitService` | class | Recruitment (alt gacha) |
| `Meta.SanityService` | class | Sanity regen, refill |
| `Meta.MissionService` | class | Daily / weekly / monthly missions |
| `Meta.EventService` | class | Limited event progress |
| `Meta.AnnihilationService` | class | Weekly annihilation clear tracking |
| `Meta.IntegratedStrategiesService` | class | Roguelite mode state |

## Base (Infrastructure)

| Class | Kind | Responsibility |
|---|---|---|
| `Base.BaseState` | class | All rooms + levels + assignments |
| `Base.RoomInstance` | class | One room with assigned operators |
| `Base.ProductionService` | class | Compute production, mats generated |
| `Base.OfflineIncomeService` | class | On login, calculate passive income earned |
| `Base.BasePanel` | MonoBehaviour | Base management UI |

## Home (Dormitory)

| Class | Kind | Responsibility |
|---|---|---|
| `Home.HomeScene` | MonoBehaviour | Dorm scene with Live2D Operators |
| `Home.InteractionController` | MonoBehaviour | Tap Operators for dialog |
| `Home.TrustService` | class | Trust rank per Operator |
| `Home.FurnitureService` | class | Placeable furniture |

## Story

| Class | Kind | Responsibility |
|---|---|---|
| `Story.VNSystem` | MonoBehaviour | Visual novel player |
| `Story.DialogueGraph` | ScriptableObject | Story flow as a graph |
| `Story.CharacterPortraitView` | MonoBehaviour | Sprite in VN |
| `Story.ChoicePanel` | MonoBehaviour | Player choices |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UIManager` | MonoBehaviour | Panel stack |
| `HUD` | MonoBehaviour | In-stage HUD |
| `SquadBuildPanel` | MonoBehaviour | Pre-stage squad pick |
| `OperatorDetailPanel` | MonoBehaviour | Operator info + management |
| `ShopPanel` | MonoBehaviour | Certificate stores + event shops |
| `GachaPanel` | MonoBehaviour | Banner + pull animation |
| `MissionPanel` | MonoBehaviour | Daily / weekly missions |
| `EventPanel` | MonoBehaviour | Event hub |

## Data Flow (In-Stage)

```
Stage start
   ↓
Sim.Stage.Init(StageDefinition)
   ↓
Loop: Sim.Stage.Tick() at 30 Hz
   - WaveRunner spawns enemies
   - Operators attack
   - Enemies move
   - Events emitted
   ↓
Player drags operator to tile → Sim.DeployOperator()
   ↓
Sim.Events → View.StagePresenter → Visual update
   ↓
Win: all enemies dead + <= N leaks → emit StageCompleted event
   ↓
Net.StageCompletionService sends replay → server validates → rewards granted
```

## Testing

- **Sim determinism**: same inputs + same seed = same outcome
- **Operator skill tests**: isolated skill effect tests
- **Enemy behavior tests**: enemies follow paths correctly
- **Stage tests**: full-stage replay matching expected outcome
- **Balance simulation**: test stage clearability with common squads
- **Server-replay validation**: client completion matches server-side replay
