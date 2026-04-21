# Progression Design

Clash Royale's progression is **four intertwined ladders**: trophies, arenas, card levels, and path of legends. Most decisions are tradeoffs between these.

## Trophies

- +30/±X per win, -30/±X per loss, ±X modulated by league and streak protections
- Trophy count unlocks **arenas** (new visual themes + new cards added to the reward pool)
- At ~5,000 trophies the player enters **Path of Legends**, a separate competitive ladder that resets monthly with its own reward track

### Arena Thresholds (representative)

| Arena | Trophy Floor | Unlocks (example cards) |
|---|---|---|
| 1. Goblin Stadium | 0 | Goblins, Arrows |
| 2. Bone Pit | 400 | Skeleton Army, Balloon |
| 3. Barbarian Bowl | 800 | Barbarians, Cannon |
| 4. Spell Valley | 1100 | Fireball, Freeze |
| ... | | |
| 15. Legendary Arena | 5000+ | Full card pool |

(Specific arena names and thresholds vary per patch. The shape — more arenas as the player climbs — is what matters.)

### Trophy Shield / Floor

- Below a trophy floor, the player does **not** lose trophies on loss. Prevents tilt-spiral.
- Each arena has an embedded floor. This makes ladder movement one-directional within an arena.

## Card Levels

Cards level by **duplicates + gold**. Duplicates come from:
- Chests (won from matches)
- Shop (paid with gold or gems)
- Pass Royale rewards
- Clan donations (capped per week)

### Level Cap per Rarity

| Rarity | Starting Level | Max Level | Cards Needed to Max |
|---|---|---|---|
| Common | 1 | 14 | ~5,000 |
| Rare | 3 | 14 | ~1,500 |
| Epic | 6 | 14 | ~400 |
| Legendary | 9 | 14 | ~40 |
| Champion | 11 | 14 | ~12 |

Exact requirements shift with patches. Directionally: rarer cards start higher but need fewer dupes.

### Upgrade Cost Curve

Gold cost grows exponentially. A single level-14 card costs millions of gold cumulatively. This is the **primary monetisation lever** — the f2p grind to max cards is measured in years.

### Card Level Mattering

Card levels grant +10% stat per level (roughly). Stat = HP, damage, DPS, or effect power. This means:
- A level-14 card beats a level-11 card in almost every head-to-head
- **Matchmaking matches players by trophies, not by card levels.** A well-tuned deck at lower card levels can beat a high-level deck if the matchup is favourable — but bad matchups compound the stat gap brutally.

This is the most-criticised aspect of the game. Any clone must decide: copy it (feels bad but is proven monetisation) or deviate (e.g. equal card levels in ranked, card levels only in casual).

## Path of Legends

Unlocked at ~5,000 trophies. A separate ladder where:
- **All cards are at a common level** (removes the level advantage)
- Matchmaking is tight
- **Leagues** — Challenger I/II/III → Master I/II/III → Champion → Legend → Ultimate Champion
- Resets monthly with seasonal rewards

This is the game's answer to the "pay-to-win" critique. It's a skill-true mode, but gated behind the main ladder.

## Progression Gates

Deliberate friction:
- Chest unlock timers (3h / 8h / 12h / 24h) — limit match reward throughput
- Max 4 queued chests — force the player to play and also to stop playing
- Daily quests & clan donations refresh daily
- Season pass refreshes monthly

These are the "schedule" that shapes how often the player opens the app. A clone should be careful about over-compressing the schedule: retention is higher when players feel they're *missing* something by not logging in daily, but *not* behind if they miss a day.

## Clans & Social

- Clan = up to 50 players
- **War**: a weekly competitive clan battle, replaced seasonally by variants (River Race, Clan Wars 2, etc.)
- **Donations**: request cards from clan members; capped per type + day
- Donations are a soft monetisation offset — f2p players can accelerate common/rare cards through clan activity

## Player Identity & Unlock Graph

```
Play matches
   ↓
Win → earn trophies + chest → new arena → new cards in pool
   ↓                       ↘
Chest opens → gold + dupes       Season progress → pass rewards
   ↓                              ↓
Upgrade cards                   Path of Legends season reward
   ↓
Stronger deck → climb more trophies
```

## Retention Levers (Design Intent)

- **Chest schedule**: opens timed; create "check back" reasons
- **Free chest + crown chest + king's chest**: daily + weekly free rewards
- **Shop rotation**: 6h refresh on shop card offers, rare legendary deal sightings
- **Events / challenges**: themed game modes with gem entry + card prizes
- **Season pass**: ~monthly tier grind, 1 premium tier worth the price

Clone designers should recognise these as **distinct levers** and not collapse them into one "daily login reward" button. Separating them creates multiple reasons to return.
