# Progression Design — Dead Cells

Dead Cells stacks several progression systems so that **every run advances at least one**.

## In-Run Progression

### Scrolls (Power)

- Scrolls of Power: choose Red/Purple/Green.
- Power Scrolls (post-biome): +1 to ALL three colors plus a chosen color stat.
- End-of-run scroll count: 15–25 scrolls typical.

Each scroll increases:
- HP (all scrolls).
- Weapon/skill damage scaling for its color.

### Currency

- **Gold**: runs only. Spent at shops, shrines, blacksmiths. Lost on death.
- **Cells**: runs only → convert at the Collector (post-biome NPC) to unlock blueprints → then cells are lost on run end.

### Gear

- **Weapons**: 2 slots (main + off-hand).
- **Skills**: 2 slots.
- **Mutations**: 4 slots (unlocked at specific shrines mid-run).
- **Amulets**: rarely drops; passive stats.

Mutations are run-scoped and selected at shrines every 2–3 biomes. 50+ mutations.

## Meta Progression

### Blueprints

- Weapons/skills/mutations drop as blueprints in-run (from enemies, chests, bosses).
- Blueprints convert at the Collector for cells.
- Once unlocked, blueprint enters the drop pool for future runs.
- ~400 blueprints total (base + DLCs).

### Forge Upgrades

Collect "Cells" at the Collector to upgrade the **forge**:
- Unlock weapon quality tiers (Common → Rare → Epic → Legendary).
- Improves average drop quality in future runs.

### Food Upgrade

Small persistent HP bonus from a one-time food unlock at the start biome.

### Boss Cell Unlocks

Clear Hand of the King → +1 Boss Cell activated. 5 total.

Each BC unlocks:
- Harder enemies.
- New elite types.
- Tighter healing.
- Malaise mechanic at 3BC+.

### Rune Unlocks

5 Runes gate biome access. Once found, permanent. Path:

```
Vine Rune (Prisoner's Quarters elite)
→ Teleportation Rune (Promenade or Toxic Sewers)
→ Ram Rune (Ossuary / Graveyard)
→ Spider Rune (Slumbering Sanctuary)
→ Challenger Rune (special challenge door)
```

Runes are one-time run goals; after you have them all, paths are fully open.

### Outfits & Skins

~30+ cosmetic outfits unlocked by secret blueprint drops or challenge runs.

## Challenge Mode ("Custom Mode")

Post-unlock, players can build custom runs:
- Pick starting weapons.
- Pick mutations.
- Adjust difficulty.
- Not eligible for scroll-count records (leaderboard-safe).

## Aspects (DLC / late-game)

Aspects are powerful passive perks unlocked at endgame NPC. Cost: one of your curses (permanent-until-broken debuff). Aspects include:
- Double damage at full HP.
- Huge HP pool + no potions.
- Unlimited skill cooldown → no skill damage.

Aspects are build-defining — reshape an entire run around one.

## Pacing Targets

| Milestone | Target run count |
|---|---:|
| First 0BC clear | 20–40 runs |
| Most base blueprints unlocked | 60 runs |
| First 1BC clear | +10 runs after 0BC |
| 5BC first clear | 200+ runs |
| Total content explored | 500+ runs |

## Currency Design

**Cells are the throughline**: every run nets cells even if you die. No run feels wasted as long as you carry cells into the Collector.

Cells spent:
- 10–50 cells per blueprint.
- Higher tier blueprints cost more.
- At 5BC, each Collector NPC only converts a limited number (enforces doing multiple runs).

## Motivation Layer

The game uses **discovery** as motivation, not grind:
- "What's in the cursed chest" (risk-reward).
- "What does this weapon do" (experimentation).
- "Can I reach the time door in time" (skill challenge).

No daily quests, no live-service hooks. Pure roguelite loop.

## Deathloop Hooks

Every death:
- Blueprints earned → convert at next-run's Collector → permanent unlocks.
- Cells earned → convert → permanent upgrades.
- Scroll locations learned → better build planning next run.
- Enemy pattern knowledge → better survivability next run.

This is the core of roguelite design: **every death adds one unit of progress**.

## Rebuild Scope

For a from-scratch rebuild, minimum viable progression:
- 50 blueprints (10 weapons, 10 skills, 10 mutations, 20 misc).
- 3 Boss Cells.
- 3 Runes.
- 5 biomes.
- 2 bosses.

That's ~30% of the game's content but captures the core loop. Full scope is 10x work.
