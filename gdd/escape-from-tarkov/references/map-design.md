# Map Design — Escape from Tarkov

Each map is a distinct biome + encounter type. 10+ maps in shipping build, each with unique loot tiers, layout, extract puzzles.

## Universal Structure

Every map has:
- **PMC spawn zones** (5-12 random points).
- **Scav spawn zones** (separate).
- **Extract points** (5-15, per-side, conditional).
- **Boss spawn zone** (some maps).
- **Loot zones**: tiered by value.
- **Quest interact points**: map-placed items/objectives for questline triggers.

## Extract Conditions

Extracts can be:
- **Free-for-all** (always available).
- **PMC-only** or **Scav-only**.
- **Timed** (only active after raid minute X).
- **Conditional**: need companion, pay 7,000 roubles, need specific item (e.g., paracord, boat ticket).
- **Risky**: car extract — 3-minute timer, shared by up to 2 players, shares loot fees.

Learning each map's extract graph is a barrier to progression.

## Flagship Maps

### Customs (beginner-ish)
- Two halves: dorms + industrial.
- 3-story / 2-story dorms with high-tier loot.
- Reshala boss at dorms.
- Long sightlines + close corners.

### Factory
- Small indoor map.
- Fast, CQB-heavy, sweaty.
- Tagilla boss.
- 15-20 min raid only.

### Woods
- Largest map (~600x800m).
- Open terrain, long sightlines.
- Shturman boss at woodcutter camp.
- Scav Lighthouse extract path.

### Shoreline
- Medium-large.
- Beach + resort.
- Sanitar boss at resort west wing.
- Weather cycling (rain, fog).

### Interchange
- 3-level shopping mall.
- Massive loot density (cash registers, pharmacy, tech store).
- Killa boss.
- Vertical combat heavy.

### Reserve
- Military base; labyrinthine.
- Glukhar + Raider guards.
- Underground bunker.
- Unique extract: train (15-min timer, then departs).

### Lighthouse
- Long, coastal.
- USEC Rogues (elite AI) guard water treatment.
- Zryachiy + followers.
- Tall lighthouse as sniper perch.

### Streets of Tarkov
- Urban; huge; ~800m across.
- Buildings climbable.
- Kaban boss.
- Most players + densest loot.

### Ground Zero
- Starter map (new wipe).
- Level-capped (under 20).
- Urban; dense.

### Labs (Terragroup Laboratory)
- Keycard required.
- Dense Raider spawn.
- Highest loot density.
- Confined; all CQB.

## Loot Design

Every container has a **spawn chance table**:
- **Jacket** (common): toilet paper, bolts, screws, low-end meds.
- **Drawer** (common): same.
- **Safe** (uncommon): roubles stack, key cards, weapon parts.
- **Weapon box** (uncommon): rifle mags, attachments.
- **PC block** (rare): GPU (major quest item + high-tier meta loot).
- **Toolbox** (rare): mechanical parts.
- **Medbag** (rare): high-tier meds.
- **Grenade box** (rare): grenades + ammo.
- **Keycard spawn** (rare-uncommon): keycards for Labs etc.
- **Boss spawn room** (rare): boss loot (boss-specific weapons, masks).

Loot tables respawn on raid start; in-raid dynamic loot also possible (boss drops).

## Map Design Principles

### Information Density

Every map has a learning curve:
- Callouts (community-defined: dorm bridge, power station, white bishop, new gas).
- Extract routes (memorized paths).
- Loot spawns (where to rush first).
- Boss locations (where NOT to go if underequipped).

Veterans have near-omniscient map knowledge; new players wander blindly for 50+ raids.

### Verticality

- Interchange / Reserve / Streets use verticality.
- Sound occlusion between floors creates positioning puzzles.
- Sniper perches on tall buildings create zoning.

### Choke Points

- Valley paths on Woods.
- Dorm bridge on Customs.
- Cinema hall on Interchange.
- Bunker entry on Reserve.

Each map has 3-5 high-traffic chokes where PvP concentrates.

### Flank Paths

Every choke has alternate routes, some requiring:
- Key (door keys drop as rare loot).
- Lockpick (not present; keys only).
- Destructible walls (limited).

## Map Secrets & Tech

- **Keys**: map-specific door keys, drop rare, unlock loot rooms.
- **Hatchet-runner routes**: naked players rush high-value spots pre-patches (largely patched out).
- **Marked keys / quest-specific paths**: encode questline progression.
- **Scav extracts** (Scav-exclusive): foot paths to CoOp with PMCs.

## Weather + Time of Day

- **Time of day** rotates (day, dusk, dawn, night).
- **Night raids** require NVG or thermal; stealthier.
- **Weather** can be foggy (reduces sightline), rain (obscures audio slightly).
- Dynamic weather changes mid-raid.

## Raid Timer

- 30-55 minutes depending on map.
- Extract timer = raid timer.
- Running out of time: die if on wrong side of map extract.

## Design Philosophy

Battlestate's map approach:
- **Real-feeling places**: maps are based on real locations (Factory is an industrial complex, Streets is Moscow-inspired).
- **Knowledge advantage is intended**: no tutorial prepares you; learning is the progression.
- **Loot tiered**: common items everywhere, rare loot gated.
- **Density scales to player count**: 8-14 PMCs per raid; boss + Scavs fill out.
- **Extracts are puzzles**: each map's extract graph is a memorizable tree with conditional nodes.

## Map Controversies

- **Map size vs player count**: Streets/Woods huge for 10-14 PMCs; empty sometimes.
- **Loot scarcity post-patch**: community rebellion vs devs over loot balance.
- **Bosses too common/rare**: rotating debate.
- **Keys as artificial gatekeeping**: some quest keys cost 2M+ roubles on Flea.

## Rejected Patterns

- **Random procedural maps**: breaks memorization/progression loop.
- **Static weather only**: breaks immersion.
- **Universal extract points**: breaks map-identity.
- **Respawn spawn protection**: spawn-camping is a real problem; mitigated via randomized spawns.
