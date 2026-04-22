---
id: doom-1993
title: DOOM (1993)
version: 0.1.0
description: id Software's genre-defining 1993 first-person shooter — fast movement, shotgun combat, 2.5D BSP-rendered mazes, pioneered modding via WAD files and shareware distribution.
tags: [fps, first-person-shooter, classic, horror, action, shareware, moddable, pc, retro]
engines: [idtech1]
---

# DOOM (1993)

id Software's December 10, 1993 shareware release that defined the first-person shooter genre. John Carmack's BSP-rendered 2.5D engine, John Romero's level design, Sandy Petersen's maps, Adrian Carmack and Kevin Cloud's demon art, and Bobby Prince's metal-tinged soundtrack — a marine is stranded on a UAC Mars moon base after a failed teleport experiment opens a portal to Hell.

Gameplay: the player navigates maze-like maps of increasing complexity, shooting demons with an arsenal of escalating weapons (fist → chainsaw → pistol → shotgun → chaingun → rocket launcher → plasma gun → BFG 9000), collecting keycards to unlock doors, finding secrets, and reaching the exit. Movement is fast — faster than the player can sprint in any Doom sequel. Combat is visceral, chaotic, and rewards circle-strafing and prioritizing targets.

DOOM shipped as shareware: episode 1 (*Knee-Deep in the Dead*) free; the full retail game added *The Shores of Hell* and *Inferno*. The 1994 *Ultimate Doom* re-release added a fourth episode, *Thy Flesh Consumed*. WAD file architecture — the game's data format separate from the engine — made modding trivial, and mod culture (custom levels, total conversions like *Brutal Doom* and *MyHouse.wad*) sustained DOOM for decades.

## Snapshot

