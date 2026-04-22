# Systems → Scripts Map — Risk of Rain 2

## Namespaces

- `RoR2.Sim` — gameplay sim
- `RoR2.Net` — netcode wrappers
- `RoR2.View` — camera, VFX, animation
- `RoR2.Data` — ScriptableObjects
- `RoR2.Meta` — unlocks, artifacts, eclipse
- `RoR2.Save` — profile persistence
- `RoR2.Input` — input routing
- `RoR2.UI` — HUD, menus

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | Boot, load data, open title |
| `LobbyController` | MonoBehaviour | Host/client lobby; survivor select |
| `RunController` | MonoBehaviour (server) | Drives entire run; stage transitions |
| `RunState` | class (server) | Players, seed, current stage, difficulty time, artifacts |
| `StageController` | MonoBehaviour (server) | One stage: chest/shrine/teleporter spawns, enemy director |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.CombatTick` | MonoBehaviour | 30Hz fixed tick |
| `Sim.EnemyDirector` | class (server) | Spawn waves based on difficulty + stage |
| `Sim.DifficultyClock` | class | Difficulty coefficient curve |
| `Sim.PlayerState` | class | HP, inventory, cooldowns |
| `Sim.EnemyState` | class | HP, level, active AI |
| `Sim.ProjectilePool` | class | Pooled projectiles |
| `Sim.HitCheckSystem` | class | Raycasts / overlaps |
| `Sim.DamageSystem` | class | Damage pipeline (crit, proc chain) |
| `Sim.ProcChainExecutor` | class | Chain-trigger items |
| `Sim.StatusSystem` | class | Burn, Bleed, Slow, Shock, Weak |
| `Sim.ItemEffectBus` | class | Pub/sub for item triggers |
| `Sim.TeleporterController` | class | Charge progress + wave pacing |
| `Sim.ShrineController` | class | Shrine interactions |
| `Sim.ChestController` | class | Chest open / loot drop |
| `Sim.IEnemyAI` | interface | per-enemy brain |
| `Sim.SimRandom` | class | Seeded streams |

## Net

| Class | Kind | Responsibility |
|---|---|---|
| `Net.NetworkManagerRoR` | MonoBehaviour | Session start/stop |
| `Net.PlayerNetwork` | NetworkBehaviour | Replicates player position, stats |
| `Net.EnemyNetwork` | NetworkBehaviour | Replicates enemy visual state |
| `Net.ChestNetwork` | NetworkBehaviour | Open/reveal RPCs |
| `Net.ItemPickupRpc` | static | ItemPickup RPCs |
| `Net.DamageRpc` | static | Damage events |
| `Net.TeleporterRpc` | static | Teleporter events |
| `Net.LagCompensation` | class | Server-side hit reconciliation |

## Data

| Class | Kind | Responsibility |
|---|---|---|
| `Data.SurvivorDefinition` | SO | Survivor + skills + model |
| `Data.SkillDefinition` | SO | One skill (damage, cooldown, effect graph) |
| `Data.SkillAltDefinition` | SO | Alt-skill replacement |
| `Data.ItemDefinition` | SO | Item tier + stack values + triggers |
| `Data.EquipmentDefinition` | SO | Active equipment |
| `Data.EnemyDefinition` | SO | Stats + AI |
| `Data.BossDefinition` | SO | Multi-phase boss |
| `Data.EliteDefinition` | SO | Elite prefix (Blazing, Glacial, ...) |
| `Data.StageDefinition` | SO | Stage scene ref + chest counts + enemy pools |
| `Data.ArtifactDefinition` | SO | Artifact effect |
| `Data.EclipseTierDefinition` | SO | Eclipse modifiers |
| `Data.ChallengeDefinition` | SO | Unlock condition + reward |
| `Data.LogbookEntryDefinition` | SO | Lore + stats |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.CameraRig` | MonoBehaviour | Third-person follow + aim |
| `View.SurvivorView` | MonoBehaviour | Player visual + animator |
| `View.EnemyView` | MonoBehaviour | Enemy visual + status badges |
| `View.ProjectileView` | MonoBehaviour | Projectile visual |
| `View.ExplosionPool` | MonoBehaviour | AoE VFX |
| `View.DamageNumberPool` | MonoBehaviour | Floating damage numbers |
| `View.ItemDropView` | MonoBehaviour | Dropped item visual |
| `View.ItemInventoryDisplay` | MonoBehaviour | Stacked item meshes above player |
| `View.TeleporterView` | MonoBehaviour | Charge meter visual |
| `View.EliteAuraView` | MonoBehaviour | Elite flame/ice/shock aura |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UI.HUD` | MonoBehaviour | HP, money, skill cooldowns, buff tray |
| `UI.InventoryOverlay` | MonoBehaviour | Tab to see item list |
| `UI.ItemPickupToast` | MonoBehaviour | Item-got banner |
| `UI.DifficultyBar` | MonoBehaviour | Top-right bar + label |
| `UI.ScoreboardPanel` | MonoBehaviour | 4-player scoreboard |
| `UI.PingMarker` | MonoBehaviour | Ping-tagged world markers |
| `UI.LogbookPanel` | MonoBehaviour | Enemy/item encyclopedia |
| `UI.ChallengePanel` | MonoBehaviour | Unlock tracking |
| `UI.EclipsePanel` | MonoBehaviour | Eclipse tier select |
| `UI.SurvivorSelectPanel` | MonoBehaviour | Lobby survivor + skill select |
| `UI.ArtifactPanel` | MonoBehaviour | Toggle artifacts before run |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.UnlockService` | class | Check challenges, commit unlocks |
| `Meta.LogbookService` | class | Update entries on first encounter |
| `Meta.EclipseService` | class | Track per-survivor E tier cleared |
| `Meta.ArtifactService` | class | Enable/disable for next run |
| `Meta.StatsService` | class | Lifetime run stats |
| `Meta.PrismaticTrialService` | class | Daily seeded run |

