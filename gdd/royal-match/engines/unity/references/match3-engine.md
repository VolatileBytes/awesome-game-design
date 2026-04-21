# Match-3 Engine

The match-3 engine is the heart of Royal Match. It must be correct (finds all matches), fast (smooth 60 FPS with cascades), deterministic (same input = same result), and extensible (for power-ups, obstacles, new mechanics).

## Design Goals

- **Correct**: find all valid matches per the rules
- **Deterministic**: seeded RNG for refill; same state + moves = same outcome
- **Fast**: cascades resolve in <5 ms per step on mid-range phones
- **Testable**: sim runs headless without Unity
- **Extensible**: new obstacles, mechanics without rewriting core

## Grid Data Structure

```csharp
public class Grid {
    public readonly int Width, Height;
    public readonly GridCell[,] Cells;
    public readonly List<Vector2Int> Spawners;  // top-edge spawn points
    public readonly HashSet<Vector2Int> Holes;   // unusable cells
    public readonly HashSet<Vector2Int> Obstacles;
}

public class GridCell {
    public Piece Piece;  // current piece or null
    public ObstacleState Obstacle;  // box hits, chain count, ice coating, jelly coating
}

public class Piece {
    public int Id;
    public PieceType Color;  // Red, Blue, Green, Yellow, Purple
    public PowerUpType PowerUp;  // None, RocketH, RocketV, Bomb, Lightball
}
```

### Why immutable-ish

Grid state updates **functionally** during resolution — input state is captured, changes applied atomically. Helps with testing + replay.

## Swap Operation

```csharp
public SwapResult Swap(Vector2Int a, Vector2Int b) {
    if (!AreAdjacent(a, b)) return SwapResult.Invalid;

    var pieceA = Cells[a.x, a.y].Piece;
    var pieceB = Cells[b.x, b.y].Piece;

    // Special: power-up + power-up combo
    if (pieceA.IsPowerUp && pieceB.IsPowerUp) {
        return TriggerCombo(a, b);
    }

    // Special: power-up + piece → fires the power-up (for Lightball specifically)
    if (pieceA.PowerUp == PowerUpType.Lightball && !pieceB.IsPowerUp) {
        return TriggerLightball(a, pieceB.Color);
    }

    // Normal swap
    Cells[a.x, a.y].Piece = pieceB;
    Cells[b.x, b.y].Piece = pieceA;

    // Check if swap creates matches
    var matches = FindMatches();
    if (matches.Count == 0) {
        // Invalid swap; revert
        Cells[a.x, a.y].Piece = pieceA;
        Cells[b.x, b.y].Piece = pieceB;
        return SwapResult.Invalid;
    }

    return ResolveMatches(matches);
}
```

## Match Finding

Scan rows + columns, find runs of ≥ 3 same-color:

```csharp
public List<Match> FindMatches() {
    var matches = new List<Match>();

    // Horizontal scans
    for (int y = 0; y < Height; y++) {
        int runStart = 0;
        for (int x = 1; x <= Width; x++) {
            if (x == Width || Cells[x, y].Piece?.Color != Cells[x-1, y].Piece?.Color) {
                int runLength = x - runStart;
                if (runLength >= 3) {
                    matches.Add(new Match(runStart, y, x-1, y, runLength, Horizontal));
                }
                runStart = x;
            }
        }
    }

    // Vertical scans (symmetric)
    // ...

    // L/T shape detection (overlapping H + V match)
    var lShapes = FindLShapes(matches);
    matches = MergeLShapes(matches, lShapes);

    return matches;
}
```

### Match Priority

Bigger matches beat smaller:
- A piece in both a 4-match and a 3-match: bigger wins
- A piece in an L-shape: L-shape wins

### Power-Up Creation Rules

Based on match geometry + size:

| Match | Power-Up Created |
|---|---|
| 3-in-row or col | None (just clears) |
| 4-in-row | Rocket horizontal |
| 4-in-col | Rocket vertical |
| 5-in-row/col | Lightball |
| L or T shape | Bomb |
| 5-cross (H5+V5 intersecting) | Combo Bomb (rare) |

## Match Resolution

Once matches are found, process them:

```csharp
public List<MatchEvent> ResolveMatches(List<Match> matches) {
    var events = new List<MatchEvent>();

    foreach (var m in matches) {
        // Emit event
        events.Add(new MatchEvent(MatchEventType.Match, m.Positions, m.PowerUpCreated));

        // Remove matched pieces
        foreach (var p in m.Positions) {
            DestroyPiece(p);
        }

        // Spawn power-up if applicable
        if (m.PowerUpCreated != PowerUpType.None) {
            SpawnPiece(m.PowerUpPosition, m.PowerUpCreated);
        }
    }

    return events;
}
```

### Destroy Piece

Destroying a piece may:
- Interact with adjacent obstacles (break boxes, chains)
- Fire a power-up if the piece is one
- Contribute to objective progress

```csharp
public void DestroyPiece(Vector2Int pos) {
    var piece = Cells[pos.x, pos.y].Piece;
    if (piece == null) return;

    // Fire power-up
    if (piece.IsPowerUp) {
        FirePowerUp(pos, piece.PowerUp);
    }

    // Objective progress
    objectiveTracker.Record(piece.Color);

    // Obstacle interaction
    BreakAdjacentObstacles(pos);

    // Remove
    Cells[pos.x, pos.y].Piece = null;
}
```

## Power-Up Fire

Each power-up has a specific pattern:

```csharp
public void FirePowerUp(Vector2Int pos, PowerUpType type) {
    switch (type) {
        case PowerUpType.RocketH:
            for (int x = 0; x < Width; x++) DestroyPiece(new Vector2Int(x, pos.y));
            break;
        case PowerUpType.RocketV:
            for (int y = 0; y < Height; y++) DestroyPiece(new Vector2Int(pos.x, y));
            break;
        case PowerUpType.Bomb:
            for (int dx = -1; dx <= 1; dx++)
                for (int dy = -1; dy <= 1; dy++)
                    DestroyPiece(pos + new Vector2Int(dx, dy));
            break;
        case PowerUpType.Lightball:
            // Lightball needs a color target; handled separately via swap
            break;
    }
}
```

### Combo Power-Ups

When two power-ups are swapped together:

| Combo | Effect |
|---|---|
| Rocket + Rocket | Horizontal + Vertical at the center = giant cross |
| Rocket + Bomb | 3-wide row/column AoE cross |
| Bomb + Bomb | Big 5×5 explosion |
| Lightball + Rocket | All pieces of one color turn into Rockets, fire all |
| Lightball + Bomb | All pieces of one color turn into Bombs, fire all |
| Lightball + Lightball | Clear entire board |

## Gravity

After matches resolve, pieces fall down:

```csharp
public void ApplyGravity() {
    for (int x = 0; x < Width; x++) {
        // Find empty cells in this column; shift pieces down
        for (int y = 0; y < Height; y++) {
            if (Cells[x, y].Piece == null) {
                // Find next piece above
                for (int y2 = y + 1; y2 < Height; y2++) {
                    if (Cells[x, y2].Piece != null) {
                        Cells[x, y].Piece = Cells[x, y2].Piece;
                        Cells[x, y2].Piece = null;
                        break;
                    }
                }
            }
        }
    }
}
```

### Alternative Gravity Modes

Some levels have custom gravity:
- **Sideways**: pieces shift left instead of down
- **No gravity**: empty cells stay empty (rare)
- **Ascending**: pieces rise

## Refill

New pieces spawn from spawner cells:

```csharp
public void Refill() {
    foreach (var spawner in Spawners) {
        // Fill column above the spawner
        int col = spawner.x;
        for (int y = 0; y < Height; y++) {
            if (Cells[col, y].Piece == null) {
                var color = PickRandomColor();
                Cells[col, y].Piece = new Piece(nextId++, color);
            }
        }
    }
}

PieceType PickRandomColor() {
    return paletteColors[rng.Next(paletteColors.Count)];
}
```

### Color Selection

- Use seeded `SimRandom` for determinism
- Balance: avoid creating "instant 3-matches" in new drops (optional; less juicy)

## Cascading

After gravity + refill, re-check for matches. Loop:

```csharp
public List<MatchEvent> ResolveCascade() {
    var events = new List<MatchEvent>();
    int cascadeIndex = 0;

    while (true) {
        var matches = FindMatches();
        if (matches.Count == 0) break;

        cascadeIndex++;
        foreach (var m in matches) {
            m.CascadeIndex = cascadeIndex;
            events.Add(...);
        }
        ResolveMatches(matches);
        ApplyGravity();
        Refill();
    }

    return events;
}
```

**Safety limit**: cap cascades at ~20 to prevent pathological loops.

## Obstacles

### Box

```csharp
// State: hits remaining (usually 1)
// On adjacent match: decrement hits; at 0, remove
```

### Chain

```csharp
// State: hits remaining
// Locks a piece; piece can't match until chain broken
// Adjacent match breaks 1 chain
```

### Ice

```csharp
// State: hits remaining (2 usually)
// Freezes a cell; piece can't move until ice broken
// Adjacent match breaks 1 ice
```

### Jelly

```csharp
// State: coated/uncoated
// Often the objective (clear all jelly)
// Match on or adjacent to jelly: break it
```

## Objective Tracking

```csharp
public class ObjectiveTracker {
    Dictionary<ObjectiveType, int> progress;
    public void Record(PieceType color) {
        progress[ObjectiveType.CollectColor(color)]++;
    }
    public void RecordObstacleDestroyed(ObstacleType type) {
        progress[ObjectiveType.ClearObstacle(type)]++;
    }
    public bool AllObjectivesMet() { ... }
}
```

## Server Validation

For anti-cheat:
1. Client sends: `levelId, seed, move_log, final_state_hash`
2. Server runs GridSim with same seed + moves
3. Verifies final state hash matches
4. If mismatch → flag for review

## Solver (for design tools)

A brute-force solver that plays levels automatically:
- Try every valid swap; pick best scoring
- Detects: solvable? min moves? booster requirement?
- Used for level tuning before release

## Testing

```csharp
[Test]
public void Match3_horizontal_clears_3_pieces() {
    var grid = GridBuilder.FromAscii(
        "RRR",
        "BGB",
        "YYY"
    );
    var sim = new GridSim(grid);
    var events = sim.Swap(new Vector2Int(0, 0), new Vector2Int(1, 0));
    Assert.IsNull(grid.Cells[0, 0].Piece);
    Assert.IsNull(grid.Cells[1, 0].Piece);
    Assert.IsNull(grid.Cells[2, 0].Piece);
}
```

Every match / power-up / obstacle should have isolated test coverage.

## Performance Optimizations

- **Dirty-cell tracking**: only re-check cells that changed, not full grid
- **Pre-sized arrays**: avoid List realloc
- **Struct pieces**: Piece is a struct for locality (cache-friendly)
- **Single-allocation events**: pool event objects

## Anti-Patterns

- **Non-deterministic refill**: breaks replays + server validation
- **Physics-based gravity**: non-deterministic; use scripted
- **Spawn GameObjects during sim**: the sim is pure data; spawn happens in View only
- **Float positions in sim**: use integer cell coordinates
- **Unity `Random` in sim**: use SimRandom with fixed seed
