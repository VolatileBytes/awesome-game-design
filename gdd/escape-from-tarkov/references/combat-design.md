# Combat Design — Escape from Tarkov

Ballistics are the genre-defining feature. More detailed than arcade shooters; less than hardcore sims like ARMA. The sweet spot is "realistic enough to require thought, simplified enough to not chart-check mid-fight."

## Damage Model

### Bullet Physics

Each bullet has:
- **Caliber** (5.45x39, 9x19, .308, etc.).
- **Round type** (FMJ, HP, AP, Tracer, Subsonic).
- **Base damage**: integer.
- **Penetration power**: float (0-80).
- **Armor damage**: %/shot applied to armor durability.
- **Ricochet chance**: float.
- **Fragmentation chance**: float (breaks into shrapnel on soft tissue).
- **Velocity**: m/s (affects drop + suppressor velocity loss).
- **Recoil kick**: per-round.

### Armor

Armor has:
- **Class (1-6)**: higher = more protective.
- **Durability**: degrades per hit.
- **Zones covered**: full vest vs chest-only vs chest+stomach.
- **Material** (Aramid, UHMWPE, Steel, Ceramic, Titanium): different degradation rates.

Each shot:
```
pen_roll(bullet.pen_power, armor.class, armor.durability_current)
  → penetrated | blocked | ricochet | partial
if penetrated:
    target_zone.hp -= bullet.damage * (1 - armor_mitigation)
    armor.durability -= bullet.armor_damage
    fragmentation? spawn 2-3 fragments into adjacent zones
```

### Hit Zones

7 zones: Head, Thorax, Stomach, Left/Right Arm, Left/Right Leg.

Each has:
- **Max HP** (35, 85, 70, 60, 60, 65, 65).
- **Current HP**.
- **Bleed state** (none / light / heavy).
- **Fracture state** (bool).
- **Painkiller cooldown**.

When zone → 0 HP:
- Head: instant death.
- Thorax: instant death.
- Stomach: blacked → massive damage-amplification debuff to torso hits; survivable.
- Arm: blacked → tremor, weapon ergo trashed.
- Leg: blacked → can't run; pain limp.

**Blacked zones** take 1.5x damage.

### Bleed

- **Light**: -1 HP/s from random zone.
- **Heavy**: -5 HP/s from specific zone; will kill if untreated.

### Fracture

- Can't run.
- Needs splint / Survival kit.
- Ibuprofen helps movement but doesn't heal.

### Painkillers

- Take pill / stim (10-30s effect).
- Suppresses pain tremor + concussion effects.
- Addiction (mild stat debuff) on repeated use.

## Weapon System

### Mod System

Every weapon has **slots** for modification:
- Barrel, Handguard, Stock, Grip, Trigger, Receiver, Mags, Scope, Rail attachments, Muzzle, Tac device.
- Each slot has compatibility with specific mods.
- Mods modify weapon stats:
  - Ergonomics (affects aim speed, sway).
  - Vertical/horizontal recoil.
  - Accuracy.
  - Sight type.
  - Velocity (barrel length).
  - Weight.

Custom builds often have 10-20 attachments. "Gun builder" is a meta-game.

### Firing

```
On trigger pull:
1. Check fire mode (semi/auto/burst/safe).
2. Check chamber: round loaded?
3. Check malfunction state (jam, misfire, failure to feed).
4. Spawn bullet projectile with ballistics.
5. Apply recoil to view.
6. Play audio (suppressed vs unsuppressed).
7. Eject casing (visual + audio).
```

Malfunctions happen proportional to weapon wear + bad ammo. Fix via `Shift-T` clear-drill.

### Recoil Model

- Vertical + horizontal components.
- Increases per shot; partially recovers between shots.
- Attachments reduce (compensator, tall grip, heavy stock).
- Shooting from crouch/prone reduces further.

### Accuracy

- MOA base spread.
- Sway adds to effective spread while aiming.
- Holding breath (`Shift`) reduces sway; drains stamina.
- High-tier skills reduce sway more.

### Ammo Management

- Mags are **items**: you must load rounds into mag in inventory (or use pre-loaded mags).
- In-raid reload is tactical: pull fresh mag (fast) vs reload-to-fill current mag (slow).
- Drop-mag on reload keeps mag on ground (discardable).
- "Press T" to check rounds remaining in mag — approximate count only.

## Movement

- **Stance**: stand, crouch (1-5 scroll adjustable), prone.
- **Speed**: scrolling mouse wheel or `WASD+Shift` cycles walk speeds (1-7 discrete).
- **Weight** > ~60kg: sprint impossible.
- **Stamina**: arm stamina (hold weapon ADS) vs leg stamina (sprint).
- **Lean**: Q/E tilt peek, minimal body exposure.
- **Vaulting**: mantle low walls, windows (slow).
- **Sprint exit**: stops immediately but has landing inaccuracy penalty.

