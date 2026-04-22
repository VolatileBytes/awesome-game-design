# Combat Design — Helldivers 2

Combat is third-person squad-based PvE. Your squad of 4 has four primary tools: primary weapon, secondary, grenades, and stratagems. Enemy design is built around swarms (Terminids) or artillery (Automatons) or psionics (Illuminate).

## Damage Model

### Layered Armor

Every enemy has multiple armor values per body part:

```
Enemy hitbox -> {
    armor_class: 1-10
    hp_remaining
}
```

Weapons have a **penetration rating**:
- Pen < armor_class → bullets bounce (no damage).
- Pen == armor_class → reduced damage.
- Pen > armor_class → full damage.

Examples:
- Breaker shotgun: pen 3. Hits Hunter fine, bounces off Charger head.
- Autocannon: pen 5. Opens up Bile Titan weak spots.
- Railgun (safe mode): pen 4. (Unsafe/overcharge: pen 6.)
- 500kg bomb: pen infinite; ignores armor.

### Weak Spots

Each big enemy has mapped weak spots:
- **Charger**: butt (bleed damage), leg (strip armor and then squishy).
- **Bile Titan**: head from above, belly (green sac).
- **Hulk**: back vent.
- **Devastator**: head, belly (tiny, hard).
- **Factory Strider**: eye, chin guns, belly.

## Weapon Categories

### Primary (ship with)
- **Assault Rifles**: Liberator, AR-23, Adjudicator.
- **SMGs**: Defender, Pummeler.
- **Shotguns**: Breaker, Slugger, Incendiary Breaker.
- **DMRs**: Diligence, Diligence CS.
- **Energy**: Scythe, Sickle.
- **Explosive**: Crossbow, Eruptor.
- **Plasma**: Purifier.

### Secondary
- **Pistols**: Peacemaker, Redeemer, Senator (revolver), Grenade Pistol.

### Grenades
- **Frag, Impact, Stun, Incendiary, Smoke, High-explosive (HE), Gas, Thermite.**

### Stratagem weapons (pick up on field)
- **Machine Gun, Stalwart, HMG** — rapid fire.
- **Autocannon** — medium pen, crowd control, anti-armor.
- **Railgun** — single shot, high pen, charge mechanic.
- **EAT (Expendable Anti-Tank)** — 2 disposable rockets.
- **Spear** — lock-on rocket, heavy anti-armor.
- **Arc Thrower** — chain lightning, infinite ammo.
- **Flamethrower** — close-range, fire cone.
- **Quasar Cannon** — charged energy blast.
- **Grenade Launcher** — explosive spam.
- **Anti-Material Rifle** — sniper, high pen.
- **Airburst Rocket** — anti-horde.

## TTK Examples (approximate)

Against **Hunter** (common bug, 125 HP, armor 2):
- Liberator AR: 4-5 shots.
- Breaker shotgun: 1-2 pumps.
- Autocannon: 1 shot.
- Frag grenade: 1.

Against **Charger** (5000 HP, armor 4 head / 2 leg):
- Liberator AR to head: 0 dmg (bounce).
- Liberator to butt: 5000 shots (not viable).
- Strip leg armor (3 Autocannon shots), then shoot meat: 30-40 AR rounds.
- Railgun unsafe to head: 2-3 shots.
- EAT to head: 1 shot.
- 500kg bomb direct hit: 1.

Against **Bile Titan** (18,000 HP, armor 7 head / 4 belly):
- 500kg direct hit: 1 (ideal).
- Railcannon strike: 1.
- Orbital laser sweep: ~3s.
- Unsafe railgun to head: 6-8 shots.
- Anti-materiel rifle to belly: 20+ shots.

## Movement

- **Walk / run / sprint**: stamina-limited.
- **Crouch / prone**: tighter accuracy, slower.
- **Dive** (B/Circle): instantly drops to prone; evades grabs/charges.
- **Jump-pack** (stratagem): short-burst vertical jump.
- **Ragdoll**: explosions and certain hits send you flying.
- **Climb/vault**: contextual — low walls and rocks.

## Stamina

- Full bar: ~10 seconds of sprint.
- Regen while walking; faster when still.
- Heavy armor: reduced stamina cap + regen.
- Stim (injectable): full heal + stamina refill + overhealth buff 5s.

## Stimpak / Healing

- Auto-regen **stops** at 50% HP.
- Stims (secondary slot): 4 per spawn; instant heal + sprint.
- Resupply drops: replenish stims + primary ammo.

