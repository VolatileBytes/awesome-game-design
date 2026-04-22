---
id: clash-of-clans
title: Clash of Clans
version: 0.1.0
description: Asynchronous base-building mobile strategy game. Players develop a defended village, train troops, and raid other players' bases offline in 3-minute timed attacks.
tags: [mobile, strategy, slg, base-builder, city-builder, coc, pve, pvp-async, free-to-play, persistent]
engines: [unity]
---

# Clash of Clans GDD

## Elevator Pitch

Build a village. Protect it with walls, towers, traps. Train an army. Every attack is an **asynchronous** raid — you pick a target from a matchmade pool, drop troops on their base, get three minutes to smash it, and take loot (gold, elixir, dark elixir). Meanwhile, your own base can be raided by other players while you sleep. Levels of progress are mostly measured by **Town Hall**: upgrade it, and the entire upgrade graph unfolds — stronger defenses, stronger troops, new buildings, new heroes.

It is a persistent village that you visit in small doses. A 3-minute raid, then a set of upgrade timers for the next few hours. Come back tomorrow.

## Design Pillars

1. **Asynchronous PvP with offline defence.** You attack; you defend while offline. This is the core asymmetry. Real-time PvP is the wrong shape for this game — players must be able to play in short sessions on their own schedule.
2. **Town Hall is the progression spine.** Almost every upgrade in the game is gated by Town Hall level. Rushing TH without upgrading defenses is a common trap the design intentionally allows.
3. **Build timers, not energy.** Time is the resource. Upgrades cost gold/elixir + hours/days. No stamina caps on play; the "energy" is upgrade completion.
4. **Every base is a puzzle.** Defensive building layout is the defender's only "active" gameplay during the raid — they set a base and hope it holds.
5. **Clan Wars are the long game.** Clans organise 5v5/10v10/…/50v50 base-vs-base wars. The competitive ceiling is in clan play, not individual raids.

## Core Loop

**Session (2–10 minutes):**
- Open game, collect resources from extractors (gold mines, elixir collectors)
- Check build timers, collect completed upgrades
- Attack: search for a target → pick one → deploy troops → take loot
- Queue a new upgrade or two

**Day:**
- 3–6 attacks (depending on shield cooldowns)
- Several upgrade starts + collects
- Clan donations (give/receive)
- Check clan war battle day

**Week:**
- Clan War: preparation day (scout enemy) + war day (2 attacks each)
- Builder Base side-game battles
- Season pass progress

**Month:**
- CWL (Clan War League) season
- Monthly "Gold Pass" expiration

**Long term:**
- Max Town Hall (currently TH16+). Takes years at f2p pace.
- Max Heroes, pets, equipment, troops.

## Systems

### The Village (Home Village)

- A 44×44 tile plot of land
- Hosts buildings: resource generators, storage, barracks, defenses, walls, heroes, clan castle, town hall, dark barracks, builder huts, pet house
- Player **edits layout** in between raids (defenses, walls, building placement are all freely movable)
- The layout the attacker sees is **a frozen snapshot** of whatever layout the defender saved before they logged out

### Town Hall

- Level 1–16+ (one level ~every few weeks to months at moderate f2p pace)
- Each TH level:
  - Unlocks new buildings
  - Unlocks new defenses
  - Unlocks new army buildings (higher barracks, higher dark barracks)
  - Unlocks new troop types
  - Raises max wall levels
  - Raises max hero levels
- Upgrading TH also **disables the Town Hall defensive role temporarily** (the TH itself can shoot on later levels — a "Giga Tesla" effect)

### Army Composition

- Troops are trained in barracks (regular + dark). Training takes time; a full army is 20–60 minutes of train time at lower THs, reduced by elixir-cost trades at higher THs.
- **Army Camps** cap total housing (e.g. 4 × 70 = 280 housing space at a typical TH)
- Players craft **army compositions** based on base intel — armored tanks, ranged damage, wall breakers, splash AoE, flying units, spell support, hero abilities

### Raid Mechanics

- 3-minute attack timer starts when the first troop is placed
- Troops **auto-path** to nearest target with a targeting priority per unit (e.g. Giants prioritise defenses, Goblins prioritise resources)
- **3 stars maximum** per attack:
  - ⭐ Destroy 50% of buildings
  - ⭐⭐ Destroy the Town Hall
  - ⭐⭐⭐ Destroy 100% of buildings
- Attacker wins **loot** proportional to destruction

### Defender's Gameplay

- The defender is **offline**. The only "gameplay" is:
  - Their base layout (defensive arrangement of buildings, walls, traps)
  - Their set of static defences (cannons, archer towers, mortars, teslas, inferno towers, scattershots, eagles, air defences, wizard towers, air sweepers, bomb towers, monolith, etc.)
  - Their traps (bombs, spring traps, giant bombs, air bombs, seeking air mines, skeleton traps, tornado traps)
  - Their clan castle donation troops (clanmates gift defensive troops)
- Base design is **the defender's content**. Players trade layout ideas in guides and YouTube. Top-tier bases are a form of cultural capital.

### Shields

Shields prevent attacks against your base.
- After being attacked and losing stars, you receive a shield (duration based on how badly you were attacked)
- **16-hour shield** for a 3-star loss
- Smaller shields for lesser losses
- Shields are **consumed** if you attack while shielded (partial consumption)
- Without shields the game would be unplayable for casual players — they'd log in to scorched-earth daily

## References

- [3Cs Spec](references/3c-spec.md) — village view, attack view, controls
- [Progression Design](references/progression-design.md) — TH levels, hero progression, timers
- [Economy](references/economy.md) — gold, elixir, dark elixir, gems, builders
- [Base & Raid Design](references/base-and-raid-design.md) — defensive layouts, attack strategies

## Engine Implementations

- **Unity** — see `engines/unity/GDD.md`

## Balance Philosophy

- **Offence and defence should alternate dominance.** Supercell rebalances periodically: if every attack gets 3 stars, defense gets buffed; if no one can 3-star, offence gets buffed. The tension is the engagement.
- **Every new TH level introduces asymmetry that resolves over 2-3 months.** A new TH drops with OP attacks to let early adopters feel powerful, then gets rebalanced as the defences catch up.
- **No skill-less wins.** High-tier wars reward preparation and coordination. A scripted spam attack can 3-star a poorly-built TH but will fail against a well-designed one.
- **Rushed bases are punished but not bricked.** Players who race up TH without upgrading defences are matched against similarly-rushed opponents; they're not permanently behind.

## Failure Modes for New Implementers

- **Making defence boring.** Defence is offline, so the "fun" of defending is actually designing the layout and watching replays. Bad replay UX kills engagement.
- **Real-time PvP.** It does not fit. Async is the correct shape; forcing real-time breaks session length.
- **Wallet-gated Town Hall.** Many clones have tried this. It kills retention. Gems accelerate; they don't unlock.
- **Too few defences.** If the base has < ~15 defensive structures, attacks feel trivial. Minimum 20+ defensive buildings to give the puzzle depth.
- **Trap randomness too high.** Traps are surprises, not luck. A skilled attacker should be able to scout (via replay) and predict trap locations in repeated attacks.

## Out of Scope / Non-Goals

- Live-PvP (never. See Failure Modes.)
- Player-vs-environment "storyline" campaigns outside of Goblin (single-player) village
- Alliances larger than a single clan (no alliances-of-clans system)
- Real-money in-battle boosts ("pay mid-raid for a hero ability")
