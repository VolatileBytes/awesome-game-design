# Netcode — Helldivers 2

Helldivers 2 uses a **host-authoritative P2P** model for missions, with a centralized galactic-war backend for persistent state.

## Session Model

### Mission Instance (P2P)

- 4 players max.
- **Host** = the player who started the mission.
- Other players **connect as clients** via P2P (NAT punch + optional relay).
- Host runs all authoritative sim (enemies, world, objectives).
- Clients send inputs, receive snapshots.

On **host disconnect**: Arrowhead's "migration" is limited. Early launch: session ended. Post-patch: some cases attempt migration, with spotty success.

### Ship Hub (Singleton)

Each player's ship is **single-player only**. You visit your own ship in solo instance. Multiplayer is only active in-mission.

Friends visible via **system-level party** or ship-hub invites.

### Galactic War (Persistent backend)

- Server-side service tracks all planet liberation %, major orders, faction offensives.
- Each mission completion POSTs contribution to backend.
- Backend aggregates community totals every minute/hour.
- Players pull current state on ship hub entry.

## Replication Model

### Entities

- **Authoritative**: enemies, objectives, stratagem beacons, samples, vehicles.
- **Host-replicated**: enemy AI state, position, HP.
- **Client-simulated**: primary weapon bullets (client predicts, host confirms hit).

### Network Reliability

- UDP for snapshots (unreliable).
- TCP/reliable channel for critical events (player death, mission complete).

### Host Simulation Load

Host runs:
- ~200+ enemy AIs at peak.
- Stratagem physics (orbital projectiles, Eagle planes).
- World state (fires, smoke, destructible).
- Player positions + client reconciliation.

On low-spec host: FPS drops on Helldive difficulty as enemy density peaks.

## Bandwidth

- **Host → client**: 50-200 KB/s (high on dense fights).
- **Client → host**: 10-30 KB/s (inputs).

Peak spikes when many enemies + explosion effects.

## Stratagem Coordination

- Stratagem input: client → host (command with direction code validated by server).
- Stratagem throw: client → host (beacon trajectory + landing).
- Stratagem effect (orbital strike, Eagle, reinforcement Hellpod): host simulates fully + replicates.

No client-side stratagem fakery allowed — prevents cheats spawning extra strikes.

## Enemy AI on Host

- Patrols: spawned at map-level.
- Reinforcement calls: host-authoritative (client hears but can't spawn).
- Dynamic wave triggers: host reads patrol state and game clock.
- Pathfinding: nav-mesh on host.

## Friendly Fire Resolution

Host resolves damage from all sources. Friendly-fire is computed server-side; no way to disable per-client.

## Reinforcement Flow

1. Dead player presses ESC / select menu.
2. Request reinforcement from squad stratagem.
3. Squadmate inputs reinforce code, throws beacon.
4. Host spawns Hellpod at beacon + schedules arrival.
5. Replicates to clients.
6. Dead client takes control of new Helldiver.

## Sample & Loot Sync

- Samples on ground are authoritative on host.
- Pickups broadcast as events.
- On extraction success, samples "banked" via host → backend on mission end.
- On mission fail: samples lost.

## Crash / Disconnect Handling

- **Client disconnect**: Helldiver ragdoll stays, marked as disconnected. Can rejoin within a window.
- **Host disconnect**: mission ends for all (historically); rewards prorated or lost.
- **Crash on extraction**: samples sometimes save to backend via last checkpoint; inconsistent.

## Backend Services

- **Steam/PSN auth**.
- **Warbond & Super Credit ledgers**.
- **Galactic War state service** (liberation % per planet).
- **Major Order service** (current objective + progress).
- **Telemetry service** (mission metrics → Arrowhead ops team).
- **Matchmaking service** (public dive lobbies).

## Matchmaking

- **Quickplay**: backend matches player to a dive-in-progress based on planet + difficulty filter.
- **SOS Beacon**: in-mission, players can broadcast "needs a 4th" → quickplay injects.
- **Friends**: Steam/PSN party + invite.
- **Public lobby**: browse open dives.

## Performance Notes

- Enemy density at Helldive pushes hosts to 60fps floor.
- Dedicated server (not shipped publicly): internal tests showed ~2-3x enemy headroom; not chosen for business reasons.
- PS5 hosting: generally smoother than low-spec PC hosting.

## Anti-Cheat

- **nProtect GameGuard (GameGuard)**: kernel-level anti-cheat on PC.
- Controversial due to kernel access; some players disabled on principle.
- Stratagem/input validation on host; client cannot force effects.

## Known Issues / Controversies

- **Extraction crash**: samples lost when extraction fails; often rage-quit catalyst.
- **Host migration limits**: still not fully robust.
- **Premium Warbond sync**: occasional backend lag in crediting purchases.
- **Anti-cheat rootkit concerns**: Arrowhead has addressed but retained GameGuard.

## Implementation Primitives (for a reimplementation)

```
Session {
    hostId: PlayerId
    players: PlayerState[4]
    instance: MissionInstance
    authCanonical: bool   // host always true
}

MissionInstance {
    seed: uint64
    planet: PlanetId
    missionType: MissionType
    difficulty: int
    state: ActiveSim
    clock: MissionClock  // 40 min budget
}

NetworkChannel {
    reliable: Queue<Command>
    unreliable: RingBuffer<Snapshot>
    rttMs: int
    jitterMs: int
}
```

Host tick (20-30Hz for sim, 60Hz for rendering):
```
every sim tick:
  receive inputs from all clients
  apply inputs
  step enemy AI
  step projectiles
  resolve hits
  broadcast snapshot delta to all clients
  fire reliable events (deaths, plant, extract ready)
```

## Balance Probes

- Host CPU headroom at Helldive: must sustain 60fps on mid-tier CPU.
- Bandwidth cap: 250 KB/s downlink for clients.
- Latency budget: <120ms for acceptable stratagem input feel.
- Rollback / prediction: none (accepts visible enemy rubber-banding on high latency).

## Rejected Patterns

- **Dedicated servers**: cost; rejected for now.
- **Full state rewind on client disconnect**: prohibitive cost; just drop the session.
- **Client-authoritative kills**: exploitable.
