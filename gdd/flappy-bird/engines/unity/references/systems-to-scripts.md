# Systems → Scripts Map — Flappy Bird (Unity)

Maps each gameplay system to Unity C# scripts, GameObjects, components, and assets.

## Project Layout

```
Assets/_FlappyBird/
├── Scenes/Game.unity
├── Scripts/
│   ├── GameManager.cs
│   ├── BirdController.cs
│   ├── BirdAnimator.cs
│   ├── PipePair.cs
│   ├── PipeSpawner.cs
│   ├── GroundScroller.cs
│   ├── BackgroundParallax.cs
│   ├── ScoreManager.cs
│   ├── MedalCalculator.cs
│   ├── AudioManager.cs
│   ├── UIController.cs
│   ├── InputReader.cs
│   ├── DayNightTheme.cs
│   ├── AdsManager.cs
│   └── GameConfig.cs
├── Prefabs/
│   ├── Bird.prefab
│   ├── PipePair.prefab
│   └── Ground.prefab
├── ScriptableObjects/DefaultConfig.asset
├── Input/FlappyControls.inputactions
├── UI/
│   ├── ReadyPanel.prefab
│   ├── HUDPanel.prefab
│   └── GameOverPanel.prefab
├── Sprites/FlappyAtlas.spriteatlas
└── Audio/sfx_wing.wav, sfx_point.wav, sfx_hit.wav, sfx_die.wav, sfx_swoosh.wav
```

## GameObject Hierarchy (Game.unity)

```
├── Main Camera (Orthographic, Size 5.12)
├── WorldRoot
│   ├── BackgroundSky
│   ├── BackgroundClouds
│   ├── PipesRoot
│   ├── Ground
│   └── Bird
├── Systems
│   ├── GameManager
│   ├── PipeSpawner
│   ├── ScoreManager
│   ├── AudioManager
│   ├── InputReader
│   └── AdsManager
└── UICanvas
    ├── ReadyPanel
    ├── HUDPanel
    └── GameOverPanel
```

## Component / Script Attachment

