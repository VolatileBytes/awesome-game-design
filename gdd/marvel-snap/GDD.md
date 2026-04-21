---
id: marvel-snap
title: Marvel Snap
version: 0.1.0
description: 3-lane, 6-turn simultaneous card battler where random locations reshape the board every match. Short games, deep decisions, stake-escalation via Snap.
tags: [mobile, card-game, ccg, pvp, real-time-simultaneous, tactical, free-to-play]
engines: [unity]
---

# Marvel Snap

A card game tuned for mobile attention spans: every match lasts ~3 minutes, has exactly 6 turns, and plays across 3 locations whose effects are revealed progressively. Both players submit moves simultaneously; the board then resolves. The game won Game of the Year 2022 on the strength of this compression.

## Pillars

1. **3-minute matches** — never more than ~3 minutes; mobile-first pacing
2. **Simultaneous reveal** — both players play cards at the same time; the resolve sequence creates drama
3. **Locations matter** — the board is never the same twice; adapt to the rules as they reveal
4. **The Snap** — players can raise the stakes mid-match; gutsy calls define the competitive feel

## Genre

3-lane card battler with partial information. Closest cousins: Hearthstone (but streamlined), Legends of Runeterra (but asymmetric turns gone). What's unique: **locations** are a fourth player — they buff, restrict, destroy, transform cards based on where they sit.

## Core Loop

1. Queue into a match (quick — <10s)
2. **Turn 1**: 1 mana, one location revealed
3. **Turn 2**: 2 mana, second location revealed
4. **Turn 3**: 3 mana, third location revealed
5. **Turns 4–6**: full board visible; scaling mana
6. **Snap** anytime: doubles the cube stake
7. **End**: total power per location decides winner; winner of 2/3 locations wins the match
8. **Collect** cubes → climb the ladder → unlock cards

## Rules Recap

### Deck
- Exactly **12 cards** per deck
- **No duplicates** (one copy of each card)
- Card pool tiered by "Pool" (Pool 1, 2, 3, 4, 5, 6 — unlock progression)

### Mana
- Turn N = N mana (Turn 1 = 1 mana, Turn 6 = 6 mana)
- Unspent mana is lost
- Some cards grant extra mana temporarily

### Locations
- 3 locations per match (randomly selected from a large pool)
- Each has a unique effect: "Only 2-cost cards here", "Cards here have +2 power", "Destroy cards played here", etc.
- Revealed one per turn on turns 1, 2, 3

### Lane Cap
- 4 cards max per location
- Decision-forcing: you can't just dump everything in one lane

### Scoring
- Sum of power of your cards in a location = your power there
- Higher power wins the location
- Player who wins 2/3 locations wins the match

### The Snap
- At the start of any turn, a player may "Snap" to double the cube stake
- Opponent can counter-snap to quadruple
- Players may **retreat** at any turn to cut losses (lose half the stake instead of full)

### Ranked & Cube
- Winning a match at 1 cube = +1 cube to your ladder rank
- Winning at 2, 4, 8 cubes = +2, +4, +8
- Climbing the ladder via cubes = season rank

## Card Design

Every card has:
- **Cost** (1–6)
- **Power** (0–12+)
- **Ability** (optional; many cards are "vanilla" = higher power, no text)

**Power vs Cost** follows a curve: a 3-cost vanilla is ~5 power. Cards with abilities are discounted — trade raw power for utility.

### Ability Keywords
- **On Reveal**: triggers when the card flips at end of turn
- **Ongoing**: persistent aura while in play
- **End of Turn**: triggers every end of turn
- **Discard**: payoffs for cards discarded from hand
- **Destroy**: payoffs for cards destroyed
- **Move**: cards that move between locations

## Deckbuilding Archetypes

| Archetype | Strategy | Signature Cards |
|---|---|---|
| **Zoo** | Flood the board with small cheap units | Kazoo (buff small units) |
| **Destroy** | Kill your own cards for payoffs | Carnage, Deadpool |
| **Discard** | Trigger off cards leaving your hand | Apocalypse, Hela |
| **Move** | Move cards between lanes for triggers | Heimdall, Vulture |
| **Ongoing** | Persistent buffs stack | Devil Dinosaur, Onslaught |
| **On Reveal** | Chain of triggers | Wong (double triggers), Odin |
| **Big** | Play expensive bombs cheaply via ramp | Thanos, Galactus |

## Match Flow (Design Goal)

- **Turns 1–2**: establish presence, react to the first locations
- **Turn 3**: key decision — snap or commit
- **Turns 4–5**: power swing turns (biggest plays)
- **Turn 6**: combo finishers; the "Odin turn"

The design teaches you to **save your big play for turn 6** — this creates drama because the opponent is doing the same, and both are simultaneously guessing.

## Progression

See [references/progression-design.md](references/progression-design.md).

- **Collection Level** (CL): unlocks card pools (Pool 1 → 2 → 3, eventually 4/5)
- **Season Pass**: monthly paid track with new featured card
- **Avatars, titles, card variants**: cosmetic progression
- Cards are unlocked via random pulls (Collector's Reserves) gated by CL

## Monetization

- **Season Pass**: ~$10/month, exclusive card + premium currency + variants
- **Card Variants**: alt art, no power difference — pure cosmetic
- **Gold**: buy variants, credits, bundles
- **Credits**: level up cards → unlock more cards (progression currency)

F2P-friendly on **cards** (you unlock new ones), P2W-resistant on **power** (no stronger cards behind paywall, just different).

## Locations (The Secret Sauce)

Locations are **the design innovation**:
- ~100+ unique locations in rotation
- A new player + old player both see the locations for the first time → skill floor is lowered
- Every match feels different
- Creates **"problem solving" gameplay** — players solve the board, not just play their deck

Location effects categories:
- **Restricting**: "only 1-cost cards here", "cards cost +1 mana here"
- **Rewarding**: "cards here have +2 power", "draw a card when you play here"
- **Destructive**: "destroy cards played here", "discard a card when you play here"
- **Transformative**: "cards here become Dinosaurs", "swap your hand with your deck"
- **Tactical**: "after turn 4, lock this location", "copy the other locations"

See [references/location-design.md](references/location-design.md).

## References

- [3Cs spec](references/3c-spec.md)
- [Progression design](references/progression-design.md)
- [Economy](references/economy.md)
- [Card design](references/card-design.md)
- [Location design](references/location-design.md)

## Engine overlays

- [Unity implementation](engines/unity/GDD.md)
