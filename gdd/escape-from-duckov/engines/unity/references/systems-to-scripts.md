# Systems → Scripts Map — Escape from Duckov (Unity)

## Namespace Layout

| Namespace | Purpose |
|---|---|
| `Duckov.Sim` | Core simulation |
| `Duckov.Sim.Combat` | Damage, ballistics |
| `Duckov.Sim.AI` | Enemies, bosses |
| `Duckov.Sim.Loot` | Container tables, drops |
| `Duckov.Player` | Player duck systems |
| `Duckov.Inventory` | Grid + items |
| `Duckov.Items` | Item defs + mods |
| `Duckov.Raid` | Raid lifecycle |
| `Duckov.HomeBase` | Hub + vendors + crafting |
| `Duckov.Meta` | Quests + progression + skills |
| `Duckov.UI` | HUD + menus |
| `Duckov.Audio` | Quacks + SFX + music |
| `Duckov.Save` | Persistence |

## Player

| Class | Responsibility |
|---|---|
| `Player.PlayerDuck` | Root player MonoBehaviour |
| `Player.HealthController` | 4-zone HP, bleed, fracture |
| `Player.MovementController` | WASD + dodge-roll |
| `Player.StaminaController` | Sprint + breath |
| `Player.WeaponController` | Fire, reload, switch |
| `Player.StatusEffectController` | Bleed, fracture, pain timers |
| `Player.InventoryController` | Paper-doll + grid |
| `Player.TopDownCameraTarget` | Follow target for camera |
| `Player.InputDispatcher` | New Input System bindings |

## Combat / Weapons

| Class | Responsibility |
|---|---|
| `Sim.Combat.DamagePipeline` | Damage resolution |
| `Sim.Combat.PenetrationSolver` | Pen roll vs armor |
| `Sim.Combat.HitscanProjectile` | Instant hit |
| `Sim.Combat.Projectile` | Travel-time shots |
| `Sim.Combat.GrenadeProjectile` | Thrown explosives |
| `Sim.Combat.ArmorInstance` | Per-wearable durability |
| `Sim.Combat.RecoilController` | Recoil kick model |
| `Items.WeaponDef` | SO: damage, RPM, recoil, mods |
| `Items.WeaponInstance` | Runtime weapon state |
| `Items.AmmoDef` | SO: damage, pen, frag |
| `Items.MagazineInstance` | Rounds loaded |
| `Items.ModSlot` | Attachment slot def |
| `Items.AttachmentDef` | Scopes, barrels, grips, stocks, mags |
| `Items.ArmorDef` | SO: class, durability, zones |

## Enemy AI

| Class | Responsibility |
|---|---|
| `Sim.AI.EnemyAI` | Base FSM + BT |
| `Sim.AI.GruntDuck` | Basic enemy |
| `Sim.AI.TacticalDuck` | Better positioning |
| `Sim.AI.SniperDuck` | Long-range specialist |
| `Sim.AI.HeavyGunnerDuck` | LMG suppression |
| `Sim.AI.MedicDuck` | Heal allies |
| `Sim.AI.BossDuck` | Multi-phase boss |
| `Sim.AI.BossPhase` | Per-phase behavior |
| `Sim.AI.AISensor` | Sight cone + hearing |
| `Sim.AI.AINavigator` | NavMesh pathing |
| `Sim.AI.AISpawner` | Per-zone spawn config |
| `Sim.AI.DropTableDef` | Per-enemy loot table |

## Inventory / Items

| Class | Responsibility |
|---|---|
| `Inventory.GridContainer` | 2D Tetris grid |
| `Inventory.PaperDollSlots` | Equipped slots |
| `Inventory.SecurePouch` | Survives-death slot |
| `Inventory.DragDropHandler` | UI interaction |
| `Inventory.StackController` | Merge/split stacks |
| `Items.Item` | Base runtime |
| `Items.ItemDef` | SO definition |
| `Items.ItemInstance` | Runtime instance with condition |
| `Items.Consumable` | Meds, food, grenades |
| `Items.Key` | Door unlock items |
| `Items.QuestItem` | Quest-specific tagged items |

## Raid

