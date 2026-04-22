---
id: hollow-knight
title: Hollow Knight
version: 0.1.0
description: Metroidvania action-adventure — a silent knight descends into the ruined bug kingdom Hallownest, gaining abilities, defeating bosses, and uncovering its fall.
tags: [metroidvania, action, indie, 2d, hand-drawn, single-player, souls-like, platformer]
engines: [unity]
---

# Hollow Knight

2D hand-drawn metroidvania by Team Cherry. You play a small silent knight exploring Hallownest — a vast underground kingdom of bugs, ruined by an ancient infection. Combat is tight and deliberate; exploration uncovers 150+ areas; progression unlocks mobility tools (wall-cling, double-jump, dash) that reshape the map. Difficulty is Souls-inflected — precise, punishing, rewarding.

Originally shipped 2017 after Kickstarter; free DLC expansions (Hidden Dreams, Grimm Troupe, Lifeblood, Godmaster) added content through 2018. Sequel Silksong in extended development.

## Snapshot

| Field | Value |
|---|---|
| Studio | Team Cherry (3 people + contractors) |
| First release | 2017-02-24 |
| Engine | Unity |
| Genre | Metroidvania / action / souls-like |
| Players | 1 |
| Perspective | 2D side-scrolling |
| Platforms | PC, Mac, Linux, Switch, PS4, Xbox One |
| Business model | Paid (~$15); free DLC |
| Avg playtime | 30-50 hours main; 60-100+ completionist |

## Design Pillars

1. **Tight Combat First** — every enemy + boss is read-and-react; mastery rewards pattern recognition.
2. **Interconnected Geography** — one continuous map; no loading screens between areas (just quick transitions).
3. **Ability-Gated Exploration** — each unlock (wall-cling, double-jump, dash, crystal dash, shade cloak) reshapes movement.
4. **Minimal Narrative Delivery** — lore via NPCs, environment, optional journal entries; no hand-holding.
5. **Death as Mechanic** — Shade system preserves risk but gives recovery; Soulslike breadcrumb.

## Core Loop

```
Explore unknown area → encounter enemies + platforming
  ↓
Find Bench (save/heal/charm reassign) or Stag Station (fast travel)
  ↓
Fight boss or find ability → progression unlock
  ↓
Return to blocked areas with new ability
  ↓
Repeat with growing map + growing toolset
```

Layered meta-progression via charms, masks (HP), vessel fragments (soul), geo (currency), pale ore (nail upgrades), essence (dream ghosts).

## World

### Hallownest Regions (main map)

| Region | Theme | Boss | Ability Found |
|---|---|---|---|
| Forgotten Crossroads | Entry; ruins | False Knight | Vengeful Spirit (fireball) |
| Greenpath | Verdant overgrowth | Hornet | Mothwing Cloak (dash) |
| Fungal Wastes | Mushroom caverns | Mantis Lords | Mantis Claw (wall-cling) |
| City of Tears | Abandoned royal capital | Soul Master | Desolate Dive + City Crest |
| Crystal Peak | Crystal mines | Crystal Guardian | Crystal Heart (horizontal dash) |
| Royal Waterways | Sewer + blob monsters | Dung Defender | Isma's Tear (acid immunity) |
| Deepnest | Spider cave; horror-adjacent | Nosk | Nothing specific |
| Ancient Basin | Void + palace ruins | Broken Vessel | Monarch Wings (double-jump) |
| Kingdom's Edge | Shellwood cliffs | Hornet 2 | Nothing specific |
| Queen's Gardens | Garden ruins | Traitor Lord | White Fragment |
| Resting Grounds | Graveyard | Seer (NPC) | Dream Nail |
| Fog Canyon | Jellyfish caves | Uumuu (DLC) | Nothing |
| Abyss | Bottom-of-world | Shade Lord | Shade Cloak (dark dash) |

### DLC Regions

- **Crystallized Mound** (Lifeblood): Grey Mourner questline.
- **Grimm Troupe** (Grimm): Nightmare Lantern + Troupe Master Grimm.
- **Godhome** (Godmaster): Boss-rush pantheon.

### Secret / Optional