## Audio as Combat Tool

- **Unsuppressed rifle shots** audible 300-500m.
- **Suppressed subsonic** rifle shots: 50-100m.
- **Footsteps** 20-30m (running, heavy kit).
- **Walking slow**: 2-5m audible.
- **Crouching-walk**: nearly silent.
- **Mag swap**: 5-10m audible.
- **Switch weapons**: audible 5-8m.

Suppressors (silencer): reduce sound signature class by 1-2 tiers. Tactical advantage critical.

## Engagement Doctrine

### Open-world combat
- Distant shots audible → other players triangulate.
- Once shots fire, map becomes 'alerted'.
- Stay and loot → be ambushed. Move → be hunted.

### CQB (close quarters)
- Prefer suppressed weapon.
- Use grenades to flush rooms.
- Lean + peek; minimize body exposure.

### Long range
- DMR / bolt-action for 200m+.
- Scope + tall grip for precision.
- Breath-hold for accuracy.

## Grenades

- **Frag (F-1, M67)**: high damage, 4-5s fuse.
- **Stun (Zarya)**: flashbang, stun + disorient.
- **Smoke**: area-deny, LOS-block.
- **Incendiary**: fire zone.

Throw arc: physical; can bounce off walls. Misthrown nades end you.

## Melee

Rarely optimal; knife slot:
- Standard knife.
- Bayonet.
- Rare melee weapons (boss drops).

Backstab can one-shot; realistic in tight rooms.

## AI Enemies (Scavs / PMCs)

### Scavs
- Random loadout: pistol, shotgun, AK, sometimes DMR.
- Spawn in clusters.
- Patrol, react to noise, engage at distance.
- AI "awareness" ramped after dev patches.

### Raiders
- Elite; tac equipment, use grenades, smart flanks.

### Rogues
- Elite USEC turn-enemy; Lighthouse.

### Boss + Guards
- Named bosses per map: Reshala (Customs), Killa (Interchange), Glukhar (Reserve), Shturman (Woods), Sanitar (Shoreline), Tagilla (Factory), Kaban (Streets), Cultist leader (spawns on any map at night).
- Each has unique weapon + armor + loot table.
- Guards (2-6) protect boss.

### AI Behavior
- Scripted spawn points per map.
- Scav AI runs client→server pathfinding + engagement.
- Hearing and LOS simulated.
- Headshot one-shots most Scavs.

## Death & Loot Cycle

```
You die → 
  Timer (~3-10 min): body remains on map; other players can loot.
  Your inventory (minus Secure Container) becomes loot pile.
Enemy player loots → takes gun, armor, meds, etc.
Server-side: your insured items (if paid insurance) return after 24-48h IF not looted.
```

Insurance = Prapor/Therapist trader; costs %age of item value upfront.

## TTK Examples

Assuming target wears Class 4 armor, full HP:

- **PS AK round (5.45x39, FMJ)** to chest: ~2-3 shots to break armor + damage, 3-5 to kill.
- **BP (armor-piercing)** AK: 1-3 shots.
- **BS (AP)** AK: 1-2 shots.
- **Headshot with PPBS (AP pistol)**: helmet-dependent; often 1-shot.
- **Bolt-action (7.62x54R, SNB)** body: 1 shot.
- **Unsuppressed 9mm** to body-armor: 10+ shots (pistol ammo struggles).

Result: gun-ammo combo matters more than gun itself.

## Balance Probes

- Average raid death rate: 70% of raids end in death.
- "Geared raid" (full kit vs full kit): avg 30-90 seconds from first shot to resolution.
- Scav death TTK: ~200-500ms of accurate fire.
- Boss kill: team + full kit + multiple grenades typical.

## Wipes & Meta Shifts

- Seasonal wipe resets economy.
- Wipe-start: low-tier gear combat; everyone is "naked with Makarov."
- Mid-wipe: Flea unlocks; trader economy roars; high-tier ammo accessible.
- Late wipe: kitted players dominate; noob-PMCs are insulated from gear gap via Scav raids.

## Design Philosophy

Battlestate's combat thesis:
- **Realism where it adds tension**: ballistics, anatomy, audio — all faithful.
- **Abstraction where realism kills fun**: inventory Tetris is a legible abstraction of realistic pack management.
- **Loss creates meaning**: without permadeath, the kit wouldn't matter.
- **Advanced skills reward study**: ammo chart, pen-class chart, attachment meta.

## Rejected Designs

- **Full auto-aim assist**: destroys skill differential.
- **TTK numbers on screen**: removes ambiguity → removes tension.
- **Respawn mid-raid**: breaks everything.
- **HUD ammo counter by default**: turns game into CoD.
- **Simplified armor (single %-dmg-reduce)**: loses the pen-class metagame.
