# Combat Design — Dead Cells

Dead Cells combat is **rhythmic 2D aggression**. Time to kill is fast on both sides — the player and enemies both die in 1–3 hits at the same power level.

## Damage Model

```
damage = weapon_base × (1 + scaling_stat × scaling_bonus) × affinity_bonus × crit_multiplier × difficulty_modifier
```

Where:
- **scaling_stat** = your current Red/Purple/Green scroll count.
- **scaling_bonus** = ~0.14 per scroll (weapon-specific).
- **affinity_bonus** = 1.0 for single-color; 0.75 each for dual-color; 0.5 each for triple.
- **crit_multiplier** = varies per weapon: e.g. "+150% on airborne enemy," "+60% on bleeding."
- **difficulty_modifier** = 1.0 at 0BC, 0.8 at 1BC, ..., scales player damage down at higher tiers.

## Status Effects

| Status | Effect | Common sources |
|---|---|---|
| Bleeding | ~10% of HP as DoT over 5s | Bleeding weapons (daggers) |
| Burning | 20% DoT over 3s | Fire mutations, grenades |
| Poisoned | 30% DoT over 5s | Poison weapons, Phaser skill |
| Frozen | disable for 3s | Ice bow, ice grenade |
| Stunned | disable for 1s | Heavy hits, parry |
| Targeted | crit multiplier active | Assassin's Dagger, Hemorrhage |
| Malaise | DoT on the player | 3BC+ difficulty effect |

Statuses stack duration, but damage doesn't multiply — a second poison application refreshes duration.

## Weapon Categories

### Main (Weapon slot 1 / 2)

- **Swords**: 3-hit combo, balanced.
- **Daggers**: fast, bleeding on critical strikes.
- **Whips**: long reach, short cooldown.
- **Bows**: ranged, crit on distance.
- **Crossbows**: charge → high crit.
- **Spears**: thrust + pull mechanic.
- **Two-handers** (axes/hammers): slow, stagger.
- **Shields**: passive block, active parry.
- **Turrets**: placed, auto-attack — freeing movement.
- **Grenades** (as weapon): thrown, AoE.

### Skill (Skill slot 1 / 2)

- **Grenades**: fire, ice, poison, stun, oil.
- **Turrets**: crossbow, flamethrower, bombard.
- **Powers**: Phaser (teleport), Homunculus (possess enemy), Tonic (heal).
- **Traps**: Scythe Claw (tripwire), Advanced Tesla Coil.

### Weapon Pools

At run start you pick a starting weapon; you find more via:
- Random drops from cursed chests (requires killing N enemies without taking damage).
- Blacksmith NPC (reroll stats).
- Biome-specific weapon shops.
- Legendary drops at higher Boss Cell tiers.

## Parry / Dodge Rules

**Dodge roll** (always available):
- Iframes 4–12 of 14-frame animation.
- No cooldown beyond animation.
- Iframes don't cancel DoTs already applied.

**Shield parry**:
- Hold shield button: blocks frontal melee + projectiles.
- Release within 8–12f of enemy attack: perfect parry — reflects projectile back doubled, stuns melee attacker.
- Perfect parry consumes 0 stamina; normal block consumes stamina meter (infinite regen when not blocking).
- Not all shields have perfect parry; some have auto-parry on hold (Rampart Shield).

## Enemy Design

Every enemy has:
- **Tell**: yellow outline or charged pose 0.5–1.0s before attack.
- **Hitbox**: matches visible sprite within ±4px.
- **Weakness**: some enemies are weak to specific damage types.
- **Patrol AI**: predictable until engaged.

Classes:
- **Trash mobs**: small HP, 1–2 hit kills, crowd-creators.
- **Elites**: scripted mini-bosses, purple glow, always readable telegraph. First elite per biome guaranteed.
- **Ranged**: zombies throwing, archers; need approach management.
- **Chargers**: telegraphed dash; parry-able.
- **Big mobs**: armored, staggerable via heavy hit or back-attack.

### Boss Designs

- **The Concierge** (Ramparts end): 2-phase, parry-taught fight.
- **Time Keeper** (Clock Tower): teleport patterns, time magic.
- **Hand of the King** (High Peak): final base boss, 3 phases, fist slam + sword sweep + rage.
- **Giant** (DLC): exposed weakpoints only.
- **Queen** (DLC): underwater phase + surface phase.
- **Dracula** (Castlevania crossover DLC): phase with distinct moveset per form.

All bosses have clear attack animations, no RNG "surprise" hits.

## Cursed Chests

Optional challenge: open a cursed chest → gain a powerful weapon → must kill N enemies (usually 10 or 20) without taking a hit → or die instantly.

Design intent: skill-gated high-reward content. Master players farm cursed chests for legendaries.

## Malaise (3BC+)

Taking too long on a biome triggers Malaise — a DoT that escalates. Forces faster play at higher difficulty. Kills a biome's worth of enemies "cures" part of the malaise.

## Combat Balance Philosophy

Motion Twin's balance target: **a player with any full build should complete the game at 0BC**. No build is useless; some are just more efficient. Variety > OP combos.

## Design Hooks for Modders

- Weapons are data: definition file specifies base damage, combo data, hit VFX, sfx.
- Status effects are data: name, icon, duration rule, damage per tick, stacking rule.
- Bosses have scripted behaviors that are modable via behavior trees (Evil Empire's tooling).

## Test Targets

- Every weapon feels viable at mid-game power (scroll stat = 10 each).
- Every boss pattern dodgeable without build-specific gear.
- Dodge roll iframes identical across all weapons / animations.
- Parry window ±1f across all shields.
- No "infinite stagger" combo that locks bosses.
