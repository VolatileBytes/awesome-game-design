# Progression Design — Escape from Tarkov

Progression in Tarkov is intentionally slow, long, and comprehensive. Expect 300+ hours to reach mid-tier, 1000+ hours for Kappa.

## PMC Level (1-79)

XP from:
- Raid completion (extract).
- Kills (PMC, Scav, Boss, Raider/Rogue).
- Quest completion.
- Healing, movement, skills (minor contribution).

Gates at each level:
- **5**: enough quests to unlock some traders.
- **10**: most early quests available.
- **15**: **Flea Market unlocks** — major milestone.
- **20**: Mid-tier quests.
- **30-40**: Labs accessible without penalty.
- **40+**: Kappa quest line possible.
- **50+**: mastery-tier players.
- **79**: soft max (rarely reached).

XP per raid: 1k-20k typical; 50k+ on kill-heavy big raids.

## Trader Loyalty Levels

Each trader has 4 LLs:
- **LL1**: starting.
- **LL2**: requires player level + trader rep + roubles-spent + some quests.
- **LL3**: more quests + higher rep + higher lvl.
- **LL4**: heaviest lock — usually deep in questlines + high PMC lvl (30+).

Higher LL = more/better stock, lower prices, barter trades unlock.

Reputation increases by:
- Completing trader quests.
- Not completing enemy-trader quests (some quests decrement a rival trader).
- Insurance dealings.
- Fence rep via Scav karma (see below).

## Scav Karma

Separate metric tracking PMC behavior toward Scavs as PMC:
- **Positive**: playing friendly as Scav (don't kill other Scavs).
- **Negative**: kill fellow Scavs while playing as Scav; become hunted by AI Scavs.

Affects:
- AI Scav friendliness (positive karma: they ignore you briefly).
- Fence reputation (unlocks his best stock).

## Skills

~30 skills grouped by category:

### Physical
- Endurance: reduces stamina drain.
- Strength: sprint speed + throw range + carry weight.
- Vitality: bleed resistance.
- Health: HP regen.
- Metabolism: food/drink efficiency.
- Immunity: toxin / disease resistance.
- Stress Resistance: concussion recovery.

### Weapon
- AK / AR-15 / HK-416 / SVD / Pistol / Shotgun / LMG / DMR / Sniper / SMG / Bolt-action:
  - Recoil reduction.
  - Faster reload.
  - Reduced ergo penalty for sub-optimal builds.

### Combat
- Covert Movement: quieter footsteps.
- Search: faster container loot.
- Mag Drills: mag loading speed.
- Surgery: field-use surgery kits.
- Throwables: throw grenades straighter.
- Troubleshooting: reduce weapon jam chance.

### Utility
- Attention: spot loot highlighted.
- Charisma: trader discounts.
- Memory: key durability recall.
- Perception: hidden-object awareness.

### Special
- Crafting: Hideout production faster.
- Sniper training.
- Some "Elite" specializations at skill cap.

Skill progression:
- Level 0-51 = standard.
- Level 51 = **Elite** tier; unlocks special passive.
- Soft time-cap: "fatigue" reduces XP gain if you grind too long; resets on time.

## Quests

~400+ quests, gatekept by trader + level + prerequisite quests.

### Quest Structure
```
Quest: "Stirrup" (Prapor)
- Level required: 3
- Prerequisite: "Debut"
- Steps:
  1. Find 1 MP-133 pump-action shotgun (in-raid, i.e. "Found in Raid" tag).
  2. Hand it to Prapor.
- Rewards: 17,000 XP, 15,000 rbl, +0.01 Prapor rep.
```

### Quest Types
- Kill, Extract, Find-and-Hand-in, Visit, Place mark, Survive, Use specific weapon, Complete with specific restriction.

### Kappa Container Questline
- Long chain across multiple traders.
- Requires specific weapon kills, high rep, specific items.
- Reward: 3x5 Kappa Secure Container (largest personal insured storage).
- Considered Tarkov's "end-game."

### Wipe Skip
- Post-wipe (first month of fresh wipe): Battlestate offers quest skips for returning players. Catch-up mechanic.

## Hideout Progression

See [economy-design.md](economy-design.md). Tier 3 full Hideout requires:
- ~20+ Hideout modules at tier 3.
- Dozens of rare crafting items.
- Millions of roubles.
- Multiple days of real-time waiting.

## Unlockables per Trader

Each trader gates Hideout module parts, ammo tiers, high-tier attachments behind LL and quest completion.

Top-tier ammo (BS, 7N1, SNB, M62, M855A1, etc.) = LL3+ locked.

## Wipes

Seasonal wipes (~6 months):
- **Pros**: level playing field, exciting chaos, BSG tuning opportunity.
- **Cons**: total progression loss, demotivating for casual players.
- **Mitigation**: BSG offers "vet bonus" small perks to returning players.

Wipe announce: typically 2-4 weeks advance; final week is "dump everything" frenzy.

## Account Types

- **Standard**: base edition.
- **Left Behind**: +stash size.
- **Prepare for Escape**: larger stash, some starting items.
- **Edge of Darkness (EoD)**: max stash, max gear, lifetime DLC. Used to be bought once = all future content. **Discontinued 2024**; controversy as "lifetime" promise was softened.
- **The Unheard Edition** (EoD replacement): smaller stash, new starting items, **does NOT include all future content** — community backlash over BSG's broken lifetime promise.

## PVE Mode (2024)

New PVE (solo / co-op) mode:
- No other PMCs.
- Persistent progression within PVE world.
- Unlocked via specific editions.
- Different economy: certain trader trades disabled.

## Design Philosophy

Battlestate's progression:
- **Every raid matters**: no "grind to level up" endpoints; leveling is byproduct.
- **Knowledge is power**: map knowledge + ammo chart = progression above level.
- **Long cycle**: 1000-hour players still unlocking content.
- **Wipe resets**: prevents power creep, restores accessibility for new players.
- **Reputation is social capital**: affects NPC + economic access.

## Pacing Targets

| Milestone | Hours |
|---|---:|
| Level 15 (Flea unlock) | 30-60 |
| Level 30 | 150-200 |
| Level 50 | 400-500 |
| Kappa Quest Completion | 800-1500 |
| Full Hideout Level 3 | 600-1000 |

## Meta / Metacompetition

- Player stats tracked per account (kills, extracts, raid count).
- Leaderboards: seasonal per-wipe.
- Elo-style: kill/death ratio + XP/hour.
- Community tournaments + sponsored events.

## Rejected Designs

- **Season Passes / Battle Passes**: not in Tarkov; progression is the questline.
- **Auto-complete quest tracking**: BSG intentionally doesn't mark all quest objectives (find exact location yourself).
- **Account-transfer progression**: wipe applies to all accounts.
- **Pay-to-speed-up**: premium editions give items, not XP boosters.
