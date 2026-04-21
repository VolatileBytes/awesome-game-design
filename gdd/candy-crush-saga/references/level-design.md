# Level Design — Candy Crush Saga

Candy Crush has 10,000+ hand-crafted levels. Level design is the operational core of the studio.

## Anatomy of a Level

| Property | Range |
|---|---|
| Grid size | 6×6 to 9×9 |
| Shape | Rectangular or irregular (holes, islands) |
| Move budget | 15–60 |
| Objectives | Score, jelly, ingredient, candy-order, mixed |
| Piece palette | 4, 5, or 6 colors |
| Obstacles | 0–5 types per level |
| Difficulty target | 10%–80% first-try clear |

## Objective Types

### Score / Moves

- Reach score X in N moves
- 3-star thresholds: [X, ~1.5X, ~2.5X]
- Most basic; often first objective type players learn

### Jelly

- **Tiles coated in jelly**; break by matching on or adjacent
- Can be 1-coat (single hit) or 2-coat (two hits)
- Spread across grid; some behind obstacles
- Most common obstacle-type objective

### Ingredient

- Ingredients (cherries, hazelnuts) sit on the board
- Must guide them to bottom row via gravity
- Bottom row has conveyor "exits"
- Classic tight-move-budget design

### Candy Order

- Collect N of specific candy types or combos
- e.g., "Collect 20 red candies and 5 striped candies"
- Encourages specific candy creation

### Mixed

- Two objectives (e.g., jelly + ingredient)
- Time-limited (rare): score in 60 seconds

## Obstacle Library

### Coating / Passive

- **Jelly** (1 or 2 hits): primary objective breaker
- **Marmalade**: encases a candy; match to free

### Active / Growing

- **Chocolate**: grows 1 tile per turn if not broken; match adjacent to break
- **Cake Bomb**: multi-hit; explodes when all hits done; clears area
- **Bomb Candy**: counts down N turns; fail level if it reaches 0

### Blocking / Solid

- **Licorice Lock**: encases a candy; match adjacent to break
- **Meringue**: solid block; multi-hit
- **Mystery Egg**: spawns random obstacle/candy when matched

### Flow

- **Conveyor (Licorice Swirl)**: moves candies sideways each turn
- **Portal**: teleports candies from A to B
- **Teleporter pair**: pieces enter one, exit another

### Special

- **Toffee Tornado** (events): random swaps chaos
- **Gummy Dragon** (boss levels): eats candies around it

## Level Type Catalog (by "purpose")

### Teaching Level (~1–20)

- Introduces 1 new concept per level
- Forgiving budget
- Heavy tutorial tooltips

### Power-Up Discovery (~20–60)

- Make a match-4 / match-5 / L-shape
- Rewards specific combo creation

### Obstacle Gauntlet (~60–200)

- Multi-obstacle layouts
- Tight moves; must prioritize

### Combo Challenge (~200–500)

- Requires 2-special combos (striped + wrapped, color bomb + wrapped)
- Design encourages combo creation early in the level

### Hard Walls (flagged)

- Famous: levels 65, 147, 544, 2045
- 10–30% first-try clear
- **Monetization peak**: out-of-moves conversion ~15–25%

### The Refresher

- After a hard level
- Easy, visually spectacular
- Keeps retention after frustration

### Featured / Weekend

- Special limited-duration levels
- Often easier, with event currency rewards

## Difficulty Tuning

### Design Formulas (rough)

| Metric | Target |
|---|---|
| First-try clear | 30–60% (easier levels) / 10–30% (hard levels) |
| Eventual clear | 80%+ |
| Average attempts | 1.5–3 (easy) / 5–15 (hard walls) |
| Booster usage | 10–30% |
| +5 moves conversion | 1–3% (normal) / 10–20% (hard walls) |

### Tuning Process

1. **Prototype**: designer builds level in editor; solver auto-tests
2. **Internal playtest**: 10–20 team plays; collect clear rate
3. **A/B test**: deploy to cohort; compare to baseline
4. **Live monitor**: watch clear rate drift; re-tune if it decays

### Tuning Levers

- **Move count**: primary difficulty knob
- **Grid shape**: fewer active tiles = tighter
- **Palette colors**: 6 easiest, 5 default, 4 hardest
- **Obstacle count + placement**: cumulative difficulty
- **RNG margin**: starting board variation affects skill ceiling

## Level Editor Tooling

- **King Craft** (internal): grid painter + obstacle placement + objective config
- **Solver**: simulates random/greedy/optimal strategies
- **Heatmap**: shows which cells get matched in simulated runs
- **Clear rate predictor**: ML model predicts first-try clear rate from level data
- **Batch testing**: 1000-simulation Monte Carlo for stability

## Level Metadata

```yaml
level_id: 1234
grid: [[S,S,S,S,S,X,X,X,X],
       [S,S,S,S,S,S,S,X,X],
       ...]  # 9x9 matrix, S=spawnable, X=hole, J=jelly
objective:
  type: jelly
  target: 24
palette: [R, O, Y, G, B, P]
moves: 25
obstacles:
  chocolate: [[0,3],[0,5]]
  licorice: [[3,2]]
specials_initial: []
star_thresholds: [25000, 50000, 100000]
difficulty_target: 0.35  # 35% first-try
```

## Narrative Integration

- Episode intros / outros: Mr. Toffee or characters set theme
- Rare story beats: boss levels reveal villains (Bubblegum Troll, Yeti, Odus the Owl)
- No ongoing narrative (unlike Royal Match): theme is ambient flavor

## Production Scale

- **~15 levels per week** live content
- **5–10 designers** on content team
- **Pipeline**: concept → prototype → solver → playtest → release → monitor

## Data-Driven Iteration

- **Clear rate** drift monitored daily
- **Churn spike** on specific level = design issue
- **Booster-use spike** = difficulty ceiling too high
- **Purchase spike** = intentional monetization gate working as designed

## Anti-Patterns

- **Impossible without booster**: short-term revenue, long-term churn
- **Luck-based levels**: player feels cheated
- **Grind levels**: 3x replay of same layout
- **Too many new rules per level**: cognitive overload