## Save

| Class | Kind | Responsibility |
|---|---|---|
| `Save.SaveService` | class | Profile save |
| `Save.ProfileData` | class | See unity/GDD.md schema |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.InputRouter` | MonoBehaviour | KBM + gamepad |
| `Input.BindingPanel` | MonoBehaviour | Rebind keys |

## Data Flow (Stage Load)

```
RunController.TransitionToNext() →
   Pick next stage (seeded roll from valid slot)
   ↓
Server tells all clients to load stage scene via Addressables
   ↓
Clients confirm; server teleports players to spawn
   ↓
StageController spawns chests/shrines/teleporter based on stage def
   ↓
EnemyDirector begins wave schedule driven by DifficultyClock
```

## Data Flow (Combat Hit)

```
Player fires (client) → Input.InputRouter → PlayerNetwork.FireRpc
   ↓
Server validates shot (LagCompensation)
   ↓
HitCheckSystem → enemy hit
   ↓
DamageSystem computes damage:
   base × crit × proc × ...
   Trigger ItemEffectBus for OnHit items
   ProcChainExecutor resolves proc chain (up to depth cap)
   ↓
Server broadcasts DamageRpc to all clients
   ↓
Client shows damage number + hit VFX
   ↓
If enemy HP ≤ 0: drop loot (chance roll), despawn
```

## Data Flow (Teleporter Event)

```
Player interacts with teleporter (server) →
   TeleporterController.StartCharge()
   ↓
EnemyDirector enters "teleporter mode": higher spawn rate
   ↓
Spawn boss (seeded from stage pool)
   ↓
Charge meter ticks; when 100%, all remaining enemies die
   ↓
Drop bonus items (boss drops, interactable rewards)
   ↓
Stage 5: can choose Bazaar teleporter instead
```

## Data Flow (Death)

```
Player HP ≤ 0 (server) →
   If other players alive: spectator mode
   If all players dead: RunController.EndRun()
   ↓
Post-run summary: stages, items, time
   ↓
Meta: commit stats, challenges
   ↓
Return to lobby
```

## Testing

- **Difficulty curve**: 1000 simulated runs → mean survival time; check regressions.
- **Proc chains**: no infinite loop; recursion capped.
- **Item effects**: each item × each survivor × stack 1/10/100 → expected numbers.
- **Net sync**: 4-player stress test → no desync of enemy HP or item counts.
- **Stage load time**: < 3s on SSD.
- **Elite frequency**: matches balance target per difficulty tier.
- **Multi-session**: leave + rejoin lobby; state consistent.
