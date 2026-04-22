# Systems → Scripts Map — Escape from Tarkov (Unity)

Maps each system in the base GDD to concrete Unity namespaces and script classes.

## Namespace Layout

| Namespace | Purpose |
|---|---|
| `EFT.Sim` | Server-authoritative raid sim |
| `EFT.Sim.Ballistics` | Projectile physics + penetration |
| `EFT.Sim.Health` | 7-zone HP + status effects |
| `EFT.Sim.Player` | PMC + Scav player entities |
| `EFT.Sim.AI` | Scavs, Raiders, Rogues, Bosses |
| `EFT.Sim.Loot` | Container spawns + drop tables |
| `EFT.Client` | Local client runtime |
| `EFT.Net` | Session net layer + RPC + snapshots |
| `EFT.Audio` | Custom audio DSP + occlusion |
| `EFT.UI` | Meta UI + in-raid HUD |
| `EFT.Inventory` | Tetris grid + paper-doll |
| `EFT.Items` | Item defs + instances + mods |
| `EFT.Meta` | Stash + traders + hideout + quests |
| `EFT.Backend` | REST client to persistence services |
| `EFT.Save` | Local cache + reconciliation |
| `EFT.AC` | Anti-cheat hooks |

## Player Runtime

| Class | Responsibility |
|---|---|
| `Sim.Player.PlayerPMC` | PMC entity: health, inventory, weapons |
| `Sim.Player.PlayerScav` | Scav variant: different loadout rules |
| `Sim.Player.HealthController` | Per-zone HP, bleed, fracture, pain |
| `Sim.Player.StaminaController` | Arm + leg stamina |
| `Sim.Player.MovementController` | Stance, speed, vault, prone |
| `Sim.Player.SkillController` | Skill XP gain + elite tier |
| `Sim.Player.StatusEffectController` | Apply/remove bleeds, fractures, tremors |
| `Client.CameraController` | First-person + lean + ADS transition |
| `Client.ViewmodelController` | Gun viewmodel sway + bob |

## Weapons & Ballistics

| Class | Responsibility |
|---|---|
| `Items.Weapon` | Weapon item runtime + ergonomics |
| `Items.WeaponDef` | Static: caliber, recoil, ergo base |
| `Items.WeaponModSlot` | Slot definition + compatibility |
| `Items.WeaponMod` | Mod item (barrel, grip, scope, etc.) |
| `Items.AmmoDef` | Per-round: damage, pen, frag, velocity |
| `Sim.Ballistics.BulletProjectile` | Projectile with physics + raycast |
| `Sim.Ballistics.PenetrationSolver` | Roll vs armor class + durability |
| `Sim.Ballistics.FragmentationModel` | Spawn fragment child projectiles |
| `Sim.Ballistics.RicochetModel` | Angle-of-impact ricochet chance |
| `Sim.Ballistics.ArmorController` | Per-wearable armor zones + durability |
| `Client.WeaponController` | Fire input → server RPC + local VFX |
| `Client.RecoilController` | Weapon sway + recoil kick animation |
| `Client.ReloadStateMachine` | Tactical/full reload + malfunction clear |

## AI

| Class | Responsibility |
|---|---|
| `Sim.AI.AIBase` | Common state machine |
| `Sim.AI.AIScav` | Scav behavior tree |
| `Sim.AI.AIRaider` | Elite combatant AI |
| `Sim.AI.AIRogue` | USEC-turn-enemy Lighthouse AI |
| `Sim.AI.AIBoss_Reshala`, `..._Killa`, `..._Glukhar`, ... | Named boss types |
| `Sim.AI.AISensor` | Sight cone + hearing |
| `Sim.AI.AINav` | NavMesh pathing |
| `Sim.AI.AIWeapon` | AI shot timing, recoil sim |
| `Sim.AI.ScavKarmaTracker` | Player karma state |
| `Sim.AI.AIPatrolSpawner` | Map-based patrol routing |

## Inventory

| Class | Responsibility |
|---|---|
| `Inventory.InventoryController` | Root; dispatches mutations |
| `Inventory.GridContainer` | Tetris 2D grid |
| `Inventory.PaperDollSlots` | Equipped gear slots |
| `Inventory.StackRules` | Stackability + max stack |
| `Inventory.DragDropHandler` | UI → inventory action |
| `Inventory.SecureContainer` | Special container; survives death |
| `Inventory.ContainerConstraint` | Slot-type restrictions |
| `Items.Item` | Base item instance |
| `Items.ItemDef` | Static item data |
| `Items.ItemDurability` | Condition + repair |
| `Items.ItemMod` | Modding system for weapons/armor |
| `Items.ItemMerge` | Stack merge rules |
| `Items.ItemValue` | Price calculator |

## Audio

