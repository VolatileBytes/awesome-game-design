# Joker Design — Balatro

Jokers are the game's identity. 150 of them ship in base Balatro, and nearly every run's character comes from which Jokers stick.

## Slots

- Default: 5 slots.
- Expandable: +1 via Black Deck, +1 per Negative-edition Joker, +1 from voucher.
- Beyond 5, Jokers simply overflow in the UI — no soft cap on effect.

## Trigger Order

Jokers resolve **left to right**. Card effects resolve within the scoring loop above, then Jokers. This means:

- Blueprint (copies the Joker to its right) must physically be placed to the *left* of its target.
- Stacked xmult chains are commutative within the Joker row, but retriggers + xmult are not — order matters.

## Joker Taxonomy

### 1. Flat Chips

Simple add to chips total. Early-game filler.

```
Joker              +4 mult
Gros Michel        +15 mult, 1 in 6 chance destroyed end of round
Popcorn            +20 mult, −4 mult per round, destroyed at 0
```

### 2. Flat Mult

Same but for mult.

```
Joker Stencil      +1 for each empty Joker slot
Banner             +30 chips per remaining discard
```

### 3. xMult

The payoff type.

```
Obelisk            ×0.2 mult for each consecutive round playing the same hand (up to ×2+)
Constellation      ×0.1 mult for each Planet card used this run
Baseball Card      ×1.5 mult for each Uncommon Joker held
Campfire           ×0.25 mult per card sold; resets on boss
```

### 4. Conditional / Suit / Rank

Triggered by specific played cards.

```
Greedy Joker       +3 mult per diamond played
Lusty Joker        +3 mult per heart played
Wrathful Joker     +3 mult per spade played
Gluttonous Joker   +3 mult per club played
Even Steven        +4 mult per even card scored
Odd Todd           +31 chips per odd card scored
Scholar            +20 chips, +4 mult per Ace scored
```

### 5. Retrigger

Makes specific cards score twice.

```
Hack               retrigger each played 2, 3, 4, 5
Seltzer            retrigger each played card for next 10 rounds, then destroyed
Mime               retrigger each card held in hand
Dusk               retrigger each played card on final hand of round
Sock and Buskin    retrigger each face card
```

### 6. Economy

Affects gold flow.

```
Credit Card        +1 gold per discard; gold can go negative
Business Card      1 in 2 chance +2 gold per face card
Delayed Gratification    +2 gold per unused discard at end of round
Egg                +3 sell value per round
To the Moon        +1 gold per 5 gold at end of round
```

### 7. Compound / Meta

Interact with other Jokers.

```
Blueprint          copy ability of Joker to the right
Brainstorm         copy ability of leftmost Joker
Baseball Card      ×1.5 per Uncommon Joker (scales with rarity)
Joker Stencil      +1 mult per empty Joker slot
DNA                if first hand this round has 1 card, duplicate it to hand, draw pile, and discard
```

### 8. Meta Currency

Jokers that expand your run:

```
Red Card           +3 mult when any Booster Pack is skipped
Ceremonial Dagger  at blind select, double the sell value of Joker to right; destroy that Joker
Swashbuckler       +1 mult per sell value of other Jokers
Riff-Raff          creates 2 common Jokers at start of each Ante
```

## Rarity Distribution

| Rarity | Weight | Count | Example |
|---|---:|---:|---|
| Common | 70% | ~60 | Joker, Greedy, Odd Todd |
| Uncommon | 25% | ~55 | Blueprint, Sock and Buskin, Campfire |
| Rare | 4% | ~25 | Obelisk, Constellation, Baseball Card |
| Legendary | 1% (special conditions) | 5 | Canio, Triboulet, Yorick, Chicot, Perkeo |

Legendaries only spawn from Spectrals (Soul card) + lucky rolls. Each legendary is a run-defining centerpiece.

## Joker Archetypes for Run Planning

- **Flush build**: Smeared Joker (spades+clubs same suit, hearts+diamonds same suit) → easy flushes → stack flush-based multipliers.
- **Pair spam**: Level up Pair via Planets; add Greedy + Scholar for ace pairs.
- **Glass cannon**: Tarot up every card to Glass, stack ×2 mult cards; hope none break.
- **Economy tank**: Credit Card + Egg + To the Moon → stack 400+ gold → buy the shop.
- **Joker tempo**: Blueprint + Brainstorm + legendary = single Joker duplicated 3×.

Tier lists shift per patch; the design space supports dozens of viable builds.

## Data Model (for implementation)

Each Joker is a ScriptableObject:

```
JokerDefinition {
  id: string
  rarity: enum
  sellValue: int           // default 1/2 of cost, floor
  basePrice: int           // common 4, uncommon 6, rare 8
  triggerPoints: flags     // OnScored, OnHeld, Independent, OnBlindStart, etc.
  effectGraph: EffectNode  // composed effect
}
```

The effect graph refers to the same node system used by cards — see `engines/unity/references/scoring-engine.md`.

## Balance Notes

- Joker spawns favor rarity by shop seed, so two rare-heavy shops in a row happen by design (LocalThunk tuned this).
- Late-game run turnover: at ante 6+, you often sell a Joker to buy a better one. Sell value matters.
- The game lives or dies on the variety of its Jokers; a port that ships with fewer than ~120 would feel thin.
