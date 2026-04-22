# Systems → Scripts Map — Pong (Unity)

Maps each gameplay system to Unity C# scripts, GameObjects, components, and assets.

## Project Layout

```
Assets/_Pong/
├── Scenes/Game.unity                 # Single scene
├── Scripts/
│   ├── GameManager.cs
│   ├── PaddleController.cs
│   ├── AIPaddleController.cs
│   ├── BallController.cs
│   ├── BallCollisionHandler.cs
│   ├── ScoreUI.cs
│   ├── PauseController.cs
│   ├── GameConfig.cs
│   └── AudioManager.cs
├── Prefabs/
│   ├── Paddle.prefab
│   ├── Ball.prefab
│   └── Wall.prefab
├── ScriptableObjects/
│   └── DefaultConfig.asset
├── Input/
│   └── PongControls.inputactions
├── UI/
│   ├── GameHUD.prefab
│   └── PauseOverlay.prefab
└── Audio/
    ├── beep-paddle.wav
    ├── beep-wall.wav
    └── beep-score.wav
```

## GameObject Hierarchy (Game.unity)

```
├── Main Camera
├── Walls
│   ├── Wall_Top
│   └── Wall_Bottom
├── Paddles
│   ├── Paddle_P1
│   └── Paddle_P2
├── Ball
├── Goals
│   ├── Goal_Left
│   └── Goal_Right
├── Managers
│   ├── GameManager
│   └── AudioManager
└── Canvas
    ├── ScoreText_P1
    ├── ScoreText_P2
    └── PauseOverlay
```

## Component / Script Attachment

| GameObject | Components |
|---|---|
| Main Camera | Camera (Orthographic, Size 5), AudioListener |
| Wall_Top/Bottom | BoxCollider2D, tag: "Wall" |
| Paddle_P1 | Rigidbody2D (Kinematic), BoxCollider2D, SpriteRenderer, **PaddleController**, tag: "Paddle" |
| Paddle_P2 | Rigidbody2D (Kinematic), BoxCollider2D, SpriteRenderer, **PaddleController** OR **AIPaddleController** |
| Ball | Rigidbody2D (Dynamic, Gravity 0, Continuous), CircleCollider2D, SpriteRenderer, **BallController**, **BallCollisionHandler**, tag: "Ball" |
| Goal_Left | BoxCollider2D (Is Trigger), tag: "GoalP2" |
| Goal_Right | BoxCollider2D (Is Trigger), tag: "GoalP1" |
| GameManager | **GameManager** script, references to Ball/Paddles/ScoreUI/Config |
| AudioManager | AudioSource, **AudioManager** script, 3 AudioClip references |
| Canvas | Canvas, CanvasScaler, GraphicRaycaster, **ScoreUI** script |
| PauseOverlay | Panel (Image + CanvasGroup), **PauseController** script |

## Class Responsibilities

### GameManager

| Method | Role |
|---|---|
| `OnPaddleHit()` | Increments hit count; bumps ball speed tier |
| `OnGoal(int scoredBy)` | Awards point; checks for match win; starts serve |
| `StartServeCountdown()` | Disables ball; sets timer |
| `ServeBall()` | Activates ball; calls `BallController.Serve()` |
| `BumpBallSpeed()` | Computes tier multiplier from hit count |
| `ResetMatch()` | Zero scores; first serve |
| `GameOver()` | Displays winner via ScoreUI |
| `TogglePause()` | Sets `Time.timeScale` |

### PaddleController

| Method | Role |
|---|---|
| `OnMove(InputAction.CallbackContext)` | Input callback; stores axis value |
| `FixedUpdate()` | Applies velocity × deltaTime; clamps to court |

### AIPaddleController

| Method | Role |
|---|---|
| `FixedUpdate()` | Calls predictor; moves toward predicted Y with jitter |
| `PredictBallArrivalY()` | Simulates ball forward until X reached, with wall bounces |

### BallController

