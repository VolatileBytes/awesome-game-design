# Level Design

Level design is 70% of Royal Match. Each level is hand-designed — no procedural generation. The design library is vast; here's the playbook.

## Anatomy of a Level

| Element | Role |
|---|---|
| **Grid Size** | 6×7 (small) to 9×10 (large) |
| **Move Limit** | 15–40 moves |
| **Objective** | Clear jellies, collect cakes, rescue characters, etc. |
| **Starting State** | Placement of obstacles, locked tiles, pre-placed power-ups |
| **Grid Shape** | Rectangular or asymmetric (L-shape, T-shape, holes) |
| **Piece Palette** | Usually 5 colors (some levels limit to 4) |
| **Special Mechanics** | Obstacles, character tiles, gravity twists |
| **Difficulty Target** | First-try win rate: 30–80% depending on position |

## Objective Types

| Type | Description |
|---|---|
| **Collect** | Get N of X piece (cakes, jars) |
| **Clear Jelly** | Break all jelly tiles |
| **Free Characters** | Rescue trapped characters in tiles |
| **Clear Ice** | Break ice cubes |
| **Score** | Reach N points (rare) |
| **Combo** | Make N of X combo |
| **Rescue** | Bring characters to bottom row |
| **Mixed** | Combination of multiple objectives |

## Obstacle Library

### Tier 1 (Introduced Early)

- **Box**: 1 hit → break → score
- **Chain**: locks a piece; break with adjacent match
- **Ice**: coated tile; break with match on or adjacent
- **Jelly**: tile coating; break with match on/adjacent (often the objective)

### Tier 2 (Introduced Mid)

- **Chest**: tap to open, contains booster
- **Vine**: grows each turn; must keep cutting
- **Bubble**: blocks pieces from falling through

### Tier 3 (Introduced Late)

- **Mystery Bag**: spawns a random obstacle when matched
- **Conveyor**: moves pieces sideways each turn
- **Portal**: teleports pieces from A to B
- **Time bomb**: explodes if not cleared in N turns

## Level Type Catalog

### The Teaching Level (levels 1–20)
- Minimal obstacles
- Forgiving move budget
- Teaches 1 concept per level

### The Power-Up Discovery (levels 20–50)
- Introduces Rocket, Bomb, Lightball combos
- Each concept its own level: "Create a rocket this level"

### The Obstacle Battery (levels 50–150)
- Boxes, jellies, ice — player learns to prioritize them
- Move-tight: must play efficiently

### The Combo Challenge (levels 150–500)
- Requires combining 2 power-ups (Rocket + Bomb, Bomb + Lightball)
- Reward deep play

### The Super Hard (flagged levels)
- 10–30% first-try clear
- Often a puzzle-mechanic twist
- Monetization point: "get 5 more moves"

### The Refresher (after streak of hard levels)
- Easy, visually spectacular, big combo opportunity
- Retention cushion after a wall

## Difficulty Tuning Process

### Pass 1: Prototype
- Designer lays out grid + objective + moves
- 10 internal playtests
- Tune move budget

### Pass 2: Internal Playtest
- Team plays; collects clear rates
- Adjust: tighter? looser? add an obstacle?

### Pass 3: A/B Test
- Deploy variant A vs variant B to player segments
- Measure: clear rate, move-purchase rate, retention impact

### Pass 4: Release
- Monitor live: if < 10% first-try clear and < 50% eventual clear → level is too hard → tune down
- If > 90% first-try clear → tune up
- **Sweet spot**: 30–60% first-try, 80%+ eventual

### Pass 5: Long-Term Monitoring
- Levels may decay or need re-tuning as player skill evolves
- Review quarterly

## Move Budget Science

The move budget is the most sensitive lever.

### Formula (rough)
- Compute: min-moves-to-clear (solver determines)
- Add: margin = 3–8 extra moves
- Test: 30% first-try win

### Tight vs Loose

- **Tight** (1–3 move margin): player uses all pieces, tension high
- **Loose** (8+ margin): relaxing, casual mode
- Royal Match leans tighter than average competitors — rewards skill

## Power-Up Placement

### Pre-Placed Power-Ups

Some levels **start with** Lightballs or Rockets in specific positions.
- Teaches combos
- Gives the player a head start feeling
- Often at levels introducing new combo types

### Power-Up Spawn Patterns

- **Match-4**: spawns Rocket (orientation matches match direction)
- **Match-5**: spawns Lightball
- **L/T-shape match**: spawns Bomb
- **Rocket + Bomb adjacent**: merge = super rocket
- **Lightball + Bomb**: rocketline-fire the bomb color

## Cascading Design

Cascades (pieces falling + creating new matches) are core to juice.

- **Grid depth** (7+ rows) allows deeper cascades
- **Piece density**: fewer colors = more cascades
- **Falling gravity**: adjustable — some levels have **sideways gravity** or **no gravity** (floating pieces)

## Aesthetic Design

- Each level has **mood** (bright, neutral, dark)
- Palette shifts with the story area
- Boss levels: darker palette + dramatic music

## Boss Levels

- Every ~50 levels: a "boss" level
- King Robert's villain (Evil Wizard) appears
- Level has a unique mechanic (e.g., villain moves pieces back)
- Extra rewards for clearing

## Narrative Integration

- Key levels trigger story beats: "Level 30 → Discover the kitchen"
- Palace tasks unlock after specific level milestones
- Level goals sometimes tie into story ("Collect 30 cake slices for the royal feast!")

## Data-Driven Iteration

- **Clear rate** per level (live)
- **Moves-used** distribution
- **Booster-use rate** per level
- **Churn rate**: do players quit at a specific level?
- **Purchase rate**: which levels trigger monetization

### Red Flags
- A level where 30% of players churn = design issue
- A level with 80% booster-use rate = designed for booster purchase (intentional monetization)
- Diverging clear rates over time (players were fine, now struggling) = meta shift

## Level Production Pipeline

1. **Brief**: "Level 850 — collect 60 cakes on a conveyor grid"
2. **Prototype**: level editor tool → test plays
3. **Internal playtest** + solver run
4. **Polish**: add dialog cues, sound effects, power-up placements
5. **A/B test** if experimental
6. **Ship**: goes live in next content patch

## Scale

- ~100 new levels every 2 weeks
- 5–10 designers (live content team)
- A&R process for ensuring quality

## Anti-Patterns

- **Impossible levels**: force-pay walls are short-term revenue, long-term churn
- **Random-luck levels**: if RNG decides outcome, players feel cheated
- **Over-complicated mechanics**: 5+ new rules per level confuse new players
- **Repetitive themes**: 20 levels with the same setup → fatigue
