# Save & Replay Architecture

Two critical persistence pillars of a CoC clone: **village state** and **attack replays**.

## Village State

### Ownership Model

- **Server holds the truth.** Every building placement, upgrade, resource change, wall segment, trap placement is validated and persisted server-side.
- **Client has a cache.** The client loads a snapshot on login and maintains it in RAM; it mirrors server changes but never originates them.
- **Optimistic UI.** When the player starts an upgrade, the UI updates immediately (grey out the building, show the timer); the server call is fire-and-forget and rolls back on error (rare).

### Wire Format

MessagePack or Protobuf, not JSON. Village blobs are ~5–50 KB; smaller on mobile networks wins.

```
VillageSnapshot {
  version: uint32
  playerId: uint64
  townHallLevel: uint8
  buildings: Building[]
  walls: Wall[]
  traps: Trap[]
  heroes: HeroState[]
  resources: Resources
  shopState: ShopState
  clanId: uint64?
  seasonPassState: PassState
  ...
}
```

### Client Cache

- LocalStorage: `Application.persistentDataPath/village_cache.msgpack`
- Refreshed on: login, after any server change, periodic refresh every N minutes
- Used for offline view: if the network is down, the player can at least see their base

### Edit Mode Persistence

When the player moves a building or changes layout:
1. Client applies the move locally
2. After a brief idle (debounce 2 seconds), the client batches changes and sends a single `VillageSync` RPC
3. Server validates (legal positions, no overlaps) and persists
4. Client confirms or rolls back

## Attack Snapshots

When the player starts an attack on a target:
1. Client requests the target's **attack snapshot**
2. Server returns a **frozen copy** of the target's village at that moment, including **CC troops donated to defence**
3. Client runs the attack in its local scene against this snapshot
4. **The target's live village is unaffected**

### Why snapshots, not live base?
- Attacks take 3 minutes. The defender might log in and move things during that window.
- A snapshot is a **deterministic fixture** — every attacker attacking base X at time T fights the same thing.
- Replays are reproducible only against a snapshot.

### Snapshot Contents

Same schema as `VillageSnapshot`, but:
- **All traps are included and visible** (the attacker doesn't know their positions until they trigger; but for replay purposes they must be in the snapshot)
- **CC troops are resolved** — the donated troops are chosen at snapshot time and stored in the snapshot
- **Heroes are included** if available (they might be upgrading — unavailable heroes are omitted)

## Replay Log

### Format

A replay log is a sequence of tick-indexed events:

```
ReplayLog {
  version: uint16
  snapshotHash: hash256   // hash of the attack snapshot
  seed: uint64            // sim seed
  events: InputEvent[]
}

InputEvent {
  tick: uint32
  kind: InputKind         // DeployTroop, CastSpell, ActivateHeroAbility, ScoutEnded
  payload: bytes          // variant payload
}
```

### Recording

- Every player input during the attack is appended to the log
- Log size: small. A typical attack has 20–60 input events. Payload is usually < 1 KB per replay.

### Playback

The sim has a `ReplayMode` that:
- Consumes events in tick order
- Ignores live input
- Ticks through the entire match
- Can fast-forward (skip to tick X) by advancing the sim without rendering

## Server Verification

Every submitted attack is **re-simulated on the server** before awarding stars and loot.

### Verification Steps

1. Receive `AttackSubmission = (snapshotHash, replayLog, seed, finalStateHash)`
2. Hash check: server's known snapshot for this attack must match `snapshotHash`. If not, reject (client tampered).
3. Run the sim with the same seed + replay log against the same snapshot.
4. Compute the final state hash.
5. Compare with client's `finalStateHash`. If match, accept. If mismatch, reject (client desync or cheat).
6. Extract scoring from final state: stars, destruction %, TH destroyed.
7. Award loot based on scoring.
8. Notify both players (attacker: results; defender: mailbox entry with replay).

### Why Hash Comparison?

- **Bandwidth**: sending the entire final state back to the server would be many KB. Hash is 32 bytes.
- **Determinism check**: if client and server both compute the same hash, we trust the client's result.

### Cheat Mitigation

- **Modified client**: a modified sim produces a different hash → server rejects.
- **Replay tampering**: if someone edits the replay to place troops at impossible tiles, the server's sim will diverge → reject.
- **Resource inflation**: server never trusts client-reported loot. Loot is computed from server's sim result.

## Replay Playback for Players

### Defender's Mailbox

After a defender is attacked:
- Mailbox entry includes: attacker name, stars, destruction %, loot stolen, **replay reference**
- Tapping the replay plays the attack in the client

### Attacker's History

Attacker can re-watch their past attacks; useful for learning.

### Sharing

- Replays can be shared via a URL: `game://replay/<replayId>`
- Opening the URL loads the replay from the server and plays it
- This is a huge content-creator feature — YouTubers use it constantly

## Storage

- Replays live on the server for ~2 weeks (default TTL)
- Shared replays are extended indefinitely (promoted to long-term storage)
- Attack snapshots live for the replay TTL
- Village snapshots are live; overwritten continuously

Storage cost per replay: ~2–5 KB. At 10M players × 1 attack/hour = 10M/hour × 5 KB × 2 weeks = ~17 TB. Expensive but tractable; compress and archive.

## Migration & Versioning

Every schema change is a potential replay invalidation risk.

- **Breaking sim changes** invalidate replays of the previous version. Gate them behind patch boundaries; archive old replays as "cannot play" with a nice message.
- **Non-breaking changes** (cosmetic, new troops that didn't exist in old replay) can still play old replays, but the UI must gracefully handle "content not available".
- **Version every replay**. The client reads the version and refuses to play an incompatible replay.

## Anti-Patterns

- **Sending the whole final state to the server**: hash comparison is cheaper and equivalent.
- **Trusting the client's reported stars/loot**: always recompute server-side.
- **Storing replays as full game-state snapshots per tick**: KB per replay becomes GB. Use input-log + seed + initial-snapshot + deterministic sim.
- **Not versioning replays**: makes sim changes unsafe; every patch becomes a replay breakage scare.
- **Replaying in real time only**: let players seek, skip, change speed. Content creators need this.