| Method | Role |
|---|---|
| `Serve(direction, speed)` | Resets position; sets velocity at ±22.5° |
| `SetSpeedMultiplier(mult)` | Scales velocity for speed tiers |
| `ReflectOffPaddle(paddle, height)` | Computes new velocity vector from hit offset |

### BallCollisionHandler

| Method | Role |
|---|---|
| `OnCollisionEnter2D(Collision2D)` | Dispatches to `ReflectOffPaddle` on paddle OR plays wall SFX |
| `OnTriggerEnter2D(Collider2D)` | Dispatches to `GameManager.OnGoal()` on goal |

### ScoreUI

| Method | Role |
|---|---|
| `Refresh(int p1, int p2)` | Update TMP text elements |
| `ShowWinner(int winner)` | Reveal winner banner |

### AudioManager

| Method | Role |
|---|---|
| `PlayPaddleHit()` | `AudioSource.PlayOneShot(paddleHit)` |
| `PlayWallHit()` | Same, wall clip |
| `PlayScore()` | Same, score clip |

### PauseController

| Method | Role |
|---|---|
| `OnPause(InputAction.CallbackContext)` | Toggles pause via GameManager; shows/hides overlay |

### GameConfig (ScriptableObject)

Fields:

| Field | Type |
|---|---|
| `targetScore` | int |
| `serveDelay` | float |
| `paddleSpeed` | float |
| `paddleHeight` | float |
| `ballInitialSpeed` | float |
| `ballMaxSpeed` | float |
| `maxReflectionAngleDeg` | float |
| `speedTier1Hits`, `speedTier2Hits`, `speedTier3Hits` | int |
| `aiMaxSpeed`, `aiJitter` | float |

## Tags + Layers

| Tag | GameObject(s) |
|---|---|
| `Ball` | Ball |
| `Paddle` | Paddle_P1, Paddle_P2 |
| `Wall` | Wall_Top, Wall_Bottom |
| `GoalP1` | Goal_Right (ball past here = P1 scored? No — past Right = P1 conceded; tag is which player *collects* point, so Goal_Right tagged GoalP1 means scoring there gives P1 point. Inversely Goal_Left tagged GoalP2.) |
| `GoalP2` | Goal_Left |

(Be consistent with tag semantics — the included code uses: crossing into left goal trigger = P2 scores; crossing right goal = P1 scores. Tag names reflect "who scores when ball enters this".)

Layer: default for all; add `Goal` layer if filtering needed.

## Physics Setup (Project Settings)

- Fixed Timestep: 0.02 (50 Hz) or 0.01667 (60 Hz) for smoother motion.
- Gravity: (0, 0) — Pong is zero-gravity.
- 2D Physics:
  - Default Contact Offset: 0.01.
  - Baumgarte Scale: default.
- Physics Material 2D (`Bouncy.physicsMaterial2D`): Friction 0, Bounciness 1. Assigned to Ball + Walls.

## Input System Setup

### PongControls.inputactions

- **Action Maps**:
  - `Player1` → `Move` action (1D axis, W=+1, S=-1).
  - `Player2` → `Move` action (1D axis, ↑=+1, ↓=-1).
  - `Global` → `Pause` (Button, Space/Escape).

### PlayerInput component

- Attach to each paddle.
- Actions asset: `PongControls`.
- Default Action Map: `Player1` for P1, `Player2` for P2.
- Behavior: Send Messages OR Invoke Unity Events.
- Wires `OnMove` to `PaddleController.OnMove`.

## Canvas UI

- Canvas: Screen Space - Overlay.
- CanvasScaler: Scale with Screen Size, reference 1920×1080, match 0.5.
- ScoreText_P1: TMP_Text, anchor top (0.25, 1), large font (96pt).
- ScoreText_P2: TMP_Text, anchor top (0.75, 1), large font.
- PauseOverlay: inactive by default; full-screen image + "PAUSED" text + resume button.
- WinnerText: hidden by default; shown via `ScoreUI.ShowWinner()`.

## Prefabs

### Paddle.prefab

- Root GameObject with:
  - Transform.
  - SpriteRenderer (white rectangle, 0.2×1.6).
  - Rigidbody2D (Kinematic).
  - BoxCollider2D (0.2×1.6).
  - No script; attach PaddleController or AIPaddleController in scene.

