---
id: clash-royale
title: Clash Royale — Unity Implementation
version: 0.1.0
description: Unity-specific implementation guide for a Clash Royale-style 1v1 real-time PvP card game. Targets Unity 2022 LTS, URP, server-authoritative simulation.
tags: [unity, mobile, pvp, real-time, netcode, urp]
---

# Clash Royale — Unity Implementation

Engine-specific overlay for the Clash Royale GDD. Assumes familiarity with the base [GDD.md](../../GDD.md).

## Target

- **Unity:** 2022.3 LTS or later
- **Render pipeline:** URP (3D with toon-style shaders, or URP 2D if you go flat)
- **Input:** New Input System, touch binding group
- **Platforms:** iOS + Android primary; PC/Switch secondary
- **Networking:** **Server-authoritative** simulation (see [netcode-architecture.md](references/netcode-architecture.md))

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP |
| `com.unity.inputsystem` | Touch input |
| `com.unity.cinemachine` | Impulse source for tower shake + victory cams |
| `com.unity.addressables` | Card art, unit models, tower skins loaded on demand |
| `com.unity.textmeshpro` | All UI |
| `com.unity.ugui` | Canvas, drag-drop |
| `com.unity.localization` | 20+ language support |

Third-party:
- **DOTween** — UI tweens, card hand animations
- **MessagePack-CSharp** — compact wire format for match state (faster than JSON or Protobuf in most mobile scenarios)
- **Backend**: server side, not Unity — typically a custom authoritative server in Go/Rust/C# that speaks MessagePack-over-WebSocket or a custom UDP-with-reliability layer

## Project Layout

```
Assets/
  _Project/
    Art/
      Cards/
      Units/
      Towers/
      Arenas/
    Data/
      Cards/              # ScriptableObject per card
      Decks/              # deck presets
      Arenas/             # arena configs
      Progression/        # arena thresholds, trophy curve
    Prefabs/
      Units/
      Projectiles/
      Towers/
      UI/
        CardSlot/
        HandBar/
        EmoteWheel/
    Scenes/
      Boot.unity
      Home.unity          # main menu, shop, deck builder, clan
      Match.unity         # match simulation
    Scripts/
      Core/
      Cards/
      Units/              # tanks, ranged, swarms, buildings
      Towers/
      Simulation/         # the deterministic sim for rollback/spectator
      Network/
      Matchmaking/
      UI/
      Input/
      Progression/
      Economy/
      Clan/
```

## Core Architecture

### Determinism Is Everything

Because the match is played simultaneously by two players on two devices, with a server as source of truth, the simulation **must be deterministic**. Two clients running the same input history + same RNG seed must produce identical game state.

Rules:
- **Fixed-timestep simulation** (30 Hz or 60 Hz tick, not frame-rate-dependent)
- **No `Random.Range` without a seeded RNG**
- **No floats for any position/velocity that affects gameplay** — use fixed-point (Q16.16 or Q12.20) or carefully constrained integer math
- **No unity physics for gameplay** — no Rigidbody, no Collider events. Gameplay collision is resolved by the deterministic sim.
- **No `Time.deltaTime` in the sim** — use the sim's fixed tick. Unity's `deltaTime` is non-deterministic.

### Separation of Sim and Presentation

The **simulation** (`Simulation/` namespace):
- Owns all game state: unit positions, HP, elixir, hand state
- Is pure data + functions. No MonoBehaviours. No GameObjects.
- Tickable: `Simulation.Tick(Inputs leftPlayer, Inputs rightPlayer)` advances one step.
- Serialisable to a compact state snapshot for rejoin / spectator.

The **presentation** (`View/` namespace):
- MonoBehaviours that watch the simulation and render it
- Interpolates between ticks for smooth visuals
- Plays VFX, animations, audio on sim-event callbacks
- **Has no authority.** Destroying a view GameObject does nothing to game state.

This split is non-negotiable. Without it, rollback/rejoin/spectator will never work, and you will spend years chasing desync bugs.

### Server Authority

- **Client** sends inputs (card plays with tile + timestamp) to server
- **Server** runs the authoritative sim, broadcasts state deltas to both clients + spectators
- **Clients** render from deltas; client-predicted card plays are rolled back if server rejects

