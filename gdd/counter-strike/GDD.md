---
id: counter-strike
title: Counter-Strike
version: 0.1.0
description: Tactical 5v5 round-based FPS where economy, map control, and precision aim compound into decisive minutes.
tags: [fps, tactical, competitive, multiplayer, esports, pc]
engines: [source2]
---

# Counter-Strike

Round-based 5v5 tactical shooter. Terrorists try to plant & detonate a bomb (or hold hostages); Counter-Terrorists try to prevent or defuse. 24 rounds, first to 13 wins. Economy and weapons carry across rounds but reset on map change.

> This GDD describes **Counter-Strike as a design family** (CS 1.6 → CS:S → CS:GO → CS2). Mechanics referenced are the current CS2 baseline unless noted.

## Pillars

1. **Precision over reflex.** Accuracy comes from stillness; running-and-gunning is punished. First-shot accuracy and spray patterns are memorizable.
2. **Economy drives tempo.** Rounds are won with money as much as with bullets. Force-buys, saves, and eco rounds create a meta-layer above gunfights.
3. **Map control = information.** Maps are tight. Holding an angle, timing a smoke, hearing footsteps — every second of info shifts the 5v5 math.
4. **Matches are conversations.** No respawns mid-round. Decisions propagate: one bad flash burns the round; one AWP pick flips it.
5. **Legacy-clean.** Mechanics that existed in 1.6 still carry. Running accuracy, counter-strafing, spray control — muscle memory is transferable across 25 years.

## Modes

### Competitive (canonical)
- MR12 (CS2) / MR15 (CS:GO): first-to-13 / first-to-16.
- Half-time swap (T↔CT).
- Overtime: MR3, +$10k start.
- 5v5, ranked matchmaking.

### Casual / Deathmatch / Arms Race / Wingman
- Lower stakes, warm-up modes.
- **Wingman**: 2v2, bomb-only, single site.
- **Arms Race**: progression through weapons on kill.

### Community / Surf / Retake
- Modding community drives half the game's lifespan.

## Round Flow

```
1. Freeze time (15s): buy weapons, equipment, utility.
2. Round starts; 1:55 regulation time.
3. T side wins by: eliminating all CTs OR planting + detonating bomb (40s fuse).
4. CT side wins by: eliminating all Ts before plant, OR defusing bomb (10s no-kit / 5s kit), OR running out the clock.
5. Round end: economy updated, win/loss bonuses distributed.
```

## Economy

Every player has a money pool. Rounds earn/lose money based on result:

| Event | $ |
|---|---:|
| Round win (bomb/defuse) | 3250 |
| Round win (elim) | 3250 |
| Round win (time) | 3250 |
| Loss bonus (consecutive losses) | 1400 → 1900 → 2400 → 2900 → 3400 |
| Plant reward (T) | 800 (team-split) |
| Kill reward (rifle) | 300 |
| Kill reward (AWP) | 100 |
| Kill reward (pistol) | 300 |
| Kill reward (SMG) | 600 |
| Kill reward (knife) | 1500 |
| Teammate kill | -300 |

**Max money**: $16,000. **Pistol-round start**: $800.

Economy strategy creates the meta: "eco round," "force-buy," "full-buy," "save weapons."

## Combat Model

### Weapons

Three tiers:
- **Pistols**: Glock/USP/P250/Deagle. Pistol round + eco rounds.
- **SMGs**: MP9/MAC-10/UMP. Anti-eco, kill-reward heavy.
- **Rifles**: AK-47 (T), M4A4/M4A1-S (CT), AWP (both). Full-buy staple.

Each weapon has:
- **Base damage + damage falloff by distance**.
- **Armor penetration %**.
- **Headshot multiplier** (4x typical; one-shot-kill on rifles with headshot).
- **Spray pattern** (deterministic recoil for first N bullets, then randomized).
- **Running accuracy penalty** (most weapons nearly useless while moving).

See [combat-design.md](references/combat-design.md).

### Movement

- Counter-strafing: tap opposite direction to stop instantly → first bullet is accurate.
- Jumping locks accuracy to zero; no jump-peek shots.
- Crouching tightens spray but slows movement.
- Step sounds: opponents hear your footsteps unless you walk (`shift`).

### Utility

- **HE grenade**: 57 dmg splash.
- **Flashbang**: 1-5s blind depending on LOS angle.
- **Smoke**: ~18s, blocks LOS.
- **Molotov / Incendiary**: area denial, 40 dps.
- **Decoy**: audio fakes (shots / distraction).

## Maps

Canonical 7-map Active Duty pool rotates every ~6 months:
- Dust II, Mirage, Inferno, Nuke, Overpass, Ancient, Vertigo, Anubis (as of 2024).

Each map has:
- **Two bomb sites** (A + B).
- **Chokepoints**: mid, long, short.
- **Timings**: CTs vs Ts arrival-to-site matters by seconds.
- **Angles**: held positions that force info trades.

See [map-design.md](references/map-design.md).

## Netcode

- **64 tick** (default) / **128 tick** (Faceit, ESEA).
- **Subtick updates** (CS2): input timing captured between ticks.
- Lag compensation: client-shoots-what-they-see, server rewinds.
- "Peeker's advantage" inherent to the model.

See [netcode.md](references/netcode.md).

## Anti-Cheat

- **VAC + VAC Live** (CS2): in-match demo analysis, bans.
- **Trust Factor**: invisible matchmaking score.
- **Overwatch** (CS:GO): community juries on flagged demos.
- **Prime** (paid tier): separated queue.

Cheating is the single largest community complaint. Third-party clients (Faceit, ESEA) run kernel-level AC for tournaments.

## Progression & Cosmetics

No combat progression. All unlocks are cosmetic:
- **Weapon skins**: case-drop economy → Steam Market trading.
- **Stickers / charms** (CS2): applied to weapons.
- **Music kits / Agent skins / gloves**.
- **CS:GO rank → CS2 Premier Rating (ELO-style)**.

Competitive rank is the "progression" — Silver → Master Guardian → Global Elite (legacy); Premier rating 1k–30k+ (CS2).

## Social Layer

- **Voice comms** (proximity + team).
- **Chat** (all chat during pause / post-round).
- **Commends** (friendly, teacher, leader).
- **Reports** (griefing, cheating, abusive).
- **Friends + parties (Steam)**.

## Audio

- Step sounds, reload sounds, gun sounds are **competitive information**.
- Directional HRTF audio toggle.
- Silent-walk (`shift`) vs run has been a core mechanic since 1.6.
- Weapon audio: each gun has a signature report recognizable across map.

## UI / HUD

Minimal HUD — everything pulls attention from aim:
- Crosshair (customizable).
- Ammo counter, health, armor (bottom).
- Money (top-left).
- Scoreboard (tab-hold).
- Minimap (top-left, teammate pings).
- Kill-feed (top-right).

See [3c-spec.md](references/3c-spec.md).

## References

- [3C Spec](references/3c-spec.md)
- [Combat Design](references/combat-design.md)
- [Map Design](references/map-design.md)
- [Economy Design](references/economy-design.md)
- [Netcode](references/netcode.md)

## Engines

- [Source 2 Implementation](engines/source2/GDD.md)
