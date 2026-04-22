---
id: escape-from-duckov
title: Escape from Duckov
version: 0.1.0
description: Single-player top-down extraction shooter — ducks-with-guns parody of Tarkov with solo-friendly economy, persistent stash, and 10+ hour tactical loop.
tags: [top-down-shooter, extraction, single-player, indie, parody]
engines: [unity]
---

# Escape from Duckov

Single-player top-down extraction shooter by Team Soda (Chinese indie). Ducks occupy a world ravaged by some calamity; player takes the role of a lone duck armed and armored, entering dangerous zones, fighting hostile ducks and creatures, looting, and extracting.

> 2024 Early Access / 2025 release. Answer to "what if Tarkov were solo, top-down, and playable in a single sitting?" Heavy duck parody while retaining Tarkov's inventory + loss mechanics.

## Pillars

1. **Extraction shooter with solo tempo.** You dive into a zone, loot, fight AI, and extract. Loops are 5-15 minutes; sessions feel like roguelite-lite raids.
2. **Persistent stash + progression.** Your loot persists. Your weapons, mods, and meds carry between raids. Death in-raid = full-loss of in-raid loadout.
3. **Tarkov's inventory depth, streamlined.** Tetris grid, loot tiers, weapon mod system — all present, simplified to be accessible.
4. **Ducks are a mood.** Everything is ducks — ducks shooting ducks, duck chefs, duck construction workers. Tone is deadpan absurd.
5. **No online pressure.** No PvP means no rage-quits from ambushes. Pure PvE — the enemy is AI that can be studied and beaten.

## Modes

### Main Campaign
- Progress through increasingly dangerous zones.
- Story beats gate new areas.
- 30-50 hours to complete main storyline.

### Free-play Raids
- Replay any unlocked map for loot/XP.
- Harder difficulties unlock as you progress.

### Quest-driven Raids
- NPCs in the "home base" town give quests.
- Collect, kill, reach, extract.

## Home Base ("Duckburg")

Between raids, return to a persistent hub:
- **Stash**: out-of-raid inventory.
- **Vendors**: buy/sell, barter.
- **Workbench**: craft / mod weapons.
- **Medbay**: upgrade health regen.
- **Farm / Garden**: passive resource generation.
- **NPC interactions**: quests, lore, flavor.

## Map / Zone Design

Each zone:
- Top-down perspective.
- Isometric-ish, with visible LOS/walls.
- Size: small-to-medium (~100m across).
- Entry spawns + multiple extraction points.
- Loot containers + drop items + boss rooms.
- Time limit: 10-20 min typical.

Maps are persistent (same layout each visit) but loot + enemy placements vary per raid seed.

## Combat Model

Top-down shooter — think classic Alien Shooter meets Tarkov:

- **Weapons**: pistols, SMGs, rifles, shotguns, snipers, heavy weapons. ~30+ named guns.
- **Weapon mods**: attachments (scopes, suppressors, grips, mags, stocks).
- **Ammo types**: caliber × round-type (FMJ, HP, AP) — penetration matters.
- **Armor + helmet**: class 1-5; chest / head.
- **Body zones**: head (1-shot), torso (bulk HP), limbs (debuffs + bleed).
- **Bleed + fracture + pain**: debuffs heal via med items.

See [combat-design.md](references/combat-design.md).

## Health System

Simplified vs Tarkov:
- 4 body zones: Head, Torso, Arms, Legs (not separately left/right).
- Head hit usually fatal.
- Torso: ~100-200 HP depending on level.
- Arms: reduce damage / accuracy if blacked.
- Legs: reduce movement speed if blacked.

Med items: bandage, tourniquet, painkillers, stim. All consumable.

## Inventory

Tetris grid inventory:
- Backpacks: 4x4 to 8x8.
- Chest rigs: weapon quickdraw (mags).
- Secure pouch: 2x2 "safe area" — persists after death.

Drag/drop to place; rotate items; stack consumables.

## Economy

- **Coins** (primary currency): earned from raids + sold loot.
- **Vendor goods**: buy specific items or barter.
- **Crafting parts**: scrap, materials, scavenged items.
- **Ducks / NPCs** have unique inventories + rep scales.

See [economy-design.md](references/economy-design.md).

## Progression

### Character
- **Level** (XP from raids).
- **Skills**: combat (reload speed, aim stability), utility (carry weight, crafting).

### Gear
- Weapons progress via crafting (scrap + parts → upgraded gun).
- Armor drops in tiers; craft / buy mid-tier.
- Mods earned via raid loot.

### Zones
- New zones unlock by completing story quests.
- Higher-tier zones = better loot but harder enemies.

### Quests
- ~60+ quests; story and side.
- Rewards: coins, unique items, stash upgrades.

See [progression-design.md](references/progression-design.md).

## AI

Enemy ducks (and other creatures):
- **Grunts**: basic, pistol/shotgun/rifle.
- **Tacticals**: armored + mid-tier weapon.
- **Specialists**: snipers, heavy gunners, medics.
- **Bosses**: unique per zone; guards + named loot.
- **Wild fauna**: rats, insects, mutant creatures.

AI behaviors:
- Patrol routes.
- Alert → chase → flee.
- Grenades + flanking at higher tier.

## Death Mechanics

On death:
- Lose all in-raid inventory (except Secure Pouch).
- Stash items remain.
- No hour-long grind lost (raids are short).
- Some "insurance" on specific items via vendor.

## Audio

- **Footsteps**: directional.
- **Weapon audio**: distinct per gun.
- **Quack-lines**: ducks talk; narrator comments.
- **Ambient biome**: per-zone mood audio.
- **Music**: combat stingers + ambient.

## Tone

Parody + earnestness:
- Ducks with guns is the running joke.
- Gameplay is fully straight-faced.
- Art style cartoon-ish but environments have real grime.
- Voice acting: ducks speak in quacks + subtitles.

## References

- [3C Spec](references/3c-spec.md)
- [Combat Design](references/combat-design.md)
- [Progression Design](references/progression-design.md)
- [Economy Design](references/economy-design.md)

## Engines

- [Unity Implementation](engines/unity/GDD.md)
