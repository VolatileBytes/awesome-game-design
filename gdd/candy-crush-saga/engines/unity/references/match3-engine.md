# Match-3 Engine — Candy Crush Saga

The match-3 engine is the heart of Candy Crush. It must be **correct** (finds all matches per rules), **fast** (60fps with deep cascades), **deterministic** (server validation requires replay identity), and **extensible** (for 10,000+ levels with varied mechanics).

## Design Goals

- **Correct**: find all valid matches per the rules (including L, T, specials)
- **Deterministic**: seeded RNG; same state + moves = same outcome
- **Fast**: cascades resolve in <5ms per step
- **Testable**: sim runs headless without Unity
- **Extensible**: new obstacle types without rewriting core

## Grid Data Structure

```csharp
public class Grid {
    public readonly int Width, Height;
    public readonly GridCell[,] Cells;
    public readonly List<Vector2Int> Spawners;
    public readonly HashSet<Vector2Int> Holes;
    public readonly List<IngredientExit> IngredientExits;  // for ingredient levels
}

public class GridCell {
    public Candy Candy;
    public ObstacleState Obstacle;  // jelly (0-2 coat), chocolate, lock, meringue (multi-hit)
    public bool InMarmalade;  // encases candy
    public int ConveyorDirection;  // 0=none, 1=right, -1=left
}

public class Candy {
    public int Id;  // stable for view animation
    public CandyColor Color;  // Red, Orange, Yellow, Green, Blue, Purple
    public SpecialType Special;  // None, StripedH, StripedV, Wrapped, ColorBomb, IngredientCherry, IngredientHazelnut
}
```

### Why immutable-ish

Grid state updates functionally during resolution. Input state captured, changes applied atomically. Helps with testing + replay.

## Swap Operation

```csharp
public SwapResult Swap(Vector2Int a, Vector2Int b) {
    if (!AreAdjacent(a, b)) return SwapResult.Invalid;
    if (Cells[a.x, a.y].InMarmalade || Cells[b.x, b.y].InMarmalade) return SwapResult.Invalid;

    var candyA = Cells[a.x, a.y].Candy;
    var candyB = Cells[b.x, b.y].Candy;

    // Special + special combo
    if (candyA.IsSpecial && candyB.IsSpecial) {
        return TriggerCombo(a, b);
    }

    // Color Bomb + regular candy: clears that color
    if (candyA.Special == SpecialType.ColorBomb && !candyB.IsSpecial) {
        return TriggerColorBomb(a, candyB.Color);
    }

    // Normal swap
    Cells[a.x, a.y].Candy = candyB;
    Cells[b.x, b.y].Candy = candyA;

    var matches = FindMatches();
    if (matches.Count == 0) {
        // Invalid; revert
        Cells[a.x, a.y].Candy = candyA;
        Cells[b.x, b.y].Candy = candyB;
        return SwapResult.Invalid;
    }

    return ResolveMatches(matches);
}
```

## Match Finding

Scan rows + columns, find runs of ≥ 3 same-color, then merge into L/T shapes:

```csharp
public List<Match> FindMatches() {
    var matches = new List<Match>();

    // Horizontal scan
    for (int y = 0; y < Height; y++) {
        int runStart = 0;
        for (int x = 1; x <= Width; x++) {
            if (x == Width || !SameColor(x, y, x - 1, y)) {
                int runLength = x - runStart;
                if (runLength >= 3)
                    matches.Add(new Match(runStart, y, x - 1, y, runLength, Horizontal));
                runStart = x;
            }
        }
    }

    // Vertical scan (symmetric)
    // ...

    // L / T shape: overlapping H + V match share a cell
    var lShapes = FindLShapes(matches);
    matches = MergeLShapes(matches, lShapes);

    return matches;
}
```

### Match Priority

- Bigger match wins on overlap
- L/T shape beats plain match (always makes a Wrapped)
- Match-5 line beats L-shape (makes Color Bomb)

### Special Candy Creation Rules

| Match | Special Created |
|---|---|
| 3-in-row/col | None (just clears) |
| 4-in-row | StripedH |
| 4-in-col | StripedV |
| 5-in-row/col | Color Bomb |
| L / T (5 pieces, corner) | Wrapped |
| 6+ | Wrapped + clears others |

## Match Resolution

```csharp
public List<MatchEvent> ResolveMatches(List<Match> matches) {
    var events = new List<MatchEvent>();

    foreach (var m in matches) {
        events.Add(new MatchEvent(MatchEventType.Match, m.Positions, m.SpecialCreated));

        foreach (var p in m.Positions) {
            DestroyCandy(p);
        }

        if (m.SpecialCreated != SpecialType.None) {
            SpawnSpecial(m.SpecialPosition, m.SpecialCreated);
        }

        // Update score
        score += m.BaseScore * cascadeMultiplier;
    }

    return events;
}
```

