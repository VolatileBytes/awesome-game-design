---
id: clash-royale
title: Clash Royale
version: 0.1.0
description: Real-time 1v1 mobile PvP deckbuilder played on a 3-lane arena. Players spend a regenerating elixir resource to deploy 8-card decks and destroy the opponent's towers inside a 3-minute match (plus overtime).
tags: [mobile, strategy, card-game, deckbuilder, tower-defense, pvp, real-time, competitive, free-to-play]
engines: [unity]
---

# Clash Royale GDD

## Elevator Pitch

Two players, one screen, a vertical arena split by a river. Each player has three towers — two side towers (princess towers) and one king tower at the back. You each have an **8-card deck** and a regenerating **elixir** meter capped at 10. Cards cost 2–9 elixir; some are single units, some are swarms, some are buildings, some are spells. You drag a card onto your half of the arena; it fights automatically. Destroy towers. Three minutes plus overtime. Touch the king tower to kill it and win instantly.

It is a card game where every "turn" is happening at the same time, and the table is also a tower-defense board.

## Design Pillars

1. **Elixir is the only true resource.** Everything in the game — card strength, counters, offense, defense — is denominated in elixir. Tight economy is the whole game.
2. **Reads and timing beat memorisation.** The 8-card deck and 4-card rotating hand make card memorisation trivial. The real skill is reading the opponent's intention and countering with correct timing.
3. **Matches end.** 3 minutes (+ 2 overtime if tied, + sudden death if still tied). No draws except at the highest ranks. Every match has a winner and a rhythm.
4. **Mobile-first UI.** Every interaction is touch. Cards fit in the bottom quarter of the screen. The arena fits in one portrait view with no panning.
5. **Short sessions, deep ranking.** A match is shorter than a loading screen on PC. Trophy progression is steep.

## Core Loop

**Seconds:**
- Elixir ticks up at 1 per 2.8 seconds (standard). During "double elixir" after the 2-min mark, 1 per 1.4 s.
- Player has 4 cards in hand, 4 cards in queue. Playing a card moves it to the back of the queue; the front card fills the hand.
- Drag-and-drop a card onto your side of the arena (or anywhere above the bridge for spells)
- Units path toward the nearest enemy tower
- Princess tower at 0 HP: destroyed, explodes. King tower activates if it hasn't already.
- King tower at 0 HP: instant match win.

**Match (3 minutes + possibly 2 + possibly 1):**
- 0:00–2:00 — normal elixir, most matches establish elixir-advantage here
- 2:00–3:00 — double elixir; offensive pushes land back-to-back
- 3:00 — if tied in tower count, 2 minutes of overtime (triple elixir for the last 30s historically)
- Overtime end — sudden death: whoever takes the next tower wins

**Meta (across matches):**
- Trophies up for a win, down for a loss
- Chest slots (max 4 queued) unlocked from match wins — timed unlock (3h / 8h / 12h / 24h)
- Chests drop gold + cards for your collection
- Cards upgrade via duplicates + gold (common → rare → epic → legendary → champion)
- Trophy thresholds unlock new arenas (new visuals + new cards in the pool)

## 3Cs (Summary)

- **Camera:** fixed, portrait, no zoom, no pan, shows the full arena
- **Character:** there is no "character" — the player is the deck + the hand
- **Controls:** drag card → drop on valid tile. Tap opponent emotes. Tap tower info.

See [references/3c-spec.md](references/3c-spec.md).

## Systems

### Elixir

- Capped at 10
- Regenerates at 1 per 2.8s (standard), 1 per 1.4s (double), 1 per ~0.93s (triple, sudden death)
- Displayed as a horizontal bar at the bottom of the screen, above the hand
- The opponent's elixir is **not** shown — players infer it by counting

### Cards & Hand

- Deck size: **exactly 8 cards** (not constructed on-the-fly, no drawing)
- Hand size: 4 cards + 1 next-in-queue preview
- Card played → goes to back of queue → returns after 4 other cards
- Card costs range from **1 (Skeletons) to 9 (Rocket, Mega Knight, Golem)**
- Average deck cost: ~3.8 elixir (balanced); cycle decks ~2.6; beatdown decks ~4.4

