---
id: among-us
title: Among Us
version: 0.1.0
description: Social deduction multiplayer — crewmates complete tasks while impostors sabotage and kill; suss out the traitors via meetings and votes.
tags: [multiplayer, social-deduction, casual, mobile, pc, console, 2d, top-down]
engines: [unity]
---

# Among Us

Social deduction party game by Innersloth. Crewmates must finish tasks (and survive) while a hidden subset of "Impostors" sabotage systems and eliminate players. Meetings trigger on body reports or emergency buttons; players vote to eject suspects. Impostors win by reaching parity with crew or completing a sabotage. Crew wins by finishing all tasks or ejecting all impostors.

Originally shipped 2018, exploded in popularity 2020. Cross-platform free-to-play (mobile) + paid (PC/console) with cosmetic microtransactions.

## Snapshot

| Field | Value |
|---|---|
| Studio | Innersloth |
| First release | 2018 |
| Engine | Unity |
| Genre | Social deduction multiplayer |
| Players | 4-15 per lobby |
| Perspective | Top-down 2D |
| Platforms | PC, iOS, Android, Xbox, PlayStation, Switch |
| Business model | Free (mobile, ads) / paid (PC/console) + cosmetic DLC |
| Avg match length | 5-15 minutes |

## Design Pillars

1. **Social Deduction First** — mechanics exist to create conversation, not optimize play.
2. **Low-Barrier Entry** — any platform, small download, quick learning curve.
3. **Readable Crime Scenes** — vent use, body positions, task locations all decodable.
4. **Voice/Text Optional** — works with text chat alone; voice adds social layer.
5. **Party Chaos** — short matches, immediate re-queue, bring-your-own-friends.

## Player Count Scaling

| Players | Impostors | Dynamic |
|---|---|---|
| 4-6 | 1 | Intimate; every vote matters |
| 7-9 | 1-2 | Classic balance |
| 10-12 | 2 | Default; comfortable chaos |
| 13-15 | 2-3 | Crowd mode; harder to read everyone |

Host configures impostor count, task count, meeting count, kill cooldown, vision, speed.

## Roles

### Crewmate

- Complete assigned tasks (visible task-bar when all done).
- Report dead bodies when found.
- Call emergency meetings (limited, configurable).
- Vote in meetings.
- Cannot kill, vent, or sabotage.

### Impostor

- Pretend to be crewmate; fake tasks.
- Kill crewmates (on cooldown, 15-60s configurable).
- Vent — travel between linked vent exits.
- Sabotage systems (lights, O2, reactor, comms, doors).
- Win at parity (impostors >= living crewmates) or sabotage-timer-out.

### Ghost

After death/ejection:
- Complete remaining tasks (contribute to task-win).
- Cannot be seen/heard by living.
- Pass through walls.
- Observe but cannot influence votes.

## Role Variants (Hide and Seek / Roles Mode 2021+)

- **Scientist**: can check vitals remotely.
- **Engineer**: can vent (as crewmate, limited).
- **Guardian Angel**: ghost role; shield living players once.
- **Shapeshifter** (impostor variant): disguise as another player briefly.

## Game Loop

```
Lobby → Round Start (assign roles)
  ↓
Round Play:
  Crewmate: navigate → do tasks → observe others
  Impostor: blend → sabotage → find isolated kills
  ↓
Event Trigger:
  Body reported / Emergency button / Sabotage-triggered-meeting
  ↓
Meeting:
  Discussion phase (timer, configurable ~60-120s)
  Voting phase (timer, ~30s)
  Resolve: eject (optional "confirm ejects" reveals role)
  ↓
Win Check:
  Crew: all tasks done OR all impostors ejected
  Impostor: parity OR sabotage timeout
  ↓
(loop until win) → Results screen → Return to lobby
```

## Core Interactions

### Tasks

Tasks categorized by type + location:
- **Common tasks**: all crewmates get same task (e.g., "Swipe Card"). Impostors cannot do them; lack of assignment is a tell.
- **Short tasks**: single-interaction (e.g., "Empty Trash").
- **Long tasks**: multi-step / time-gated (e.g., "Download Data" then "Upload Data"; "Submit Scan" takes 10s).
- **Visual tasks**: produce animation others can see (e.g., "Medbay Scan", "Empty Garbage", "Clear Asteroids"). Strong alibi when publicly witnessed.

