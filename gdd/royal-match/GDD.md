---
id: royal-match
title: Royal Match
version: 0.1.0
description: Match-3 puzzle game with a mansion-restoration meta-progression. King Robert's palace, rich tactile feedback, level-pack progression. Top-grossing mobile puzzle.
tags: [mobile, puzzle, match-3, casual, meta-progression, free-to-play]
engines: [unity]
---

# Royal Match

Dream Games' 2021 breakout. Match-3 puzzle game with a compelling meta layer: players earn stars by completing puzzles, spend stars to restore **King Robert's palace** (mansion-style restoration). Each level is a bite-sized puzzle; the restoration is the **why-play** hook.

## Pillars

1. **Juicy match-3** — cascades feel amazing; combos are satisfying
2. **Restoration meta-loop** — each level earns a star; spend stars on palace tasks
3. **Character you care about** — King Robert is the mascot + story anchor
4. **Puzzle variety** — each level has a specific goal, changing rules, new obstacles

## Genre

Casual match-3 puzzle with meta-progression. Closest cousins: Candy Crush Saga (pure match-3 level progression), Homescapes / Gardenscapes (pioneered the "match-3 + home makeover" combo), Toon Blast (blast-3 variant with meta).

## Core Loop

1. **Start level**: see objective (e.g., "Collect 30 cakes")
2. **Match 3+ same-color** pieces to clear them
3. **Create power-ups** by matching 4, 5, or specific shapes
4. **Use power-ups** strategically + chain reactions
5. **Achieve level goal** within move limit
6. **Earn stars** (usually 1 star per level)
7. **Return to palace**: spend stars on restoration tasks
8. **Unlock new palace rooms** + story moments
9. **Return to level screen**; next level unlocks

## Rules Recap

### Match-3 Basics

- Grid of colored pieces
- **Swap 2 adjacent pieces** to form a match-3+
- Matches clear; pieces above fall; new pieces enter from top
- Chain cascades happen automatically

### Power-Ups

| Power-Up | Created By | Effect |
|---|---|---|
| **Rocket (horizontal/vertical)** | Match-4 in a row | Clears entire row/column |
| **Bomb** | Match in L or T shape | Clears 3×3 area |
| **Lightball (color bomb)** | Match-5 in a row | Clears all of one color |
| **Combo combos**: Rocket+Rocket, Rocket+Bomb, Bomb+Bomb, etc. = super effects |

### Level Types

- **Collect**: clear N specific pieces (e.g., cakes, jars)
- **Clear**: break all cake/jelly tiles
- **Release**: free trapped characters
- **Timed**: achieve goal within N seconds (rare; moves is typical)
- **Obstacle**: clear chains, boxes, ice, vines

### Obstacles

- **Box**: 1 hit → break into pieces
- **Chest**: 1 match near it → open
- **Vine**: grows each turn, must be cleared
- **Chain**: locks pieces; break with adjacent match
- **Ice**: freezes a tile; break with 2 adjacent matches
- **Jelly**: coated tile; break with match on or adjacent

### Move Limit

- Each level has a move budget (20–35 typically)
- Running out = fail
- Extra moves purchasable (soft/hard currency)

## Meta Layer: Palace Restoration

### King Robert's Palace

- A mansion/palace with rooms, gardens, library, dining hall, etc.
- Each area has **restoration tasks** (tap stars to fix / decorate)
- Stories unfold via **King Robert** + his butler + characters
- Unlock new areas as you complete current ones

### Star Tasks

- Each task costs 1–3 stars
- Stars earned from completing levels (1 star per level win)
- Task completion plays a mini-cinematic
- Story progression: complete tasks to see new story beats

### Story Beats

- Light comedy: King Robert's antics, mishaps, character moments
- **Emotional hooks**: attachment to King Robert via his vulnerability + humor
- **Progression gating**: story gated behind X stars → motivation to keep playing

## Core Feel: Juicy Match-3

What makes Royal Match feel premium:

- **Cascades explode** with dust, sparkles, sound
- **Combos chain** with escalating audio stingers
- **Power-ups land** with screen shake + particle burst
- **Big combos** trigger brief camera zoom
- **Match celebrations** — a perfect clear has a "Sweet!" / "Amazing!" overlay
- **Haptic feedback** on mobile (short rumble on combo)

## Level Design

### Pacing Arc

- Tutorial levels (1–20): teach basics
- Ramp (20–100): introduce obstacles, power-ups, combos
- Medium (100–500): variety, some hard levels
- Deep (500+): every level feels designed, rotations of mechanics

### Difficulty Tuning

- Easy levels: 70%+ clear on first try
- Medium: 50% clear on first try
- Hard: 15–30% clear on first try (monetization hook)
- **"Super Hard"** levels: 5–15% — flag for review if 5–20% first-attempt

### Move-Budget Tuning

- Precise move limit based on min + "comfortable margin"
- Too easy = no tension
- Too hard = monetization via move-purchase (controversial)

## Monetization

### Primary Levers
- **Lives system** (5 lives, 25-min regen each): forced break or pay to refill
- **Extra moves** when level nearly clear: 900+ coins → 5 more moves
- **Booster purchases**: power-ups pre-placed before level starts
- **Daily shop** / weekly deals: currency bundles
- **Gems / Coins**: buy more lives, boosters, extra moves

### Cosmetics / Story
- No direct cosmetics for level (not aesthetic choice)
- Royal Pass for more coins + access to bonus chapters
- Limited-time event rooms

## Progression

See [references/progression-design.md](references/progression-design.md).

- **Level number** (1, 2, 3, ..., currently 10,000+)
- **Stars** earned
- **Palace rooms** unlocked
- **Character unlocks** via story
- **Royal Pass** seasonal

## References

- [3Cs spec](references/3c-spec.md)
- [Progression design](references/progression-design.md)
- [Economy](references/economy.md)
- [Level design](references/level-design.md)
- [Juice and game feel](references/juice-and-feel.md)

## Engine overlays

- [Unity implementation](engines/unity/GDD.md)
