# Boon System — Hades

Boons are Hades's equivalent of deckbuilder cards: per-run stat/effect grants from the Olympian gods, tied to specific action slots.

## Slots

A Zagreus run has these **Boon slots**:

- **Attack** — modifies your weapon's main attack.
- **Special** — modifies your weapon's special.
- **Cast** — modifies your Bloodstone cast.
- **Dash** — modifies your dash (adds damage / status on dash contact).
- **Call** — your Call of the God (choose 1 of 2 options from the god whose Call you have).
- **6+ minor slots** — passive effects not tied to an action.

Each slot can only hold one "primary" Boon per god; you can have multiple passive slots. Typically a run has 10–20 Boons by end.

## Rarity Tiers

| Rarity | Drop weight | Color | Effect strength |
|---|---:|---|---|
| Common | 80% | Blue | baseline (e.g. +30 attack damage) |
| Rare | ~15% | Green | +50–80% stronger |
| Epic | 4% | Purple | +100–200% stronger |
| Heroic | ~1% | Gold | unique heroic-exclusive effect |
| Duo | special | Multi-color | requires 2 gods at Rare+ on specific slots |
| Legendary | special | Multi-god | requires Duo prereqs |

**Pom of Power** (fruit pickup) levels up a random Boon by 1; a single Boon can level to 10+.

## Offer Structure

Entering a god's room:
- Present **3 Boons** to choose 1.
- Options are filtered by: slots you already have, god's pool, rarity seeded by Mirror perk "Fated Authority."
- Can reroll once (if Fated Authority) or swap (if Hermes's Bonus Dash-like consumables).

If two gods "argue" over slots (e.g. both want your Attack slot), the god entering later offers a **Duo possibility** if the prereqs are met — this is the combo engine.

## Example Boons

### Zeus

| Boon | Slot | Effect |
|---|---|---|
| Lightning Strike | Attack | +24–60 damage, jolts foes |
| Thunder Flourish | Special | AoE shock on special |
| Thunder Dash | Dash | Chain lightning on dash-through |
| Storm Lightning | (meta) | cast shocks all foes in room |
| Ionic Gain | (meta) | chance to find +obol on kill |

### Aphrodite

| Boon | Slot | Effect |
|---|---|---|
| Heartbreak Strike | Attack | +80% dmg, applies Weak |
| Passion Dash | Dash | dash applies Weak |
| Broken Resolve | (meta) | Weak lasts +3s |

### Duo example

**Curse of Drowning** (Poseidon + Dionysus): Hangover additionally deals knockback on each tick.

### Legendary example

**Zeus's Heaven's Vengeance**: every 5 hits you take, call down area lightning. Needs Epic-rarity Boon on enemies from Zeus.

## Pricing (shop)

In **Charon's shops**, Boons and utility items cost obol:

- Common Boon: 80 obol
- Rare: 130
- Epic: 200
- Heroic: 300
- Pom: 80 base (scales up per prior Pom)

## Data Model

```
BoonDefinition {
  id: string
  god: God
  slot: Slot            // Attack, Special, Cast, Dash, Call, Passive
  rarity: Rarity        // Common..Heroic / Duo / Legendary
  prereqs: list<BoonRef>  // for Duo/Legendary
  tier: int             // 1..10 (Pom levels)
  effectPerTier: table  // damage/duration/stack per tier
  icon: Sprite
  description: LocalizedString
}

BoonOffer {
  boons: [3 choices]
  canReroll: bool
  canSwap: bool
}
```

## Synergy Archetypes

| Archetype | Key gods | Strategy |
|---|---|---|
| Crit stacking | Artemis + Athena | dash-strike crits, high burst |
| Chill lockdown | Demeter + Ares | freeze enemies with Doom |
| Weak fog | Aphrodite + Dionysus | slow kills via stacked debuffs |
| Lightning rod | Zeus + Artemis | chain crits through mobs |
| Elemental stacking | Zeus + Demeter + Poseidon | elemental damage types trigger bonuses |

Build awareness → a Boon offer isn't "take the strongest," it's "what fits my plan."

## Implementation Notes

Boons are ScriptableObjects. Each has:
- An **event subscription** (what triggers it): `OnAttackHit`, `OnCastLaunch`, `OnDashIntoEnemy`, `OnTakeDamage`, `PerRoomEnter`.
- An **effect graph** (same node system as cards would be in a deckbuilder): `DealDamage`, `ApplyStatus`, `GrantTempEffect`, `ModifyStat`.

This mirrors Slay the Spire / Balatro's effect graph pattern — data-authored Boons avoid `if` soup in code.

## Balance Tuning

Supergiant's own design doc style ranks Boons on a matrix:
- **Solo strength** (how good is it alone?)
- **Synergy potential** (does it enable combos?)
- **Build-around factor** (does taking it change your other picks?)

Goal: no Boon is "auto-take" at all rarities. Aphrodite's common Heartbreak Strike is mid-tier; Zeus's Heroic Lightning Strike is run-defining.

## Common Issues in Rebuilds

- **Status stacking math**: multiplicative vs. additive for damage status matters. Hades uses **additive within categories, multiplicative across**.
- **Visual clutter**: too many active Boons → SFX spam. Budget: max 3 hit-VFX layers at once; beyond that, composite the effect.
- **Tooltip complexity**: a Tier 10 Duo Boon's math chain spans 4 lines; test readability on mobile/Switch screens.
