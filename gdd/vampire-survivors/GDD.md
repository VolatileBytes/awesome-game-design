---
id: vampire-survivors
title: Vampire Survivors
version: 0.1.0
description: Bullet-heaven roguelite where a single character auto-attacks swarms of enemies across a 30-minute run while drafting weapon and item builds.
tags: [roguelite, bullet-heaven, action, 2d, top-down, pixel-art, single-player]
engines: [unity]
---

# Vampire Survivors GDD

## Elevator Pitch

You move. The game shoots. Every level-up you pick one of three cards. Every seven minutes the horde gets meaner. After thirty minutes The Reaper deletes you and you spend your gold on permanent stat bumps. Repeat until you've unlocked every weapon, evolved every build, and found the seams in the game's physics.

It is a power-fantasy game dressed as a survival game. The tension is not "will I die?" — it is "can my build ramp fast enough to stay ahead of the spawn curve?"

## Design Pillars

1. **One input, many decisions.** The only moment-to-moment input is movement. Every meaningful choice is made at level-up or map pickup.
2. **Readable chaos.** Thousands of enemies and projectiles on screen. The player must still parse threats at a glance.
3. **Visible ramp.** Numbers get bigger fast. The fantasy is watching your damage-per-second chart go vertical.
4. **Cheap failure, cheap retry.** A run is 30 minutes max. Death drops you straight into the meta shop. No friction between runs.
5. **Build discovery.** Weapon evolutions are a hidden layer. Finding one should feel like breaking the game.

## Core Loop

**Seconds (moment-to-moment):**
- Player moves with a stick / WASD
- Equipped weapons auto-fire on their own cooldowns
- Enemies spawn off-screen, path toward player
- Enemies die; drop gems; gems grant XP
- On XP threshold, a level-up card draft pauses the game

**Minutes (in-run):**
- Every minute the spawn table shifts — new enemy types, higher density
- Treasure chests drop from elites and grant 1–5 weighted level-ups
- Weapons reach max level; if paired with the correct passive, evolution triggers into a much stronger variant
- Every ~5 minutes an elite wave or shaped spawn pattern (skulls, bats, ring) tests positioning

**Run (0–30 minutes):**
- First 10 min: establish base build, evolve 1–2 weapons
- Mid 10 min: cap weapons at 6, cap passives at 6, evolve the rest
- Last 10 min: stomp or survive; at 30:00 The Reaper spawns and ends the run

**Meta (across runs):**
- Gold collected during runs persists regardless of outcome
- Gold is spent in a power-up shop on permanent passive stat bumps (Might, Max Health, Armor, Cooldown, etc.)
- Achievements unlock new characters, stages, and weapons
- Unlocked weapons enter the global level-up pool for future runs

## 3Cs (Summary)

- **Camera:** top-down, fixed orthographic zoom, tracks the player with no manual control
- **Character:** 8-directional movement, no facing input, no attack input, no jump, no dash (base)
- **Controls:** stick or WASD only; level-up draft via cursor/d-pad

See [references/3c-spec.md](references/3c-spec.md) for full details.

## Systems

### Weapons

Weapons auto-fire on a per-weapon cooldown. The player equips up to **6 weapons** in a run. Each weapon has:

- Base damage, area, projectile count, duration, knockback, cooldown, speed
- **Levels 1–8.** Each level bumps one or more of those stats.
- An **evolution** trigger: at level 8 AND paired with a specific passive item at any level, the next chest the player opens evolves the weapon into a distinct super-variant (often with different firing logic entirely).

Weapons fall into archetypes: **projectile-forward** (Whip, Knife), **orbiting** (King Bible, Garlic aura), **homing** (Magic Wand, Runetracer), **thrown/bouncing** (Axe, Cross), **area-lock** (Santa Water, Lightning Ring). A strong build mixes at least two archetypes so that enemies approaching from any angle meet damage before they meet the player.

### Passive Items

Up to **6 passives** per run. Each has 5 levels. Passives multiply core stats (Might = damage, Armor = flat dmg reduction, Max Health, Recovery, Cooldown, Area, Duration, Speed, Luck, Growth = XP gain, Greed = gold gain, Magnet = pickup radius). A passive is also the second ingredient for a weapon evolution.

### XP & Level-Up Draft

