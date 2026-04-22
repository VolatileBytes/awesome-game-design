# Systems → Scripts Map — Helldivers 2 (Unreal)

Maps each system in the base GDD to concrete UE5 module / class names.

## Module Layout

| Module | Purpose |
|---|---|
| `HelldiversCore` | Shared types, data tables, gameplay tags |
| `HelldiversGame` | Game mode, state, mission controllers |
| `HelldiversPlayer` | Helldiver pawn, loadouts, input |
| `HelldiversStratagems` | Stratagem definitions + effects |
| `HelldiversAI` | Mass Entity AI for swarms + boss AI |
| `HelldiversWeapons` | Weapon data, damage, animations |
| `HelldiversUI` | UMG widgets, HUD, ship hub screens |
| `HelldiversAudio` | Sound events, wwise/metasounds banks |
| `HelldiversNet` | Replication graph, custom P2P, galactic war client |
| `HelldiversBackend` | REST client for war/warbonds/super-credits |
| `HelldiversSave` | Save games, persistent profile |

## Game Mode / State

| Class | Responsibility |
|---|---|
| `AHelldiverGameMode` | Mission init, player spawns |
| `AHelldiverGameState` | Mission time, reinforcements remaining, objective flags |
| `AHelldiverPlayerState` | Player level, loadout, samples held |
| `UMissionInstance` | Difficulty, planet, objectives, seed |
| `UObjective` | Base class: primary/secondary mission goals |
| `UObjectivePrimary` | Eliminate, retrieve, launch-ICBM variants |
| `UObjectiveSecondary` | Gather samples, clear nests |
| `UMissionTimer` | 40-minute budget, extraction window |
| `UReinforcementManager` | Lives pool, Hellpod scheduling |

## Player / Pawn

| Class | Responsibility |
|---|---|
| `AHelldiver` | Third-person shooter pawn |
| `UHelldiverMovement` | Sprint, dive-prone, ragdoll recovery |
| `UHelldiverCamera` | Over-shoulder + ADS snap |
| `UHelldiverLoadout` | Primary, secondary, grenade, armor slots |
| `UHelldiverAbilitySystem` | GAS integration |
| `UStratagemInputController` | Direction-key code input |
| `UStimInjector` | Stim usage + overhealth buff |
| `UArmorPassive` | Scout, servo-assisted, etc. |
| `AHellpod` | Drop pod, lands, deposits Helldiver |
| `APelican` | Extraction dropship |

## Weapons

| Class | Responsibility |
|---|---|
| `AWeaponBase` | Primary/secondary logic |
| `UWeaponDef` | Data asset: damage, pen, reload, animations |
| `ARifle`, `AShotgun`, `ASMG`, `ADMR`, `AEnergyWeapon` | Type specializations |
| `URecoilPattern` | Data-driven recoil curves |
| `UReloadStateMachine` | Partial/full reload + cancel |
| `UGrenadeBase` | Frag/impact/stun/smoke variants |
| `AProjectile` | Rockets, grenades, Eagle bombs |
| `USupportWeaponPickup` | Ground pickups from stratagem drop |
| `AExpendableLauncher` | EAT single-use launcher |

## Stratagems

| Class | Responsibility |
|---|---|
| `UStratagemRegistry` | Global registry of `FStratagemDef` |
| `FStratagemDef` | Code, CD, call-in time, effect class |
| `UStratagemInputController` | Code parsing, arm state |
| `AStratagemBeacon` | Thrown ball; physics + landing detection |
| `UStratagemEffect` | Abstract base; spawns effect on landing |
| `UEagleAirstrikeEffect` | Plane strafe + bomb drop |
| `UOrbitalStrikeEffect` | Projectile from orbit |
| `UOrbitalLaserEffect` | Sweeping beam entity |
| `USupportWeaponDropEffect` | Support weapon Hellpod |
| `USentryDropEffect` | Sentry Hellpod + turret placement |
| `UShieldGeneratorEffect` | Personal dome spawn |
| `UReinforcementEffect` | Hellpod with revived player |
| `UResupplyEffect` | Ammo/stim box drop |
| `UVehicleDropEffect` | Mech / FRV delivery |
| `AEagleAircraft` | Eagle-1 flight entity |

## Enemy AI

### Mass Entity (swarm)

| Class | Responsibility |
|---|---|
| `FTerminidFragment` | Per-bug: pos, vel, HP, type, target |
| `FAutomatonFragment` | Per-bot: pos, vel, HP, ranged attack state |
| `UTerminidMovementProcessor` | Steer + pathfind via flow-field |
| `UTerminidAttackProcessor` | Melee attacks |
| `UAutomatonAimProcessor` | Ranged aim + fire |
| `UPatrolSpawner` | Populate patrols on biome entry |
| `UPatrolCaller` | Reinforcement call mechanic |