| GameObject | Components |
|---|---|
| Main Camera | Camera (Orthographic), AudioListener |
| BackgroundSky | SpriteRenderer (order -20), **DayNightTheme** |
| BackgroundClouds | SpriteRenderer (order -10), **BackgroundParallax** |
| PipesRoot | Transform only (parent of pooled PipePair instances) |
| Ground | SpriteRenderer (tileable), BoxCollider2D, **GroundScroller**, tag: "Ground" |
| Bird | Rigidbody2D (Kinematic, GravityScale=0), CircleCollider2D, SpriteRenderer (child), **BirdController**, **BirdAnimator**, tag: "Bird" |
| GameManager | **GameManager**, references to all systems |
| PipeSpawner | **PipeSpawner**, config + prefab refs |
| ScoreManager | **ScoreManager** |
| AudioManager | AudioSource, **AudioManager**, 5 clip refs |
| InputReader | **InputReader** |
| AdsManager | **AdsManager** (optional; ifdef'd for mobile) |
| UICanvas | Canvas (Overlay), CanvasScaler (1080×1920, Match 0.5), GraphicRaycaster, **UIController** |
| ReadyPanel | Panel (Image + CanvasGroup), "Get Ready" graphic, tap-prompt |
| HUDPanel | TextMeshProUGUI (big score, anchored top-center) |
| GameOverPanel | Score + Best TMP texts, medal Image, OK Button, Share Button |

## Class Responsibilities

### GameManager

| Method | Role |
|---|---|
| `Start()` | Enters Ready state; bird positioned; UI shows Ready panel |
| `StartGame()` | Transitions Ready → Playing; begins spawner; resets score |
| `OnBirdHit()` | Transitions Playing → Dying; plays hit SFX; stops spawner |
| `OnBirdLanded()` | Transitions Dying → GameOver; commits best; shows GameOver UI; maybe ad |
| `Restart()` | SceneManager.LoadScene(0) — clean state reset |

### BirdController

| Method | Role |
|---|---|
| `EnterReady()` | Freezes bird at start position, zero velocity |
| `EnterPlaying()` | Enables input; kicks vy = flapVelocity for first frame |
| `EnterDying()` | Disables input; physics keeps falling to ground |
| `HandleFlap()` | Input callback — consumes "start game" tap OR applies flap impulse |
| `FixedUpdate()` | Integrates custom gravity; clamps maxFallSpeed; MovePosition; lerps rotation |
| `OnCollisionEnter2D()` | On Ground: hit+landed. On anything else: hit (pipe) |
| `OnTriggerEnter2D()` | On ScoreZone: increment score, play point SFX |

### BirdAnimator

| Method | Role |
|---|---|
| `Update()` | Advances 3-frame flap cycle at 10 FPS |

### PipePair

| Method | Role |
|---|---|
| `SpawnAt(x, gapCenterY, gap)` | Repositions parent + upper/lower children; activates |
| `Deactivate()` | Returns pipe pair to pool |
| `FixedUpdate()` | Translates left at scrollSpeed |

### PipeSpawner

| Method | Role |
|---|---|
| `Start()` | Pre-instantiates poolSize PipePairs, deactivates them |
| `Begin()` | Starts spawn timer |
| `Stop()` | Freezes spawning on death |
| `Clear()` | Returns all active pipes to pool (used on scene reload and Ready) |
| `Update()` | Ticks timer; spawns on interval; recycles off-screen pipes |
| `SpawnOne()` | Dequeues pooled pipe; randomizes gap Y; activates at spawn X |

### GroundScroller

| Method | Role |
|---|---|
| `Update()` | Advances Material.mainTextureOffset on X (UV scroll) |

### BackgroundParallax

| Method | Role |
|---|---|
| `Update()` | Slow parallax scroll for clouds at fraction of world scroll speed |

### ScoreManager

| Method | Role |
|---|---|
| `Awake()` | Loads Best from PlayerPrefs |
| `Reset()` | Zero Current; fire OnScoreChanged |
| `Increment()` | Current++; fire OnScoreChanged |
| `CommitBestIfNew()` | If Current > Best, save to PlayerPrefs |

### MedalCalculator (static)

| Method | Role |
|---|---|
| `For(score, config)` | Threshold check → Medal enum (None/Bronze/Silver/Gold/Platinum) |

### AudioManager

| Method | Role |
|---|---|
| `PlayWing()` | `source.PlayOneShot(wing)` |
| `PlayPoint()` | Same, point clip |
| `PlayHit()` | Same, hit clip |
| `PlayDie()` | Same, die clip |
| `PlaySwoosh()` | Same, swoosh (menu transitions) |

### UIController

| Method | Role |
|---|---|
| `ShowReady()` | Only ReadyPanel active |
| `ShowHUD()` | Only HUDPanel active |
| `ShowGameOver(score, best, medal)` | GameOverPanel active; fills texts + medal sprite |

### InputReader

| Method | Role |
|---|---|
| `OnEnable()` | Subscribes FlappyControls.Gameplay.Flap → OnFlap event |
| `OnDisable()` | Unsubscribes + disables controls |

Exposes `event Action OnFlap` consumed by BirdController.

### DayNightTheme

| Method | Role |
|---|---|
| `Awake()` | 50% probability swap sky sprite to night variant |

### AdsManager (optional)

| Method | Role |
|---|---|
| `Start()` | MobileAds.Initialize + load banner + interstitial |
| `MaybeShowInterstitial()` | Every N deaths, show interstitial if loaded |

### GameConfig (ScriptableObject)

Fields (grouped):

| Group | Fields |
|---|---|
| Bird | `gravity`, `flapVelocity`, `maxFallSpeed`, `rotUpDeg`, `rotDownDeg`, `rotLerpSpeed` |
| World | `scrollSpeed`, `pipeSpawnInterval`, `pipeGap`, `pipeSpawnX`, `pipeDespawnX`, `pipeYRange` |
| Medals | `bronzeScore`, `silverScore`, `goldScore`, `platinumScore` |
| Pool | `pipePoolSize` |

## Tags + Layers

| Tag | GameObject(s) |
|---|---|
| `Bird` | Bird |
| `Ground` | Ground |
| `ScoreZone` | PipePair/ScoreZone child (trigger) |
| `Pipe` | PipePair/UpperPipe, LowerPipe (optional — default tag fine) |

Layers: single default layer is sufficient; Flappy has no layer-based physics filtering.

## Physics Setup (Project Settings)

- Fixed Timestep: 0.02 (50 Hz).
- Physics 2D Gravity: **(0, 0)** — bird uses custom gravity integration.
- Default Contact Offset: 0.01.
- Auto Sync Transforms: enabled (helps Transform-driven pipe scroll).

## Input System Setup

### FlappyControls.inputactions

- **Action Maps**:
  - `Gameplay` → `Flap` (Button).
- **Bindings** for `Flap`:
  - `<Touchscreen>/primaryTouch/press`
  - `<Mouse>/leftButton`
  - `<Keyboard>/space`

### Input Usage

- InputReader instantiates FlappyControls, enables map, forwards `performed` callback to `OnFlap` event.
- Single subscriber: BirdController. GameManager transitions handled inside BirdController.HandleFlap.

## Canvas UI

- Canvas: Screen Space - Overlay.
- CanvasScaler: Scale with Screen Size, reference 1080×1920, Match Width 0.5.
- ReadyPanel: "Get Ready" title + tap-prompt icon.
- HUDPanel: single large TMP centered horizontally, anchored top third of screen.
- GameOverPanel:
  - "Game Over" banner.
  - ScorePlate: current score (right-aligned digits) + medal icon (left) + best score.
  - OK button → GameManager.Restart().
  - Share button → platform share sheet (optional; not implemented in canonical scripts).

## Prefabs

### Bird.prefab

- Root: Transform + Rigidbody2D + CircleCollider2D + BirdController + tag "Bird".
- Child "SpriteRoot": SpriteRenderer + BirdAnimator.
  - The sprite is a child so rotation is applied to the sprite only; the Rigidbody parent stays axis-aligned for clean collisions.

### PipePair.prefab

- Root: Transform + PipePair.cs (no collider).
- Children:
  - `UpperPipe`: SpriteRenderer (flipped vertically) + BoxCollider2D.
  - `LowerPipe`: SpriteRenderer + BoxCollider2D.
  - `ScoreZone`: BoxCollider2D (trigger, isTrigger = true), tag "ScoreZone", sized to gap.

### Ground.prefab

- SpriteRenderer with tileable material (TextureWrapMode.Repeat).
- BoxCollider2D spanning screen width.
- GroundScroller component.
- Tag: "Ground".

## Typical Call Graph — Tap to Start

1. Player touches screen.
2. Input System fires Gameplay/Flap action `performed`.
3. `InputReader.OnFlap` event invoked.
4. `BirdController.HandleFlap()`:
   - Checks `GameManager.State == Ready`.
   - Calls `GameManager.Instance.StartGame()`.
5. `GameManager.StartGame()`:
   - SetState(Playing).
   - `bird.EnterPlaying()` — enables input, sets vy = flapVelocity.
   - `spawner.Begin()`.
   - `score.Reset()`.
   - `ui.ShowHUD()`.

## Typical Call Graph — Pipe Pass (Score)

1. Bird transform advances into PipePair/ScoreZone trigger.
2. `BirdController.OnTriggerEnter2D(col)` fires.
3. `col.CompareTag("ScoreZone")` = true.
4. `ScoreManager.Increment()` — Current++, fires OnScoreChanged.
5. UIController.hudScore.text updated via listener.
6. `AudioManager.PlayPoint()` plays chime.

## Typical Call Graph — Collision + Death

1. Bird collides with pipe collider.
2. `BirdController.OnCollisionEnter2D(col)` fires.
3. `col.collider.CompareTag("Ground")` = false (it's a pipe).
4. `GameManager.Instance.OnBirdHit()`:
   - SetState(Dying).
   - `audio.PlayHit()`.
   - `bird.EnterDying()` — disables input.
   - `spawner.Stop()`.
5. Custom gravity continues pulling bird down in FixedUpdate.
6. Eventually bird collides with Ground collider.
7. `BirdController.OnCollisionEnter2D(col)` fires again:
   - `col.collider.CompareTag("Ground")` = true.
   - `OnBirdHit()` short-circuits (already Dying).
   - `OnBirdLanded()`:
     - SetState(GameOver).
     - `audio.PlayDie()`.
     - `score.CommitBestIfNew()`.
     - `ui.ShowGameOver(score.Current, score.Best, MedalCalculator.For(…))`.
     - `ads.MaybeShowInterstitial()`.

## Execution Order

Unity Script Execution Order (Project Settings → Script Execution Order):

- `InputReader` — -200 (enables controls before consumers subscribe).
- `GameConfig` (ScriptableObject, no script order).
- `GameManager` — -100 (establishes Instance singleton).
- `ScoreManager`, `AudioManager` — -100.
- Default (0) for everything else.
- `BirdController`, `PipePair` — default; FixedUpdate order between them is unimportant (MovePosition + Translate both commit in same physics step).

## Builds

### Android

- Player Settings → Orientation: Portrait, Portrait Upside Down.
- Minimum API Level: 23.
- Scripting Backend: IL2CPP.
- Target Architectures: ARM64 (required for Play Store).
- Compression: LZ4HC.
- Output: ~10-15 MB AAB.

### iOS

- Orientation: Portrait only.
- Target minimum iOS 13.
- Scripting Backend: IL2CPP.
- Strip Engine Code: enabled.
- Output: ~20 MB IPA.

### WebGL

- Compression Format: Gzip.
- Canvas: 540×960 (portrait) or responsive with CSS wrapper.
- Input: Pointer + Keyboard (no Touchscreen on standard WebGL).
- Output: ~6-8 MB gzipped.

### Desktop (Standalone)

- Windowed, fixed 540×960 portrait, or centered with black letterbox.
- Input: mouse left-click + spacebar.
- Output: ~40-70 MB (Unity runtime dominates).

## Testing

### Edit Mode (no Play Mode, no scene)

- `MedalCalculatorTests.cs`:
  - `For(0) == None`, `For(9) == None`, `For(10) == Bronze`, `For(19) == Bronze`, `For(20) == Silver`, `For(30) == Gold`, `For(40) == Platinum`, `For(9999) == Platinum`.
- `ScoreManagerTests.cs`:
  - Clear PlayerPrefs, Awake → Best == 0.
  - Increment × 5 → Current == 5.
  - CommitBestIfNew → Best == 5, PlayerPrefs persists.

### Play Mode

- `BirdFallsTest.cs`: enter Playing state without firing OnFlap, wait 120 FixedUpdates, assert bird has descended and hit Ground.
- `TapFlapsTest.cs`: invoke InputReader.OnFlap, FixedUpdate once, assert bird.vy == flapVelocity (introspection via [SerializeField]).
- `PipeRecycleTest.cs`: run 30 seconds simulated (mock Time.deltaTime ok, or just wait real-time), assert active.Count ≤ poolSize at all times.
- `ScoreOnPassTest.cs`: place PipePair with ScoreZone at known X, teleport bird past it, assert Current == 1.
- `BestPersistsTest.cs`: score 5, die, reload scene, Awake, assert Best == 5.

## Debug Utilities

- `OnDrawGizmos` on PipePair: draws gap bounds (green) for visual tuning.
- `OnDrawGizmos` on Bird: draws current vy vector.
- Inspector: expose Bird.vy as `[SerializeField]` (read-only in custom inspector for display).
- Cheat code: hold Alt + L to toggle "God mode" skipping death (dev build only).

## Profiling

- Unity Profiler: verify <1 ms/frame on mid-tier mobile (Snapdragon 660 class).
- Deep Profile during Play to catch per-frame allocations.
- GC Alloc target: 0 bytes/frame during gameplay (pool pipes, cache WaitForSeconds, avoid string concat in score UI — use `TextMeshProUGUI.SetText(int)` to avoid allocation).

## Migration Notes

- Input Manager → Input System: convert `Input.GetMouseButtonDown(0) || Input.touchCount > 0` to a single `Flap` action with multiple bindings.
- `rb.velocity` → `rb.linearVelocity` (Unity 6+) — we use kinematic + MovePosition instead to sidestep the rename.
- Legacy ad SDK (Unity Ads) → Google Mobile Ads (AdMob) — higher eCPM on most regions.
- Cocos2d-x reference port: preserve exact gravity/flap ratio when translating; the difference between "satisfying Flappy" and "unplayable Flappy" is ±10% tuning.

## What's NOT in This Unity Port

- **Original Mario-pipe art** — re-drawn assets avoid copyright exposure; style-adjacent only.
- **Original iOS 6 timing quirks** — Unity's deterministic FixedUpdate replaces Cocos2d's scheduler.
- **Game Center / Play Games leaderboards** by default — left as optional polish.
- **Network multiplayer** — the 2013 game was single-player only; so is this.
- **Cross-device best-score sync** — PlayerPrefs is device-local. Cloud save is a polish-pass addition (iCloud KVS / Play Games Saved Games).
