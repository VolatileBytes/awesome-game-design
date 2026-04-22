# Card Design — Slay the Spire

The deck is the strategy. Every card must be evaluated against deck size, energy curve, synergy, and the 50-card-run's variance curve.

## Card Fields

```
name: Strike
cost: 1 energy
type: Attack
rarity: Starter | Common | Uncommon | Rare
target: single | all-enemies | self | random
effect: Deal 6 damage.
upgraded_effect: Deal 9 damage.
keywords: [] (Ethereal, Exhaust, Retain, Innate, Unplayable)
character: Ironclad | Silent | Defect | Watcher | Colorless
```

## Card Types

| Type | Purpose | Examples |
|---|---|---|
| Attack | Deal damage | Strike, Bash, Whirlwind |
| Skill | Block, draw, utility | Defend, Survivor, Prepared |
| Power | Persistent buff/effect, resolves to the stack | Inflame, Demon Form, Heatsinks |
| Status | Junk that clogs the deck; usually 0-cost unplayable | Wound, Dazed, Slimed |
| Curse | Worse junk; typically unplayable + a penalty | Writhe, Regret, Necronomicurse |

## Rarity Distribution

- **Starter**: initial deck (5 Strikes + 5 Defends + 1 class-specific + 1 special).
- **Common**: 60% of draft rolls.
- **Uncommon**: 37%.
- **Rare**: 3% (higher after elites, guaranteed at act end).

## Energy Curve

Default energy: **3 per turn**. Most cards cost 0, 1, or 2; rare cards may cost 3 (a whole turn) or X (spend all energy).

Rule of thumb for deck curve:
- ~20–30% 0-cost cards (shivs, draw, tempo)
- ~50% 1-cost cards (bread and butter)
- ~15% 2-cost (power plays)
- ~5% 3+ cost (bombs)

Anything outside this drifts into "brick" territory — cards you can't play when drawn.

## Synergy Archetypes

Each character has 3–5 archetypes. A run commits to one or two, shaped by what you draft:

### Ironclad

- **Strength**: scale attack damage via Flex, Demon Form, Inflame.
- **Exhaust**: payoff for exhausted cards (Dark Embrace, Feel No Pain).
- **Barricade**: preserve block across turns.
- **Self-damage**: Blood for Blood discount + Combust + Brutality.

### Silent

- **Poison**: Noxious Fumes, Catalyst, Bouncing Flask.
- **Shivs**: Blade Dance, Accuracy, Finesse.
- **Discard**: Reflex, Tactician, Acrobatics.
- **Card-draw engines**: Footwork, Backflip.

### Defect

- **Orb generation**: Lightning (dmg), Frost (block), Dark (scaling dmg), Plasma (energy).
- **Evoke / reboot**: cash in orbs for burst.
- **Focus scaling**: +orb output.

### Watcher

- **Stance dancing**: Wrath×2 dmg, Calm +2 energy on exit, Divinity ×3 dmg.
- **Mantra counter**: stack mantras for free Divinity.
- **Retain**: keep key cards in hand across turns.

## Card Upgrades

- Done at rest sites (campfire) or via specific cards/relics.
- Most cards gain +1 damage/block, extra draw, or reduced cost.
- Some cards change mechanic entirely (e.g. Armaments upgrades *all* cards in hand; Searing Blow scales quadratically with each upgrade).

## Draft Economics

Post-combat reward: pick 1 of 3 cards, or skip.

Draft heuristics:
- **Skip is legal**: thin deck beats thick deck.
- **Reject low-impact cards** even if nothing else is offered; junk dilutes your deck's draw chance for your power cards.
- **Commit to a build** by floor 15–20; drafting across 3 archetypes rarely works.

## Deck Balance Knobs

- **Card removal cost** in shops (75→125→150→175 gold each) — limits deck thinning.
- **Relic that upgrades during combat** (Whetstone, War Paint) — free upgrades but random.
- **Card rewards per combat type**: common < elite < boss (rewards scale with difficulty).

## Telegraphing

Every card has:
- A frame color by type (red=attack, green=skill, purple=power, black=status, black-with-red-eyes=curse).
- A cost gem (top-left).
- A target icon (bottom) for targeting cards.

These read at a glance in hand — players should never have to squint at a card to know its category.
