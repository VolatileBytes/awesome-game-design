# Stratagem Design — Helldivers 2

Stratagems are the signature system. They make loadouts meaningful, create the comedy, and gate tactical expression behind a dexterity mini-input.

## Input Flow

```
1. Hold stratagem menu key (LB / left shift).
2. Enter the stratagem's direction code (e.g., Up Down Right Up Left).
3. Release menu key → stratagem armed.
4. Press throw key (RB / G) → throw beacon.
5. Beacon lands (affected by physics, wind, bouncing).
6. Cooldown begins; stratagem delivers after N seconds.
```

Miss a direction → code fails → must restart. Under pressure, this is the game's skill ceiling.

## Stratagem Definition

```
StratagemDef {
    id: string
    name: string
    category: SupportWeapon | Orbital | Eagle | Backpack | Sentry | Vehicle | Utility
    inputCode: Direction[]           // 2-8 directions
    cooldownSec: float               // 5-300
    callInTimeSec: float             // 2-120 (time from beacon land to effect)
    usesPerMission: int?             // null = infinite; some have 1-3
    description: string
    effect: EffectPayload            // what actually happens
    shipUpgradeBoosts: UpgradeId[]   // ship modules that modify this stratagem
}
```

## Stratagem Categories

### 1. Support Weapons

Drop a personal weapon you pick up; replaces the support-weapon slot.

| Weapon | Input | CD | Notes |
|---|---|---|---|
| Machine Gun | ↓←↓↑→ | 70s | versatile infantry gun |
| Stalwart | ↓←↓↑↑← | 70s | mobile LMG |
| HMG | ↓←↑↓↓ | 100s | heavy armor pen |
| Autocannon | ↓←↓↑↑→ | 80s | best all-rounder; needs backpack |
| Railgun | ↓→↓↑←→ | 90s | charged anti-armor |
| EAT-17 | ↓↓←↑→ | 70s | 2-rocket disposable; short CD |
| Recoilless Rifle | ↓←→→← | 100s | 1-rocket, reloads via backpack |
| Spear | ↓↓↑↓↓ | 120s | lock-on missile |
| Flamethrower | ↓←↑↓↑ | 100s | close-range |
| Arc Thrower | ↓→↑←↓ | 120s | chain lightning |
| Quasar Cannon | ↓↓↑←→ | 90s | charged beam, infinite ammo |
| Grenade Launcher | ↓←↑←↓ | 70s | explosive area clear |
| Anti-Materiel Rifle | ↓←→↑↓ | 70s | precision sniper |
| Airburst Rocket | ↓↑↑→← | 120s | anti-horde cluster |

### 2. Orbital Strikes

Ship-mounted; target a beacon on ground, rounds fly from orbit.

| Strike | Input | CD | Effect |
|---|---|---|---|
| Orbital Precision Strike | →→↑ | 100s | single targeted ICBM |
| Orbital Gatling | →↓←↑↑ | 70s | minigun spray area |
| Orbital Airburst | →→→ | 120s | cluster above beacon |
| Orbital 120mm | →→↓←→↓ | 240s | artillery barrage |
| Orbital 380mm | →↓↑↑←↓↓ | 240s | wide area barrage |
| Orbital Walking | →↓→↓→↓ | 240s | barrage moves across area |
| Orbital Laser | →↓↑→↓ | 300s | beam sweeps enemies, 3 uses total |
| Orbital Railcannon | →↑↓↓→ | 210s | single-target insta-kill big enemy |
| Orbital Napalm | →→↓←↑ | 100s | fire area |
| Orbital Smoke | →→↓↑ | 120s | obscure area |
| Orbital Gas | →→↓→ | 100s | poison area (post-launch) |
| Orbital EMS | →→←↓ | 75s | stuns enemies |

### 3. Eagle Airstrikes

Eagle-1 fighter plane runs. Limited uses per rearm cycle (rearm: 120s).

| Strike | Input | Uses | Effect |
|---|---|---|---|
| Eagle Strafing Run | →→→ | 3 | strafing bullets |
| Eagle Airstrike | →→↓→ | 2 | bomb stripe |
| Eagle Cluster Bomb | →→↓↓→ | 4 | anti-horde |
| Eagle Napalm | →→↓↓← | 2 | fire stripe |
| Eagle Smoke | →→↓↑ | 2 | smoke line |
| Eagle 110mm Pod | →→↑↓ | 2 | precision hit |
| Eagle 500kg Bomb | →↑↓↓↓ | 2 | nuke-tier AoE |

