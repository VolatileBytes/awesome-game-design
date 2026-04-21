# Level Design — Toon Blast

5,000+ hand-designed levels — blast-3 level design borrows from match-3 patterns but adapts for the **tap + group** input model.

## Anatomy of a Level

| Element | Range |
|---|---|
| **Grid size** | 6×8 to 9×10 |
| **Move limit** | 15–35 |
| **Objective** | Blast N cubes of color / Rescue toons / Clear obstacles / Collect ducks |
| **Starting state** | Pre-placed obstacles, rare pre-placed power-ups |
| **Grid shape** | Rectangular or asymmetric |
| **Piece palette** | 3, 4, or 5 colors |
| **Special mechanics** | Portals, conveyors, themed gimmicks |
| **Difficulty target** | 30–80% first-try clear |

## Objective Types

| Type | Description |
|---|---|
| **Blast Color** | Blast N cubes of a specific color |
| **Blast Mixed** | Blast N of each of 2–3 colors |
| **Rescue Toon** | Free 3–5 characters trapped in obstacle chambers |
| **Clear Crates** | Break all wooden crates |
| **Break Chains** | Break chains to free cubes |
| **Clear Ice** | Break ice blocks (2-hit) |
| **Collect Ducks** | Ducks fall via gravity; collect by reaching bottom |
| **Clear Bats** | Drive out bats from their roosts |
| **Mixed** | Combination |

## Obstacle Library

### Tier 1 (Introduced Early)

- **Wood Crate**: 1-3 hits, adjacent blast breaks
- **Ice Cube** (coated): 1 blast removes ice, next blast clears cube
- **Chain Link**: locks a cube; break with adjacent
- **Rubber Duck**: drops with gravity; exits bottom row

### Tier 2 (Introduced Mid)

- **Bubble**: only power-up AoE can break
- **Bubble Gum**: sticky; drop slowly
- **Portal (pair)**: teleport cube A → B
- **Rotating Platform**: spins small region each turn

### Tier 3 (Introduced Late)

- **Bat Trap**: generates bats if not cleared
- **Conveyor Belt**: moves cubes sideways each turn
- **Mystery Box**: spawns random power-up when broken
- **Locked Box** (multi-cube): encases multiple cubes

## Level Type Catalog

### The Teaching Level (levels 1–15)

- Introduces mechanic gently
- One obstacle per level
- Very forgiving moves (30+)

### The Power-Up Discovery (levels 15–50)

- Explicit goal: "create a Rocket this level!" (requires 5-blast)
- Teaches each power-up
- Introduces combos

### The Obstacle Gauntlet (levels 50–150)

- Multiple obstacles
- Tight moves; must prioritize
- Clear crate / ice / chain combos

### The Combo Challenge (levels 150–500)

- Requires power-up combos (Rocket + Bomb etc.)
- Level layout encourages specific combo creation

### The Super Hard (flagged)

- 10–25% first-try clear
- Famous walls (level 100, 234, 567, etc.)
- Monetization peak: out-of-moves prompt converts

### The Character Event (special)

- Tied to character arc
- Unique obstacle (Bruno's honey trap, Cooper's yarn ball)
- Bonus event rewards

### The Team Event Level

- Only appears during team events
- Contribution required: individuals cleared level = team score
- No difficulty spike; designed for cooperation

## Difficulty Tuning

### Targets

| Metric | Target |
|---|---|
| First-try clear | 30–60% normal, 10–25% hard walls |
| Eventual clear | 80%+ |
| Average attempts | 1.5–3 |
| Booster use | 15–30% |
| +5 moves rate | 5–15% |

### Tuning Levers

- **Move budget**: primary difficulty knob
- **Grid shape**: irregular shapes limit group formation
- **Palette**: 3-color = harder (too many groups form → waste); 5-color = easier
- **Obstacle density**: primary difficulty secondary knob
- **Starting power-ups**: gift to ease specific levels

### Tuning Process

1. **Designer lays out grid + objectives + moves**
2. **Auto-solver** simulates random + greedy strategies
3. **Internal playtest** (10 testers → clear rates)
4. **A/B test**: deploy variant A vs B to player segments
5. **Release + monitor**: adjust if clear rate < 10% or > 90%

## Level Editor

- **TonBlast Editor** (internal): grid painter, objective config, obstacle placement
- **Auto-solver** tools:
  - **Random Tapper**: 1000 random plays → clear rate estimate
  - **Greedy Tapper**: always tap largest group → skill-ceiling estimate
  - **Optimal Solver**: min-move solution via search → "is it possible?"
- **Heatmap**: predicted blast locations per cell

## Level Metadata

```yaml
level_id: 1234
grid:
  size: [8, 9]
  shape: rectangular
  holes: []
objective:
  type: clear_crates
  target: 20
palette: [R, Y, B, G]
moves: 25
obstacles:
  crates: [[0,0],[0,1],[1,0],[1,1]]
  ice: [[3,3],[3,4]]
starting_specials: []
star_thresholds: [10000, 20000, 35000]
difficulty_target: 0.40  # 40% first-try
```

## Power-Up Placement

### Pre-Placed Power-Ups

- Rare — usually earned, not given
- Reserved for combo-teaching levels ("here's a Bomb, use it well")

### Power-Up Spawn via Group Size

- 5-group → Rocket (random H/V)
- 7-group → Bomb
- 9-group → Disco Ball

### Combo Setup

- Level design may cluster similarly-colored groups near existing power-ups
- Encourages combo creation

## Cascading Design

Blast-3 cascades via gravity but **don't auto-blast** (player must re-tap):
- **Exception**: power-ups chain automatically if adjacent
- Deep cascades from chained power-ups are iconic

### Chain-Reaction Setup

- Place 2 power-ups in a column with cubes between
- Blast the middle; both power-ups fire → chain
- Emergent explosive moments

## Aesthetic Design

- Each level has a **neighborhood theme**
- **Backdrop** changes per 50-level block
- **Character** appears in background (Bruno behind board, etc.)
- **Cartoon color**: bright primaries

## Narrative Integration

- Character intros between neighborhoods
- Story beats: "Cooper is trapped — rescue him!" (matches rescue objective)
- No continuous narrative (like Candy Crush), just light character flavor

## Data-Driven Iteration

### Metrics Tracked

- **Clear rate**: first-try + eventual
- **Moves used distribution**
- **Booster use rate**
- **Churn rate** at specific levels
- **Purchase rate** (primarily on hard walls)

### Red Flags

- Clear rate < 10%: too hard, tune down
- Clear rate > 95%: too easy, tune up
- High churn (>5% of players quit): design issue
- High booster rate with low purchase: intentional design OR frustrating

## Production

- ~20–30 new levels per week
- 6–10 designers
- **Pipeline**: concept → prototype → solver → playtest → release → monitor

## Anti-Patterns

- **Forced paywall**: short-term revenue, long-term churn
- **RNG-decided levels**: cubes spawn randomly, lucky distributions win
- **Repetitive themes**: 20 levels with same layout
- **Over-complex mechanics**: 5+ rules confuse
- **Too-many-power-ups**: reduces blast mechanic mastery
