# 3C Spec — Balatro

Balatro is a click-driven card game, not a character game. "3C" here means **Cards / Canvas / Controls**.

## Cards

- Standard 52-card deck (plus variant decks).
- Each card has: **rank** (2–A), **suit** (♠♥♦♣), optional **enhancement** (Gold, Steel, Glass, Lucky, Mult, Bonus, Wild, Stone), optional **edition** (Foil +50 chips, Holographic +10 mult, Polychrome ×1.5 mult, Negative +1 Joker slot), optional **seal** (Red retrigger, Blue create Planet, Gold +3 gold, Purple create Tarot).
- Hand size: 8 cards default (modifiable by Jokers / vouchers).
- Select 1–5 cards to play or discard per turn.

## Canvas

- Single static table: draw pile left, hand center-bottom, Joker row top, consumable slots upper-right, blind info upper-left.
- CRT scanline post-process over everything; jazz soundtrack.
- Score reveal: chips and mult animate separately, then multiply into a running total with kinetic typography.

```
┌──────────────────────────────────────────────┐
│ [Blind info]                  [Jokers ≤ 5]   │
│                               [Consumables]  │
│                                              │
│           [Score readout]                    │
│                                              │
│  [Deck]        [Hand of 8]        [Discard]  │
│                [Play] [Discard]              │
└──────────────────────────────────────────────┘
```

## Controls

### Desktop
- **Click card**: toggle select.
- **Drag card**: reorder hand (affects Joker left-to-right-style triggers? No — Jokers trigger L-to-R, card order affects retrigger resolution).
- **Play Hand**: submit selected cards.
- **Discard**: replace selected cards (costs 1 discard).
- **Sort by Rank / Suit**: quick sort button.
- **Hotkeys**: 1–5 select, Space to play, D to discard.

### Mobile / Touch
- **Tap**: select.
- **Long-press**: card detail tooltip.
- **Swipe up**: play selected.
- **Swipe down**: discard selected.

### Controller (Switch/Steam Deck)
- **D-pad / left stick**: cursor.
- **A**: select / confirm.
- **B**: deselect / back.
- **X**: play hand.
- **Y**: discard.
- **R1/L1**: cycle between hand / Jokers / consumables.

## Interaction Priority

1. Reading Joker + blind state (top panel) before drafting a hand.
2. Selecting 5 cards (or choosing to play fewer for straight/flush/pair effects).
3. Watching the score animation — this IS the reward.
4. Between hands: shop interactions (buy, sell, reroll).

## Animation as Feedback

Balatro's signature feel is the **score tally**: chips and mult each tick up with a crunchy sound, Jokers flash as they trigger L-to-R, and the final `chips × mult` resolve in a big numeric punch. This is the game's dopamine.

Any rebuild must preserve the tally animation — rushing it breaks the feel.
