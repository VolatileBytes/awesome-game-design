# Progression Design

Progression is **horizontal** (collect brawlers) and **vertical** (level them up).

## Trophy Road

Trophies accumulate per brawler. **Per-brawler trophies sum into your total trophies.**

### Trophy Gain / Loss

- **Gain** on win; **lose** on loss; magnitude scales with the brawler's current trophies
- High-trophy brawlers gain less and lose more (to prevent runaway trophy accumulation)
- Low-trophy brawlers have protection (no loss below certain thresholds)

### Trophy Road Milestones

Unlock structure at total-trophy milestones:
- **10** → first new brawler reward
- **50** → new mode unlock
- **200** → fourth brawler slot
- **500** → a rare brawler
- **1000, 2000, 5000, 10000, 20000, 50000** → staircase rewards
- **100000+** → high-end cosmetic + prestige rewards

The Trophy Road is the **primary early-progression driver**. New players spend their first 10 hours marching along it.

## Brawler Unlocks

Brawlers are categorised by rarity:
- **Common** (starter + free daily drop): Shelly, Bull, Nita, Colt, etc.
- **Rare** → **Super Rare** → **Epic** → **Mythic** → **Legendary**
- **Chromatic** (time-limited, season-exclusive at launch)
- **Hypercharge brawlers** (Power 11 evo)

### Sources for Brawler Unlocks

- Trophy Road rewards (guaranteed at certain thresholds)
- Star Drops (random chance; rare)
- Shop (direct purchase with gems or credits)
- Brawl Pass (bonus chromatic)
- Events / challenges (featured limited-time unlocks)

## Power Levels (Brawler Upgrades)

Each brawler has **Power Levels 1–11**, with:
- **Power Points** + **Coins** to upgrade
- Each power level: **+10% HP + 10% damage**
- Unlocks at Power 7, 9, 10, 11:
  - Power 7: first **Gadget** slot
  - Power 9: first **Star Power** slot
  - Power 10: second **Gadget** slot (unlocked via shop usually)
  - Power 11: Hypercharge (if the brawler has one)

### Maxing a Brawler

From Power 1 to Power 11 for one brawler:
- ~1,500 Power Points
- ~5,000 Coins
- Plus: 2 star powers (unlock or purchase), 2 gadgets (unlock or purchase), 1 hypercharge (unlock at P11)

Coins are the **bottleneck**. Power Points come fast from Star Drops and quests; Coins are grindy.

## Brawl Pass (Season Pass)

- Monthly, $5 tier
- Free track + Pro (paid) track
- 90 tiers, earn "Tokens" from match quests to progress tiers
- Key rewards:
  - **One Chromatic brawler** (or a current-meta legendary) on the pro track
  - Brawler credits, power points, coins, pins (emote pins), gems, mega box
  - Skin(s) for a featured brawler

### Quests

- Daily (3 per day, replace after 24h)
- Weekly (longer, bigger rewards)
- Mastery quests (per brawler)
- Pro pass quests (exclusive higher rewards)

Quests are **tokenised** — completing quests yields tokens which fill the pass track.

## Mastery Track (Per Brawler)

- Play a brawler a lot → earn mastery points
- Mastery tiers: Bronze → Silver → Gold → Diamond → Master (or similar, rotates)
- Rewards: cosmetics, pins, power points, and a **token boost** (tokens earned per match with this brawler)

Mastery encourages **long-term investment in favourite brawlers**, not just trophy grinding.

## Power League / Ranked

Separate competitive mode, **brawlers are pre-maxed**, letting skill decide.
- Available once you own N brawlers and reach M trophies
- **Drafting phase** — 3v3 turn-based ban-pick (similar to MOBA)
- **Seasons** reset every ~2 months
- Tiers: Bronze → Silver → Gold → Diamond → Mythic → Legendary → Masters
- Seasonal rewards: cosmetics, Star Drops, coins

This is the **competitive endgame** and the answer to "pay-to-win" complaints about base trophies.

## Star Drops

Randomised rewards from match completion:
- Chance depends on trophy rank (higher = more drops)
- Tier: Common, Rare, Epic, Mythic, Legendary
- Contents: coins, power points, brawler credits, gadgets, star powers, pins, spray, skin chance

Star Drops are the **lootbox element** of progression. They are calibrated:
- Legendary drops are rare but **guaranteed within N drops** (pity timer)
- Content is gameplay-meaningful but caps at the brawler's current power level

## Club (Guild) Progression

- Clubs of up to 30 players
- **Club League** (bi-weekly): team-based matches that score the club; climb club tiers
- **Club rewards**: weekly chests based on club tier
- **Club chat**, friendly battles, shared event progress

## Starr Drops (Rebrand)

Periodically Supercell rebrands "Mega Box / Big Box / Brawl Box" → "Star Drops" → etc. The naming varies but the mechanic is the same: timed or earned lootbox.

## Unlock Graph (Simplified)

```
Match win → Trophies + Star Drop chance
   ↓                     ↓
Trophy Road gates → unlocks brawlers + modes
   ↓
Brawler unlocked → enters rotation
   ↓
Play brawler → Power Points + Coins + Mastery
   ↓
Power Level up → stronger brawler → more trophies per win
```

## Quest / Task / Event Layering

The game runs several overlapping progression clocks:
- **Daily quests** (3)
- **Weekly quests** (5)
- **Mastery** (per-brawler)
- **Brawl Pass** (monthly)
- **Power League** (seasonal)
- **Club League** (biweekly)
- **Event challenges** (time-limited)

A new player ignoring most of these still progresses. A dedicated player engages all of them for maximum earn rate. The design respects both.