- **Colosseum of Fools** (Kingdom's Edge): three trial arenas.
- **White Palace**: platforming gauntlet for White Fragment.
- **Path of Pain**: post-White-Palace platforming ultra-challenge.

## Combat Overview

- **Nail**: primary melee weapon (sword-like). Short-range, directional.
- **Spells**: Soul-powered ranged attacks (Vengeful Spirit / Shade Soul, Desolate Dive / Descending Dark, Howling Wraiths / Abyss Shriek).
- **Focus**: spend 33 Soul to heal 1 mask.
- **Parry / nail-art**: hold attack button for power-charged strike.
- **Dash + Jump**: i-frames on dash after Mothwing Cloak.

See [Combat Design](references/combat-design.md).

## Progression

### Masks (HP)

- Start with 5 masks.
- +1 mask per 4 collected mask shards (~16 shards total; 9 upgrades max = 14 masks).
- Lifeblood cocoons can temporarily add lifeblood masks (blue).

### Soul (resource)

- Gained from hitting enemies.
- Spent on: Focus (heal), spells.
- Soul Vessel fragments expand max capacity.

### Vessel Fragments

- 9 fragments → +1 soul vessel (+33 soul capacity).
- Found in world + shops + Grubfather rewards.

### Geo (currency)

- Dropped by enemies + found in chests/statues.
- Spent on: charms, items, services, maps.

### Charms

- Passive abilities; equipped to notches.
- 45 charms total.
- Notches expandable (start with 3; max 11).
- Synergies: Fragile/Unbreakable Heart, Shaman Stone, Quick Focus, etc.

### Nail Upgrades (Nailsmith in City of Tears)

- Old Nail → Sharpened → Channeled → Coiled → Pure Nail.
- Requires: pale ore (rare loot).

### Essence

- From Dream Nail (Seer reward) + killing dream bosses.
- Spent with Seer for upgrades; path to Dream Nail → Awoken Dream Nail.

## Exploration Unlocks

Key abilities that re-open map:

| Ability | Source | Effect |
|---|---|---|
| Vengeful Spirit | Forgotten Crossroads | Ranged fireball |
| Mothwing Cloak | Greenpath | Horizontal dash (8-frame i-frames) |
| Mantis Claw | Fungal Wastes | Wall-cling + wall-jump |
| Crystal Heart | Crystal Peak | Charged horizontal super-dash |
| Monarch Wings | Ancient Basin | Double-jump |
| Isma's Tear | Royal Waterways | Acid immunity (access blocked pools) |
| Shade Cloak | Abyss | Dash with i-frames + pierces light obstacles |
| Dream Nail | Resting Grounds | Read thoughts + collect Essence + dream-warp |

Each unlock alters movement vocabulary. Design reveals pathways dynamically.

## Save / Bench System

- Benches scattered throughout world.
- Sit → save, reset charm layout (free at bench).
- Rest restores masks to full + soul to full.
- Death drops Shade at death location with player's Soul + Geo — must defeat Shade to reclaim.

Dying before reclaiming Shade = lose all Geo (only). Shade remains until reclaimed or respawned.

## Mapping System

- Cornifer NPC in each area sells partial map.
- Full mapping requires Quill (purchased from Iselda).
- Map only updates on bench-rest; player must bench to commit exploration.
- Charms enhance mapping: Wayward Compass (shows player on map), Gathering Swarm (auto-collect Geo).

Minimal but immersive; player has to learn geography by playing.

## Narrative

Minimalist environmental storytelling:
- Tablets scattered with ancient text.
- NPCs with fragmentary stories (Quirrel, Cloth, Tiso, Myla, Bretta, Iselda/Cornifer).
- Dream Nail reveals inner thoughts.
- Journal entries (Hunter) describe enemies.

Player pieces together: kingdom's fall, infection, the Pale King, the Vessel project.

Multiple endings (3 base + DLC variants):
- **Sealed Siblings**: ending 1 (basic).
- **Dream No More**: ending 2 (Awoken Dream Nail + Void Heart).
- **Embrace the Void**: ending 3 (Void Heart + certain flags).
- **Delicate Flower** (Godmaster): ending 4+.

## Boss Design

~20 major bosses + ~30 mini-bosses + dream variants:

- **Mantis Lords**: 3-phase; dodge patterns; iconic.
- **Hornet** (Greenpath / Kingdom's Edge): recurring rival; test of skill.
- **Soul Master**: City of Tears midgame; magical projectiles + stomps.
- **Nightmare King Grimm** (DLC): one of hardest in base.
- **Radiance** (true final): multi-phase bullet-hell.
- **Pure Vessel** (Godmaster): distilled moveset boss.

Each boss readable — telegraphs + patterns to learn. Death teaches.

## DLC Summary

All free post-launch:

- **Hidden Dreams** (Aug 2017): Dream bosses (Lost Kin, White Defender) + Nightmare King Grimm teaser.
- **Grimm Troupe** (Oct 2017): Nightmare Lantern questline + Grimm boss + optional NKG finale.
- **Lifeblood** (Apr 2018): Grey Mourner quest + Delicate Flower + White Defender.
- **Godmaster** (Aug 2018): Pantheon boss-rush + ultimate endings.

## References

- [3Cs Spec](references/3c-spec.md)
- [Combat Design](references/combat-design.md)
- [Map Design](references/map-design.md)
- [Progression Design](references/progression-design.md)

## Engine Overlays

- [Unity](engines/unity/GDD.md)
