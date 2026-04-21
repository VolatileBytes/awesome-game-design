# Progression Design

## XP Curve

XP per level follows a mildly super-linear curve. Targets:
- Level 1 → 2: near-instant (≤5 seconds of kills)
- Level 10: reached around 2–3 minutes
- Level 30: reached around 10 minutes
- Past level 50 the curve flattens so the player is still drafting after minute 20

Exact numbers are tunable. The shape that matters: fast-fast-fast in the first 90 seconds (to get the player past the "bare character" phase), then steady, then flattening so mid-to-late picks still happen.

### Gem Tiers

- **Blue gem** (regular enemy drop): 1× XP
- **Green gem** (occasional drop / weaker elite): ~5× XP
- **Red gem** (elite/boss drop, guaranteed from chests): ~25× XP

Gem values scale with the `Growth` passive.

## Level-Up Draft

On level-up the game **pauses**. The player is shown **3 cards** drawn from a weighted pool. They pick one.

### Card Pool

On draft, the pool is the union of:
1. Equipped weapons not yet at max level → a level-up card
2. Equipped passives not yet at max level → a level-up card
3. Weapons not yet equipped, if fewer than 6 are equipped → a new-weapon card
4. Passives not yet equipped, if fewer than 6 are equipped → a new-passive card
5. Always available: a **Skip** card that grants a tiny heal and refunds nothing
6. Sometimes: a chest card (grants 1–5 random weighted level-ups via a slot-machine animation)

### Weighting

- **Starter weapon** of the character gets a higher weight in early draws (ensures it ramps fast)
- **New weapons/passives** get boosted weight until the player has 3 equipped (so builds coalesce quickly)
- **Evolution prerequisites** (passive level 1+) should be preferentially offered once the corresponding weapon is at level 4+, so the player isn't accidentally locked out of their evo

### Banish & Reroll

Earned through meta-progression. Stocks are replenished per run.
- **Reroll:** discard the current 3 cards, draw 3 new ones. Stock reduces by 1.
- **Skip** (separate from the "Skip" card): in some modes, treat the current draft as voluntary skip for a small heal.
- **Banish:** permanently remove a weapon/passive from the pool for this run. Powerful for locking evolution paths.

## Weapons

### Levels

Each weapon has **8 levels**. Each level bumps one or two core stats:
- Damage
- Area / size
- Projectile count / number of attacks
- Cooldown (lower is better)
- Duration (how long the projectile lives)
- Knockback / pierce / chain

Rule of thumb: **odd levels bump damage or count**; **even levels bump range or duration**. This keeps every level-up visible in play.

### Evolution Trigger

At weapon level 8 + paired passive at level 1+ + open the next chest → the chest **replaces** the weapon with its evolved form.

- Evolution does **not** free a slot (the evolved weapon sits in the same slot)
- Evolution does **not** consume the passive (the passive stays in its slot at its current level)
- The evolved weapon is typically **2–3× stronger** than the maxed base, and often changes firing logic entirely (e.g. Whip → "long, wide, instant sweep" vs Bloody Tear → "pierces, heals on crit")

### Archetype Balance Per Build

A survivable build typically covers **at least two of**:
- **Contact / close arc** (whip, garlic aura, sword)
- **Orbiting / passive area** (holy water, Bible, lightning ring)
- **Ranged / homing** (wand, runetracer, knife)

Monotype builds work only if they cover the angle of attack. A pure-forward build dies to enemies spawned behind.

### Example Weapon Table (representative)

| Weapon | Archetype | Evolves With | Evolved Form |
|---|---|---|---|
| Whip | Forward arc | Hollow Heart | Bloody Tear |
| Magic Wand | Homing | Empty Tome | Holy Wand |
| Knife | Forward piercing | Bracer | Thousand Edge |
| King Bible | Orbit | Spellbinder | Unholy Vespers |
| Garlic | Aura | Pummarola | Soul Eater |
| Santa Water | Area lock | Attractorb | La Borra |
| Fire Wand | Homing fire | Spinach | Hellfire |
| Lightning Ring | Random strike | Duplicator | Thunder Loop |

This is a representative shape, not an exhaustive list. Real implementation should ship with 8–12 base weapons at minimum to give the level-up draft variety.

## Passives

6 slots, 5 levels each. Each passive multiplicatively or additively stacks a global stat:

| Passive | Scales |
|---|---|
| Might | Damage (×) |
| Armor | Flat damage reduction |
| Max Health | HP ceiling |
| Recovery | HP regen per second |
| Cooldown | Weapon cooldown (multiplicative reduction) |
| Area | Projectile/aura size |
| Duration | Projectile lifetime |
| Speed | Player movement speed |
| Luck | Chest quality / rare gem rate |
| Growth | XP gained per gem |
| Greed | Gold gained per pickup |
| Magnet | Pickup radius |

Luck, Growth, Greed, and Magnet are meta-compounders — they make all other picks better. Including them early yields higher total build power; skipping them trades stability for raw stat picks.

## Arcana

Scripted in-stage pickups. **Up to 3 per run.** Each arcana is a significant, sometimes build-defining modifier. Examples:
- "Gemini: the first pick every draft is duplicated for this run"
- "Heart of Fire: all weapons deal fire damage; fire damage ignites the ground for 2s"
- "III Tragic Princess: weapon damage scales with current Luck"
- "XVIII Boogaloo of Illusions: projectile speed inverts (slower = more screen presence)"

Arcana pickups are **fixed to spawn positions** on a stage, not random drops. They should sit on the path the player will naturally be pushed to by waves, so the choice is reward-for-exploration, not scavenger hunt.

## Chest Level-Up Animation

Chests open into a slot-machine of 1–5 weighted level-ups. The animation is deliberately slow (~3–5 seconds) because:
- It is a **reward moment**. Slowing it down amplifies the feel.
- It gives the spawn table a breath — the game pauses, the screen clears, the player exhales.
- It is the evolution trigger moment — the reveal of an evolved weapon should be **celebrated** (screen flash, sound sting, name card).

Skippable via input — the result is the same.

## Difficulty Shape

The canonical difficulty curve of a run:
- **0:00–2:00** — fragile. One build away from death. Tension: high.
- **2:00–8:00** — compounding. Evolutions not yet online. Tension: medium.
- **8:00–20:00** — power fantasy. Most builds have evolved. Tension: low.
- **20:00–30:00** — re-tension. Spawn tables ramp hard (screen-filling hordes, elite mobs). Tension: medium-high.
- **30:00** — The Reaper. Intended death.

If playtesting shows the power-fantasy plateau is *boring* rather than *satisfying*, inject scripted pattern waves (skull rings, bullet-hell lines) instead of raising HP numbers. HP inflation feels bad; pattern threats feel fair.
