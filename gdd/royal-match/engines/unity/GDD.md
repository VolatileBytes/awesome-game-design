---
id: royal-match
title: Royal Match — Unity Implementation
version: 0.1.0
description: Unity-specific implementation guide for a match-3 puzzle game with palace meta-progression, heavy juice, and 10,000+ hand-designed levels.
tags: [unity, mobile, puzzle, match-3, casual]
---

# Royal Match — Unity Implementation

Engine overlay for the Royal Match GDD. See [GDD.md](../../GDD.md).

## Target

- **Unity**: 2022.3 LTS or later
- **Render pipeline**: URP 2D
- **Input**: New Input System, touch-first
- **Platforms**: iOS + Android primary; PC/Tablet secondary
- **Networking**: online-required (account sync, events); match-3 itself is offline-simulated

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP 2D |
| `com.unity.inputsystem` | Touch / swipe |
| `com.unity.addressables` | Level data + palace assets loaded on demand |
| `com.unity.textmeshpro` | UI |
| `com.unity.ugui` | Canvas |
| `com.unity.localization` | Multi-language |
| `com.unity.timeline` | Palace restoration cinematics |

Third-party:
- **DOTween** — all the juice tweens
- **More Mountains' Feel / Feedbacks** (optional) — juice pipeline
- **MessagePack-CSharp** — wire format
- **UniTask** — async/await with Unity lifecycle

## Core Architecture

### Puzzle Sim (Client-Side)

Match-3 is simulated client-side:
- Grid state + piece types
- Deterministic with seeded RNG per level
- Server validates outcomes (moves + final state)

### Separation of Sim and View

- `Game.Sim.Grid` — logical grid of pieces
- `Game.Sim.MatchResolver` — finds + processes matches
- `Game.View.GridView` — visual representation

### Level-Scoped Data

Each level is an asset:
- Grid layout
- Obstacles positions
- Objective
- Move budget
- Initial board state

## Project Layout

```
Assets/
  _Project/
    Art/
      Pieces/                  # color pieces (5-6 variants)
      PowerUps/                # rocket, bomb, lightball sprites + animations
      Obstacles/               # box, chain, ice, jelly
      Characters/              # King Robert, companions
      Palace/                  # palace rooms + restoration states
      VFX/                     # particles + juice effects
      UI/
    Data/
      Levels/                  # thousands of LevelDefinition SOs
      PalaceAreas/             # area definitions
      PalaceTasks/             # restoration tasks
      StoryScenes/             # VN-style story data
      Events/                  # seasonal events
    Prefabs/
      PieceView
      PowerUpView
      ObstacleView
      VFX/
      UI/
    Scenes/
      Boot.unity
      Menu.unity
      Level.unity
      Palace.unity
    Scripts/
      Core/
      Sim/                     # grid, matching, resolution
      View/
      Net/
      Levels/
      Palace/
      Story/
      Meta/
      UI/
      Input/
      Economy/
```

## Match-3 Sim

### Grid Representation

```csharp
public class Grid {
    public int Width, Height;
    public Piece[,] Cells;
    public HashSet<Vector2Int> Spawners;  // top-row spawn tiles
    public HashSet<Vector2Int> Holes;     // unusable tiles
}

public class Piece {
    public PieceType Type;   // Red, Blue, Green, Yellow, Purple, etc.
    public PowerUpType PowerUp;  // None, Rocket-H, Rocket-V, Bomb, Lightball
    public ObstacleType Obstacle;  // None, Box, Chain, Ice, Jelly
    public int Id;  // stable for View
}
```

### Swap + Resolve

```csharp
public class GridSim {
    public SwapResult Swap(Vector2Int a, Vector2Int b);
    public List<MatchEvent> ResolveMatches();  // finds + processes
    public void ApplyGravity();  // drop pieces down
    public void Refill();  // new pieces from top
}
```

### Match Detection

- Horizontal match-3+: row scan, count consecutive same-color
- Vertical match-3+: column scan
- L / T / cross: specific shape patterns
- Prioritize **bigger matches** (match-5 > match-4 > match-3) when pieces overlap

### Power-Up Creation

Based on match shape:
- Match-4 row: Rocket horizontal
- Match-4 col: Rocket vertical
- Match-5 row/col: Lightball
- L / T shape: Bomb
- 5-cross: Rainbow bomb (rare)

### Power-Up Fire

Each fires a specific pattern:
- Rocket: clears 1 row or 1 column
- Bomb: clears 3×3 around it
- Lightball (swap with color): clears all pieces of that color
- Combos (two power-ups swap): special mega-effects

### Cascading