## Friendly Fire

Always on. Everything that damages enemies damages teammates equivalently:
- Stratagems (orbital strike on your own squad = instant wipe).
- Sentries (mortar sentries are infamous for killing squadmates).
- Explosives.
- Flamethrowers.
- Even melee.

Design intent: creates comedy + deliberate spacing.

## Reinforcements

Dead teammates respawn via **Reinforcement stratagem**:
- Input direction code.
- Throw beacon where you want them to land.
- Hellpod launches from orbit; lands in ~8s; can kill enemies in landing zone.
- Carried over: no respawn limit (squad-shared budget, typically 20 per mission).

## Objectives

Mission objectives vary:
- **Retrieve data**: terminal interact, ~30s.
- **Eradicate**: kill wave; defense + survival.
- **Launch ICBM**: sequence of control-terminal actions.
- **Blitz extraction**: destroy/capture ~5 targets; extract fast.
- **Escort civilian**: move NPC across map.
- **Defend**: hold area against waves.

Secondary objectives optional: sabotage factories, clear nests/bases, gather samples.

## Extraction

- Call extraction via stratagem (at call-ready terminal usually).
- Pelican descends in ~2 minutes.
- Squad must hold extraction LZ against swelling waves.
- Pelican lands; climb in; takes off.
- Samples brought back count; ones lost on death stay on map for pickup.

## Enemy AI

### Terminids (swarm)
- **Hunters**: leap + melee swarm.
- **Scavengers**: low-HP rush.
- **Warriors**: medium-HP ranged spit.
- **Chargers**: armored melee rush; charge-target-then-stop.
- **Bile Titan**: artillery spit + stomp.
- **Stalker**: invisible; ambush; high damage.
- **Bile Spewer**: long-range acid.
- **Brood Commander**: stress-alarm caller (calls patrol).

### Automatons (ranged)
- **Troopers**: rifle grunt.
- **Marauders**: flamethrower.
- **Devastators** (berserker, heavy, rocket): chain-gun or rocket.
- **Hulks** (bruiser, scorcher, obliterator): tanky + flamethrower/rocket/guns.
- **Tank**: slow turret.
- **Factory Strider**: huge walker, artillery.
- **Gunship**: flying harasser.
- **Scout Strider**: walker with driver.

### Illuminate (post-launch)
- **Voteless**: melee civilian-turned-thralls.
- **Harvester**: tripod laser walker.
- **Overseer**: jetpack ranged.
- **Jetpack Warriors**: high mobility.

## Patrols & Alert

- Each planet has **patrols** — small enemy squads.
- Being seen → patrol triggers a **reinforcement call**.
- Reinforcement call (15s counter, shown by red exclamation above caller) → drop-ship arrives with enemies.
- Killing the caller prevents the reinforcement.
- Stealth armor reduces detection range.

## Weather & Environment

- **Fire tornado** (volcano planets): instant kill if hit.
- **Acid storm** (Crimson Pact): ranged weapons get inaccurate.
- **Blizzard / fog**: reduced visibility.
- **Nighttime** (some planets): requires flashlight/NVGs.

## Ammunition

- Primary/secondary have magazines + reserve.
- Support weapons have their own reserve (EAT is disposable, autocannon has 5 mags).
- Resupply drop (stratagem, free cooldown): gives each player 2 primary mags + full stims + grenades.

## Design Philosophy

- **No power creep within a loadout**: every weapon has a niche. The best AR is not a vertical upgrade over the worst.
- **Stratagems > loadouts**: your tactical expression is primarily stratagem choice.
- **Difficulty is tuned for wipes**: Helldive-level missions expect squad wipes; reinforcements are the gameplay.
- **Readability above realism**: enemy silhouettes are distinct; attack tells are visible even in chaos.
- **Friendly-fire enforces spacing**: explosive-heavy loadouts naturally teleport you apart from your squad.

## Balance Probes

- Mission completion rate at difficulty 7 (Suicide): ~60%.
- At Helldive 9: ~30%.
- At Super Helldive 10: ~15%.
- Per-mission death count average: 15-25 at high difficulty.
- Sample pickup rate: ~90% extracted when squad lives.

## Rejected Designs

- **No friendly fire**: rejected because FF creates squad spacing + tension + comedy.
- **Revives instead of reinforcements**: Hellpod drops are iconic.
- **Competitive PvP**: Arrowhead explicit — PvE co-op only.
- **Permanent progression of weapons**: keeps rotating choice meaningful; sidegrade not upgrade.
