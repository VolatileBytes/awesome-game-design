---
id: flappy-bird
title: Flappy Bird — Unity Implementation
version: 0.1.0
description: Canonical Unity reconstruction of Flappy Bird — Rigidbody2D physics, object-pooled pipes, PlayerPrefs best score, Canvas UI, optional AdMob banner. A weekend-scale mobile port.
tags: [unity, urp-2d, rigidbody2d, mobile, ios, android, object-pooling, playerprefs, admob, c-sharp]
---

# Flappy Bird — Unity Implementation

Engine overlay for Flappy Bird. See [base GDD](../../GDD.md).

> Dong Nguyen's original was Cocos2d-x; this overlay documents an idiomatic Unity port that matches the feel (gravity, flap impulse, pipe gap, scroll speed) on a modern mobile-first Unity stack. Tap-to-flap, instant-death, pipe-pool infinite spawner, Canvas UI with TMP score, `PlayerPrefs` persistent best, swappable day/night skins, optional banner/interstitial ads for monetization parity with the 2014 original.

## Target

- **Unity version**: 2022.3 LTS (minimum); 2023.2+ works identically.
- **Render pipeline**: URP 2D (preferred) or Built-in.
- **Input**: Unity Input System (touch + mouse + keyboard under one action).
- **Platforms**: iOS, Android, WebGL, Desktop. Mobile is the canonical target.
- **Target FPS**: 60 (Application.targetFrameRate = 60; QualitySettings.vSyncCount = 0 on mobile).
- **Orientation**: Portrait only (locked via Player Settings).
- **Aspect ratios**: designed for 9:16 reference (1080×1920); scales via CanvasScaler + orthographic camera sizing.
- **Project size**: <15 MB installed (sprite atlas + 5 wav/ogg clips).

## Stack

| Piece | Technology |
|---|---|
| Physics | Rigidbody2D (dynamic bird), BoxCollider2D (pipes, ground) |
| Collisions | CircleCollider2D on bird, BoxCollider2D on pipes/ground |
| Rendering | SpriteRenderer (world) + Canvas (UI). One 1024×1024 sprite atlas. |
| Input | Input System — single `Flap` action bound to Touchscreen.primaryTouch.press / Mouse.leftButton / Keyboard.spaceKey |
| UI | Canvas (Screen Space - Overlay) + TextMeshProUGUI |
| Audio | AudioSource.PlayOneShot with 5 short WAV clips |
| Spawning | Object pool — 6 PipePair prefabs rotated as they scroll off screen |
| Persistence | `PlayerPrefs` for best score + medals |
| Ads (optional) | Google Mobile Ads (AdMob) — banner on menu, interstitial every N deaths |
| Scene | 1 scene (`Game.unity`) |

## Project Structure

```
Assets/
├── _FlappyBird/
│   ├── Scenes/
│   │   └── Game.unity
│   ├── Scripts/
│   │   ├── GameManager.cs              # State machine: Ready / Playing / Dying / GameOver
│   │   ├── BirdController.cs           # Gravity + flap impulse + rotation
│   │   ├── BirdAnimator.cs             # 3-frame flap sprite cycle
│   │   ├── PipePair.cs                 # Upper + lower pipe pair; scroll + passed-flag
│   │   ├── PipeSpawner.cs              # Timer-driven object pool spawner
│   │   ├── GroundScroller.cs           # UV-scroll ground strip
│   │   ├── BackgroundParallax.cs       # Sky + clouds parallax
│   │   ├── ScoreManager.cs             # Running score + best (PlayerPrefs)
│   │   ├── MedalCalculator.cs          # Score → Bronze / Silver / Gold / Platinum
│   │   ├── AudioManager.cs             # 5-clip SFX player
│   │   ├── UIController.cs             # Ready / HUD / GameOver panels + tween in/out
│   │   ├── InputReader.cs              # Single-action Input System reader
│   │   ├── DayNightTheme.cs            # Random day/night skin on scene load
│   │   ├── AdsManager.cs               # Banner + interstitial (AdMob), optional
│   │   └── GameConfig.cs               # ScriptableObject tuning
│   ├── Prefabs/
│   │   ├── Bird.prefab
│   │   ├── PipePair.prefab
│   │   └── Ground.prefab
│   ├── ScriptableObjects/
│   │   └── DefaultConfig.asset
│   ├── Input/
│   │   └── FlappyControls.inputactions
│   ├── UI/
│   │   ├── ReadyPanel.prefab            # "Get Ready" + tap-to-start graphic
│   │   ├── HUDPanel.prefab              # Big centered score during play
│   │   └── GameOverPanel.prefab         # Score + best + medal + "OK" + "Share"
│   ├── Sprites/
│   │   └── FlappyAtlas.spriteatlas      # bird frames, pipes, ground, clouds, medals
│   ├── Audio/
│   │   ├── sfx_wing.wav                 # flap
│   │   ├── sfx_point.wav                # score chime
│   │   ├── sfx_hit.wav                  # pipe/ground impact
│   │   ├── sfx_die.wav                  # death jingle
│   │   └── sfx_swoosh.wav               # menu transitions
│   └── Settings/
│       └── URP2DRenderer.asset
```

