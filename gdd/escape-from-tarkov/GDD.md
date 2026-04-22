---
id: escape-from-tarkov
title: Escape from Tarkov
version: 0.1.0
description: Hardcore extraction-shooter set in a besieged Russian city — ballistic-accurate gunplay, real-time looting, full-loss-on-death, and a deep inventory economy.
tags: [fps, extraction-shooter, hardcore, survival, milsim, pvpve]
engines: [unity]
---

# Escape from Tarkov

Hardcore PvPvE "extraction shooter." Players deploy into a walled-off zone of Tarkov (a fictional Russian city), loot, fight NPCs (Scavs, Raiders, Bosses) and other players (PMCs), and try to extract — alive, with loot.

> Battlestate Games, 2017-present (still in Beta). Defined the extraction-shooter genre.

## Pillars

1. **You lose everything when you die.** Not "some credits" — your weapons, armor, equipment, all gone. This transforms every raid into a risk calculation.
2. **Ballistic + anatomical fidelity.** Bullets have caliber, penetration class, fragmentation. Your body has 7 zones with independent HP. A chest shot bleeds into stomach; a leg shot blacks the leg.
3. **Inventory as gameplay.** Tetris-grid containers, weight, raid-backpacks, Secure Container — managing loot at the grid level IS the loop.
4. **No HUD.** No mini-map, no nametags, no ammo counter by default. You check your mag by weighing it; you know the area by exploring it.
5. **Long-term progression.** Trader levels, Hideout upgrades, skills, quests, seasonal wipes — the meta-game extends over months.

## Modes

### PMC Raid (core)
- Deploy as your PMC (BEAR or USEC) onto a map.
- ~35-45 min raid timer.
- Complete quests, loot, engage hostiles.
- Extract at map-specific extracts (conditional: time, price, faction, companion).
- If die: lose everything on body except Secure Container contents.

### Scav Raid
- Deploy as a "Scav" — a temporary NPC role with random loadout.
- Lower stakes: nothing to lose, loot is free.
- AI Scavs won't attack you (unless you go "Scav karma" negative).
- Cooldown timer between Scav raids.
- On death: no penalty. On extract: all loot goes to PMC stash.

### Labs (Terragroup Laboratory)
- High-tier loot map with keycard requirement.
- Raiders (elite AI) patrol; boss "Kaban" in Streets.
- High risk, high reward.

### Arena (standalone mode)
- PvP-focused spin-off: Tarkov Arena (2023). Faster, death-penalty-lighter.

## Maps

Shipping maps (2024): Customs, Factory, Woods, Shoreline, Interchange, Reserve, Lighthouse, Streets of Tarkov, Ground Zero, Labs.

Each map:
- ~5-15 extract points (some PMC-only, some Scav-only, conditional).
- Boss + boss guards spawning.
- Quest objectives (pickups, marks, kills).
- Loot density tiered (basic items → medical → keycards → weapons → valuables).

See [map-design.md](references/map-design.md).

## Combat Model

Hyper-realistic compared to CS/CoD:

- **Caliber matters**: 5.45x39, 7.62x39, 9x39, .366, 12/70 buck/slug, 12.7x108 (AS VAL/Val, DP-27, NSV), etc.
- **Round type matters**: FMJ, Hollow Point, AP, Tracer.
- **Armor classes** (1-6): chest plates rated against penetration.
- **Bullet deformation**: fragmentation on soft tissue; less penetration against armor.
- **Suppressors**: reduce sound signature, velocity loss.
- **Body zones**: Head, Thorax, Stomach, Left/Right Arm, Left/Right Leg — each has HP + status (bleeding, fracture, tremor).

See [combat-design.md](references/combat-design.md).

## Body & Health

```
Head:    35 HP  (0 = death)
Thorax:  85 HP  (0 = death)
Stomach: 70 HP  (0 = blacks zone, massive debuff)
Arms:    60 HP each (0 = blacks arm)
Legs:    65 HP each (0 = blacks leg)
Total:   440 HP (but limb-black doesn't cascade equal to sum)
```

- "Blacked" limbs take 1.5x damage; pain tremor + debuffs.
- Bleeding: light / heavy bleed — bandage needed.
- Fractures: can't run; needs splint.
- Pain: movement sway.
- Dehydration / hunger: caloric energy + hydration bars.

