---
id: stardew-valley
title: Stardew Valley
version: 0.1.0
description: Country-life farming sim RPG — inherit a grandfather's farm, grow crops, raise animals, befriend townsfolk, explore mines, marry, restore a valley.
tags: [farming-sim, rpg, life-sim, indie, 2d, top-down, single-player, co-op, cross-platform]
engines: [monogame]
---

# Stardew Valley

Country-life farming simulator by ConcernedApe (Eric Barone). The player inherits a run-down farm in Pelican Town and transforms it while exploring mines, fishing, foraging, befriending 30+ NPCs, and gradually restoring the valley's Community Center (or selling out to JojaMart). Designed as a spiritual successor to Harvest Moon with more depth across every axis.

Originally released 2016 for PC; ported to console, mobile, and Switch. Ongoing free content updates (1.4, 1.5, 1.6) add significant content every ~2 years. Built primarily by a single developer with XNA/MonoGame.

## Snapshot

| Field | Value |
|---|---|
| Studio | ConcernedApe (solo-dev + Ape Sauce for ports) |
| First release | 2016-02-26 |
| Engine | XNA / MonoGame (custom C#) |
| Genre | Farming sim / RPG / life sim |
| Players | 1 (single-player) or 1-4 (co-op) |
| Perspective | Top-down 2D pixel-art |
| Platforms | PC, Mac, Linux, Xbox, PlayStation, Switch, iOS, Android |
| Business model | Paid (~$15) with free major updates |
| Avg session | 1-3 hours (one in-game day ≈ 15-20 real min) |

## Design Pillars

1. **Cozy Sandbox** — no fail state, no pressure timer beyond the in-game day/season rhythm.
2. **Breadth Over Depth** — farming, combat, fishing, foraging, mining, cooking, crafting, relationships, all simultaneously valid.
3. **Long-Horizon Goals** — Community Center restoration, marriage, perfection rating, each takes multiple in-game years.
4. **Character Depth** — every NPC has backstory, hearts, cutscenes, quests, dialogue rotation.
5. **Player Expression** — farm layout, spouse choice, specialization all open.

## Time Model

Game runs on in-game days:
- **Day**: 6am wake → 2am forced sleep, compressed to ~14 real minutes.
- **Season**: 28 days = one season (Spring, Summer, Fall, Winter).
- **Year**: 4 seasons = 112 days.
- **Years**: uncapped; content unlocks continue across years.

Each season:
- Unique crops (only plantable that season).
- Unique fish, foraging, weather.
- Festivals on specific dates.
- NPC schedules shift.

## Core Activities

### Farming

- Prepare tiles (hoe).
- Plant seeds (purchased or foraged).
- Water daily (or sprinkler).
- Harvest after N days (crop-dependent).
- Sell, process (keg/jar), cook, gift, or feed animals.

### Animal Husbandry

- Coop animals: chickens, ducks, rabbits, dinosaurs.
- Barn animals: cows, goats, sheep, pigs.
- Daily chores: feed, pet, collect products.
- Products: eggs, milk, wool, truffles → cheese, mayo, cloth.

### Mining / Combat

- Mines (East): 120-floor dungeon with monsters + ore + gems.
- Skull Cavern (Desert): randomized deeper dungeon.
- Weapons: swords, daggers, clubs, slingshots.
- Loot: iron/gold/iridium ore, gems, monster parts, rare items.

### Fishing

- Fishing minigame: hold bar to keep fish centered.
- 80+ fish species, seasonal + location-specific.
- Catch for sell, cook, bundle, or community-center submission.
- Legendary fish: one-per-save major captures.

### Foraging

- Wild plants per season + region.
- Seasonal forageables (salmonberries, blackberries, winter roots).
- Tree tapping (syrup, resin).
- Skill improves quality + yield.

### Relationships (NPCs)

- 30+ townspeople with unique schedules + backstories.
- **Friendship hearts**: 0-10 per NPC; gift, dialogue, quests build hearts.
- **Cutscenes**: unlock at heart milestones (2, 4, 6, 8, 10).
- **Romance**: 12 romanceable NPCs; marry at 10 hearts.
- **Children**: adopt after marriage; up to 2.

### Crafting / Cooking

- Crafting: tools, furniture, storage, machines (preserves jar, keg, crystalarium).
- Cooking: kitchen after first farm upgrade; 80+ recipes.
- Recipes learned: TV channel, NPC gifts, quests.

### Community Center vs JojaMart

- Community Center: restore 6 rooms via bundles (30+ bundles, each asks for specific items).
- OR JojaMart Membership: buy completions. Fast but narratively "bad ending."
- Binary choice branch; each NPC + ending reacts.

## World

### Pelican Town

Central hub map:
- Clothier, Seed Shop, Saloon, Clinic, Library, Blacksmith, JojaMart.
- 30+ NPC homes.

### Farm

Player's area; multiple farm-type choices on new save:
- **Standard**: balanced tillable land.
- **Riverland**: fish-heavy, limited crops.
- **Forest**: foraging-heavy, tillable pockets.
- **Hill-top**: mining spot on-farm.
- **Wilderness**: monsters at night.
- **Four Corners** (co-op): four distinct zones.
- **Beach** (1.5+): coastal with supply crates.
- **Meadowlands** (1.6+): animal-focused.

### Regions

| Region | Unlocks | Content |
|---|---|---|
| Pelican Town | Day 1 | NPCs, shops |
| Cindersap Forest | Day 1 | Foraging, Leah's cottage, wizard |
| Mountain | Day 1 | Mines entrance, Robin (carpenter) |
| Beach | Day 1 | Fishing, beach forage |
| Desert | After Bus Repair (~Year 1) | Skull Cavern, Casino |
| Secret Woods | After Steel Axe | Rare foraging, Stumpy |
| Ginger Island | After Community Center | New crops, jungle dungeon, Leo |

## Skills

Five skill axes, 0-10 levels each:

- **Farming**: crop growth bonuses, quality.
- **Mining**: ore yield, stamina on dig.
- **Combat**: damage, HP, monster XP.
- **Fishing**: bar size, casting.
- **Foraging**: yield, woodcutting.

Each level unlocks crafting recipes + profession choices at 5 and 10.

## Energy / Stamina

Stamina depletes with actions (farming, chopping, mining, fishing). Restore via:
- Food (hearty meals).
- Sleeping (daily reset).
- Spa (free, unlocked ~Year 1).

Stamina 0 = pass out, lose some time + gold but no hard penalty.

## Save System

- Auto-save on sleep (each morning = new save state).
- Multiple manual saves possible via file copies.
- Single-save-file-per-character in base game.
- Co-op: host's save is shared state.

## Core Loop

```
New Day:
- Wake 6am
- Water crops / refill feeders
- Collect animal products
- Do farm chores (plant, harvest, chop, fish)
- Visit town / NPCs
- Mine or fish or forage
- Complete quests / give gifts
- Return home by 2am
- Sleep → new day
```

Season ends → seasonal cleanup:
- Harvest last crops.
- Plant seeds for next season.
- Note festival dates.

Year ends → long-term progression markers.

## Festivals

Per-season, specific dates:
- **Spring**: Egg Festival, Flower Dance.
- **Summer**: Luau, Dance of the Moonlight Jellies.
- **Fall**: Stardew Valley Fair, Spirit's Eve.
- **Winter**: Festival of Ice, Feast of the Winter Star.

Each: unique minigame, unique rewards, NPC interactions.

## References

- [3Cs Spec](references/3c-spec.md)
- [Farm Design](references/farm-design.md)
- [NPC & Relationship Design](references/npc-design.md)
- [Economy Design](references/economy-design.md)
- [Progression Design](references/progression-design.md)

## Engine Overlays

- [MonoGame (custom C#)](engines/monogame/GDD.md)
