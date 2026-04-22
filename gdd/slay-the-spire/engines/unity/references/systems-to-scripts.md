# Systems → Scripts Map — Slay the Spire

## Namespaces

- `Spire.Sim` — pure-data combat simulation
- `Spire.Sim.Map` — branching map generator + state
- `Spire.View` — presentation and animation
- `Spire.Data` — ScriptableObjects
- `Spire.Meta` — ascension, unlocks, run state
- `Spire.Save` — persistence
- `Spire.Input` — pointer/keyboard routing

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | Load data, boot save, transition to title |
| `SceneRouter` | MonoBehaviour | Scene transitions (Combat ↔ Map ↔ Event ↔ Shop ↔ Rest) |
| `RunController` | MonoBehaviour | Drives a single run, owns `RunState` |
| `RunState` | class | Character, ascension, seed, floor, deck, relics, gold, HP |

## Simulation

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.CombatState` | class | Authoritative combat snapshot |
| `Sim.CombatSim` | class | State transitions; yields `CombatEvent`s |
| `Sim.CardInstance` | class | Runtime card (def + upgraded flag + id) |
| `Sim.PlayerState` | class | HP, block, status, energy, relics |
| `Sim.EnemyState` | class | HP, block, status, intent, AI |
| `Sim.EffectExecutor` | class | Runs an effect graph against `EffectContext` |
| `Sim.EffectContext` | class | Source card, target, state pointer, rng |
| `Sim.IEnemyAI` | interface | `ChooseIntent(self, combat)` |
| `Sim.StatusRegistry` | class | Status type definitions + hooks |
| `Sim.CombatEvent` | struct | Event stream for View consumption |
| `Sim.SimRandom` | class | Seeded RNG |

## Map

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Map.MapGenerator` | class | Act map generation |
| `Sim.Map.MapState` | class | Nodes, player position, visited set |
| `Sim.Map.MapNode` | class | Type, position, connections |
| `Sim.Map.PathValidator` | class | Enforce layout rules (elite spacing, rest placement) |

## Data

| Class | Kind | Responsibility |
|---|---|---|
| `Data.CardDefinition` | ScriptableObject | Card metadata + effect graph |
| `Data.EffectNode` | ScriptableObject (abstract) | Atomic card effect |
| `Data.RelicDefinition` | ScriptableObject | Relic + trigger hooks |
| `Data.EnemyDefinition` | ScriptableObject | Stats, sprites, AI ref |
| `Data.EventDefinition` | ScriptableObject | Narrative event, choices, outcomes |
| `Data.PotionDefinition` | ScriptableObject | Potion effect |
| `Data.CharacterDefinition` | ScriptableObject | Starting deck + starting relic + portrait |
| `Data.CardPool` | ScriptableObject | Class card pool + rarity weights |
| `Data.AscensionModifier` | ScriptableObject | A1–A20 rule deltas |

## View

| Class | Kind | Responsibility |
|---|---|---|
| `View.CombatView` | MonoBehaviour | Consumes `CombatEvent`s, drives child views |
| `View.HandView` | MonoBehaviour | Card layout, drag, drop |
| `View.CardView` | MonoBehaviour | Renders one card |
| `View.EnemyView` | MonoBehaviour | Sprite + intent + HP bar |
| `View.IntentIcon` | MonoBehaviour | Icon + number display |
| `View.PlayerView` | MonoBehaviour | Portrait + HP + block |
| `View.StatusIconTray` | MonoBehaviour | Status badges |
| `View.DamageNumberPool` | MonoBehaviour | Floating numbers |
| `View.TooltipLayer` | MonoBehaviour | Keyword tooltips |
| `View.CombatLog` | MonoBehaviour | Event scroll |

## Map View

