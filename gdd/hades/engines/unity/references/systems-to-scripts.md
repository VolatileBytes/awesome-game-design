# Systems → Scripts Map — Hades

## Namespaces

- `Hades.Sim` — fixed-tick combat sim
- `Hades.Sim.Combat` — combat state + mechanics
- `Hades.Sim.Boons` — Boon subscription engine
- `Hades.Sim.AI` — enemy behavior
- `Hades.View` — presentation layer
- `Hades.Data` — ScriptableObjects
- `Hades.Narrative` — dialogue engine
- `Hades.Meta` — Mirror, Pact, relationships, contractor
- `Hades.Save` — persistence
- `Hades.Input` — input routing

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | Load data, save; transition to MainMenu |
| `SceneRouter` | MonoBehaviour | House / Combat / GameOver transitions |
| `RunController` | MonoBehaviour | Drives a single escape run |
| `RunState` | class | Seed, weapon, aspect, current region+room, HP, obol, Boons |
| `HouseController` | MonoBehaviour | Hub: NPC interactions, Mirror, contractor |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.CombatState` | class | Player + enemies + projectiles + room metadata |
| `Sim.CombatSim` | class | 60Hz fixed tick; emits `CombatEvent`s |
| `Sim.PlayerState` | class | HP, stamina/dash charges, cast ammo, Boons |
| `Sim.EnemyState` | class | HP, status, AI state pointer |
| `Sim.ProjectilePool` | class | Active projectiles |
| `Sim.Combat.DamageSystem` | class | Damage math pipeline |
| `Sim.Combat.StatusSystem` | class | Status ticking + stacking |
| `Sim.Combat.HitboxGrid` | class | Spatial hash for collision |
| `Sim.Combat.RoomClearDetector` | class | Detect all-enemies-dead → spawn reward |
| `Sim.Boons.BoonEventBus` | class | Pub/sub for Boon triggers |
| `Sim.Boons.BoonExecutor` | class | Runs Boon effect graphs |
| `Sim.AI.IEnemyAI` | interface | `Tick(self, combat, dt)` |
| `Sim.AI.AttackPatternExecutor` | class | Runs a scripted attack pattern |
| `Sim.SimRandom` | class | Seeded, stream-partitioned RNG |

## Data

| Class | Kind | Responsibility |
|---|---|---|
| `Data.WeaponDefinition` | SO | Weapon + combo + special + cast |
| `Data.AspectDefinition` | SO | Weapon variant |
| `Data.BoonDefinition` | SO | Boon effect + rarity + prereqs |
| `Data.GodDefinition` | SO | God's palette + VO bank + Call |
| `Data.EnemyDefinition` | SO | Enemy stats + AI ref |
| `Data.RoomDefinition` | SO | Room prefab ref + spawn manifest |
| `Data.RegionDefinition` | SO | Tartarus/Asphodel/Elysium/Styx config |
| `Data.NpcDefinition` | SO | NPC + dialogue queue ref |
| `Data.KeepsakeDefinition` | SO | Keepsake effect graph |
| `Data.MirrorNodeDefinition` | SO | Mirror perk |
| `Data.PactOptionDefinition` | SO | Heat condition |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.CombatView` | MonoBehaviour | Consumes `CombatEvent`s |
| `View.ZagView` | MonoBehaviour | Player sprite + animation |
| `View.EnemyView` | MonoBehaviour | Enemy sprite + status badges |
| `View.ProjectileView` | MonoBehaviour | One projectile visual |
| `View.RoomView` | MonoBehaviour | Room backdrop + lighting |
| `View.CameraRig` | MonoBehaviour | Cinemachine 2D follow + clamp |
| `View.DamageNumberPool` | MonoBehaviour | Floating damage numbers |
| `View.BoonNotificationView` | MonoBehaviour | Boon acquired toast |
| `View.CallMeterView` | MonoBehaviour | Call of the God charge meter |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UI.HUD` | MonoBehaviour | HP, cast ammo, obol, room counter |
| `UI.BoonSelectPanel` | MonoBehaviour | 3-choice Boon picker |
| `UI.CodexPanel` | MonoBehaviour | Enemies/gods/items/relations encyclopedia |
| `UI.MirrorPanel` | MonoBehaviour | Mirror of Night node tree |
| `UI.PactPanel` | MonoBehaviour | Heat conditions slider grid |
| `UI.HousePanel` | MonoBehaviour | Contractor, Fountain, NPC portraits |
| `UI.DialoguePanel` | MonoBehaviour | Caption + portrait |
| `UI.RelationshipPanel` | MonoBehaviour | Gift nectar/ambrosia to NPCs |
| `UI.PauseMenu` | MonoBehaviour | Resume, settings, quit |

## Narrative

| Class | Kind | Responsibility |
|---|---|---|
| `Narrative.DialogueEngine` | class | Queue scan, line selection |
| `Narrative.LineQuery` | class | Evaluate conditions |
| `Narrative.NpcQueueState` | class | Per-NPC playback state |
| `Narrative.VoiceDriver` | MonoBehaviour | FMOD event firing |
| `Narrative.BarkSystem` | class | In-run mid-combat lines |
| `Narrative.ConditionDSL` | class | Parse precondition expressions |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.MirrorService` | class | Darkness spend, node state |
| `Meta.PactService` | class | Heat loadout |
| `Meta.RelationshipService` | class | NPC gift state, arc stages |
| `Meta.ContractorService` | class | House upgrade state |
| `Meta.KeepsakeService` | class | Equipped keepsake, stacks |
| `Meta.UnlockService` | class | Weapon/aspect unlock tracking |

