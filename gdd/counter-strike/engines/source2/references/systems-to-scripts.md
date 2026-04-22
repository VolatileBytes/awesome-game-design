# Systems → Scripts Map — Counter-Strike (Source 2)

Maps each system in the base GDD to concrete Source 2 module/class names.

## Top-Level Modules

| Module | Purpose |
|---|---|
| `csgo_server` | Dedicated server binary |
| `csgo_client` | Client binary |
| `csgo_common` | Shared sim + types |
| `csgo_panorama` | UI framework bindings |
| `csgo_audio` | Steam Audio + weapon sound events |
| `csgo_net` | Subtick protocol + snapshots |
| `csgo_ac` | VAC integration surface |

## Server-Side Sim

| Class | Responsibility |
|---|---|
| `CSGameSim` | Top-level tick loop |
| `CSMatchController` | Round state machine, halves, OT |
| `CSEconomyManager` | Loss bonus, kill rewards, caps |
| `CSRoundLogic` | Freeze time, bomb timer, win conditions |
| `CSBombManager` | Plant/defuse/detonate state |
| `CSBuyZoneManager` | Buy eligibility, freeze-time buys |
| `CSSpawnSelector` | T/CT spawn point rotation |
| `CSTeamState` | Money, score, per-team consecutive losses |

## Player & Input

| Class | Responsibility |
|---|---|
| `Player` | Per-player entity: HP/armor/inventory/money |
| `PlayerMovement` | WASD + counter-strafing + jump/crouch |
| `PlayerHitboxes` | Head/chest/stomach/arms/legs colliders |
| `SubtickInputQueue` | Buffer of subtick-stamped inputs |
| `InputApplier` | Drives movement + aim from inputs |
| `ViewAngleClamp` | Enforces yaw/pitch bounds |

## Weapons

| Class | Responsibility |
|---|---|
| `Weapon` | Base class for firearms |
| `WeaponRifle`, `WeaponSMG`, `WeaponPistol`, `WeaponSniper`, `WeaponShotgun` | Type-specific behaviors |
| `WeaponDef` | ScriptableObject-like; stats + art refs |
| `RecoilController` | Spray pattern index, recovery |
| `AccuracyModel` | Cone based on state (still/moving/air) |
| `ReloadStateMachine` | Partial/full reload flows |
| `SwitchController` | Quick-switch, deploy animations |
| `MagazineState` | Current ammo, reserve |
| `Knife` | Melee + backstab 1-shot |

## Combat Resolution

| Class | Responsibility |
|---|---|
| `SubtickResolver` | Uses input subtick-time to pick world state |
| `LagCompensation` | Rewindable history ring buffer |
| `HitTracer` | Ray vs hitbox intersection |
| `DamagePipeline` | Damage math, armor, falloff |
| `PenetrationSolver` | Bullet-through-wall damage loss |
| `HitboxRegistry` | Per-player hitbox lookup with bone transforms |

## Grenades

| Class | Responsibility |
|---|---|
| `GrenadeBase` | Projectile physics + fuse |
| `HEGrenade` | Splash damage |
| `Flashbang` | LOS angle blind calc |
| `SmokeGrenade` | Volumetric smoke volume |
| `Molotov`/`Incendiary` | Fire area, dps over time |
| `Decoy` | Scheduled fake-gunshot audio |
| `SmokeVolume` | 3D grid; bullet cut-through |
| `FireArea` | Damage + vision obscure zone |
| `GrenadePhysics` | Rubikon rigid body wrapper |

## Networking

| Class | Responsibility |
|---|---|
| `NetChannel` | Per-client reliable + unreliable |
| `SnapshotEncoder` | Delta-compress world state |
| `SnapshotDecoder` | Client-side snapshot reassembly |
| `EntityReplication` | Which entities each client sees |
| `InterpolationBuffer` | Remote player pos smoothing |
| `ClientPrediction` | Local player state prediction |
| `Reconciliation` | Snap on server-auth divergence |
| `BandwidthManager` | Rate limits, choke detection |

## Maps

