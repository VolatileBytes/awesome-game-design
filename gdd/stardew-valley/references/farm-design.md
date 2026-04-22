# Farm Design — Stardew Valley

The farm is the player's canvas. Open tiling, crop planning, layout design, automation — Stardew lets players express preferences from min-max grind to cozy aesthetic gardens.

## Farm Layouts

Chosen at new-game. Irreversible without mods.

| Layout | Tillable | Special |
|---|---|---|
| **Standard** | Largest | Balanced; best for farming-focused players |
| **Riverland** | Reduced | Fish spawn; water divides tillable zones |
| **Forest** | Reduced | 8 permanent foraging spots; hardwood stumps |
| **Hill-top** | Medium | On-farm mining spot (daily ore node) |
| **Wilderness** | Medium | Monsters spawn at night; extra combat |
| **Four Corners** (co-op) | Medium | Quadrants for 4-player multi-farm |
| **Beach** (1.5+) | Medium | Supply crates wash ashore; no sprinklers on sand |
| **Meadowlands** (1.6+) | Medium | Starts with sheep + hay; fiber grass grows |

## Tile Grid

Each tile = 16x16 world unit. Tile states:
- **Grass**: pasture-able for animals; can spread.
- **Dirt**: empty ground; can be tilled.
- **Tilled**: ready for seed.
- **Watered**: hydrated; crop advances a day.
- **Blocked**: stone/wood/weed; tool to clear.

## Crops

### Seed Sources

- Pierre's General Store (primary, seasonal stock).
- JojaMart (when present).
- Traveling Cart (Friday/Sunday, rare seeds).
- Foraging harvest (wild seeds).
- Seed maker (seed from crop).
- Rare seed quest rewards.

### Crop Parameters (per crop)

- **Seasons**: which season(s) it grows in.
- **Growth days**: total days from planting to harvest.
- **Phase days**: per-phase days (e.g., 3/3/4/6 = 16 total).
- **Regrowth**: single-harvest vs re-grows every N days (blueberries, cranberries).
- **Multi-harvest**: per-plant yield (blueberries 3, cranberries 2).
- **Base value**: sell price.
- **Quality**: normal/silver/gold/iridium — scales with farming skill.
- **Water requirement**: must be watered daily (exception: giant crops, some deluxe).

Examples:
- **Parsnip** (Spring): 4 days, value 35g.
- **Strawberry** (Spring, Fair-only seeds): 8 days, regrows 4 days, value 120g.
- **Blueberry** (Summer): 13 days, regrows 4 days, multi-harvest 3.
- **Ancient Fruit** (all-season in greenhouse): 28 days, regrows 7 days, 550g base.
- **Starfruit** (Summer, Desert): 13 days, 750g base.

### Seasonal Viability

Crop dies at season end. Plan schedule so harvest lands before last day of season. Greenhouse (Community Center reward) allows year-round growth.

## Fertilizer

Applied pre-plant:
- **Basic Fertilizer**: improves quality chance.
- **Quality Fertilizer**: strong quality boost.
- **Deluxe Fertilizer**: major quality.
- **Speed-Gro**: -1 growth day.
- **Deluxe Speed-Gro**: -2 days.
- **Hyper Speed-Gro**: -3 days.
- **Tree Fertilizer**: accelerates tree growth.

## Irrigation

### Watering Can

Manual; +1 stamina cost per tile. Upgrades:
- Copper: 3-tile line.
- Steel: 5-tile line.
- Gold: 9-tile 3x3 area.
- Iridium: 5x1 line.

### Sprinklers

Auto-water tiles adjacent:
- Basic: 4 adjacent (orthogonal).
- Quality: 8 adjacent (incl. diagonal).
- Iridium: 24 tiles (5x5 area).
- With Pressure Nozzle attachment: +range.

Sprinklers lay out best in grids leaving gaps for sprinkler placement.

## Animals

### Buildings

