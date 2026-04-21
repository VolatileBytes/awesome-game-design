---
id: vampire-survivors
title: Vampire Survivors — Unity Implementation
version: 0.1.0
description: Unity-specific implementation guide for Vampire Survivors. Targets Unity 2022 LTS or later, URP 2D.
tags: [unity, urp, 2d, roguelite, bullet-heaven]
---

# Vampire Survivors — Unity Implementation

This document is the **engine-specific overlay** for the Vampire Survivors GDD. It assumes familiarity with the base [GDD.md](../../GDD.md). It specifies how the design maps to Unity concepts, which packages to use, and which performance patterns matter.

## Target

- **Unity:** 2022.3 LTS or later (2023.x also fine). Use LTS for stability.
- **Render pipeline:** URP 2D
- **Input:** New Input System (not legacy Input Manager)
- **Platforms:** PC first (Windows/macOS/Linux). Mobile (iOS/Android) is feasible but requires aggressive pooling and render-batching tuning from day 1.

## Package List

Packages to install via Package Manager (`manifest.json`):

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP (2D renderer mode) |
| `com.unity.inputsystem` | New Input System |
| `com.unity.2d.animation` | Sprite skinning (optional, for player animation) |
| `com.unity.2d.psdimporter` | Multi-layer PSD assets (optional) |
| `com.unity.cinemachine` | Camera follow with shake |
| `com.unity.addressables` | Runtime asset loading (recommended for enemy/weapon variety) |
| `com.unity.textmeshpro` | All UI and damage numbers |

Optional but recommended:
- **DOTween** (asset store) — UI tweens, weapon polish
- **Animancer** (asset store) — only if animation logic exceeds Animator controllers (probably not needed for this genre)

## Project Layout

```
Assets/
  _Project/
    Art/                  # sprites, atlases, fonts, VFX
    Audio/                # SFX, music
    Data/                 # ScriptableObjects (weapons, passives, enemies, stages, arcana)
    Prefabs/
      Player/
      Enemies/
      Projectiles/
      Pickups/
      UI/
    Scenes/
      Boot.unity          # bootstraps addressables, localisation
      Menu.unity
      Game.unity          # the actual run
    Scripts/
      Core/               # GameLoop, RunState, ServiceLocator
      Player/
      Weapons/
      Enemies/
      Spawning/
      Progression/        # level-up draft, evolution rules
      Economy/            # gold, shop
      Arcana/
      UI/
      VFX/
      Utility/            # ObjectPool, SpatialHash, etc.
```

## Core Architecture

### Composition Over Inheritance

Favour `ScriptableObject`-driven **data** and small MonoBehaviours that **consume** that data. Weapons, enemies, passives, and arcana are all data assets, not code-per-variant.

### Data Assets

ScriptableObject classes, authored in `_Project/Data/`:

- `WeaponDefinition` — stats per level, evolution partner, projectile prefab, fire pattern enum
- `PassiveDefinition` — tiered stat modifier table
- `EnemyDefinition` — HP, speed, damage, on-death gem tier, sprite, behaviour tag
- `WaveEntry` — at time T, spawn enemies X Y Z with pattern P
- `StageDefinition` — wave list, arcana spawn points, scene bounds, background
- `ArcanaDefinition` — effect graph, icon, art
- `CharacterDefinition` — starter weapon, stat quirks

These are authored in the Editor. Designers tune numbers without touching code.

### Runtime Services (Singletons / Service Locator)

One `RunState` MonoBehaviour, lives in the Game scene. Owns:

- Player reference
- Active weapons (`List<IWeaponRuntime>`)
- Active passives (`List<PassiveInstance>`)
- Active arcana (`List<ArcanaInstance>`)
- Current stage + elapsed time
- Gold counter, kill counter
- Stat aggregator (resolves all passive + arcana modifiers)

Avoid `FindObjectOfType` at runtime. Use a simple `RunState.I` static reference set in `Awake()`. You will regret anything more sophisticated at this scale.

### The Frame Loop

