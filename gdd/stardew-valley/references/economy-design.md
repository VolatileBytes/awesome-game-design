# Economy Design — Stardew Valley

Single currency, soft-balanced to progress the player from coin-poor starter to artisan-rich tycoon over 2-5 in-game years, with parallel paths for every play style.

## Currency

- **Gold (g)**: the only spendable currency.
- Earned from: selling crops, artisan goods, forage, fish, monster loot, quests, cooking.
- Spent on: seeds, tools, buildings, furniture, cooking ingredients, transport, tavern meals, festival entries.

### Special Tokens

- **Star Tokens** (Fall Fair only): one festival.
- **Qi Gems** (late-game): Mr. Qi's shop, Ginger Island, walnut quests.
- **Golden Walnuts** (Ginger Island): island-locked currency.

These are ancillary — core economy is plain gold.

## Income Sources

### Crop Income Per Season (peak)

| Crop | Season | g/day yield (approx) |
|---|---|---|
| Parsnip | Spring | 35 |
| Strawberry | Spring | 60 (multi-harvest) |
| Blueberry | Summer | 80 (multi-harvest) |
| Cranberry | Fall | 75 (multi-harvest) |
| Starfruit (Desert) | Summer | 110 |
| Ancient Fruit (greenhouse) | All | 140 |

Multiplied by farm size + quality + sprinklers.

### Artisan Goods Uplift

| Base Input | Output | Value Multiplier |
|---|---|---|
| Fruit (any) | Wine | ~3x |
| Fruit (any) | Jelly | 2x + 50g |
| Vegetable | Pickle | 2x + 50g |
| Milk | Cheese | ~1.67x |
| Ancient Fruit | Wine → Aged Wine | ~6x |

Late-game keg/cask chains = gold factories.

### Mining / Combat Loot

| Tier | Location | Income |
|---|---|---|
| Copper ore | Mines F1-40 | 5g |
| Iron ore | F40-80 | 10g |
| Gold ore | F80-120 | 25g |
| Iridium ore | Skull Cavern | 100g |
| Gems | Various | 50-750g |
| Prismatic Shard | Rare drop | 2000g (universal loved gift) |

Monster loot sells per-item.

### Fishing

- Fish values: 20-1000g depending on rarity.
- Legendary fish: 5000+g.
- Fish roe via aquarium → caviar (400-700g each).

### Foraging

- Wild seeds: 20-50g base.
- Truffles (pigs): 625g base (oil-boosted).
- Seasonal forage: 30-200g.

## Buying Economy

### Seeds (Pierre)

- Parsnip 20g.
- Potato 50g.
- Tomato 50g.
- Blueberry 80g.
- Ancient fruit 500g (Oasis only; rare).

### Tools (Blacksmith)

- **Copper upgrade**: 2k gold + 5 copper bars.
- **Steel**: 5k + 5 iron bars.
- **Gold**: 10k + 5 gold bars.
- **Iridium**: 25k + 5 iridium bars + 2 days.

### Buildings (Robin Carpenter)

- Coop: 4k + 300 wood + 100 stone.
- Barn: 6k + 350 wood + 150 stone.
- Silo: 100g + 10 stone + 10 clay.
- Kitchen upgrade: 10k + 450 wood.
- Cellar (final): 100k.

### Transport

- Bus pass: 500g (repaired via CC bundle).
- Desert trip: ~500g.
- Minecarts: free post-repair.
- Island boat: 1000g.

## Gold Sinks

Deliberate cost anchors across the game:

| Milestone | Cost | Impact |
|---|---|---|
| Upgrade to Gold Watering Can | 10k | 5x5 water |
| Deluxe Coop | ~30k total | Ducks + rabbits + mayo maker |
| Deluxe Barn | ~40k total | Pigs + truffles |
| Community Center (via time) | 0g but opportunity cost | 40+ hours |
| Joja Membership | 5000g + bundles | Alternative path |
| Iridium sprinklers (multiple) | ~50g materials each | Automation |

## Quality Tiers

Crops and certain products have quality:
- **Regular** (1x).
- **Silver** (1.25x).
- **Gold** (1.5x).
- **Iridium** (2x).

Farming skill level + fertilizer determines silver/gold/iridium rates.

Artisan machines produce only gold-quality outputs regardless of input (except preserves jar preserves inputs' quality).

## Savings Curve

Typical progression:
- **Year 1 Spring**: 500-3000g total income.
- **Year 1 Summer**: 5k-20k.
- **Year 1 Fall**: 30k-100k.
- **Year 1 Winter**: slower; mining + fishing + crafting.
- **Year 2**: 100k+ per season (with sprinklers + greenhouse).
- **Year 3+**: 500k+ per season (kegs + iridium crops).
- **Late game**: millions / season with full artisan setup.

## Community Center Bundles

Non-gold cost — resource-specific:
- Pantry: Spring/Summer/Fall/Winter crops + quality tiers.
- Crafts Room: seasonal forage + geodes.
- Fish Tank: river/ocean/legendary fish.
- Boiler Room: smelted bars + artifacts.
- Bulletin Board: NPC-specific items.
- Vault: 2500g + 5000g + 10000g + 25000g gold bundles.

Each bundle reward: unlocks mechanic or feature (greenhouse, bus, minecarts, bridge, new areas).

## Joja Membership Path

Alternative to Community Center:
- 5000g membership.
- Each bundle equivalent: 10k-40k gold purchase.
- Total: ~200k to buy full completion.
- Trade-off: no community celebration cutscene; Joja "bad" ending.

## Money-Making Strategies

### Speedrun Route

- Crops + quality fertilizer.
- Early sprinklers.
- Ancient fruit seeds.
- Wine in kegs.
- Reach 1M in ~Year 2-3.

### Min-Max Route

- Hills farm → mining focus.
- Skull Cavern → iridium farming.
- Prismatic shards for universal loved gifts.
- Reach 1M in ~Year 1 Winter possible (expert).

### Casual Route

- Mix everything.
- Complete Community Center across Year 1-2.
- Reach 100k in Year 1; expand gradually.

### Collection Route

- Perfection rating focus.
- Cook every recipe, catch every fish, donate every artifact.
- Gold accumulates incidentally.

## Inflation Control

- Seed prices fixed.
- Tool upgrade costs fixed.
- No auction system.
- No gold decay.
- Building costs are one-time.

Late-game player has "too much gold" — this is fine; cosmetic spending (furniture, statues) mops excess.

## Wealth Milestones

Game milestones based on gold earned:
- 10k: early achievement.
- 100k: mid-game stable.
- 1M: late-game wealthy.
- 10M: ultra-farmer.

Achievements + statue rewards at each tier.

## Design Philosophy

### Every Activity Pays

No dead-end play. Farming, mining, fishing, foraging, combat, cooking — all valid income sources.

### Growth Curve Respects Time

Year 1 feels lean → exciting to grow.
Year 2 feels prosperous.
Year 3+ feels mastered.

No FOMO; players reach endgame when they want.

### Soft Caps

Artisan machines cap throughput (only so many kegs fit). Time per day caps actions. Balance emerges naturally.

### No Paid Progression

Everything earnable via gameplay. Mobile/console don't add IAP beyond the initial purchase.

## Rejected Patterns

- **Multiple currencies**: only gold matters day-to-day.
- **Scarcity-driven tension**: cozy game; no catastrophic loss.
- **PvP market / trading**: no player-market auction (co-op has shared chest only).
- **Gold decay / taxes**: money saved stays saved.
- **Pay-to-skip farming**: premium iron tools not available.
