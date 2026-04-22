# Combat Design — Slay the Spire

Turn-based, information-complete (no hidden enemy actions), single-player. Every fight is a resource-allocation puzzle.

## Turn Structure

```
Start of combat:
  Apply start-of-combat relic effects
  Shuffle draw pile; draw starting hand (5)
  Enemies pick initial intents

Player turn:
  Gain energy (3 default)
  Apply start-of-turn card effects (e.g. Regen, Metallicize auto-block)
  Loop: player plays cards until stuck or ends turn
  End turn → discard hand (unless Retain), card effects end-of-turn

Enemy turn:
  Enemies resolve intents in order
  Apply end-of-turn enemy effects (buffs tick up, debuffs tick down)
  Enemies pick next-turn intents

Repeat player + enemy turns until one side dies.

Victory: card draft + gold reward; continue to map.
```

## Intents

Each enemy shows one of these icons above their sprite:

| Intent | Meaning |
|---|---|
| Sword + number | Attack for N damage |
| Multiple swords | Multi-attack (e.g. 3×4 dmg) |
| Shield | Defend (gain block) |
| Buff | Self buff (e.g. +strength) |
| Debuff | Debuff you (e.g. apply Weak) |
| Sleep | Skip turn |
| Stun (dagger) | Attack + debuff combined |
| Unknown (?) | Deliberately hidden (rare) |

Players plan against known intents, so enemy move sets must feel fair given full information. Surprising a player with an unlisted attack is anti-pattern.

## Damage Pipeline

```
incoming_damage
  × (1 + vulnerable ? 0.5 : 0)      # Vulnerable
  − block                            # Block absorbs first
  → HP loss (never negative)
```

Outgoing damage:

```
base_damage
  + strength (per attack, per hit)
  × (1 − weak ? 0.25 : 0)           # Weak reduces outgoing
  × (target_vulnerable ? 1.5 : 1)
  → target.take_damage()
```

Block doesn't carry between turns unless specifically preserved (Barricade relic, Calipers relic reduces decay).

## Status Effects

### Debuffs

- **Vulnerable**: +50% damage taken; decrements 1/turn.
- **Weak**: −25% damage dealt; decrements 1/turn.
- **Frail**: −25% block gained; decrements 1/turn.
- **Poison**: take N damage at turn start; decrements 1.
- **Confused**: card costs randomize each draw (curse only; permanent).
- **No Draw**: draw 0 next turn; decrements 1/turn.

### Buffs

- **Strength**: +1 damage per attack hit per point.
- **Dexterity**: +1 block per block card per point.
- **Intangible**: all damage reduced to 1 for the turn.
- **Artifact**: cancel next debuff application.
- **Regen**: heal N at turn start.
- **Metallicize**: auto-block N at turn start.

## Combat Types

| Type | Floor rarity | Reward |
|---|---|---|
| Common | Most frequent | 1-of-3 common/uncommon card, gold, potion roll |
| Elite | Fixed map nodes | 1-of-3 incl. rare card, relic, extra gold |
| Boss | End of each act | 1-of-3 incl. rare card, boss relic, act transition |

Enemy HP + damage scale per act. Act 3 common monsters hit harder than Act 1 elites.

## Boss Design

Each act has 3 possible bosses, randomized per run:
- **Act 1**: Slime Boss, Hexaghost, Guardian
- **Act 2**: Bronze Automaton, The Collector, Champ
- **Act 3**: Awakened One, Donu & Deca, Time Eater

Each boss forces a different strategy:
- Time Eater ends your turn after 12 cards played → punishes 0-cost spam.
- Hexaghost's first attack hits for (current HP / 12) × 6 → punishes coming in at full HP.
- Awakened One transforms at <50% HP with more attacks → punishes poison strategies.

## Elite Design

Elites have guaranteed relic drops but punish common build weaknesses:
- Gremlin Nob buffs on skills → punishes block-heavy decks.
- Lagavulin debuffs over time → punishes slow poison builds.
- Sentries in 3-pack → punishes weak AoE.

Seeing an elite intent early is a strategic clue about what to draft.

## Potions

- 0-to-3 active potion slots (relic expands).
- Drop from combat (not guaranteed; % chance).
- Drink-once emergency buttons (energy, healing, damage, card cycling).
- Sell at shop for gold or keep for clutch turns.

## Ascension Changes

Each ascension tier adds one rule:
- A1: elites spawn more often
- A5: player max HP −5
- A9: stronger enemy variants spawn
- A14: elites hit harder
- A17: stronger boss variants
- A20: double boss (fight 2 bosses at final floor)

Compound: A20 = all of A1–A19 simultaneously.