1. `InputReader` samples the stick → emits a `Vector2 Move`
2. `PlayerMovement` applies `Move * Speed * dt` to the player transform
3. `WeaponRuntime[]` each tick down their cooldowns; fire projectiles on cooldown expiry
4. `EnemySpawner` polls `StageDefinition.WaveEntry` for current time; spawns enemies per pattern
5. `EnemyBrain` (a tight simple behaviour) moves each enemy toward the player using cached direction; collisions handled via overlap queries, not physics materials
6. `ProjectileBehaviour` moves projectiles, handles pierce/bounce/area
7. `DamageSystem` processes contact events in batches (see below)
8. `GemPickupSystem` does nearest-gem-to-player sweep using spatial hash
9. `UIOverlay` refreshes HP/XP/timer each frame

## Performance Reality

Vampire Survivors routinely has:
- 500+ enemies on screen
- 200+ projectiles
- 100+ damage numbers per second

Unity physics and GameObject overhead will not support this naively. See [references/performance-patterns.md](references/performance-patterns.md) for the detailed playbook. Highlights:

- **Pool everything** — enemies, projectiles, gems, damage numbers. Never instantiate in a run.
- **Don't use Rigidbody2D** for enemies or projectiles. Move transforms directly; overlap queries for collision.
- **Spatial hash** for enemy/projectile lookups, not `Physics2D.OverlapCircleAll`.
- **Single sprite atlas** per entity class; enable SRP Batcher.
- **Batch damage numbers.** Never instantiate a TMP text per hit.

## Input

New Input System, action map `Gameplay`:

| Action | Type | Bindings |
|---|---|---|
| Move | Value (Vector2) | WASD, Left Stick |
| Pause | Button | Esc, Start |
| UIConfirm | Button | Enter / Space / A |
| UICancel | Button | Esc / B |

Draft menus use a separate action map `UI` that is auto-switched when level-up pauses the game.

## Time & Pause

Use `Time.timeScale = 0` for the level-up draft and the pause menu. All enemy movement, spawning, weapons, and VFX must use `Time.deltaTime` (not `fixedDeltaTime`) so that `timeScale = 0` halts them cleanly.

UI animations during pause should use **unscaled time** explicitly (`Time.unscaledDeltaTime`) so menus still animate.

## Save State

### Meta (persistent across runs)

- `PlayerPrefs` is acceptable for a small game (gold, unlocks bitmask, settings)
- For a release product, use a JSON file in `Application.persistentDataPath`:
  ```
  {
    "gold": 12340,
    "unlocks": { "characters": [...], "weapons": [...], "stages": [...], "arcana": [...] },
    "shopTiers": { "might": 3, "speed": 2, ... },
    "achievements": { "firstEvo": true, ... },
    "settings": { "masterVolume": 0.8, ... }
  }
  ```
- Write on meaningful events (run end, shop purchase, setting change), not every frame.

### In-run

- Not strictly required — runs are short. If you want resumable runs (optional), serialise RunState to disk on pause.

## Build Size & Load

- Stage-specific sprites and audio should be **Addressables**, not baked into the build. Loading a stage = loading that stage's asset group.
- Shared prefabs (player, common enemies, UI) stay in the base bundle.
- Target < 200 MB for a PC build for the base game; DLC adds groups.

## Common Unity Pitfalls for This Genre

See [references/performance-patterns.md](references/performance-patterns.md) for patterns. Quick list:

- Using `Instantiate`/`Destroy` in hot paths → GC storms → hitches every ~5 seconds
- Using `GetComponent<T>()` in `Update()` → trivial but compounds at 500+ enemies
- Using Rigidbody2D for enemies → physics solver collapses at count
- Using `foreach` over `Transform.GetComponentsInChildren<T>()` → huge allocations every call
- Subscribing to events without unsubscribing on pool-return → memory leaks + ghost callbacks
- Drawing all damage numbers with separate TMP instances → fill-rate + draw-call disaster

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Performance Patterns](references/performance-patterns.md)
