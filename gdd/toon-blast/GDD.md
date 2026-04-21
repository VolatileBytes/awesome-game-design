---
id: toon-blast
title: Toon Blast
version: 0.1.0
description: Single-tap blast-3 puzzle — tap groups of 2+ same-color cubes to blast them; clear objectives across 5,000+ cartoon-themed levels with a team-based social meta and pre-/in-level boosters.
tags: [mobile, puzzle, blast-3, casual, cartoon, team-based, free-to-play]
engines: [unity]
---

# Toon Blast

Toon Blast (2017, Peak Games) popularized the **blast-3** puzzle mechanic on mobile: instead of **swapping** to match 3 pieces (Candy Crush / Royal Match), the player **taps any group of 2+ same-color cubes** to blast them instantly. Simpler input, faster sessions, and equally deep level design. Peak Games' template (later applied to Toy Blast and the Homescapes/Gardenscapes line) brought blast-puzzle to the top-grossing charts.

## Pillars

- **Tap, don't swap**: single-tap mechanic lowers input friction
- **Cube groups**: match 2+ (not ≥3) for very permissive start; larger groups = power-ups
- **Cartoon heart**: Bruno the Bear + Cooper the Cat + Wally the Wolf hook emotional investment
- **Team meta**: join a team, compete in team leagues for global social retention
- **Thousands of levels**: 5,000+ hand-designed, released weekly

## Genre

Mobile puzzle, free-to-play, blast-3 (not match-3), saga-map progression with team-league meta.

## Session

- **Core loop**: open → pick next unlocked level → tap cubes → 1–4 minutes → stars → close
- **Fail state**: out of moves → "+5 moves for 900 coins?" offer
- **Life system**: 5 lives, regen 1 per 30 minutes (or ask teammates)

## Core Gameplay

### The Board

- **Grid size**: 6×8 to 9×10
- **Pieces**: colored cubes (Red, Yellow, Blue, Green, sometimes Purple)
- **Obstacles**: boxes, ice, chains, rubber ducks, portals

### The Tap (Blast)

- **Tap any group of 2+ adjacent same-color cubes**
- Instantly all blasted, pieces above fall down
- Minimum group size is **2** (not 3 like match-3) — extremely permissive

### Power-Up Creation

Unlike match-3 (which uses linear match-N), blast-3 uses **group size**:

| Group Size | Power-Up Created |
|---|---|
| 2–4 | None (just clears) |
| 5–6 | **Rocket** (horizontal or vertical, random) |
| 7–8 | **Bomb** (3×3 AoE) |
| 9+ | **Disco Ball** (clears all of one color) |

Power-ups spawn at the **tap position** (where the blast was triggered).

### Power-Ups (In-Level)

- **Rocket H** (horizontal): clears full row
- **Rocket V** (vertical): clears full column
- **Bomb**: 3×3 area clear
- **Disco Ball**: clears all cubes of one color (the color tapped to use)

### Power-Up Combos (Tap two adjacent)

| Combo | Effect |
|---|---|
| Rocket + Rocket | Big cross (row + column) |
| Rocket + Bomb | Wide 3-row-high + 3-col-wide cross |
| Bomb + Bomb | 5×5 explosion |
| Disco Ball + Rocket | All cubes of color → Rockets, fire all |
| Disco Ball + Bomb | All cubes of color → Bombs, fire all |
| Disco Ball + Disco Ball | Clear entire board |

### Cascades

- After blasts, pieces fall (gravity)
- New groups may form; tapping them continues the move
- **Each tap = 1 move**; cascades don't cost moves

### Special: Starting Boosters (pre-level)

- **+5 Extra Moves**
- **Rocket** placed before game starts
- **Bomb** placed before game starts
- **Disco Ball** placed before game starts

## Level Types / Objectives

| Type | Description |
|---|---|
| **Blast Cubes** | Clear N cubes of specific color (e.g., 30 red) |
| **Rescue Toon** | Characters trapped in blocks; blast to free |
| **Clear Crates** | Break crate obstacles |
| **Collect Ducks** | Collect falling items (ducks, cherries) |
| **Break Chains** | Break chain links |
| **Mixed** | Two or more objectives combined |

## Obstacle Library

### Tier 1 (Early)

- **Wood Crate**: 1–3 hits from adjacent blast
- **Ice Cube**: coats a cube; 2 hits to clear
- **Chain Link**: locks cube in place; break with adjacent blast
- **Rubber Duck**: drops with gravity; collect by reaching bottom

