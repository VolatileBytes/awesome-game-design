---
id: pong
title: Pong — Unity Implementation
version: 0.1.0
description: Canonical Unity reconstruction of Pong — Rigidbody2D physics, Input System, UI Toolkit scoreboard, AudioSource beeps. Trivial project, ~200 lines of C#.
tags: [unity, urp, rigidbody2d, canvas, audio-source, c-sharp, tutorial]
---

# Pong — Unity Implementation

Engine overlay for Pong. See [base GDD](../../GDD.md).

> Unity's "hello world" project. Every introductory tutorial builds Pong. This overlay documents the canonical Unity structure: GameObject hierarchy, Rigidbody2D + Collider2D physics, MonoBehaviour input + UI, and a clean, tutorial-ready codebase.

## Target

- **Unity version**: 2022.3 LTS (minimum); 2023.2+ works identically.
- **Render pipeline**: Built-in (trivial) OR URP 2D (nicer).
- **Input**: Unity Input System (preferred) OR legacy Input Manager.
- **Platforms**: Windows, Mac, Linux, WebGL, iOS, Android, consoles — Pong builds for everything.
- **Target FPS**: 60 (configurable; game is frame-rate independent via fixed timestep).
- **Project size**: <10 MB.

## Stack

| Piece | Technology |
|---|---|
| Physics | Rigidbody2D (kinematic paddles, dynamic ball) |
| Collisions | BoxCollider2D (paddles + walls), CircleCollider2D (ball) |
| Rendering | SpriteRenderer OR just Transform + primitive quads |
| Input | Input System (PlayerInput component + Actions asset) |
| UI | Unity Canvas (Text – TMP for score) |
| Audio | AudioSource per sound event |
| Scene | 1 scene (`Game.unity`) |
| State | Plain C# classes referenced from MonoBehaviours |

## Project Structure

```
Assets/
├── _Pong/
│   ├── Scenes/
│   │   └── Game.unity
│   ├── Scripts/
│   │   ├── GameManager.cs             # Match state; scoring; serving
│   │   ├── PaddleController.cs        # Input-driven paddle movement
│   │   ├── AIPaddleController.cs      # CPU opponent
│   │   ├── BallController.cs          # Ball movement + bounce
│   │   ├── PaddleCollider.cs          # Reflection math on collision
│   │   ├── ScoreUI.cs                 # Score display
│   │   ├── PauseController.cs         # Pause toggle + overlay
│   │   ├── GameConfig.cs              # ScriptableObject with tuning
│   │   └── AudioManager.cs            # Beep player
│   ├── Prefabs/
│   │   ├── Paddle.prefab
│   │   ├── Ball.prefab
│   │   └── Wall.prefab
│   ├── ScriptableObjects/
│   │   └── DefaultConfig.asset
│   ├── Input/
│   │   └── PongControls.inputactions  # Input System binding asset
│   ├── UI/
│   │   ├── GameHUD.prefab
│   │   └── PauseOverlay.prefab
│   ├── Audio/
│   │   ├── beep-paddle.wav
│   │   ├── beep-wall.wav
│   │   └── beep-score.wav
│   └── Settings/
│       └── URP2DRenderer.asset
└── Settings/
    ├── ProjectSettings/
    └── Packages/
        └── manifest.json
```

## Scene Hierarchy

```
Scene: Game
├── Main Camera (Orthographic, Size 5)
├── Walls
│   ├── Wall_Top      (BoxCollider2D)
│   └── Wall_Bottom   (BoxCollider2D)
├── Paddles
│   ├── Paddle_P1     (Rigidbody2D kinematic + BoxCollider2D + PaddleController + PaddleCollider)
│   └── Paddle_P2     (same, other side)
├── Ball              (Rigidbody2D dynamic + CircleCollider2D + BallController)
├── Goals
│   ├── Goal_Left     (BoxCollider2D trigger, tagged "GoalP2")
│   └── Goal_Right    (BoxCollider2D trigger, tagged "GoalP1")
├── Managers
│   ├── GameManager   (empty GO with GameManager.cs)
│   └── AudioManager  (empty GO with AudioSource + AudioManager.cs)
└── Canvas
    ├── ScoreText_P1  (TMP Text)
    ├── ScoreText_P2  (TMP Text)
    └── PauseOverlay  (inactive by default)
```

## Physics Setup

### Paddle

- `Rigidbody2D`: Body Type = **Kinematic**. No gravity, moved via code.
- `BoxCollider2D`: matches sprite size (~0.2 × 1.6 units).
- Tag: `Paddle`.

### Ball

