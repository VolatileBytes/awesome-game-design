# Progression Design

Arknights has multiple progression tracks — some per-Operator, some account-wide.

## Sanity (Stamina)

- Stages consume **Sanity** (typically 6–30 per run)
- Sanity refreshes over time (1 per 6 minutes)
- **Cap**: increases with player level (81–135 typical)
- Sanity is the **core gating mechanism** — you can't infinite grind

## Player Level

- Leveling up refills Sanity (bonus burst)
- Increases Sanity cap
- Unlocks base modules / features
- Max level ~125 (extends with updates)

## Operator Progression Axes

### 1. Level
- Each operator levels from 1 to max (40/55/70 depending on star)
- XP from Exp Cards (farmed from specific stages)
- LMD currency required per level

### 2. Elite Promotion (E-rank)
- **E0 → E1 → E2**
- E1 at max level 1: unlocks level cap 50–70
- E2 at max level 2: unlocks cap 70–90 + Skill 3 (for 5/6★) + enhanced talent
- Each promotion costs:
  - LMD (100k+ for E2)
  - Level cap materials (specific mats from stages)
  - LMD scales with star rarity

### 3. Skill Level
- Skills level 1–7 via Skill Books (common materials)
- E2-unlocks: **Mastery 1, 2, 3** — special mats required (rare)
- Mastery 3 = top-tier skill; the unlock step matters for competitive play

### 4. Module (Endgame)
- E2 level-60+ Operators unlock **Modules** — equipment granting stat + talent upgrades
- Module stages introduce specialty mats
- Module levels 1–3

### 5. Potential (from duplicate pulls)
- +1 through +6 from duplicates (or specific tokens)
- Each potential: small stat boost, deployment cost reduction, or utility unlock

## Base (Infrastructure)

### Rooms
- **Factory**: produce materials (LMD, EXP cards, combat records)
- **Trading Post**: trade materials for LMD
- **Power Plant**: produce power (required for other rooms)
- **Dormitory**: Operators rest here; restores morale
- **Office**: generate clues for Clue Exchange
- **Workshop**: craft materials
- **Reception**: accept/send clues to friends
- **Control Center**: global base buff

### Operators in Base
- Assign Operators to rooms for bonuses
- Each has base skills (distinct from combat skills)
- Synergies: certain Operators boost specific rooms

### Base Progression
- Level rooms via Workshop mats
- More rooms unlock as player levels up
- **Offline income** — base produces while you're offline

## Annihilation Mode

Wave-based defense against 100–400 enemies:
- Weekly rewards (Orundum for gacha)
- Level cap grants more reward per clear
- Auto-deploy once cleared

## Integrated Strategies (Roguelite)

- Procedurally assembled runs
- Pick Operators from a limited pool, gain Recruitment Vouchers, encounter random events
- Seasonal/rotated modes with themed mechanics
- Rewards: long-term milestones + seasonal currency

## Events

- Major events every ~3 weeks
- Story chapter + new Operators + event rewards
- Shop to exchange event currency → rewards
- **Limited Time Return** — some events return periodically

## Daily Missions
- 3–5 daily tasks
- Rewards: Sanity, Recruit Permits, LMD
- Weekly missions aggregate daily progress

## Monthly Missions
- Monthly task list with bigger rewards (premium currency tiers)

## Monthly Card / Pass

See [economy.md](economy.md).

## Story Progression

- **Main Story**: chapters 1 → N, sequentially unlocked
- Each chapter: 10–20 stages + side content
- Story gating encourages deliberate pacing (not binge)

## Recruitment (Separate Gacha)

- Players can spend "Recruitment Permits" (earned, not purchased) to hire Operators via a tag-based system
- Pick **tags** (attributes like "AoE Damage", "Senior Operator")
- Wait 1–9 hours (can use Expedited Plans)
- Results biased toward selected tags
- Rare tags = 5–6★ guarantees (secret knowledge: certain tag combos guarantee top-star)

## Anti-Patterns

- **Stamina too restrictive** → players can't progress → churn
- **Operator power creep** → old operators become useless → players frustrated they leveled them
- **Mat gating with unclear farming paths** → players don't know what to farm
- **Skill mastery RNG** → not in Arknights; mats are deterministic, just plentiful-cost

## Onboarding

- **Prologue + Chapter 1**: ~20 stages, teaching deployment, classes, elite promotion
- **Free 5★ selector**: gifted after tutorial
- **Starting banner**: boosted 6★ rate for new players
- **Daily login rewards** front-loaded in first 14 days
