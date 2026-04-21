# Card Design

Marvel Snap cards are tight: a Name, a Cost, a Power, and often an Ability Text. Simple. But the combination across a 12-card deck creates the interaction space.

## Card Anatomy

| Field | Role |
|---|---|
| **Cost** | 1–6, caps play in first turns |
| **Power** | Raw strength in a lane; can go negative |
| **Name** | Marvel IP character, recognizable |
| **Keyword** | On Reveal / Ongoing / End of Turn / Move / Discard / Destroy |
| **Ability Text** | Typically 1–2 sentences, always resolvable in <3 seconds |
| **Art** | Character portrait; variants change art |

## Stat Budget

A rough **power budget** per cost:

| Cost | Vanilla Power | Typical With Ability |
|---|---|---|
| 1 | 2 | 1 (abilities are strong at low cost) |
| 2 | 3 | 2–3 |
| 3 | 5 | 3–4 |
| 4 | 7 | 5–6 |
| 5 | 9 | 7–8 |
| 6 | 12 | 8–10 |

Vanilla cards exist as a **baseline** — they're the "better power for no text" option. Most cards trade some power for an ability.

## Ability Design Rules

### Rule 1: Resolvable in 3 Seconds
The card must be understandable in one read-through. No flow charts, no conditionals-of-conditionals. "Add a copy of this to your hand" — yes. "If you have at least 3 cards in hand and it's turn 4 and…" — no.

### Rule 2: Lane-Aware
Most effects target **"cards here"** or **"other locations"** — the 3-lane structure is always in scope. This reinforces the board.

### Rule 3: Synergies > Solo Power
Cards like **Kazoo** (+1 power to all 1-costs) only shine in **Zoo decks**. Solo, they're mediocre. This means deckbuilding matters — the ceiling for a card depends on what it's with.

### Rule 4: Win Conditions Matter
Each deck archetype has 1–2 **win-condition cards**: your late-game game-winner. The rest of the deck enables them:
- Zoo: Kitty Pryde chained → Patriot, Blue Marvel buffs, win with board
- Destroy: Venom or Carnage eats your stuff → Knull for a big power spike
- Discard: Hela resurrects discarded → turn 6 big board
- Ongoing: Devil Dinosaur + Onslaught double ongoing effects
- Big: Thanos + Infinity Stones → ramp out expensive plays

## Ability Keywords

### On Reveal
Triggers **on the turn the card is played**, during the reveal sequence.
- Example: "On Reveal: Afflict a random enemy card with -2 power"
- **Combo**: Wong doubles On Reveal effects at his location → stack them

### Ongoing
**Persistent aura** while the card is in play.
- Example: "Ongoing: Other cards here have +2 power"
- **Combo**: Onslaught's Citadel doubles Ongoing effects

### End of Turn
Triggers **at end of every turn**.
- Example: "End of Turn: Gain 1 power for each card here"

### Move
Card can move between locations.
- Synergy with **"move payoffs"**: Vulture (+5 power when moved), Heimdall (move everything left)

### Discard
Triggers when a card **leaves your hand** (discarded by you or forced).
- Hela: play your discarded cards back in one spot

### Destroy
Triggers when a card **leaves play** (destroyed by you or opponent).
- Venom eats allies → Knull (big payoff)

## Card Tiers (Design Goals)

### Solo Stars
Strong on their own; don't need combo. Many of these are the first cards new players use. (Misty Knight, Cyclops.)

### Combo Enablers
Useless alone, defining with synergy. (Kazoo, Ka-Zar.)

### Win Conditions
Expensive, powerful, deck-defining. (Iron Man, Blue Marvel, Onslaught.)

### Disruption
Interact with opponent: debuffs, location destroy, copy-steal. (Enchantress, Cosmo, Leader.)

### Tech Cards
Counter-picks against the meta. (Shang-Chi vs big cards, Enchantress vs ongoing decks.)

## Card Release Cadence

- **1 new card per week** (Spotlight Cache headline)
- **~50 new cards per year**
- Cards are seasonal pass exclusives first, then join the Spotlight rotation, then the general pool

## Balance Levers

### Base Stat Changes
- Nerf: -1 power or +1 cost
- Buff: +1 power or -1 cost
- **These are the last-resort changes** because they ripple

### Keyword Tweaks
- Wording refinements (e.g., "discard 1 card" → "discard up to 1 card")
- Triggering timing adjustments

### Meta Response
- If a card is at 60%+ winrate → nerf
- If at 40%- → buff or support synergy

## Anti-Patterns

- **NPE (Negative Play Experience)**: effects that delete opponent's cards from hand with no interaction are frustrating — use sparingly
- **Infinite combos**: reaching 100+ power in a lane is fun once, terrible when it's the meta
- **Stall decks**: cards that end turns early or prevent plays on opponent side risk making the game feel rigged
- **Over-texted cards**: if a card takes 10 seconds to read, it's failed the simplicity test
