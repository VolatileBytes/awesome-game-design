---
id: candy-crush-saga
title: Candy Crush Saga
version: 0.1.0
description: The match-3 saga-map genre originator — swap candies to match 3+, clear levels on a world map, earn 3-star scores, with limited lives, boosters, and thousands of hand-designed levels.
tags: [mobile, pc, puzzle, match-3, casual, saga-map, free-to-play]
engines: [unity]
---

# Candy Crush Saga

Candy Crush Saga (2012, King) is the match-3 game that defined the modern mobile puzzle template: a long **saga-map** of thousands of hand-designed levels, 3-star scoring, lives/stamina, boosters, and limited moves. Unlike later entrants like Royal Match which layer a home-meta, Candy Crush stays focused on the **path of levels itself** as the primary progression. Every mechanic that mobile match-3 players take for granted — level-caps, life regen, social gating, booster shop, "+5 moves" out-of-moves prompt — was either invented or popularized here.

## Pillars

- **The Saga Map is the game**: pure level-by-level progression, no home village
- **Hand-designed levels at massive scale**: 10,000+ unique levels with unique mechanics, shapes, objectives
- **3-star scoring**: play for clear, replay for mastery
- **Tight move budgets**: every move counts; tension drives purchase
- **Sweet visual language**: candy, sugar, warm colors, crunch sounds

## Genre

Mobile match-3 puzzle, free-to-play, saga-map progression, online-optional with social leaderboards.

## Session

- **Core loop**: open app → energy check → pick next unlocked level → play 1–5 minutes → get stars → return
- **Fail state**: out of moves → offer +5 moves for gold bars → retry or use life
- **Life system**: 5 lives, regen 1 per 30 minutes, infinite lives from shop or friends

## Core Gameplay

### The Board

- **Grid size**: 9×9 standard; many levels use irregular shapes with holes and spawners
- **Palette**: 6 candy colors (Red, Orange, Yellow, Green, Blue, Purple)
- **Objective**: varies per level (see Level Types)

### The Swap

- Drag a candy into an adjacent candy
- If the swap creates a match-3+, it resolves; otherwise the swap reverts
- No "free swaps"; every swap either matches or costs nothing (revert)

### Match Rules

- 3-in-a-row/column: clears them
- **Match-4**: creates a **Striped Candy** (row or column clearer)
- **Match-5 in a line**: creates a **Color Bomb** (clears all candies of one color)
- **L or T shape (5 in L/T)**: creates a **Wrapped Candy** (2-stage 3×3 explosion)
- **Stripe + Wrapped**: giant row+column+3×3 mega-combo

### Cascades

- After matches clear, gravity applies; new candies fall from spawners
- New matches trigger cascading combos; audio pitch ascends per cascade
- Bonus score per cascade level

### Special Candies Combo Table

| Combo | Effect |
|---|---|
| Stripe + Stripe | Full row + full column clear |
| Stripe + Wrapped | 3-wide column + 3-wide row |
| Stripe + Color Bomb | All candies of stripe's color turn striped and fire |
| Wrapped + Wrapped | Two back-to-back 5×5 explosions |
| Wrapped + Color Bomb | All candies of wrapped's color turn wrapped and fire |
| Color Bomb + Color Bomb | Clear entire board |

## Level Types / Objectives

| Type | Description |
|---|---|
| **Moves** | Reach score target in N moves |
| **Jelly** | Clear all jelly tiles (1-hit or 2-hit jelly) |
| **Ingredients** | Bring cherries + hazelnuts to bottom row (gravity objective) |
| **Candy Order** | Collect N of specific candies/combos |
| **Time** | Score target in N seconds (rare; older levels) |
| **Mixed** | Two objectives (e.g., clear jelly + collect ingredients) |

## Obstacles

- **Jelly**: 1- or 2-coat; break via match on tile
- **Chocolate**: grows each turn if not prevented; breaks by adjacent match
- **Licorice Lock**: locks candy; break with adjacent match
- **Meringue**: multi-hit solid block
- **Marmalade**: encases a candy; match to free it
- **Conveyor (Licorice Swirl)**: transports candies left-right
- **Cake Bomb**: 3-hit spiral; explodes to clear area
- **Bomb Candy**: counts down; fail level if reaches 0

