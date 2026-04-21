---
id: candy-crush-saga
title: Candy Crush Saga — Unity Implementation
version: 0.1.0
description: Unity-specific implementation overlay for a Candy-Crush-style match-3 saga game with thousands of hand-designed levels, saga map, lives, boosters, and tournaments.
tags: [unity, mobile, match-3, puzzle, casual]
---

# Candy Crush Saga — Unity Implementation

Engine overlay for the Candy Crush Saga GDD. See [GDD.md](../../GDD.md).

## Target

- **Unity**: 2022.3 LTS or later
- **Render pipeline**: URP 2D
- **Input**: New Input System, touch + mouse for cross-platform
- **Platforms**: iOS + Android primary; Facebook / Windows secondary
- **Networking**: online-required (lives, tournaments, social); match-3 offline-simulated

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP 2D |
| `com.unity.inputsystem` | Touch + mouse |
| `com.unity.addressables` | Level data + episode art streaming |
| `com.unity.textmeshpro` | UI |
| `com.unity.ugui` | Canvas |
| `com.unity.localization` | 30+ languages |
| `com.unity.timeline` | Episode intro animations |

Third-party:
- **DOTween** — tween pipeline
- **MessagePack-CSharp** — network payloads
- **UniTask** — async/await

## Core Architecture

### Sim / View Separation

- `Game.Sim.Grid` — logical grid
- `Game.Sim.MatchResolver` — matching logic
- `Game.View.GridView` — visual representation
- Sim runs headless for server validation

### Level-Scoped Data

Each level is a ScriptableObject:
- 9×9 grid layout
- Obstacle positions
- Objective definition
- Move budget
- Star score thresholds

### Saga Map

Virtualized scroll-view rendering only visible levels (typically 20–30 nodes at a time).

## Project Layout

```
Assets/
  _Project/
    Art/
      Candies/             # 6 candy colors + variants
      SpecialCandies/      # striped, wrapped, color bomb
      Obstacles/           # jelly, chocolate, lock, meringue, etc.
      Characters/          # Tiffi, Mr. Toffee, bosses
      Backdrops/           # episode backdrops
      UI/
      VFX/
    Data/
      Levels/              # 10,000+ LevelDefinition SOs (organized by episode)
      Episodes/            # EpisodeDefinition SOs
      Events/              # Event configs
      Characters/          # Character voice data
    Prefabs/
      CandyView
      SpecialCandyView
      ObstacleView
      LevelNode
      VFX/
      UI/
    Scenes/
      Boot.unity
      Map.unity
      Level.unity
    Scripts/
      Core/
      Sim/
      View/
      Net/
      Levels/
      Map/
      Meta/
      UI/
      Input/
      Economy/
      Social/
```

## Match-3 Sim

### Grid

```csharp
public class Grid {
    public int Width, Height;
    public GridCell[,] Cells;
    public HashSet<Vector2Int> Spawners;
    public HashSet<Vector2Int> Holes;
}

public class GridCell {
    public Candy Candy;  // current candy or null
    public ObstacleState Obstacle;  // jelly, chocolate, lock, meringue, marmalade
}

public class Candy {
    public int Id;  // stable for View
    public CandyColor Color;
    public SpecialType Special;  // None, Striped (H/V), Wrapped, ColorBomb
}
```

### Swap + Resolve

```csharp
public class GridSim {
    public SwapResult Swap(Vector2Int a, Vector2Int b);
    public List<MatchEvent> ResolveMatches();
    public void ApplyGravity();
    public void Refill();
}
```

### Special Candy Creation

| Match | Special |
|---|---|
| Match-4 row | Striped horizontal |
| Match-4 col | Striped vertical |
| L or T (5 pieces) | Wrapped |
| Match-5 in line | Color Bomb |

### Special Candy Fire

| Special | Pattern |
|---|---|
| Striped H | clears full row |
| Striped V | clears full column |
| Wrapped | 3×3 flash → drop → 3×3 flash (2-stage) |
| Color Bomb | all candies of chosen color |

### Combo Table

| Combo | Effect |
|---|---|
| Striped + Striped | Row + column cross |
| Striped + Wrapped | 3-wide row + 3-wide col |
| Striped + Color Bomb | All candies of stripe color become striped + fire |
| Wrapped + Wrapped | Two back-to-back 5×5 explosions |
| Wrapped + Color Bomb | All candies of wrapped's color become wrapped + fire |
| Color Bomb + Color Bomb | Clear entire board |

### Sugar Crush

