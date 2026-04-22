# Combat Design — Hollow Knight

Combat is melee-first, Souls-influenced, read-and-react. Every swing is deliberate. The knight's nail is short-range, so commitment matters. Charms reconfigure combat identity — glass cannon, tank, caster, healer.

## Core Combat Loop

```
Observe enemy telegraph
→ Decide: engage, dodge, or parry
→ Strike (hit or miss commits 0.3-0.5s frames)
→ Manage Soul gained
→ Heal / spell / dodge depending on pressure
```

## Nail (Melee Weapon)

- **Primary attack**: X / LMB.
- **Damage**: 5 base → 9 (Sharpened) → 13 (Channeled) → 17 (Coiled) → 21 (Pure Nail).
- **Range**: short (about 2 sprite widths).
- **Swing frames**: 12-16 depending on upgrade; faster with higher nails.
- **Knockback**: pushes enemies back on hit.

### Directional Attacks

- **Horizontal**: default forward swing.
- **Upward** (↑ + attack): vertical reach; useful against flying enemies + for climbing jumps.
- **Downward** (↓ + attack): pogo; bounces player off impact for platforming + air control.

### Nail-Arts

Charged nail techniques (learned from Nailmasters):
- **Cyclone Slash**: spin attack hitting all around.
- **Dash Slash**: dash forward with damaging slash.
- **Great Slash**: large overhead arc.

Hold attack 1.3s → release to trigger chosen art. Can be chained with Nail-Arts charms.

## Spells (Magic)

Soul-consuming ranged attacks. Three lines:

### Fireball Line

- **Vengeful Spirit** (33 Soul): horizontal fireball.
- **Shade Soul** (upgrade): larger, more damage, homing.

### Dive Line

- **Desolate Dive** (33 Soul): plunge downward + radial shockwave; grants brief invulnerability.
- **Descending Dark** (upgrade): larger shockwave, longer invuln.

### Wraith Line

- **Howling Wraiths** (33 Soul): vertical cone upward.
- **Abyss Shriek** (upgrade): larger cone, more damage.

Spells cost 33 Soul each (a full vessel = 3 spells before Unbreakable Strength etc.).

## Soul System

Soul = both resource for magic AND healing:
- Hitting enemies → gain Soul (~11 per nail hit).
- Max capacity: 99 base; +33 per Vessel Fragment set.
- **Focus**: hold A/RMB 1 second to spend 33 Soul and restore 1 mask.
- Soul Vessels: once Soul Capacity overflows, you can still cast/heal ~33 more before depletion.

Focus makes offense = healing = same resource. Aggression rewarded with survival.

## Focus (Healing)

- Channel for ~1 second.
- Vulnerable during channel (can be interrupted by damage).
- Heals 1 mask (+1 if Quick Focus charm equipped).
- Positioning key: find lull, heal, re-engage.

Certain charms modify:
- **Quick Focus**: faster charge.
- **Deep Focus**: 2x heal, 2x cast time.
- **Spell Twister**: -24% spell cost.

## Mask System (HP)

- Start: 5 masks.
- Each mask shard: 1/4 of a mask; 4 shards = +1 mask.
- Max normal: 9 masks (from 16 shards total — completionist).
- Death at 0 masks → Shade left at location.

Lifeblood masks (temporary blue):
- From Lifeblood Core charm, Joni's Blessing charm.
- Lost first on damage; don't regenerate.

## Damage Taken

Enemies deal fixed damage per hit (usually 1-2 masks); some bosses 1 or 2 masks.

### Invincibility Frames

- Post-damage i-frames: ~30 frames.
- Dash i-frames (Mothwing Cloak): 6-8 frames during dash.
- Shade Cloak i-frames: extended + pierces light obstacles.

## Shade System

On death:
- All Geo left on ground as Shade.
- Shade spawns as ghost enemy at death site.
- Fight + defeat Shade → reclaim Geo + reload 33 Soul.
- If you die again before reclaiming, previous Shade vanishes, new Shade at new site, old Geo lost.

No XP loss, no level loss. Just money + pride.

## Dash Mechanics

Mothwing Cloak (Greenpath):
- Horizontal dash (8-12 frame cooldown).
- Short distance (3-4 knight lengths).
- 6-8 i-frames.
- Breaks momentum (useful for dodge).

Crystal Heart (Crystal Peak):
- Hold dash button → release for super-dash.
- Long horizontal range (until wall).
- Used for traversal + rare combat.

Shade Cloak (Abyss):
- Mothwing Cloak upgrade.
- Shadow-dash through lit obstacles (energy gates).

## Charms (Passive Modifiers)

45 charms; equipped at benches. Notch cost 1-4. Starting notches: 3 → 11 max.

### Combat Charms

