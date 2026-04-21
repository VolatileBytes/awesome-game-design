# Netcode Architecture

A Clash Royale-style game is **real-time, competitive, low-latency, server-authoritative**. Every architectural choice below serves those constraints.

## Core Choice: Server-Authoritative Simulation

There are three common netcode models. For this genre:

| Model | Verdict |
|---|---|
| **Peer-to-peer** | Unacceptable. Cheating is trivial; matchmaking is painful. |
| **Client-authoritative** | Unacceptable. Same as P2P for cheating. |
| **Server-authoritative** | The correct answer. The server runs the canonical simulation; clients predict and reconcile. |

The server owns the world. Clients send **intent** (deploy card at tile at time T). Clients render **state** (broadcast by the server).

## Server Architecture (Brief)

The server is not Unity. Typical stack:
- **Match server**: a process that runs 1–N concurrent matches, each an instance of the same deterministic C# sim (shared library with the client) or a reimplementation in Go/Rust
- **Session server**: matchmaking, trophy MMR, party
- **Account server**: auth, progression, inventory
- **Gateway**: websocket or UDP entrypoint, routes clients to a match server

For indie-scale: a single process hosting all layers is fine until ~1000 concurrent matches. Beyond that, horizontal scaling is required.

## Tick Rate

- **Simulation tick: 20–30 Hz** (33–50 ms per tick)
- **Network send rate**: same as tick, or half-tick (10–15 Hz) with aggregation
- **Client render**: 60 Hz with interpolation between ticks

Higher sim tick reduces input latency at the cost of CPU and bandwidth. 20 Hz is the minimum viable for competitive feel; 30 Hz is the sweet spot.

## Wire Format

Use **MessagePack** or Protobuf. Never JSON over the wire in a match — size and parse cost matter.

A state delta per tick contains:
- Tick number
- Elixir deltas (both players)
- Unit spawn / move / damage / death events
- Projectile spawn / hit events
- Spell cast events
- Tower HP changes
- Hand changes (card played, card drawn)

Typical delta size: 200–500 bytes per tick when something is happening, 40–80 bytes during idle periods (just elixir ticks).

## Client Prediction

The client plays deploys **immediately**, as if they succeeded. Then:
- Server may agree (arrival of authoritative confirmation) — no visible change
- Server may reject (invalid tile, not enough elixir due to server-side timing) — client rolls back visually + refunds UI

Prediction window: typically 1–3 ticks. Anything beyond must be reconciled.

### Reconciliation

When the server's authoritative state for tick T differs from the client's predicted state at tick T:
1. Revert to the last known good state
2. Re-apply inputs up to current tick using the corrected state
3. Smoothly interpolate visual positions (don't snap units) unless the divergence is too large

This is "rollback netcode" applied to RTS, not fighting games. The constraints are the same.

## Lag Compensation

- **Client clock sync**: at match start, measure RTT; offset client ticks to server ticks.
- **Input timestamp**: client timestamps each input with its client tick. Server runs the input at that tick (if reasonable) or the next tick.
- **Max lag tolerance**: 200 ms. Beyond that, the match warns the player and may drop.

## Rejoin & Spectator

Because the sim is deterministic:
- **Rejoin**: client reconnects; server sends a state snapshot + input log since that tick; client replays to catch up
- **Spectator**: server broadcasts state deltas to spectators (usually 1 tick behind for safety)
- **Replay**: save inputs + initial state; replay the sim; exactly matches the original match

## Cheating & Anti-Cheat

- **Every deploy is validated server-side**: is this player's turn? Can they afford this? Is this card in their hand? Is the tile valid?
- **No state hints to client**: the client never knows the opponent's hand, elixir, or deck cycle. If the client doesn't have the data, the client can't leak it through a cheat.
- **Speed/position hacks are impossible**: the client has no authority over any unit's position. The client's "units" are pure visual puppets.
- **Determinism detection**: two clients' hashes of the sim state every N ticks are logged server-side. Hash mismatches indicate either network loss (benign) or one client running a modified sim (malicious) — flagged for review.

## Connection Loss

- Grace period: 15 seconds. During this, the missing player's units continue under a "freeze" rule — no new deploys, elixir continues ticking, existing units continue behaviour. Some implementations auto-play a defensive card after N seconds.
- Hard disconnect: match is conceded to the connected player.
- Rejoin inside grace: automatic, no penalty.
- Rejoin after grace: match is lost; no rejoin.

## Matchmaking

- **Queue based**: player queues with a deck + trophy count; server waits for a match within ±N trophies, widening the band over time
- **Region affinity**: prefer same-region matches to minimise latency
- **Cross-region fallback**: after 30s in queue, widen region; after 60s, drop the constraint

## Scaling Budget

For indie-scale, a single mid-size VM can typically host:
- **50–100 concurrent matches** at 30 Hz with a 500-byte-per-tick average
- **5–10 matches per CPU core** for the sim
- **~10 Mbps outbound per 100 matches** (both players + 1-2 spectators each, aggregated)

Beyond that, shard matches across servers and keep the account/session layer as the only "global" state.

## Mobile-Specific Concerns

- **Battery**: 30 Hz tick on mobile is a battery drain. During steady states (few units, no recent deploys), the client can render at 30 Hz (half-rate interpolation) without sacrificing feel.
- **Background**: if the app is backgrounded, the client should disconnect and auto-rejoin on resume. Don't try to keep the websocket open in a suspended app.
- **Poor network tolerance**: predict more aggressively on 3G/4G; ease animations of units moving to disguise small desyncs.

## Tooling

- **In-engine desync visualiser**: when the server reports a desync, the client dumps its last N ticks of state to disk. Tooling compares this to the server log.
- **Match viewer**: a tool that replays any match from its input log, with a slider for tick-by-tick debugging. Essential for bug triage.
- **Automated bot load tests**: spin up 100 fake clients that play scripted matches; measure server CPU + RTT distribution.

## Anti-Patterns

- **Syncing every frame**: a 60 Hz full-state sync is overkill and wasteful. Tick + delta wins.
- **Sending opponent state to client**: even if you trust your client, the cheat community will decompile your client and dump everything. Only send what the opponent needs to render; nothing more.
- **Trusting client clocks**: client clocks are manipulable. Use server tick + client offset; never the client's `DateTime.Now`.
- **Ignoring packet loss**: 1–3% loss is normal on mobile. Use a reliable-ordered channel for critical messages (deploys, match-over) and an unreliable one for redundant state broadcasts.
- **Running the sim in MonoBehaviours**: `Update()` order is non-deterministic, `deltaTime` is frame-rate-dependent. The sim must be outside Unity's component lifecycle.
