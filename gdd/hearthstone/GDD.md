---
id: hearthstone
title: Hearthstone
version: 0.1.0
description: Turn-based collectible card game with mana crystals, hero classes, minion board combat, and spells. The archetypal modern digital CCG.
tags: [mobile, pc, card-game, ccg, turn-based, class-based, pvp, free-to-play]
engines: [unity]
---

# Hearthstone

Blizzard's 2014 card game that defined the modern digital CCG. A player is a **hero** of one of 10–12 classes, wields a 30-card deck, draws and plays cards on alternating turns, attacks with minions, casts spells, aims to bring the opposing hero's 30 HP to zero.

## Pillars

1. **Class identity** — each class has a unique mechanic + signature cards
2. **Board state matters** — minion combat is the tactical core
3. **RNG as spice** — random effects create stories, not frustration
4. **Legibility over depth** — every card is understandable in one read

## Genre

Turn-based class-based CCG. Ancestors: Magic: The Gathering (stripped of land management and stack rules for a simpler digital form). Modern cousins: Legends of Runeterra (more tactical), Marvel Snap (more compressed), Eternal (MtG-like).

## Core Loop

1. Build a 30-card deck from a class + neutral pool
2. Queue into a match (ranked or casual)
3. Play out the match (5–20 minutes)
4. Earn XP + gold + rewards
5. Open packs → craft cards → deepen collection
6. Climb ranked ladder / complete events

## Rules Recap

### Deck
- **30 cards**, max 2 copies of any one card (1 copy of Legendary)
- **Hero class** determines available class cards (Mage, Warrior, Priest, etc.)
- **Neutral** cards playable by all classes

### Hero
- **30 HP** at match start
- Each hero has a **Hero Power**: a 2-mana activated ability (class-specific)
  - Mage: "Deal 1 damage"
  - Priest: "Restore 2 HP"
  - Warrior: "+2 Armor"
  - Rogue: "Equip a 1/2 Dagger"
- Heroes can be armored up via cards; armor absorbs damage before HP

### Mana
- **Turn 1**: 1 mana crystal
- Each turn: +1 mana crystal, up to 10
- Mana refills each turn
- Mana can be generated temporarily via cards

### Card Types
- **Minion**: stays on the board; has attack, HP, maybe keywords
- **Spell**: one-shot effect
- **Weapon**: equip; attack for X damage; degrades with use
- **Hero card**: replace your hero mid-match (rare, specific cards)
- **Location** (later expansion): persistent effect; usable per-turn

### Board
- Up to **7 minions** per side
- Minions cannot attack the turn they're summoned (Summoning Sickness) unless they have **Charge**/**Rush**

### Attacks
- A minion or weapon attacks: both attacker and target deal their attack to each other's HP
- If a minion's HP reaches 0, it dies and goes to the discard
- Hero attacks opposing hero or minions

### Keywords
- **Taunt**: must be attacked before other targets
- **Divine Shield**: first damage is absorbed
- **Charge / Rush**: attack the turn played (Rush can't hit hero)
- **Stealth**: can't be targeted until it attacks
- **Deathrattle**: effect when minion dies
- **Battlecry**: effect when minion played
- **Lifesteal**: damage heals your hero
- **Poisonous**: destroys any damaged minion regardless of HP
- **Windfury**: attack twice per turn

### Match End
- Opposing hero's HP ≤ 0 → you win
- Simultaneous HP 0 → draw

### Mulligan
- Start with 3 (first player) or 4 (second player + "The Coin" = 1 free mana) cards
- Mulligan any subset once before match starts

## Class Design

10 classes (as of core era; more added via expansions):

| Class | Identity |
|---|---|
| **Mage** | Spell damage, burn, Elementals |
| **Warrior** | Armor, aggro pressure, Pirates |
| **Priest** | Healing, bounce, control |
| **Paladin** | Tokens, buffs, divine shield |
| **Rogue** | Combo, stealth, weapons |
| **Shaman** | Elementals, overload (future-mana borrow) |
| **Warlock** | Self-damage for value, demons |
| **Hunter** | Aggression, beasts, direct damage |
| **Druid** | Ramp, big minions, choose-one |
| **Death Knight** | Runes, undead theming (newer) |
| **Demon Hunter** | Aggressive, attack-self synergy (newer) |

Class design principle: each class has a **clearly readable archetype** and a couple of **signature mechanics**. A Hunter always feels like Hunter.

## Formats

- **Standard**: only the two most recent years of expansions + Core set
- **Wild**: all cards ever released; Wild-only meta
- **Classic**: the 2014 launch set, frozen meta
- **Arena**: draft mode — build a deck from random picks
- **Battlegrounds**: separate auto-chess minion-battler mode, huge success
- **Duels**: rogue-like deckbuilder (legacy mode)
- **Mercenaries**: RPG-flavored side mode (legacy)
- **Tavern Brawls**: weekly casual modes with unique rules

## Match Flow

- **Mulligan**: 30s
- **Turns**: 75–90 seconds each; rope burns down
- **Turn actions**:
  1. Draw (free)
  2. Play cards in any order (as long as mana allows)
  3. Attack with minions/weapon in any order
  4. Use Hero Power (once per turn, 2 mana)
  5. End Turn

Typical match: 5–20 minutes.

## Progression

See [references/progression-design.md](references/progression-design.md). Rewards track per-class XP, Achievements, Ranked Ladder, and seasonal events.

## Monetization

See [references/economy.md](references/economy.md). Packs + Gold + Arcane Dust (crafting) + Tavern Pass.

## References

- [3Cs spec](references/3c-spec.md)
- [Progression design](references/progression-design.md)
- [Economy](references/economy.md)
- [Card and Class design](references/card-design.md)

## Engine overlays

- [Unity implementation](engines/unity/GDD.md)
