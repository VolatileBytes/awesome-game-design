# Card and Class Design

Hearthstone has ~4000+ cards (including Wild); the design language is highly refined. This doc captures the principles that produce cards that feel fun, are balanced, and reinforce class identity.

## Card Anatomy

| Field | Role |
|---|---|
| **Cost** | Mana crystals needed |
| **Name** | Warcraft universe; recognizable |
| **Type** | Minion / Spell / Weapon / Hero / Location |
| **Class** | Mage / Warrior / etc. (or Neutral) |
| **Rarity** | Free, Common, Rare, Epic, Legendary |
| **Tribe** (minions) | Beast, Demon, Dragon, Elemental, Mech, Murloc, Pirate, Undead, Quilboar, Naga, Totem |
| **Attack** (minion/weapon) | Damage dealt on attack |
| **HP** (minion/hero) | How much damage before death |
| **Durability** (weapon) | Number of attacks before breaking |
| **Keyword** | Taunt, Divine Shield, Charge, Rush, etc. |
| **Text** | Card-specific effect |
| **Art** | Full-art illustration |
| **Flavor** | Optional one-liner (only on full card view) |

## Stat Budget (Minions)

Rough vanilla-minion curve (no ability, no tribe):

| Cost | Attack/HP |
|---|---|
| 1 | 1/1 (The Imp) or 2/1 |
| 2 | 3/2 or 2/3 |
| 3 | 3/3 or 4/3 |
| 4 | 4/5 or 5/4 |
| 5 | 5/6 |
| 6 | 6/7 |
| 7 | 7/7 (Boulderfist Ogre) |
| 8 | 8/8 |

Effects trade stats down: a 4-cost 4/4 with Taunt + Divine Shield is a strong card; a 4-cost 5/6 vanilla is also strong.

## Class Identity

Each class has a handful of **flavored mechanics**:

| Class | Flavor Mechanics |
|---|---|
| Mage | Freeze, Secrets, Spell Damage, Elementals |
| Warrior | Armor, Enrage, Weapon synergy, Pirates |
| Priest | Healing, Bounce (return to hand), Shadow |
| Paladin | Token tribe (1/1s), Divine Shield, Librams |
| Rogue | Combo (2nd+ card per turn), Stealth, Weapons |
| Shaman | Overload (1 cost of next turn borrowed), Totems, Elementals |
| Warlock | Self-damage for value, Demons, Life-tap (Hero Power) |
| Hunter | Beast synergy, Secrets, Direct damage, Aggression |
| Druid | Ramp (mana advantage), Choose-One, Big minions |
| Death Knight | Runes, Undead tribe, Corpse synergy |
| Demon Hunter | Attack-self synergy, Demons, Aggression |

**New expansion cards** must reinforce a class's core flavors while introducing a fresh twist. Diluting identity across classes makes them homogenize.

## Card Text Rules

### Rule 1: Readable in 3 Seconds
If it's longer than ~15 words, re-write it. Compress via keywords.

### Rule 2: Use Keywords Before Custom Text
**"Taunt"** > "This minion must be attacked before other targets."

### Rule 3: Be Numerical When Possible
"Deal 3 damage" > "Deal a small amount of damage."

### Rule 4: Specify Timing
"Battlecry" (on play), "Deathrattle" (on death), "Start of your turn", "End of your turn", "When you X", "After your hero Y" — all precise.

### Rule 5: Single Effect Per Card (Usually)
Layered effects make cards read long. Exceptions exist for Epics/Legendaries where multiple synergistic effects are the point.

## Keyword Design

Keywords let cards share text efficiently. New keywords are introduced in expansions:

| Keyword | What it does |
|---|---|
| Taunt | Must be attacked first |
| Divine Shield | Absorbs first damage |
| Charge | Attack the turn played |
| Rush | Attack the turn played, minions only |
| Stealth | Untargetable until you attack |
| Deathrattle | Effect on death |
| Battlecry | Effect on play |
| Lifesteal | Damage heals you |
| Poisonous | Destroy on damage |
| Windfury | 2 attacks per turn |
| Echo | Can play again this turn |
| Discover | Pick 1 from 3 options |
| Spellburst | Triggers after next spell |
| Magnetic | Mechs combine |

New keywords are introduced sparingly (1–2 per year) and must feel **evergreen** — they work in many card designs.

## Card Archetype Design

Each class has ~3 archetypes supported at any time:

- **Aggro**: fast pressure, low-cost minions, face damage (Hunter, Demon Hunter, some Warrior builds)
- **Midrange**: balanced curve, tempo-focused (Paladin, Druid ramp)
- **Control**: stall, board clears, finishers (Priest, Warrior, Mage Control)
- **Combo**: specific card synergies for burst (Rogue Miracle, OTK variants)
- **Tempo**: play efficient threats, maintain pressure (most viable decks)

A class should have **1–2 viable archetypes** each expansion. If all 10 classes do the same thing, the meta is flat.

## Archetype Package Design

New expansion cards for a class are designed in "packages":
- A **new mechanic** (e.g., "Infuse": card grows with damage dealt)
- **Supporting minions** that benefit
- **Spells** that synergize
- **Legendary anchor** — a signature card showing the archetype's power

Pack-opening feels rewarding when you get multiple cards from the same package.

## Legendary Design

Legendaries are **named characters**. They're cards you *remember*:
- Usually high-impact effects
- Unique illustrations + voiceover line
- Limit 1 per deck
- Often the **win condition** of a deck (Thaddius, Reno Jackson, Kazakus)

## RNG Design

Hearthstone leans into RNG but tries to keep it **fun-random** not **frustrating-random**:
- **Yogg-Saron** (random spell spam) = iconic, fun
- **Random discover** (pick 1 of 3) = fun, player-agency-added RNG
- **"Destroy a random minion"** = bad when it always picks the worst target for you

**Design rule**: RNG should be **player-surprising**, not **opponent-punishing**. If you're rooting for an RNG to NOT hit, it's bad RNG.

## Hero Power Design

Each hero has a 2-mana hero power that reinforces class identity:
- **Steady**: not game-winning on its own, but synergizes with deck
- **Infinite value**: can be used every turn → affects long-game planning
- **Identity**: reading the hero power tells you the class

Hero Power changes are rare; they're **evergreen foundational**.

## Balance Process

- **Internal playtest**: design team plays with cards
- **Soft launch**: a few days of live play
- **Stats scrape**: winrate per deck, win rate per card included
- **Patch**: nerf/buff cards 2-4 weeks into the expansion
- **Dust refund**: nerfed cards return full dust if you craft refund them; eases player pain

## Balance Signals

- Card in 60%+ of meta decks in a class → likely too good
- Card in 0% of meta decks after 3 weeks → likely under-tuned or archetype dead
- Deck at 60%+ winrate → needs nerf to a key card or package
- Class at 0 viable decks → buff core cards

## Anti-Patterns

- **Power creep**: every new set needs stronger cards than the previous → old cards become unusable
- **Solitaire decks**: decks that play themselves with no opponent interaction (OTK combos) feel bad to play against
- **Coin-flip openers**: if the first 2 turns decide the match, it's broken
- **Unplayable commons**: packs feel bad if most of the pulls are never played
- **RNG without agency**: random damage to random target is more punishing than random-pick-of-3

## Card Release Cadence

- **~135 cards per expansion**, 3 expansions per year = ~400 new cards/year
- Each class gets ~10 class cards per expansion + neutrals
- Packaged: each class typically gets 2 archetype packages per expansion