Host configures total tasks per crewmate (typically 4-6).

### Kill

- Select target in melee range, click Kill button.
- Kill cooldown prevents spam (15-60s configurable).
- Animation shows impostor over body; rapid cleanup.
- Impostor can immediately vent to escape.

### Vent

- Press Vent on top of duct.
- Travel instantly to linked vent on same map.
- Vent network = map-specific; learn routes for efficient kills.
- Crewmates cannot vent (Engineer role variant exception).

### Report

- Find body, press Report.
- Triggers emergency meeting with body location marker.
- Free action; no cooldown.

### Sabotage

Impostor menu:
- **Lights**: reduces crew vision (impostor vision unchanged). No timer; fix at Electrical.
- **O2** (Skeld/Polus): 30-45s to crew loss. Fix at two terminals simultaneously.
- **Reactor**: 30-45s meltdown. Fix at two terminals simultaneously.
- **Comms**: disables task list + admin map. Fix at Comms.
- **Doors**: close specific room doors, trap/split crew. No fix needed; timer reopens.

Sabotage serves dual purpose: create kill opportunity (separate crew), or force loss timer.

### Meeting

- Body report or emergency button opens meeting.
- Everyone teleports to meeting table.
- Discussion timer (host-configured) → vote timer.
- Vote: eject a player or skip.
- Tie = nobody ejected.
- Host option: "Confirm Ejects" reveals if ejected was impostor.

### Emergency Button

- Limited per-player per-game (configurable, typically 1).
- Any crewmate can press in cafeteria/meeting room.
- Strategic: call when suspicious OR when forced to.

## Maps

Five maps, each ~12-20 rooms:

| Map | Size | Setting | Vents | Key Tasks |
|---|---|---|---|---|
| **The Skeld** | Small | Spaceship (original) | ~8 | Medbay Scan, Wires, Swipe Card |
| **MIRA HQ** | Small | Sky HQ | ~8 (all connected) | Assemble Artifact, Water Plants |
| **Polus** | Medium | Ice planet | ~12 (area-clustered) | Insert Keys, Fix Weather Nodes |
| **The Airship** | Large | Flying ship (added 2021) | ~12 | Spawn location choice, 20+ task types |
| **The Fungle** | Medium | Jungle island (2023) | Variable | Mushroom tasks, Zipline traversal |

See [Map Design](references/map-design.md) for details.

## UI

- Top-left: task list (crew) / sabotage menu (impostor).
- Top-right: mini-map (opens overlay).
- Bottom-right: context button (Use, Kill, Vent, Report).
- Emergency button trigger in cafeteria/meeting room.

Small vocabulary = accessible on mobile touch and PC click.

## Economy / Cosmetics

Free to play on mobile (ads); one-time purchase PC/console. Monetization via cosmetic DLC:
- Hats, skins, visors, pets, nameplates.
- Themed bundles (holidays, crossover).
- No gameplay advantage.
- Cosmetic only; no pay-to-win.

## Progression

Light progression:
- XP from matches → account level.
- Beans (free currency) from matches + daily login.
- Stars (premium currency) for purchase.
- Cosmicubes (collectible cosmetic packs).

No match-affecting unlocks; progression is social identity + collection.

## Multiplayer

- Host-authoritative architecture (host client is server).
- Host migration on disconnect (with varying reliability).
- Cross-platform play opt-in.
- Public matchmaking + private lobby codes.
- Quick-chat (preset phrases) for mobile + text chat.

## Design Philosophy

### Mechanics Serve Conversation

Every mechanic is a conversation hook. Visual tasks = alibi. Vents = "where did you come from?" Bodies = crime-scene reconstruction. Sabotage = "who had time?"

### Minimal Authored Content

A handful of maps and task types. Replay value from human unpredictability, not procedural content.

### Short Match Design

5-15 minute rounds mean quick re-queue. Loss doesn't sting; win doesn't plateau. Match-over-match rhythm supports long play sessions.

### Accessibility First

Runs on low-end phones. Small download. Minimal tutorial. Voice-chat optional (text works). No complex controls.

## References

- [3Cs Spec](references/3c-spec.md)
- [Social Deduction Design](references/social-deduction-design.md)
- [Map Design](references/map-design.md)
- [Progression Design](references/progression-design.md)

## Engine Overlays

- [Unity](engines/unity/GDD.md)
