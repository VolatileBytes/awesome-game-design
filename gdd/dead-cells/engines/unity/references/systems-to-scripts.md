# Systems → Scripts Map — Dead Cells

## Namespaces

- `DeadCells.Sim` — 60Hz combat + movement
- `DeadCells.Sim.Generator` — biome composition
- `DeadCells.View` — rendering / animation
- `DeadCells.Data` — SOs
- `DeadCells.Meta` — blueprints, boss cells, runes
- `DeadCells.Save` — persistence
- `DeadCells.Input` — input

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | Boot, load data, open Title |
| `RunController` | MonoBehaviour | Drives a run; owns `RunState` |
| `RunState` | class | Seed, biome chain, HP, gold, cells, scrolls, gear |
| `BiomeController` | MonoBehaviour | Active biome state + loaded rooms |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.CombatState` | class | Player + enemies + projectiles + hitboxes |
| `Sim.CombatSim` | class | 60Hz fixed tick |
| `Sim.PlayerState` | class | HP, position, velocity, combo state, cooldowns |
| `Sim.EnemyState` | class | HP, AI state, position, velocity, status |
| `Sim.HitboxRegistry` | class | Active hitboxes this tick |
| `Sim.CollisionGrid` | class | Spatial hash for collision |
| `Sim.ProjectilePool` | class | Active projectiles |
| `Sim.StatusSystem` | class | Status tick + stacking |
| `Sim.WeaponController` | class | Drives weapon combo state |
| `Sim.IEnemyAI` | interface | `Tick(self, combat, dt)` |
| `Sim.PlatformerPhysics` | class | Gravity + coyote + jump |
| `Sim.Generator.BiomeGenerator` | class | Produces biome layouts |
| `Sim.Generator.RoomGraph` | class | Room connectivity |
| `Sim.SimRandom` | class | Seeded RNG streams |

## Data

| Class | Kind | Responsibility |
|---|---|---|
| `Data.WeaponDefinition` | SO | Weapon stats + combo + hit frames |
| `Data.SkillDefinition` | SO | Skill (grenade, turret, power) |
| `Data.MutationDefinition` | SO | Passive mutation effect |
| `Data.EnemyDefinition` | SO | Enemy stats + AI |
| `Data.BossDefinition` | SO | Boss phases + attacks |
| `Data.BiomeDefinition` | SO | Biome pools + exit graph |
| `Data.RoomPrefab` | Prefab | Hand-authored room |
| `Data.BlueprintDefinition` | SO | Blueprint → unlockable content |
| `Data.StatusDefinition` | SO | Status effect params |
| `Data.BossCellDefinition` | SO | Difficulty tier config |
| `Data.RuneDefinition` | SO | Permanent unlock rune |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.PrisonerView` | MonoBehaviour | Player sprite + animator |
| `View.EnemyView` | MonoBehaviour | Enemy sprite + tells |
| `View.BossView` | MonoBehaviour | Boss composite view |
| `View.ProjectileView` | MonoBehaviour | Projectile visual |
| `View.RoomView` | MonoBehaviour | Tilemap + parallax |
| `View.CameraRig` | MonoBehaviour | Cinemachine 2D |
| `View.DamageNumberPool` | MonoBehaviour | Floating numbers |
| `View.HitstopController` | MonoBehaviour | Brief freeze-frames on hit |
| `View.ScreenShake` | MonoBehaviour | Shake on impacts |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UI.HUD` | MonoBehaviour | HP, gold, cells, scroll count |
| `UI.WeaponSlotHUD` | MonoBehaviour | Weapon/skill icons + cooldowns |
| `UI.BiomeMapHUD` | MonoBehaviour | Minimap of current biome |
| `UI.MapOverview` | MonoBehaviour | Full biome chain map |
| `UI.InventoryPanel` | MonoBehaviour | Pause + gear overview |
| `UI.CollectorPanel` | MonoBehaviour | Cell spending UI |
| `UI.ShopPanel` | MonoBehaviour | Buy weapons / skills / potions |
| `UI.BlueprintPanel` | MonoBehaviour | Gallery of unlocked blueprints |
| `UI.BossCellPanel` | MonoBehaviour | Activate/deactivate boss cells for next run |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.BlueprintService` | class | Track collected blueprints + unlock state |
| `Meta.ForgeService` | class | Forge tier + weapon drop quality |
| `Meta.BossCellService` | class | BC unlock state + active set |
| `Meta.RuneService` | class | Runes found |
| `Meta.ScrollRatingService` | class | Per-biome scroll stat rating |

## Save

| Class | Kind | Responsibility |
|---|---|---|
| `Save.SaveService` | class | JSON save/load |
| `Save.ProfileData` | class | Permanent unlocks |
| `Save.RunSnapshot` | class | In-progress run |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.InputRouter` | MonoBehaviour | Gamepad/keyboard routing |
| `Input.InputBuffer` | class | 6-frame input buffer for combos |
| `Input.RemapPanel` | MonoBehaviour | Rebinding UI |

## Data Flow (Entering a Biome)

```
Player enters biome door →
   BiomeController.GenerateBiome(def, seed+floor, bossCells)
   ↓
BiomeGenerator produces RoomGraph
   ↓
Preload first 2 rooms via Addressables (async)
   ↓
Load first room (instantiate prefab, activate enemies)
   ↓
Activate player at entry spawn
   ↓
CombatSim begins ticking
```

## Data Flow (Combat)

```
Player input → InputBuffer → WeaponController
   ↓
WeaponController advances combo → activates HitboxDefinition for this frame
   ↓
CombatSim checks active hitboxes vs enemy colliders
   ↓
Hits → DamageSystem.Queue → resolve damage → spawn VFX + damage numbers
   ↓
Enemy hit reaction; AI interrupted into hitstun state
   ↓
If enemy dies → drop loot (gold, cells, blueprints with chance)
```

## Data Flow (Room Exit)

```
All enemies defeated in room →
   RoomState.Cleared = true
   ↓
Player walks to exit door →
   If exit is to next biome → transition to BiomeController for next biome
   Else → load next adjacent room
```

## Data Flow (Death)

```
Player HP ≤ 0 →
   RunController.EndRun()
   ↓
Calculate run summary: cells earned, blueprints collected, boss cells earned
   ↓
BlueprintService commits pending unlocks
   ↓
SaveService writes ProfileData; clears RunSnapshot
   ↓
GameOver scene → back to Title with summary
```

## Testing

- **Fixed-tick determinism**: seed + recorded input → identical state.
- **Hitbox correctness**: each weapon's active frames match authored data.
- **Parry window**: perfect parry only within 8–12 frames; all shields consistent.
- **Biome generation**: every seed produces valid, solvable layout.
- **Enemy AI**: state machine covers all inputs; no infinite loop.
- **Save round-trip**: ProfileData + RunSnapshot serialize/deserialize cleanly.
- **Boss Cell balance**: simulated runs at each BC have declining win rate as expected.
- **Performance**: 60fps in 25-enemy room with max VFX.