## Scene Hierarchy

```
Scene: Game
├── Main Camera (Orthographic, Size 5.12)
├── WorldRoot
│   ├── BackgroundSky     (SpriteRenderer, static)
│   ├── BackgroundClouds  (SpriteRenderer, BackgroundParallax)
│   ├── PipesRoot         (empty — PipePair instances parent here)
│   ├── Ground            (SpriteRenderer + BoxCollider2D + GroundScroller, tag: "Ground")
│   └── Bird              (Rigidbody2D + CircleCollider2D + BirdController + BirdAnimator, tag: "Bird")
├── Systems
│   ├── GameManager       (empty GO with GameManager.cs)
│   ├── PipeSpawner       (empty GO with PipeSpawner.cs, holds pool)
│   ├── ScoreManager
│   ├── AudioManager      (AudioSource + AudioManager.cs)
│   ├── InputReader
│   └── AdsManager        (optional; disabled on non-mobile builds)
└── UICanvas              (Screen Space - Overlay, CanvasScaler reference 1080×1920)
    ├── ReadyPanel
    ├── HUDPanel
    └── GameOverPanel
```

## Physics Setup

Project Settings → Physics 2D → Gravity = **(0, 0)**. We do not use Unity's global gravity; the bird implements its own constant-acceleration integration so the feel matches the 2013 tuning exactly.

### Bird

- `Rigidbody2D`: Body Type = **Kinematic**. (Dynamic works too, but kinematic gives us full velocity authority.) Gravity Scale = 0, Interpolate = Interpolate, Collision Detection = **Continuous**.
- `CircleCollider2D`: radius ~0.3 units (hitbox is generous — visual sprite is ~0.6 wide).
- Tag: `Bird`.

### Pipes

- Parent GameObject (PipePair) has no collider.
- Two children, each with:
  - `SpriteRenderer` (green pipe tile).
  - `BoxCollider2D` sized to the sprite.
  - No Rigidbody — static in the collision sense, but moved via `transform.Translate` in FixedUpdate for smooth scroll.
- A third empty child "ScoreZone" with `BoxCollider2D` (trigger) placed in the gap; when bird enters → +1.

### Ground

- `SpriteRenderer` covering screen bottom (actually tiled; UV scrolls leftward).
- `BoxCollider2D` spanning full width.
- Tag: `Ground`.

## Tuning — `GameConfig` ScriptableObject

```csharp
using UnityEngine;

[CreateAssetMenu(fileName = "DefaultConfig", menuName = "Flappy/GameConfig")]
public class GameConfig : ScriptableObject
{
    [Header("Bird")]
    public float gravity = 45f;            // units/sec² (world-space)
    public float flapVelocity = 12f;       // instant upward Y velocity on tap
    public float maxFallSpeed = 22f;
    public float rotUpDeg = -20f;
    public float rotDownDeg = 90f;
    public float rotLerpSpeed = 8f;

    [Header("World")]
    public float scrollSpeed = 4f;         // units/sec
    public float pipeSpawnInterval = 1.5f; // seconds
    public float pipeGap = 3.4f;           // vertical gap size
    public float pipeSpawnX = 7f;          // spawn position X
    public float pipeDespawnX = -7f;
    public Vector2 pipeYRange = new Vector2(-1.5f, 1.5f); // gap center Y range

    [Header("Medals")]
    public int bronzeScore = 10;
    public int silverScore = 20;
    public int goldScore = 30;
    public int platinumScore = 40;

    [Header("Pool")]
    public int pipePoolSize = 6;
}
```

