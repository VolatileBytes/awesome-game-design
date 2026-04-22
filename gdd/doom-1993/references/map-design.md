# Map Design — DOOM (1993)

Doom maps are hand-authored pseudo-3D environments stored in WAD files as sets of linedefs, sectors, things, and vertices. The engine renders them via BSP traversal; designers author them via DoomEd (internal) or later DEU / DoomBuilder (community). John Romero and Sandy Petersen are the most famous Doom mappers; their distinct styles defined two schools of level design.

## Map Components

### Vertices

- 2D points (X, Y) defining wall endpoints.
- Stored in VERTEXES lump.

### Linedefs

- Line segments between 2 vertices.
- Each has front and (optionally) back sidedef.
- Flags: blocks player, blocks monsters, blocks sound, two-sided, secret, etc.
- Special actions: open door, raise lift, etc. Triggered by use / walk / shoot.

### Sidedefs

- Texture information per side of a linedef.
- Upper texture (step-up wall above shorter side), lower (step-down), middle (fill for one-sided).

### Sectors

- Enclosed regions of the map (2D polygons bounded by linedefs).
- Properties: floor height, ceiling height, floor texture, ceiling texture, light level, special effect (damage floor, blink light).
- Moving sectors = doors, lifts, platforms, crushers.

### Things

- Placeable entities: monsters, items, player starts, deathmatch starts, teleport destinations.
- Angle, type, flags (which skill levels + multiplayer).

### Nodes (BSP)

- Precomputed binary space partition tree for rendering.
- Generated at map-compile time by nodebuilder (BSP, ZDBSP).
- Engine traverses tree back-to-front to render walls correctly.

### Blockmap

- Spatial hash: grid of 128×128 unit cells, each listing linedefs intersecting it.
- Used for collision detection.

### Reject

- N×N bit-matrix (N = sector count); reject[i][j] = 1 if sector i and j can never see each other.
- Optimization for monster sight checks.

## Map Dimensions

- Coordinates: signed 16-bit integers (-32768 to 32767).
- Map can be up to 65536 × 65536 units.
- 1 unit ≈ 1 inch (approx; for realism reference).
- Player radius: 16. Height: 56. Walk-step max: 24.

## 2.5D Constraints

### No rooms over rooms

- Each XY coordinate has exactly one sector, one floor height, one ceiling height.
- Cannot stack rooms (no bridge over room).
- Tricks in source ports: ZDoom's "3D floors" emulate via side-effects.

### No sloped floors (original)

- Floors and ceilings are flat (horizontal planes).
- No ramps; stairs built from many short sectors at incrementing heights.
- Source ports (ZDoom, GZDoom) add slopes as extension.

### Flat rendering trick

- Floors/ceilings drawn as "visplanes" per sector — rows of pixels at a fixed Y height.
- Engine has a hard limit of 128 visplanes per frame (visplane overflow). Exceeding crashes vanilla Doom.
- Map designers avoided too many visible sectors at once.

## Map Construction Archetypes

### Hub + spokes

- Central room; corridors radiate to sub-areas.
- Each sub-area has a key/switch that unlocks next.
- Common in early Doom (E1M1 Hangar).

### Linear corridor

- Sequence of rooms connected by single path.
- Narrative-driven pace.
- Hexenesque but rarer in Doom.

### Maze

- Many rooms, many paths; easy to get lost.
- Petersen's specialty (E2M6 Halls of the Damned).
- Automap essential.

### Arena

- Single large room, monster wave trigger.
- Canonical in Doom II's combat-puzzle maps.

### Fortress

- Concentric layers; outer courtyard, inner sanctum, boss arena.
- Tower of Babel (E2M8), Dis (E3M8).

## Sector Types (special effects)

| Type ID | Effect |
|---|---|
| 0 | Normal |
| 1 | Blink randomly |
| 2 | Blink 0.5s |
| 3 | Blink 1s |
| 4 | Damage 20% + blink |
| 5 | Damage 10% |
| 7 | Damage 5% |
| 8 | Glow |
| 9 | Secret (increments counter on enter) |
| 10 | Door close after 30 tics |
| 11 | Damage 20% + end level when HP ≤ 11 |
| 12 | Sync blink 0.5s |
| 13 | Sync blink 1s |
| 14 | Door open after 300 tics |
| 16 | Damage 20% |
| 17 | Light fire effect |

