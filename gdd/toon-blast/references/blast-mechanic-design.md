# Blast Mechanic Design

The blast mechanic is Toon Blast's defining difference from match-3. This document explains **why it feels different, what design choices flow from it, and how to tune it**.

## Core Mechanic Definition

- Player taps any **group of 2+ adjacent same-color cubes**
- All cubes in the group blast instantly
- Above cubes fall via gravity
- **Adjacency**: 4-directional (up, down, left, right) — not diagonal
- **Groups found via flood-fill** from tapped cube

## vs. Match-3 (Key Differences)

| Aspect | Match-3 | Blast-3 |
|---|---|---|
| **Input action** | Swap two adjacent pieces | Tap any group |
| **Trigger condition** | 3+ in a LINE | 2+ ADJACENT (any shape) |
| **Cognitive load** | Plan swap; see match | See group; tap |
| **Pace** | Slower, more deliberate | Faster, more intuitive |
| **Power-up trigger** | Match-4/5/L | Group size 5/7/9+ |
| **Cascade frequency** | High (gravity + new matches) | High (similar) |
| **Cascade complexity** | Chains often planned | Chains often emergent |

### Why Blast is Easier

- **Any shape counts**: a zig-zag group counts. Match-3 requires linear matches.
- **Minimum 2**: match-3 requires 3.
- **Tap > swipe**: fewer motor demands, works on smaller screens.

### Why Blast is Still Hard

- **Power-ups require LARGE groups** (5+/7+/9+): forces strategic clustering
- **Objective constraints**: limited moves, obstacles block groups
- **Group planning**: small blasts now = lose chance for big group later

## Flood-Fill Algorithm

```csharp
public List<Vector2Int> FindGroup(Vector2Int tap, CubeColor color) {
    var visited = new HashSet<Vector2Int>();
    var queue = new Queue<Vector2Int>();
    queue.Enqueue(tap);

    while (queue.Count > 0) {
        var pos = queue.Dequeue();
        if (visited.Contains(pos)) continue;
        if (!InBounds(pos)) continue;
        if (Cells[pos.x, pos.y].Cube?.Color != color) continue;

        visited.Add(pos);
        foreach (var neighbor in FourDirectional(pos)) {
            if (!visited.Contains(neighbor)) queue.Enqueue(neighbor);
        }
    }

    return visited.ToList();
}
```

## Power-Up Creation

Power-ups are created based on **group size** at blast time:

| Group Size | Power-Up | Position |
|---|---|---|
| 2–4 | None | — |
| 5–6 | **Rocket** (random H or V) | Tapped cell |
| 7–8 | **Bomb** | Tapped cell |
| 9+ | **Disco Ball** | Tapped cell |

### Design Rationale

- **Minimum 5 for Rocket**: encourages waiting for groups to grow via cascades
- **Minimum 9 for Disco Ball**: requires significant board setup or lucky cascade
- **Random H/V Rocket**: prevents deterministic optimal play; slight RNG

## Power-Up Fire Patterns

### Rocket Horizontal

- Clears entire row
- Visual: lightning-bolt dash across row
- Audio: "Whoosh-boom"

### Rocket Vertical

- Clears entire column
- Same visual, vertical

### Bomb

- Clears 3×3 around it
- Visual: central flash + radial explosion
- Audio: "Boom"

### Disco Ball

- Clears all cubes of one color (determined by swapping partner or tapping a colored cube)
- Visual: lightning streams out to every target; rainbow sparkle
- Audio: "Bzzt" escalation

## Combo Table

| Combo | Effect |
|---|---|
| Rocket + Rocket | Full row + full column cross |
| Rocket + Bomb | 3-row column + 3-col row (giant cross) |
| Bomb + Bomb | 5×5 explosion |
| Disco Ball + Rocket | Every cube of color becomes Rocket; all fire |
| Disco Ball + Bomb | Every cube of color becomes Bomb; all fire |
| Disco Ball + Disco Ball | Clear entire board |

**Triggering combos**: tap one power-up and then tap adjacent power-up (double-tap sequence).

## Gravity

After blast, pieces above fall:
- Standard down-gravity
- Some levels: sideways or upward gravity (rare)
- Refill from spawners at top (or designated side)

## Cascades

Unlike match-3, blast cascades are **tap-triggered** in the sense that **one tap** may produce multiple cascading blasts if new same-color groups form mid-cascade:

- Player taps; group blasts
- Cubes fall
- New groups may form — **automatically blast if they're auto-cascade type** (not standard; usually new groups require new taps)
- **Standard Toon Blast**: new groups require tap (no auto-cascade, unlike match-3 gravity-match cascade)

Wait — correction: in Toon Blast, **gravity + refill happens, but player must tap again** for new matches. **Exception**: power-up fire chain-reactions automatically explode adjacent power-ups.

## Obstacle Interactions

### Crate / Box

- Adjacent blast damages by 1
- 1-hit → remove
- Can only be broken by blasting adjacent cubes or power-ups

### Ice

- Coating on a cube
- Blast on ice-coated cube: removes ice layer
- Second blast: clears cube

### Chain

- Locks a cube; can't be blasted until chain broken
- Adjacent blast breaks chain

### Bubble

- Sealed box; only power-up AoE can break

### Portal

- Cubes blasted into portal emerge at paired portal
- Used in puzzle-style levels

## Specials (Non-Standard)

### Paint Bucket (Booster)

- Tap cube → change its color
- Used to complete a group

### Magnet (Booster)

- Tap cube → remove it directly (no blast mechanics)
- Used for locked obstacles

### Hat (Booster)

- +1 move or auto-clear small group

## Level Design Tension

The blast mechanic creates unique level design challenges:

### "Dead boards"

- **Match-3**: if no 3-in-row, no moves
- **Blast-3**: if all cubes isolated (no 2+ group), no moves — **shuffle** triggers

### "Blast hoarding"

- Players may avoid small blasts to build large groups
- Level design punishes this via limited moves + obstacle pressure

### "Power-up positioning"

- Power-ups spawn at tap position
- Level design may require strategic tap locations

## Sugar Crush-Style Finale

On level complete with remaining moves:
- Each remaining move → transforms random cube into Rocket
- Auto-fire in sequence
- Screen fills with explosions
- Like Candy Crush's "Sugar Crush" but **rockets** instead of stripes

## Testing the Mechanic

### Correctness Tests

- Flood-fill finds all contiguous same-color cubes
- Group-size thresholds correctly spawn power-ups
- Cascade reaches steady state
- Power-up combos trigger correctly

### Feel Tests

- Tap-to-blast latency < 50ms
- Blast animation < 250ms
- Cascade complete < 1 second typical

### Balance Tests

- Monte Carlo: random tap strategy — what's clear rate?
- Optimal-play solver: what's minimum moves?
- Spread: tuning group-size threshold changes power-up frequency

## Tuning Levers (Designer Tools)

- **Group size thresholds**: 5/7/9 can shift to 4/6/8 (easier) or 6/8/10 (harder)
- **Refill color bias**: avoid clumps of new same-color at top
- **Obstacle density**: more obstacles = harder to build groups
- **Palette size**: 5 colors vs 4 vs 3 dramatically changes group-formation rate
