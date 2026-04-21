# Pokémon Role Design

Roster composition is the core design challenge. ~60+ Pokémon must each feel distinct, fit one of 5 roles clearly, and enable team-composition variety.

## Roles

### All-Rounder (Bruiser)

**Play pattern**: versatile; engage and sustain. Not the most durable, not the most damaging, but capable in most situations.

**Stats profile**: medium HP, medium damage, medium mobility.

**Signature**: signature move that gives them a short burst of damage + a defensive tool.

**Examples**: Charizard, Lucario, Dragonite, Garchomp, Machamp.

### Attacker (Mage/Marksman)

**Play pattern**: ranged; stay at the edge of fights, dish out damage.

**Stats profile**: low HP, high damage, low mobility.

**Signature**: one nuke ability + one escape tool.

**Examples**: Cinderace (ranged), Gardevoir (caster), Greninja (poke), Pikachu (AoE), Delphox.

### Defender (Tank)

**Play pattern**: soak damage for carries; peel; disrupt.

**Stats profile**: high HP, low damage, low mobility (usually).

**Signature**: big defensive/peel ability (Snorlax's Unite throws enemies away).

**Examples**: Snorlax, Blastoise, Mamoswine, Goodra, Trevenant.

### Speedster (Assassin)

**Play pattern**: flank, pick off a target, disappear.

**Stats profile**: medium HP, high burst, very high mobility.

**Signature**: dash or invisibility + execution threshold.

**Examples**: Zeraora, Talonflame, Gengar, Absol.

### Supporter

**Play pattern**: heal and buff teammates; control zones.

**Stats profile**: low HP, low damage, decent mobility + team utility.

**Signature**: heal/shield + CC abilities.

**Examples**: Wigglytuff, Eldegoss, Blissey, Hoopa (teleport), Mr. Mime.

## Design Principles

### 1. Role Clarity in First Match

A new player picking up Cinderace should understand in match 1: "I'm squishy ranged, stay behind tanks, poke." No wiki needed.

### 2. Archetype Variety Within Each Role

Two Attackers shouldn't play the same. Cinderace is a ranged marksman with a piercing shot; Gardevoir is an AoE caster; Greninja is a burst-poke with shuriken. Same role, different feel.

### 3. Signature Mechanics

Every Pokémon has **at least one** mechanical quirk:
- Zeraora's gap-close is also damage
- Blissey's heal also buffs allies
- Talonflame flies over terrain
- Cramorant regurgitates wild Pokémon as projectiles

### 4. Move Branching

Each Pokémon has **2 move slots**, each with **2 options** at level-up:
- Charizard's move 1 can branch to Flamethrower (range/DPS) or Fire Blast (zone)
- Move 2 similarly branches
- = 4 build variants per Pokémon → each plays slightly differently

### 5. Unite Move = The Moment

Unite Moves (ultimates) are the dramatic moments:
- Long cooldown (~90s+)
- High-impact effect
- Often team-fight-turning (Zapdos wipe, tank disengage)
- Must feel signature to the Pokémon

### 6. Counter-Play Matters

For every Pokémon, design the answer:
- Beat tanks (Snorlax) with kite + % HP damage
- Beat assassins (Zeraora) with CC + peel
- Beat supporters (Wigglytuff) with burst before heal lands
- Beat attackers (Cinderace) with mobility/gap-close

### 7. Mobile Readability

- Moves have clear targeting indicators on cast
- Unite Move is visually dominant (bright cinematic)
- Basic attacks are auto-target-friendly (tap to fire)

## Numerical Budget

Each Pokémon has a stat budget:
- HP: 3000–9000 (at max level)
- Basic Attack damage: 100–400
- Move damage: 400–2000 per cast
- Movement speed: 3500–4500

Higher in one axis = lower in another. A Defender like Snorlax has 8000 HP but 200 basic attack. A Speedster like Zeraora has 4000 HP but 4200 speed.

## Scaling Design

### Early game (Level 1–5)
- Basic Attack + 1 move
- Weak, all-rounders dominate
- Farming is key

### Mid game (Level 5–9)
- Full 2 moves + evolution
- Team fights begin

### Late game (Level 9+)
- Unite Move unlocked
- Attackers + All-Rounders scale hardest
- Supporters enable high-DPS carries

### Late-game Wind-Down
- 2-minute mark: Zapdos spawns; decides match
- This single objective often decides the win

## Balance Process

- **Telemetry**: winrate per Pokémon, per map, per role
- **Pick rate + winrate matrix**: high pick + high win = nerf; low pick + low win = buff or rework
- **Move usage**: which of the 2 branches is chosen? If always the same, balance the other or rework
- **Patches**: monthly balance patches adjust base stats, move values

### Balance Targets

- Each Pokémon's winrate: 45%–55% ideal
- 60%+: nerf
- Below 40%: buff

## Release Cadence

- **~1 Pokémon per month** on average
- Mix of classic + fan-favorite
- Event-timed releases (movie release → tied Pokémon)

## Onboarding New Players

- **Starter pool**: 5 beginner-friendly Pokémon free (Snorlax, Pikachu, Charmander, etc.)
- **Tutorial highlights one role clearly** (usually All-Rounder)
- Weekly free Pokémon rotation lets players try roles before committing
- **Training matches** before first ranked

## Anti-Patterns

- **Homogenized roster**: if two Attackers play identically → reduces roster meaning
- **Over-loaded kits**: Pokémon with 3+ active abilities are confusing on mobile
- **No counters**: a Pokémon with no losing matchup dominates the meta
- **Invisible mechanics**: a passive that's critical but not displayed visually
