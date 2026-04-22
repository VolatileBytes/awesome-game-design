# Combat Design — Escape from Duckov

Combat is Tarkov's ballistic depth adapted for top-down solo play. Direct-aim feel with meaningful gun/ammo/armor interplay.

## Damage Model

### Bullets

Each bullet:
- **Caliber** (9mm, 5.56, 7.62, 12ga, .308, .50):
- **Damage base** (integer).
- **Penetration rating** (0-10 scale, simpler than Tarkov).
- **Armor damage %**.
- **Fragmentation chance** (simpler: binary or 0-30% chance).
- **Velocity** (mostly cosmetic; minor drop at long range).
- **Crit potential** (HP-bypass from headshot, accurate shots).

### Armor

Armor has:
- **Class (1-5)**: simpler than Tarkov's 6-class.
- **Durability** (HP of the armor).
- **Zones covered** (chest, chest+stomach, chest+stomach+arms for higher-tier).

Hit resolution:
```
roll_pen(bullet.pen, armor.class, armor.durability)
  → penetrated | partial | blocked
if penetrated:
    target_zone.hp -= damage * (1 - armor_reduction_factor)
    armor.durability -= armor_damage
elif partial:
    target_zone.hp -= damage * 0.5
elif blocked:
    target_zone.hp -= damage * 0.1    // bruise-through
```

### Body Zones (simpler than Tarkov)

4 zones:
- **Head** (~30 HP): instant kill on 0. Helmet buffs.
- **Torso** (~100-200 HP): main health pool.
- **Arms** (shared ~80 HP): if blacked, weapon accuracy debuff.
- **Legs** (shared ~80 HP): if blacked, speed reduced 50%.

Zone HP regenerates slowly when safe + fed; medkit heals specific zone.

### Bleed & Fracture

- **Bleed**: HP drip until bandaged.
- **Fracture**: speed -50%, needs splint.
- **Pain**: screen wobble effect; painkiller suppresses.

## Weapons

### Weapon Categories
- **Pistols**: compact, secondary, emergency.
- **SMGs**: 9mm / .45; high fire rate.
- **Shotguns**: close-range; pellet spread.
- **Rifles** (semi-auto + full-auto): 5.56 / 7.62.
- **DMRs**: precision semi-auto.
- **Snipers** (bolt-action): 1-shot potential on weak armor.
- **LMGs**: large mag, suppressive.
- **Heavy**: RPG, flamethrower (rare).

### Mod System

Weapons have modular slots: scope, barrel, stock, magazine, grip, rail. Each mod affects:
- Damage (barrel length).
- Accuracy.
- Recoil.
- Ammo capacity.
- Sound signature.
- Aim speed.

Find mods as loot; install at Workbench in base.

### Firing Mechanics

- **Semi / Auto / Burst**: fire modes.
- **Recoil**: increases during sustained fire, recovers between.
- **Spread**: direct aim at cursor; plus small weapon-cone.
- **ADS** (right-click): tighter cone, slower movement.
- **Reload**: tactical (quick) vs full (return mag contents).

## Movement

- **Walk / Run / Sprint**: stamina-gated.
- **Crouch** (Ctrl): smaller hitbox, tighter accuracy.
- **Dodge-roll** (Space): ~0.5s, brief iframes.
- **Weight**: affects stamina cap + sprint duration.

## Combat Flow Per Engagement

```
1. Detect enemy (mini-map / sight).
2. Decide: engage or avoid?
3. Position: use cover, avoid open lanes.
4. Shoot: peek, fire, duck back.
5. Reload when lull; ADS for precision.
6. Finish: loot or move on.
```

Top-down LOS rules mean you see roughly what's in your sight cone + minimap.

## AI Behaviors

### Grunts
- Patrol → alert → approach + fire.
- Hide behind cover briefly.
- Reload in cover.

### Tacticals
- Smart positioning.
- Flanking maneuvers.
- Grenades in groups.

### Specialists
- **Sniper**: long-range precision; laser sight telegraphs.
- **Heavy gunner**: LMG suppression; slow.
- **Medic**: heals allies; priority target.

### Bosses
- Unique mechanics per boss.
- Multiple phases (25%, 50%, 75% HP triggers).
- Telegraphed attacks.
- Scripted loot drops.

## Stealth & Suppressed Weapons

- Suppressors reduce enemy detection range.
- Enemies hear shots at 30-80m typical; suppressed halves that.
- Melee stealth kill: 1-shot if un-alerted.
- Line-of-sight blocked by walls / thick foliage.

## Grenades

- **Frag**: damage in radius.
- **Smoke**: obscure LOS.
- **Molotov**: fire area-deny.
- **Flashbang**: brief blind + stun.

## Meds & Healing

Med items:
- **Bandage**: stop light bleed.
- **Tourniquet**: stop heavy bleed.
- **Splint**: fix fracture.
- **Painkiller**: suppress pain for 30s.
- **Medkit**: heal HP on specific zone.
- **Surgery kit**: restore blacked zone to 1 HP.

All are consumables; time to use ~2-5 seconds (exposed).

## Death & Loot

On player death:
- Drop inventory at death point (except Secure Pouch).
- Return to Home Base.
- Death point loot can be retrieved... sometimes (some games: persistent corpse; some: loot lost).

Duckov retains a lighter approach — typically loot gone.

## TTK Examples

**Grunt Enemy (no armor, 100 HP)**:
- Pistol body: 3-5 shots.
- SMG body: 2-3.
- Rifle body: 1-2.
- Shotgun: 1 at close.
- Headshot anything: 1.

**Armored Enemy (Class 3, 150 HP)**:
- Pistol body: ineffective (ricochets).
- Rifle body: 4-6 shots.
- AP rifle: 2-3.
- Shotgun slug: 1-2.
- Headshot: 1-2 with pen.

**Boss (multi-phase, 1000 HP)**:
- Requires full loadout.
- Phase transitions protect from damage.
- Expect 2-5 minutes of fight.

## Balance Probes

- Mid-game raid death rate: ~20-30% (much lower than Tarkov's 70%).
- Single raid length: 10-15 min typical.
- Full campaign completion: 30-50 hours.
- Bosses killed per hour: ~1 (gated by zone unlock).

## Design Philosophy

### Tarkov lite

Retains:
- Inventory grid.
- Bullet-vs-armor nuance.
- Extraction mechanic.
- Long-term progression.

Trims:
- No PvP (no troll-killer stress).
- Simpler health (4 zones).
- Simpler ammo types.
- Auto-save per raid.
- Insurance lite.
- Shorter raids.

### Solo-first

No squad coordination; everything solo-tunable:
- Difficulty scales with unlocked zones.
- Bosses scale to player level.
- Multi-player co-op is sometimes teased but not primary.

### Duck Flavor

Humor doesn't undercut tension:
- VO is deadpan quacks.
- Environments are gritty despite cartoon characters.
- Weapons are real-world referenced but named ducky-ly ("QuackHK", "AKduck").

## Rejected Patterns

- **PvP raids**: scope creep; single-player experience.
- **Permadeath campaign**: would frustrate; raid-only death instead.
- **Grindwall loot**: respects player time.
- **Microtransactions**: single-purchase premium.
