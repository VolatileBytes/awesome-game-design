---
id: risk-of-rain-2
title: Risk of Rain 2
version: 0.1.0
description: Third-person 3D roguelike shooter. Drop onto alien planets, find a teleporter, survive an escalating horde while it charges, loop forever. Item stacking is the core fun.
tags: [pc, console, shooter, third-person, roguelike, co-op, indie, sci-fi, action]
engines: [unity]
---

# Risk of Rain 2

Risk of Rain 2 (2019/2020, Hopoo Games) made the 2D sidescroller sequel into a 3D third-person shooter. Up to 4 players drop onto a procedural stage, find the teleporter, survive a charge timer against scaling enemies, fight a boss, move to the next stage. Items stack *literally* — holding 100 Soldier's Syringes is visible and effective.

## Pillars

1. **Scaling threat** — a visible "difficulty" meter climbs every second; enemy HP + damage + count + mutations scale with it.
2. **Item stacking** — every item works at 100x; the pickup → stack → absurd loop is the core dopamine.
3. **Co-op first** — designed for 4-player; solo works but shines in drop-in online.
4. **Short stages, long runs** — each stage ~5–8 min; runs end when you die OR when you run long enough (no hard cap).
5. **Movement mastery** — each survivor has a distinct mobility profile; good movement trivializes content.

## Core Loop

```
Menu → select survivor → start run
  → Stage 1 (Distant Roost, Titanic Plains, ...) — find teleporter, fight boss
  → Stage 2
  → ... 
  → Stage 5 (Bazaar Between Time — optional)
  → Loop back to Stage 1 (difficulty resets but items persist)
  → Final stage: Commencement (Mithrix boss) → escape OR endless loop
  → Die → run ends; XP earned toward survivor unlocks + items toward Logs
```

Typical run: 20–90 min. Loop runs can go 5+ hours.

## Difficulty Meter

Every second, a hidden "time" variable increases. Difficulty ramps through tiers:
- Easy → Medium → Hard → Very Hard → Insane → Impossible → HAHAHAHAHA

This affects:
- Enemy base HP + damage.
- Enemy count per wave.
- Mutation chance (Blazing, Glacial, Overloading, Celestine variants).
- Boss spawn frequency.

Speedrunners race to finish stages before difficulty spikes; casual players lean on strong builds to outpace it.

## Survivors

13 survivors (base + DLCs), each with 4 skill slots:

| Survivor | Role | Unique identity |
|---|---|---|
| Commando | baseline | 2-weapon primary, rolls, phase round, frag |
| Huntress | mobile archer | homing arrows, blink |
| Bandit | single-target burst | revolver crit, smoke bomb |
| MUL-T | dual-wielding bruiser | two primaries, retool |
| Engineer | turret-drop | mines, turrets (twin deploy) |
| Artificer | mage | fire/ice spells, fly |
| Mercenary | melee | sword combos, flying sword |
| REX | plant | life-steal via HP drain |
| Loader | grappling tank | grapple, heavy punch |
| Acrid | poison | dot focus, leap |
| Captain | late-game | airstrikes, hacking beacons, shields |
| Railgunner | sniper | charged rifle, phase teleport |
| Void Fiend | DLC corruption | dual forms, void meter |

Each has 2–4 unlockable alt skills per slot, earned via achievement.

## Items

The heart of the game: **200+ items** across tiers:

| Tier | Rarity | Example |
|---|---|---|
| Common (white) | 60% | Soldier's Syringe (+atk speed), Monster Tooth (heal orb) |
| Uncommon (green) | 25% | Kjaro's Band (attack explosion), Old Guillotine (exec low HP) |
| Legendary (red) | 5% | Ceremonial Dagger (chain shots), Hardlight Afterburner (+2 dashes) |
| Boss (yellow) | boss drops | Titanic Knurl (+40HP and +regen) |
| Lunar (blue) | shop only | Strides of Heresy (heresy weapon) — high power, weird tradeoff |
| Equipment (orange) | 1 slot active | Preon Accumulator, Disposable Missile Launcher |
| Void (purple) | DLC corruption | Benthic Bloom (corrupts items into upgrades) |

Items stack. Soldier's Syringe adds +15% attack speed; 10 stacks = +150% attack speed. Some items have diminishing returns (Ukelele's damage chain caps), but most are linear.

## Stages

~10 base stages + DLC stages. Each run visits stages in a fixed ring sequence (1 → 2 → 3 → 4 → 5 → loop). The game picks 1 of ~3 biomes per slot:

- Stage 1: Titanic Plains / Distant Roost / Siphoned Forest
- Stage 2: Abyssal Depths / Wetland Aspect
- Stage 3: Rallypoint Delta / Scorched Acres
- Stage 4: Abandoned Aqueduct / Sulfur Pools
- Stage 5: Sundered Grove / Commencement (special)

Each stage has a teleporter (must find + activate), chests, shrines, drones, newt altars, boss spawns.

## Teleporter Event

Activating the teleporter starts a ~90s charge timer:
- Enemies spawn faster + harder around the teleporter.
- Boss(es) spawn.
- Can't leave until teleporter finishes + all enemies dead.

This is the **stage climax** — a 1–3 minute panic.

## Shrines & Interactables

- **Chests** (cost gold): random item drops.
- **Shrine of Chance** (gamble): coin flip for item or damage.
- **Shrine of Combat** (spawn enemies for items).
- **Shrine of Mountain** (risk: +1 boss for +items).
- **Newt altar** (4 per run: give a Lunar Coin → unlock Bazaar between stages).
- **Bazaar Between Time** (stage 5 alt, spend Lunar Coins on exotic items).
- **Teleporter** (primary stage goal).

## Currency

- **Gold** ($, green coin): open chests, use shrines. Resets per run.
- **Lunar Coins** (blue): persist across runs. Drop rarely from enemies. Spend at Bazaar.
- **Blood crystal / Celestial orb / Heresy**: special currency for specific content.

## Engine

Built in Unity. The rebuild target here assumes Unity continues as the engine, with modern URP and improved mobile porting potential (Risk of Rain 2 is desktop + console only currently).

## References

- [3C Spec](references/3c-spec.md)
- [Item System](references/item-system.md)
- [Scaling Design](references/scaling-design.md)
- [Progression Design](references/progression-design.md)
- [Unity Implementation](engines/unity/GDD.md)