Medical items: bandage, tourniquet, CMS kit, surgery kit, painkillers (Analgin, Ibuprofen), morphine, propital.

## Inventory

**Tetris grid** inventory. Everything occupies a 2D footprint:

- Rifle: 4x1.
- AK mag: 1x1.
- Backpack: 4x6 / 6x6 etc.
- Secure Container: 2x2 up to 4x4 (Gamma = 3x3 premium, Kappa = 3x5 quest-reward).

Secure Container survives death — hold keys/barter items.

Weight affects stamina, sprint duration, noise.

## Economy

### In-Raid
- **Roubles**: standard.
- **Dollars / Euros**: trader-specific.
- **Barter items**: many traders take items (bolts, gunpowder, tech).
- **Flea Market**: player-to-player auction (unlocked at lvl 15 PMC).
- **Traders**: Prapor, Therapist, Fence, Skier, Peacekeeper, Mechanic, Ragman, Jaeger, Ref, Lightkeeper.

Trader reputation + level gates stock + prices.

### Hideout

Base-building upgradeable rooms:
- **Bitcoin Farm**: passive income.
- **Scav Case**: random loot generator (cost currency, returns mid-tier loot).
- **Medstation, Lavatory, Workbench**: crafting.
- **Gym**: skill boost training.
- **Booze Generator**: consumable crafting.
- **Intelligence Center**: quest/raid bonuses.

Upgrade costs: raw materials + currency + time (hours/days real-time).

See [economy-design.md](references/economy-design.md).

## Progression

### PMC Leveling (1-79)
- XP from raids, quests, kills.
- Level gates: quests, Flea Market (15), traders, Kappa.

### Skills
- Combat skills (Endurance, Strength, Vitality, Health).
- Weapon skills (AK, AR-15, Pistol, LMG, DMR, Sniper, etc.).
- Utility skills (Stress Resistance, Charisma).
- Leveled by usage; soft-cap.

### Quests
- ~400+ quests across traders.
- Kappa container is end-game questline completion.
- Many are PvP-oriented (kill PMCs in location, with specific weapon, at specific range).

### Wipes
- Seasonal (every ~6 months).
- Full server reset; all progression lost.
- Wipe start = community rush; Flea unlocked late.

See [progression-design.md](references/progression-design.md).

## Audio

**Audio is arguably the most competitive edge** in Tarkov:
- 3D positional audio (HRTF optional).
- Footsteps differentiated by surface, player weight, movement speed.
- Weapon audio specific per firearm + suppressor.
- Distant shots carry realistically.
- Heartbeat (when HP low) audible to player.

Headphones (in-game item: ComTacs, Sordins, GSSh-01) amplify distant audio.

## No HUD

- No mini-map.
- No player nametags.
- No ammo counter (check mag by inspecting).
- No HP bar (check Health screen).
- No hit markers on enemies.
- Kill confirms: player death visible, but no announce.

Some information surfaces:
- Compass (item or premium edition inventory).
- Clock (item).
- Voice lines (bosses announce themselves).

## AI

- **Scavs**: low-tier NPC with random loadout. Don't shoot at close range if player doesn't; deadly if alerted.
- **Raiders**: elite; use grenades, tac-gear. Labs, Reserve.
- **Rogues**: elite at Lighthouse.
- **Bosses**: unique named entities per map — Reshala, Killa, Glukhar, Shturman, Sanitar, Tagilla, Kaban. Each with guards, unique loot.
- **Scav Bosses** drop rare loot (boss mask, boss weapon).

## Flea Market

- Unlocks at PMC level 15.
- Player-to-player item sales.
- Search by item, filter by price/condition.
- Offered prices fluctuate real-time.
- Fee charged on sale (~5-10%).

## Hardcore Loop

```
1. Stash prep: pick loadout (weapon, mag, armor, helmet, backpack, meds).
2. Tier the kit: try to match what you expect to fight.
3. Deploy: raid timer begins.
4. Mid-raid: fight, loot, complete quest items.
5. Extract: reach extract before timer/dying.
6. Post-raid: sell loot, upgrade hideout, craft, buy, repeat.
```

## References

- [3C Spec](references/3c-spec.md)
- [Combat Design](references/combat-design.md)
- [Map Design](references/map-design.md)
- [Economy Design](references/economy-design.md)
- [Progression Design](references/progression-design.md)

## Engines

- [Unity Implementation](engines/unity/GDD.md)
