# Scoring Design — Balatro

The entire game is a scoring engine. Everything else — shop, Jokers, decks — exists to feed the core formula.

## Core Formula

```
final_score = chips × mult
```

Where `chips` and `mult` each accumulate from four sources.

## Scoring Order

When a hand is played, the engine walks the state machine in a fixed order:

```
1. Base hand values      → chips = hand.baseChips, mult = hand.baseMult
2. Apply hand level      → chips += lvl × hand.chipsPerLevel,
                           mult  += lvl × hand.multPerLevel
3. For each scoring card (L → R):
     a. Add rank chips (2–10 face, J/Q/K=10, A=11)
     b. Apply enhancement (Bonus +30 chips, Mult +4 mult, Glass ×2 mult, etc.)
     c. Apply edition (Foil +50 chips, Holo +10 mult, Polychrome ×1.5 mult)
     d. Apply seal (Red retrigger, etc.)
     e. Trigger all "on card scored" Joker effects for this card
4. For each held card in hand (L → R):
     a. Apply "triggered when held" effects (Steel ×1.5 mult, etc.)
5. For each Joker (L → R):
     a. Apply its "independent" effect (flat chips/mult/xmult)
6. Multiply: chips × mult
```

## Base Hand Table

| Hand | Base chips | Base mult |
|---|---:|---:|
| High Card | 5 | 1 |
| Pair | 10 | 2 |
| Two Pair | 20 | 2 |
| Three of a Kind | 30 | 3 |
| Straight | 30 | 4 |
| Flush | 35 | 4 |
| Full House | 40 | 4 |
| Four of a Kind | 60 | 7 |
| Straight Flush | 100 | 8 |
| Five of a Kind* | 120 | 12 |
| Flush House* | 140 | 14 |
| Flush Five* | 160 | 16 |
| Royal Flush | — | — |

*Hidden hands require modified deck (e.g. duplicate ranks via Tarots).

## Level Ups (Planet Cards)

Each hand type has a **level** (starts 1). Playing a Planet card levels up that hand's chips + mult.

| Hand | Chips per level | Mult per level |
|---|---:|---:|
| Pair | +15 | +1 |
| Two Pair | +20 | +1 |
| Three of a Kind | +20 | +2 |
| Straight | +30 | +3 |
| Flush | +15 | +2 |
| Full House | +25 | +2 |
| Four of a Kind | +30 | +3 |
| Straight Flush | +40 | +4 |

A **Pair** at level 10 is roughly 10+15×9 = 145 base chips and 2+1×9 = 11 base mult → 1,595 score before cards/Jokers. Stacking planets for a single hand type is a valid strategy.

## Card Enhancements

Applied by Tarots or starting state:

| Enhancement | Effect |
|---|---|
| Bonus | +30 chips when scored |
| Mult | +4 mult when scored |
| Wild | Counts as any suit |
| Glass | ×2 mult when scored; 1 in 4 chance destroyed after scoring |
| Steel | ×1.5 mult when held in hand (NOT scored) |
| Stone | +50 chips when scored; ignores rank/suit; scores always |
| Gold | +3 gold at end of round if held in hand |
| Lucky | 1 in 5 chance +20 mult; 1 in 15 chance +20 gold |

## Editions

Applied by Spectrals or shop packs. Stack multiplicatively over enhancement:

| Edition | Effect |
|---|---|
| Foil | +50 chips |
| Holographic | +10 mult |
| Polychrome | ×1.5 mult |
| Negative (Joker only) | +1 Joker slot |

## Mult Operators: + vs. ×

The defining distinction:

- **`+mult`**: additive. `+4` is worth the same whether mult is 2 or 200.
- **`×mult` ("xmult")**: multiplicative. At high mult, xmult Jokers dominate by orders of magnitude.

Run trajectory:
- Early: `+chips` dominates (hand value is small).
- Mid: `+mult` catches up.
- Late: `×mult` is the only thing that matters.

Most "break the game" combos are xmult chains: Polychrome + Glass + Baseball Card + Obelisk etc.

## Deterministic Resolution

Given a seed + action log, the final score of every hand is identical across runs. This enables:
- **Challenge mode** with fixed seeds.
- **Friend seed sharing** ("try seed `BALATRO`").
- **Bug reproduction**.

## Test Coverage Targets

- Every hand type at levels 1, 5, 10.
- Every enhancement × every edition combination.
- Every xmult Joker's stacking order (result should be commutative within a category).
- Big-number handling: final scores can exceed `2^53`; use `double` or `BigInteger` depending on engine.
