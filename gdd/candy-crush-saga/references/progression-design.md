# Progression & Meta Design — Candy Crush Saga

## The Saga Map is the Only Progression

Unlike newer puzzle games (Royal Match, Homescapes) with home-meta overlays, Candy Crush Saga's progression is **purely the level path**. This is the **genre-defining design choice**.

## Structure

### Episodes

- 15 levels per episode
- Episode has a theme (Candy Town, Bubblegum Bridge, Pastille Pyramid, ...)
- Visual backdrop changes per episode
- Soundtrack subtly varies per area

### World-of-Worlds (Dreamworld)

Historically had a parallel "Dreamworld" path with moon-gravity mechanics; largely retired but left as lore.

## Gates (Monetization / Social Pressure Points)

### Ticket Gates

After every ~15 episodes:
- **"Ticket Required" gate**: need a ticket to proceed
- Three options:
  - **Wait 3 days**: free, time-gated
  - **Ask friends**: social request (3 friends must respond)
  - **Pay** gold bars

Purpose: soft retention checkpoints + social virality.

### Quest Gates

Some episodes require clearing a specific % of prior levels or achieving 3-star on named levels.

## Unlock Flow

```
Level N cleared → Level N+1 unlocks
Level N at 15 of episode → Episode complete → Unlock next episode
(Unless ticket gate) → Proceed
```

## Stars Earned

- **1 star**: clear the level (hit min score)
- **2 stars**: medium score threshold
- **3 stars**: high score threshold (requires Sugar Crush bonus usually)

Stars are **tracked per level** and **summed as total**. Stars are largely vanity — some events use them for reward tiers, but they don't unlock gameplay (unlike Royal Match).

## Replay Value

- **Star hunting**: return to old levels for 3 stars
- **Tournament levels**: replay for leaderboard
- **Sugar Drop (event)**: collect sugar drops from replayed levels

## Long-Term Progression

- **Chapter completion**: cosmetic trophies
- **Milestones**: level 100, 500, 1000, 5000 unlocks celebratory banner

Retained players play for years:
- **Content drop**: 15 new levels per week
- **Events**: rotating every 1–3 days
- **Mastery**: some levels famously take weeks

## Failure & Retry Loop

### The Fail State

1. Player runs out of moves without meeting objective
2. **Out-of-moves modal** appears: "Keep playing for 900 gold (+5 moves)?"
3. If yes → continue with 5 more moves
4. If no → level fails, life consumed, saga map returns

### Life Regen

- Start with 5 lives
- 1 regen per 30 min
- Full regen ~2.5 hours
- **Design intent**: failure stings briefly but doesn't punish long-term; wait or pay

### Psychological Hook

- **Sunk cost**: after 20 moves invested, spend 900 gold to save the attempt
- **Near-miss emphasis**: failures often occur 1-2 matches from victory ("so close!")

## Daily Engagement

### Daily Bonus Spin

- Spin wheel
- Rewards: 1 hour infinite lives, gold, boosters, piggybank

### Mr. Toffee's Fortune Cookie

- Daily login chain (Day 1, 3, 5, 7 with escalating rewards)

### Events Rotating

- **Sugar Drop**: collect sugars from levels
- **Jam Session**: earn points on specific levels
- **Build a Bot** / **Lollipop Collect** etc.

Design goal: multiple daily compulsion loops.

## Social Layer

- **Friends on saga map**: visual pressure ("Jessica is 20 levels ahead of you!")
- **Life requests / gifts**: costs nothing to send, generates engagement
- **Tournament leaderboard**: weekly competition with auto-grouped friends
- **Facebook connect** or **King account** cross-device

## Onboarding

### First 10 Levels

1. **Level 1**: 2 objectives: reach score, understand swap. Extremely forgiving (30+ moves).
2. **Level 2**: Jelly introduced (1 jelly tile).
3. **Level 3**: More jelly; learn clearing.
4. **Level 4**: Striped candy intro (create match-4).
5. **Level 5**: Wrapped candy intro (L/T).
6. **Level 6**: Color Bomb intro (match-5).
7. **Level 7**: Ingredient levels intro (cherry drop).
8. **Level 8–10**: Combine concepts.

### First 100 Levels

- Gentle introduction of each obstacle (chocolate at 35, locks at 50, meringue at 65, etc.)
- Difficulty spikes carefully tuned to retain
- Tutorial tooltips gradually reduce

### Late Game (level 500+)

- Assumes mastery
- Introduces rare mechanics: candy order collection, conveyors
- Some levels are **designed to be 10%+ clear rate** — intentional monetization points

## Scaling Challenge

- Move budget tightens at high levels
- Obstacles multiply
- Candy palette sometimes reduced (5 → 4 colors = fewer cascades, harder)
- Grid shapes become irregular (holes, narrow corridors)
