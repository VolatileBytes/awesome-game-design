# Map Design — Counter-Strike

Maps are the game. Each of the 7 Active Duty maps is a specific puzzle — mapped in detail by 25 years of pro play.

## Universal Structure

Every competitive bomb map has:

- **T spawn**: starting point for Terrorists.
- **CT spawn**: starting point for Counter-Terrorists.
- **A site**: a bombable area with lootable map features (elevated, corners, cover).
- **B site**: the other bombable area, usually smaller or harder to hold.
- **Mid**: a central area connecting multiple paths, often an info-trade zone.
- **Chokepoints**: narrow passages where 1 player can hold 2–3.
- **Rotations**: CT paths between A and B (faster) vs T paths (slower).

## Timings

A map's identity is its **timings** — how long it takes each team to reach each location.

| Timing (avg, seconds) | Dust II | Mirage | Nuke |
|---|---:|---:|---:|
| T to A (long) | 16 | 13 (apts) | 6 (outside) |
| T to B (tunnels) | 14 | 15 | 10 (elev.) |
| CT to A | 7 | 6 | 4 |
| CT to B | 9 | 10 | 12 (rotate) |
| Mid contact | 9 | 9 | N/A |

The defender (CT) typically arrives first at each site; the attacker (T) has to push through with utility.

## Angles

An "angle" is a position that holds sight-line over a choke. Pro play is largely about:
- Knowing every angle on every map.
- Timing when to peek vs hold.
- Off-angles (non-standard spots that break enemy pre-aim).

"Pre-aim" = aiming at where you expect an enemy to appear, before you round the corner.

## Site Geometry

A good bomb site has:
- **2-3 entry paths** (forces CT to split attention).
- **Post-plant cover** for T (areas to hide while bomb ticks).
- **Retake angles** for CT (paths back in after losing site).
- **"Corner abuse" resistance**: geometry that doesn't let one corner hold infinitely.

## Utility Lineups

A **lineup** is a memorized throw from a specific spot that lands a utility perfectly (smoke blocking CT vision, flash into site, molly clearing common hold).

Each map has ~30-80 "meta" lineups. Pros memorize them all. Casual players learn 3-5 per map.

## Map Rotation (Active Duty)

Valve rotates the 7-map pool periodically:
- **Active Duty** (current competitive): Mirage, Inferno, Nuke, Ancient, Overpass, Anubis, Dust II (varies by season).
- **Reserves**: Maps rotated out temporarily.
- **Wingman pool**: smaller, 2v2-optimized maps.

Community submits maps; a few achieve Active Duty status (e.g., Ancient, Anubis).

## Flagship Maps

### Dust II
The icon. Three lanes (long, mid, tunnels). Simple, canonical, balanced. The map CS taught a generation on.

### Mirage
Arguably most-played in modern CS. Apartments vs palace vs mid chokepoint drives 1001 meta scenarios.

### Inferno
Close-quarters, utility-heavy. Banana choke is a religion; A site is a wedding-cake puzzle.

### Nuke
Vertical. Two-level site A (upper/lower). CT dominant at pro level; site retakes are rare and heroic.

### Overpass
The "everyone-has-to-use-nades" map. Water, bathrooms, connector — dense call-out vocabulary.

### Ancient
Jungle aesthetic. Tight corridors, elevation plays, post-plant survival critical.

### Anubis
Newer. Long paths, big B site, mid-connector heavy.

### Vertigo
Construction site, 2 levels. Divisive (some love it, pros often avoid it).

## Map Callouts

Each map has community-standardized callouts — location names used in voice comms:

Mirage example:
- A site: "default," "ticket," "palace," "stairs," "CT."
- B site: "market," "apartments," "B short."
- Mid: "top mid," "window," "connector."

Miscommunicating a callout = losing the round. Pros drill callouts religiously.

## Competitive Map Requirements

For a map to enter Active Duty:
- T-side win rate: 45-55% at pro level.
- 2 sites, symmetric viability (can't ignore B).
- Mid control should matter, not dominate.
- Visual clarity: enemies readable against every background.
- Sight-line tuning: no impossible holds, no undefendable angles.
- Skybox: grenades travel realistic arcs; no free infinite-utility.
- Performance: 240fps+ on competitive rigs.
- Radar: clear 2D top-down maps with callouts.

## Community Maps

Workshop drives most of the game's variety:
- **Surf**: physics maps; use strafing on angled ramps.
- **KZ**: parkour maps; speed + precision jumps.
- **Retake servers**: practice post-plant with bot/community scripts.
- **Aim maps**: ultra-simplified 1v1 practice (aim_map, aim_redline).
- **Community bomb defusal maps**: thousands (de_cache classic, de_train legendary).

## Design Philosophy

Valve's map design ethos:
- **Symmetry isn't the goal**; **balance is**. Dust II is wildly asymmetric but balanced through timings.
- **Utility cost**: every choke should be "smokeable" but not free.
- **Pro-meta drives tuning**: if CT win rate is 60%+, the map gets revisited.
- **Visual identity**: each map has a distinct palette and architecture (Inferno = Italian town, Nuke = nuclear facility, Ancient = Aztec jungle).
- **Callouts baked in**: map geometry produces memorable shapes so callouts stick.

## Rejected Patterns

- **Random random spawn points**: breaks round timings.
- **Weather / fog**: hurts visibility (competitive fairness).
- **Destructible cover**: breaks round integrity and lineups.
- **Procedural generation**: maps must be learnable.