| Class | Kind | Responsibility |
|---|---|---|
| `Map.MapView` | MonoBehaviour | Render branching map |
| `Map.MapNodeView` | MonoBehaviour | Individual node icon |
| `Map.PathLine` | MonoBehaviour | Connection between nodes |
| `Map.PlayerMarker` | MonoBehaviour | Current position |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `UI.HUD` | MonoBehaviour | Turn, energy, deck/discard/exhaust counts |
| `UI.DeckView` | MonoBehaviour | Modal: all cards in deck |
| `UI.RelicTray` | MonoBehaviour | Relic bar with tooltips |
| `UI.PotionBelt` | MonoBehaviour | Potion slots |
| `UI.CharacterSelectPanel` | MonoBehaviour | Character + ascension selection |
| `UI.EventPanel` | MonoBehaviour | Narrative event UI |
| `UI.ShopPanel` | MonoBehaviour | Buy cards/relics/potions, remove card |
| `UI.RestPanel` | MonoBehaviour | Heal vs Upgrade choice |
| `UI.RewardPanel` | MonoBehaviour | Post-combat rewards |
| `UI.GameOverPanel` | MonoBehaviour | End-of-run summary |

## Meta

| Class | Kind | Responsibility |
|---|---|---|
| `Meta.UnlockService` | class | Track floors-played, unlock thresholds |
| `Meta.AscensionService` | class | Per-character highest cleared tier |
| `Meta.AchievementService` | class | Achievements + unlock hooks |
| `Meta.DailySeedService` | class | Daily climb seed + modifier stack |

## Save

| Class | Kind | Responsibility |
|---|---|---|
| `Save.SaveService` | class | Load/save profile + in-progress run |
| `Save.ProfileData` | class | Unlocks, highest ascensions, stats |
| `Save.RunSnapshot` | class | Full serializable run state |

## Input

| Class | Kind | Responsibility |
|---|---|---|
| `Input.CardDragHandler` | MonoBehaviour | Drag card from hand |
| `Input.TargetSelector` | MonoBehaviour | Line-draw to enemy |
| `Input.HotkeyRouter` | MonoBehaviour | 1–5 play, E end turn, M map |

## Data Flow (Combat)

```
Player drags card onto enemy
   ↓
Input.CardDragHandler → CombatView.PlayCard(card, target)
   ↓
Sim.CombatSim.PlayCard(card, target)
   ↓
EffectExecutor runs card's effect graph
   ↓
Events emitted: CardPlayed → DamageDealt → StatusApplied → …
   ↓
View.CombatView consumes events:
   CardView.Fly → DamageNumberPool.Spawn → EnemyView.Flash → StatusIconTray.Update
   ↓
If enemy HP ≤ 0: EnemyDeath event
   ↓
If all enemies dead: CombatEnded → transition to reward panel
```

## Data Flow (Map → Combat)

```
MapView shows current act
   ↓
Player clicks reachable node
   ↓
RunController.EnterNode(node)
   ↓
Based on node type: load Combat.unity / Event.unity / Shop.unity / Rest.unity
   ↓
On node completion, SaveService writes snapshot
   ↓
Return to Map.unity with player advanced one row
```

## Data Flow (Run Start)

```
Title → CharacterSelect
   ↓
Pick character + ascension tier (capped by unlocks)
   ↓
RunController.NewRun(character, ascension, seed)
   ↓
Initialize deck (starter cards), starting relic, starting potions
   ↓
MapGenerator.Generate(act=1, seed)
   ↓
Load Map.unity
```

## Testing

- **Combat determinism**: seed + action log → identical state.
- **Card effect correctness**: snapshot-test each card against expected deltas.
- **Map generation validity**: no orphaned nodes, boss reachable, layout rules satisfied.
- **AI correctness**: each enemy's intent cycle matches known-good fixture.
- **Ascension modifiers**: A1–A20 each apply the correct delta.
- **Save round-trip**: serialize → deserialize → compare state.
- **Balance probes**: simulate 1000 runs with a greedy-play AI; report win-rate per character/ascension.