- **Longnail** / **Mark of Pride**: nail reach+.
- **Unbreakable Strength**: nail damage +50%.
- **Quick Slash**: attack speed +.
- **Steady Body**: no recoil on hit.
- **Shaman Stone**: spells +.
- **Grubsong**: +Soul when damaged.
- **Fragile Heart / Unbreakable Heart**: +2 masks.
- **Fragile Strength / Unbreakable Strength**: +50% damage.

### Exploration Charms

- **Wayward Compass**: show on map.
- **Gathering Swarm**: Geo auto-pickup.
- **Shape of Unn**: heal while moving (crawl).
- **Dashmaster**: shorter dash cooldown + down-dash.

### Synergy Charms

- **Nailmaster's Glory**: faster nail-art charge.
- **Quick Focus + Dashmaster**: hit-and-run healing.
- **Spell Twister + Shaman Stone**: spell spam build.
- **Grubberfly's Elegy**: at full HP, nail swing emits ranged beam.

### Joni / Flower

- **Joni's Blessing**: +lifeblood masks, but disables Focus healing → glass cannon.
- **Grimmchild**: companion that attacks.

Charms create build variety; same knight plays differently depending on loadout.

## Boss Design Principles

### Telegraphed Patterns

Every attack has:
- **Tell**: visual wind-up or animation cue.
- **Active frames**: damage window.
- **Recovery**: vulnerability window for counter.

Watch → dodge → counter-attack.

### Phase Transitions

Bosses have phases triggered by HP thresholds:
- Phase 2: new attacks + faster patterns.
- Phase 3: desperation moves, tighter windows.

Phase transitions often invulnerable animation.

### No Reads on Player

Bosses don't cheat — patterns are fixed; player's skill improvement is the progression.

### Examples

- **Mantis Lords**: 3v1 at start, 1v1 at full HP. Telegraph dash, throw, drop. Classic "fair" boss.
- **Soul Master**: projectile + stomp + teleport. Window management.
- **Hornet 2**: fast + aggressive + tight windows.
- **Nightmare King Grimm (DLC)**: bullet-hell + dash-combos; brutal.
- **Radiance** (true final): 4 phases, bullet-hell patterns, narrow windows.

### Dream Bosses

- Lost Kin, White Defender, Soul Tyrant, Failed Champion: harder versions of earlier bosses.
- Rewards: essence + boss-specific lore.

## Nailmaster Training

- 3 Nailmasters scattered in map.
- Train for Nail-Art (one each).
- Purchase from Sly (shopkeep) for nail upgrades.

## Movement-Combat Sync

Combat and traversal blend:
- Pogo (down-attack on enemy/spike) extends air time.
- Wall-cling (Mantis Claw) enables jump-strike-jump chains.
- Dash-attack chains are valid combos.
- Super-dash can close distance to fleeing enemies.

## Colosseum of Fools

Three arena trials:
- **Trial of the Warrior**: basic waves.
- **Trial of the Conqueror**: mid difficulty.
- **Trial of the Fool**: endgame gauntlet.

Reward: Geo, charms, Pale Ore.

## Godhome (Godmaster)

Boss-rush pantheons:
- Pantheon of the Master (10 bosses).
- Pantheon of the Artist (12).
- Pantheon of the Sage (14).
- Pantheon of the Knight (20, hardest).
- Pantheon of Hallownest (42 bosses back-to-back).

Elite challenge for 100% players.

## Attunement / Bindings

Godhome-unlocked difficulty modifiers:
- **Bind Nail**: -50% damage.
- **Bind Charms**: no charms.
- **Bind Soul**: -33% soul cap.
- **Bind Shell**: -2 masks.

Full attunement = max challenge + max reward.

## TTK Reference

Normal enemies:
- Husk Bully: 1-2 hits (nail 1), 1 hit (nail 3+).
- Grub Mimic: 1-hit.
- Mantis Warrior: 3-4 hits.
- Miner: 2-3 hits.

Bosses:
- Mantis Lords: ~80-100 hits total all three.
- Hornet 1: ~20 hits.
- Soul Master: ~30 hits.
- Radiance: ~80-100 hits.
- Nightmare King Grimm: ~30-40 hits.

## Design Philosophy

### Melee Is Enough

No gun, no rifle — just a nail. Every boss is beatable with the starting nail. Upgrades and charms are flavor, not gate.

### Soul as Everything

Offense = defense = magic. One resource, many uses. Tension: heal now or spell now?

### Reward Risk

Getting close enough to hit = getting damaged. Pay-off: Soul + Geo + progress.

### Mastery Is the Product

Radiance is not "impossible." Every attack is dodgeable. Players who learn Radiance are materially better at the game. That's the whole point.

## Rejected Patterns

- **Auto-leveling enemies**: zero scaling.
- **Easy mode**: not in base game (some ports added).
- **Random damage ranges**: all damage is fixed.
- **Stamina bar**: no; player can dash/jump freely.
- **Microtransactions**: none ever.