### Troops, Buildings, Spells

Three card types:
- **Troop** — one or more units that spawn, path, attack, die
- **Building** — stationary, timer HP, blocks path or attacks
- **Spell** — instant effect on an area (fireball, zap, poison, graveyard)

Each card has a role (tank, splasher, swarm, support, win-condition, spell, cycle) — good decks cover 4–6 roles with 8 cards.

### Arena & Pathing

- Arena is a tile grid (roughly 18 × 32)
- Split by a river with **two bridges** (one per lane)
- Princess towers block bridge entry
- Units ignore the river (except a few like Battle Ram skip)
- Units path **to the nearest tower**, preferring straight ahead until a closer target shows up
- This pathing rule is exploitable — "pulling" units off one lane with a defensive building on the other is a core skill

### Win Condition

- Destroy the king tower (instant win)
- At match end, whoever has destroyed more towers wins
- Tied → overtime → sudden death

### Deckbuilding

See [references/deck-and-card-design.md](references/deck-and-card-design.md). Summary:
- 8 slots must include at least one **win-condition** (a card that can take towers alone if untouched)
- Must include at least one **spell** (1–2 small, sometimes 1 big)
- Must cover air and ground threats
- Must cover swarm and single-target
- Must have at least one cycle card (≤2 cost) unless running a fat beatdown
- Elixir cost curve matters as much as card choice

## Progression

Trophy ladder, card collection, upgrades. See [references/progression-design.md](references/progression-design.md).

## Economy

Gold (upgrade currency), gems (premium), chests, Pass Royale (season pass), trade tokens. See [references/economy.md](references/economy.md).

## Balance Philosophy

Supercell's balance model:
- **Any given card is tuned against its expected counters at equal elixir.** A 4-elixir troop should be beatable by a well-played 3-elixir counter (positive trade) or break even against a 4-elixir counter.
- **Cycle decks, beatdown, bait, siege, and control should all be tier-1 viable**, even if each patch rotates which variant within each archetype is dominant.
- **Skill ceiling is pathing + timing.** At the top of the ladder, decks converge; what varies is micro (placement tiles, spell timing).
- **Balance patches every 2 weeks.** Minor stat tweaks, occasional card reworks. No wholesale deletions — even nerfed cards remain playable in the right shell.

## Failure Modes for New Implementers

- **Giving the player perfect information.** Hiding the opponent's elixir is load-bearing. If you show it, skilled play collapses into reactive play.
- **Client-authoritative unit spawning.** Opens desync and cheating. Rounds must be lockstep or server-authoritative. See Unity overlay.
- **Balancing at the card level rather than the matchup level.** "Nerf X" is the wrong question. "What matchup is broken?" is the right one.
- **Over-rewarding win streaks.** The progression can feel forced if a weak player wins 10 in a row and jumps arenas; conversely a strong player on a loss streak shouldn't drop 4 arenas.
- **Ignoring the elixir-leak loss pattern.** New players lose matches not by making bad trades, but by letting elixir cap. Tutorial must teach this explicitly.

## Out of Scope / Non-Goals

- 2v2 team modes (the core 1v1 is the design; 2v2 is a satellite feature and should be implemented only after 1v1 is solid)
- Deck-building during a match (the 8 cards are locked)
- Card trading between players (Supercell's trade tokens are intentionally heavily gated)
- Single-player campaign (training battles are tutorial-only; no persistent PvE)

## References

- [3Cs Spec](references/3c-spec.md) — camera, drag-drop controls
- [Progression Design](references/progression-design.md) — trophies, arenas, card upgrades
- [Economy](references/economy.md) — gold, gems, chests, Pass Royale
- [Deck & Card Design](references/deck-and-card-design.md) — card classes, deck archetypes, balance rules

## Engine Implementations

- **Unity** — see `engines/unity/GDD.md`