Enemies drop gems of three tiers: blue (small), green (med), red (large — elites only). XP curve is roughly quadratic — early levels are near-instant, later levels require stockpiling. On level-up the game pauses and the player picks 1 of **3 random cards** drawn from: weapons the player has room for, weapons already equipped (to level up), passives with the same logic, or a **Skip** card that refunds a tiny heal.

Draft pool weighting, reroll/banish/skip economy, and evolution triggers are detailed in [references/progression-design.md](references/progression-design.md).

### Enemy Waves

Enemies are defined by a **spawn table indexed on in-run time**. At each minute mark, the active entry rotates: a list of enemy types, their spawn rate, their HP/damage/speed multipliers, and spawn pattern (radial, stream, ring, elite-with-escort, mass-with-boss).

Key principles:
- **Density scales far faster than HP.** The fantasy is mowing down more enemies, not tanking bigger ones.
- **Elites drop chests.** Chests are the main evolution trigger — so the spawn designer is also the pacing designer for build power.
- **Shaped waves break auto-pilot.** Long ring spawns, conga lines, and pinch patterns force the player to physically reposition.
- **The Reaper** is a hard fail-state enemy at 30:00 — unkillable, one-shot melee, chases the player. Game ends.

### Stages

Each stage is a tile-based open plane (conceptually infinite, implemented as a tiled wrap). Stages differ in:
- Background art + ambient hazards (walls, water, bookshelves, coffins)
- Spawn table (different enemies, different pacing)
- Scripted pickups (scrolls, arcana, destructible objects that drop gold/heals)
- Unlock conditions

### Meta Progression

**Power-Up Shop.** Flat passive stat buffs, permanent, purchased with gold. Each has 5–10 ranks, priced on a steep curve. Diminishing returns are intentional — the shop should accelerate mid-progression builds without trivialising unlocks.

**Unlockables.** New characters (each with a starting weapon and a per-level stat quirk), new weapons (added to the global pool), new stages, and **Arcana** — modifiers unlocked for specific runs via in-stage pickups.

Full economy in [references/economy.md](references/economy.md).

### Arcana

A second progression layer picked up **in-run** from scripted locations. Arcana are powerful build-defining modifiers ("all weapons that deal fire damage also ignite the ground", "rerolling heals you", "multipliers apply to knockback"). There are more arcana than the player can pick in a run — the choice itself becomes build-defining.

## Failure & Win Conditions

- **Lose:** HP reaches 0, OR 30:00 elapses and The Reaper kills you
- **Win condition (run):** survive to 30:00 before The Reaper, then let the Reaper kill you (there is no "victory" beyond this — the run ends regardless)
- **Long-term progress:** complete-the-collection — characters, weapons, evolutions, stages, achievements

## Balance Philosophy

Balance is **skewed toward player power**, not symmetry. The game is satisfying because the fantasy outruns the threat. The designer's job is to keep the fantasy legal — i.e. make sure there's always at least *one* thing on screen that will punish greed, so the player still has to move.

Practical rules:
- **Early game is always the hardest.** Before the first weapon evolution, the player is weak and the threat must be calibrated so that most builds survive. After the first evolution, the difficulty curve bends — and this is by design.
- **There should always be a worse decision available.** If every pick is strong, the draft is meaningless.
- **At least one enemy type per stage must ignore positioning.** Teleporters, ranged snipers, ring spawns — something that demands the player actually move, so movement stays valuable.

## UX Pillars (Summary)

- **Readability under chaos** — silhouettes, colour coding, damage-number restraint
- **Feedback per event** — every hit, pickup, level-up pops
- **Pause-to-read** — the game pauses on every draft so the player can actually read cards
- **Accessibility** — adjustable damage-number density, screen shake, flash intensity

See [references/ux-pillars.md](references/ux-pillars.md).

## Out of Scope / Non-Goals

- Multiplayer (the game is single-player; the HUD, pacing, and spawn tuning all assume it)
- Branching maps or procedural level layouts
- Gear slots, crafting, or inventory management outside weapon/passive slots
- Story-driven narrative; flavour text only
- Real-money monetisation within the run

## References

- [3Cs Spec](references/3c-spec.md) — camera, character, controls
- [Progression Design](references/progression-design.md) — draft pool, level-up, evolutions, arcana
- [Economy](references/economy.md) — gold, shop, unlock gates
- [UX Pillars](references/ux-pillars.md) — readability, feedback, accessibility

## Engine Implementations

- **Unity** — see `engines/unity/GDD.md`