### Destroy Candy

```csharp
public void DestroyCandy(Vector2Int pos) {
    var candy = Cells[pos.x, pos.y].Candy;
    if (candy == null) return;

    // Fire special
    if (candy.IsSpecial) {
        FireSpecial(pos, candy.Special);
    }

    // Ingredient: drop to bottom (not destroyed until exit)
    if (candy.Special == SpecialType.IngredientCherry ||
        candy.Special == SpecialType.IngredientHazelnut) {
        // handled by ingredient gravity
        return;
    }

    // Objective progress
    objectiveTracker.RecordCandyCleared(candy.Color);

    // Obstacle interaction (break jelly, chocolate, etc.)
    BreakObstacle(pos);

    Cells[pos.x, pos.y].Candy = null;
}
```

## Special Candy Fire

```csharp
public void FireSpecial(Vector2Int pos, SpecialType type) {
    switch (type) {
        case SpecialType.StripedH:
            for (int x = 0; x < Width; x++) DestroyCandy(new Vector2Int(x, pos.y));
            break;
        case SpecialType.StripedV:
            for (int y = 0; y < Height; y++) DestroyCandy(new Vector2Int(pos.x, y));
            break;
        case SpecialType.Wrapped:
            // 2-stage explosion
            Explode3x3(pos);
            // Trigger second explosion after gravity
            PendingWrappedSecond.Add(pos);
            break;
        case SpecialType.ColorBomb:
            // Lightning to all candies of targetColor (set when swap happens)
            ClearAllOfColor(targetColor);
            break;
    }
}
```

### Combo Fire

```csharp
public SwapResult TriggerCombo(Vector2Int a, Vector2Int b) {
    var specialA = Cells[a.x, a.y].Candy.Special;
    var specialB = Cells[b.x, b.y].Candy.Special;

    var combo = ComboResolver.GetCombo(specialA, specialB);
    switch (combo) {
        case ComboType.StripedStriped:
            FireStripedH(a); FireStripedV(a); break;  // cross
        case ComboType.StripedWrapped:
            FireStriped3Wide(a);  // 3-wide row + 3-wide col
            break;
        case ComboType.WrappedWrapped:
            Explode5x5(a);
            PendingWrappedSecond.Add(a);  // second explosion after gravity
            break;
        case ComboType.StripedColorBomb:
            TurnAllOfColorIntoStriped(targetColor);
            FireAllStriped();
            break;
        case ComboType.WrappedColorBomb:
            TurnAllOfColorIntoWrapped(targetColor);
            FireAllWrapped();
            break;
        case ComboType.ColorBombColorBomb:
            ClearEntireBoard();
            break;
    }

    return SwapResult.ComboTriggered;
}
```

## Gravity

```csharp
public void ApplyGravity() {
    for (int x = 0; x < Width; x++) {
        for (int y = 0; y < Height; y++) {
            if (Cells[x, y].Candy == null && !Cells[x, y].Obstacle.IsBlocking) {
                // Find next candy above
                for (int y2 = y + 1; y2 < Height; y2++) {
                    if (Cells[x, y2].Candy != null) {
                        Cells[x, y].Candy = Cells[x, y2].Candy;
                        Cells[x, y2].Candy = null;
                        break;
                    }
                }
            }
        }
    }

    // Ingredient physics: ingredients drop with gravity; exit at bottom row
    ApplyIngredientGravity();
}
```

### Special Gravity Modes

- **Sideways gravity**: some levels use left/right gravity (rare)
- **No gravity**: pieces float (very rare, event levels)

## Refill

```csharp
public void Refill() {
    foreach (var spawner in Spawners) {
        int col = spawner.x;
        for (int y = 0; y < Height; y++) {
            if (Cells[col, y].Candy == null && !Cells[col, y].Obstacle.IsBlocking) {
                var color = PickRandomColor();
                Cells[col, y].Candy = new Candy(nextId++, color);
            }
        }
    }
}

CandyColor PickRandomColor() {
    return paletteColors[rng.Next(paletteColors.Count)];
}
```

### Color Selection

- Seeded `SimRandom` for determinism
- Optional: avoid creating instant 3-matches in new drops (reduces cascades; juicier off)

## Cascading

```csharp
public List<MatchEvent> ResolveCascade() {
    var events = new List<MatchEvent>();
    int cascadeIndex = 0;

    while (true) {
        ProcessPendingWrappedSecond();  // second explosion of wrapped
        var matches = FindMatches();
        if (matches.Count == 0) break;

        cascadeIndex++;
        foreach (var m in matches) m.CascadeIndex = cascadeIndex;
        events.AddRange(ResolveMatches(matches));
        ApplyGravity();
        Refill();
    }

    return events;
}
```