### Boss-class Actors

| Class | Responsibility |
|---|---|
| `ABileTitan` | Boss bug; spit + stomp |
| `ACharger` | Armored melee rush |
| `AStalker` | Invisible ambush |
| `ABroodCommander` | Caller |
| `AHulk` | Walker melee |
| `ADevastator` | Rocket/gun torso-splits |
| `AFactoryStrider` | Huge walker |
| `ATank` | Stationary turret |
| `AGunship` | Flying harasser |

## Biome / Level Streaming

| Class | Responsibility |
|---|---|
| `UWorldPartitionStreamer` | Streams biome tiles around players |
| `UBiomeHazardManager` | Fire tornadoes, acid storms |
| `UWeatherController` | Visual + gameplay weather effects |
| `ANest` (Terminid) | Destructible structure |
| `AFactory` (Automaton) | Objective destructible |
| `UObjectivePlacer` | Seeded objective placement |

## Damage / GAS

| Class | Responsibility |
|---|---|
| `UDamageAbility` | Fire/hit/penetration/damage |
| `UDamageExecutionCalculator` | Armor vs pen math |
| `UArmorComponent` | Per-bone armor values |
| `UHealthComponent` | HP + regen threshold |
| `UDeathComponent` | Ragdoll + body persistence |
| `UFriendlyFireValidator` | Cross-team damage resolution |

## Network / Replication

| Class | Responsibility |
|---|---|
| `UHelldiverReplicationGraph` | Custom relevance for 200+ entities |
| `UMassNetReplicator` | Streams mass bug snapshots efficiently |
| `FStratagemCode_RPC` | Server RPC for input streams |
| `FShotFired_RPC` | Client fire → server confirm |
| `FDeath_Event` | Reliable multicast |
| `FExtract_Event` | Mission-end reliable event |

## Galactic War / Backend

| Class | Responsibility |
|---|---|
| `UGalacticWarClient` | REST client; polls state |
| `UMajorOrderWatcher` | Notifies players of order |
| `UMissionResultSubmitter` | POSTs completion |
| `UPlanetStatusCache` | In-memory world state |
| `UBackendAuthProvider` | Steam/PSN auth token mgmt |
| `UWarbondClient` | Warbond progress + unlocks |
| `USuperCreditsClient` | Currency ledger |

## UI

| Widget | Role |
|---|---|
| `WHUD_Root` | HUD parent |
| `WStratagemTray` | 4 stratagem icons + CDs |
| `WStratagemInputOverlay` | Live code entry feedback |
| `WTeamRoster` | Squad health + status |
| `WMinimap` | Top-left map, pings |
| `WObjectiveTracker` | Current primary/secondary |
| `WShipBridge` | Galaxy map + mission select |
| `WMissionBriefing` | Pre-dive loadout + difficulty |
| `WArmory` | Loadout editor |
| `WWarbondsScreen` | Battle-pass-style trees |
| `WSuperstore` | Rotating cosmetic shop |
| `WShipUpgrades` | Sample-spend tree |
| `WExtractionScreen` | End-of-mission results |

## Audio

| Class | Responsibility |
|---|---|
| `UWeaponSoundComponent` | Fire layer + tail + report |
| `UStratagemVOBank` | Per-stratagem call-in stingers |
| `UEnemyBarkSystem` | Bug roars, devastator chatter |
| `UMusicDirector` | Density-reactive music |
| `UPropagandaRadio` | Idle voice lines |
| `UFootstepSurface` | Surface-tagged footstep audio |

## Save / Profile

| Class | Responsibility |
|---|---|
| `UHelldiverProfileSave` | Level, medals, SC, warbonds |
| `UShipUpgradeSave` | Ship module levels |
| `ULoadoutPresetSave` | Named loadouts |
| `UStratagemUnlockSave` | Stratagems owned |
| `UWarbondProgressSave` | Medal spend per warbond |

## Input

| Class | Responsibility |
|---|---|
| `UEnhancedInputConfig` | Action + context mappings |
| `UStratagemInputAction` | Direction input parsing |
| `UReloadCancelHandler` | Sprint/dive cancel window |
| `UDivePromeAction` | Button hold → prone transition |

## Tests

| Test | Covers |
|---|---|
| `WeaponDamageTests` | Penetration vs armor, weak spots |
| `StratagemInputTests` | Direction code parsing |
| `StratagemCooldownTests` | Per-stratagem CD + ship upgrade modifiers |
| `PatrolCallerTests` | Reinforcement call mechanic |
| `FriendlyFireTests` | Damage applies to teammates |
| `BileTitanTests` | Boss phases + 500kg one-shot check |
| `EagleRearmTests` | Uses + rearm cycle |
| `GalacticWarTests` | Contribution math, backend sync |
