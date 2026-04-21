# Economy

Clash Royale is **free-to-play with optional purchases**, no ads. The economy design balances matchmaking fairness with monetisation pressure.

## Currencies

| Currency | Source | Use |
|---|---|---|
| **Gold** | Chests, quests, clan wars, Pass Royale | Upgrade cards, buy card offers |
| **Gems** | Small trickle from free, primarily purchased | Skip chest timers, buy chests, enter gem-entry challenges, buy shop offers, buy cosmetics |
| **Elite Wild Cards / Wild Cards** | Pass Royale, certain chests, shop | Substitute for any card of the matching rarity |
| **Trade Tokens** | Events, season pass | Trade cards with clanmates (highly gated) |
| **Star Points** | Level rewards, shop | Cosmetic star levels on cards |
| **Pass Royale tokens** | Active during season | Progress the Pass Royale track |

Gold is the **primary bottleneck** — most f2p players are gold-starved well before they're card-starved.

## Chests

- Unlocked from wins (one slot per win; four slots max)
- Timer-gated: Silver 3h, Gold 8h, Magical 12h, Giant 12h, Epic 12h, Legendary 24h
- Skip with gems (10 gems/hour approx — tuned so skipping everything is expensive)

### Chest Cycle

Wins don't award chests randomly. They follow a **fixed cycle of 240 slots** with known positions for rare/epic/legendary. Players can look up their cycle position on community tools.

This is unusual for a f2p design. It exists because:
- Predictability reduces FOMO for players who don't have time to grind
- Community-driven transparency is a trust signal
- True randomness was experienced as "I got unlucky" rather than "the game is hard"

A clone can copy this or not, but should consciously choose.

### Chest Contents

- Gold (a range per chest tier)
- Card drops across the rarity spectrum
- Guaranteed minimum cards per rarity (prevents zero-legendary chest disappointments)

## Shop

Three shop pages refreshed on different schedules:

| Page | Refresh | Contents |
|---|---|---|
| **Daily Deals** | Daily | 1 gold-for-cards offer, 2 card-for-gems offers, 1 random discount |
| **Special Deals** | Weekly | Premium card bundles, tokens |
| **Chest Shop** | Rotates | Named chests priced in gems |

### Design Principle

The shop is the **whale lever**. Daily deals are f2p-friendly (gold for cards is a fair trade). Special deals are paid-only (gems for cards). Chest shop is the compulsive-purchase surface.

## Pass Royale

- Monthly season pass
- 100 tiers: tiers 1–30 (roughly) free, 31+ paid
- Premium tier unlocks: Tower Skin, 5 free chests, gold rewards, free shop offers
- Costs ~$5/month, aligns with industry standard

**Design intent**: give paying players a steady drip of rewards that's worth the cost, without gating content (no deck-winning card is paywalled; all paid rewards accelerate, not enable).

## Gem Pricing

- Starter bundles (~$1–4): very friendly ratios, one-time purchase
- Standard packs ($5–$100): industry-standard ramp, diminishing returns
- **Zero "pay to unlock cards directly".** Paying buys chests, which contain cards; the relationship is probabilistic (minus guaranteed drops). This is a legal + ethical posture — it positions purchases as "save time" rather than "buy power".

## Purchase Prompts

Calibrated to avoid outright predation:
- **Never prompt inside a match.**
- **Never prompt during a loss screen.**
- **Shop notifications** only on entering the shop, not home.
- **"Special offer"** pop-ups are limited to 1-2 per session.

A clone that ignores these rules will get initial revenue lift and retention collapse within 30 days.

## Gem Economy for Free Players

Expected income for a dedicated f2p player:
- **Daily login chest + daily challenges**: ~30 gems/day
- **Season pass free tier**: ~100 gems
- **Chest opens**: occasional bonus gems on magical+ chests

This is enough to run 1–2 gem-entry events per month. It is **not** enough to meaningfully accelerate card upgrades.

## Events & Challenges

- **Gem-entry challenges**: enter 10–100 gems, play until 3 losses (or 12 wins for the grand prize)
- **Free challenges**: enter free, same loss cap, smaller rewards
- **Classic challenge** (free entry, flat rewards): always-on training ground
- **Grand challenge** (100-gem entry, big rewards): high-skill mode
- **Special event challenges**: themed modes (e.g. Sudden Death only, Double Elixir Only, Retro Royale with old card versions)

Events rotate **weekly**. The calendar of events is the second-biggest retention driver after the chest timer.

## Minimum Viable Economy for a Clone

If you are building a lighter CR-like, the minimum set:
- 1 soft currency (gold or equivalent)
- 1 premium currency (gems or equivalent)
- Chests with timers, max-4 queue
- Shop with daily + weekly refresh
- Season pass with free + paid tracks
- Clan + donations

Everything else (trade tokens, star points, wild cards, magic items) is optimisation.

## Monetisation Anti-Patterns

- **Energy systems**: CR does not have an energy/stamina system. Matches are unlimited. Do not add one in a clone — it kills session count.
- **Card-direct purchases**: never let a player buy a specific card directly outside the shop's narrow offers. Keeps the collection loop valuable.
- **Duplicate refunds in dust**: CR does not do this (cards stay as dupes; excess dupes become gold via star points). Keeps dupes from the duplicate queue valuable.
- **Hard paywalls on cards**: legendaries and champions must be reachable for free, even slowly.
