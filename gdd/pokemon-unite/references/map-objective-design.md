# Map & Objective Design

Unite's map is deceptively simple: 2 lanes, 1 jungle, goals at each end. The design work is in the **objective timing** — what spawns when, and how that creates the match's rhythm.

## The Main Map: Remoat Stadium

### Layout

```
[Top Team Goal: Blue final] [Blue mid 1] [Blue mid 2] [Blue starter]
[Top lane (wild Pokémon along the way)]
[Jungle (wild + Rotom spawn + Drednaw spawn)]
[Bottom lane (wild Pokémon)]
[Red starter] [Red mid 1] [Red mid 2] [Red Team Goal: Red final]
```

- **5 goals per team** (the 5th is the final "nexus")
- **2 lanes** (top + bottom)
- **Jungle** between them — wild Pokémon for XP + objective monsters

### Symmetry

- **Mirror-image**: Blue top corner ↔ Red top corner
- Jungle objectives spawn neutrally in the middle
- Map advantage should come from **objective control**, not map asymmetry

## Wild Pokémon (Farm)

### Lane Pokémon

- **Aipoms, Lillipups**: small XP + small energy
- **Swablu, Corphish**: medium
- Spawn at intervals along each lane

### Jungle Pokémon

- **Audino**: gives buff (regen/attack/speed) based on which one
- **Rotom** (mid-game): buff when killed, bonuses for team
- **Bouffalant**: high XP
- **Ludicolo**: medium XP

## Boss Objectives

### Drednaw (approx 7:00 remaining, i.e., 3:00 into match)

- Appears in bottom jungle
- **Killing team gets**: shield + speed buff for all teammates
- **Bottom lane wild Pokémon** now give bonus energy for 30s
- First major team fight decision of the match

### Rotom (approx 5:00 remaining)

- Appears in top jungle
- **Killing team gets**: Rotom becomes a minion that moves toward an enemy goal and stuns it on arrival
- Enables **push plays** — the goal is disabled briefly while Rotom attacks

### Zapdos (final 2:00)

- Appears in central arena
- **Killing team**: next dunks are **instant** (no channel time) AND **score doubled**
- Usually decides the match
- Teams skirmish around it for 60–90s

## Match Rhythm

**Phase 1 (0:00–2:00, farming)**:
- Both teams farm lane + jungle
- Score some early energy into nearest goals
- Level up to unlock first move

**Phase 2 (2:00–4:00, first clash)**:
- Drednaw spawns; teams contest or rotate
- First bigger team fight
- Lanes solidify who's getting farm

**Phase 3 (4:00–6:00, mid game)**:
- Rotom spawn; second team fight objective
- Push a lane + break a goal
- Most Unite Moves unlocked mid-phase

**Phase 4 (6:00–8:00, late game)**:
- Constant skirmishes
- Positioning for Zapdos setup
- Goal-break opportunities

**Phase 5 (8:00–10:00, Zapdos finale)**:
- Zapdos spawns
- Massive team fight
- Winner dunks for game

## Scoring Economics

- **Goal HP** (approx): 80, 100, 100, 120, 160 (from starter to final)
- **Energy per dunk**: up to 50 per player
- **2x multiplier** in last 2 minutes
- **Zapdos buff**: dunks are instant + double score

**Balance goal**: a team behind by 100 points at minute 8 can still come back by winning Zapdos. This design choice (comeback possibility) is controversial — rewards late-game more than early-game lead. Seen as an intentional pacing device.

## Jungle Design

**Optimal jungle route**:
- Lillipups → Audino (buff) → Corphish → Rotom (if mid-game) → Ludicolo → back to buff camp

Jungler role relies on efficient farming + objective contests. Typically a Speedster (Zeraora) or All-Rounder (Lucario).

## Goal Design

### Goal Mechanics

- Stand inside enemy goal zone → channel for ~2 seconds → dunk energy
- Channel interrupts on damage taken (if hit enough)
- Held Item **Goal Getter** reduces channel time
- Near-goal damage taken reduces channel time
- **Goal destroys** after enough energy deposited

### Goal Placement

- **Starter goals**: close to spawn; easy to defend; push target for early aggression
- **Mid goals**: halfway; usually contested in mid game
- **Final goals**: near enemy spawn; lategame push target

## Alt Maps

### Shivre City

- 1-lane
- Smaller, faster matches (5 min)
- Great for onboarding

### Mer Stadium

- 4v4 variant
- Water terrain
- Different objectives

### Theia Sky Ruins

- Re-worked Remoat with vertical elements (floating platforms)
- Introduces verticality mechanic

## Vision & Fog

- **No fog of war** in Unite (simplification vs LoL)
- **Wild Pokémon** respawn timers are visible to all
- **Allies** always visible on minimap
- **Enemies** visible only when within sight of an ally or nearby wild Pokémon

This is a deliberate mobile-friendly simplification — tracking fog on a small screen is hard.

## Anti-Patterns

- **Overly dominant Zapdos**: if comeback is too easy, early-game feels pointless
- **Imbalanced jungle**: if one side has better buffs, the map is broken
- **Over-objective map**: Drednaw + Rotom + Zapdos + Registeel + Articuno... too many objectives → no breathing room
- **Goals too hard to break**: matches become stalemate

## Map Update Cadence

- Seasonal map tweaks: Drednaw replaced by Regirock, or new objective added
- Major map overhauls: 1–2 per year

## Metrics

- **Average match length**: should hover around 9:00–10:30
- **Comeback rate** from losing at 5:00: ~25% (desirable; if too high = early pointless)
- **Zapdos win rate** (the team that takes Zapdos): ~70–75% (too high = snowball; too low = pointless objective)
