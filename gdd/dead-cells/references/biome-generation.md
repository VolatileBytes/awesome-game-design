# Biome Generation — Dead Cells

Dead Cells's "procedural" is not per-tile random — it's a **composition of hand-authored rooms**. A biome is a graph of rooms; each room is a handcrafted prefab.

## Hierarchy

```
Biome
  → Macro layout (graph of rooms)
    → Each node = one Room prefab (hand-authored)
      → Each Room contains: geometry, spawn points, secret rooms, shop markers
        → Enemies spawned at spawn points via biome's enemy pool
```

A biome is fully authored except for:
- Room selection from prefab library.
- Enemy selection from biome's pool at each spawn point.
- Mutation/weapon drops.
- Cursed chest placement (1–2 per biome, seeded).

This approach preserves the "hand-crafted" feel while giving replayability.

## Room Authoring

Motion Twin's custom editor exports rooms as data:
- Tile grid (foreground/background).
- Entity markers: `SpawnPoint(enemyType)`, `Door(direction)`, `Shop`, `Shrine`, `SecretRoom(unlock=vine)`.
- Parallax layers.
- Audio zones.

Rooms are tagged with:
- **Biome** (which biome can use them).
- **Size** (small/medium/large).
- **Door directions** (left/right/up/down; connections required).
- **Difficulty tier** (enemy count × threat multiplier).

## Macro Layout Algorithm

```
generate_biome(biomeId, seed):
  rooms = []
  start = pick random entry room for this biome
  rooms.append(start)
  frontier = [start.exits]

  while len(rooms) < biome.target_room_count:
    door = pick random from frontier
    candidate = pick random room from biome.prefab_pool matching door direction
    attach candidate to door
    rooms.append(candidate)
    frontier.remove(door); frontier += candidate.unused_doors

  ensure at least 1 shop, 1 challenge rift (if rune)
  ensure 2–3 exit doors connect to next biome(s)
  place enemy spawn set based on biome difficulty tier
```

Post-validation:
- All rooms reachable from entry.
- At least N exit doors to next biomes.
- Secret rooms count: 1–2 per biome.

## Doors & Exits

Each biome has 2–3 exit doors, each leading to a specific next biome. Example:

```
Prisoner's Quarters → exits: {Promenade, Toxic Sewers, Dilapidated Arboretum}
Promenade → exits: {Ramparts, Ossuary, Stilt Village}
...
Final chain converges to High Peak Castle → Hand of the King
```

The player's run is a path through this DAG. Some doors require Runes to pass — gating biome access until the rune is found.

## Enemy Population

Each biome defines an **enemy pool** with weighted entries:

```
Prisoner's Quarters pool:
  - Zombie (weight 50)
  - Archer Zombie (weight 20)
  - Rotten Leaper (weight 15)
  - Worms (weight 10)
  - Elite: Zombie (weight 5)
```

At room load, each `SpawnPoint` picks an enemy from the pool. Room-level constraints:
- Max N ranged enemies per room.
- Max 1 elite per biome.

Higher Boss Cell tiers modify pools:
- Add enemies from later biomes' pools.
- Increase elite chance.
- Increase total enemies per room.

## Treasure Rooms & Shops

Per biome:
- **1 shop** (weapons/skills, mutations, health potions). Prices scale with biome depth.
- **Shrines** (buff Red/Purple/Green for a cost).
- **Scroll rooms** (always 1 guaranteed R/P/G scroll post-biome clear).
- **Cursed chests** (1–2 per biome).
- **Hidden rooms** (2 per biome on average; gated by secret walls, usually with a hint).

## Time-Gated Rewards

Some biomes have a **time door** that only opens if you reach it within N minutes. Reward: blueprint or extra scroll. Time doors encourage aggressive play.

## Rune Gates

Runes unlock specific door types across biomes:
- **Vine Rune**: climb vines → access to Promenade hidden route.
- **Teleportation Rune**: warp pads in most biomes.
- **Spider Rune**: wall-climbing → hidden rooms.
- **Ram Rune**: ground-pound through destructible floors.
- **Challenger Rune**: open challenge rift rooms.

A rune is found in a specific boss/elite drop; once found, permanent.

## Implementation Pattern

For a Unity rebuild:

### Room prefab workflow

```
Assets/_Project/Rooms/<biome>/<roomId>.prefab
  - Grid-aligned tilemap (foreground + background)
  - Entity prefabs placed in editor:
    - SpawnPoint (enemy)
    - DoorMarker (direction)
    - ShopMarker, ShrineMarker, ScrollMarker
    - SecretWall (tag)
```

### Biome config SO

```csharp
[CreateAssetMenu(menuName = "DeadCells/Biome")]
public class BiomeDefinition : ScriptableObject {
    public string Id;
    public List<RoomPrefabRef> RoomPool;
    public List<EnemyWeighted> EnemyPool;
    public int TargetRoomCount;
    public int ExitDoorCount;
    public List<BiomeRef> NextBiomes;     // exit targets
    public float TimeDoorSeconds;         // nullable
    public int BossCellModifier;
}
```

### Generator pseudocode

```csharp
public class BiomeGenerator {
    public BiomeLayout Generate(BiomeDefinition def, int bossCells, SimRandom rng) {
        var layout = new BiomeLayout();
        var start = rng.Pick(def.RoomPool.EntryRooms);
        layout.AddRoom(start);
        var frontier = new Queue<DoorRef>(start.Exits);
        while (layout.Count < def.TargetRoomCount && frontier.Count > 0) {
            var door = frontier.Dequeue();
            var roomPool = def.RoomPool.Where(r => r.HasMatchingDoor(door));
            if (roomPool.Count == 0) continue;  // dead-end ok
            var candidate = rng.Pick(roomPool);
            layout.AttachRoom(candidate, door);
            foreach (var exit in candidate.UnusedDoors)
                frontier.Enqueue(exit);
        }
        ValidateAndFixup(layout, def);
        PopulateEnemies(layout, def, bossCells, rng);
        return layout;
    }
}
```

## Testing

- **Solvability**: every generated layout has a valid path from entry to exit door.
- **Connectivity**: no orphan rooms.
- **Rune gates**: layouts respect rune dependencies.
- **Enemy density**: mean enemies/room matches biome tier expectation.
- **Time door**: if enabled, reachable within time budget from entry.
- **Variety**: 1000 seeds → no two identical layouts.

## Design Tradeoffs

**Why hand-authored rooms over full procedural?**
- Every traversal puzzle (jump distance, enemy placement) feels tuned.
- Visual composition is artist-controlled.
- Bugs are easier to trace to a specific room.

Cost: ~300 room prefabs for full game. Evil Empire's tooling made this tractable; a smaller team would need to scope carefully.
