# Blast Engine — Toon Blast

The blast engine is the core of Toon Blast. Unlike match-3 engines (which scan for linear matches after swaps), blast engines use **flood-fill** for group detection after each tap.

## Design Goals

- **Correct**: find all contiguous same-color cubes
- **Deterministic**: seeded RNG for refill; replay for server validation
- **Fast**: flood-fill + blast in <5ms per tap on mid-range phones
- **Testable**: sim runs headless
- **Extensible**: new obstacles without rewriting core

## Grid Data Structure

```csharp
public class Grid {
    public readonly int Width, Height;
    public readonly GridCell[,] Cells;
    public readonly List<Vector2Int> Spawners;
    public readonly HashSet<Vector2Int> Holes;
}

public class GridCell {
    public Cube Cube;  // null if empty
    public ObstacleState Obstacle;  // crate hits, ice layer, chain state, bubble seal
}

public class Cube {
    public int Id;
    public CubeColor Color;  // Red, Yellow, Blue, Green, Purple
    public PowerUpType PowerUp;  // None, RocketH, RocketV, Bomb, DiscoBall
}
```

## Blast Operation

```csharp
public BlastResult Blast(Vector2Int tap) {
    var cell = Cells[tap.x, tap.y];
    if (cell.Cube == null) return BlastResult.Invalid;

    // Special: tapping a power-up solo
    if (cell.Cube.PowerUp != PowerUpType.None) {
        return FirePowerUp(tap, cell.Cube.PowerUp);
    }

    // Find group via flood-fill
    var group = FloodFill(tap, cell.Cube.Color);
    if (group.Count < 2) {
        // Can't blast solo cube
        return BlastResult.Invalid;
    }

    // Determine power-up from group size
    var powerUp = PowerUpFromGroupSize(group.Count);

    // Clear group
    foreach (var p in group) {
        if (p == tap && powerUp != PowerUpType.None) {
            // Replace tapped cube with power-up instead of removing
            Cells[p.x, p.y].Cube = new Cube(nextId++, cell.Cube.Color, powerUp);
        } else {
            BreakCube(p);
        }
    }

    // Objective progress
    foreach (var p in group) objectiveTracker.RecordCubeCleared(cell.Cube.Color);

    return BlastResult.Success(group, powerUp);
}
```

### Flood Fill

```csharp
List<Vector2Int> FloodFill(Vector2Int start, CubeColor color) {
    var visited = new HashSet<Vector2Int>();
    var stack = new Stack<Vector2Int>();
    stack.Push(start);

    while (stack.Count > 0) {
        var pos = stack.Pop();
        if (visited.Contains(pos)) continue;
        if (!InBounds(pos)) continue;

        var cell = Cells[pos.x, pos.y];
        if (cell.Cube?.Color != color) continue;
        if (cell.Cube.PowerUp != PowerUpType.None) continue;  // power-ups aren't grouped
        if (cell.Obstacle.InBubble || cell.Obstacle.Chained) continue;  // blocked

        visited.Add(pos);

        stack.Push(new Vector2Int(pos.x + 1, pos.y));
        stack.Push(new Vector2Int(pos.x - 1, pos.y));
        stack.Push(new Vector2Int(pos.x, pos.y + 1));
        stack.Push(new Vector2Int(pos.x, pos.y - 1));
    }

    return visited.ToList();
}
```

## Power-Up Creation

```csharp
PowerUpType PowerUpFromGroupSize(int size) {
    if (size >= 9) return PowerUpType.DiscoBall;
    if (size >= 7) return PowerUpType.Bomb;
    if (size >= 5) return rng.NextBool() ? PowerUpType.RocketH : PowerUpType.RocketV;
    return PowerUpType.None;
}
```

## Power-Up Fire

```csharp
public List<MatchEvent> FirePowerUp(Vector2Int pos, PowerUpType type) {
    var events = new List<MatchEvent>();

    switch (type) {
        case PowerUpType.RocketH:
            for (int x = 0; x < Width; x++) BreakCube(new Vector2Int(x, pos.y));
            events.Add(PowerUpFireEvent(pos, type));
            break;
        case PowerUpType.RocketV:
            for (int y = 0; y < Height; y++) BreakCube(new Vector2Int(pos.x, y));
            events.Add(PowerUpFireEvent(pos, type));
            break;
        case PowerUpType.Bomb:
            for (int dx = -1; dx <= 1; dx++)
                for (int dy = -1; dy <= 1; dy++)
                    BreakCube(new Vector2Int(pos.x + dx, pos.y + dy));
            events.Add(PowerUpFireEvent(pos, type));
            break;
        case PowerUpType.DiscoBall:
            // Needs target color; handled via tap/swap interaction
            var targetColor = discoBallTargetColor;
            for (int x = 0; x < Width; x++) {
                for (int y = 0; y < Height; y++) {
                    if (Cells[x, y].Cube?.Color == targetColor) {
                        BreakCube(new Vector2Int(x, y));
                    }
                }
            }
            events.Add(PowerUpFireEvent(pos, type));
            break;
    }

    return events;
}
```