Damage floors: nukage (acid, green), lava (red), slime (brown). Radiation Suit powerup immunes.

## Line Special Actions

### Door actions

- Open (manual / locked / key-required).
- Open-close (auto-shut after delay).
- Stay-open / raise slowly.

### Lift / platform actions

- Lower and raise.
- Raise to highest adjacent floor.
- Perpetual cycle.

### Ceiling / floor movers

- Raise / lower to target height.
- Crush (damage on downward motion).

### Teleport

- Linedef triggers: teleport player to a sector containing a teleport landing thing.
- One-way or two-way.

### End-level

- Exit switch / door.
- Alternate exit (leads to secret level).

## Key System

- 3 colors × 2 types (keycard + skull) = 6 key variants.
- Matching-color lock requires matching color key.
- Map designer chooses keycard vs skull; game mechanically identical.
- Color-coded locks tell player at-a-glance "I need X key."

## Secret Design

### Registering as Secret

- Sector with type 9 = secret.
- Entering counts; increments HUD counter.

### Hiding Secrets

- **Wall texture mismatch**: a wall segment with different/misaligned texture suggests a secret door.
- **Floor pattern change**: altered floor tile hints at pressure pad.
- **Strange geometry**: dead-end corridor, hidden gap, too-tall column.
- **Suspiciously-placed switch**: switch with no obvious function.
- **Visual breadcrumbs**: light level change, blood smear, skeleton corpse.

### Types of Secrets

- **Shortcut**: secret path that bypasses a chunk of map.
- **Treasure**: room full of weapons/armor.
- **Alternate exit**: leads to secret level (e.g., E1M9).
- **Easter egg**: designer personal joke (pixel graffiti, name plaques).

## Episode Arc (Knee-Deep in the Dead)

Progression across E1M1-E1M8:

- **E1M1 Hangar** — small, linear, teaches movement + shotgun.
- **E1M2 Nuclear Plant** — introduces key + bigger sector variety.
- **E1M3 Toxin Refinery** — damage floors; radiation suit.
- **E1M4 Command Control** — vertical emphasis; lift puzzles.
- **E1M5 Phobos Lab** — bigger; teleport introduced.
- **E1M6 Central Processing** — sprawling industrial; complexity peaks.
- **E1M7 Computer Station** — intricate; multi-key unlocks.
- **E1M8 Phobos Anomaly** — short boss arena; two Barons of Hell.
- **E1M9 Military Base** (secret) — between E1M3 + E1M4 via secret exit.

Classic progression curve: small → large → intricate → boss.

## Romero vs. Petersen Styles

### Romero

- Theatrical, directed pacing.
- Strong visual hooks per area.
- Abundant ammo/health.
- Designer-favorite: E1M1 Hangar (quick, iconic).

### Petersen

- Abstract, spatial puzzles.
- Sparse resources; high tension.
- Non-linear; backtracking common.
- Designer-favorite: E2M6 Halls of the Damned (labyrinth).

### Tom Hall (early designer, left before release)

- Designed original level concepts; style didn't match final Doom.
- Most of his maps redesigned or scrapped; some survived (e.g. early E1M1 concepts).

## Deathmatch Maps

- **Small + symmetric**: no camping corners.
- **Multiple sightlines**: emphasize strafe-circle combat.
- **Rocket + plasma placement**: most-traveled spots.
- **Tight circulation**: walk-pass-enemy scenarios.
- Canonical: DM maps built separate from campaign (Dwango5, Judas23).

## Map File Format (WAD)

### WAD Structure

```
Header:
  identifier: "IWAD" or "PWAD"
  lump count
  directory offset

Lumps (data entries):
  each with name (8 chars), offset, size

Map lumps (for each map; 10 lumps):
  MAPNAME (empty marker)
  THINGS
  LINEDEFS
  SIDEDEFS
  VERTEXES
  SEGS (from BSP)
  SSECTORS
  NODES
  SECTORS
  REJECT
  BLOCKMAP
```

### Extra Lumps

- Textures (TEXTURE1, TEXTURE2, PNAMES): texture definitions.
- Patches (P_START ... P_END): texture patches.
- Flats (F_START ... F_END): floor/ceiling textures.
- Sprites (S_START ... S_END): animated sprites.
- Music (D_*): MUS format music.
- Sound (DS*, DP*): sound effects.
- Graphics (STBAR, STATUS etc.): HUD, menu.

