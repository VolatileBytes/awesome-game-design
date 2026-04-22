---
id: arknights
title: Arknights
version: 0.1.0
description: Real-time tower defense + RPG hybrid where players deploy anime "Operators" onto tiled maps to intercept enemies. Gacha-driven roster; PvE focused; intricate puzzle-style stages.
tags: [mobile, tower-defense, rpg, gacha, pve, anime, free-to-play]
engines: [unity]
---

# Arknights

Hypergryph + Yostar's 2019 mobile hit. A **real-time tower defense** where towers are anime "Operator" characters placed on a tiled map. Defeat enemies before they reach your base. Combined with gacha roster collection + meta-progression + deep story.

## Pillars

1. **Puzzle-style TD** — every stage is a designed puzzle, not random waves
2. **Deep roster** — hundreds of Operators, each with unique mechanics
3. **Story-first presentation** — heavy narrative, voice acting, art
4. **Long-term progression** — events, recruitment, base-building, raid modes

## Genre

Real-time Tower Defense + Gacha RPG. Closest cousins: Royal Revolt, Bloons TD Battles (mechanic-wise), Fire Emblem Heroes (roster-wise), Fate/Grand Order (narrative + gacha). The twist: operators are **placed and removed** during a stage; deployment order + positioning matters deeply.

## Core Loop

1. **Select** a stage from the world map (Story or Event)
2. **Form a squad** of up to 12 Operators + 1 Leader (squad bonuses)
3. **Stage starts**: enemies spawn at spawn points, walk along predefined paths
4. **Deploy** Operators by paying "DP" (Deployment Points) — accumulates over time
5. **Use Skills** tactically as enemies approach
6. **Clear the stage** by killing all enemies before any reach the protect point
7. **Earn rewards**: sanity (energy) refund if perfect, drops, XP, currency
8. **Upgrade** Operators via materials farmed from stages

## Rules Recap

### Squad
- Up to 12 Operators per stage
- 1 Leader: selected Operator grants squad-wide bonus
- Deployment limit: most stages cap at 6–10 active deployed Operators
- Redeployment cooldown after retreating

### Stage
- Grid-based tile map with enemy paths
- 2–4 spawn points; 1–2 exit points
- Enemies walk along fixed paths
- Some tiles are **high ground** (ranged Operators); some are **ground** (melee)

### DP (Deployment Points)
- Resource to deploy Operators
- Accumulates at 1/second base; increased by certain Operators/leaders
- Starting DP varies by stage (usually 10–15)

### Operators
- **Class**: Vanguard, Guard, Defender, Sniper, Caster, Medic, Supporter, Specialist
- **Cost**: DP to deploy (10–30 typical)
- **Stats**: HP, ATK, DEF, RES, attack speed, range
- **Skills**: 1–3 unlocked active abilities (auto or manual)
- **Talents**: passive buffs
- **Facing**: when deployed, choose which direction operator faces

### Enemies
- Varied types: ground soldiers, drones, casters, elites, bosses
- Each has HP, ATK, DEF, speed, special abilities
- Some ignore tiles (drones), some have shields, some heal

### Win Condition
- Prevent N enemies (usually 0) from reaching the protect point
- Achieve ≤ 3 leaks on some stages for partial win; 0 leaks for full stars

## Operator Classes (8 total)

| Class | Role | Signature |
|---|---|---|
| **Vanguard** | Generate DP | Deploy early to feed DP economy |
| **Guard** | Melee DPS | Damage dealers in close combat |
| **Defender** | Tanks | High HP/DEF; block enemies |
| **Sniper** | Ranged DPS | Long-range single-target |
| **Caster** | Ranged arts damage | AoE magic / anti-armor |
| **Medic** | Healers | Heal deployed operators |
| **Supporter** | Buffs + debuffs | Slow, buff ally, AoE buff |
| **Specialist** | Special mechanics | Pushers, summoners, invisible units, etc. |

Each class has sub-archetypes (e.g., Defender has Shield Defenders, Protectors, Healing Defenders).

## Star Rarity

- **1★ to 6★** (6★ = highest)
- 5★ and 6★ are **gacha-pulled**
- 3★ and 4★ are common, still viable
- Each Operator has potential tiers (power-up from duplicate pulls)

## Skills

- Each Operator has 1–3 skills (higher star = more skill slots)
- **Trigger**: Auto-activate when SP is full, or **Manual** activation
- **SP generation**: per-second, per-attack, or per-hit
- **Skills change gameplay** — a Sniper's Skill 1 might be a big AoE shot; their Skill 2 might be invisible detection
- Skill choice affects build — players level the skill they use

## Progression

### Operator Progression Axes

1. **Level** (1–60): basic XP scaling; requires Exp Cards + LMD
2. **Elite Promotion** (E0 → E1 → E2): unlock higher level cap + new skills/talents
3. **Skill Level** (1–7 → Mastery 1/2/3 at E2): upgrade a specific skill
4. **Module** (high-level): unlock special gear granting stat boost + talent upgrade
5. **Potential** (from duplicates): +1 to +6, small boosts

### Player Account Progression

- **Player Level** grants stamina refresh (Sanity cap)
- **Story Progression** unlocks chapters
- **Base Level** (infrastructure) improves passive resource generation

## Stage Types

- **Main Story**: linear chapter progression, ~10 per chapter, repeatable for farming
- **Sub-stage**: optional challenges
- **Daily Resource Stages**: rotating daily — specific mats
- **Annihilation**: long waves of enemies for weekly rewards
- **Event Stages**: limited-time, themed, introduce new story
- **Integrated Strategies**: roguelite mode with procedurally assembled runs
- **Challenge Mode**: harder variants for mastery

## Gacha (Headhunting)

- Pay "Orundum" (earnable) or Originite Prime (paid) for pulls
- **10-pull guarantees** at least one 5★+
- **Rate-up banners**: higher rate on featured Operators
- **Pity**: gradually increase 6★ rate after 50 pulls; guaranteed after ~99 pulls
- New Operators release regularly via banners

## Base (Infrastructure)

- Player's "base" is a multi-room facility
- Rooms: Factory (generate resources), Trading Post (exchange LMD), Power Plant, Dorm (Operator rest), Office (clues), Workshop (craft)
- Assign Operators to rooms for buffs
- Passive income while offline

## References

- [3Cs spec](references/3c-spec.md)
- [Progression design](references/progression-design.md)
- [Economy](references/economy.md)
- [Operator design](references/operator-design.md)
- [Stage design](references/stage-design.md)

## Engine overlays

- [Unity implementation](engines/unity/GDD.md)
