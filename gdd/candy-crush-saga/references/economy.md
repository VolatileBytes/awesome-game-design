# Economy & Monetization — Candy Crush Saga

## Currencies

| Currency | Earn | Spend | Notes |
|---|---|---|---|
| **Gold Bars** | IAP, daily spin (rare), level-complete (rare) | +5 moves, lives, boosters, ticket-gate | Premium |
| **Lives** | 5 max, 1 per 30 min regen, friend gifts | Play a level (1 per attempt) | Time-gated |
| **Boosters** | Events, daily rewards, quest rewards, IAP bundles | Pre-level or in-level | Limited stock |

No "coins" soft currency in classic Candy Crush (differentiates from Royal Match which has coins + gold).

## IAP Structure

### Gold Bar Bundles

| Bundle | Price | Gold | Value |
|---|---|---|---|
| Mini | $1.99 | 25 | Baseline |
| Small | $4.99 | 70 | +12% |
| Medium | $9.99 | 150 | +20% |
| Large | $19.99 | 330 | +32% |
| Huge | $49.99 | 900 | +44% |
| Mega | $99.99 | 2000 | +60% |

Starter deals (first-week) are 50% more gold. Sale weekends (~monthly) bump ratios.

### Booster Bundles

- **Start-Level Pack**: 3 striped, 3 wrapped, 3 color bombs — $4.99
- **Lollipop Pack**: 10 lollipops — $2.99
- **Infinite Lives**: 1 hour — $1.99, 24 hours — $4.99, 7 days — $12.99

### Piggy Bank

- Fills with gold as player earns free gold (level clears, achievements)
- Locks until player pays **$4.99** to break it open
- Psychological: player feels they "earned" the content, just paying to unlock
- **High conversion**: ~15–20% of players buy at least one piggy bank

### Event Passes

- **Gold Pass**: $9.99, unlocks extra rewards in rotating events
- Feeds into Sugar Drop, Jam Session progression

## Spending Sinks

### +5 Extra Moves (the biggest)

- When player runs out of moves
- **900 gold for +5 moves** (older: 45 gold = $0.50)
- **Conversion rate**: ~30% of failed levels see the prompt, 4-6% convert (anecdotal)
- **Revenue contribution**: ~60–70% of Candy Crush's IAP revenue

### Extra Lives

- **45 gold for 1 life**
- **180 gold for 5 lives**
- **750 gold for 1 hour infinite**

Drives purchase when player is on a streak.

### Pre-Level Boosters

- **150–300 gold per booster** per level
- Lower conversion but adds up for engaged players

### Ticket Gates

- **100 gold** to skip a ticket gate
- Or wait 3 days, or ask friends

## Engagement / Monetization Curve

- **Day 1–3**: learning, free play, occasional "try a booster for free!" offers
- **Day 7–14**: hit first "hard" level (levels 65, 97, 147 are famous walls); high monetization moment
- **Month 1+**: regular engaged players; events drive monthly passes

### First Week Funnel

1. Install
2. Play 20 levels (should clear easily, free)
3. Hit first spike around level 30–50
4. Fail, see "+5 moves" offer — decide: wait for lives, or buy
5. Social friend connect prompted → lifetime retention ↑

## Monetization Levers

### Pay to Skip

- +5 moves is literally "pay to skip the failure"
- Boosters are "pay to play easier"
- Lives are "pay to play more now"

### Pay for Status

- No direct status purchase
- Tournament wins give bragging rights

### Pay for Content

- Ticket gates can be paid to bypass
- No direct level-buy

### No Pay-to-Win

- All levels are beatable without paying (critical for long-term retention)
- High-profile streamers beat Candy Crush without spending → evidence of fairness

## Design Principles

- **Soft wall, not hard wall**: every level is theoretically free-beatable
- **Time as currency**: lives regen means waiting is a viable free path
- **Social as monetization alternative**: Facebook friends can send free lives
- **Moment-of-weakness monetization**: +5 moves when 1 match short of victory

## Retention Mechanics

### Daily Login Chain (Mr. Toffee)

- 4-day cycle
- Day 4: high-value reward (2 hours of infinite lives or Gold chest)

### Sugar Drop

- Collect sugars from levels in real-time event (sugar appears on board)
- 12-hour event cycle
- Rewards: boosters, gold

### Weekly Tournament

- Matched with 9–14 friends/random players
- Rank by score across all levels played that week
- Top 3 get gold; all participants get piggybank boost

## Ethical Considerations

- King has faced scrutiny for **difficulty spikes designed for monetization**
- Modern design balance: ~5–10% of levels are "hard walls"; the rest are fair
- No "loot boxes" with real-money randomness
- No purchasable direct power (boosters give advantages, not wins)

## Analytics / KPI

- **DAU / MAU**: 10M+ DAU historically
- **ARPDAU**: $0.15–$0.30 (very high for a free-to-play)
- **Install → Day 7 retention**: 25%+
- **Average session**: 5–8 minutes
- **Sessions per day**: 3–5
- **Conversion rate**: 2–4% of players spend money (standard for F2P)

## Content Production

- ~15 new levels per week (since launch)
- Rotating events every 1–3 days
- **Major content update**: every 1–2 months (new mechanics, visuals, narrative beats)
