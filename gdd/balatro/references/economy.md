# Economy — Balatro

Single-player, one-time purchase (no IAP). The in-run economy is **gold vs. slot space vs. deck composition**.

## Resources

| Resource | Earned | Spent |
|---|---|---|
| Gold ($) | Blind rewards, interest, card effects, events | Shop (Jokers/consumables/vouchers/packs), reroll |
| Joker slots | Start with 5; +1 from Black Deck, vouchers, Negative editions | Holding a Joker occupies a slot |
| Consumable slots | Start with 2; +1 per voucher | Holds Tarot/Planet/Spectral cards |
| Hand slots | Start with 4 per round | 1 per hand played |
| Discard slots | Start with 3 per round | 1 per discard (or 1 hand-play for some decks) |
| Hand size | Start with 8 cards in hand | Draws up after play/discard |

## Per-Round Rewards

Blinds pay out:
- Small: $3
- Big: $4
- Boss: $5

**Hand bonuses**: +$1 per unused hand at end of round.
**Discard bonuses**: +$1 per unused discard (if voucher / Joker modifier).

**Interest**: +$1 per $5 held at end of round (cap: +$5).

Capping interest at $25 held is the "sweet spot" — beyond that, extra cash earns no interest.

## Shop

Appears between every blind. Contains:

- **2 shop slots** (items): Jokers, consumables, vouchers.
- **2 booster packs** on offer: Standard (cards), Celestial (Planets), Arcana (Tarots), Spectral (Spectrals), Buffoon (Jokers), Jumbo/Mega variants.
- **Reroll** button: shuffle the 2 item slots. Cost starts $5, +$1 per reroll this visit.
- **Skip** button: leave the shop without buying.

Item costs:
- **Common Joker**: $4
- **Uncommon Joker**: $6
- **Rare Joker**: $8
- **Legendary Joker**: $20
- **Tarot/Planet**: $3
- **Spectral**: $4
- **Voucher**: $10
- **Booster pack**: $4 / $6 / $8 (standard/jumbo/mega)

## Sell Value

Every Joker/consumable has a sell value (half cost, rounded down, minimum $1). Selling is a free action in the shop.

Late-game rotation: sell $4 Common for $2, buy $8 Rare for $8 → net $6 upgrade cost.

## Vouchers

Permanent run-wide upgrades; 1 per shop max. Examples:

- **Overstock** ($10): +1 shop slot.
- **Overstock Plus** ($10, after Overstock): +1 shop slot.
- **Clearance Sale** ($10): shop items 25% off.
- **Hone** ($10): Foil, Holographic, Polychrome more common in shop.
- **Reroll Surplus** ($10): -$2 reroll cost.
- **Crystal Ball** ($10): +1 consumable slot.
- **Grabber** ($10): +1 hand per round.
- **Wasteful** ($10): +1 discard per round.

Vouchers are your biggest per-dollar value — prioritize them.

## Booster Packs

Packs offer a draft: open a Standard pack → see 5 cards → keep 1. Bigger packs = more options and sometimes more picks.

| Pack | Price | Options | Picks |
|---|---:|---:|---:|
| Standard / Arcana / Celestial / Buffoon / Spectral | $4 | 3 | 1 |
| Jumbo | $6 | 5 | 1 |
| Mega | $8 | 5 | 2 |

Packs are a cheap way to grab Tarots / Planets / editions without hitting the item slots.

## Deck Economy

Unlike Slay the Spire, your deck stays 52-ish cards. Removing cards is possible (via Tarots like The Hanged Man) but expensive. Most builds focus on **transforming** the deck instead of thinning it:

- Enhance cards with Bonus / Mult / Glass via Tarots.
- Add editions via Arcana packs / Spectral cards.
- Change suits via Tarots.
- Duplicate cards via Spectrals.

The design tension: you want the deck to consistently deliver the hand your Joker setup wants.

## Stakes and Economy

Higher stakes squeeze the economy:
- Blue Stake: discards cost $1.
- Orange Stake: booster packs +$1.
- Gold Stake: no free rerolls + shop ×2 cost.

Gold Stake runs are a budget puzzle — you can't afford to lose $10 on a reroll, so every shop visit is a hard commit.

## Why No IAP

- Balatro is one-time purchase (~$15 PC, $10 mobile).
- Mobile port keeps all content; no ads, no gacha.
- Content updates (e.g. Friends of Jimbo collab re-skins) are free.
- The game's loop is already compelling without extrinsic rewards.

Any rebuild that layers IAP on top of this design would betray it.

## Anti-Patterns to Avoid

- **Energy systems**: runs are already time-gated by ante count; don't add energy.
- **Daily limits**: if you want "daily" content, add a daily seed for leaderboards, not a daily cap.
- **Unlockable Jokers behind paywalls**: community would revolt; LocalThunk's philosophy is explicit against this.
- **Ad-gated rerolls on mobile**: shop rerolls are already part of the game's cost curve; adding ads breaks balance.
