# Map Design — Hollow Knight

Hallownest is one continuous map split into 15+ named areas. No loading screens between areas (subtle room-transition streaming). Metroidvania-core: explore, backtrack with new abilities, discover shortcuts.

## Map Principles

### Interconnected Not Linear

Every area links to 2-4 neighbors. Routes through Hallownest are many; no forced sequence (after the initial Forgotten Crossroads).

### Ability-Gated, Not Key-Gated

Keys are rare (Elegant Key, Simple Keys). Most gates are traversal-ability checks:
- Gap too wide → need Mantis Claw.
- High wall → need Monarch Wings.
- Energy barrier → need Shade Cloak.
- Acid pool → need Isma's Tear.

### Shortcuts Everywhere

Benches and shortcuts back to known areas are abundant. Death never loses more than 5-10 minutes.

### Rooms Are Authored

Every screen is hand-designed. No procedural generation.

### Vertical Design

Hallownest is underground — depth matters. Many areas stack vertically. Descent is theme.

## Area Breakdown

### Dirtmouth (Surface Hub)

- Entry town above Hallownest.
- Shops (Sly), Elderbug, Stag Station.
- Safe zone; return here for respite.

### Forgotten Crossroads (Tier 1)

- Entry area below Dirtmouth.
- Tutorial zones; low-tier enemies.
- Boss: False Knight.
- Reward: Vengeful Spirit spell.
- Branches to: Greenpath, Fungal Wastes, Fog Canyon.

### Greenpath (Tier 1-2)

- Verdant overgrowth + moss knights.
- Boss: Hornet (sister; recurring rival).
- Reward: Mothwing Cloak (dash).
- Branches to: Fog Canyon, Queen's Gardens, Lake of Unn.

### Fungal Wastes (Tier 2)

- Mushroom caverns + Mantis Village.
- Boss: Mantis Lords (3-phase iconic fight).
- Reward: Mantis Claw (wall-cling).
- Branches to: Deepnest, Royal Waterways, City of Tears.

### City of Tears (Tier 3, Hub)

- Abandoned royal capital; central hub; perpetual rain.
- Boss: Soul Master (Soul Sanctum).
- Reward: Shade Soul, Desolate Dive.
- Branches to: Crystal Peak, Resting Grounds, King's Station, Royal Waterways.

### Crystal Peak (Tier 3)

- Crystal mines; crushers + conveyors.
- Boss: Crystal Guardian / Enraged Crystal Guardian.
- Reward: Crystal Heart (super-dash).
- Branches to: Resting Grounds, Deep Mines.

### Royal Waterways (Tier 3)

- Sewer system + dung beetles.
- Boss: Dung Defender.
- Reward: Isma's Tear (acid immunity).
- Branches to: Junk Pit (optional), Ancient Basin.

### Deepnest (Tier 3-4)

- Spider cave; horror tone; dark corridors.
- Boss: Nosk (mimic shape-shifter).
- Branches to: Kingdom's Edge, Ancient Basin.
- Lore: pre-Pale-King civilization.

### Ancient Basin (Tier 4)

- Void pools + White Palace entry.
- Boss: Broken Vessel.
- Reward: Monarch Wings (double-jump).
- Branches to: Abyss, Palace Grounds.

### Abyss (Tier 4)

- Void zone; deepest part of map.
- Contains Shade Cloak lifeblood core + Lifeblood Door.
- Reward: Shade Cloak (dark dash).
- Boss (Godmaster): Shade Lord.

### Queen's Gardens (Tier 4)

- Decaying royal garden.
- Boss: Traitor Lord.
- Reward: White Fragment (half of Kingsoul charm).
- Secret: Grey Mourner's flower quest (delicate flower).

### Kingdom's Edge (Tier 4)

- Shellwood cliffs + Hive subregion.
- Boss: Hornet 2 (rematch, deadlier).
- Contains Colosseum of Fools.

### Resting Grounds

- Graveyard area.
- Seer NPC: Dream Nail + Essence path.
- Bench + stag.

