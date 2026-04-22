# Progression Design — Balatro

Two axes: **within a run** (antes + stakes) and **across runs** (deck unlocks, completion stickers).

## Within a Run: Antes

Each run is **8 antes**. Each ante has 3 blinds:

| Blind | Target score (ante N) | Reward |
|---|---|---|
| Small | base × 1 | $3 |
| Big | base × 1.5 | $4 |
| Boss | base × 2 (+ rule modifier) | $5 |

Base targets scale roughly: ante 1 = 300, ante 2 = 800, ante 3 = 2,000, ante 4 = 5,000, ante 5 = 11,000, ante 6 = 20,000, ante 7 = 35,000, ante 8 = 50,000. (Numbers shift per patch.)

The jump from ante 6 → 8 is vertical — by ante 8 you need a six-figure score, which requires xmult stacking to hit.

### Skipping Blinds

Small and Big blinds are skippable. Skipping:
- Forfeits the reward.
- Gains a **Skip Tag** — a one-time effect redeemable at the next non-skipped blind: +$20, free voucher, free boss rerol, etc.

Optimal play often skips small blinds for Skip Tags when deck is strong.

### Boss Blind Modifiers

Bosses apply a rule debuff:

- **The Hook**: discards 2 random cards from hand per hand played.
- **The Wall**: required score doubled.
- **The Wheel**: 1 in 7 chance of any card being debuffed.
- **The Club**: all club cards debuffed (score 0).
- **The Needle**: only 1 hand this blind.
- **The Water**: 0 discards this blind.
- **The Eye**: only 1 of each hand type scores per blind.

~30 boss blinds total; ante determines difficulty tier. Each one demands a different tactical response.

### Endless Mode (post-ante-8)

After clearing ante 8 you unlock Endless. Targets scale exponentially; the record scores are astronomical (>2e300). Endless is the scoreboard chase.

## Runtime Economy (see economy.md for full detail)

- Starting money: $4.
- Hands per round: 4 (modifiable).
- Discards per round: 3 (modifiable).
- Interest: +$1 per $5 held (capped at $5 interest) at end of round.

## Across Runs

### Deck Unlocks

Clearing with specific decks + stakes unlocks new decks/stakes. For example:
- Clear Red Deck → unlock Blue Deck.
- Clear any deck → unlock Red Stake (higher difficulty).
- Clear all decks at Gold Stake → completionist.

Total: 15 decks + 8 stakes = 120 completion cells.

### Stake Tiers

| Stake | New effect |
|---|---|
| White | default |
| Red | small blinds don't scale down |
| Green | required score +25% |
| Black | shop slot −1 |
| Blue | discards cost $1 each |
| Purple | required score further +25% |
| Orange | booster packs +$1 |
| Gold | no free rerolls; shop cost ×2 |

Each tier stacks with all prior (Gold Stake has ALL modifiers).

### Completion Stickers

Grid on title screen: rows = decks, columns = stakes. Clearing Deck X at Stake Y fills that cell with a sticker.

Target for a dedicated player: all 120 cells at Gold Stake = true 100%.

### Unlocks by Play

- **New Jokers**: some Jokers locked behind "play X runs" or "win with Y" conditions.
- **New vouchers**: similar.
- **Challenge mode**: 20 pre-set challenge runs with constraints (no Jokers, only Hearts, etc.). Each has a first-clear reward.

## Daily Seed (optional port feature)

Original game doesn't have daily seeds, but port should consider: a shared seed of the day → global leaderboard. Would fit the game naturally.

## Session Length Targets

- Loss run: 15–25 min (typical deaths by ante 4–5 when build doesn't click).
- Win run: 45–75 min (successful runs).
- Endless chase: 1–3 hours.

Mobile play skews toward short sessions; the natural stopping point is end-of-ante or shop screen.