Approximate unit-space translation of the canonical pixel values (Gravity 1600 px/s², Flap -450 px/s): world units are scaled so 1 unit ≈ 36 px on a 1080-high portrait screen (Camera.orthographicSize = 5.12, viewport ~10.24 units tall).

## Scripts

### GameManager.cs

```csharp
using UnityEngine;
using UnityEngine.Events;

public enum GameState { Ready, Playing, Dying, GameOver }

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    public GameConfig config;
    public BirdController bird;
    public PipeSpawner spawner;
    public UIController ui;
    public AudioManager audio;
    public ScoreManager score;
    public AdsManager ads;

    public GameState State { get; private set; } = GameState.Ready;
    public UnityEvent<GameState> OnStateChanged;

    void Awake() => Instance = this;

    void Start()
    {
        SetState(GameState.Ready);
        bird.EnterReady();
        spawner.Clear();
        ui.ShowReady();
    }

    public void StartGame()
    {
        if (State != GameState.Ready) return;
        SetState(GameState.Playing);
        bird.EnterPlaying();
        spawner.Begin();
        score.Reset();
        ui.ShowHUD();
    }

    public void OnBirdHit()
    {
        if (State != GameState.Playing) return;
        SetState(GameState.Dying);
        audio.PlayHit();
        bird.EnterDying();
        spawner.Stop();
    }

    public void OnBirdLanded()
    {
        if (State != GameState.Dying) return;
        SetState(GameState.GameOver);
        audio.PlayDie();
        score.CommitBestIfNew();
        ui.ShowGameOver(score.Current, score.Best, MedalCalculator.For(score.Current, config));
        ads.MaybeShowInterstitial();
    }

    public void Restart()
    {
        // Reload scene — simplest + cleanest reset for Flappy.
        UnityEngine.SceneManagement.SceneManager.LoadScene(0);
    }

    void SetState(GameState s)
    {
        State = s;
        OnStateChanged?.Invoke(s);
    }
}
```

### BirdController.cs

```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class BirdController : MonoBehaviour
{
    public GameConfig config;
    public InputReader input;
    public Transform spriteRoot;

    Rigidbody2D rb;
    float vy;
    bool acceptInput;

    void Awake()
    {
        rb = GetComponent<Rigidbody2D>();
        rb.bodyType = RigidbodyType2D.Kinematic;
    }

    public void EnterReady()
    {
        vy = 0f;
        acceptInput = false;
        transform.position = new Vector3(-2.5f, 0f, 0f);
        spriteRoot.localRotation = Quaternion.identity;
    }

    public void EnterPlaying()
    {
        acceptInput = true;
        vy = config.flapVelocity;   // first tap kicks up
    }

    public void EnterDying()
    {
        acceptInput = false;
    }

    void OnEnable()  { input.OnFlap += HandleFlap; }
    void OnDisable() { input.OnFlap -= HandleFlap; }

    void HandleFlap()
    {
        if (GameManager.Instance.State == GameState.Ready)
        {
            GameManager.Instance.StartGame();
            return;
        }
        if (!acceptInput) return;
        vy = config.flapVelocity;
        GameManager.Instance.audio.PlayWing();
    }

    void FixedUpdate()
    {
        // Integrate custom gravity so tuning matches canonical values.
        vy -= config.gravity * Time.fixedDeltaTime;
        vy = Mathf.Max(vy, -config.maxFallSpeed);
        rb.MovePosition(rb.position + Vector2.up * vy * Time.fixedDeltaTime);

        // Rotation smoothing
        float targetDeg = vy > 0
            ? config.rotUpDeg
            : Mathf.Lerp(config.rotUpDeg, config.rotDownDeg, Mathf.InverseLerp(0, -config.maxFallSpeed, vy));
        Quaternion target = Quaternion.Euler(0, 0, targetDeg);
        spriteRoot.localRotation = Quaternion.Slerp(spriteRoot.localRotation, target,
            Time.fixedDeltaTime * config.rotLerpSpeed);
    }

    void OnCollisionEnter2D(Collision2D col)
    {
        if (GameManager.Instance.State == GameState.Dying) return; // already dying
        if (col.collider.CompareTag("Ground"))
        {
            GameManager.Instance.OnBirdHit();
            GameManager.Instance.OnBirdLanded();
            return;
        }
        // pipe hit
        GameManager.Instance.OnBirdHit();
    }

    void OnTriggerEnter2D(Collider2D col)
    {
        if (col.CompareTag("ScoreZone") && GameManager.Instance.State == GameState.Playing)
        {
            GameManager.Instance.score.Increment();
            GameManager.Instance.audio.PlayPoint();
        }
    }
}
```

