# Netcode Architecture

Brawl Stars is **real-time, competitive, twitchy**. Every netcode decision flows from those constraints. See the clash-royale `netcode-architecture.md` doc for shared patterns (server authority, determinism, prediction + reconciliation). This doc focuses on what's different.

## Differences from Clash Royale

| Dimension | Clash Royale | Brawl Stars |
|---|---|---|
| Player count | 2 | 6 (3v3), 10 (showdown) |
| Input style | Discrete deploys | Continuous (movement + aim) |
| Tick rate | 20 Hz OK | 30 Hz minimum; 60 Hz for aim-sensitive brawlers |
| Input rate | ~1 Hz (deploys are rare) | 60 Hz (continuous analog) |
| Sensitivity to latency | 100-200 ms tolerable | 50-150 ms — higher latency is much more visible |
| Desync tolerance | Zero | Zero, but prediction is more needed |
| Rollback frequency | Rare (discrete events) | Common (every ~N ticks when opponents' inputs arrive late) |

## Tick + Input Rate

- **Server sim**: 30 Hz (33 ms per tick) — the baseline.
- **Client input send rate**: 60 Hz — send input twice per tick so the server always has the latest input.
- **Server state broadcast rate**: 30 Hz — one broadcast per tick.
- **Client render**: 60 Hz with smooth interpolation between received ticks.

Higher tick rates (60 Hz sim) reduce input-to-feedback latency but double server CPU and bandwidth cost. For 3v3 mobile, 30 Hz is the practical sweet spot.

## Prediction for Continuous Input

In a card game, prediction handles discrete events (play a card). In a real-time shooter, prediction handles every frame of movement.

### Client-Side Movement Prediction

- Client receives move input → applies to own brawler immediately
- Sends input to server at 60 Hz
- Server applies input at its next tick
- Server broadcasts authoritative brawler position in state delta

### Reconciliation

When the server's authoritative position for your brawler at tick T differs from what you predicted:
1. Revert your brawler to server-authoritative position at T
2. Re-apply your inputs from T forward using the corrected position
3. Smoothly interpolate visuals (don't teleport)

Divergence is most common during:
- High latency spikes
- Collision with other players (you thought you passed; server says you bumped)
- Projectile hits (you thought you dodged; server says you ate it)

## Aim + Fire

### Client-Side Fire Prediction

When the player taps fire:
- Client immediately spawns a **visual** projectile (fake, doesn't exist in sim)
- Client sends fire intent to server at the next input packet
- Server receives intent, spawns **authoritative** projectile at next tick
- Server broadcasts projectile in state delta
- Client receives the delta, **reconciles**: remove visual ghost, spawn authoritative, interpolate backward in time if needed

### Dealing with Fire Delay

- Server has the latency. Authoritative fire is ~50–150 ms after your tap.
- Client-side ghost masks this latency; players feel responsive even though the sim is delayed
- **Hit registration** is server-side — if the authoritative sim says you missed, you missed, even if the visual showed a hit

This is **CS:GO / Overwatch-style** prediction, not rollback fighting-game-style.

## Lag Compensation

For shooter genres, **lag compensation** is the key netcode move:
- Server time-stamps all inputs
- When a shot is processed, server **rewinds** enemy positions to the shooter's client-side time
- Checks if the shot would have hit from the shooter's perspective
- If yes, apply damage

Without lag compensation: a 150 ms ping means the enemy is actually 150 ms ahead of what you see → you'd need to lead aim by 150 ms × their speed → unplayable on mobile networks.

With lag compensation: you see where they were, you shoot, the server confirms from your perspective, damage applies.

### Range of Valid Lag Compensation

- **≤ 100 ms**: compensated, always
- **100–200 ms**: compensated with dampening (partial damage or skew toward defender)
- **> 200 ms**: not compensated (too exploitable); shooter must lead aim

## Server Tick Rate vs Network Update Rate

| Rate | Typical |
|---|---|
| Server sim tick | 30 Hz |
| Client input send | 60 Hz |
| Server state send (to each client) | 30 Hz |
| Client interpolation | renders at 60 Hz, lerps between received ticks |

Network bandwidth per client: ~5–15 KB/s in a full match. 6 clients × 10 KB/s average = 60 KB/s per match. Scales well.

## Matchmaking & MMR

- **Trophy-based** matchmaking (with brawler-level fuzziness)
- **Region affinity** — prefer same-region matches
- **Match fills with bots** if real players can't be found within N seconds

For Power League:
- **Skill-based MMR** (Elo-ish) — more sensitive than trophy
- **Draft**: ban-pick 3v3 tournament-style, turn-based; synchronised across the 6 clients via a ban-pick mini-sim on the server

## Bots

Bots are **server-side** (client is just one entity client; bots run on the server).

- Deterministic AI (reproducible in replays)
- Scripted behaviour tree per bot difficulty
- **Mid-match bot substitution**: if a player disconnects, server replaces them with a bot (with a subtle visual tell like a controller icon on their portrait)

## Anti-Cheat

Same principles as clash-royale:
- Server-authoritative sim; client has no authority
- Server validates all inputs (you can't fire a weapon you don't have; you can't shoot through walls; you can't move at impossible speeds)
- Hash-comparison between client and server state at checkpoints → flag desyncs
- Rate-limit inputs to prevent packet-spam DOS

## Replay

- Every match is replayable
- Input log + seed + initial state → deterministic re-simulation
- Stored server-side for ~24 hours (for regular matches); longer for ranked and shared
- Client can request a replay and play it back in the Match scene in "replay mode"

## Connection Loss

- **Grace period**: 20 seconds. Player's brawler stays as AI-controlled bot during this window.
- **Rejoin**: client reconnects; server sends state snapshot; client replays recent inputs; resumes.
- **Hard disconnect**: bot substitution permanent, match continues
- **On the main menu/lobby**: 30 s grace, auto-backgrounded → retry reconnect on foreground

## Scaling

- One server process can host ~20 concurrent matches at 30 Hz with moderate CPU
- Shard by region first, then by server generation
- Matchmaking queue is shared across shards per region

## Anti-Patterns

- **Trusting client hit detection**: shooter cheats would trivially spawn hits
- **Non-deterministic sim**: makes replays impossible and anti-cheat weak
- **Ignoring jitter**: mobile networks are jittery; robust input buffering is critical
- **Rushed prediction**: over-predicting (applying client input too aggressively) causes rubber-banding under poor net conditions — players feel broken. Tune prediction confidence based on observed RTT.
- **Using TCP** for real-time state broadcasts: TCP head-of-line blocking causes visible hitches. Use UDP with a custom reliable-ordered channel only for critical messages.