- `Rigidbody2D`: Body Type = **Dynamic**. Gravity Scale = 0. Linear Drag = 0. Angular Drag = 0. Collision Detection = **Continuous**.
- `CircleCollider2D`: radius ~0.15 units.
- Physics Material 2D with Friction = 0, Bounciness = 1.
- Tag: `Ball`.

### Walls

- Static GameObject with `BoxCollider2D`.
- Physics Material 2D with Friction = 0, Bounciness = 1.

### Goals

- `BoxCollider2D` with **Is Trigger** enabled.
- Tags: `GoalP1` / `GoalP2`.

## Core Scripts

### GameConfig.cs (ScriptableObject)

```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "GameConfig", menuName = "Pong/Game Config")]
public class GameConfig : ScriptableObject {
    [Header("Match")]
    public int targetScore = 11;
    public float serveDelay = 1.0f;

    [Header("Paddle")]
    public float paddleSpeed = 8.0f;
    public float paddleHeight = 1.6f;

    [Header("Ball")]
    public float ballInitialSpeed = 6.0f;
    public float ballMaxSpeed = 18.0f;
    public float maxReflectionAngleDeg = 75f;

    [Header("Speed Progression")]
    public int speedTier1Hits = 4;     // Below: 1.0×
    public int speedTier2Hits = 12;    // Below: 1.33×
    public int speedTier3Hits = 16;    // Below: 1.66×
    // Above tier 3: 2.0×

    [Header("AI")]
    public float aiMaxSpeed = 7.0f;    // slightly slower than player
    public float aiJitter = 0.2f;
}
```

### GameManager.cs

```csharp
using UnityEngine;

public class GameManager : MonoBehaviour {
    public static GameManager Instance { get; private set; }

    [SerializeField] GameConfig config;
    [SerializeField] BallController ball;
    [SerializeField] Transform paddle1;
    [SerializeField] Transform paddle2;
    [SerializeField] ScoreUI scoreUI;

    public int scoreP1 { get; private set; }
    public int scoreP2 { get; private set; }
    public int hitCount { get; private set; }
    public bool paused { get; private set; }

    float serveTimer;
    bool serving;
    int lastScorer;

    void Awake() { Instance = this; }

    void Start() {
        ResetMatch();
    }

    void Update() {
        if (paused) return;
        if (serving) {
            serveTimer -= Time.deltaTime;
            if (serveTimer <= 0) ServeBall();
        }
    }

    public void OnPaddleHit() {
        hitCount++;
        BumpBallSpeed();
    }

    public void OnGoal(int scoredBy) {
        if (scoredBy == 1) scoreP1++;
        else scoreP2++;

        scoreUI.Refresh(scoreP1, scoreP2);

        if (scoreP1 >= config.targetScore || scoreP2 >= config.targetScore) {
            GameOver();
            return;
        }

        lastScorer = scoredBy;
        StartServeCountdown();
    }

    void StartServeCountdown() {
        ball.gameObject.SetActive(false);
        serving = true;
        serveTimer = config.serveDelay;
        hitCount = 0;
    }

    void ServeBall() {
        serving = false;
        ball.gameObject.SetActive(true);
        float direction = lastScorer == 1 ? -1f : 1f;
        ball.Serve(direction, config.ballInitialSpeed);
    }

    void BumpBallSpeed() {
        float mult = 1.0f;
        if (hitCount >= config.speedTier3Hits) mult = 2.0f;
        else if (hitCount >= config.speedTier2Hits) mult = 1.66f;
        else if (hitCount >= config.speedTier1Hits) mult = 1.33f;
        ball.SetSpeedMultiplier(mult);
    }

    void ResetMatch() {
        scoreP1 = scoreP2 = 0;
        hitCount = 0;
        scoreUI.Refresh(scoreP1, scoreP2);
        StartServeCountdown();
    }

    void GameOver() {
        // Show winner; wait for input to restart
        int winner = scoreP1 >= config.targetScore ? 1 : 2;
        scoreUI.ShowWinner(winner);
        ball.gameObject.SetActive(false);
    }

    public void TogglePause() { paused = !paused; Time.timeScale = paused ? 0 : 1; }
}
```

### PaddleController.cs

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class PaddleController : MonoBehaviour {
    [SerializeField] GameConfig config;
    [SerializeField] int playerIndex;  // 0 = P1 (W/S), 1 = P2 (↑/↓)

    Rigidbody2D rb;
    float inputY;

    void Awake() { rb = GetComponent<Rigidbody2D>(); }

    public void OnMove(InputAction.CallbackContext ctx) {
        inputY = ctx.ReadValue<float>();
    }

    void FixedUpdate() {
        Vector2 newPos = rb.position + Vector2.up * inputY * config.paddleSpeed * Time.fixedDeltaTime;
        newPos.y = Mathf.Clamp(newPos.y, -4f + config.paddleHeight / 2f, 4f - config.paddleHeight / 2f);
        rb.MovePosition(newPos);
    }
}
```

### BallController.cs

```csharp
using UnityEngine;