**Safety limit**: cap cascades at 30.

## Obstacles

### Jelly

```csharp
// State: coat count (1 or 2)
// Broken by match on that tile
// Primary objective type
```

### Chocolate

```csharp
// Each turn without a match-adjacent: grows 1 tile into adjacent empty cell
// Adjacent match: breaks 1 chocolate
// If all chocolate cleared: stops growing (end of level)
```

### Licorice Lock

```csharp
// Locks a candy in place
// Candy can't move or match until lock broken
// Adjacent match breaks the lock
```

### Meringue

```csharp
// Solid multi-hit block (1-3 hits)
// Adjacent match: 1 hit
// Does not fall; blocks gravity above
```

### Marmalade

```csharp
// Encases a candy or special
// Candy can't be swapped or matched until marmalade broken
// Adjacent match: breaks marmalade
```

### Cake Bomb

```csharp
// 3-hit target; counts down per turn if no hit
// Explosion clears 3×3 area
```

### Ingredient Cherry / Hazelnut

```csharp
// Drops with gravity; must reach an exit in the bottom row
// Doesn't match (no color)
// Only cleared by dropping through an exit
```

## Sugar Crush (Level Complete)

```csharp
public List<MatchEvent> TriggerSugarCrush() {
    var events = new List<MatchEvent>();
    int remainingMoves = objectiveTracker.MovesRemaining;

    for (int i = 0; i < remainingMoves; i++) {
        // Pick random non-special candy
        var targetPos = PickRandomRegularCandy();
        if (targetPos == null) break;

        // Transform to Striped
        Cells[targetPos.x, targetPos.y].Candy.Special = RandomStriped();
        events.Add(new MatchEvent(MatchEventType.SugarCrushTransform, targetPos, Special));

        // Fire immediately
        FireSpecial(targetPos, Cells[targetPos.x, targetPos.y].Candy.Special);
        ApplyGravity();
        Refill();

        // Cascade as normal
        events.AddRange(ResolveCascade());
    }

    return events;
}
```

## Objective Tracking

```csharp
public class ObjectiveTracker {
    Dictionary<ObjectiveType, int> progress;
    public void RecordCandyCleared(CandyColor color) { ... }
    public void RecordJellyCleared(Vector2Int pos) { ... }
    public void RecordIngredientCollected(IngredientType type) { ... }
    public bool AllObjectivesMet() { ... }
}
```

## Server Validation

For anti-cheat:
1. Client sends: `levelId, seed, move_log, final_score, final_state_hash`
2. Server runs GridSim with same seed + moves
3. Verifies final state hash + score match
4. Mismatch → flag for review / reject

## Solver (Design Tool)

Brute-force solver:
- Try every valid swap; pick best via heuristic (cascade depth, objective progress)
- Determines: solvable? min moves? booster-required?
- Monte Carlo: 1000 random plays per level → clear-rate estimate
- Used in level tuning pipeline

## Testing

```csharp
[Test]
public void Swap_creates_match3_clears_3_candies() {
    var grid = GridBuilder.FromAscii(
        "RRR",
        "BGB",
        "YYY"
    );
    var sim = new GridSim(grid);
    sim.Swap(new Vector2Int(0, 0), new Vector2Int(1, 0));
    Assert.IsNull(grid.Cells[0, 0].Candy);
    Assert.IsNull(grid.Cells[1, 0].Candy);
    Assert.IsNull(grid.Cells[2, 0].Candy);
}

[Test]
public void Match5_creates_color_bomb() {
    var grid = GridBuilder.FromAscii("RRRRR");
    var sim = new GridSim(grid);
    // swap to complete the match-5
    // ...
    Assert.AreEqual(SpecialType.ColorBomb, grid.Cells[2, 0].Candy.Special);
}

[Test]
public void ColorBomb_plus_ColorBomb_clears_entire_board() { ... }
```

Every obstacle / special / combo has isolated test coverage.

## Performance Optimizations

- **Dirty-cell tracking**: only re-check changed cells
- **Pre-sized arrays**: avoid List realloc
- **Struct Candy** (optional): for cache locality
- **Event pooling**: pool MatchEvent objects
- **Zero-alloc inner loops**: avoid LINQ in gravity/refill

## Anti-Patterns

- **Non-deterministic refill**: breaks replay + server validation
- **Physics-based gravity**: non-deterministic; use scripted
- **Spawn GameObjects during sim**: sim is pure data
- **Float positions in sim**: use integer cell coordinates
- **Unity `Random` in sim**: use SimRandom with fixed seed
- **Cascade depth unlimited**: cap at ~30 to prevent pathological loops
