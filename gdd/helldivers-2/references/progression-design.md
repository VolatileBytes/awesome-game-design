# Progression Design — Helldivers 2

Progression is **multi-layered** — individual, squad-shared, and community-wide.

## Individual Progression

### Levels (1-150)

XP from mission completion. Each level unlocks:
- Stratagem slot (early levels).
- Difficulty unlock (e.g., Helldive unlocks at level 10).
- Cosmetic unlock.

Soft-cap at ~50; continued slow gain thereafter.

### Currencies

| Currency | Source | Spend |
|---|---|---|
| **Requisition (R)** | Mission + completion | Stratagem purchase |
| **Medals** | Mission + Major Order | Warbond unlocks |
| **Super Credits** | Mission rare + real $ | Premium Warbonds + superstore |
| **Samples (Common)** | Mission 4+ | Ship upgrade tier 1 |
| **Samples (Rare)** | Mission 6+ | Ship upgrade tier 2 |
| **Samples (Super)** | Mission 7+ | Ship upgrade tier 3 |
| **XP** | Mission | Level up |

### Stratagem Unlocks

Stratagems cost Requisition (typically 1500-10000 R). Higher-level unlocks (Mech, 500kg, Railgun) cost more.

Players unlock stratagems once — all 4 squad members can use any unlocked stratagem.

### Armor & Weapons

Dropped weapons/armor are **sidegrades**, not upgrades:
- Earn by completing Warbonds (battle-pass-style).
- No power tier; each weapon has a niche.
- Cosmetic slots: helmet, chest, cape.

### Warbonds

Battle-pass-style unlock trees:
- **Free**: Helldivers Mobilize (starter, broad selection).
- **Premium Warbonds**: 1000 Super Credits (~$10 equivalent), thematic (Steeled Veterans, Cutting Edge, Democratic Detonation, etc.).
- Progress via **Medals**; tiers unlock in order.
- Rewards: weapons, armor, capes, emotes.
- **No expiration** — Warbonds persist; buy today, complete anytime.

## Ship Upgrades (Squad)

Each Helldiver has their own Super Destroyer (ship). Upgrades spend samples:

### Modules

- **Patriotic Administration Center** — primary/secondary ammo boost.
- **Orbital Cannons** — orbital stratagem CD reduction.
- **Hangar** — Eagle uses / rearm speed.
- **Bridge** — reinforcement speed.
- **Engineering Bay** — sentry + guard dog upgrades.
- **Robotics Workshop** — sentry-specific upgrades.

Each module: 4 tiers; cost common → rare → super samples.

Squad members who have the upgrade get the effect on their stratagems.

## Community Progression — The Galactic War

### Major Orders

Issued by "High Command" (Arrowhead Game Masters):
- "Liberate planet X by Y date."
- "Defeat automaton offensive in sector."
- "Collect 10M terminid bile samples."

Collective community effort — every mission on relevant planets contributes.

**Reward** (on success): 
- Medals for all participating players.
- New stratagem unlock (historical: Eagle Strafing Run unlocked via community Major Order).
- Story beat in canon.

On failure: opposing faction advances, story goes dark direction.

### Liberation Rate

Each planet has:
- **Liberation %**: players push it up.
- **Regeneration rate**: opposing faction reclaims automatically if no one plays there.

Math: liberation gained per mission is proportional to success + difficulty.

### War Phases

Game Masters actively steer narrative:
- **Faction offensives**: enemies push multiple planets.
- **Defense campaigns**: one planet under siege; players race to defend.
- **Invasion counters**: new biome / enemy variant introduced mid-war.

### Planetary Hazards & Modifiers

Each planet has:
- **Biome** (jungle, arctic, desert, volcanic).
- **Environmental hazards** (fire tornadoes, acid storms, blizzard).
- **Modifiers** — sometimes active (stratagem CD +50%, no orbital, etc.).

These push meta loadouts — e.g., ion storm planet disables stratagems; melee-oriented loadouts surge.

## Mission Scoring

End-of-mission screen:
- **Time**: 40-min cap.
- **Deaths** (squad total).
- **Enemies killed** (by faction, weapon).
- **Samples collected** (must extract to bank).
- **Objectives**: primary + secondaries + nests/bases.
- **Accolades**: MVP, most friendly kills, etc.

Rewards scale with difficulty + completion.

## Economy Design

- **Requisition and Medals** are earnable entirely by play.
- **Super Credits**: mostly purchased, but ~5-20 can be found on missions. Dedicated players can earn premium Warbonds over time.
- **No loot boxes**, no randomized unlocks.
- **Premium store rotation**: cosmetic armor sets.

## Design Philosophy

### No Paid Advantage

Everything combat-relevant earnable via play. Superstore + premium Warbonds are largely cosmetic + sidegrade weapons/armor passives — not strict upgrades.

### Progression Without Grind Incentive

- No daily login rewards.
- No timed challenges that push you to play X hours this week.
- Major Orders reward playing when you want to — not forcing schedule.

### Shared Agency

The Galactic War makes every mission "count" — even if just by 0.0001%. Playing with strangers contributes to a story they're also in.

### Cosmetic Expression

Warbonds are the customization layer — capes, armor, titles, emotes.

### Controversies

- **Railgun nerf** (Feb 2024): players revolted; Arrowhead responded, rebalanced enemies + weapons.
- **Sony PSN requirement** (May 2024): forced PSN linking → community review-bombed; Sony reversed.
- **Pricing criticism**: Super Credits monetization debated; Arrowhead generally earned community goodwill through transparency.

## Long-Term Loop

```
1. Login; check Major Order.
2. Hop on ship; invite friends or quick-match.
3. Dive 1-3 missions per operation.
4. Earn medals + samples + XP.
5. Buy stratagem if needed; spend samples on ship upgrades.
6. Progress Warbond towards next weapon.
7. Contribute to Major Order.
```

Average session: 1-3 hours.
Average dedicated player: 5-15 hours/week.

## Meta Targets

- Major Order weekly cadence — community has 3-7 days to hit.
- Warbond completion: ~40-80 hours of dedicated play.
- Full ship upgrade: ~60-100 hours at Helldive difficulty.
- Level 150 cap: ~500+ hours (grindy but not gated).