| Class | Responsibility |
|---|---|
| `Raid.RaidController` | Lifecycle: start, timer, end |
| `Raid.ZoneDefinition` | SO: scene, enemies, loot, bosses |
| `Raid.ExtractPoint` | Trigger + conditions |
| `Raid.SpawnPoint` | Player spawn |
| `Raid.RaidResult` | Outcome: extracted, died, loot |
| `Raid.LootContainer` | In-zone lootable |
| `Raid.LootSpawner` | Populate containers per seed |
| `Raid.RaidSeedSystem` | Per-raid RNG stream |

## Home Base

| Class | Responsibility |
|---|---|
| `HomeBase.HomeBaseController` | Scene root |
| `HomeBase.StashController` | Stash UI + persistence |
| `HomeBase.VendorController` | Per-vendor stock + buy/sell |
| `HomeBase.VendorDef` | SO: personality, stock rules |
| `HomeBase.BarterTradeDef` | Barter offer definition |
| `HomeBase.WorkbenchController` | Crafting queue |
| `HomeBase.RecipeDef` | Craft recipe SO |
| `HomeBase.GardenController` | Passive resource grow |
| `HomeBase.MedbayController` | Out-of-raid HP regen |
| `HomeBase.UpgradeController` | Home Base module upgrades |

## Meta / Progression

| Class | Responsibility |
|---|---|
| `Meta.PlayerProfile` | Level, XP, skills |
| `Meta.SkillSystem` | Skill XP + level |
| `Meta.SkillDef` | SO definition |
| `Meta.QuestController` | Active quests + progress |
| `Meta.QuestDef` | SO: steps, rewards |
| `Meta.QuestStepDef` | Discrete objective |
| `Meta.VendorRep` | Per-vendor rep |
| `Meta.ZoneUnlock` | Zone access state |

## UI

| Widget | Role |
|---|---|
| `UI.HUD.HealthBar` | HP + zone indicators |
| `UI.HUD.AmmoDisplay` | Mag + reserve |
| `UI.HUD.Minimap` | Top-down mini view |
| `UI.HUD.QuestTracker` | Active objectives |
| `UI.HUD.ExtractIndicator` | Arrow + distance |
| `UI.Inventory.TetrisGrid` | Main inventory grid |
| `UI.Inventory.ItemTooltip` | Hover detail |
| `UI.HomeBase.StashScreen` | Stash grid |
| `UI.HomeBase.VendorScreen` | Shop UI |
| `UI.HomeBase.WorkbenchScreen` | Crafting UI |
| `UI.HomeBase.UpgradesScreen` | Module upgrade |
| `UI.MainMenu.MainMenuScreen` | Entry |
| `UI.PauseMenu` | In-raid pause |

## Audio

| Class | Responsibility |
|---|---|
| `Audio.DuckAudioEmitter` | Quack VO |
| `Audio.WeaponSoundController` | Per-weapon fire/reload |
| `Audio.FootstepController` | Surface-aware footsteps |
| `Audio.AmbientController` | Per-zone loops |
| `Audio.MusicDirector` | Combat stingers + calm |
| `Audio.UIAudio` | Menu clicks + stinger |

## Save / Persistence

| Class | Responsibility |
|---|---|
| `Save.SaveSystem` | Orchestrate save/load |
| `Save.SaveData` | Root serializable |
| `Save.StashSerializer` | Inventory grid → JSON |
| `Save.VendorRepSerializer` | Per-vendor serialization |
| `Save.QuestSerializer` | Quest progress serialization |
| `Save.MigrationRunner` | Version upgrades |

## Utilities

| Class | Responsibility |
|---|---|
| `Sim.SeededRandom` | Deterministic RNG |
| `Sim.EventBus` | Decoupled event dispatch |
| `Diagnostics.RaidReplay` | Event log → replay |
| `Diagnostics.FpsMonitor` | Perf HUD (dev) |

## Tests

| Test | Covers |
|---|---|
| `DamagePipelineTests` | Damage + pen + armor math |
| `InventoryFitTests` | Tetris placement |
| `WeaponFireTests` | Magazine pop + recoil + spread |
| `AISensorTests` | Sight + hearing detection |
| `LootSpawnerTests` | Deterministic from seed |
| `VendorStockTests` | Rep gate + barter resolution |
| `QuestCompletionTests` | Step progression |
| `SaveRoundtripTests` | Full save → load → verify |
| `HomeBaseUpgradeTests` | Cost + unlock flow |