## Build Tools

### 1993 Era

- DoomEd (id internal, never public).
- DEU (Doom Editing Utility) — first community editor.
- DeuTex — convert between WAD and flat files.

### Modern Era

- DoomBuilder (Windows).
- GZDoom Builder / Ultimate Doom Builder (modern; supports source port extensions).
- SLADE (WAD manager).
- Custom nodebuilders: ZDBSP, ZenNode.

## Map Design Best Practices

### Visual Hierarchy

- Important switches / doors: bright light, distinct color.
- Pickup items: place where player will see them.
- Secrets: slightly off from main path; rewarded with rare loot.

### Encounter Pacing

- Alternate tense combat with downtime.
- Don't hit player with 3 encounters back-to-back.
- Use health / ammo placement to gate encounter count.

### Teleport Tricks

- Teleport monster closet: room full of monsters offscreen; linedef triggers them to teleport into main area.
- Surprise factor; doesn't require line-of-sight to spawn.

### Lighting

- Dark areas force caution.
- Use flickering light in horror contexts.
- Light amplifier item reveals layout; reward for secret-hunting.

### Height Variation

- Don't keep floors flat; vary elevation.
- Use lifts, stairs, ledges to create vertical combat.
- Monster closets up high — hitscanners pinning you down.

### Texture Consistency

- Tech areas: COMPBLUE, SHAWN, SUPPORT.
- Hell areas: SKIN, MARBLE, BLOOD.
- Transition zones: mix textures to signal progression.

## Map Analysis: E1M1 Hangar

Romero's signature level:

```
Start room:
  Player spawns, 2 Imps behind half-wall.
  Green armor on center platform (teaches armor).
  Zombieman ahead; pistol-intro combat.

Courtyard (secret):
  Outside area with health + weapon cache (secret).

Main corridor:
  Shotgun obtained (first power jump).
  Imps + zombies in intersecting side rooms.

Nukage pool + lift:
  Environmental hazard introduction.

Exit room:
  Single switch; quick kill; clean end.
```

Total play time: 1-3 minutes. Teaches: movement, shotgun, strafe, secrets, exit switches.

## Map Compile Pipeline

```
Map editor (DoomBuilder)
    ↓
Save WAD with THINGS/LINEDEFS/SIDEDEFS/VERTEXES/SECTORS
    ↓
Nodebuilder (ZDBSP)
    ↓
WAD now has NODES/SEGS/SSECTORS/BLOCKMAP/REJECT
    ↓
Load in source port
```

Vanilla Doom required a specific node format (vanilla). Modern ports support extended formats (GL nodes, DeePBSP).

## Competitive Map Categories

### Speedrun classifications

- **UV-Speed**: Ultra-Violence, any%, exit as fast as possible.
- **UV-Max**: 100% kills + 100% items + 100% secrets.
- **UV-Tyson**: only fist/chainsaw/pistol allowed.
- **Pacifist**: exit without killing anything.
- **NM-Speed**: Nightmare difficulty any%.

DOOM community (doomworld.com, doomedsda.us) maintains 30+ years of speedrun records.

## Custom Megawads (community-made)

- **Alien Vendetta** (2000): ultra-challenging 32-map megawad.
- **Plutonia 2** (2008): harder than Plutonia Experiment.
- **Sunlust** (2015): brutal modern combat design.
- **Eviternity** (2018): visually stunning; standard for GZDoom mapping.
- **MyHouse.wad** (2023): horror meta-experience; became viral.

Community output far exceeds id's original — tens of thousands of custom maps.

## Design Philosophy

### Level IS The Game

No narrative, no NPCs, no dialogue. The level's shape, color, monster placement, and secret design IS the player experience.

### Mappers as Auteurs

Each mapper's style is recognizable. Romero ≠ Petersen ≠ Tom Hall. Community mappers (Anthony Cole, Paul Corfiatis, mouldy, ukiro) each have signature aesthetics.

### Abstract > Literal

Doom's environments are metaphorical. "Military base" doesn't mean realistic; means "techy-feeling maze." Later games (Half-Life, Quake 4) pushed toward literal architecture; Doom embraced the abstract.

### Secrets Reward Curiosity

Optional depth for players who explore. 100%-ing a level feels earned.

### Moddability Was The Design

Separating map data into WAD meant community could build. This is Doom's unique longevity — 30+ years of user content means the game is fresh forever.
