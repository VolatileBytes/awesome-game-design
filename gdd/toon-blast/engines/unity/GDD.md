---
id: toon-blast
title: Toon Blast — Unity Implementation
version: 0.1.0
description: Unity-specific implementation overlay for Toon Blast — a tap-based blast-3 puzzle with cartoon characters, 5,000+ hand-designed levels, team league, and heavy juice.
tags: [unity, mobile, puzzle, blast-3, casual, cartoon]
---

# Toon Blast — Unity Implementation

Engine overlay for the Toon Blast GDD. See [GDD.md](../../GDD.md).

## Target

- **Unity**: 2022.3 LTS
- **Render pipeline**: URP 2D
- **Input**: New Input System, touch-first
- **Platforms**: iOS + Android primary
- **Networking**: online-required (team league, social); blast sim is offline

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP 2D |
| `com.unity.inputsystem` | Touch input |
| `com.unity.addressables` | Levels + character assets on demand |
| `com.unity.textmeshpro` | UI text |
| `com.unity.ugui` | Canvas |
| `com.unity.localization` | Multi-language |
| `com.unity.timeline` | Character cinematics |

Third-party:
- **DOTween** — tween animations
- **Spine** or **2D Animation** — character rigging (Bruno, Cooper, Wally)
- **MessagePack-CSharp** — wire format
- **UniTask** — async/await
- **PubNub** or **WebSocket server** — team chat

## Core Architecture

### Blast Sim (Client-Side)

Blast-3 logic runs client-side:
- Grid state (cubes + obstacles)
- Flood-fill for groups
- Deterministic with seeded RNG
- Server validates outcomes (tap log + final state)

### Sim / View Separation

- `Game.Sim.Grid` — logical grid of cubes
- `Game.Sim.BlastResolver` — tap → flood-fill → blast
- `Game.View.GridView` — visual representation
- Sim is pure data; runs headless for validation

### Level-Scoped Data

Each level is a ScriptableObject:
- Grid layout + obstacles
- Objective
- Move budget
- Star thresholds

## Project Layout

```
Assets/
  _Project/
    Art/
      Cubes/                 # 5 cube colors
      PowerUps/              # rocket, bomb, disco ball
      Obstacles/             # crate, ice, chain, bubble, portal
      Characters/            # Bruno, Cooper, Wally + expressions
      Backdrops/             # neighborhood scenes
      VFX/
      UI/
    Data/
      Levels/                # 5000+ LevelDefinition SOs
      Neighborhoods/         # 50-level theme groups
      Events/                # rotating events
      Characters/            # character voice + animation data
    Prefabs/
      CubeView
      PowerUpView
      ObstacleView
      CharacterRig
      VFX/
      UI/
    Scenes/
      Boot.unity
      Map.unity
      Level.unity
      Team.unity
    Scripts/
      Core/
      Sim/
      View/
      Net/
      Levels/
      Map/
      Team/
      Meta/
      UI/
      Input/
      Economy/
      Social/
```

## Blast Sim

### Grid

```csharp
public class Grid {
    public int Width, Height;
    public GridCell[,] Cells;
    public HashSet<Vector2Int> Spawners;
    public HashSet<Vector2Int> Holes;
}

public class GridCell {
    public Cube Cube;
    public ObstacleState Obstacle;
}

public class Cube {
    public int Id;
    public CubeColor Color;  // Red, Yellow, Blue, Green, Purple
    public PowerUpType PowerUp;  // None, RocketH, RocketV, Bomb, DiscoBall
}
```

### Tap + Blast

```csharp
public class GridSim {
    public BlastResult Blast(Vector2Int tap);
    public void FirePowerUp(Vector2Int pos);
    public void ApplyGravity();
    public void Refill();
}
```

### Flood-Fill

```csharp
public List<Vector2Int> FindGroup(Vector2Int tap, CubeColor color) {
    // 4-directional flood-fill
    // Returns contiguous same-color cubes
}
```

### Power-Up Creation (Group Size)

| Group Size | Power-Up |
|---|---|
| 2–4 | None |
| 5–6 | Rocket (random H/V) |
| 7–8 | Bomb |
| 9+ | Disco Ball |

### Power-Up Fire

- Rocket H: full row
- Rocket V: full column
- Bomb: 3×3
- Disco Ball: all of target color (target selected by swap/tap color)