| Class | Responsibility |
|---|---|
| `Audio.AudioEmitter` | Per-source emitter |
| `Audio.AudioListener` | Per-player listener |
| `Audio.OcclusionSolver` | Geometry raycast occlusion |
| `Audio.DiffractionSolver` | Corner audio bend |
| `Audio.HRTFProcessor` | 3D spatial pass |
| `Audio.HeadphoneFilter` | Amplify + clip (in-game headphone item) |
| `Audio.FootstepEmitter` | Surface-aware footstep spawn |
| `Audio.WeaponAudio` | Fire + mechanics + tail layers |
| `Audio.HeartbeatEmitter` | Low-HP heartbeat |
| `Audio.BleedEmitter` | Heavy-bleed gurgle |

## Networking

| Class | Responsibility |
|---|---|
| `Net.RaidSession` | Server-side raid container |
| `Net.SnapshotEncoder` | World state delta compression |
| `Net.ClientPredictor` | Local movement prediction |
| `Net.Reconciler` | Snap-on-mismatch |
| `Net.LagCompensator` | Rewind for hit reg |
| `Net.ServerRPC` | Authoritative action handlers |
| `Net.NetEntityRegistry` | ID → entity mapping |
| `Net.RelevanceManager` | Per-player entity visibility |

## Meta (Stash / Hideout / Quests)

| Class | Responsibility |
|---|---|
| `Meta.StashController` | Out-of-raid inventory |
| `Meta.StashUpgrader` | Edition-dependent size |
| `Meta.HideoutController` | Module levels + upgrade |
| `Meta.HideoutModule` | Bitcoin Farm, Medstation, ... |
| `Meta.CraftingQueue` | Scheduled item production |
| `Meta.TraderController` | Trader model (stock, rep, LL) |
| `Meta.TraderRestockService` | 3-hour cadence |
| `Meta.InsuranceService` | Insure + return jobs |
| `Meta.FleaMarketService` | Player offers + search |
| `Meta.QuestController` | Quest state machine |
| `Meta.QuestDef` | Static quest definition |
| `Meta.QuestProgress` | Per-player quest progress |
| `Meta.ScavKarmaService` | Karma + Fence rep |

## Backend / Persistence

| Class | Responsibility |
|---|---|
| `Backend.AuthClient` | Steam/BSG login |
| `Backend.ProfileAPI` | GET/POST stash + quests + skills |
| `Backend.HideoutAPI` | Hideout state sync |
| `Backend.FleaAPI` | Flea offers + buy |
| `Backend.TraderAPI` | Stock + barter sync |
| `Backend.WipeService` | Wipe handling |
| `Backend.LeaderboardAPI` | Stats per wipe |

## Map / World

| Class | Responsibility |
|---|---|
| `Sim.Map.MapDefinition` | Spawns, extracts, bosses, loot tiers |
| `Sim.Map.MapLoader` | Scene load + instantiate |
| `Sim.Map.ExtractPoint` | Extract trigger + condition |
| `Sim.Map.SpawnPoint` | Per-side spawn |
| `Sim.Map.LootContainer` | Grid + drop table |
| `Sim.Map.BossSpawnController` | Boss + guards placement |
| `Sim.Map.Weather` | Dynamic weather |
| `Sim.Map.TimeOfDay` | Day/night cycle |
| `Sim.Map.Key` | Door keys; durability |

## UI

| Widget | Role |
|---|---|
| `UI.MainMenu` | Hideout root + raid start |
| `UI.StashScreen` | Out-of-raid inventory |
| `UI.TraderScreen` | Per-trader stock + barter |
| `UI.FleaScreen` | Market browser |
| `UI.HideoutScreen` | Module grid + upgrade |
| `UI.PreRaidScreen` | Map selection, extract info |
| `UI.LoadoutScreen` | Loadout save/load |
| `UI.InRaidHUD` | Minimal HUD during raid |
| `UI.RaidResults` | End-of-raid summary |
| `UI.QuestLog` | Quest tracker |
| `UI.SkillsScreen` | Skill XP + elite status |

## Anti-Cheat

| Class | Responsibility |
|---|---|
| `AC.BattlEyeIntegration` | Kernel AC wire-up |
| `AC.ServerValidator` | Impossible movement/loot detection |
| `AC.RMTDetector` | Flea-market anomaly flagging |
| `AC.BanService` | Account ban + hardware ban |

## Tests

| Test | Covers |
|---|---|
| `HealthZoneTests` | Per-zone HP + fatal cascades |
| `PenetrationTests` | Pen-vs-armor math validation |
| `FragmentationTests` | Frag spawns adjacent zones |
| `InventoryFitTests` | Tetris placement validity |
| `ReloadCancelTests` | Reload state machine |
| `AudioOcclusionTests` | Geometry-based attenuation |
| `TraderRestockTests` | Cadence + stock rotation |
| `FleaListingTests` | Post + buy + escrow |
| `InsuranceReturnTests` | Return jobs + condition preservation |
| `QuestCompletionTests` | Step progression + reward delivery |
