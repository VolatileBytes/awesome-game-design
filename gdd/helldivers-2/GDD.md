---
id: helldivers-2
title: Helldivers 2
version: 0.1.0
description: Third-person co-op squad shooter where orbital stratagems, massive bug/bot hordes, and a persistent galactic war deliver managed democracy one mission at a time.
tags: [third-person-shooter, co-op, pve, persistent-war, stratagems, friendly-fire]
engines: [unreal]
---

# Helldivers 2

Four-player co-op third-person PvE shooter set in a satirical militaristic future. Squads drop onto planets in the Super Earth Galactic War and complete objectives against Terminid (bugs), Automaton (bots), or Illuminate factions — aided by stratagems called in via code-string inputs and supported by orbital/aerial weaponry.

> Arrowhead Game Studios, 2024. Sequel to Helldivers (2015, top-down twin-stick).

## Pillars

1. **Co-op chaos with consequence.** Friendly-fire always on. Your teammate's orbital railcannon can vaporize you just as easily as the bug. Comedy is built into the mechanic.
2. **Stratagems are the game.** Every impactful tool — ammo, weapons, airstrikes, extraction — is a stratagem, called in with a 4-8 direction-key input combo while under fire.
3. **The galactic war is one shared story.** Every mission contributes to a persistent, server-side war. Planets fall and are liberated based on the community's collective play. Major Orders tell everyone where to fight this week.
4. **Hard-tuned punish cycles.** On Helldive difficulty, 2 bug charges can end a squad. The game expects wipes; extraction is earned, not given.
5. **Political satire through gameplay.** "For Democracy!" voice lines, propaganda radio, bureaucratic stratagem names — tone is player-readable without words.

## Modes

### Mission (canonical)
- 4-player co-op (or solo).
- 40-minute operation timer.
- Difficulty 1-10 (trivial → super helldive).
- Mission types: retrieve data, eliminate target, spread democracy, defend site, blitz extraction.

### Major Order
- Global community objective — "Liberate planet X in 72 hours."
- All player missions on target planets contribute to the community liberation %.
- Rewards: medals, new stratagems, story beats.

### Dive Mission Flow
```
1. Ship hub: pick operation (2-3 mission planet cluster).
2. Planet briefing: pick mission + difficulty + modifiers.
3. Stratagem loadout: 4 slots.
4. Armor + primary + secondary + grenade loadout.
5. Drop via Hellpod — landable anywhere, kills bugs on impact.
6. Mission: ~30-40 min timer.
7. Extract via Pelican: hold zone, survive wave, lift off.
```

## Factions

| Faction | Theme | Play style |
|---|---|---|
| **Terminids** | Starship Troopers bugs | swarms, melee, chargers, bile titans |
| **Automatons** | Terminator-style bots | ranged fire, artillery, rocket devastators |
| **Illuminate** | Higher-tech psionic alien | energy shields, teleporters, psychic attacks (returned in updates) |

Each has 15-25 enemy types, counterable with different stratagem/weapon combos.

## Stratagems

Stratagems are **the** system. Called via a **direction-key code input** on D-pad (controller) or arrow keys (PC):
- Open stratagem menu (left-shift / LB).
- Input the code (e.g., **Down-Down-Up-Right**).
- Throw a "beacon ball" (guide the stratagem landing).
- Wait 5-120s cooldown; beacon flares; stratagem lands.

Categories:
- **Support weapons**: Railgun, Autocannon, EAT (expendable AT), Spear, Arc Thrower. Replace secondary on pickup.
- **Orbital**: Laser, Railcannon, Precision Strike, 380mm Barrage, Gatling, Gas, Napalm.
- **Eagle airstrike**: fast air-delivered bombs, strafing runs, 500kg bomb.
- **Resupply / Ammo / Reinforcements**: essential utilities.
- **Sentry turrets**: Gatling, Machine Gun, Rocket, Mortar.
- **Vehicles** (post-launch): Mech suit, FRV buggy.
- **Backpack**: Shield generator, Guard Dog drone, Supply pack, Jump pack.

See [stratagem-design.md](references/stratagem-design.md).

## Combat Loop

See [combat-design.md](references/combat-design.md). High-level per-engagement:
- Detect threat (patrol light/dark).
- Choose tool: primary, support weapon, or stratagem?
- Call in stratagem if warranted (~5-15s ETA).
- Kite / hold position / revive downed ally.
- Gather samples + resources post-fight.

## Persistent War

### Galactic Map

The galaxy is ~100 planets organized by sector. Each has:
- Current faction control (%).
- Liberation rate (community activity).
- Regeneration rate (opposing faction reclaim).

Players dive on any contested planet; their mission outcomes nudge the %.

### Major Orders

- Issued by in-fiction "High Command" (Arrowhead Game Masters).
- Goal: e.g., "Liberate Malevelon Creek in 3 days."
- Community reward: new stratagem unlock, medals, story content.
- Success or failure becomes permanent canon.

### Game Masters

Arrowhead staff actively steer the war narrative. They:
- Choose enemy offensives.
- Introduce new planets.
- Surface unscripted community drama (the "Malevelon Creek" meme became canon).

## Player Progression

- **Levels (1-150)**: XP from mission completion; unlocks stratagem slots and higher-difficulty unlocks.
- **Medals**: currency for Warbond battle pass progression.
- **Super Credits**: premium currency (earnable + purchasable) for premium Warbonds.
- **Samples** (common / rare / super): upgrade ship modules.
- **Requisition**: stratagem unlock currency.
- **Warbonds**: themed battle-pass-style unlock trees (free + paid).

See [progression-design.md](references/progression-design.md).

## Ship Hub

The home instance:
- **Bridge**: galaxy map, mission select, Major Order briefing.
- **Armory**: loadout edit.
- **Hellpod bay**: drop to mission.
- **Acquisitions**: Warbond unlocks, stratagem purchase.
- **Ship upgrades**: use samples to improve ship modules (faster cooldowns, larger magazines, etc.).

## Audio & Voice

- **Democracy Officer** radio lines: satirical cheerful propaganda.
- **Unique VO** per stratagem ("Stratagem inbound," "Request confirmed").
- **Spatial audio** crucial: hear a Stalker before seeing it.
- **Music**: orchestral militaristic; swells on extraction.

## Difficulty

10 levels:

| Level | Name | Notes |
|---|---|---|
| 1 | Trivial | tutorial |
| 2 | Easy | |
| 3 | Medium | |
| 4 | Challenging | Samples accessible |
| 5 | Hard | |
| 6 | Extreme | |
| 7 | Suicide Mission | |
| 8 | Impossible | |
| 9 | Helldive | super samples appear |
| 10 | Super Helldive | (added post-launch) |

Enemy density, unit mix (chargers/titans/devastators), and mission complexity scale.

## Netcode

See [netcode.md](references/netcode.md). Host-authoritative P2P for mission instance. Ship hub is separate, per-player.

## References

- [3C Spec](references/3c-spec.md)
- [Combat Design](references/combat-design.md)
- [Stratagem Design](references/stratagem-design.md)
- [Progression Design](references/progression-design.md)
- [Netcode](references/netcode.md)

## Engines

- [Unreal Implementation](engines/unreal/GDD.md)
