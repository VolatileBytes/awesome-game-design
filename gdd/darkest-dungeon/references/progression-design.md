# Progression Design — Darkest Dungeon

Darkest Dungeon has **two progression layers**: hero growth and estate growth.

## Hero Progression

### Levels

Heroes start at 0 (fresh recruit). They level up by earning XP from dungeons:

- Apprentice dungeon: lv 0–2.
- Veteran: lv 3–4.
- Champion: lv 5–6.
- Darkest Dungeon: all.

In **Darkest mode** (default), heroes of higher level refuse to enter lower-tier dungeons. This forces diversified roster management.

### Skills

Each class has **7 skills**. In the Guild you upgrade skills with gold + heirlooms:

- Starting skills: rank 1 (base).
- Upgrade to ranks 2–5 → better damage, accuracy, effects.
- Each hero brings 4 of 7 skills into a dungeon.

### Armor & Weapons

Each hero has a class weapon + armor — upgrade at Blacksmith:

- Weapon tier 1–5: +damage, +crit, +acc.
- Armor tier 1–5: +HP, +dodge.

Upgrades cost scaling gold + heirlooms (busts, portraits, deeds, crests).

### Quirks

Each hero has up to 5 positive + 5 negative quirks:
- Positive: "On Guard" (+dodge), "Quick Reflexes" (+initiative).
- Negative: "Kleptomaniac" (steals loot), "Corvid's Curse" (receives stress near certain curios).

Quirks accumulate by surviving dungeons and triggering events. Sanitarium removes them at cost.

**Locked** quirks become permanent (can't be removed, but you can lock good ones to preserve them).

### Trinkets

Equipment slots (2 per hero):
- Trinkets drop from bosses, dungeons, DLC curios.
- +buffs with -tradeoffs (e.g. +15% damage / +20% stress received).
- Some trinkets class-specific (Bounty Hunter's locket); others universal.
- Set trinkets: combo pieces synergize.

### Afflictions as State

Hero's history matters:
- **Deaths' Door survived** tally.
- **Afflicted** tally.
- **Virtuous** tally.
- **Diseases cured** / still active.

Some hero abilities or mods key off these stats.

## Estate (Town) Progression

### Buildings

Every run, spend heirlooms to upgrade Hamlet:

- **Stagecoach**: increases recruit count + max level on recruits.
- **Guild**: increases skill upgrade cap + cheaper training.
- **Blacksmith**: same for weapons/armor.
- **Sanitarium**: increases disease cure / quirk removal speed + cheaper.
- **Abbey / Tavern**: increases stress heal capacity + bonuses.
- **Survivalist**: more camping skills per hero.
- **Nomad Wagon**: better trinket drops.
- **Memorial Garden**: cosmetic; graveyard for the fallen.

Estate upgrades are **permanent**; each run makes the town better.

### Heirlooms

4 heirloom types, with **trade values** at the Nomad Wagon:

- **Busts**: upgrade Guild.
- **Portraits**: Abbey.
- **Deeds**: Stagecoach, Tavern.
- **Crests**: Blacksmith, Sanitarium, memorial.

Dungeons drop specific heirloom types based on region (Ruins → busts, Warrens → crests).

### Gold

- Spend on: skill upgrades, weapon/armor, stress heal, disease cure, provisions.
- Max carry: 25,000 gold (display cap; estate still shows total).

## Meta Milestones

The game's "main quest" is 4 Darkest Dungeon missions:

1. **DD1 — Apprentice**: first steps.
2. **DD2**: harder, confirms heroes who enter can't re-enter.
3. **DD3**: hardest fight mid-game.
4. **DD4**: final boss — Heart of Darkness.

**Hero lock-in**: heroes who complete a DD mission refuse to return. Plan your roster.

Post-DD4: NG+ / optional DLCs.

## DLCs Expansions

- **Crimson Court**: vampiric dungeon + Flagellant class + Crimson Curse disease (persistent).
- **The Color of Madness**: endless mode + Musketeer class.
- **The Shieldbreaker**: adventure pack + Shieldbreaker class.
- **The Butcher's Circus**: PvP mode.

## Radiant Mode

Tuned for shorter playthroughs (40 hours vs 80):
- Level restrictions relaxed.
- Heirloom drops increased.
- Some narrative paced faster.
- Same tone, same mechanics.

## Stygian Mode (DLC)

Hardcore:
- 12 heroes maximum death limit.
- 100-week time limit.
- If either exceeded: game over, restart estate.

## Currency Summary

| Currency | Scope | Earn | Spend |
|---|---|---|---|
| Gold | persistent | Dungeons, curios, selling loot | Skills, armor, stress cure, provisions |
| Busts | persistent | Ruins | Guild |
| Portraits | persistent | Weald | Abbey |
| Deeds | persistent | Warrens | Stagecoach, Tavern |
| Crests | persistent | Cove | Blacksmith, Sanitarium |
| Provisions | run | Bought pre-run | Used mid-dungeon |
| Torches | run | Bought pre-run | Light management |
| Food | run | Bought + drops | Hunger + heal |
| Trinkets | persistent | Drop + bought | Equip on hero |
| Hero slots | persistent | Stagecoach recruits | Used by hero assignment |

## Pacing Targets

| Milestone | Target week |
|---|---:|
| First Apprentice boss | 4–6 |
| Veteran dungeons unlocked | 8–10 |
| First Veteran boss | 14–18 |
| Champion unlocked | 25–30 |
| First DD mission | 40–50 |
| DD4 complete | 70–100 (80 avg) |

Radiant cuts all by ~40%.

## Design Philosophy

- **Every decision has cost**: can't heal HP and Stress and Disease the same week.
- **Permadeath is real**: the Graveyard is long.
- **Resources drive difficulty curve**: heirlooms > gold > heroes (in scarcity).
- **Hero rotation forced**: high-level heroes can't do low-tier dungeons → always need fresh recruits.
- **Narrative is environmental**: Ancestor's VO narrates the estate's descent, not quests.