### Ball.prefab

- Root GameObject with:
  - Transform.
  - SpriteRenderer (white circle, 0.3×0.3).
  - Rigidbody2D (Dynamic, Gravity 0, Continuous Collision).
  - CircleCollider2D (radius 0.15) + Bouncy physics material.
  - BallController + BallCollisionHandler.
  - Tag: Ball.

### Wall.prefab

- Root with BoxCollider2D + Bouncy material.
- Tag: Wall.
- Transform scale used to adjust width.

## Typical Call Graph — Ball Hits Paddle

1. Unity physics: ball rigidbody collides with paddle collider.
2. `BallCollisionHandler.OnCollisionEnter2D(col)` fires on ball.
3. `col.gameObject.CompareTag("Paddle")` = true.
4. `BallController.ReflectOffPaddle(col.transform, config.paddleHeight)`:
   - Compute hitOffset.
   - Compute new angle.
   - Set `rb.linearVelocity`.
5. `GameManager.Instance.OnPaddleHit()`:
   - `hitCount++`.
   - `BumpBallSpeed()` updates multiplier if tier threshold crossed.
6. `AudioManager.Instance.PlayPaddleHit()` — `PlayOneShot(paddleHit)`.

## Typical Call Graph — Goal

1. Ball enters trigger collider on Goal.
2. `BallCollisionHandler.OnTriggerEnter2D(col)` fires on ball.
3. `col.CompareTag("GoalP1")` = true → `GameManager.OnGoal(1)`.
4. `GameManager.OnGoal()`:
   - `scoreP1++`.
   - `scoreUI.Refresh(scoreP1, scoreP2)`.
   - Check `>= targetScore` → if yes, `GameOver()`, else `StartServeCountdown()`.
5. `AudioManager.PlayScore()` — buzz.
6. After `serveDelay` in `Update`, `GameManager.ServeBall()`:
   - `ball.gameObject.SetActive(true)`.
   - `ball.Serve(direction, baseSpeed)`.

## Execution Order

Unity Script Execution Order (Project Settings):

- `GameManager` — -100 (earliest; establishes Instance singleton).
- `AudioManager` — -100.
- Default (0) for all others.

Order matters for FixedUpdate-order deterministic physics — usually not needed for Pong.

## Builds

### WebGL

- Player Settings → WebGL → Compression: Gzip.
- Strip engine code: enabled.
- Canvas size: 960×540 or responsive.
- Output: ~4-6 MB total.

### Desktop (Standalone)

- Windows / Mac / Linux builds.
- Resolution dialog: allow user selection.
- Output: ~40-80 MB (includes Unity runtime).

### Mobile

- iOS / Android.
- Touch input via Input System `Touchscreen` device.
- Extend PaddleController with drag-to-position mode.

## Testing

### Edit Mode

- `ReflectionMathTests.cs`: verify reflection angles for known hit offsets.
- `SpeedTierTests.cs`: verify `BumpBallSpeed()` correct multiplier per hitCount.

### Play Mode

- `BallBouncesOffPaddleTest.cs`: spawn ball, force position onto paddle, wait frames, assert `vx` sign flipped.
- `ScoringTest.cs`: teleport ball past goal, assert score++.

## Debug Utilities

- Gizmos: draw predicted AI ball trajectory in `OnDrawGizmos()`.
- Inspector fields: expose `hitCount`, `speedMultiplier` via `[SerializeField]` or property-drawer.

## Profiling

- Unity Profiler: confirm <1ms/frame on any modern hardware.
- Deep Profile to check for per-frame allocations.
- GC Alloc target: 0 bytes/frame during gameplay.

## Migration Notes

- Moving from legacy Input Manager → Input System: replace `Input.GetAxis` in Update with `InputAction.ReadValue<float>()` in Update, or use callback pattern.
- Moving from `rb.velocity` → `rb.linearVelocity` (Unity 6+).
- Moving from built-in sprite shaders → URP/2D sprite shaders for lighting.
