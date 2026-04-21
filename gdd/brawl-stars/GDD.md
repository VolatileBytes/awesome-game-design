---
id: brawl-stars
title: Brawl Stars
version: 0.1.0
description: Top-down real-time 3v3 mobile shooter with a roster of distinct heroes ("brawlers"), each with a basic attack, super ability, and per-match progression. Short matches across multiple PvP and PvE modes.
tags: [mobile, pvp, top-down, hero-shooter, real-time, moba-lite, free-to-play]
engines: [unity]
---

# Brawl Stars GDD

## Elevator Pitch

Two-stick shooter reduced to its essentials and rebuilt for touch. A 3-minute match. You pick one brawler from a growing roster, each with a unique basic attack (scatter, heavy single shot, chain, piercing), a "super" charged by dealing damage, a gadget (cooldown-based utility), and a star power / hypercharge (passive modifier). Drop into one of ~10 modes — gem carry, bounty, brawl ball, showdown, knockout — and play until a win condition triggers.

It is Overwatch condensed into a mobile-friendly arcade shooter that takes 3 minutes per match.

## Design Pillars

1. **Short matches.** 2–4 minutes each. Session is a series of matches.
2. **Readable from 6 inches.** The camera sees the whole arena; brawlers are identifiable at a glance.
3. **Brawler > team composition > map > mode.** The hero you picked matters most; how your 3 brawlers combine matters second; the arena and mode are tiebreakers.
4. **Aim is simple.** Tap-to-fire auto-aims at nearest visible enemy; drag-to-aim gives precise direction. No sniping-grade precision.
5. **Progression is horizontal.** Unlocking a new brawler adds a tool, not a better version of an existing one.

## Core Loop

**Seconds:**
- Move with left stick
- Tap or swipe right side to shoot: auto-aim or manual-aim
- When your Super is charged, tap Super button → release or aim it
- Tap Gadget button (cooldown-based)
- Tap Hypercharge button (once Super has been Super-charged via Hypercharge energy)

**Match:**
- 2–4 minutes
- Mode-specific win condition (collect 10 gems and hold for 15s, last 30s, score 2 brawl balls, etc.)
- Last man / team standing if mode is elimination

**Session:**
- 5–15 matches per session (short sessions are typical for mobile)
- Trophy Road progress, daily quests, star drop collection

**Meta:**
- Brawler unlocks and upgrades
- Brawl Pass (monthly)
- Club activities
- Power League (competitive seasonal ladder)

## Systems

### Brawlers

A brawler has:
- **Basic Attack**: 3-ammo (usually) cartridge; reloads over time; attack pattern varies per brawler (shotgun, sniper, burst rifle, piercing arrow, swinging chains, thrown bombs, spray cone, aura pulse)
- **Super**: charged by dealing damage. Usually a massive ability — AoE damage, movement, heal, transform, summon
- **Gadget**: cooldown-based utility (heal, speed boost, knockback, teleport). Unlocked at Power Level 7.
- **Star Powers**: passive modifiers (chosen from 2); unlocked at Power 9 + 10
- **Hypercharge**: at Power Level 11, a brawler can gain a "Hypercharge" version of their Super — Super charges up, and also Hypercharge energy charges up; when both are ready, the brawler can unleash a massively-boosted Super

Brawlers belong to roles:

| Role | Play Pattern |
|---|---|
| **Damage Dealer** | Raw DPS, usually glass-cannon |
| **Tank** | High HP, close range, stays alive longer than average |
| **Support** | Heals, shields, repositioning |
| **Assassin** | High burst, short-range, hit-and-run |
| **Controller** | Zones, lockouts, slows |
| **Marksman** | Long-range, high damage, low HP |
| **Artillery** | Indirect fire, splash, ignores walls |

### Modes