After match → gravity → refill → recheck for new matches. Loop until no new matches.

Return a list of `MatchEvent`:
```csharp
public struct MatchEvent {
    public MatchEventType Type;  // Match, Cascade, PowerUpFire, PieceDestroyed
    public List<Vector2Int> Positions;
    public PowerUpType CreatedPowerUp;
    public int ChainIndex;  // which cascade level
    public float Timestamp;  // for scheduling view animations
}
```

## Level Definition

```csharp
[CreateAssetMenu]
public class LevelDefinition : ScriptableObject {
    public int LevelNumber;
    public string Name;
    public Vector2Int GridSize;
    public GridShape Shape;  // which cells usable
    public int MoveBudget;
    public List<ObjectiveEntry> Objectives;
    public List<PieceType> PaletteColors;  // usually 5 of 6 colors
    public InitialState StartingBoard;  // preplaced obstacles, power-ups
    public List<SpecialMechanic> Mechanics;  // conveyor, gravity twist, etc.
    public int DifficultyTarget;  // expected clear rate
}
```

## View

- `View.LevelPresenter` — orchestrates level scene
- `View.GridView` — renders grid state
- `View.PieceView` — individual piece GameObject with animator
- `View.PowerUpView` — power-up visuals
- `View.ObstacleView` — obstacle visuals
- `View.VFXPool` — juice effects pool
- `View.JuicyCamera` — screen shake + zoom for combos
- `View.PopupView` — floating "Sweet!" text popups
- `View.CharacterReactionView` — King Robert's reactions

### Juice Pipeline

Each sim event produces a series of view animations:

```csharp
public class JuiceSequencer {
    public IEnumerator PlayMatchEvent(MatchEvent evt) {
        // Piece bounces
        yield return piece.Bounce();
        // Particle explosion
        vfxPool.Spawn(evt.PieceType);
        // Popup
        if (evt.ChainIndex > 1) popup.Show($"x{evt.ChainIndex}");
        // Audio
        audio.Play("match", evt.ChainIndex);
        // Haptic
        haptic.Light();
    }
}
```

## Input

- `Input.SwipeDetector` — detects tap + swipe direction
- `Input.GridInputMapper` — converts screen pos → grid cell
- `Input.PowerUpTapper` — tap a placed power-up to fire
- `Input.SettingsButton` — settings menu access

## Palace Scene

- `Palace.PalaceScene` — palace management scene
- `Palace.AreaView` — renders a palace area
- `Palace.TaskPin` — tappable restoration pin
- `Palace.StarSpender` — spend stars on task
- `Palace.RestorationAnimator` — plays the restoration cinematic

## Story System (Visual Novel)

- Palace restoration triggers story scenes
- Character portraits + dialog bubbles
- Scripted via `StoryScene` ScriptableObjects
- Choice nodes (optional) for major beats

## Networking

- `Net.AccountClient` — sync: inventory, lives, progress, palace state
- `Net.LevelSubmissionService` — send level outcome for validation
- `Net.EventService` — event state sync
- `Net.RoyalPassService` — battle pass progress
- `Net.TeamService` — kingdom (team) chat + contributions

## Economy

- `Economy.LifeService` — life count + regen timer (server-time-aware)
- `Economy.CurrencyService` — coins, gems
- `Economy.BoosterService` — booster inventory + purchase
- `Economy.ShopService` — IAP + event shop

## UI

- **Level Select**: scrolling path with level nodes
- **Level Screen**: HUD + grid
- **Pause Menu**: sound, settings, give up, buy moves
- **Out of Moves Panel**: offer +5 moves
- **Level Complete Panel**: stars + coins + palace prompt
- **Palace UI**: area selector, task pins, character popups
- **Shop Panel**: coin bundles, booster packs, passes
- **Kingdom (Team) Panel**: team info + chat

## Performance

- 50–100 active pieces peak
- ~500 active particles during big combos
- 60 FPS on all target devices
- Pool everything (pieces, VFX, popups)
- URP 2D with Pixel-Perfect camera for crisp art

## Audio

- FMOD or Wwise for rich audio
- Musical match chains (ascending notes per chain level)
- Distinct sound sets per event
- Music: ~20 tracks rotating by chapter

## Common Unity Pitfalls

- **Running match-3 in Update()**: separate sim from frame loop
- **Using tween callbacks that fire after destroy**: check DOTween `onComplete` safety
- **Over-instantiating particles**: pool everything
- **UI rebuild storm**: separate HUD canvas from grid canvas
- **Physics used for gravity**: don't! use scripted tween for deterministic drops

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Match-3 Engine](references/match3-engine.md)
