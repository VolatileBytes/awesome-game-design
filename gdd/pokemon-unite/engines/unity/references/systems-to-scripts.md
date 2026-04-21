# Systems → Scripts Map

## Namespaces

- `Game.Sim` — deterministic MOBA sim
- `Game.View` — presentation
- `Game.Net` — networking
- `Game.Data` — ScriptableObjects
- `Game.Meta` — menus, shop, items

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | App init, auth, addressables |
| `SceneRouter` | MonoBehaviour | Menu ↔ Match transitions |
| `Matchmaker` | class | Queue, MMR, region routing |
| `Match` | MonoBehaviour | Root of match scene |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Match` | class | Root deterministic sim |
| `Sim.PokemonInstance` | class | Runtime Pokémon: HP, XP, level, moves, cooldowns |
| `Sim.WildInstance` | class | Wild Pokémon AI + state |
| `Sim.ProjectileInstance` | struct | Projectile physics |
| `Sim.AuraInstance` | struct | Active buff/debuff |
| `Sim.GoalInstance` | class | Team goal HP + score tracking |
| `Sim.ObjectiveInstance` | class | Boss monsters (Drednaw, etc.) |
| `Sim.PokemonSystem` | function | Tick movement + attack + cooldowns |
| `Sim.ProjectileSystem` | function | Tick projectile movement + hits |
| `Sim.ObjectiveSystem` | function | Objective spawning + contest |
| `Sim.XPSystem` | function | Award XP on kills |
| `Sim.EnergySystem` | function | Energy pickups + dunks |
| `Sim.ScoreSystem` | function | Goal damage + break tracking |

## Pokémon Abilities

| Class | Kind | Responsibility |
|---|---|---|
| `PokemonDefinition` | ScriptableObject | Pokémon metadata + moves + stats |
| `MoveDefinition` | ScriptableObject | Move data + effect ref |
| `MoveEffect` (base) | abstract | Execute on cast |
| `ChargedAttackMove`, etc. | MoveEffect impl | Per-move logic |
| `UniteMoveDefinition` | ScriptableObject | Unite move data |
| `UniteMoveEffect` (base) | abstract | Ultimate execution |
| `HeldItemDefinition` | ScriptableObject | Held item metadata + stats |
| `HeldItemEffect` (base) | abstract | Passive effect hook |
| `BattleItemDefinition` | ScriptableObject | Battle item (consumable) |
| `BattleItemEffect` (base) | abstract | Active use hook |

## Objectives

| Class | Kind | Responsibility |
|---|---|---|
| `ObjectiveController` | abstract | Spawn timing, OnKill effects |
| `DrednawController` | ObjectiveController | Drednaw boss |
| `RotomController` | ObjectiveController | Rotom summon |
| `ZapdosController` | ObjectiveController | Zapdos finale |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.MatchPresenter` | MonoBehaviour | Subscribe to sim events, drive view |
| `View.PokemonView` | MonoBehaviour | Pokémon GameObject: animator, lerp, VFX |
| `View.HealthBar` | MonoBehaviour | HP/shield bar above head |
| `View.EvolutionAnimator` | MonoBehaviour | Mid-match evolution visual |
| `View.UniteCinematic` | MonoBehaviour | Unite cast cinematic |
| `View.ProjectileView` | MonoBehaviour | Projectile rendering |
| `View.VFXPool` | MonoBehaviour | Effect pooling |
| `View.CameraController` | MonoBehaviour | Cinemachine |
| `View.MinimapView` | MonoBehaviour | Minimap with pings |
| `View.GoalView` | MonoBehaviour | Goal HP bar + dunk channel VFX |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `InputReader` | ScriptableObject | Abstract input events |
| `VirtualStickLeft` | MonoBehaviour | Move stick |
| `ButtonBasicAttack` | MonoBehaviour | Basic attack |
| `ButtonMove1` | MonoBehaviour | First move |
| `ButtonMove2` | MonoBehaviour | Second move |
| `ButtonUnite` | MonoBehaviour | Unite Move |
| `ButtonBattleItem` | MonoBehaviour | Battle item |
| `PingWheel` | MonoBehaviour | Smart ping radial |
| `InputController` | MonoBehaviour | Aggregate inputs per tick |

## Networking

| Class | Kind | Responsibility |
|---|---|---|
| `Net.MatchClient` | MonoBehaviour | UDP client with reliable overlay |
| `Net.InputBuffer` | class | 60 Hz input send; 30 Hz state receive |
| `Net.StateReconciler` | class | Client prediction reconciliation |
| `Net.MatchState` | struct | Wire format for state delta |
| `Net.LagMeter` | class | RTT monitoring |

## Maps

| Class | Kind | Responsibility |
|---|---|---|
| `MapDefinition` | ScriptableObject | Arena layout + wild spawn tables + objective timings |
| `MapLoader` | MonoBehaviour | Instantiate arena + NavMesh |
| `WildSpawnTable` | ScriptableObject | Which wild Pokémon where, respawn rates |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.PokemonInventory` | class | Owned licenses + evolution progress |
| `Meta.HeldItemInventory` | class | Owned items + levels |
| `Meta.BattlePassService` | class | Tier + rewards |
| `Meta.ShopService` | class | Licenses, gems, holowear |
| `Meta.RankedService` | class | Seasonal rank tracking |
| `Meta.QuestService` | class | Daily / weekly missions |
| `Meta.EventService` | class | Limited-time events |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UIManager` | MonoBehaviour | Panel stack |
| `HUD` | MonoBehaviour | In-match HUD |
| `PokemonSelectPanel` | MonoBehaviour | Pre-match pick + items |
| `EndMatchPanel` | MonoBehaviour | Score + stats + rewards |
| `ShopPanel` | MonoBehaviour | Offers |
| `BattlePassPanel` | MonoBehaviour | Tier rewards |
| `ItemUpgradePanel` | MonoBehaviour | Held item upgrades |

## Data Flow (In-Match)

```
Input (stick + buttons)
   ↓
InputController → InputIntent (move + cast + target)
   ↓
Net.MatchClient.SendInput(intent, tick)
   ↓
Server sim tick → state delta
   ↓
Net.MatchClient.OnStateDelta → Sim.Match.ApplyDelta
   ↓
View.MatchPresenter → PokemonView.Lerp, Move VFX, HP bar update
```

## Testing

- **Sim determinism**: same inputs + seed = same outcome
- **Pokémon moves**: isolated effect tests per move
- **Objective timings**: Drednaw spawns at exactly 7:00
- **Network tests**: packet loss, latency, reconciliation
- **Balance simulations**: 1000 AI vs AI matches per Pokémon vs Pokémon combo
- **Performance**: 10v10 (really 5v5) stress, 60 FPS floor