### Chain Reactions

When a power-up fires and clears a cell containing another power-up, that power-up also fires automatically:

```csharp
void BreakCube(Vector2Int pos) {
    if (!InBounds(pos)) return;
    var cell = Cells[pos.x, pos.y];

    if (cell.Cube == null) return;

    // Handle obstacle first
    if (cell.Obstacle.HasObstacle) {
        cell.Obstacle.Damage();
        if (!cell.Obstacle.Destroyed) return;  // protected by obstacle
    }

    // Chain-react power-ups
    if (cell.Cube.PowerUp != PowerUpType.None) {
        FirePowerUp(pos, cell.Cube.PowerUp);
    }

    cell.Cube = null;
}
```

## Combo Operation

```csharp
public ComboResult TriggerCombo(Vector2Int a, Vector2Int b) {
    var puA = Cells[a.x, a.y].Cube.PowerUp;
    var puB = Cells[b.x, b.y].Cube.PowerUp;

    var combo = (puA, puB);
    // Normalize so Rocket < Bomb < DiscoBall
    if (puA > puB) { (puA, puB) = (puB, puA); combo = (puA, puB); }

    switch (combo) {
        case (PowerUpType.RocketH, PowerUpType.RocketH):
        case (PowerUpType.RocketH, PowerUpType.RocketV):
        case (PowerUpType.RocketV, PowerUpType.RocketV):
            FireRocket(a, PowerUpType.RocketH);
            FireRocket(a, PowerUpType.RocketV);
            break;
        case (PowerUpType.RocketH, PowerUpType.Bomb):
        case (PowerUpType.RocketV, PowerUpType.Bomb):
            Fire3WideRocketCross(a);
            break;
        case (PowerUpType.Bomb, PowerUpType.Bomb):
            Fire5x5Explosion(a);
            break;
        case (PowerUpType.RocketH, PowerUpType.DiscoBall):
        case (PowerUpType.RocketV, PowerUpType.DiscoBall):
            var color = Cells[b.x, b.y].Cube.Color;  // pick one color
            TurnAllOfColorIntoRockets(color);
            FireAllRockets();
            break;
        case (PowerUpType.Bomb, PowerUpType.DiscoBall):
            var color2 = /* similar */;
            TurnAllOfColorIntoBombs(color2);
            FireAllBombs();
            break;
        case (PowerUpType.DiscoBall, PowerUpType.DiscoBall):
            ClearEntireBoard();
            break;
    }

    return ComboResult.Success;
}
```

## Gravity

```csharp
public void ApplyGravity() {
    for (int x = 0; x < Width; x++) {
        for (int y = 0; y < Height; y++) {
            if (Cells[x, y].Cube == null && !Cells[x, y].Obstacle.IsBlocking) {
                for (int y2 = y + 1; y2 < Height; y2++) {
                    if (Cells[x, y2].Cube != null) {
                        Cells[x, y].Cube = Cells[x, y2].Cube;
                        Cells[x, y2].Cube = null;
                        break;
                    }
                }
            }
        }
    }
}
```

## Refill

```csharp
public void Refill() {
    foreach (var spawner in Spawners) {
        int col = spawner.x;
        for (int y = 0; y < Height; y++) {
            if (Cells[col, y].Cube == null && !Cells[col, y].Obstacle.IsBlocking) {
                var color = PickRandomColor();
                Cells[col, y].Cube = new Cube(nextId++, color);
            }
        }
    }
}

CubeColor PickRandomColor() {
    return paletteColors[rng.Next(paletteColors.Count)];
}
```

### Color Selection Bias (optional)

Some levels avoid "instant isolated cubes" in new drops — ensures at least some groups form.

## Tap Loop

Unlike match-3 which auto-cascades matches after gravity, blast-3 **requires a new tap per action** (with exception of power-up chain reactions):