### Combos

Tap first power-up, then adjacent second power-up:
- Rocket+Rocket → cross
- Rocket+Bomb → wide cross
- Bomb+Bomb → 5×5
- Disco Ball+Rocket → all color → rockets
- Disco Ball+Bomb → all color → bombs
- Disco Ball+Disco Ball → clear entire board

## Level Definition

```csharp
[CreateAssetMenu]
public class LevelDefinition : ScriptableObject {
    public int LevelNumber;
    public int NeighborhoodId;
    public Vector2Int GridSize;
    public GridShape Shape;
    public int MoveBudget;
    public ObjectiveType Objective;  // BlastColor, RescueToon, ClearCrate, etc.
    public List<ObjectiveEntry> ObjectiveDetails;
    public List<CubeColor> PaletteColors;
    public InitialState StartingBoard;
    public int[] StarThresholds;
    public float DifficultyTarget;
}
```

## View

- `View.LevelPresenter` — orchestrates in-level
- `View.GridView` — renders grid
- `View.CubeView` — individual cube
- `View.PowerUpView` — power-up visuals + fire animations
- `View.ObstacleView` — obstacle rendering
- `View.CharacterReactionView` — Bruno/Cooper/Wally reactions
- `View.VFXPool` — particle pool
- `View.JuicyCamera` — screen shake, zoom
- `View.SugarCrushPlayer` — level-complete auto-fire

## Map Scene

- `Map.SagaMap` — vertical scrolling path
- `Map.LevelNode` — level icon
- `Map.NeighborhoodBackdrop` — theme art
- `Map.CharacterCameo` — character sprites between neighborhoods
- `Map.PlayerAvatar` — player position marker

## Team Scene

- `Team.TeamView` — team main UI
- `Team.ChatPanel` — real-time chat
- `Team.LeaderboardPanel` — league standings
- `Team.MemberList` — member avatars + contributions
- `Team.LifeRequestPanel` — ask-for-lives UI

## Input

- `Input.TapDetector` — single tap with grid coord mapping
- `Input.GridInputMapper` — screen → grid cell
- `Input.PowerUpTapper` — tap power-up to fire (double-tap for combo)

## Networking

- `Net.AccountClient` — progress sync
- `Net.LevelSubmissionService` — server-validate outcomes
- `Net.TeamService` — team membership + chat
- `Net.LeagueService` — weekly league standings
- `Net.EventService` — team events

## Economy

- `Economy.CoinService` — coin balance + IAP
- `Economy.LifeService` — lives + regen + team gifts
- `Economy.BoosterInventory` — owned boosters
- `Economy.ShopService` — coin bundles, piggy bank, booster packs

## Social

- `Social.FriendsService` — friend list
- `Social.LifeGiftService` — send/receive lives (team-primary)
- `Social.ChatClient` — team chat (PubNub / WebSocket)

## UI

- **Saga Map**: scroll path with neighborhoods
- **Level Screen**: HUD + grid
- **Level-Start Modal**: pre-level boosters offered
- **Pause Menu**: settings, give up
- **Out-of-Moves Panel**: +5 moves for coins (key monetization)
- **Level-Complete Panel**: stars + coins + character cheer
- **Shop Panel**: coins, piggy bank, boosters
- **Team Panel**: chat + league + members
- **Leaderboard Panel**: league standings
- **Character Story Panel**: narrative beats
- **Events Panel**: daily task, team event

## Performance

- ~72 active cubes peak (9×10 grid)
- 500+ active particles during big combos
- 60fps target
- Pool: cubes, particles, popups
- Separate canvases: HUD / map / team / modals

## Audio

- **FMOD or Wwise**: layered SFX
- **Music**: cartoonish upbeat loops per neighborhood
- **Character voice**: Bruno / Cooper / Wally voice pools
- **Musical cascade**: ascending pitch on chained power-up fires
- **Music behavior on iOS**: respects user's audio session

## Common Unity Pitfalls

- **Flood-fill in Update()**: offload to coroutine or async
- **GameObject-per-cube**: pool CubeViews aggressively
- **Spine character rigs**: ensure pooled, not instantiated per use
- **Chat WebSocket on main thread**: async/task-based
- **Team data refresh**: cache; don't poll every frame
- **5000 LevelDefinition assets in memory**: use Addressables

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Blast Engine](references/blast-engine.md)
