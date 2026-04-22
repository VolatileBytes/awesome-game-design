---
id: dead-cells
title: Dead Cells
version: 0.1.0
description: 2D action metroidvania roguelite. Control a reanimated mass of cells who possesses corpses and fights through procedurally arranged biomes. Die, lose progress, unlock permanent blueprints, run again.
tags: [pc, mobile, console, action, roguelike, roguelite, metroidvania, indie, single-player, hack-and-slash, platformer]
engines: [unity, godot]
---

# Dead Cells

Dead Cells (2018, Motion Twin / Evil Empire) combined Metroidvania exploration, roguelite runs, and Souls-like combat feel. Runs are linear chains of procedurally arranged biomes; death resets you but blueprints, passive stats, and knowledge persist.

## Pillars

1. **Tight 2D combat** — 60fps dodge/roll, parry, weapon affinity (Brutality/Tactics/Survival).
2. **Run chaining biomes** — 30+ biomes, each run chooses a path through them; no two chains identical.
3. **Permadeath that builds meta** — death loses your run's gear but unlocks blueprints + cells for permanent upgrades.
4. **No RNG walls** — every level is winnable; there's no "bad seed."
5. **Rapid content updates** — 5+ free DLC content drops post-launch (Rise of the Giant, The Bad Seed, Fatal Falls, The Queen and the Sea, etc.).

## Core Loop

```
Start at Prisoner's Quarters →
  Clear the biome (combat, explore, find scrolls/gear) →
  Choose exit door (1–3 options, each to a different next biome) →
  Continue through 8–13 biomes →
  Final boss: Hand of the King (or DLC bosses) →
  Die OR win → return to start

Permanent between runs:
  Blueprints → unlocked weapons/mutations/outfits
  Cells → spent at forge NPCs for blueprint unlocks
  Scroll ratings → starting stats bump
  Difficulty "Boss Cell" unlocks → escalating endgame
```

A typical run: 30–60 min. Win/loss ratio: beginners 1/20; experienced 1/3 on base difficulty.

## Biomes (selection)

- **Prisoner's Quarters** — starting biome, easy.
- **Promenade of the Condemned** — outdoor, ranged enemies.
- **Toxic Sewers** — alternate from Prisoner's.
- **Ramparts** — vertical, archers, climbing.
- **Ossuary** — undead theme.
- **Stilt Village** — lanterns, thematic shift.
- **Graveyard** — rain, underwater rooms.
- **Clock Tower** — time theme, Time Keeper boss.
- **High Peak Castle** — late-game, Hand of the King boss.
- **DLC biomes**: Cavern (Giant boss), Undying Shores, Fractured Shrines, etc.

Each biome has:
- ~2–5 exit doors; some require **Runes** (permanent unlocks).
- Hidden rooms (secret walls, challenge rifts).
- A **miniboss/elite spawn chance**.

## Runes

Permanent world-unlocks found in biomes:

- **Vine Rune** — climb vines (opens paths).
- **Teleportation Rune** — use teleport platforms.
- **Spider Rune** — climb walls.
- **Ram Rune** — ground-pound through floors.
- **Challenger Rune** — enter challenge rifts.

Runes don't carry run-to-run by default; they're permanent once acquired — so the first 3–5 runs progress Runes, then runs branch more freely.

## Combat

### Weapons

300+ weapons/mutations categorized by **color**:
- **Red (Brutality)** — high DPS melee (swords, fists).
- **Purple (Tactics)** — ranged, traps, crowd control.
- **Green (Survival)** — tank, shields, heavy weapons.
- **Rainbow** — scales with whichever of R/P/G is highest.

Each weapon has:
- Base damage.
- Affinities (0–3 of R/P/G that scale it).
- Effect (bleeding, burning, frozen, poisoned, stunned, targeted).
- Special moves (e.g. Rapier: perfect parry counter).

### Parry & Dodge

- **Roll**: iframes through damage; always available.
- **Shield** (equipped in weapon slot 2): hold to block; release at right moment = parry (reflect projectile, stun enemy).
- **Jump**: double jump via a mutation or starter outfit feature.

### Scrolls

Scrolls drop between rooms. Choose 1 of 3 R/P/G scrolls. Each scroll:
- +1 to its color's stat → increases damage of that color's weapons/skills + HP.

Scroll count = your power level at that stage of run. Dedicated stacking (all Red) = glass cannon; balanced = survivable.

### Enemies

~60 base enemies × 4 elites × ~30 DLC enemies. Each has:
- Clear tell (yellow outline before striking).
- A weakness type.
- Patrol pattern.

## Boss Cells (Difficulty Tiers)

5 Boss Cells = 5 ascending difficulty tiers unlocked sequentially:

| BC | New |
|---|---|
| 0 | default |
| 1 | more enemies per biome, fewer healing |
| 2 | new enemy types, cursed chests |
| 3 | Malaise (toxic effect over time if killing too slowly) |
| 4 | healing only from Fountains, harder patterns |
| 5 | "5BC" — all prior + extra, the endgame |

Progress from 0BC to 5BC is the long-term skill climb.

## Meta Progression

**Cells**: in-run currency. Carry them through a biome transition via the Collector NPC; he converts cells → blueprint unlocks.
- ~400+ blueprints (weapons, mutations, outfits).
- Some require specific drops (plant a prerequisite blueprint + cells).

**Gold**: in-run currency, resets on death. Spend at shops, shrines.

**Scroll ratings**: first-time completion of a biome at a Boss Cell tier boosts your start bonus.

## Original Engine

Built in **Haxe + OpenFL** with Heaps engine (Motion Twin's own). Rebuild target: Unity for cross-platform simplicity. Godot is also a strong candidate given open-source alignment.

## References

- [3C Spec](references/3c-spec.md)
- [Combat Design](references/combat-design.md)
- [Biome Generation](references/biome-generation.md)
- [Progression Design](references/progression-design.md)
- [Unity Implementation](engines/unity/GDD.md)