On level clear, each remaining move → transforms a random candy to Striped → auto-fires → score cascade.

### Cascading

After match → gravity → refill → recheck. Loop until no new matches.

```csharp
public struct MatchEvent {
    public MatchEventType Type;  // Match, Cascade, SpecialFire, SugarCrushStart
    public List<Vector2Int> Positions;
    public SpecialType SpecialCreated;
    public int CascadeIndex;
    public int Score;
}
```

## Level Definition

```csharp
[CreateAssetMenu]
public class LevelDefinition : ScriptableObject {
    public int LevelNumber;
    public int EpisodeNumber;
    public Vector2Int GridSize;
    public GridShape Shape;
    public int MoveBudget;
    public ObjectiveType Objective;  // Score, Jelly, Ingredients, CandyOrder, Mixed
    public List<ObjectiveEntry> ObjectiveDetails;
    public List<CandyColor> PaletteColors;
    public InitialState StartingBoard;
    public int[] StarThresholds;  // [1-star, 2-star, 3-star]
    public float DifficultyTarget;
}
```

## Map Scene

```csharp
// View.SagaMap — virtualized vertical scroll
public class SagaMap : MonoBehaviour {
    public ScrollRect Scroll;
    public LevelNodePool NodePool;

    void OnScroll() {
        int firstVisible = CalcFirstVisibleLevel();
        int lastVisible = firstVisible + 25;
        RecycleOffscreen();
        SpawnNewVisible(firstVisible, lastVisible);
    }
}

public class LevelNode : MonoBehaviour {
    public int LevelNumber;
    public LevelNodeState State;  // Locked, Unlocked, Cleared(1/2/3 stars)
    public Button TapButton;
}
```

## View

- `View.LevelPresenter` — orchestrates in-level scene
- `View.GridView` — renders grid
- `View.CandyView` — individual candy with animator
- `View.SpecialCandyView` — striped/wrapped/color bomb visuals
- `View.ObstacleView` — obstacle rendering
- `View.SugarCrushPlayer` — level-complete auto-fire sequence
- `View.TiffiView` — character reactions
- `View.MrToffeeView` — voice-line player

## Input

- `Input.SwipeDetector` — detects swap direction
- `Input.GridInputMapper` — screen → grid coords
- `Input.SpecialCandyTapper` — tap placed special to consume

## Networking

- `Net.AccountClient` — account sync: progress, lives, gold
- `Net.LevelSubmissionService` — validate level outcomes server-side
- `Net.SocialService` — friends, gifts, tournaments
- `Net.EventService` — Sugar Drop, Jam Session state

## Economy

- `Economy.GoldService` — gold bar balance, IAP
- `Economy.LifeService` — life regen + gifts
- `Economy.BoosterInventory` — owned boosters
- `Economy.ShopService` — gold bundles, booster packs, piggy bank

## Social

- `Social.FriendsService` — Facebook / King account friends
- `Social.LifeGiftService` — send/request lives
- `Social.TournamentService` — weekly tournament standings

## UI

- **Saga Map**: vertical scroll path with friend avatars
- **Level Screen**: HUD + grid
- **Level-Start Modal**: objective + pre-level booster offer
- **Pause Menu**: settings, give up, buy moves
- **Out-of-Moves**: +5 moves offer (KEY monetization point)
- **Level-Complete**: stars + score + confetti
- **Shop**: gold bundles, booster packs
- **Piggy Bank**: breakable when full
- **Tournament Panel**: friend leaderboard
- **Events Panel**: Sugar Drop, daily spin

## Performance

- 81 active candies max (9×9 grid)
- 500–1000 active particles during big combos + Sugar Crush
- 60fps on all target devices
- Pool: candies, particles, popups, voice clips
- Separate canvases: HUD / map / modals

## Audio

- **FMOD or Wwise**: layered SFX
- **Background music**: episode-varied loops
- **Mr. Toffee voice pool**: 50+ lines, randomized per event
- **Musical cascade**: ascending pitch per match chain
- **Music pauses on iOS**: respects user's media

## Common Unity Pitfalls

- **Match-3 in Update()**: separate sim from frame loop; use coroutine/async
- **Non-pooled particles**: 500+ particles peak; pool aggressively
- **UI rebuild storm**: separate HUD canvas from map canvas
- **Physics gravity**: use scripted; determinism required for server validation
- **All 10,000 levels in memory**: use Addressables; load on-demand
- **Facebook / Account SDK on main thread**: async only

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Match-3 Engine](references/match3-engine.md)
