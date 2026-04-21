# Mode & Map Design

The second biggest design area after brawlers. Modes are templates; maps are instances; the combination is what players play.

## Mode Catalogue

### PvP 3v3

#### Gem Grab
- **Objective**: collect 10 gems and hold for 15 seconds
- **Gem source**: a central gem pit spawns 1 gem every ~2 seconds
- **Respawn**: on death, you drop all your gems
- **Gameplay loop**: contest the gems pit, stall when ahead, aggress when behind
- **Match length**: up to 2.5 minutes
- **Lethal last 15 seconds**: the holding team can't die without resetting their timer

#### Bounty
- **Objective**: earn more stars than enemy team
- **Stars**: each kill gives 1 star to the killer's team; carrying star counter above head (1, 2, 3...)
- **Time**: 2.5 minutes, maximum 7 stars per team
- **Gameplay loop**: kill, survive, kill, survive
- **Map**: often has a central star spawn for bonus points

#### Brawl Ball
- **Objective**: soccer — score 2 goals
- **Ball**: spawns at centre; kicked by any brawler interacting with it
- **Match length**: up to 3 minutes
- **Gameplay loop**: team-kick passes, shots on goal, defensive set-ups
- **Destructible walls**: walls can be broken (by certain brawlers) to open shot lanes

#### Heist
- **Objective**: destroy the enemy safe before they destroy yours
- **Safe**: ~7000 HP; high HP means it takes sustained attack
- **Match length**: 2 minutes
- **Gameplay loop**: push lanes, chip at safe, defend your own
- **Balance issue**: brawlers with high safe-damage (Colt, Penny) dominate

#### Hot Zone
- **Objective**: capture and hold zones
- **Zones**: 1–3 circular zones spread across the map
- **Capture rate**: when your team has more brawlers in the zone than enemy team, you gain points
- **Match length**: 1.5–2 minutes
- **Gameplay loop**: contest zones, rotate between them based on strategic value

#### Knockout
- **Objective**: best of 3 rounds of elimination
- **Round**: first team to wipe the enemy wins the round
- **Shrinking map**: the playable area shrinks after some time (forcing engagement)
- **Match length**: 2.5 minutes for 3 rounds
- **Gameplay loop**: team positioning, whoever commits first dies; patience wins

### PvP (Solo / Duo)

#### Showdown (Solo)
- **10 players** drop into a large map
- **Collectable power-ups** scattered in the map (health, damage, speed)
- **Shrinking boundary**: poisonous gas closes in
- **Gameplay loop**: collect, skirmish, last-man-standing
- **Match length**: 3 minutes max

#### Showdown (Duo)
- 5 duos (10 players)
- Teammates can revive each other if reached in time
- Otherwise similar to Solo

### PvE Co-op

#### Boss Fight
- 3 players vs. a scripted boss with phases
- Boss has very high HP; players work through attack patterns
- **Gameplay loop**: mechanics + rotations; learn the phases, optimise damage windows

#### Robo Rumble
- 3 players defend a centre point against waves of robots
- Each wave is tougher; level determines reward
- **Gameplay loop**: split, focus, clean up

#### Big Game
- 1 player is the "big brawler" (massive HP, buffed stats) vs. 5 others
- Big-brawler tries to survive X minutes; small team tries to kill them
- Asymmetric PvP

## Mode Selection UI

- Event carousel on the main screen: 4–6 active events with different modes
- Each event has a timer (24h for most, shorter for special)
- Player picks a mode → queue into matchmaking

**Always-on modes**: Gem Grab, Showdown (one or both), Brawl Ball, Knockout (sometimes)
**Rotating modes**: everything else, rotating daily/weekly

## Map Design

A map is a grid layout + mode attachment + environmental objects.

### Map Size

- Tile grid, approximately 27×15 (small) to 45×25 (large)
- Landscape orientation; longer horizontal dimension
- **Spawn zones** at the left and right (or top/bottom) edges for 3v3 modes
- **Gem pit / ball spawn / zones / safe positions** in the centre or at key points

### Environment Objects

| Object | Effect |
|---|---|
| **Wall** | Blocks brawlers and projectiles (except artillery and certain supers); destructible by some attacks |
| **Destructible wall** | Breakable by certain attacks (bushes, wood walls) |
| **Bush** | Hides brawlers visually; enemies can't see in unless they enter |
| **Rope fence / teleporter** | Jumpable or teleport pads |
| **Water** | Movement slows; some brawlers skip across |
| **Lava** | Damage on contact |
| **Skulls / obstacles** | Purely decorative (often) |

### Cover Density

- A map with **too little cover** favours long-range brawlers (snipers / artillery)
- A map with **too much cover** favours mobility (assassins)
- A map with **balanced cover** creates diverse meta

### Map Balance Principles

- Spawn-to-centre distances should be equal for both teams
- Cover placement on the map should be roughly symmetric (mode-dependent)
- Objective (gem pit, ball spawn) should be equidistant from both spawns
- **Micro-asymmetries** (slight wall placement differences) create varied gameplay

### Map Rotation

- Each mode has a **map pool** of ~5–10 maps
- A daily rotation shows 3–4 modes with 1–2 map each active
- Competitive modes (Power League) use a curated smaller pool

### Community Maps

- Brawl Stars has a **custom map editor** where players create maps
- Selected community maps enter the rotation
- This is a huge content feature and source of design ideas

## Mode × Brawler Matrix

Each mode has a **brawler meta** — which brawlers are dominant in this mode?

| Mode | Dominant Roles |
|---|---|
| Gem Grab | Tanks (hold mid), controllers (zone), some marksmen |
| Bounty | Marksmen (long range, pick kills), controllers |
| Brawl Ball | Tanks (push ball), supports (enable teammates) |
| Heist | High safe-damage (Colt, Dynamike, Penny) |
| Hot Zone | Controllers, area-of-effect (Gene, Spike) |
| Knockout | Balanced — team-fight oriented |
| Showdown | Survivability + burst (Leon, Shelly, Frank) |

This matrix **spreads the meta**. A brawler meta-weak in one mode can dominate another. This is a deliberate design — new brawlers added to the game target specific mode gaps.

## Balance Process

- **Telemetry**: win rates per brawler, per mode, per map
- **A brawler at >55% in a mode**: flag for review; consider nerf or map adjustment
- **A brawler at <40% in a mode**: flag for buff; consider star power or gadget tune
- **Cross-mode balance**: a brawler dominant in one mode but underperforming in three others is healthy; a brawler dominant in all modes is over-tuned

## Event Modes

Supercell introduces limited-time event modes to break the meta and drive engagement:
- **Bounty Variants**: First to 7 stars, Friendly fire enabled, etc.
- **Mode remixes**: Basket Brawl (basketball), Volley Brawl (volleyball), 5v5, etc.
- **Seasonal events**: holiday-themed modes (pumpkin brawl)

Event modes **drive Brawl Pass token earn rate** — players with specific event completion goals return daily.

## Map Editor Pipeline

For a clone:
1. In-game editor with grid-snap building
2. Preview mode — drop a friendly match into the map
3. Upload + community voting
4. Designer curation: hand-pick community maps for official rotation

This closes a loop between design and player creativity.
