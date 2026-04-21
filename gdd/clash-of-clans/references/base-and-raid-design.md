# Base & Raid Design

The most design-dense document in a CoC clone. Most of the game's depth and longevity comes from the interplay of base-building and raiding.

## Base Design Principles

### Layout Archetypes

| Archetype | Goal | Pattern |
|---|---|---|
| **Trophy base** | Defend trophies, deter stars | TH in core, defences in concentric rings, multiple compartments |
| **Farming base** | Protect resources, TH outside | Storages in the core, TH placed outside walls |
| **War base** | Deny 3-stars in Clan War | Asymmetric; hero placement breaks funnels; clan castle centralised |
| **Hybrid** | Middle ground | Balanced protection of TH + resources |

### Layout Rules

Effective bases across all archetypes share:
- **No dead space inside walls** — attackers can deploy at a wall gap and path around compartments
- **Splash damage at the core** — Wizard Towers, Scattershots, Bomb Towers cover the centre
- **Air defence distributed** — at least one Air Defence in each zone of the base
- **Clan castle centralised** — so donated troops take longer to lure out
- **Inferno Towers / Scattershots in compartments** — protected by walls, forcing attackers to commit resources
- **Anti-3-star design** — war bases aim to force attackers to choose "take the TH" OR "get percentage" OR "use the best army" but not all three

### Walls

- Walls have levels; highest-level walls take the most damage to break
- Walls funnel troops: every wall segment is a decision by the attacker ("use a Wall Breaker here?")
- **Compartments** (closed wall zones) force troops to reroute or break through
- **Double walls** (two rings around critical defences) are expensive to build but punishing to attack

### Traps

- **Bombs** (small, AoE), **Giant Bombs** (large, AoE, usually in wizard-tower pockets)
- **Spring Traps** (launch units off the map — devastating against Giants/Hogs)
- **Air Bombs / Seeking Air Mines** (air AoE; Seeking Air Mines target heroes preferentially)
- **Skeleton Traps** (pop skeletons, tank or distract)
- **Tornado Trap** (pulls units, slows, stacks them for AoE)

Trap **placement** is the defender's primary active gameplay. Well-placed traps:
- Sit in obvious troop paths
- Cluster at compartment openings
- Hide in the "shadow" of other buildings (hard to scout)
- Guard expensive defences

### Asymmetry

War bases especially use **asymmetric layouts**. A symmetric base has predictable troop paths; an asymmetric base forces attackers to plan for different entry sides. The asymmetry comes from compartment shape, not resource-building placement.

## Attack Design

Attack is a **3-phase dance**:

1. **Scout** (20–40 seconds): pan the base, identify defence layout, plan an entry side
2. **Funnel** (first 30 seconds of the attack): deploy tank + cleanup troops to create a path for the main army
3. **Commit** (remaining 2+ minutes): push the main army (heroes + bulk troops) through the funnel toward the TH and core

### Army Compositions (Meta Examples)

Armies are named after their composition. A non-exhaustive list of famous metas:

| Army | Composition | Era |
|---|---|---|
| **GiWi** | Giants + Wizards | TH6-8 classic |
| **LavaLoon** | Lava Hounds + Balloons + Minions | TH9-11 air attack |
| **GoWiPe** | Golem + Wizards + PEKKA | TH8-9 ground |
| **Mass Dragons** | 10 Dragons + rage spells | TH8-10 |
| **Queen Walk** | Archer Queen + healers, then main army | TH10+ |
| **HogRage** | Hogs + rage spells + heal | TH9-10 |
| **Bowlers + Witches** | Bowler-witch hybrid | TH11 |
| **Super Witch Slap** | Super Witches + bats | TH12+ |
| **Hybrid** | Hogs + Miners + Queen Charge | TH13+ |
| **Root Rider** | Root Riders + Queen + healer pack | TH15+ |

Meta shifts every few patches. A clone's balance team must watch for a **dominant army** and rebalance before it becomes oppressive.

### Hero Charges

Heroes are often deployed first as a **charge** — a short-lived offensive push that takes out a key defence (AQ Walk, GW Walk). Their ability is saved for critical moments (e.g. AQ cloaking at low HP, GW tome reviving a dead hero).

## Clan War

- **5v5, 10v10, 15v15, 20v20, 25v25, 30v30, 40v40, 50v50** sizes
- Each player gets **2 attacks** on Battle Day (24h window)
- Clan members can war-base search for their matchup opponents
- Stars are summed across the clan; most stars wins

### Preparation Day (23h before Battle Day)
- Members upload war bases
- Leaders assign targets and attack order
- Members request / donate troops into war CCs

### Matchmaking
- CoC's war matchmaker historically weights total war weight (defences + troops + heroes)
- Controversial; "engineered" low-weight bases used to game the matcher
- Resolved via **Weight = TH level** in modern CWL

## Clan War Leagues (CWL)

- Monthly, 7 days of war, 1 war per day
- 8-clan groups promoted/demoted based on performance
- Bigger stakes, bigger rewards, no resources lost
- League levels: Bronze → Silver → Gold → Crystal → Master → Champion → Titan → Legend

## Anti-Patterns in Base Design

- **Symmetric base, all defences evenly spaced**: zero defensive density, easy to splash-kill
- **No compartments**: one breach = full access
- **TH at the core with no splash**: attacks reach it with a tank and cleanup pack
- **All air defence clustered**: air attacks avoid the cluster
- **Traps in line with the first-wave troop path**: obvious, scouted easily

## Anti-Patterns in Attack Design

- **Deploying everything on the edge immediately**: troops crumble into the nearest defence
- **Not building a funnel**: core-deploying troops get outflanked by defences on all sides
- **Ignoring CC troops**: CC troops wreck an attack if left unchecked; a proper lure + cleanup is step 1
- **Wasting heroes**: deploying the Queen at 20% HP or without a walk-setup is a critical mistake
- **Ignoring spell value**: spells (Rage, Heal, Freeze, Jump, Earthquake) are force multipliers; an attack without proper spell use underperforms

## Replay System

- All attacks are **recorded and viewable** after the fact
- Attackers and defenders can watch the replay
- Replays are **shared via links** (URL schemes deep-linking into the game)
- Essential for:
  - Defenders to analyse "what went wrong" with their base
  - Attackers to study their own play
  - Content creators to produce tutorials
  - War scouting (review an opponent's past defensive replays)

Replay **correctness** requires the game to be **deterministic from inputs + base snapshot**. See Unity overlay `engines/unity/references/save-and-replay.md`.
