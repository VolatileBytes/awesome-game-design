---
id: pokemon-unite
title: Pokémon Unite
version: 0.1.0
description: 5v5 mobile MOBA where players as Pokémon farm wild mons, level up, fight in lanes, and dunk scored energy into enemy goals. Short matches, simplified MOBA.
tags: [mobile, moba, pvp, 5v5, real-time, team-based, free-to-play]
engines: [unity]
---

# Pokémon Unite

TiMi Studios + The Pokémon Company's 2021 mobile-first MOBA. Takes the League of Legends skeleton, strips laning complexity, speeds matches to 10 minutes, and makes "score" the primary objective rather than destroying the nexus. Played as Pokémon with signature attacks/moves, building levels and items.

## Pillars

1. **10-minute matches** — mobile-friendly; never 40-minute grinds
2. **Score, don't destroy** — carry energy, dunk it in enemy goals, score highest team wins
3. **Pokémon IP carries** — everyone recognizes Charizard, Lucario, Pikachu; brand is the onboarding
4. **Simplified MOBA** — no items to buy during match, no last-hit meta, no wards; single move ugprade per level

## Genre

5v5 mobile MOBA (Multiplayer Online Battle Arena). Closest cousins: Wild Rift, Arena of Valor, Vainglory. The simplification is deliberate — a MOBA digestible on mobile in 10 minutes.

## Core Loop

1. **Pre-match**: pick a Pokémon + Held Items + Battle Item
2. **Match starts**: drop into the arena from a Unite Chopper
3. **Farming phase (0:00–2:00)**: attack wild Pokémon to gain Energy + XP
4. **Early combat (2:00–4:00)**: contest objectives, first clashes
5. **Mid game (4:00–6:00)**: team fights, Drednaw / Rotom objectives
6. **Late game (6:00–8:00)**: farm up to Unite Move (ultimate); contest central area
7. **Final 2 minutes (8:00–10:00)**: Zapdos spawns in center — killing it makes all teammates' shots one-shot dunk. Match often decided here.
8. **Score tally at 10:00** → higher team wins

## Map

### Arena: Remoat Stadium

- **Symmetric** 2-lane map (top + bottom)
- **Jungle** between the lanes
- **Enemy goals** in each lane (5 per side: 2 starter, 2 mid, 1 endgame)
- **Boss monsters** (Drednaw, Rotom, Zapdos) spawn at specific times in the center

### Other Maps

- **Shivre City**: smaller, single-lane, different objectives
- **Mer Stadium**: 4v4 variant
- **Theia Sky Ruins**: reworked main arena

Each map has different spawn timings and objective designs.

## Pokémon (Playable Characters)

~60+ Pokémon, each with a distinct role.

### Role Categories

| Role | Play Pattern | Examples |
|---|---|---|
| **All-Rounder** | Versatile; both damage and durability | Charizard, Lucario, Garchomp |
| **Attacker** | Ranged, high damage, fragile | Cinderace, Gardevoir, Greninja |
| **Defender** | Tank; soak damage, peel for carries | Snorlax, Blastoise, Mamoswine |
| **Speedster** | Mobile; gank and burst | Zeraora, Talonflame, Gengar |
| **Supporter** | Heals and buffs | Wigglytuff, Eldegoss, Blissey |

### Pokémon Progression (Within a Match)

Each Pokémon:
- Starts at **Level 1**
- Gains XP from killing wild Pokémon + scoring + fighting
- Evolves at specific levels (Charmander → Charmeleon → Charizard)
- Unlocks **2 moves** at level 5 + 7; choose between 2 variants per slot
- At level 9 (or similar): **Unite Move** unlocked — a long-cooldown ultimate

## Scoring

### Energy
- Killing wild Pokémon / enemy players grants **Energy** (Aeos Energy)
- Energy is carried until you **dunk** at an enemy goal
- Dying **drops your energy** at the death location (pickup-able for a short time)

### Dunking
- Stand in enemy goal → channel for ~2 seconds → deposit all carried energy
- Each goal has HP; depositing energy chips it down
- Goal at 0 HP → "broken"; team can continue to next goal (gets closer to nexus)

### Match End
- Scored points tally (combination of goal breaks + energy)
- **Last 2 minutes**: all scores doubled
- Higher score wins

## Items

### Held Items (3 slots)
- Equipped before match
- Passive stat boosts + minor effects
- Earn via progression: **Muscle Band** (+attack), **Buddy Barrier** (shield on Unite), etc.
- Each item has 3 upgrade levels

### Battle Items (1 slot)
- Active cooldown-based items
- Examples: **Potion** (heal), **Full Heal** (cleanse), **Goal Getter** (faster dunk)
- Choose one before match

## Controls

- **Virtual stick** left: move
- **Tap** right side: basic attack (auto-target nearest)
- **Buttons** right: Move 1, Move 2, Unite Move, Battle Item
- **Smart buttons**: tap for auto-target, hold for directional aim

## Match Length & Pacing

- **Standard**: 10 minutes
- **Quick**: 5 minutes on Shivre variant
- **Ranked**: standard

Compared to League of Legends (30–50 min), Unite is **3–5x faster**.

## Ranked

- Tiers: Beginner → Great → Expert → Veteran → Ultra → Master → Master Ball (highest)
- Seasonal resets
- Ranked performance points earned per match
- Performance-based (not just W/L): more points for high damage, healing, scoring

## Monetization

- **Unite License**: unlock a Pokémon (earned via play or paid)
- **Battle Pass**: seasonal; cosmetics + license shards
- **Holowear (cosmetics)**: Pokémon skins — sold directly
- **Item Enhancers**: upgrade Held Items — F2P earnable, paid for speed

## Progression

See [references/progression-design.md](references/progression-design.md).

## References

- [3Cs spec](references/3c-spec.md)
- [Progression design](references/progression-design.md)
- [Economy](references/economy.md)
- [Pokémon role design](references/pokemon-role-design.md)
- [Map & objective design](references/map-objective-design.md)

## Engine overlays

- [Unity implementation](engines/unity/GDD.md)