public class BallController : MonoBehaviour {
    [SerializeField] GameConfig config;

    Rigidbody2D rb;
    float speedMultiplier = 1f;
    float baseSpeed;

    void Awake() { rb = GetComponent<Rigidbody2D>(); }

    public void Serve(float direction, float speed) {
        baseSpeed = speed;
        speedMultiplier = 1f;
        transform.position = Vector3.zero;
        float angle = Random.Range(-Mathf.PI / 8f, Mathf.PI / 8f);  // ±22.5°
        rb.linearVelocity = new Vector2(Mathf.Cos(angle) * direction, Mathf.Sin(angle)) * speed;
    }

    public void SetSpeedMultiplier(float mult) {
        speedMultiplier = mult;
        rb.linearVelocity = rb.linearVelocity.normalized * baseSpeed * speedMultiplier;
    }

    public void ReflectOffPaddle(Transform paddle, float paddleHeight) {
        float hitOffset = (transform.position.y - paddle.position.y) / (paddleHeight / 2f);
        hitOffset = Mathf.Clamp(hitOffset, -1f, 1f);
        float angle = hitOffset * config.maxReflectionAngleDeg * Mathf.Deg2Rad;

        float currentSpeed = rb.linearVelocity.magnitude;
        float direction = -Mathf.Sign(rb.linearVelocity.x);
        rb.linearVelocity = new Vector2(direction * Mathf.Cos(angle), Mathf.Sin(angle)) * currentSpeed;
    }

    void OnTriggerEnter2D(Collider2D other) {
        if (other.CompareTag("GoalP1")) GameManager.Instance.OnGoal(2);
        if (other.CompareTag("GoalP2")) GameManager.Instance.OnGoal(1);
        AudioManager.Instance.PlayScore();
    }
}
```

### PaddleCollider.cs

```csharp
using UnityEngine;

public class PaddleCollider : MonoBehaviour {
    [SerializeField] GameConfig config;

    void OnCollisionEnter2D(Collision2D col) {
        if (col.gameObject.CompareTag("Ball")) {
            var ball = col.gameObject.GetComponent<BallController>();
            ball.ReflectOffPaddle(transform, config.paddleHeight);
            GameManager.Instance.OnPaddleHit();
            AudioManager.Instance.PlayPaddleHit();
        } else if (col.gameObject.CompareTag("Wall")) {
            AudioManager.Instance.PlayWallHit();
        }
    }
}
```

(Attach to the ball, not the paddles — the event triggers on contact with paddles; rename class accordingly, e.g., `BallCollisionHandler`.)

### AIPaddleController.cs

```csharp
using UnityEngine;

public class AIPaddleController : MonoBehaviour {
    [SerializeField] GameConfig config;
    [SerializeField] BallController ball;
    [SerializeField] float difficultyJitter = 0.2f;

    Rigidbody2D rb;

    void Awake() { rb = GetComponent<Rigidbody2D>(); }

    void FixedUpdate() {
        Vector2 ballVel = ball.GetComponent<Rigidbody2D>().linearVelocity;
        if (ballVel.x < 0) return;  // ball moving away; stay

        float targetY = PredictBallArrivalY(ball.transform.position, ballVel, transform.position.x);
        targetY += Random.Range(-difficultyJitter, difficultyJitter);

        float diff = targetY - rb.position.y;
        float move = Mathf.Clamp(diff, -config.aiMaxSpeed * Time.fixedDeltaTime, config.aiMaxSpeed * Time.fixedDeltaTime);
        Vector2 newPos = rb.position + Vector2.up * move;
        newPos.y = Mathf.Clamp(newPos.y, -4f + config.paddleHeight / 2f, 4f - config.paddleHeight / 2f);
        rb.MovePosition(newPos);
    }

    float PredictBallArrivalY(Vector2 ballPos, Vector2 ballVel, float targetX) {
        Vector2 p = ballPos;
        Vector2 v = ballVel;
        float dt = 1f / 60f;
        while ((v.x > 0 && p.x < targetX) || (v.x < 0 && p.x > targetX)) {
            p += v * dt;
            if (p.y < -4f) { p.y = -4f - (p.y + 4f); v.y = -v.y; }
            if (p.y > 4f) { p.y = 4f - (p.y - 4f); v.y = -v.y; }
        }
        return p.y;
    }
}
```

### ScoreUI.cs

```csharp
using TMPro;
using UnityEngine;