See [references/netcode-architecture.md](references/netcode-architecture.md).

## Card System

Cards are `ScriptableObject`s:

```csharp
[CreateAssetMenu]
public class CardDefinition : ScriptableObject {
    public string CardId;
    public int Cost;
    public Rarity Rarity;
    public CardType Type; // Troop, Building, Spell
    public UnitDefinition UnitDef;   // if Troop
    public BuildingDefinition BuildingDef; // if Building
    public SpellDefinition SpellDef; // if Spell
    public Sprite Icon;
    public GameObject DeployVFX;
    public string[] Tags; // roles: winCondition, swarm, tank, etc.
}
```

At match start, the player's deck (8 cards) is loaded, shuffled server-side with a seed, hand initialised to the first 4.

## Unit System

Units are data, not GameObjects (in the sim). Each tick:
- Targeting: scan sim state for nearest valid target in range
- Path: compute direction toward target; move by fixed step
- Attack: if in range and attack cooldown expired, emit DamageEvent
- Death: HP ≤ 0 → remove from sim + emit DeathEvent + (if any) death spell

The view layer subscribes to `UnitSpawned`, `UnitMoved`, `UnitDamaged`, `UnitDied`, and spawns/updates/destroys a **pooled** GameObject per unit.

## Tower System

Towers are fixed sim entities with a priority target queue (nearest enemy unit, with rules). When a tower falls, the sim updates state; the view plays the collapse animation.

## Spatial Queries

At peak (both players deploying swarms), there can be ~40 units on the field. Low enough that simple O(n²) targeting scans are fine. No need for spatial hashing at this scale — a per-tick scan over all enemy units for each unit is ~1,600 comparisons, which is trivial.

## Save / Progression

- Player progression lives **server-side** (the trust model — if progression is local, cheaters can fake trophies and upgrades).
- Local client caches a **snapshot** of progression for offline viewing, but every upgrade or chest-open call hits the server.
- Save format: server-defined, usually a JSON or Protobuf blob per user.

## UI & UX Specifics

### Hand Bar

- Four card slots, left to right
- Card is a prefab: icon + cost tag + greyed-out overlay if unaffordable
- Drag-and-drop: on card drag-begin, spawn a ghost + highlight valid drop region; on release-on-arena, send `DeployIntent(cardId, tile)` to server

### Elixir Bar

- Smooth fill over time, independent of ticks (cosmetic interpolation is fine here)
- Integer bar notches for gameplay-relevant thresholds
- Sync corrections from server: if the bar leads the server, snap back

### Tower HP

- Displayed as HP number + bar
- Plays damage-shake on each hit (pooled effect)
- On tower destroyed: collapse animation, ~1.5s, blocks new drops on that side

### Emotes

- Pooled emote sprites, centred above sender's hand
- 4 emote slots, player-customisable from unlocks
- Rate-limited (3 emotes per 10s) to prevent spam

## Performance

On mobile, targets:
- **60 FPS** on mid-range devices during standard matches (20–40 units)
- **30 FPS** minimum on low-end (prioritise unit count visibility over frame rate)
- **< 200 MB** app size at launch; Addressables for arena-specific and cosmetic assets

Optimisation priorities:
- Batch UI draws (single canvas per panel, disable CanvasRaycaster on non-interactive canvases)
- Pool all units, projectiles, VFX, damage numbers
- Keep particle counts low; use URP Shader Graph tricks for hit flashes and destruction
- Bake lighting; no dynamic lights on mobile

## Common Unity Pitfalls

See [references/systems-to-scripts.md](references/systems-to-scripts.md) and [references/netcode-architecture.md](references/netcode-architecture.md). Highlights:

- Using `Time.deltaTime` in the sim → desync
- Using `Physics.OverlapSphere` for targeting → non-deterministic (physics scene order)
- Using `Random.Range` without seed → desync
- Driving state from view callbacks → desync (presentation is read-only)
- Instantiating on every spawn → GC hitches → visible jank on mobile
- One canvas per UI element → dozens of draw calls → battery drain

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Netcode Architecture](references/netcode-architecture.md)
