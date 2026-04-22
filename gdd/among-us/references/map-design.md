# Map Design — Among Us

Maps are the stage for deduction. Every room is authored around tasks (alibi opportunities), sight-lines (hunting grounds), vent network (impostor mobility), and security features (crew info).

## Map Design Principles

### Authored, Not Procedural

Every map is hand-tuned. Players learn layouts, vent links, task locations over hundreds of matches. Memory becomes skill.

### Isolation Pockets

Every map has rooms where a 1v1 kill can happen unwitnessed. Balanced against common-traffic rooms where kills are risky.

### Vent Economy

Vent network is the impostor's superpower. Maps vary in vent connectivity:
- Skeld: cluster-based (3 clusters of 3).
- MIRA HQ: fully-connected (all vents link).
- Polus: area-clustered (5+ clusters).
- Airship: regional (multiple disconnected networks).
- Fungle: situational (conditional vents).

### Security Features

Each map has crewmate info tools with coverage tradeoffs:
- **Skeld**: Admin (map), Cameras (4 fixed).
- **MIRA HQ**: Doorlog (list of who entered main hall), no cams.
- **Polus**: Vitals (life status), Cameras (rotating).
- **Airship**: Cameras (switch-select), Vitals.
- **Fungle**: Binoculars (player location).

Each has blind spots — no map gives full surveillance.

## The Skeld (Original)

**Setting**: small derelict spaceship.
**Size**: ~14 rooms, compact.

| Room | Notable |
|---|---|
| Cafeteria | Emergency button; spawn room; central hub |
| Medbay | Scan (visual task); vent to Upper Engine |
| Electrical | Fix Wires; dense room; kill trap |
| Admin | Admin map; Swipe Card (common) |
| Weapons | Clear Asteroids (visual); vent link |
| Security | Watch Cameras |
| Navigation | Chart Course, Stabilize Steering |
| Shields | Prime Shields |
| Communications | Download/Upload |
| Storage | Fuel Engines, Empty Garbage |
| O2 | Clean O2 Filter, Empty Chute |
| Reactor | Unlock Manifolds (dual) |
| Upper/Lower Engine | Align Engine Output, Fuel Engines |

**Vent network**: 3 clusters.
- Cluster 1: Reactor ↔ Upper Engine ↔ Security.
- Cluster 2: Medbay ↔ Electrical.
- Cluster 3: Cafeteria ↔ Admin, Weapons ↔ Navigation.

**Sabotage**: Lights (Electrical), O2 (dual: Admin + O2), Reactor (dual terminals), Comms (Comms), Doors (various).

## MIRA HQ

**Setting**: floating sky HQ.
**Size**: ~10 rooms, vertical layout.

| Room | Notable |
|---|---|
| Cafeteria | Emergency button |
| Launchpad | Long task (Start Reactor) |
| Storage | Water Plants (long task) |
| Medbay | Scan |
| Admin | Doorlog (security) |
| Communications | Download/Upload |
| Reactor | Unlock Manifolds |
| Balcony | Assemble Artifact |
| Office | Submit Reports |
| Laboratory | Assemble Artifact |

**Vent network**: fully connected — any vent to any vent. Most impostor-friendly map.

**Sabotage**: Lights, Reactor, O2, Comms. Long hall corridor is kill-trap.

**Security quirk**: No security cameras. Doorlog (tracks last 8 entries of main hallway) is only surveillance.

## Polus

**Setting**: ice-planet outpost.
**Size**: ~15 rooms + outdoor.

| Room | Notable |
|---|---|
| Dropship | Spawn location |
| Medbay | Submit Scan (visual), Inspect Sample |
| Security | Watch Cameras (rotating); Vitals panel |
| Office | Vitals |
| Administration | Admin map; Swipe Card |
| Laboratory | Weather Nodes, Specimen |
| Weapons | Clear Asteroids (visual) |
| Communications | Reboot WiFi |
| O2 | Monitor Tree; Clean O2 Filter |
| Electrical | Fix Wires, Divert Power |
| Storage | Fuel Engines |
| Boiler Room | Replace Water Jug (long, heavy) |
| Outside | Fix Weather Nodes (multi-point), Record Temperature |

**Vent network**: area-clustered. Specific clusters around Electrical, Communications, Outside, Storage.

**Sabotage**: Lights, Seismic Stabilizers (unique to Polus; dual fix), Comms, O2 (not sabotagable here — different spec).

**Outdoor sections**: wide snow areas between buildings create long sight-lines. Visual tasks on weather nodes confirm crew.

## The Airship

**Setting**: flying airship (added 2021).
**Size**: largest map; ~20+ rooms.

| Section | Notable |
|---|---|
| Cockpit | Start; Steering tasks |
| Engine Room | Long task sequences |
| Main Hall | Central traffic |
| Medical | Scan, Sample |
| Security | Cameras (switch which) |
| Electrical | Wiring tasks |
| Armory | Unlock/Shoot |
| Ballroom | Clean Tasks |
| Records | Sort Records (long, complex) |
| Lounge | Casino-like tasks |
| Gap Room | Gap jump (movement trick) |
| Cargo Bay | Heavy lifting tasks |
| Viewing Deck | Windows; outdoor feel |

**Spawn choice**: players select spawn location from multiple options (Gap Room, Cargo Bay, etc.). First-round spawn diversity creates varied early-game dynamics.

**Vent network**: regional clusters (multiple disconnected). Far more maze-like than Skeld.

**Sabotage**: Crash Course (requires pilot + two co-pilots; triple-terminal fix), Lights, Reactor, Comms.

**Ladders**: some rooms have ladders adding vertical flavor.

## The Fungle

**Setting**: jungle island (added 2023).
**Size**: medium.

| Area | Notable |
|---|---|
| Beach | Spawn; tasks with mushrooms |
| Campfire | Marshmallow (time task) |
| Rec Room | Combat training tasks |
| Jungle | Waterfall, Pick Mushrooms |
| Lookout | Binoculars (security) |
| Meeting Hall | Emergency button |

**Vent network**: conditional; some vents open on certain events.

**Unique mechanics**:
- **Mushrooms**: certain tasks require mushroom handling; hallucinogenic event changes colors temporarily.
- **Ziplines**: fast-travel segments.
- **Binoculars**: crew surveillance tool.

**Sabotage**: Mushroom Mix-Up (hallucinogenic sabotage — players' colors/appearances randomized briefly), Reactor, Comms, Lights.

## Map-Role Balance Tuning

Host adjusts per map:
- **Speed**: 0.5x-3x (slower = more time to kill / catch).
- **Vision**: 0.25x-5x (crew vision; impostor static).
- **Kill cooldown**: 10-60s.
- **Task count**: 1-10 per type per crewmate.
- **Impostor count**: 1-3.
- **Meeting limits**: 1-10 per player per match.
- **Discussion/voting time**: configurable.
- **Common/short/long task count**: tunable ratio.

Each map has an informal "competitive default" that community converges on.

## Map Philosophy

### Handcrafted Ambiguity

Every room is deliberately sized for kills + alibi potential. Electrical is notorious kill-trap on Skeld. Admin is info-hotspot but narrow. No room is "safe" or "useless."

### Readable Geography

Players can navigate without looking at minimap after a few matches. Sight-lines and landmarks support verbal reports ("I was in med-electrical junction").

### Vent Puzzles

Vent network is memorized like chess openings. "He went in vent to X, can only come out Y or Z" is a reading pattern.

### Security Tradeoffs

No map gives full surveillance — each map's info tools have blind spots the impostor can exploit.

### Map Rotation

Hosts cycle maps to break meta. Each map favors different play styles.
