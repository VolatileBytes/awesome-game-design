# Stage Sim Architecture

The stage simulation is the heart of Arknights gameplay. It must be **deterministic**, **replay-friendly**, and **fast** enough to support 2x speed on mid-range phones.

## Goals

- **Deterministic**: same inputs + same seed = same outcome every run
- **Efficient**: 2x speed with 20+ entities at 30 Hz on mid-range phones
- **Testable**: can run sim headless for balance simulations
- **Replay-friendly**: store inputs + seed → re-run to verify

## Tick Model

Fixed-step sim at 30 Hz:

```csharp
public class StageSim {
    const float TickSeconds = 1f / 30f;
    float accumulator;

    public void Update(float dt) {
        accumulator += dt;
        while (accumulator >= TickSeconds) {
            Tick();
            accumulator -= TickSeconds;
        }
    }

    void Tick() {
        ProcessInputQueue();
        ProcessWaveSpawns();
        UpdateEnemies();
        UpdateOperators();
        UpdateProjectiles();
        ResolveCombat();
        UpdateSPAndSkills();
        CheckEndConditions();
    }
}
```

### Fixed-Point Math

- Positions: `Vector2Fixed` with Q16.16
- Distances: integer math where possible
- Avoid `float` in sim (except for display hints)
- Unity doesn't have built-in fixed-point; use a library like **FixedMath.NET**

### Seeded RNG

```csharp
public class SimRandom {
    ulong state;
    public SimRandom(ulong seed) { state = seed; }
    public int Next(int max) { ... }
    public float NextFloat() { ... }
}
```

All randomness in sim uses `SimRandom`. Never `UnityEngine.Random`.

## Entity Management

### Instance Pools

- `OperatorInstance` pool — up to 12 active
- `EnemyInstance` pool — up to 100+ (waves spawn many)
- `ProjectileInstance` pool — up to 200+ at peak
- `SummonInstance` pool — for summoner ops
- `AuraInstance` pool — buffs/debuffs

Pooling avoids GC during combat.

### IDs

Each entity has a stable ID (int). View uses these to map to GameObjects; sim references by ID not by reference.

## Grid & Pathing

### Tile Grid

```csharp
public class Grid {
    public int Width, Height;
    public Tile[,] Tiles;
    public List<Vector2Int> Spawners;
    public List<Vector2Int> Exits;
}

public enum TileType {
    None,
    Ground,
    HighGround,
    Obstacle,
    Water,
    Toxin
}
```

### Path Data

Paths are computed from stage definition, not A* per tick:

- **Each spawner** has a fixed path (or two paths) to an exit
- Precomputed as a list of tile waypoints
- Enemies move along the path at their speed

```csharp
public class Path {
    public List<Vector2Int> Waypoints;
    public List<float> LengthsBetween;
}
```

### Enemy Movement

```csharp
void UpdateEnemy(EnemyInstance e) {
    var path = e.Path;
    var target = path.Waypoints[e.PathIndex];
    var dir = (target - e.Position).Normalized;
    e.Position += dir * e.Speed * TickSeconds;

    if ((target - e.Position).LengthSq < epsilon) {
        e.PathIndex++;
        if (e.PathIndex >= path.Waypoints.Count) {
            // Enemy reached exit → leak
            OnEnemyLeaked(e);
        }
    }
}
```

### Blocking

When enemies reach a blocking operator's tile:
- Check `BlockCount` of operator vs. current blocked count
- If room, enemy stops; otherwise enemy passes through
- Blocked enemies are targets for melee attacks

## Combat Resolution

### Damage Types

- **Physical**: reduced by DEF
- **Arts**: reduced by RES
- **True**: ignores DEF/RES

### Formula

```csharp
int damage_physical = max(1, atk - def);
int damage_arts = max(atk * 0.05, atk * (100 - res) / 100);
int damage_true = atk;
```

Minimum 1–5% damage per hit to prevent 0-damage stalls.

### Targeting

Operators have a `RangePattern` (list of relative tile offsets). Each tick:
1. Find enemies in range tiles
2. Pick one based on **priority** (usually lowest HP, or nearest path progress, or tagged)
3. Attack if cooldown ready

### Attack Cadence

- `AttackSpeed` = attacks per second base
- Buffs modify: `effectiveAPS = baseAPS * (1 + boost)`
- Next attack time = last attack + 1/effectiveAPS

## SP (Skill Points)

### Generation Modes

- **PerSecond**: +1 per second, continuous
- **PerAttack**: +1 per attack (or each time attacked)
- **Defensive**: +1 when hit

### Triggering

- **Auto**: skill fires when SP = max
- **Manual**: skill fires when player taps (SP = max)
- Duration: skill lasts N seconds; some are instant

### Cooldowns

Skills have SP cost + cooldown. After firing, SP drains to 0 and accumulates again.

## Talents

Talents modify operator behavior. Examples:

- "ATK +10%": applied as a modifier on ATK read
- "When near a teammate, HP regen": checked each tick
- "On deploy, summon a drone": triggered once on deploy

Implementations override hooks in `TalentEffect`.

## Modules

Modules upgrade a talent + add stat bonus. Implemented as:

- Stat bonus applied directly
- Talent upgrade: override or enhance the existing talent

## Wave Script Processor

```csharp
public class WaveRunner {
    public List<SpawnEvent> Events;  // sorted by time
    int nextIdx = 0;
    float currentTime = 0;

    public void Tick() {
        currentTime += TickSeconds;
        while (nextIdx < Events.Count && Events[nextIdx].Time <= currentTime) {
            SpawnEnemy(Events[nextIdx]);
            nextIdx++;
        }
    }
}
```

Events are strictly time-indexed. No randomness in spawn timing.

## Replay & Validation

Every stage input is recorded:
```csharp
public struct StageInput {
    public float Time;   // seconds from stage start
    public InputType Type;  // Deploy, Retreat, SkillFire, Pause, Speed
    public int OperatorId;
    public Vector2Int Tile;
    public Facing Direction;
}
```

Replay file:
```
[stageId] [seed] [inputs[]]
```

To replay:
1. Load StageDefinition
2. Create sim with seed
3. Replay inputs at their recorded times
4. Verify final outcome matches recorded outcome

## Performance Optimizations

### Broad-Phase
- Spatial hash or uniform grid for "enemies in this tile"
- O(1) neighbor lookup instead of O(n) scan

### Batch Updates
- Process all projectiles as one pass
- Process enemies in spawn order (deterministic)

### Deterministic Iteration
- Always iterate collections in insertion order
- Avoid dictionaries for iteration; use lists

### Headless Sim
- For balance tests: run sim with no View, as fast as CPU allows
- 1000 iterations of a stage take < 5s on modern CPU
- Enables Monte Carlo balance testing

## Server Validation

After stage clear:
1. Client sends: `stageId, seed, input_log, final_state_hash`
2. Server replays sim with same seed + inputs
3. Verifies final state hash matches
4. If mismatch → flag for fraud review
5. If match → grant rewards atomically

## Anti-Patterns

- **UnityEngine.Time** in sim: non-deterministic
- **Coroutines for sim logic**: time-dependent, uncontrolled
- **Physics** for anything: non-deterministic on mobile
- **Instantiate during combat**: GC hitch — pool everything
- **float for positions**: precision drift; use fixed-point
- **Random.value** anywhere in sim: use seeded RNG only
- **Reference-based entity tracking**: use stable IDs for serialization
