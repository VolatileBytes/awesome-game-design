---
id: darkest-dungeon
title: Darkest Dungeon
version: 0.1.0
description: Gothic horror turn-based party RPG. Recruit heroes, send 4-person parties into procedural dungeons, manage stress alongside HP. Heroes break, die, acquire afflictions — and sometimes succeed anyway.
tags: [pc, mobile, console, turn-based, rpg, roguelike, horror, indie, single-player, strategy, gothic]
engines: [unity]
---

# Darkest Dungeon

Darkest Dungeon (2016, Red Hook Studios) pioneered **stress as a resource**. A side-view turn-based RPG where heroes have HP and Stress meters — hit either max and bad things happen. Manage town, manage parties, manage sanity. "Overconfidence is a slow and insidious killer."

## Pillars

1. **Stress as a second health bar** — hitting 100 Stress causes affliction (debuff + chaos); 200 = heart attack (often fatal).
2. **Formation matters** — 4 heroes in a line; each skill targets specific positions and requires specific hero positions. Shuffling breaks plans.
3. **Risk accretion** — dungeons reward treasure, but each fight builds quirks, diseases, trauma that the estate must heal.
4. **Narrator-driven atmosphere** — Ancestor voice-over reacts to crits, deaths, stress crossings; central to the game's tone.
5. **Permadeath with meta** — dead heroes are gone forever, but the estate grows, resurfaces recruits, upgrades buildings.

## Core Loop

```
Hamlet (hub)
  → Stagecoach: recruit 2–3 new heroes
  → Train at Blacksmith/Guild (upgrade skills, gear)
  → Heal at Abbey/Tavern (stress relief via prayer / drinking / gambling / brothel)
  → Cure diseases at Sanitarium
  → Select 4 heroes + build party for a dungeon
  → Stock the provision cart (food, torches, shovels, holy water)
  → Enter Dungeon (procedural hallways + rooms)
    → Encounter: enemies appear → turn-based combat → resolve
    → Hallway steps → random events (curios, traps, ambushes)
    → Torch dims → higher damage + stress but better loot
    → Boss at end (if boss dungeon) → loot reward
    → Scout rest rooms (camp: eat, heal, buff)
  → Return to Hamlet → spend rewards
  → Rinse and repeat → toward the Darkest Dungeon itself (4 final missions)
```

A dungeon run: 15–40 min. Full game: 80–100 hours (Radiant mode is ~40).

## Stress System

Every hero has a Stress meter 0–200:
- **0–100**: normal.
- **100**: Virtue/Affliction check — 25% Virtue (buff all stats), 75% Affliction (debuff + chaos behavior).
- **200**: Heart attack — HP dropped to Death's Door; if already at low HP, death.

Stress is dealt by:
- Specific enemy attacks ("Stress damage: 12").
- Darkness (low torch).
- Crits received.
- Watching allies die.
- Bad curios / random events.

Stress is healed by:
- Specific hero skills (Jester's "Finale," Crusader's "Inspiring Cry").
- Camp actions ("Encouraging Tale," "Pep Talk").
- Town buildings (Abbey, Tavern).

## Heroes

15+ base classes, each with 7 skills (pick 4 for a dungeon):

| Class | Role | Signature skill |
|---|---|---|
| Crusader | tank/smite | Smite (radiant front-rank) |
| Vestal | healer | Judgment (2-rank healing) |
| Highwayman | flexible DPS | Point Blank Shot (melee gun) |
| Plague Doctor | DoT + heal | Blinding Gas |
| Hellion | heavy melee | YAWP! (stun all) |
| Man-at-Arms | buffer / tank | Command (buff ally) |
| Graverobber | rogue / buff | Lunge (dash through ranks) |
| Jester | stress heal / buff | Finale (kill-confirm on red stress) |
| Arbalest | ranged DPS + heal | Suppressing Fire |
| Leper | slow + heavy | Chop (front) |
| Bounty Hunter | execute | Uppercut (stun + knockback) |
| Occultist | heal + debuff | Weakening Curse |
| Houndmaster | versatile | Blackjack |
| Abomination | transform | Manifestation (beast form) |
| Flagellant | bleed | Redeem (heal allies at stress cost) |
| (DLC) Shieldbreaker | piercing DPS | Puncture |
| (DLC) Musketeer | Arbalest alt | |

Each hero has quirks (positive/negative trait), camping skills (7 skills × 4 selectable), diseases (debuffs curable at Sanitarium), resistances, afflictions/virtues history.

## Dungeons

4 base regions + Darkest Dungeon + DLC:

| Region | Theme | Common enemies |
|---|---|---|
| Ruins | Undead | Skeleton Bowman, Bone Soldier, Sorcerer |
| Warrens | Pigmen | Swine Drummer, Wilbur, Chevaliers |
| Weald | Nature | Maggots, Shamblers, Fungal Artillery |
| Cove | Aquatic | Fishmen, Thralls, Pelagic |
| Farmstead (DLC) | Cosmic horror | Miller, Husks |
| Crimson Court (DLC) | Vampiric | Courtiers, Fanatic |
| Darkest Dungeon | Cosmic horror | Shambler, Cultist, Thing From Stars |

Dungeon difficulty tiers: Apprentice (lv 0-1 heroes), Veteran (2-3), Champion (4-5), Darkest.

Mission types: Explore 90%, Battle all rooms, Scout, Gather, Boss, Plot.

## Formation

**4 positions**: front (1) → back (4). Each skill has position requirements:

- **Usable from**: positions 1/2/3/4 (which rank the skill user must be in).
- **Targets**: which ranks of enemies it hits.

Example: Crusader's Smite: usable from rank 1 or 2, targets enemy rank 1 or 2.

Shuffle moves your ranks around — if a skill requires rank 1 and your Crusader is now in rank 3, that skill is unavailable that turn.

## Combat Flow

- Party of 4 vs enemies of 4.
- Turn order by SPD + tie-breaker (random).
- On turn: pick skill → pick target → resolve.
- Actions: Attack skill, Camp skill (only in rest), Move (shuffle position), Pass, Item use.
- Status effects: Bleed, Blight (poison), Stun, Mark (big crit buff), Dodge buff, Damage buff, Stress heal/deal.
- Death's Door: HP=0, survive one more hit with 33% dodge + debuff; next damage kills.

## Town (Hamlet)

Buildings upgrade with **Heirlooms** (bust, portrait, deed, crest):

- **Stagecoach** → more recruits, higher-level recruits.
- **Guild** → upgrade skills.
- **Blacksmith** → upgrade weapons + armor.
- **Sanitarium** → heal diseases + remove quirks.
- **Abbey** → stress heal via prayer/meditation/flagellation.
- **Tavern** → stress heal via drink/gamble/brothel (some heroes refuse certain activities).
- **Provision Shop** → stock for runs.
- **Graveyard** → memorial of dead heroes.
- **Survivalist** → add camping skills.
- **Nomad Wagon** → trinket shop.

## Original Engine

Red Hook built in **Adobe AIR** + custom scripting. Rebuild target: Unity 2022.3 LTS. 2D parallax side-view with rigged sprite animation.

## References

- [3C Spec](references/3c-spec.md)
- [Combat Design](references/combat-design.md)
- [Stress System](references/stress-system.md)
- [Progression Design](references/progression-design.md)
- [Unity Implementation](engines/unity/GDD.md)
