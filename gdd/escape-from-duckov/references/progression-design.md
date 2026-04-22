# Progression Design — Escape from Duckov

Progression is layered across character XP, vendor rep, zone unlocks, and gear tiers — all earned through raids.

## Character Level (1-50)

XP from:
- Raid completion (extract alive).
- Kill XP (scaled by enemy tier).
- Quest completion.
- First-time zone visits.
- Boss kills.

Level milestones unlock:
- Skill slots.
- Higher-tier vendor stock.
- New zone access.
- New quest tiers.

## Skills

~15 skills grouped:

### Combat
- **Rifle / Pistol / Shotgun / Sniper Mastery**: reduce recoil, faster reload.
- **First Aid**: faster heal, more HP from medkits.
- **Reload Drills**: faster mag swaps.

### Survival
- **Endurance**: more stamina.
- **Strength**: carry more weight.
- **Perception**: longer detection range for loot/enemies.

### Crafting
- **Workbench**: faster crafting.
- **Scavenging**: higher-quality drops.
- **Cooking**: preserve food longer.

### Social
- **Charisma**: vendor price discount.

Skill XP from activity-related use.

## Gear Tiers

Gear has tiers 1-5:
- **T1**: starter; scavenged.
- **T2**: common; vendor-reach.
- **T3**: uncommon; mid-zone loot.
- **T4**: rare; high-zone boss drops.
- **T5**: legendary; end-game boss + crafting.

Weapons + armor + mods each tiered.

## Weapon Mastery

Per-weapon-category mastery level increases:
- Reduces recoil.
- Reduces ADS time.
- Increases reload speed.
- Unlocks higher tiers.

Mastery XP = shots fired, kills scored.

## Zone Progression

Zones unlock sequentially as you complete story quests:

1. **Outskirts** (starter): low-tier, training-wheels.
2. **Suburbs**: mid-tier, first boss.
3. **Downtown**: medium, more AI variety.
4. **Industrial Park**: heavy armor enemies, mid-tier loot.
5. **Underground**: maze layouts, stealth-friendly.
6. **Military Base**: heavily defended, elite AI.
7. **Ruined Cathedral**: end-game; unique items.
8. **The Nest** (endgame): boss-rush finale.

Each zone:
- Has primary quest.
- Has optional side quests.
- Has 1-2 bosses.
- Has unique loot.

Harder zones:
- Re-unlock scaled-up versions of earlier zones post-story.

## Quests

~60-80 quests:

### Main Story (~20)
- Drive zone unlock.
- Narrative beats.
- Boss fight culminations.
- Rewards: zone access, unique gear, NPC interactions.

### Side (~30)
- Per-NPC quests (find X, rescue Y, kill Z).
- Reputation + rewards.

### Collection (~10)
- Find lore items scattered.
- Rewards: cosmetic / stat boost.

### Daily / Weekly
- Per-session micro-objectives.
- Small XP + coin rewards.

## Vendor Rep

NPCs in Home Base:
- **Mechanic Duck**: weapon parts, mod installs.
- **Doctor Duck**: medical supplies, Medbay upgrades.
- **Farmer Duck**: food, Garden upgrades.
- **Merchant Duck**: general goods, coins ↔ items.
- **Smith Duck**: armor, helmets, repair.
- **Questmaster Duck**: quest giver.

Each has rep (0-100):
- +rep from completing their quests.
- +rep from selling certain items to them.
- Higher rep = better stock + discount.

Rep levels unlock:
- Barter trades.
- Premium items.
- Unique quests.

## Home Base Upgrades

### Workbench
- Craft weapons / mods.
- Repair durability.
- Tier 1-3: faster, unlocks higher-tier crafts.

### Medbay
- Heal stats between raids.
- HP regen rate per tier.
- Unlock surgery (black-zone restore).

### Garden / Farm
- Grow food + crafting reagents.
- Passive drip every raid-session.

### Stash
- Inventory capacity; expandable.

### Personal Quarters
- Cosmetic + small stat boosts.
- Duck decorations unlocked.

## Crafting

Recipes discovered via loot + quest rewards:
- **Weapon parts** → weapon upgrade.
- **Armor parts** → armor craft / repair.
- **Medical supplies** → stim / advanced meds.
- **Food** → healing food with perks.
- **Grenades** → craft consumable.

Crafting takes real-time (seconds to minutes); queue allows parallel.

## Insurance / Loss Mitigation

- **Pay vendor coins per item**: partial return on death.
- **Not full insurance**: losses still sting, just not catastrophic.
- **Secure Pouch**: 2x2 slot contents always survive.

## Time Cadence

Average session: 20-60 minutes (1-4 raids).
Main story: 30-50 hours.
Completionist: 80-120 hours.
Full mastery: 200+ hours.

## Design Philosophy

### Respect Player Time

Tarkov's 300-hour gating rebuilt for:
- 40-hour campaign.
- Short raids (10-20 min).
- Persistent stash + auto-save.
- No wipes.

### Earn > Grind

Progression always forward:
- No respec penalty.
- No currency decay.
- Skills gain with play.

### Meaningful Choice

Every level-up has skill choice.
Every craft costs meaningful resources.
Every loot is pickup-or-leave decision.

### No FOMO

- No daily login.
- No seasonal wipes.
- No limited-time events (or very few).

## Rejected Designs

- **Seasonal wipes**: not single-player friendly.
- **Paid expansions for essential gear**: premium edition only for cosmetic / starter boost.
- **Raid-per-day limits**: respect player cadence.
- **PvP-locked progression**: single-player throughout.