## Save

| Class | Kind | Responsibility |
|---|---|---|
| `Save.SaveService` | class | Load / autosave / manual save |
| `Save.ProfileData` | class | Permanent state |
| `Save.RunSnapshot` | class | In-progress run |
| `Save.DialogueQueueSnapshot` | class | Per-NPC queue indices |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.CombatInputRouter` | MonoBehaviour | Attack/Special/Cast/Dash/Call |
| `Input.MovementRouter` | MonoBehaviour | Left stick → velocity intent |
| `Input.AimRouter` | MonoBehaviour | Right stick / mouse → aim vector |
| `Input.UIRouter` | MonoBehaviour | Menu navigation |

## Data Flow (Combat)

```
Player inputs Attack →
  CombatInputRouter → CombatSim.QueueAttack(weapon, aim)
   ↓
CombatSim.Tick(dt):
   - Dequeue player input
   - Execute attack pattern → spawn hitboxes/projectiles
   - Tick all enemies (AI choose next action)
   - Resolve collisions
   - Apply damage via DamageSystem
   - BoonEventBus.Fire(AttackLanded) → Boons react
   - Emit CombatEvent stream
   ↓
CombatView consumes events:
   - ZagView.PlayAttackAnim
   - EnemyView.Flash
   - DamageNumberPool.Spawn
   - CallMeterView.Increase
```

## Data Flow (Room Transition)

```
All enemies dead →
   CombatSim.SpawnRoomReward() (rolls from RoomDefinition.RewardPool)
   ↓
Player touches reward urn →
   UI.BoonSelectPanel or reward-specific UI
   ↓
Player chooses → RunState updates → RoomDoor opens
   ↓
Player crosses door → RoomStreamer:
   - Load next room prefab async
   - Fade camera
   - Despawn old enemies/projectiles
   - Spawn next room enemies
   - Fade in
```

## Data Flow (Return to House)

```
Player death OR escape completion →
   RunController.EndRun(outcome)
   ↓
SaveService writes ProfileData + clears RunSnapshot
   ↓
Load House.unity
   ↓
HouseController tells DialogueEngine to scan NPCs
   ↓
NPCs with ready lines show "!" markers
   ↓
Player interacts → dialogue plays
```

## Testing

- **Combat determinism**: seed + recorded input → identical state trace.
- **Boon effect correctness**: each Boon produces expected damage/status delta.
- **Enemy AI correctness**: state-machine fixture tests.
- **Room reward distribution**: run 10,000 simulated rewards → expected weights.
- **Dialogue queue**: for each NPC, every line reachable from some precondition state; no orphans.
- **Save round-trip**: serialize → deserialize → identical state.
- **Heat combinations**: each Heat condition applies its intended delta; combinations don't conflict.
- **Frame budget**: 60fps on Steam Deck in the heaviest room (Elysium miniboss with max Boons).
