---
id: balatro
title: Balatro
version: 0.1.0
description: Poker-themed deckbuilder roguelike. Build poker hands against escalating "blind" scores, stack Jokers and consumables to multiply chips × mult into absurd numbers, clear 8 antes per run.
tags: [pc, mobile, deckbuilder, roguelike, card-game, indie, single-player, poker, strategy]
engines: [unity]
---

# Balatro

Balatro (2024, LocalThunk) is a one-person indie hit that reframed poker as a numbers-go-up roguelite. Each run: play 8 antes of three blinds each (Small / Big / Boss), score enough chips to pass each blind, buy Jokers and consumables between rounds, watch exponential Joker synergies break math.

## Pillars

1. **Numbers go up** — the core satisfaction loop is watching chips × mult escalate from 20 to 2 billion over a run.
2. **Poker ≠ RNG** — players use familiar hand rankings (pair, straight, flush, full house) as scoring multipliers; selection of which 5 to play is deterministic skill.
3. **Joker synergies** — 150+ Jokers with wildly different effects; drafting + order matters (Jokers resolve left-to-right).
4. **Short runs** — 30–90 minutes; deaths cheap; deep metagame via decks + stakes.
5. **Vibe** — single aesthetic (CRT scanlines + jazz), one developer, polished to a shine.

## Core Loop

```
New run → pick deck → ante 1
  → play small blind → reach score threshold → reward gold
  → buy Jokers / consumables / vouchers in shop
  → play big blind → reward + shop
  → play boss blind (with a modifier debuff) → reward + shop
  → ante 2 … ante 8 → victory
```

Death: HP-less — you die when you fail to reach a blind's target score within the allowed hands played.

## Scoring (the core)

Every hand scored as:

```
score = chips × mult
```

- **Base chips**: pair = 10, two pair = 20, three of a kind = 30, straight = 30, flush = 35, full house = 40, four of a kind = 60, straight flush = 100, five of a kind = 120, flush house = 140, flush five = 160.
- **Base mult**: pair = 2, two pair = 2, three of a kind = 3, straight = 4, flush = 4, full house = 4, four of a kind = 7, straight flush = 8, etc.
- **Played cards** add their rank value to chips (2–10 = face value, J/Q/K = 10, A = 11).
- **Jokers** modify chips, mult, or both — additively, multiplicatively, or with weird conditional rules.

The mult multiplier (especially `xmult` Jokers) is where runs explode. A good late-run Joker set can turn a pair worth ~25 into a million+ chip score.

## Blinds

Each ante has 3 blinds:
- **Small Blind** — skippable (lose reward, gain a Skip tag).
- **Big Blind** — skippable.
- **Boss Blind** — mandatory, modifies rules (e.g. "clubs are debuffed", "first hand is a pair only", "cards face down until played").

Target scores scale per ante — by ante 8 you need to score in the millions.

## Jokers

- Up to 5 Joker slots (expandable via vouchers).
- Trigger left-to-right after played hand.
- Types:
  - **+chips** (e.g. Popcorn: +20 chips, −1 per round, destroyed at 0).
  - **+mult** (e.g. Joker: +4 mult flat).
  - **xmult** (e.g. Obelisk: ×2 mult if same hand played last).
  - **Conditional** (e.g. Greedy Joker: +3 mult per diamond played).
  - **Retrigger** (e.g. Hack: retrigger all 2–5 ranked cards).
  - **Economy** (e.g. Credit Card: +1 gold per discard, can go negative).
  - **Compound** (e.g. Blueprint: copy the Joker to the right).

The breakout moment in a run is often when a single Joker clicks with your deck into a combo (e.g. flush-only deck + Smeared Joker + Flower Pot).

## Consumables

- **Planet cards**: level up a specific hand type's chips + mult. Playing pairs all run? Stack Planet-Ceres.
- **Tarot cards**: transform/modify cards (add enhancements like Gold, Steel, Glass; add editions like Foil, Holographic, Polychrome).
- **Spectral cards**: powerful transformations with cost (e.g. "destroy 2 cards, copy another Joker").

Consumable slots start at 2; expandable via vouchers.

## Decks (starting variants)

8 deck variants at start, more unlocked:
- **Red Deck**: +1 discard per round.
- **Blue Deck**: +1 hand per round.
- **Yellow Deck**: +10 gold.
- **Green Deck**: alt: no interest, +1 gold per hand/discard.
- **Black Deck**: +1 Joker slot, −1 hand per round.
- **Checkered Deck**: all cards are Spades or Hearts.
- **Zodiac Deck**: starts with 3 vouchers.
- **Plasma Deck**: chips and mult balance (average of the two, then both set to average).

Each deck is a different strategy shell. Plasma runs play completely differently from Yellow runs.

## Stakes

Difficulty tiers (like ascensions):
1. **White Stake** — default.
2. **Red Stake** — small blinds no longer scale down.
3. **Green Stake** — required score each ante increased.
4. **Black Stake** — shop slot −1.
5. **Blue Stake** — discards cost money.
6. **Purple Stake** — required score further increased.
7. **Orange Stake** — booster packs cost +1.
8. **Gold Stake** — no free rerolls, shop inventory doubled cost.

Unlocks compound at the higher tiers.

## Original Engine

Built solo in LÖVE (Lua + C). Rebuild target here is Unity for cross-platform reach and asset tooling. The data-driven Joker list translates cleanly to Unity ScriptableObjects.

## References

- [3C Spec](references/3c-spec.md)
- [Scoring Design](references/scoring-design.md)
- [Joker Design](references/joker-design.md)
- [Progression Design](references/progression-design.md)
- [Economy](references/economy.md)
- [Unity Implementation](engines/unity/GDD.md)
