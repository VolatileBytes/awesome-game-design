# Combat Design — Counter-Strike

## Core Damage Loop

```
1. Player fires (tick T).
2. Server traces a ray from camera position along aim vector (+ recoil + inaccuracy offset).
3. First hitbox intersected along ray = target.
4. Calculate damage: base_damage × hitgroup_multiplier × (1 - armor_reduction) × distance_falloff.
5. Apply to target HP. If ≤ 0 → death, award kill.
6. Server broadcasts hit event (blood, damage number, hit sound).
```

## Damage Formula

```
raw_damage = weapon.base_damage
hitgroup_mult = {head: 4.0, chest: 1.0, stomach: 1.25, arm: 1.0, leg: 0.75}
after_hitgroup = raw_damage × hitgroup_mult

if has_armor and (hitgroup in {chest, stomach, arm}):
    armor_reduction = weapon.armor_penetration
    after_armor = after_hitgroup × (1 - armor_reduction)
    armor_hp -= after_hitgroup - after_armor (subject to cap)
else:
    after_armor = after_hitgroup

distance_falloff = compute_falloff(weapon.falloff_curve, distance)
final = floor(after_armor × distance_falloff)
```

Example: AK-47 headshot at 10m with helmet → 143 dmg → one-shot kill.

## Weapon Attributes

Each weapon definition holds:

```
WeaponDef {
  class_name: "weapon_ak47"
  slot: primary | secondary | grenade | knife
  type: pistol | smg | rifle | sniper | shotgun | heavy
  base_damage: int
  armor_pen: float (0-1)
  fire_rate: rpm
  movement_speed: 210 (typical for rifle = slow)
  magazine: int
  reserve_ammo: int
  reload_time: float (seconds)
  switch_time: float
  accuracy_stand: float (radians of cone)
  accuracy_crouch: float
  accuracy_move: float  // typically huge
  accuracy_jump: float  // typically unusable
  recoil_pattern: Vec2[] (N-bullet first-spray pattern)
  recoil_recovery_rate: degrees/sec
  penetration_power: int
  price: int
  kill_reward: int
}
```

## Spray Pattern

Each weapon has a **deterministic recoil pattern** for the first N bullets (N ≈ magazine size). Sprayed, the gun draws a memorizable curve on-screen. Pros memorize the inverse (counter-spray) to compensate.

After bullet N, some random jitter is added.

```
recoil(n) = pattern[n] + small_random_jitter(n)
```

## Shot Types

### Tap Fire
Single bullet. Full first-shot accuracy. Most accurate way to shoot at distance.

Prerequisites:
- Must be standing still (counter-strafe first).
- Crouching further tightens.

Fire rate: limited by trigger discipline (6-8 shots/sec sustainable).

### Burst Fire
2-4 shots. Mid-range. Exploits low-index spray (predictable).

### Full Spray
Entire magazine. Close-range or suppression. Requires recoil control (dragging mouse along inverse-pattern).

### Scope (AWP / SSG)
- Unscoped AWP: shotgun-random.
- Scoped AWP: 115 dmg body shot one-shot kill. One-shot-headshot-kill from anywhere.
- Scope-in time: ~0.15s. Quick-scope is a nerfed behavior (not accurate on-scope-transition).

## Accuracy States

| State | Accuracy | Notes |
|---|---|---|
| Still + crouched | max | |
| Still + standing | ~95% max | |
| Walking (shift) | ~80% | silent |
| Running | near-zero | spray goes everywhere |
| Jumping | near-zero | jump-peek is info, not kill |
| Landing | 0.2s penalty | "jump-landing inaccuracy" |

**Counter-strafe**: the skill of tapping the opposite direction to instantly cancel velocity, so the first bullet fires as-if-still.

## TTK Examples

All with no armor:
- AK body (rifle, rifle distance): 2 body shots.
- AK headshot: 1 shot kill.
- M4A4 body: 3 body shots.
- AWP body: 1 shot (unscoped lottery).
- Deagle body: 2 shots.
- Deagle headshot: 1 shot.

Helmet blocks headshot one-shots from some weapons (P250, Glock, USP-S — these can't one-shot-kill even with helmet).

## Penetration

Bullets pierce walls. Each surface has a **penetration cost**:
- **Wood**: low.
- **Drywall**: low.
- **Brick**: medium.
- **Concrete**: high.
- **Metal**: high.

Damage reduces per wall. AWP/Auto-snipers have high pen; pistols have low pen. "Wallbanging" known spots is pro-level map knowledge.

## Utility (Grenades)

| Grenade | Role |
|---|---|
| HE | 57 damage, splash ~5m |
| Flash | blinds enemies looking at detonation (up to 5s) |
| Smoke | 18s LOS blocker, ~6m radius |
| Molotov/Inc | 7s area denial, 40 dps |
| Decoy | plays random gun-fire sound for 45s |

Grenade throws:
- **LMB**: full throw.
- **RMB**: underhand (close).
- **LMB+RMB**: lob (medium).
- **Grenade lineups** (map-specific spots from which a throw lands perfectly) are memorized per map.

## Bomb Mechanics (T side)

1. Carrier goes to site A or B.
2. Stands in site; holds **E** for 3.2s to plant.
3. Bomb beeps every 2s; beeps faster as timer ticks down.
4. **Fuse**: 40s (CS2 / CS:GO), 35s (1.6).
5. Detonation: kills in radius; 1000+ damage at epicenter.

## Defuse Mechanics (CT side)

1. Stand on bomb; hold **E**.
2. No kit: 10s. With kit: 5s.
3. Kit costs $400; carried between rounds if survived.

## Round End Conditions

- **T win**:
  - All CTs dead.
  - Bomb detonates.
- **CT win**:
  - All Ts dead (pre-plant).
  - Bomb defused.
  - Regulation time expires with no plant.

## Hostage Mode (rare)

- CT rescues hostages by leading them to exit zones.
- Relegated to casual; ~never comp-played.

## Tick & Hit Registration

- **CS:GO**: 64/128 tick.
- **CS2**: "subtick" — inputs are stamped to sub-tick time; the server resolves the shot at exactly when the trigger was pulled, not at tick boundaries.
- **Lag comp**: server rewinds world to client-perceived state up to 200ms; hits registered if target was there then.

## Balance Probes

- Every weapon should have a niche: rifles dominate mid-range, AWPs lock long angles, SMGs punish eco, pistols anchor pistol/force rounds.
- TTK should be "lethal but not instant" — 1-3 bullets for rifles at rifle range.
- Utility should bend engagements, not replace them: a good smoke creates a 50/50, not a free kill.
- Map timings should yield ~25/75 T-side first-contact probability on mid-vs-long chokepoints.

## Anti-Pattern (rejected by Valve)

- **Sprint button**: would break counter-strafing.
- **Respawn in-round**: breaks round integrity.
- **Random bullet deviation on still shots**: breaks precision-over-reflex.
- **Scope sway**: breaks AWP clarity.
- **Hitmarker sound (confirmed kill)**: exists minimally; death sound is the confirmation.
