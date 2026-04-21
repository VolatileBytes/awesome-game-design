# Progression Design

Progression in CoC is **Town Hall-gated with hero and resource-storage subsystems**.

## Town Hall Spine

Town Hall (TH) level is the single most important player stat. It determines:
- Matchmaking pool (you fight nearby TH levels, with some fuzziness)
- Max wall level
- Max hero level
- Max troop training levels (via lab)
- Number of army camps, barracks, spell factories
- Max of each defensive building
- Availability of new buildings (e.g. Dark Elixir Drill at TH7, Eagle Artillery at TH11, Scattershot at TH13)

### TH Upgrade Cost

Ballpark (varies by patch, used here for directional feel):

| From → To | Cost | Time |
|---|---|---|
| TH1→2 | 1k gold | instant |
| TH5→6 | ~200k gold | 8h |
| TH8→9 | ~2M gold | 6d |
| TH11→12 | ~7M gold | 14d |
| TH13→14 | ~12M gold | 17d |
| TH15→16 | ~20M gold | 18d |

The cost-and-time curve is exponential. Higher TH = weeks to months per upgrade.

## Builder Constraint

Upgrades run in parallel **up to the number of builders** you own.
- Start: 2 builders
- Unlock via gems: 3rd, 4th, 5th builder
- Build time is per-upgrade; more builders = more parallel progress

This is the **hardest f2p bottleneck**. Builders cost hundreds of gems each; gems are slow without purchase. Most f2p players have 3–4 builders; paying players have 5.

The Builder Base introduces a separate set of builders and a different mini-game (Builder Base is not covered here but is the f2p gem farm).

## Heroes

Heroes are permanent units, one of each, each with a level.

| Hero | Unlocked at TH | Max Level (TH16) | Role |
|---|---|---|---|
| Barbarian King | 7 | 95 | Melee tank |
| Archer Queen | 9 | 95 | Ranged sniper, cloaked |
| Grand Warden | 11 | 70 | Support, aura buff, revive |
| Royal Champion | 13 | 50 | Ranged, wall jumper |
| Minion Prince | 15 | 30 | Air ranged |

Each hero has an **ability** that activates on tap during attack.

### Hero Upgrade

Heroes upgrade with **dark elixir** and a time-cost curve. When upgrading, the hero is **unavailable in battle** for the duration — a deliberate trade-off that makes timing hero upgrades a strategic decision.

## Pets

Unlocked at TH14+. Each hero can equip a pet. Pets have their own upgrade tracks (dark elixir + hero hall time). Pets add a second lever of power per hero.

## Troops & Spells

Trained via:
- **Barracks** — elixir troops
- **Dark Barracks** — dark elixir troops
- **Spell Factory** — elixir spells
- **Dark Spell Factory** — dark elixir spells

Troops and spells **level up in the Laboratory**. Lab upgrades cost elixir + time. Lab can only run one upgrade at a time, so picking what to level is meaningful.

### Siege Machines (TH12+)

Special siege units (Wall Wrecker, Battle Blimp, Stone Slammer, Siege Barracks, Log Launcher, Flame Flinger) are crafted in the Workshop. Each is a "first-phase" unit that carries heroes into the base.

### Super Troops (TH11+)

Normal troops can be temporarily "boosted" to a Super variant (Super Barbarian, Super Wall Breaker, Super Minion, etc.) for 3 days at a cost of dark elixir. Super Troops cost more housing space but hit harder.

## Gold Pass (Season Pass)

- Monthly, $5 tier
- Free track + premium track
- Key benefits:
  - **Research boost** (faster lab)
  - **Builder boost** (faster upgrades)
  - **Training boost** (faster army train)
  - **Season Bank** (gold/elixir accumulates into a claim-at-end-of-season chest)
  - Cosmetic hero skins
  - Gems, magic items

The Gold Pass is the **single most efficient monetisation item**. Its acceleration effects compound across the entire village, not just one system.

## Magic Items

Tradable / usable one-time boosters:
- **Book of Building** — finish a build instantly
- **Book of Heroes** — instant hero upgrade
- **Book of Spells / Fighting** — instant research
- **Hammer variants** — instant + free upgrade
- **Rune of Gold/Elixir** — fills storage
- **Potion of Power** — temporarily maxes stats for a few hours

Magic items come from Gold Pass, Clan Games, CWL, and shop offers. They're the "hurry up" button.

## Unlock Graph (Overview)

```
TH1 → basic village, 2 builders, gold/elixir
TH2-3 → add walls, barracks, more troops
TH4-6 → dark elixir unlocks, first heroes
TH7-9 → full combat troop roster, Dragon, PEKKA, hero tier 1
TH10-12 → Inferno Tower, Eagle, Scattershot, hero tier 2, siege machines
TH13-15 → Giga Inferno, Monolith, Pet House, hero tier 3, new spells
TH16+ → pinnacle content, "endgame" for multi-year players
```

## Retention Design

- **Daily logins**: collectors fill in ~24 hours, must be manually collected (retention loop)
- **Build timers**: multi-day upgrades create "check-in" patterns
- **Clan Games** (biweekly): clan-wide challenge with magic item rewards
- **Clan War** (continuous, ~2 per week): scheduled event with coordinated prep
- **CWL** (monthly): top-tier competitive event
- **Seasonal challenges** (monthly via Gold Pass): structured long-term goal

Each of these creates a different retention hook. A clone that collapses them into one loop loses the layered schedule.

## Rushed Base Problem

Players who race TH without upgrading defences or troops end up with "rushed" bases. The game:
- **Matchmakes rushed bases against rushed bases** (based on defensive strength, not TH alone)
- **Still matches by trophies** (so a rushed base can still play competitively)
- **Offers "catch-up" rewards** (in the form of a separate task list for underdeveloped bases)

The intended lesson: rushing makes progress feel fast but is inefficient long-term. Most players eventually slow down and "fix" their base.

## End-Game

At max TH:
- **Clan War Leagues** are the primary endgame — competitive, seasonal, reputation-driven
- **Esports** — high-end clan wars with live-streamed coverage
- **Collectible cosmetics** — hero skins as long-term vanity
- **Perfectionist goals** — max everything, attempt 3-star strategies on top bases

Many max players "retire" from active progression and focus on clan leadership + content creation (YouTube, Discord, war strategy).