| Field | Value |
|---|---|
| Designer | John Romero, Sandy Petersen, Tom Hall (early design) |
| Programmer | John Carmack (engine), Dave Taylor, John Romero |
| Art | Adrian Carmack, Kevin Cloud |
| Sound | Bobby Prince |
| Studio | id Software |
| Publisher | id Software (shareware), GT Interactive (retail) |
| Release | 1993-12-10 (v1.0 shareware), 1994-04-30 (registered retail), 1995-04 (Ultimate Doom) |
| Platform | MS-DOS (original), then ports to Mac, SNES, 32X, Jaguar, Saturn, PSX, GBA, N64, iOS, Switch, browser, refrigerators, pregnancy tests, etc. |
| Engine | id Tech 1 (Doom engine) |
| Language | C (+ some DOS assembly) |
| Genre | First-person shooter |
| Perspective | First-person |
| Players | 1 (campaign), 2-4 (deathmatch, co-op via IPX/serial/modem) |
| Episodes | 3 (original retail) / 4 (Ultimate Doom) × 9 maps = 27-36 maps |
| Average campaign length | 4-8 hours |
| Business model | Shareware (episode 1 free) + retail (full game) |
| Distribution | BBS, shareware disks, GT Interactive boxed retail, countless ports |
| Difficulty levels | 5 (I'm Too Young to Die → Nightmare!) |

## Design Pillars

1. **Speed** — player movement is the fastest in the FPS canon (~32 mph). Strafing and circling are primary verbs.
2. **Weapons Have Identity** — each gun has a distinct role, sound, and tempo. Shotgun ≠ chaingun ≠ rocket launcher.
3. **Monster Ecosystem** — different demons have different attacks, speeds, health, and dangers. Encounters are designed around mixing them.
4. **Vertical Mazes** — maps are 3D-feeling despite 2.5D engine; height, floor texture, and secret rooms create discovery.
5. **Modding by Design** — game data (WAD files) separated from engine from day one; architecture invited modification.

## The Story (Minimal)

- The UAC (Union Aerospace Corporation) conducts teleport experiments on Phobos and Deimos, Mars's moons.
- Experiments open a portal to Hell.
- Demons invade Phobos; kill everyone except the unnamed Marine ("Doomguy").
- Player shoots their way through Phobos (Episode 1), Deimos (Episode 2), and finally Hell itself (Episode 3).
- Episode 4 (*Ultimate Doom*): back to Earth, prologue to Doom II.

Plot delivered via screen text between episodes; no cutscenes in-game. Design philosophy: "Story in a game is like a story in a porn movie. It's expected to be there, but it's not that important." — John Carmack.

## Core Loop

1. Spawn in level with pistol + fist.
2. Explore level; find weapons, ammo, armor, health, keys.
3. Shoot demons.
4. Find keycards to open color-coded doors.
5. Locate exit switch/room.
6. Press exit; end-of-level score screen (kills %, items %, secrets %, time).
7. Next level loads.

## Episodes + Maps (Original Retail)

### Episode 1: Knee-Deep in the Dead (Shareware)

E1M1 Hangar · E1M2 Nuclear Plant · E1M3 Toxin Refinery · E1M4 Command Control · E1M5 Phobos Lab · E1M6 Central Processing · E1M7 Computer Station · E1M8 Phobos Anomaly (boss: two Barons of Hell) · E1M9 Military Base (secret)

### Episode 2: The Shores of Hell

E2M1 Deimos Anomaly · E2M2 Containment Area · E2M3 Refinery · E2M4 Deimos Lab · E2M5 Command Center · E2M6 Halls of the Damned · E2M7 Spawning Vats · E2M8 Tower of Babel (boss: Cyberdemon) · E2M9 Fortress of Mystery (secret)

### Episode 3: Inferno

E3M1 Hell Keep · E3M2 Slough of Despair · E3M3 Pandemonium · E3M4 House of Pain · E3M5 Unholy Cathedral · E3M6 Mt. Erebus · E3M7 Limbo · E3M8 Dis (boss: Spider Mastermind) · E3M9 Warrens (secret)

### Episode 4: Thy Flesh Consumed (Ultimate Doom, 1995)

E4M1 Hell Beneath · E4M2 Perfect Hatred · E4M3 Sever the Wicked · E4M4 Unruly Evil · E4M5 They Will Repent · E4M6 Against Thee Wickedly · E4M7 And Hell Followed · E4M8 Unto the Cruel (boss: Spider Mastermind) · E4M9 Fear (secret)

## Difficulty Levels

| Skill | Name | Properties |
|---|---|---|
| 1 | I'm Too Young to Die | Enemies deal half damage; 2× ammo pickups |
| 2 | Hey, Not Too Rough | Fewer enemies than UV |
| 3 | Hurt Me Plenty | Default balanced difficulty |
| 4 | Ultra-Violence | More enemies; more aggressive; faster |
| 5 | Nightmare! | UV + respawning enemies + 2× monster speed + 2× ammo |

## Weapons

| Slot | Weapon | Ammo | Role |
|---|---|---|---|
| 1 | Fist | — | Melee; 2-10 dmg; Berserk quadruples |
| 1 | Chainsaw | Fuel (∞) | Locked-on melee; rips through weak enemies |
| 2 | Pistol | Bullets | Starting ranged; weak |
| 3 | Shotgun | Shells | Mid-range workhorse; 7-pellet spread, ~105 max dmg |
| 4 | Chaingun | Bullets | Sustained DPS; stunlock |
| 5 | Rocket Launcher | Rockets | Splash damage; self-damage risk |
| 6 | Plasma Rifle | Cells | High DPS; fast projectile |
| 7 | BFG 9000 | Cells (40/shot) | Ultimate weapon; huge AoE |

All weapons use hitscan (instant) except rockets, plasma, BFG (projectile).

## Items

- **Health**: Stimpack (+10), Medikit (+25), Soul Sphere (+100, up to 200), Megasphere (200 HP + 200 armor)
- **Armor**: Green Armor (100, absorbs 33%), Mega Armor (200, absorbs 50%)
- **Keys**: Red, Blue, Yellow (keycards OR skull keys depending on map)
- **Power-ups**: Berserk (melee-boost), Invulnerability (30s godmode), Partial Invisibility (50% dodge), Radiation Suit (30s damage floor immune), Computer Map (reveals level), Light Amplification (night vision)
- **Ammo**: clips, shell boxes, rocket boxes, cell packs

## Monsters

| Monster | HP | Attack | Notes |
|---|---|---|---|
| Zombieman | 20 | Pistol hitscan | Low-tier grunt |
| Shotgun Guy | 30 | Shotgun hitscan | Mid-tier |
| Imp | 60 | Fireball projectile + claw | Baseline demon |
| Pinky (Demon) | 150 | Melee bite | Fast, tanky close-range |
| Spectre | 150 | Melee bite | Partially invisible Pinky |
| Lost Soul | 100 | Charge (ram) | Flying; hit-and-run |
| Cacodemon | 400 | Fireball | Floating; tanky |
| Baron of Hell | 1000 | Fireball + claw | Mini-boss |
| Cyberdemon | 4000 | Rocket launcher | Boss of E2 |
| Spider Mastermind | 3000 | Chaingun hitscan | Boss of E3 / E4 |

Infighting: monsters damage each other if cross-fire hits — deliberately exploitable.

## Multiplayer

### Deathmatch (2-4)

- Introduced competitive FPS multiplayer to mass audiences.
- IPX LAN, serial (null modem cable), or modem (phone line).
- Respawning; scoring on kills.
- Popularized the term "deathmatch."

### Co-op (2-4)

- Same campaign maps; friendly fire ON by default (configurable).
- Monster counts scale with player count.

## Moddability

- **WAD file**: single-file archive of levels, textures, sprites, sounds.
- **IWAD** (doom.wad, doom2.wad): core game data; required.
- **PWAD**: patch WAD, loaded via `-file mywad.wad`; overrides IWAD entries.
- Community tools: DEU (level editor), DeuTex, later DoomBuilder, GZDoomBuilder, SLADE.
- 30+ years of mods: custom episodes, total conversions, graphical overhauls, gameplay mods (Brutal Doom, Project Brutality, MyHouse.wad).

## Commercial Impact

- Sold 1M+ retail copies + untold shareware downloads.
- Launched id Software into industry royalty.
- Inspired "Doom clone" as genre label until Half-Life broke the mold.
- Public domain source code release (1997) spawned modern source ports: Chocolate Doom, GZDoom, ZDoom, PrBoom+, dsda-doom.
- Doom runs on essentially every computing device; "Can it run Doom?" is a cultural meme.

## Design Philosophy

### Speed Over Realism

Doom's marine moves at absurd speed by design. Slower movement feels like walking; faster enables expressive combat. Carmack & Romero tested many speeds; settled on "too fast" because it felt great.

### Weapons Have Feel

Romero: each weapon's sound, animation, fire rate, ammo, and targets were tuned individually. Shotgun is the canonical example — satisfying cadence (pump → boom → pump).

### Maps as Authored Experiences

Unlike procgen shooters later, Doom's maps were hand-designed. Romero and Petersen had distinct styles; Petersen's abstract, interconnected; Romero's more theatrical, set-piece-oriented.

### Monster Mix as Design

Each encounter's tension comes from monster composition. Imps in corridor ≠ imps + hitscanners ≠ imps + pinkies. Monster counts + placement + sightlines = the encounter.

### Separate Engine From Data

Carmack insisted on WAD architecture from the start. Engine knows about file format; doesn't care about specific content. This is what made modding possible and ultimately turned Doom into a 30-year platform.

### Nightmare Mode As Joke

Romero added Nightmare because he thought nobody could beat UV on the hardest maps. Respawning monsters makes it nearly unwinnable in long levels — intentionally punitive.

### Story Is Flavor

Text screens between episodes. No NPCs, no dialogue, no cutscenes. The player fills in narrative via texture, sound, and environment.

## Technical Constraints (1993 Hardware)

- Target: Intel 386/486, 4 MB RAM, VGA 320×200 256-color.
- No hardware 3D; software rendering only.
- BSP tree precomputed at map build time for fast rendering.
- Column-based rendering with clip-and-span algorithms.
- Fixed-point math (16.16 Q format) — no FPU required.
- 2.5D: walls vertical, floors/ceilings horizontal, no true 3D geometry (no rooms over rooms until Doom 64 / ZDoom).

## Innovation Checklist

- **Networked deathmatch** — first mass-popularized FPS multiplayer.
- **Shareware distribution model** — proved free episode + paid retail = massive reach.
- **WAD modding** — first major moddable commercial game.
- **Non-linear 3D-ish levels** — unlike Wolfenstein's grid-aligned corridors.
- **Height variance** — stairs, lifts, ledges.
- **Ambient lighting** — sectors with baked brightness.
- **Music genre in games** — Bobby Prince's MIDI metal defined FPS audio aesthetic.

## Cultural Impact

- Spawned the entire FPS genre as a commercial category.
- "Doom Guy" silhouette is one of gaming's most recognizable icons.
- Inspired countless clones (Heretic, Hexen, ROTT, Duke3D, Quake).
- Doom community is one of the oldest continuously active modding communities.
- Source port scene keeps original playable on every modern OS.
- Referenced endlessly in pop culture, academic discourse, media archaeology.

## Reconstruction Complexity

- **Beginner**: Can't meaningfully "reimplement" Doom in a tutorial — engine is too specific.
- **Intermediate**: Unity/Godot "retro FPS" templates approximate feel without the BSP math.
- **Advanced**: Port original Doom source to new platforms (existing 30+ ports cover this).
- **Research**: BSP rendering, fixed-point math, WAD format parsing — classic CS pedagogy.

## References

- [3Cs Spec](references/3c-spec.md)
- [Combat Design](references/combat-design.md)
- [Map Design](references/map-design.md)
- [Netcode & Deathmatch](references/netcode.md)

## Engine Overlays

- [id Tech 1 (Doom engine)](engines/idtech1/GDD.md)