### Tier 2 (Mid)

- **Portal**: teleports cube from A to B
- **Swirl (Tornado)**: rotates nearby cubes
- **Bubble**: sealed box; only power-ups can break

### Tier 3 (Late)

- **Bubble Gum**: sticky; slows gravity
- **Bat Trap**: spawns extra obstacles if not cleared
- **Mystery Box**: spawns random power-up

## Scoring

- Each level has **star thresholds** (1/2/3 stars)
- **Unused moves converted to Rockets + auto-fire** (same as Candy Crush's Sugar Crush)
- Star count used for events + team-league ranking

## Saga Map

- **Vertical scrolling** path of levels
- Grouped into **"neighborhoods"** (not Episodes): bright, cartoonish urban scenes
- **Character cameos**: Bruno, Cooper, Wally appear at milestones
- **Milestones** every 50 levels trigger team-league invites

## Team / Social Meta

Toon Blast's defining meta layer: **Teams**.

### Join a Team

- Free teams (anyone can join; up to 50 members)
- **Team chat**: real-time message stream
- **Life requests**: ask team for lives (instant regen)
- **Star contribution**: stars earned contribute to team score

### Team League

- **Weekly competition**: teams ranked by total stars earned that week
- **Promotion/relegation**: win your league → promoted; bottom = relegated
- **Rewards**: league finish → team-wide rewards (coins, lives, boosters)
- Adds **social retention pressure** beyond individual progression

### Team Event

- Special **team-only levels** unlocked via team participation
- **Co-op goals**: team collectively clears N objectives
- Rewards for team + individual contributions

## Lives

- **5 lives max**
- **Regen**: 1 life per 30 minutes
- **Team gifts**: teammates can send free lives
- **Infinite lives**: shop (coins) or $1.99/$4.99 IAP

## Boosters

### Pre-Level

- +5 extra moves
- Starting Rocket
- Starting Bomb
- Starting Disco Ball

### In-Level Tools

- **Paint Bucket** (tap to change 1 cube's color)
- **Magnet** (tap to remove 1 cube)
- **Hat** (tap to add helper)

## Economy

### Coins

- Earned per level clear (small amount)
- Earned in events / team rewards
- Spent on: +5 moves, lives, pre-level boosters

### IAP

- **Coin bundles**: $0.99 – $99.99
- **Piggy Bank**: fills with earned coins; pay to unlock
- **Booster packs**: $2.99 – $9.99
- **Infinite Lives**: $1.99 / 1hr, $4.99 / 24hr

### Spending Distribution (typical)

- **~50%** from +5 moves on out-of-moves
- **~25%** from piggy bank unlocks
- **~15%** from booster packs
- **~10%** from infinite lives

## Events

- **Team League**: weekly (baseline engagement driver)
- **Daily Team Task**: 24h team goal
- **Character Event**: Bruno / Cooper / Wally themed chapter
- **Holiday Events**: seasonal (Christmas, Halloween)

## Tone & Style

- **Cartoon heart**: anthropomorphic animal characters with emotional expressions
- **Warm, saturated palette**: orange/pink/blue dominant
- **Upbeat comedic music**
- **Slapstick humor**: characters bonked on head, silly voices
- **Voice acting**: Bruno's grunts, Cooper's meows — brand-critical

## Comparison to Match-3

| Feature | Match-3 (Candy Crush) | Blast-3 (Toon Blast) |
|---|---|---|
| Input | Swipe/swap | Tap |
| Min match | 3 in a row | 2 adjacent in a group |
| Power-up | From match-4/5 linear | From large group size |
| Cognitive load | Higher (plan swap) | Lower (see group, tap) |
| Pace | Slower | Faster |
| Session length | 5–8 min | 3–5 min |

Blast-3 is **simpler to learn, faster to play**, hence appeals to casual audience.

## Monetization

- Primary: **+5 moves** (~45-55% revenue)
- Secondary: **Piggy Bank** (~25%)
- Tertiary: **Booster packs + infinite lives** (~20%)

## References

- [Core Gameplay (3C)](references/3c-spec.md)
- [Progression & Meta](references/progression-design.md)
- [Economy & Monetization](references/economy.md)
- [Blast Mechanic Design](references/blast-mechanic-design.md)
- [Level Design](references/level-design.md)
- [Team League Design](references/team-league-design.md)

## Engines

- [Unity Implementation](engines/unity/GDD.md)
