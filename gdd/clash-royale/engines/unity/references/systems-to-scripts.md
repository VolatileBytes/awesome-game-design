# Systems → Scripts Map

Maps every system in the base GDD to Unity C# classes, ScriptableObjects, or backend services.

## Namespaces

- `Game.Sim` — deterministic simulation, pure C# (no UnityEngine)
- `Game.View` — MonoBehaviours that render sim state
- `Game.Net` — network layer (websocket, message serialisation, input submission)
- `Game.Data` — ScriptableObjects
- `Game.Meta` — menus, progression, shop, clan (not in-match)

## Core

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | Loads Addressables catalogue, auth, transitions to Home |
| `MatchRunner` | MonoBehaviour | Owns a `Sim.Match` instance + `View.MatchPresenter`; runs fixed-timestep ticks |
| `Sim.Match` | pure class | Owns all sim state. Tickable. Serialisable. |
| `Sim.MatchState` | struct | Elixir, hand, deck queue, unit list, projectile list, tower HPs |
| `Sim.Tick` | function | `(prevState, input) → newState + events` |
| `View.MatchPresenter` | MonoBehaviour | Subscribes to `MatchRunner.Events`; drives pooled view objects |

## Cards

| Class | Kind | Responsibility |
|---|---|---|
| `CardDefinition` | ScriptableObject | Card metadata, cost, type, refs to unit/building/spell defs |
| `Sim.Hand` | struct | 4 in-hand + queue positions |
| `Sim.Deck` | struct | 8-card deck, shuffled server-side |
| `Sim.DeployCommand` | struct | Input: card id + tile + timestamp |
| `View.CardSlotUI` | MonoBehaviour | One of 4 slots; handles drag-drop |
| `View.HandBar` | MonoBehaviour | Layout + hand-slide animations on plays |
| `View.NextCardPreview` | MonoBehaviour | Small preview of the card behind the hand |

## Units & Buildings

| Class | Kind | Responsibility |
|---|---|---|
| `UnitDefinition` | ScriptableObject | HP, DPS, speed, targeting, range, count, deploy time, special tags |
| `Sim.Unit` | struct | Runtime unit state: id, def ref, owner, pos, hp, target, cooldowns |
| `Sim.UnitAI` | function | Pure function: `(unit, state) → intent` (move/attack/idle) |
| `Sim.UnitSystem` | function | Runs all units per tick; resolves intents |
| `View.UnitView` | MonoBehaviour | Lerps to sim position, plays animation, spawns hit VFX |
| `View.UnitPool` | MonoBehaviour | Per-unit-def pool; `Get(defId)` returns a pooled instance |

Buildings use the same infrastructure with `Sim.Building` / `View.BuildingView`. Towers use `Sim.Tower` / `View.TowerView` with fixed positions and fall animations on death.

## Projectiles

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Projectile` | struct | Linear or homing projectile state |
| `Sim.ProjectileSystem` | function | Moves projectiles, resolves hits |
| `View.ProjectileView` | MonoBehaviour | Visual + trail |

## Spells

| Class | Kind | Responsibility |
|---|---|---|
| `SpellDefinition` | ScriptableObject | Radius, damage, effect, duration |
| `Sim.SpellCast` | struct | Deploy tile, cast time |
| `Sim.SpellSystem` | function | Applies effect after cast delay, resolves damage in radius |
| `View.SpellView` | MonoBehaviour | VFX + audio |
| `View.SpellTargetPreview` | MonoBehaviour | Placement preview (shown while dragging) |

## Arena

| Class | Kind | Responsibility |
|---|---|---|
| `ArenaDefinition` | ScriptableObject | Tile grid ref, tower positions, pathable tiles |
| `Sim.Pathing` | function | Static pathable graph (precomputed); next-tile lookup |
| `View.ArenaView` | MonoBehaviour | Loads arena prefab, positions towers, plays ambient |

Pathing uses a **precomputed graph** — not A* at runtime. The arena is small, paths are few, and every tile's "next tile toward nearest enemy tower" is a static lookup per owner.

## Elixir

| Class | Kind | Responsibility |
|---|---|---|
| `Sim.Elixir` | struct | Current value (fixed-point), max cap, rate |
| `Sim.ElixirSystem` | function | Ticks elixir up by rate; handles 2x/3x phases |
| `View.ElixirBar` | MonoBehaviour | Interpolated visual bar |

## Matchmaking & Networking

| Class | Kind | Responsibility |
|---|---|---|
| `Net.MatchClient` | MonoBehaviour | Connects to server, sends inputs, receives state deltas |
| `Net.MatchState` | struct | Wire format (MessagePack-serialised) |
| `Net.InputBuffer` | class | Queued client inputs, timestamped |
| `Net.Reconciliation` | class | Rolls back client prediction on server correction |
| `Matchmaking.Queue` | class | Enqueue for matchmaking; receives match assignment |

## Progression & Economy

All server-backed. Local is a read-only cache.

| Class | Kind | Responsibility |
|---|---|---|
| `Progression.Player` | struct (client mirror) | Trophies, arena, card levels, gold, gems |
| `Meta.CardLevelService` | class | Sends upgrade requests to server |
| `Meta.ChestService` | class | Open/skip/queue chest actions |
| `Meta.ShopService` | class | Browse, purchase offers |
| `Meta.PassRoyaleService` | class | Tier progress, claim rewards |

## Clan

| Class | Kind | Responsibility |
|---|---|---|
| `Clan.Service` | class | Join, request donation, chat, war roster |
| `Clan.ChatView` | MonoBehaviour | Chat UI |
| `Clan.DonationRequest` | UI | Request card, clanmates donate |

## UI Architecture

| Class | Kind | Responsibility |
|---|---|---|
| `UIManager` | MonoBehaviour | Stack of panels (home, deck, shop, clan, settings) |
| `DeckBuilderPanel` | MonoBehaviour | 8-slot deck composer with collection drawer |
| `MatchHUD` | MonoBehaviour | HP bars, elixir, timer, emote |
| `ResultsScreen` | MonoBehaviour | Crown counts, trophy delta, chest awarded, continue-to-home |
| `EmoteWheel` | MonoBehaviour | 4-emote radial selector |

## Data Flow (Match)

```
Input (touch drag-drop)
   ↓
InputReader → Net.MatchClient.SendDeploy(cardId, tile, clientTick)
   ↓
(Network)
   ↓
Server: validate → apply → broadcast StateDelta
   ↓
Net.MatchClient.OnStateDelta → MatchRunner.ApplyDelta
   ↓
Sim.Match state updated
   ↓
Events fired → View.MatchPresenter
   ↓
UnitPool.Get / UnitView.Update / VFXPool.Play / Audio.Play
```

Note: there is a **client-predicted** shortcut. The client can immediately play the deploy locally, then reconcile when the server delta arrives. If the server rejected the deploy, the client rolls back.

## Testing

- **Sim tests**: pure C# unit tests — given input history, assert final state. Fast, deterministic, run on every CI.
- **Replay tests**: record real match inputs, re-run the sim, check for identical output. Catches determinism regressions.
- **Desync detection**: both clients hash their sim state every tick and send the hash to the server; server logs the first mismatch tick. Critical for maintaining determinism in live patches.
- **Bot matches**: scripted AI runs hundreds of matches a night, surfaces balance outliers and crash cases.