### White Palace (Optional / Lore)

- Pale King's palace; via dream portal.
- Heavy platforming gauntlet; no enemies (mostly spikes + saws).
- Path of Pain: ultra-hard DLC platforming section.
- Reward: Kingsoul completion.

### Godhome (Godmaster DLC)

- Pantheon hub.
- Boss-rush challenges.

## Connections Map (high-level)

```
                Dirtmouth
                    |
             Forgotten Crossroads
                /     |       \
          Greenpath  Fog Canyon Fungal Wastes
              |       |           |
          Queen's G  (jellyfish)  Mantis Village
              |       |           |
            ---+-----City of Tears--+---
            |           |             |
        Crystal Peak  Royal Waterways Deepnest
            |           |             |
        Resting Grounds                |
            |       Ancient Basin  Kingdom's Edge (Colosseum)
            |           |             |
                      Abyss         White Palace
```

## Traversal Tools

### Stagways (Fast Travel)

10+ stag stations scattered:
- Dirtmouth, Crossroads, Greenpath, City Storerooms, Queen's Station, Hidden Station, etc.
- Travel between any two unlocked stations.
- Cost: free (post-discovery).

### Tram (Deepnest/Ancient Basin)

- Secondary fast-travel system.
- Requires Tram Pass.

### Dreamgates

- Use Dream Nail to mark warp location (via Seer).
- Return to mark from anywhere.
- One active mark at a time.

### Benches

- ~100+ benches total.
- Save + heal + charm-swap.
- Some benches in boss arena-adjacent rooms.

## Map UI

### Discovery

- Cornifer NPC wanders areas selling partial maps.
- Buy basic map (~50 Geo) → unlock area's map tab.
- Iselda (Cornifer's wife, Dirtmouth) sells upgrades:
  - Quill (pen): auto-update map on bench.
  - Pins: mark shops, benches, stags.
  - Skins: cosmetic.

### Map Fog

- Unvisited rooms dark / absent.
- Visiting a room + benching = map updates.
- Full map = 100% visited + benched.

### Key Items Shown

- Benches (bench icon).
- Stags (stag icon).
- Cornifer locations (map icon).
- Shopkeepers (tag).
- Grubs (after Grub Pin).
- Whispering Roots (Dream Nail lore).

## Hidden Content

### Grubs

46 grubs scattered across map. Free them → Grubfather rewards Geo + items.

### Whispering Roots

Dream Nail a root → enter room with Essence ghosts → collect Essence.

### Hidden Rooms

- Smash walls with nail → reveal secrets.
- Specific clues (subtle sprite details) hint at hidden passages.

### Charm Notches

Some hidden; some quest-gated; some purchased.

### Mask Shards

16 total; hidden around world + shop-bought + quest-rewarded.

### Vessel Fragments

9 total; similar hunt to mask shards.

### Pale Ore

6 total; requires extensive exploration (Deep Nosk, Deepnest depths, Colosseum, etc.).

## Design Philosophy

### Reward Exploration

Every odd pathway yields something: Geo, charm, mask shard, lore tablet, grub, NPC.

### Teach Through Architecture

Early rooms teach: jump, attack. Later rooms require combinations. Greenpath's charger enemy teaches dash timing.

### Respect Memory

No handholding. Player remembers "there was an acid pool near Royal Waterways that I couldn't cross." After Isma's Tear → return.

### Atmosphere First

Many rooms are pure ambience: scale, loneliness, decay. Not every screen is combat or platforming; some are just mood.

### Metroidvania Purity

No level-scaling, no auto-return-to-hub, no quest markers. The map itself is the puzzle and the adventure.

## Rejected Patterns

- **Procedural layouts**: all authored.
- **Quest-marker waypoints**: never.
- **Minimap always visible**: full map only in menu.
- **Enemy respawn disabling**: enemies respawn on bench; wears thin for farmers.
- **Auto-map with no exploration**: must find Cornifer's maps to unlock area map.