```csharp
public void PlayerTap(Vector2Int tap) {
    var result = Blast(tap);
    if (!result.Success) return;

    // No auto-blast on new groups after gravity
    ApplyGravity();
    Refill();

    // Update move counter
    objectiveTracker.MovesRemaining--;
}
```

This is a key distinction from match-3: the player is **in control of every action**.

## Obstacles

### Crate

```csharp
// State: hits remaining (1–3)
// Broken by adjacent blast
// Shields cube from being blasted
```

### Ice Cube

```csharp
// State: ice layer count
// Blast on ice: removes ice layer (cube itself not blasted yet)
// Second blast: clears cube
```

### Chain Link

```csharp
// State: locked/unlocked
// Chained cube can't be in a group (flood-fill skips)
// Adjacent blast breaks chain
```

### Rubber Duck

```csharp
// No color; drops with gravity
// Objective: reach bottom row to collect
// Blasted cubes around it don't destroy it
```

### Bubble

```csharp
// Sealed box around a region
// Only power-up AoE breaks
// Flood-fill skips bubbled cells
```

### Portal (paired)

```csharp
// Cube blasted into source portal appears at destination
// Used in puzzle levels
```

## Sugar Crush (Level Complete)

```csharp
public List<MatchEvent> TriggerLevelCompleteFinale() {
    var events = new List<MatchEvent>();
    int remainingMoves = objectiveTracker.MovesRemaining;

    for (int i = 0; i < remainingMoves; i++) {
        var targetPos = PickRandomRegularCube();
        if (targetPos == null) break;

        // Transform to Rocket (random H/V)
        var rocketType = rng.NextBool() ? PowerUpType.RocketH : PowerUpType.RocketV;
        Cells[targetPos.x, targetPos.y].Cube.PowerUp = rocketType;
        events.Add(new MatchEvent(MatchEventType.FinaleTransform, targetPos, rocketType));

        // Fire immediately
        FirePowerUp(targetPos, rocketType);
        ApplyGravity();
        Refill();
    }

    return events;
}
```

## Server Validation

For anti-cheat:
1. Client sends: `levelId, seed, tap_log, final_state_hash`
2. Server runs BlastSim with same seed + taps
3. Verifies final state + score hash
4. Mismatch → flag / reject

## Solver (Design Tool)

- **Random Tapper**: tap random valid cube per turn; report clear rate over 1000 trials
- **Greedy Tapper**: always tap largest group
- **Optimal Solver**: BFS/DFS for minimum moves; gives theoretical bound
- **Monte Carlo**: probabilistic estimate of clear-rate
- Used in level tuning pipeline

## Testing

```csharp
[Test]
public void FloodFill_finds_all_contiguous_same_color() {
    var grid = GridBuilder.FromAscii(
        "RRB",
        "RRB",
        "BRB"
    );
    var sim = new GridSim(grid);
    var group = sim.FloodFill(new Vector2Int(0, 2), CubeColor.Red);
    Assert.AreEqual(5, group.Count);  // all R connected
}

[Test]
public void GroupSize5_creates_Rocket() {
    // Setup: 5 red cubes in an L
    // Tap: blast
    // Assert: tapped cell now contains Rocket
}

[Test]
public void GroupSize9_creates_DiscoBall() { ... }

[Test]
public void RocketH_clears_full_row() { ... }

[Test]
public void PowerUp_chain_reaction_on_blast() {
    // Two adjacent bombs; blast one; second auto-fires
}

[Test]
public void ComboDiscoBallDiscoBall_clears_entire_board() { ... }
```

Every obstacle / power-up / combo has isolated test coverage.

## Performance Optimizations

- **Flood-fill**: stack-based (not recursive); pre-sized
- **Dirty tracking**: only rescan cells changed
- **Event pooling**: reuse MatchEvent objects
- **Color palette small** (5 colors): enables bitset tricks for fast same-color check
- **Zero-alloc inner loops**: avoid LINQ

## Anti-Patterns

- **Non-deterministic refill**: breaks replay / server validation
- **Physics gravity**: use scripted drops
- **Spawn GameObjects during sim**: sim is pure data
- **Float positions in sim**: use int cell coords
- **Unity `Random` in sim**: use SimRandom with fixed seed
- **Recursive flood-fill**: use iterative to avoid stack overflow on large groups
- **Unlimited cascade depth**: cap power-up chain-reactions at ~30
