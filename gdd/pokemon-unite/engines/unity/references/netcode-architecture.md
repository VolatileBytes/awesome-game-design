# Netcode Architecture

Pokémon Unite is a 5v5 real-time MOBA running on mobile. Networking must support 10 players in real-time combat with fair damage resolution across varying ping profiles.

## Constraints

| Dimension | Value |
|---|---|
| Players | 10 (5v5) |
| Tick rate | 30 Hz |
| Input rate | 60 Hz |
| State broadcast rate | 30 Hz |
| Latency tolerance | 50–150 ms |
| Match length | 10 minutes |

## Server-Authoritative Sim

Standard MOBA pattern:
- Server owns the authoritative sim state
- Clients send inputs at 60 Hz
- Server runs sim at 30 Hz fixed tick
- Server broadcasts state delta to each client at 30 Hz
- Clients predict own player; interpolate others

## Client Prediction (Own Pokémon)

Prediction scope:
- **Movement**: client applies input immediately
- **Basic attack**: client plays attack animation immediately; server confirms target + damage
- **Move cast**: client plays cast VFX immediately; server confirms hit
- **Dunking**: client begins channel UI immediately; server validates + confirms

Reconciliation:
- If server position differs from predicted → rewind + replay inputs
- Cosmetic only: never teleport visually; interpolate over 100–200 ms

## Interpolation (Other Pokémon)

For the 9 non-local Pokémon:
- Buffer state updates
- Interpolate between the last 2 received states
- 100–150 ms buffer = smooth even with jitter
- **Entity interpolation** — standard pattern

## Lag Compensation

For hit detection on **ranged attacks**:
- Server timestamps all shots
- When resolving a hit, rewind enemy positions to the shooter's client-side time
- Apply damage based on where the target **appeared** from the shooter's POV
- Up to 200 ms compensation; beyond that, require lead-aim

Without this, ranged Attackers (Cinderace, Greninja) would be unusable at mobile latencies.

## Tick & Input Rates

### Client Input Rate: 60 Hz
- Send input every ~16 ms
- Bundles multiple movement frames into one packet
- **Input redundancy**: each packet carries last 3 inputs to tolerate single packet loss

### Server Tick Rate: 30 Hz
- Sim advances by 33 ms per tick
- Deterministic (fixed-point)
- Each tick: process all received inputs, step physics, broadcast state

### State Broadcast Rate: 30 Hz (to each client)
- Per-client filtered state (only entities visible to this player)
- Includes: all teammates full state, enemies visible state, visible wild Pokémon, objective state
- Fog of war is minimal in Unite but still used for invisible/stealth states

## Bandwidth

- Per client: ~20–40 KB/s in a full match
- Total match: 10 clients × ~30 KB/s = 300 KB/s per match server
- Scales well for modest server fleets

## Matchmaking

- **MMR-based**: Elo-style rating
- **Region affinity**: prefer same-region matches for low ping
- **Role filtering** (in "ranked role queue"): fill role slots properly
- **Wait time cap**: if can't find match in N seconds, expand region or difficulty

## Backfill & Bots

- Matchmaking fills with bots if real player shortage within N seconds
- Mid-match bot substitution: if a player disconnects, bot takes over (skill-matched)
- Bots are deterministic for replay purposes

## Anti-Cheat

- Server-authoritative sim: client has zero authority on combat or movement
- Server validates:
  - Move used corresponds to equipped move
  - Target in range
  - Cooldown elapsed
  - No teleport inputs (speed cap)
- **Client state hash** at checkpoints → compare with server → detect desyncs
- Input rate-limiting to prevent packet spam

## Connection Issues

### Grace Period: 20 seconds
- Player disconnects → Pokémon stays as AI-controlled bot
- 20s window to reconnect
- On reconnect: server sends snapshot + replays recent inputs

### Hard Disconnect
- Bot takes over permanently
- Match continues with 4 humans + 1 bot
- Disconnected player takes no penalty (one per day) or mild penalty after repeat

### Surrender
- Majority of team can vote to surrender after ~5 minutes
- Instant end if unanimous
- Defer if match is winnable (close score)

## Replay System

- Every match is deterministic from: initial state + seed + input log
- Stored server-side for 24 hours (regular matches)
- Longer for ranked / competitive
- Client can request replay → plays back in Match scene in "replay mode"

## Region-Aware Architecture

- Servers in major regions: NA, EU, APAC, SEA
- Matchmaking queues region-sharded
- Players matched to nearest region
- Cross-region play possible at higher ping cost

## Match Resilience

- If server crashes mid-match: all players re-routed to a restored instance with the same state (from recent snapshot)
- Acceptable: up to 10-second rollback to restore state
- Rare; but critical for player trust

## Performance Engineering

- Delta compression: only send changed entity state
- Variable-precision encoding: positions need 8-bit per axis for on-screen targets
- Priority queue: important updates sent first (local player > teammates > enemies)
- Bit-packing for keywords and small fields

## Scaling

- One server process hosts ~10–20 concurrent matches at 30 Hz
- Kubernetes or similar for auto-scaling by region + queue depth
- Matchmaking service is separate (serves all regions, low-latency)

## Anti-Patterns

- **Trusting client for hit detection** → cheat-prone
- **TCP for state** → head-of-line blocking, visible hitches
- **No lag compensation** → ranged Pokémon unplayable at >100 ms
- **Synchronized 30 Hz broadcast to all 10 players in one packet** → network spike; stagger sends
- **Over-predicting** → rubber-banding; tune prediction confidence by observed RTT