Purchased from Robin (Carpenter):
- **Coop** (Deluxe 3 tiers): chicken, duck, rabbit, dinosaur.
- **Barn** (Deluxe 3 tiers): cow, goat, sheep, pig.
- **Slime Hutch**: slime pens (combat-themed).
- **Stable**: horse mount.

### Animals

- Affection 0-5 hearts; pet daily + feed to maintain.
- Products:
  - Chicken: egg (daily).
  - Cow: milk (daily after first few days).
  - Sheep: wool (every 3 days, shears).
  - Pig: truffles (found in dirt, outdoors).
  - Goat: milk every 2 days.
  - Dinosaur: dinosaur egg (rare).
- Auto-feeder (Deluxe building): pulls hay from silo automatically.

### Animal Care

- **Feed**: hay from silo or pasture grazing.
- **Pet**: daily interaction (+heart).
- **Shelter**: must be inside at night / during winter.
- **Pregnancy**: some animals can birth (with pregnancy enabled).

## Processing (Artisan Goods)

Converts raw produce → higher-value goods:
- **Preserves Jar**: fruit → jelly, veg → pickle (2x value).
- **Keg**: fruit → wine (3x), veg → juice (2.25x).
- **Cheese Press**: milk → cheese.
- **Mayonnaise Machine**: egg → mayo.
- **Loom**: wool → cloth.
- **Bee House**: flowers → honey (specific flower).
- **Crystalarium**: gem → gem replica (every N days).

Artisan path = highest gold-per-tile efficiency; late-game meta.

## Greenhouse

Community Center reward (or Joja equivalent):
- Year-round crops.
- No season restriction.
- Sprinkler-compatible.
- Fruit trees can be planted indoors.

## Fruit Trees

Planted permanently (needs clear 8-tile radius):
- **Apple / Cherry / Apricot / Orange / Peach / Pomegranate**: year-seasonal fruits.
- Requires 28 days to mature; then seasonal fruit every day.
- Fully-grown quality improves over years.

## Layout Patterns

### Min-Max

- Sprinkler grids dense (e.g., iridium 5x5 with 1-tile aisle).
- Kegs + preserves jars for conversion.
- Chest banks for storage.
- Pathed aisles for speed.

### Aesthetic / Cozy

- Curved paths.
- Decorative flowers.
- Themed sections (orchards, Japanese garden).
- Fences + lighting.

### Mixed

Most common; combines productive zones with decorative areas.

## Weather Events

Each day has weather:
- Sun: normal.
- Rain: crops auto-water; fishing bonuses.
- Storm: rain + lightning (can zap crops/machines with lightning rods).
- Snow (Winter): nothing grows; forageable snow yams.

## Seasonal Transitions

- On season end: all season-specific crops die (not harvested).
- Pre-plan: plant nothing in last 4-6 days of season unless multi-harvest or greenhouse.
- Winter: focused on Mining, Fishing, socializing, tool upgrades.

## Farm Upgrades

### House

Robin upgrades:
- **House 1** (kitchen): 10k gold + 450 wood.
- **House 2** (bigger + nursery): 50k gold + 150 hardwood.
- **House 3** (cellar with casks): 100k gold.
- **Stable**: 10k + 5 iron.
- **Mill**: 2.5k + materials.

## Design Principles

### Choose Your Pace

- Min-max: optimize tile efficiency, profit curves.
- Casual: plant a few, focus on relationships or mines.
- Aesthetic: farm as canvas.

No "correct" farm layout. Content rewards all approaches.

### Automation Curve

Early game: hand-water, hand-harvest, hand-pick eggs.
Mid-game: sprinklers + silos + auto-feeders.
Late-game: iridium sprinklers + pressurized nozzles + kegs-by-the-hundred.

### Breadth

Farming is one of five major skills. A player can skip farming entirely and focus on mining/combat/fishing and still sustain via foraging + trading.

### Permanent Choices

Farm layout is irreversible (base game). Crops are planted then tilled, but farm-type choice is a lasting decision.