### 4. Sentries

Auto-turret; place and it shoots at enemies for a limited time.

| Sentry | Input | CD | Duration |
|---|---|---|---|
| Machine Gun | ↓↑→→↑ | 180s | 3 min |
| Gatling | ↓↑→←↓ | 120s | 3 min |
| Mortar | ↓↑→→↓ | 180s | 3 min |
| Autocannon | ↓↑←↑→→ | 240s | 3 min |
| EMS Mortar | ↓↑→→← | 240s | 3 min |
| Rocket | ↓↑→→→ | 240s | 3 min |

**Note**: sentries will friendly-fire.

### 5. Backpacks

Equipped on your character.

| Backpack | Input | Effect |
|---|---|---|
| Shield Generator | ↓↑←→←→ | personal dome shield, absorbs damage |
| Supply Pack | ↓←↓↑↑↓ | 4 personal resupplies for self/team |
| Guard Dog | ↓↑←↑→↓ | autonomous drone, small kills |
| Guard Dog Rover | ↓↑←↑→→ | laser drone variant |
| Jump Pack | ↓↑↑↓↑ | short boost jump |
| Ballistic Shield | ↓←↓↓→ | handheld shield, must equip |

### 6. Utility

| Utility | Input | Effect |
|---|---|---|
| Reinforce | ↑↓→←↑ | revive fallen teammate |
| Resupply | ↓↓↑→ | ammo box for team |
| SOS Beacon | ↑↓→↑ | invites random players to join mission |
| Hellbomb | ↓↑←↓↑→↓↑ | manual-plant nuke (objective tool) |
| SEAF Artillery | →↑↑↓ | loaded via objective; player-called artillery |

### 7. Vehicles (post-launch)

| Vehicle | Input | CD |
|---|---|---|
| Mech (Patriot / Emancipator) | ↑←↓→→↓ | 600s |
| FRV (buggy) | ↓←↓↑↑→ | 300s |

## Ship Upgrades

Use samples to upgrade ship modules:
- **Hangar**: Eagle reloads faster; extra use.
- **Orbital Cannons**: cooldown reduction.
- **Engineering**: stratagem reinforcements land faster.
- **Robotics Workshop**: sentries + guard dogs upgrades.
- **Patriotic Administration**: primary weapon ammo +5%.

Each upgrade costs common / rare / super samples scaling by tier.

## Stratagem Design Philosophy

### Tradeoffs

Every stratagem slot has opportunity cost — you only get 4. Good loadouts balance:
- Anti-infantry (MG, flamethrower).
- Anti-armor (EAT, Railgun, 500kg).
- Support (shield, supply pack, guard dog).
- Emergency (orbital laser, railcannon strike).

### Risk/Reward

- Short cooldown stratagems (Strafing Run): tactical tool, throw often.
- Long cooldown (Orbital Laser, 500kg): save for crisis.
- "Chicken dinners" = throwing the big one at the right time.

### Friendly Fire as Feature

A 500kg bomb killing your entire squad is not a bug. It's the tension:
- Players learn to shout "STRATAGEM!" before input.
- Players learn to dive-prone when they see an orbital beacon land.
- Players learn which stratagems to call when teammates are nearby.

### The Input Code is the Game

Reducing the input code to a single button (tested in beta) removed what players cited as the iconic "fun under pressure" moment. Keep the code.

## Cooldown Math

Base cooldown × ship upgrade mod × (difficulty?) = effective CD.

Some stratagems have **uses per mission** (no refresh):
- Orbital Laser: 3 uses.
- Eagle strikes: per-rearm limits (Eagle rearms after 120s when all used up).

## Stratagem Balance Probes

- No single stratagem should dominate at all difficulties. Railgun was dominant at launch → nerfed, which caused community outrage.
- Every support weapon should have a "niche": railgun vs light armor, autocannon vs mixed, EAT vs heavy armor.
- Call-in time gates emergency response: short CD stratagems are low-impact, long CD are high-impact.
- Friendly-fire incidents per mission: ~3-5 at medium difficulty. Up to 10-20 at Helldive.

## Rejected Designs

- **Stratagem-free modes**: breaks the game's identity.
- **Stratagem input simplification**: removes a pillar.
- **Friendly-fire off**: same.
- **PvP stratagems**: explicitly not developing.
