# Netcode & Deathmatch — DOOM (1993)

Doom popularized networked FPS multiplayer. The netcode is a lockstep peer-to-peer simulation: every player's input is broadcast each tic; every player's machine runs the identical deterministic simulation. Works great on LAN; struggled over modem.

## Architecture

### Lockstep Peer-to-Peer

- All 2-4 players connected full-mesh.
- Each player broadcasts input commands per tic (35 Hz).
- Each machine waits to receive all inputs before advancing the simulation.
- No server; no authority — all peers simulate identically.

### Determinism Requirement

- Game state after tic N must be identical on all machines given same starting state + same input history.
- Any desync = game breaks (monsters in different places, etc.).
- Doom's engine is carefully deterministic: integer math, fixed RNG table, no float drift.

### Tic Rate

- 35 tics/sec; ~28.57ms per tic.
- All simulation locked to tic boundaries.
- Rendering can run faster (interpolates between tics in modern ports).

### Command Packet

Per-tic packet includes:
- Forward/backward move.
- Turn angle delta.
- Strafe amount.
- Button flags (fire, use, weapon select).

Small (~16 bytes); acceptable for LAN 10 Mbps Ethernet.

### Network Medium (1993)

- **IPX LAN**: Novell NetWare protocol; default LAN option.
- **Serial cable (null modem)**: 2-player direct connection.
- **Modem dial-up**: 2-player over phone line; latency 100-300ms.
- **TCP/IP**: not supported originally; added later by source ports (DWANGO, Kali, Doomsday).

### DWANGO

- DialUp Wide-Area Network Gaming Operation.
- Long-distance multiplayer service (1994+).
- Connect via modem to regional servers → play with remote players.
- $9/mo subscription; was profitable.
- Early cloud gaming service; predated Battle.net.

## Game Modes

### Deathmatch

- Free-for-all combat; kill others to score.
- All weapons + ammo placed in map.
- Match ends: time limit OR kill limit OR manual.

### Deathmatch variants

| Setting | Behavior |
|---|---|
| `-deathmatch` | DM 1.0: weapons stay, respawn enabled |
| `-altdeath` | DM 2.0: weapons vanish on pickup, ammo respawns |
| `-skill N` | Match monster count / AI intensity (no monsters by default in DM) |

### Cooperative

- Same campaign maps, all players on same team.
- Friendly fire ON by default.
- Monster counts multiplied (monsters flagged "multiplayer" appear).
- Shared key requirements (any player picks up key = opens for all).

### Solo-net

- Single-player with multiplayer item placement (gives you "coop" items alone).
- Used for Doom II's secret levels.

## Deathmatch Mechanics

### Spawn

- Each map has `DEATHMATCH_START` things placed.
- Random spawn on match start + respawn.
- Spawn with pistol, 50 bullets.

### Respawn

- Dead player respawns at random DM spawn after ~1-2 seconds.
- Drops: no — in vanilla, weapons aren't dropped on death (ammo reset).
- Modern source ports optionally drop current weapon.

### Scoring

- +1 per kill.
- -1 for suicide (self-rocket, falling damage in some ports).
- Killing teammate in coop: no score change (friendly fire just hurts).
- Winner: first to kill limit OR highest at time expiration.

### Weapon respawn

- **DM 1.0**: weapons stay on map, always available.
- **DM 2.0 (altdeath)**: weapons picked up once; gone for match.

### Ammo respawn

- Ammo pickups regenerate after N seconds (~30s).
- Same for health, armor.

### Power-up respawn

- Soul Sphere, Mega Armor, Berserk — respawn after longer delay.
- Map control tactical: timing power-up spawns wins matches.

## Tactical Play

### Weapon Hierarchy

- **Rocket Launcher**: king of DM; splash damage covers inaccuracy.
- **Shotgun**: close-range workhorse; 1-2 shots kills at point-blank.
- **Plasma**: DPS king; drains enemy armor.
- **BFG**: rare in DM (40 cells/shot); situational.
- **Chaingun**: stunlock + sustained; mid-tier.
- **Pistol**: spawn weapon; trashed as soon as possible.

### Map Control

- Who holds the Rocket Launcher?
- Who's near the Soul Sphere on respawn?
- Who's blocking the key pickup route?

