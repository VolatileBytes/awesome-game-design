# Operator Design

Arknights has 200+ Operators. The design is **class-driven with sub-archetypes** — making Operators distinct without proliferating genre-breaking mechanics.

## Operator Anatomy

| Field | Role |
|---|---|
| **Class** | 1 of 8 (Vanguard, Guard, Defender, Sniper, Caster, Medic, Supporter, Specialist) |
| **Sub-archetype** | e.g., "Arts Guard", "Fast-Redeploy Specialist" |
| **Star Rarity** | 1–6★ |
| **HP / ATK / DEF / RES** | Base stats |
| **Attack Speed** | Attacks per second (normalized 1.0 base) |
| **Block Count** | How many enemies this unit stops (0, 1, 2, or 3) |
| **DP Cost** | Resource to deploy |
| **Redeploy Time** | Seconds before can be redeployed after retreat |
| **Range** | Tile pattern showing attackable tiles |
| **Skills** | 1–3 active abilities |
| **Talents** | 1–2 passives |
| **Modules** | (Endgame) equipment-like boost |

## Class + Sub-Archetype Matrix

### Vanguard (Generate DP)

| Archetype | Signature |
|---|---|
| Pioneer | Gain DP on kill |
| Charger | High DP gen but ends early (self-retreat) |
| Standard-Bearer | Gain DP over time while deployed |
| Agent | Deals damage + gains DP |

### Guard (Melee DPS)

| Archetype | Signature |
|---|---|
| Dreadnought | High single-target damage |
| Lord | Hits at range 2 tiles |
| Swordmaster | Dual-blade; fast attack |
| Musha | Self-healing |
| Arts Guard | Does Arts damage (magical) |
| Liberator | Powerful skills, weaker base |
| Crusher | AoE melee |

### Defender

| Archetype | Signature |
|---|---|
| Protector | High HP/DEF, pure tank |
| Guardian | Heals nearby allies (AoE heal variant) |
| Duelist | Attacks back with force |
| Fortress | Ranged defender (shoots over wall) |
| Arts Protector | Arts damage tank |

### Sniper (Ranged DPS)

| Archetype | Signature |
|---|---|
| Marksman | Fast, single-target, DPS |
| Heavyshooter | Slow, hard-hitting vs armor |
| Deadeye | Prioritizes weakest enemy |
| Artilleryman | AoE explosive |
| Besieger | High burst vs single target |

### Caster (Ranged Arts)

| Archetype | Signature |
|---|---|
| Core Caster | Balanced damage + range |
| Splash Caster | AoE arts damage |
| Mystic Caster | Delayed burst |
| Chain Caster | Hits multiple in a row |

### Medic

| Archetype | Signature |
|---|---|
| Core Medic | Single-target heal |
| Multi-Target Medic | Heal multiple |
| Therapist | Heals over time |
| Incantation Medic | Deals damage while healing |

### Supporter

| Archetype | Signature |
|---|---|
| Decel Binder | Slows enemies |
| Hexer | Debuffs enemies |
| Bard | Buffs allies |
| Summoner | Summons minions |
| Abjurer | Shields allies |

### Specialist

| Archetype | Signature |
|---|---|
| Push Strategist | Pushes enemies off tiles |
| Pull Strategist | Pulls enemies |
| Fast-Redeploy | Short redeploy cooldown; reusable |
| Executor | Damage based on missing HP |
| Ambusher | Invisible until attacked |
| Trapmaster | Places traps |
| Dollkeeper | Revives when killed |

## Design Principles

### 1. Class Readability

Looking at an Operator's class + sub-archetype should tell a player ~80% of how to use them. "Oh, this is a Caster/Splash Caster — she's AoE arts damage for grouped enemies."

### 2. Skill Identity

Every Operator has a **signature skill** that defines them:
- SilverAsh (Guard, 6★): S3 is a massive line attack
- Eyjafjalla (Caster, 6★): S3 is AoE + armor ignore
- Exusiai (Sniper, 6★): S3 is attack-speed burst
- Rosa (Sniper, 6★): S3 is sniper killshot on priority target

A skill's identity is what gets remembered and used.

### 3. Role Niches

Every Operator fills a **niche**. Two 6★ Snipers don't do the same thing. Ash (Marksman) is standard fast DPS; Rosa (Besieger) is slow but massive; Exusiai is rapid-fire; Rosmontis uses Arts.

### 4. Trade-offs

High-star doesn't always mean better. A 3★ Vanguard (Fang) is still the cheapest DP generator and outperforms a 5★ Vanguard in DP-output per-Sanity. Niche utility matters.

### 5. Rarity-Appropriate Complexity

- 1-3★: simple, one-role, easy to understand
- 4-5★: slightly more complex, 2 skills
- 6★: most complex, 3 skills, often unique mechanics

## Talent Design

Talents are passives. Examples:
- "When deployed, ATK is increased by X%"
- "Arts damage against enemies with >X DEF is increased"
- "When an ally is within range, gain HP regeneration"

Talents **upgrade** with Elite Promotion (E1 → E2).

## Module System

Modules are **endgame equipment** unlocked at E2 + max level:
- Each Operator has 1–2 Modules
- Modules boost stats + upgrade a talent
- Module level 1–3 (higher = better boost)

This is the **endgame progression** after maxing the Operator.

## Operator Release Cadence

- **~2 new 6★ per month** via events + banners
- New sub-archetypes introduced regularly
- Limited/Collab Operators: once per quarter

## Balance Philosophy

- **No power creep** (officially) — new 6★ shouldn't straight-up beat older ones
- Niche-based balance: new Operators get new mechanics, not just bigger numbers
- Buffs to old Operators happen via Modules (direct buff path without reworks)
- Nerfs to live Operators are extremely rare (player trust)

## Lore Integration

Every Operator has:
- **Character file** (unlockable docs as you level/trust them)
- **Voice lines** (30+ lines) — deploy, retreat, skills, idle
- **Home scene** (tap them in Dormitory for dialogue)
- **Relationship rank** (Trust level): higher = more files + 2–3% stat boosts

Lore is a major part of the game's appeal; characters have depth beyond gameplay.

## Anti-Patterns

- **Generic filler Operators**: if a new 6★ feels like a rehash, players complain
- **Over-punishing mechanics**: an Operator that hurts its team is a bad design
- **Tutorial-hostile uniques**: rare mechanics need clear documentation
- **Unclear "best use"**: players should know when to deploy an Operator