### PipePair.cs

```csharp
using UnityEngine;

public class PipePair : MonoBehaviour
{
    public Transform upperPipe;
    public Transform lowerPipe;
    public Collider2D scoreZone;
    public float scrollSpeed;
    bool active;

    public void SpawnAt(float x, float gapCenterY, float gap)
    {
        transform.position = new Vector3(x, 0f, 0f);
        upperPipe.localPosition = new Vector3(0, gapCenterY + gap * 0.5f + 5f, 0);
        lowerPipe.localPosition = new Vector3(0, gapCenterY - gap * 0.5f - 5f, 0);
        active = true;
        gameObject.SetActive(true);
    }

    public void Deactivate()
    {
        active = false;
        gameObject.SetActive(false);
    }

    void FixedUpdate()
    {
        if (!active) return;
        transform.Translate(Vector3.left * scrollSpeed * Time.fixedDeltaTime);
    }
}
```

### PipeSpawner.cs

```csharp
using System.Collections.Generic;
using UnityEngine;

public class PipeSpawner : MonoBehaviour
{
    public GameConfig config;
    public PipePair pipePrefab;
    public Transform pipesRoot;

    readonly Queue<PipePair> pool = new();
    readonly List<PipePair> active = new();
    float timer;
    bool running;

    void Start()
    {
        for (int i = 0; i < config.pipePoolSize; i++)
        {
            var p = Instantiate(pipePrefab, pipesRoot);
            p.scrollSpeed = config.scrollSpeed;
            p.Deactivate();
            pool.Enqueue(p);
        }
    }

    public void Begin() { running = true; timer = 0f; }
    public void Stop()  { running = false; }

    public void Clear()
    {
        foreach (var p in active) { p.Deactivate(); pool.Enqueue(p); }
        active.Clear();
    }

    void Update()
    {
        if (running)
        {
            timer += Time.deltaTime;
            if (timer >= config.pipeSpawnInterval)
            {
                timer = 0f;
                SpawnOne();
            }
        }

        // Recycle off-screen pipes.
        for (int i = active.Count - 1; i >= 0; i--)
        {
            if (active[i].transform.position.x < config.pipeDespawnX)
            {
                active[i].Deactivate();
                pool.Enqueue(active[i]);
                active.RemoveAt(i);
            }
        }
    }

    void SpawnOne()
    {
        if (pool.Count == 0) return;
        var p = pool.Dequeue();
        float y = Random.Range(config.pipeYRange.x, config.pipeYRange.y);
        p.SpawnAt(config.pipeSpawnX, y, config.pipeGap);
        active.Add(p);
    }
}
```

### ScoreManager.cs

```csharp
using UnityEngine;

public class ScoreManager : MonoBehaviour
{
    const string BestKey = "flappy_best";
    public int Current { get; private set; }
    public int Best { get; private set; }

    public UnityEngine.Events.UnityEvent<int> OnScoreChanged;

    void Awake() { Best = PlayerPrefs.GetInt(BestKey, 0); }

    public void Reset() { Current = 0; OnScoreChanged?.Invoke(Current); }

    public void Increment()
    {
        Current++;
        OnScoreChanged?.Invoke(Current);
    }

    public void CommitBestIfNew()
    {
        if (Current > Best)
        {
            Best = Current;
            PlayerPrefs.SetInt(BestKey, Best);
            PlayerPrefs.Save();
        }
    }
}
```

### MedalCalculator.cs

```csharp
public static class MedalCalculator
{
    public enum Medal { None, Bronze, Silver, Gold, Platinum }

    public static Medal For(int score, GameConfig c)
    {
        if (score >= c.platinumScore) return Medal.Platinum;
        if (score >= c.goldScore)     return Medal.Gold;
        if (score >= c.silverScore)   return Medal.Silver;
        if (score >= c.bronzeScore)   return Medal.Bronze;
        return Medal.None;
    }
}
```

### InputReader.cs