## 3-Star Scoring

Each level has score thresholds:
- **1 star**: minimum to clear
- **2 stars**: ~1.5x the 1-star threshold
- **3 stars**: ~2.5x the 1-star threshold

Unused moves at clear convert into **Sugar Crush**: each remaining move becomes a Striped Candy + fires → big score boost. Drives replay for 3-star mastery.

## Saga Map Progression

- **Episodes**: 15 levels each, themed (Candy Town, Bubblegum Bridge, etc.)
- **Episode complete**: unlock next episode after level-N clear
- **Visual**: long winding path; player avatar moves level-by-level
- **Friends**: appear on the map at their current level
- **Gates**: after certain episodes, a **ticket gate** (free ticket from friend or wait 3 days or pay)

### Unlock Gating

- **Linear**: each level unlocks after previous is cleared
- **Level-locked**: cannot skip; must 1-star each
- **Gates** drive social invites or monetization

## Lives

- Start with **5 lives**
- Lose 1 per level failure
- Regen **1 life every 30 minutes**
- **Full refill** at shop (gold bars) or from friend gift
- **Infinite lives for 30 min / 2 hr** in-app purchases

Life system is the primary soft-gate for monetization.

## Boosters

### Pre-Level Boosters (before starting)

- **Lollipop Hammer** (+3 uses): tap to clear 1 piece mid-level
- **+5 Extra Moves**: start with 5 more moves
- **Coconut Wheel**: pre-placed special candy at start
- **Jelly Fish**: pre-placed; clears 3 jellies when matched

### In-Level Boosters (during play)

- **Lollipop Hammer**: one-time clear
- **+5 Moves**: when out of moves, offer for gold (900 gold)
- **Free Switch**: swap 2 non-adjacent candies

## Economy

### Currency

- **Gold Bars**: premium, purchased (IAP) or earned sparsely
- **Lives**: time-gated, shop-refillable

### Spending Sinks

- +5 moves on fail
- Extra lives
- Boosters bought individually or in bundles

### Daily Rewards

- 4-day daily spin wheel
- Random rewards: gold, boosters, lives

## Events

- **Tournaments**: weekly leaderboard with friends
- **Candy Royale / Sugar Drop**: per-session sugar points earn chest rewards
- **Episode Race**: play through current episodes for bonus rewards
- **Build-a-Bot** / seasonal themed events

## Social

- **Facebook / King account login**
- **Friends on the map**: see progress, send/request lives, compete on tournament
- **Ask for help** button when stuck
- **Leaderboards** per episode + tournament

## Tone & Style

- Bright, saturated candy visuals
- Whimsical candy-land theme
- Cheerful music; satisfying "pop" and "crunch" SFX
- King's signature voice narrator ("Delicious!", "Sweet!", "Divine!", "Sugar Crush!")
- **Mr. Toffee** narrates early levels; character cameos throughout

## Difficulty Curve

- **Levels 1–20**: tutorial, one mechanic at a time, very forgiving
- **Levels 20–100**: introduce most obstacles; first "difficulty spikes"
- **Levels 100–500**: expect some tough levels requiring strategy
- **Levels 500+**: endgame; some famously hard (e.g., level 65, level 147, level 544)
- **Ongoing release**: ~15 new levels per week since 2012

## Monetization

- **~70% revenue** from "+5 moves" out-of-moves prompt
- **~20%** from extra lives / life bundles
- **~10%** from pre-level boosters + event passes

Soft-gate design: most levels can be beaten free with skill + persistence; hard levels convert.

## Anti-Patterns Avoided

- **No pay-to-win**: purchases are "pay-to-skip", not power increases
- **No randomness tax**: levels are deterministic given seed; skill wins
- **No forced paywall**: any level is theoretically beatable free

## References

- [Core Gameplay (3C)](references/3c-spec.md)
- [Progression & Meta](references/progression-design.md)
- [Economy & Monetization](references/economy.md)
- [Level Design](references/level-design.md)
- [Saga Map Design](references/saga-map-design.md)
- [Juice & Game Feel](references/juice-and-feel.md)

## Engines

- [Unity Implementation](engines/unity/GDD.md)
