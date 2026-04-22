---
id: slay-the-spire
title: Slay the Spire
version: 0.1.0
description: Turn-based single-player deckbuilder roguelike. Ascend a three-act spire with one of four characters, drafting cards and relics between turn-based battles against enemies whose next actions are telegraphed each turn.
tags: [pc, mobile, deckbuilder, roguelike, card-game, turn-based, single-player, indie, strategy]
engines: [unity]
---

# Slay the Spire

Slay the Spire crystallized the deckbuilder-roguelike genre. Each run: pick a character, climb three acts of branching map nodes (combat, elite, event, shop, rest, treasure, boss), build a deck from post-combat card drafts, collect relics with permanent effects, and try to reach the top of the spire before your HP runs out.

## Pillars

1. **Telegraphed intents** — enemies show their next attack/buff above their sprite each turn. Every combat decision is information-complete; RNG lives in your draw, not the enemy.
2. **Meaningful drafts** — after each combat you choose 1 of 3 cards to add to your deck (or skip). The deck is the player's strategy expression; thicker isn't better.
3. **Relic synergies** — relics are permanent run-long effects. Combining a relic with a card archetype creates run-defining builds.
4. **Ascension ladder** — 20 difficulty tiers that change the ruleset (tougher elites, more negative events, boss gains an extra attack). The floor for mastery is infinite.
5. **Four characters, four decks** — Ironclad (strength/exhaust), Silent (poison/shivs), Defect (orbs/focus), Watcher (stances/scaling). Fully distinct card pools.

## Core Loop

```
Pick character → map overview → pick node → resolve node (combat/event/rest/shop)
  → if combat: draft 1-of-3 cards, gold, HP drain
  → pick next node → repeat until boss → next act → repeat → final boss
```

Run length: ~45–90 minutes. Failure is expected; runs stack for meta-progression via the ascension ladder and unlocked card/relic pools.

## Combat

- **Turn structure**: player draws 5, plays cards (cost energy, default 3/turn), ends turn, enemies execute their telegraphed intents, then monsters pick new intents.
- **Card types**: Attack (deal damage), Skill (block / utility), Power (persistent effect), Curse (junk / negative), Status (junk / temporary).
- **Block** resets each turn unless a relic/card preserves it — so blocking is a one-turn-at-a-time decision.
- **Status effects (non-exhaustive)**: Vulnerable (+50% damage taken), Weak (−25% damage dealt), Strength/Dexterity (+atk/+block per point), Poison (damage over turns), Frail (−25% block gained).
- **Energy** is the scarcest resource; deck construction is essentially about your energy curve.

## Map Node Types

| Node | Effect |
|---|---|
| Combat | Standard monster fight; card draft + gold + HP loss |
| Elite | Tougher fight; guaranteed relic drop + bigger draft |
| Event | Random narrative event with skill checks / choice outcomes |
| Shop | Spend gold on cards, relics, potions, or card removal |
| Rest (campfire) | Choose heal 30% OR upgrade one card |
| Treasure | Free relic |
| Boss | Act-ender; pick 1 of 3 boss relics (high-power with drawback) |

## Characters

- **Ironclad**: strength scaling, exhaust mechanics, self-damage tradeoffs, barricade walls of block.
- **Silent**: poison stacking, shivs (0-cost attacks), discard synergies, draw-engine archetypes.
- **Defect**: orb channel/evoke (Lightning, Frost, Dark, Plasma), focus scaling, energy-gen compounders.
- **Watcher**: stance dancing (Wrath doubles dmg, Calm gens energy, Divinity tripled dmg), mantra scaling.

## Meta-Progression

- **Ascension 1–20**: per-character difficulty ladder, unlocked by beating the final boss.
- **Card/relic pool unlocks**: certain cards/relics unlock after N floors climbed with each character.
- **Achievements**: cosmetic plus unlock triggers.
- **No currency / no shop**: progression is pure skill + unlock.

## Original Engine

Built in Java with LibGDX. Mobile port uses Unity (Humble Games / Mega Crit). For rebuilds, Unity is the most accessible target.

## References

- [3C Spec](references/3c-spec.md)
- [Card Design](references/card-design.md)
- [Combat Design](references/combat-design.md)
- [Progression Design](references/progression-design.md)
- [Economy](references/economy.md)
- [Unity Implementation](engines/unity/GDD.md)