```csharp
using System;
using UnityEngine;
using UnityEngine.InputSystem;

public class InputReader : MonoBehaviour
{
    FlappyControls controls;
    public event Action OnFlap;

    void Awake() => controls = new FlappyControls();
    void OnEnable()
    {
        controls.Gameplay.Flap.performed += _ => OnFlap?.Invoke();
        controls.Enable();
    }
    void OnDisable() => controls.Disable();
}
```

`FlappyControls.inputactions` bindings:
- **Gameplay/Flap** (Button) →
  - `<Touchscreen>/primaryTouch/press`
  - `<Mouse>/leftButton`
  - `<Keyboard>/space`

### BirdAnimator.cs

```csharp
using UnityEngine;

public class BirdAnimator : MonoBehaviour
{
    public SpriteRenderer sr;
    public Sprite[] frames;    // 3 flap frames: down, mid, up
    public float fps = 10f;
    float t;
    int idx;

    void Update()
    {
        t += Time.deltaTime;
        if (t >= 1f / fps)
        {
            t = 0f;
            idx = (idx + 1) % frames.Length;
            sr.sprite = frames[idx];
        }
    }
}
```

### GroundScroller.cs

```csharp
using UnityEngine;

public class GroundScroller : MonoBehaviour
{
    public GameConfig config;
    public Renderer rend;      // tile-able ground sprite; UV-scroll
    float offset;

    void Update()
    {
        if (GameManager.Instance.State == GameState.GameOver) return;
        offset += config.scrollSpeed * Time.deltaTime * 0.1f;
        rend.material.mainTextureOffset = new Vector2(offset, 0);
    }
}
```

### AudioManager.cs

```csharp
using UnityEngine;

public class AudioManager : MonoBehaviour
{
    public AudioSource source;
    public AudioClip wing, point, hit, die, swoosh;

    public void PlayWing()   => source.PlayOneShot(wing);
    public void PlayPoint()  => source.PlayOneShot(point);
    public void PlayHit()    => source.PlayOneShot(hit);
    public void PlayDie()    => source.PlayOneShot(die);
    public void PlaySwoosh() => source.PlayOneShot(swoosh);
}
```

### UIController.cs

```csharp
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class UIController : MonoBehaviour
{
    public GameObject readyPanel, hudPanel, gameOverPanel;
    public TextMeshProUGUI hudScore;
    public TextMeshProUGUI gameOverScore, gameOverBest;
    public Image medalIcon;
    public Sprite medalNone, medalBronze, medalSilver, medalGold, medalPlatinum;
    public Button okButton, shareButton;

    void Start()
    {
        okButton.onClick.AddListener(() => GameManager.Instance.Restart());
        GameManager.Instance.score.OnScoreChanged.AddListener(s => hudScore.text = s.ToString());
    }

    public void ShowReady()
    {
        readyPanel.SetActive(true);
        hudPanel.SetActive(false);
        gameOverPanel.SetActive(false);
    }

    public void ShowHUD()
    {
        readyPanel.SetActive(false);
        hudPanel.SetActive(true);
        gameOverPanel.SetActive(false);
    }

    public void ShowGameOver(int score, int best, MedalCalculator.Medal medal)
    {
        hudPanel.SetActive(false);
        gameOverPanel.SetActive(true);
        gameOverScore.text = score.ToString();
        gameOverBest.text = best.ToString();
        medalIcon.sprite = medal switch
        {
            MedalCalculator.Medal.Platinum => medalPlatinum,
            MedalCalculator.Medal.Gold     => medalGold,
            MedalCalculator.Medal.Silver   => medalSilver,
            MedalCalculator.Medal.Bronze   => medalBronze,
            _ => medalNone,
        };
    }
}
```

### DayNightTheme.cs

```csharp
using UnityEngine;

public class DayNightTheme : MonoBehaviour
{
    public SpriteRenderer sky;
    public Sprite daySky, nightSky;
    // optional: tint ground/pipes

    void Awake()
    {
        sky.sprite = (Random.value < 0.5f) ? daySky : nightSky;
    }
}
```

### AdsManager.cs

Optional. Requires Google Mobile Ads SDK installed via UPM.