**Core modes (PvP):**
- **Gem Grab (3v3)** — mine gems from a centre pit; first team to hold 10 gems for 15s wins
- **Bounty (3v3)** — elimination; bigger kill rewards on higher-star players
- **Brawl Ball (3v3)** — soccer; score 2 goals
- **Heist (3v3)** — destroy enemy safe; 2 minutes
- **Hot Zone (3v3)** — capture and hold circular zones
- **Knockout (3v3)** — best of 3 elimination rounds
- **Showdown (solo / duo)** — battle royale on a shrinking map, 10 players or 5 duos

**Rotating / Event modes:**
- **Duels (1v1)**, **Siege**, **Basket Brawl**, event-themed modes

**PvE modes:**
- **Boss Fight**, **Big Game**, **Robo Rumble** — 3-player co-op

### Maps

Each mode has a roster of maps; maps rotate every ~24 hours (different ones daily). Maps are small (roughly 27×15 to 45×25 tiles), tiled, featuring:
- **Cover** (walls, bushes, jumpable fences)
- **Bushes** (hide brawlers inside; enemies can't see in unless they walk in)
- **Terrain** (water = slow, lava = damage, rubble = destructible)
- **Mode objectives** (gem pit, soccer goals, safes, hot zones)

Map design is **critical**. See [references/mode-design.md](references/mode-design.md).

### Charging the Super

- Dealing damage with your basic attack charges the Super meter
- Some brawlers charge Super by **existing** (channelling), by **landing specific attacks**, or by **collecting pickups**
- A full Super is often a match-turning play — timing it matters
- Super count is tracked; some brawlers can store 1 charged Super, some chain 2

### Star Drops

Loot-box-adjacent reward. On match completion (win or defeat), a randomised "Star Drop" may drop with tier (common → legendary) and contents (coins, brawler credits, star power, gadget, skin). Rate of drop is tied to trophy gains.

## Progression

Trophy Road, brawler unlocks, brawler power levels, Brawl Pass. See [references/progression-design.md](references/progression-design.md).

## Economy

Gems (premium), Coins (upgrade), Credits (unlock), Power Points (level). See [references/economy.md](references/economy.md).

## References

- [3Cs Spec](references/3c-spec.md) — camera, stick + aim controls
- [Progression Design](references/progression-design.md) — Trophy Road, Brawl Pass, power levels
- [Economy](references/economy.md) — Gems, Coins, Credits, Power Points, Star Drops
- [Brawler Design](references/brawler-design.md) — brawler archetypes, design principles
- [Mode & Map Design](references/mode-design.md) — mode rules, map principles

## Engine Implementations

- **Unity** — see `engines/unity/GDD.md`

## Balance Philosophy

- **Brawler pool grows by ~6–10 per year**. Each new brawler must fit a role gap or introduce a new mechanic.
- **Star powers and gadgets are re-balanced more than base brawler stats**. Base stats are sacred; situational kit is where tuning happens.
- **Power level ≠ paywall**. A new brawler at Power 1 should still be viable in low-trophy matches; a Power 11 brawler in high-trophy matches should feel full-featured but not game-breaking.
- **Mode metas diverge**. A dominant brawler in Gem Grab may be weak in Knockout. This is desirable — it spreads the brawler pool across modes.

## Failure Modes for New Implementers

- **Fully manual aim.** Brawl Stars deliberately allows tap-to-auto-aim. Removing auto-aim excludes casual players.
- **Brawler roles too narrow.** Each brawler must feel distinct in play, not just in stats.
- **Map symmetry without spawn variance.** Every symmetric map should still have asymmetric micro-patterns (cover placement) to create match variance.
- **No PvE**: PvE modes are secondary but crucial for solo players and onboarding. Cut them and the game feels hollow.
- **Bad matchmaking**: this is the most critical failure mode. Bad matchmaking (skill-level mismatch, brawler-level mismatch) destroys retention in weeks.

## Out of Scope / Non-Goals

- Single-player campaign (PvE is co-op, not story-driven)
- Open-world / hub areas (the game is lobby → match → lobby)
- Trading brawlers/skins between players
- Cross-team voice chat (matchmaking is rapid; voice isn't practical)