| Class | Responsibility |
|---|---|
| `MapLoader` | Loads `.vmap_c` + assets |
| `BSPWorld` | Legacy brush world |
| `MeshWorld` | Source 2 mesh entities |
| `NavMesh` | Bot pathfinding |
| `PVS` | Potentially Visible Set culling |
| `BombSite` | A/B marker + eligibility |
| `BuyZone` | Spatial trigger |
| `SpawnPoint` | Team + priority |
| `RadarTexture` | 2D map image + callout labels |
| `VScriptHost` | Lua map-event hooks |

## Physics & Rendering

| Class | Responsibility |
|---|---|
| `Rubikon` | Rigid-body physics |
| `RayCast` | Instant hit, with material tag |
| `SourceRenderer` | Vulkan/DX12 forward+ |
| `ViewmodelRenderer` | First-person weapon rendering |
| `MuzzleFlashSystem` | Per-weapon flash VFX |
| `BulletTracer` | Render line per shot |
| `DecalManager` | Wall impacts |
| `VolumetricRenderer` | Smoke volume raymarch |

## Audio

| Class | Responsibility |
|---|---|
| `SteamAudioHRTF` | 3D audio backend |
| `SoundEventRegistry` | Looks up events by name |
| `WeaponSoundEvent` | Fire/reload/tail layers |
| `FootstepSystem` | Surface-aware footstep audio |
| `RadioVoiceLine` | Canned team-radio calls |
| `MusicKit` | MVP/round-end/warning stingers |
| `PlayerVoice` | Push-to-talk + proximity |

## UI (Panorama)

| Component | Role |
|---|---|
| `HUDRoot.xml` | Main HUD container |
| `Crosshair.xml` | User-configurable reticle |
| `BuyMenu.xml` | Weapon purchase screen |
| `Scoreboard.xml` | Tab-held stats |
| `KillFeed.xml` | Top-right kill events |
| `Minimap.xml` | Top-left map with player pings |
| `HealthArmor.xml` | Bottom-left vitals |
| `AmmoCounter.xml` | Bottom-right |
| `ChatBox.xml` | Team + all chat |
| `SpectatorHUD.xml` | Dead-player overlay |

## Anti-Cheat / Integrity

| Class | Responsibility |
|---|---|
| `VACClient` | Process scanning, signature match |
| `VACLiveCollector` | Demo snippet submission |
| `TrustFactorReporter` | Behavioral telemetry |
| `ServerInputValidator` | Detects impossible inputs |
| `ServerMovementValidator` | Clamps movement to sim bounds |
| `CheaterDetector` | Statistical models for flags |

## Demo / Replay

| Class | Responsibility |
|---|---|
| `DemoRecorder` | Writes `.dem` during match |
| `DemoPlayer` | Playback, scrub, slow-mo |
| `DemoIndex` | Per-round bookmarks |
| `OverwatchSubmitter` | Exports clips for jury |

## Match / Meta

| Class | Responsibility |
|---|---|
| `MatchmakingClient` | Premier / Competitive / Casual queue |
| `PremierRating` | ELO-style rating per region |
| `CompetitiveRank` | Map-specific rank (legacy) |
| `PartyManager` | Pre-made groups |
| `CommendSystem` | Friendly/teacher/leader |
| `ReportSystem` | Cheating/griefing/abuse |

## Bot AI

| Class | Responsibility |
|---|---|
| `BotController` | Per-bot state machine |
| `BotNavigator` | Nav-mesh pathing |
| `BotAimModel` | Aim difficulty curve |
| `BotEconomy` | Buy decisions by money |
| `BotRadio` | Calls out enemy spots |

## Tests

| Test | Covers |
|---|---|
| `WeaponDamageTests` | Base × hitgroup × armor × falloff |
| `SprayPatternTests` | Determinism of recoil pattern |
| `EconomyTests` | Loss bonus curve, kill rewards |
| `LagCompTests` | Rewind correctness at various ping |
| `SubtickTests` | Fractional-tick input resolution |
| `GrenadeTests` | HE splash, flash LOS, smoke volume intersection |
| `RoundStateTests` | Plant, defuse, time-out conditions |
| `MapLoadTests` | All Active Duty maps load without errors |