```csharp
#if GOOGLE_ADS
using GoogleMobileAds.Api;
#endif
using UnityEngine;

public class AdsManager : MonoBehaviour
{
    public int interstitialEveryNDeaths = 3;
    int deaths;

#if GOOGLE_ADS
    BannerView banner;
    InterstitialAd interstitial;
#endif

    void Start()
    {
#if GOOGLE_ADS && (UNITY_ANDROID || UNITY_IOS)
        MobileAds.Initialize(_ => {
            LoadBanner();
            LoadInterstitial();
        });
#endif
    }

    public void MaybeShowInterstitial()
    {
        deaths++;
        if (deaths % interstitialEveryNDeaths != 0) return;
#if GOOGLE_ADS && (UNITY_ANDROID || UNITY_IOS)
        if (interstitial != null && interstitial.CanShowAd()) interstitial.Show();
        LoadInterstitial();
#endif
    }

#if GOOGLE_ADS
    void LoadBanner() { /* ad unit id + AdRequest — gated on platform + build */ }
    void LoadInterstitial() { /* ad unit id + AdRequest */ }
#endif
}
```

On non-mobile platforms the class is harmless — `MaybeShowInterstitial` no-ops.

## Game Loop Timing

- `FixedUpdate`: 50 Hz (Project Settings → Time → Fixed Timestep = 0.02). Bird physics + pipe scroll run in FixedUpdate for frame-rate independence.
- `Update`: any FPS. UI + audio + pooling bookkeeping.
- `Application.targetFrameRate = 60` at Awake.

## Build Targets

### Android

- Player Settings → **Portrait** orientation only.
- Minimum API Level 23 (Android 6).
- IL2CPP + ARM64 (Play Store requirement).
- Strip Engine Code: enabled.
- Output: ~12 MB AAB.

### iOS

- Orientation: Portrait only.
- Target iOS 13+.
- Bitcode: disabled (Unity default post-2023).
- Output: ~20 MB IPA.

### WebGL

- Canvas size: 540×960 fixed (portrait desktop preview) OR responsive with letterboxing.
- Input: Pointer + Keyboard (no Touchscreen device).
- Output: ~6-8 MB gzipped.

### Desktop

- Stretch camera to centered 9:16 with black letterbox bars OR lock window to 540×960.
- Input: mouse click + spacebar.

## Testing

### Edit Mode

- `MedalCalculatorTests.cs`: exhaust score boundaries (9, 10, 19, 20, 29, 30, 39, 40, 100).
- `GameConfigTuningTests.cs`: sanity-check gravity vs flapVelocity ratio produces a parabola with apex inside `pipeGap` given `pipeSpawnInterval` × `scrollSpeed` horizontal distance.

### Play Mode

- `BirdFallsTest.cs`: start scene, never tap, assert bird Y monotonically decreases and hits ground within ~2s.
- `TapFlapsTest.cs`: inject synthetic `Flap` action, assert `vy` set to `flapVelocity`.
- `PipeRecycleTest.cs`: run scene 30s, assert active pipe count ≤ poolSize.
- `ScoreIncrementTest.cs`: teleport bird past a PipePair.ScoreZone, assert `Current == 1`.
- `BestScorePersistsTest.cs`: score 5, trigger death, reload scene, assert `Best == 5`.

## Polishing Pass

- **Screen shake** on hit: `Cinemachine Impulse` or short camera offset.
- **Feather particles** on hit: small `ParticleSystem` burst on bird-death.
- **Score pop**: scale-punch TMP when incremented.
- **Flash**: full-screen white flash on death (Image + Color.Lerp over 0.1s).
- **Haptic** on tap + hit: `Handheld.Vibrate()` or `HapticFeedback` package.
- **Leaderboard**: Google Play Games / Game Center integration — report `Best` when updated.

## What This Unity Port Does NOT Simulate

- Exact pixel-perfect 2013 graphics — uses re-drawn sprites in similar style (avoid Mario-pipe clone issues if publishing).
- Obj-C/Cocos2d-x frame timing quirks — Unity's FixedUpdate is different from Cocos2d's scheduler.
- iOS 6 / early-Android compatibility — Unity 2022 targets modern OSes.
- The banner ad at top of original Flappy — AdsManager places a banner at bottom or top per platform best practice.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Base GDD](../../GDD.md)
- [Unity Input System docs](https://docs.unity3d.com/Packages/com.unity.inputsystem@latest)
- [Google Mobile Ads Unity Plugin](https://developers.google.com/admob/unity/start)