Competitive DM is about map learning — memorize item spawn timers; camp chokepoints.

### Movement tech

- **Strafe-run**: 1.4× movement speed.
- **Rocket jump**: use rocket splash to boost vertical.
- **Bobbing**: up/down sinusoidal move during run; unavoidable aim offset.

### Communication

- Pre-Voice-over-IP; communication via in-game text chat (F key) or telephones.
- Actual communication typically out-of-band (physical presence at LAN party).

## Doomworld Competitive Community

- Doomworld forums / doomworld.com: community hub since 1998.
- Speedrun community: doomedsda.us (original) → dsda.org (modern).
- Competitive DM active on modern source ports (Zandronum, Odamex).
- Modern community scales on modern server models, not P2P lockstep.

## Common Problems

### Desync

- If any machine runs different game state → desync → unplayable.
- Causes: floating-point math drift (avoided by Doom design), ptr uninit, hardware differences.
- Detection: checksums per tic; mismatch = drop.

### Latency

- Lockstep = game speed limited by slowest peer's RTT.
- Modem (150ms+ ping) made vanilla DM feel laggy.
- Mitigations: player sees own actions immediate; resolves on tic.

### Packet loss

- Lockstep requires all packets; loss = stall.
- No interpolation/prediction in vanilla.
- Modern ports: improved with retry windows.

### Cheating

- Lockstep vulnerability: one player's machine is authoritative for their input.
- Wallhacks trivial (rendering modification).
- Aimbots possible (input manipulation).
- No anti-cheat in vanilla; community self-policing.

## Source Port Netcode Evolution

### ZDoom (2.x)

- Improved netcode; higher tic rates optional.
- TCP/IP; server-client architecture option.

### Zandronum

- Modern Doom MP source port.
- Server-client with prediction.
- Anti-cheat (checksums, sv_cheats).
- Dozens of MP modes (CTF, TDM, Terminator, etc.).

### Odamex

- Focused on competitive DM accuracy.
- Adds TCP + UDP modes.
- Restores classic DM feel with modern netcode.

### Doomseeker

- Server browser for Doom-family source ports.

## Original Implementation Notes

### Network Interface

- Abstracted via `DOOMCOM` structure; hardware-specific code per medium.
- IPX: BLD/TxD driver from Doom network game setup.
- Serial: direct COM port I/O.
- All abstracted to "send packet" / "receive packet" semantics.

### No Client Prediction

- Vanilla waits for all inputs; local player's actions delayed to next tic.
- Acceptable on LAN (~1 tic latency); painful on modem.

### Save Game in Multiplayer

- Not supported in vanilla.
- Match ends, state discarded.

### Maps

- All peers must have identical WAD files (checksum validation).
- Mismatch = can't join.

## Modern Recreation

To build Doom-like multiplayer today:

### Architecture Choice

- **Lockstep**: for < 8 players, LAN/close-geography, suitable.
- **Server-authoritative**: for open internet, 16+ players, modern.

### Lockstep Modern

- UDP, tic-rate 60 Hz.
- Frame-delay: 2-3 tics for latency smoothing.
- Deterministic sim critical — use integer physics, seeded RNG.
- Rollback (optional): simulate local immediately; reconcile on packet.

### Server Authoritative

- Server holds authoritative state.
- Clients send input; receive state snapshots.
- Prediction + reconciliation for smooth local feel.
- Industry standard post-2000 (Quake III onward).

## Philosophy

### Deterministic is Debuggable

Doom's determinism makes demos possible — record all inputs, replay exactly. Speedrunning community relied on this for decades.

### Simple Networking Scales to Mess

Lockstep for 2-4 players with tight LAN works great. Scales poorly; Quake's authoritative model scales better.

### Net Code Is a First-Class Feature

Doom's MP was afterthought; it shipped functional. Later, Quake would engineer netcode as a design pillar (client prediction). Doom DM survived due to map design + fast pace more than technical sophistication.

### Modding Extended Multiplayer

Community source ports (Zandronum, Odamex) rebuilt the netcode from scratch to modern standards. Vanilla Doom DM is a historical artifact; modern Doom MP uses different engines.
