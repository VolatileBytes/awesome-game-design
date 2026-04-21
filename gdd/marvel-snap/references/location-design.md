# Location Design

Locations are the defining innovation of Marvel Snap. They turn every match into a new puzzle: the board changes before you've made your first move. This doc captures how they're designed and balanced.

## Why Locations Exist

Before Marvel Snap, CCG matches were defined by **you vs. opponent's deck on a neutral board**. Snap asks: **what if the board itself were a third actor**?

- Adds variety: each match feels fresh
- Levels the meta: a degenerate deck meets a hostile location
- Rewards adaptability over rote memorization
- Creates "storytelling moments" — "I won because the random location buffed my 1-drops"

## Location Anatomy

| Field | Role |
|---|---|
| **Name** | Marvel reference (Asgard, Wakanda, Bar With No Name, etc.) |
| **Art** | Full-lane backdrop |
| **Effect** | 1–2 sentence rule |
| **Rarity** | How often it appears in rotation |
| **Weight** | Higher-weight = more frequent |

## Reveal Cadence

- **Turn 1**: first location revealed
- **Turn 2**: second location revealed
- **Turn 3**: third location revealed
- **Turns 4–6**: all locations visible

This means: **early turns are partial info**. You play into locations you haven't seen yet.

## Effect Categories

### Restrictive

Limits what can play here.

- **Muir Island**: cards played here get -1 power
- **Death's Domain**: destroy cards played here
- **Mojoworld**: 4 mana cost here

Good for slowing matches, favoring adaptive decks.

### Rewarding

Buffs cards played here.

- **Ego**: cards here get +2 power
- **Asgard**: player winning here draws an extra card
- **Wakanda**: cards here can't be destroyed

Pushes commitment — play your big cards here.

### Disruptive

Messes with the normal flow.

- **The Vault**: locks after turn 3 (no new cards)
- **Odin's Cave**: swap your hand for your deck
- **Lady Deathstrike**: at end of turn 4, destroy each card at this location with <3 power

Creates mini-puzzles; rewards flexibility.

### Transformative

Changes cards.

- **Transformer** locations: turn cards into random cards of the same cost
- **Luke's Bar**: cards played here are randomly duplicated

These are fun but high-variance; over-represented = complaints.

### Global

Changes rules for the whole board.

- **Limbo**: game has 7 turns instead of 6 (🤯)
- **Negative Zone**: cards cost +1 mana everywhere
- **Quiet Council**: 4-card limit per location → 3-card limit

Adjust the whole game state — rare but memorable.

## Design Rules

### Rule 1: No Locations Favor One Deck Type Too Much

If a location *always* helps Discard decks and hurts Ongoing decks, it's bad. Locations should tilt the field but leave room for clever play on either side.

### Rule 2: Locations Should Be Legible Quickly

A player glances at the location, reads once, understands. If the effect needs multiple paragraphs or interaction explanation, cut it.

### Rule 3: Non-Obvious Interactions Are the Fun

- "Play a card here → destroy it" + "Destroy payoff" cards → interesting
- "Cards here have +2 power" + "Move cards here" → interesting

Design locations to **enable unexpected synergies**, not just to be standalone effects.

### Rule 4: Tempo-Aware

Locations that reveal on turn 1 vs turn 3 have different impact:
- **Turn 1 location** is scouted early; decks adapt
- **Turn 3 location** is revealed after commitments; it **disrupts plans**

Balance the pool so turn-3 locations aren't all game-breakers.

## Rotation

- A **"hot pool"** of ~30 locations appears at higher rates
- Full pool of **100+** locations is in rotation, some very rare
- **"Hot locations this week"**: highlighted in UI so players know what's coming

## Disabling Bad Locations

Players hate some locations (too random, too punishing, too swingy). Supercell^H^H^H Second Dinner does:
- **Remove the worst** (Bar With No Name was frequently disabled)
- **Tune weights**: reduce frequency of unpopular locations
- **Rework** via seasonal revisions

## Competitive Mode

In Ranked & Conquest, the **location pool is the same** — no curated subset. Players learn to adapt across the whole pool.

## Telemetry

- Win rate when a location is present
- Card usage rates per location (what decks/cards appear)
- Player survey: which locations feel unfair
- Match-length impact: do certain locations extend or compress games?

## Community Feedback

Snap community is vocal about locations. Reddit has weekly "rank the locations" threads. The team:
- Communicates openly about upcoming changes
- Patches quickly when a location is broken
- Adds *fun* locations, not just balanced ones

This loop makes players feel heard and keeps the location pool evolving.

## Anti-Patterns

- **RNG-heavy locations that decide matches at turn 1**: if a coin flip on turn 1 determines the winner, the location is bad
- **Locations that nullify large card pools**: "no On Reveal here" is mild; "no cards can be played here" kills the fun
- **Too-many-global-effect locations appearing at once**: 3 global-rule locations = game breaks

## Design Process

1. **Pitch**: 1-line description
2. **Prototype**: implement in sandbox
3. **Test internally**: 50+ matches
4. **Soft rotation**: add at low weight
5. **Analyze**: win-rate, card-use, feel survey
6. **Tune or retire**

## New Location Cadence

- **~2 new locations per month** (soft launch)
- Major seasonal drops add themed sets (Asgard season: 5 new Asgard-themed locations)
