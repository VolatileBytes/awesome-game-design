# Netcode — Counter-Strike

CS is a **client-predicted, server-authoritative** FPS with aggressive lag compensation. Netcode is the most-debated subsystem in the community.

## Tick Rate

- **CS:GO**: 64 tick default, 128 tick on Faceit/ESEA/tournaments.
- **CS2**: 64 tick with **subtick input stamping**.

At 64 tick, the server processes 64 simulation updates per second (15.6ms per tick). Everything "round" happens at tick boundaries: position updates, hit checks, state broadcasts.

## Subtick (CS2)

Subtick is Valve's answer to "tick rate is king." Each player input (fire, move, look) is stamped with a **precise timestamp** between ticks. When the server resolves the shot, it uses the exact timestamp rather than the tick boundary.

Example:
- Server tick at T=1000ms.
- Player fires at T=1003ms.
- Server processes that shot "as if" at 1003ms, not 1000ms (previous CS:GO behavior) or 1016ms (next tick).

Controversy: subtick does not completely equal 128-tick feel, because the **simulation** (enemy movement) is still at 64 tick — the target's interpolated position between ticks is only approximate.

## Client Prediction

Client performs local prediction to hide latency:

```
Client tick:
  1. Sample input (WASD, mouse, click).
  2. Predict own movement locally (runs sim step).
  3. Render frame with predicted position.
  4. Send input + prediction to server.
Server tick (server authoritative):
  5. Process inputs; step sim; broadcast state.
Client (receive):
  6. If server-reported state != predicted → snap + reconcile.
```

Players rarely notice prediction errors (snap/reconcile) because sim step is well-modeled.

## Interpolation

Remote players are drawn **N ms behind** actual server state to smooth packet loss:

- Default interp: 15.6ms (at 64 tick) to 31.25ms (buffered).
- Lower interp = more responsive but stutters on packet loss.
- Higher interp = smoother but harder to hit moving targets.

Pro setting: `cl_interp 0.015625` (minimum at 64 tick) or raise for bad connections.

## Lag Compensation

Server rewinds time when processing a shot:

```
On shot received at server time T_s:
  client_latency = T_s - client_timestamp
  lag_comp_time = T_s - client_latency (capped at 200ms)
  Rewind all player positions to lag_comp_time
  Perform hit trace
  Apply damage if hit
```

Effect: if you saw an enemy and clicked, the server agrees (within 200ms). The downside is "peeker's advantage."

## Peeker's Advantage

Because the peeker initiates the engagement, their client renders the enemy first; the defender sees the peeker N ms later (due to latency + interp).

Math:
- Peeker's local latency: ~40ms.
- Holder sees peeker: 40ms + interp (15ms) = ~55ms after peek.
- Peeker has ~55ms head start on shooting.

Valve's mitigation: server-side lag-comp for defender's shots too, and subtick. Cannot fully eliminate; physics of network asymmetry.

## Anti-Cheat Integration

- **VAC**: signature-based detection, runs per-player in background.
- **VAC Live** (CS2): streams demo snippets of suspicious players for ML analysis.
- **Trust Factor**: server-side invisible score modifies matchmaking.
- **Server-side hit validation**: client cannot force hits via packet-crafting.
- **Replay (demos)** downloaded for every match; review + report system.

## Snapshot Size

Server broadcasts to each client:
- All player positions/velocities (compressed, ~20 bytes each).
- All player view angles.
- Visible entities (grenades, bullets in flight).
- Game events (kills, round state).

Total snapshot: ~2-4 KB/s at 64 tick per player. Doubles at 128 tick.

## Bandwidth

Typical per-client bandwidth:
- Down: 50-100 KB/s.
- Up: 5-10 KB/s.

Bad connections (<20 KB/s) get choked snapshots → visible stutter.

## Client Cvars (settings)

- `rate`: max bandwidth (default 128000, tournament 786432).
- `cl_cmdrate`: input update rate (default = tick rate).
- `cl_updaterate`: snapshot receive rate (default = tick rate).
- `cl_interp_ratio`: interp as multiple of tick (default 2 — smoother, 1 = snappier).

Pros tune these for their ISP/hardware.

## CS2 Changes vs CS:GO

- **Source 2 engine**: new rendering + physics + netcode stack.
- **Subtick**: described above.
- **Smoke grenades**: volumetric, physics-interactive (bullets can clear paths through smoke).
- **Animations on-network**: more accurate remote-player animations (fewer "peeker's advantage" shots missing).
- **Responsive HUD / UI**: instant buy menu feedback.

## Demos & Replay

Every match auto-records a `.dem` file. Tools:
- **Demo Viewer**: in-game replay with free-cam, slow-mo.
- **Overwatch**: community jury analyzes demos to ban cheaters.
- **Third-party tools**: HLAE (movie-making), Leetify (analysis).

## Hit Registration Controversies

Common complaints:
- "Headshot didn't register" — usually client's view lagged behind server's hitbox state.
- "Through wall hit" — usually lag-comp rewound target into a position where a wallbang was valid.
- "Bullet hit air" — rare bug; client-server desync.

Valve publishes detailed post-mortems on hitreg incidents.

## Implementation Primitives

For a reimplementation, the core types would be:

```
Tick { index: int; time_ms: double; }
InputSample { tick: int; timestamp_subtick: int; move: Vec2; aim: Vec2; buttons: u32; }
Snapshot { tick: int; players: PlayerState[]; entities: EntityState[]; events: GameEvent[]; }
RewindableWorld { snapshots: CircularBuffer; getStateAt(time_ms) -> WorldState; }
HitTrace { origin: Vec3; dir: Vec3; max_dist: float; ignore_entity: EntityId; }
```

Server loop:
```
every tick:
  receive inputs (batched, subtick-stamped)
  step sim (64 Hz)
  broadcast snapshot (64 Hz)
  on shot:
    rewind to input.subtick_timestamp - client_latency
    hit_trace(origin, dir)
    apply damage / fire event
    restore to current
```

## Balance Probes

- Hit registration accuracy: >99% at <50ms ping.
- Peeker's advantage: ~55ms ideal (floor on physics).
- Sniffing cheats detection: VAC catches blatant, Overwatch + ML catches sneaky.
- Connection parity: 128-tick vs 64-tick subtick aim-duel win-rate within 2%.

## Rejected Patterns

- **Client-authoritative hit registration**: trivially exploited.
- **128-tick without subtick**: just bandwidth, not latency improvement.
- **Server-side aim smoothing**: removes player precision.
- **Hitbox snap-to-head assist**: console-only; PC CS refuses.