public class ScoreUI : MonoBehaviour {
    [SerializeField] TextMeshProUGUI scoreP1Text;
    [SerializeField] TextMeshProUGUI scoreP2Text;
    [SerializeField] TextMeshProUGUI winnerText;

    public void Refresh(int p1, int p2) {
        scoreP1Text.text = p1.ToString();
        scoreP2Text.text = p2.ToString();
    }

    public void ShowWinner(int winner) {
        winnerText.text = $"Player {winner} Wins!";
        winnerText.gameObject.SetActive(true);
    }
}
```

### AudioManager.cs

```csharp
using UnityEngine;

public class AudioManager : MonoBehaviour {
    public static AudioManager Instance { get; private set; }

    [SerializeField] AudioSource source;
    [SerializeField] AudioClip paddleHit;
    [SerializeField] AudioClip wallHit;
    [SerializeField] AudioClip scoreBuzz;

    void Awake() { Instance = this; }

    public void PlayPaddleHit() => source.PlayOneShot(paddleHit);
    public void PlayWallHit()   => source.PlayOneShot(wallHit);
    public void PlayScore()     => source.PlayOneShot(scoreBuzz);
}
```

### PauseController.cs

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

public class PauseController : MonoBehaviour {
    [SerializeField] GameObject overlay;

    public void OnPause(InputAction.CallbackContext ctx) {
        if (!ctx.performed) return;
        GameManager.Instance.TogglePause();
        overlay.SetActive(GameManager.Instance.paused);
    }
}
```

## Input System Setup

### PongControls.inputactions

| Action Map | Action | Binding |
|---|---|---|
| Player1 | Move | W (Positive) / S (Negative) |
| Player2 | Move | ↑ (Positive) / ↓ (Negative) |
| Global | Pause | Space, Escape |

Attach `PlayerInput` component to each paddle; map `OnMove` callback.

### Legacy Input Manager (Alternative)

```csharp
inputY = Input.GetAxisRaw("Vertical");  // P1: W/S mapped by default
```

## UI (Canvas)

- Render Mode: Screen Space - Overlay.
- Score Text P1: Anchor top-center-left, large font (96pt).
- Score Text P2: Anchor top-center-right, large font.
- Dashed centerline: `UI.Image` with pattern texture (or build via code).
- Pause Overlay: full-screen panel with "PAUSED" text; hidden by default.

## URP 2D Setup (optional, for retro look)

1. Install URP package.
2. Create 2D Renderer Data.
3. Assign URP Asset in Graphics + Quality settings.
4. Camera: `Camera` component's "Render Type" = Base; Renderer = URP 2D.
5. Optional: Light 2D for subtle glow.

## Responsive Layout

- Camera orthographic size: 5 (10 units tall).
- Court width: 16 units.
- Canvas Scaler: Scale With Screen Size, reference 1920×1080.
- Play area scales with window; aspect ratio locked optional.

## Build Settings

- Platform: any.
- Scenes in Build: `Assets/_Pong/Scenes/Game.unity`.
- Company + Product name.
- Icon.

## Performance

- 60 FPS trivially; Pong uses <1% CPU on any Unity-supported platform.
- No GC pressure if scripts avoid allocations (no `new Vector2()` per frame with managed code).
- WebGL builds to ~4 MB.

## Testing

### Play Mode Tests

```csharp
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using System.Collections;

public class PongPlayModeTests {
    [UnityTest]
    public IEnumerator BallBouncesOffPaddle() {
        // Load scene, force ball into paddle, wait, assert velocity inverted
        yield return null;
    }

    [UnityTest]
    public IEnumerator ScoringIncrementsAfterGoal() {
        // Load scene, move ball past goal trigger, assert GameManager.scoreP1 == 1
        yield return null;
    }
}
```

### Edit Mode Tests

Pure C# logic tests on `BumpBallSpeed`, `PredictBallArrivalY`, reflection math.

## Total Code

~300-400 lines of C# across 8-10 scripts. Fits one afternoon tutorial.

## Extending

- **Online multiplayer**: add Unity Netcode for GameObjects (NGO); ball position server-authoritative.
- **Power-ups**: Arkanoid-style (not Pong-canon but a fun extension).
- **Themes**: SpriteRenderer swaps for different visual themes; keep physics.
- **Accessibility**: paddle size slider in options; ball speed multiplier; colorblind-friendly palette.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Rules & Physics Design](../../references/rules-design.md)
- [3Cs Spec](../../references/3c-spec.md)
