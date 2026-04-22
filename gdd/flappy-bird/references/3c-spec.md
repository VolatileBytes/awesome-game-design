# 3Cs Spec — Flappy Bird

A one-input 2D arcade game. The camera is fixed in world space (with scrolling terrain); the "character" is a single yellow bird sprite with one ability (flap); controls are literally one tap anywhere. The 3Cs discussion for Flappy Bird is an exercise in reductionism.

## Camera

### Perspective

- 2D side-scrolling.
- Camera follows bird horizontally (in reality: bird stays at fixed X, world scrolls).
- Y axis: camera Y doesn't follow bird; bird moves freely within vertical play area.
- Zoom: fixed; orthographic.

### Play Area

- Width: screen width (typically 288 or 320 base px).
- Height: screen height minus ground strip (~512 minus 112 = 400 play height on iPhone 4).
- Bird's X locked at ~ screen_width × 0.25 (left third).

### No Dynamic Camera

- No shake, no zoom-in, no cinematic transitions.
- Game-over: brief freeze; bird falls to ground; screen stays put.

## "Character" (Bird)

### Representation

- 2D sprite ~24×24 px.
- Three animation frames (wing up, mid, down).
- Color variants: yellow (default), red, blue (cycled via ??? — disputed feature; variants exist in source but player may not control selection).

### Animation Frames

- Flap animation loops at ~8 FPS when bird is in mid-air.
- Freezes on wing-down frame during steep downward motion (aesthetic).

### Rotation

- Tied to vertical velocity:
  - `rotation = clamp(vy / some_scale, -30°, 70°)` approximately.
  - Upward velocity → nose up.
  - Downward velocity → nose down.
  - Rotation is smoothed; visible frame-to-frame interpolation.
- During death tumble: free rotation.

### Collision

- AABB slightly smaller than sprite (forgiving hitbox).
- Or small circle centered on bird (variants exist in reconstructions).

### States

```
IDLE (pre-start): bird hovers at center; gentle bob.
FLYING (in-play): gravity applies; taps impulse.
DYING: hit detected; bird's flap stops; falls; plays hit sound.
DEAD: on ground; game-over screen shown.
```

## Controls

### Input

- One input: tap / click / touch anywhere on screen.
- Hold-tap irrelevant — only the tap event matters.
- No swipe, no multi-touch, no gesture.

### Per-platform

| Platform | Input |
|---|---|
| iOS / Android | Screen tap |
| Web reconstruction | Mouse click / touch / Space / ↑ |
| Gamepad (rare) | Any face button |

### Tap Event

- On `touchstart` / `keydown` for space: call `flap()`.
- `flap()` sets `bird.vy = JUMP_VELOCITY` (e.g., -450 px/s).
- Plays flap sound.
- No continuous input; each tap is discrete.

### Input Windows

- Tap is accepted every frame.
- No cooldown between taps.
- Rapid tapping = continuous upward velocity reset; not infinite rise, but close.

## Physics

### Gravity

```
bird.vy += GRAVITY * dt
bird.y += bird.vy * dt
```

Constants (approximate):
- `GRAVITY = 1600 px/s²`
- Max fall speed `= 800 px/s` (terminal velocity clamp)

### Flap

```
bird.vy = JUMP_VELOCITY = -450 px/s  // (sets, not adds)
```

Setting (not adding) means rapid taps = capped rise rate. Forces rhythm; prevents spam-to-cheese.

### Rotation

```
targetRotation = clamp((bird.vy / 500) * 90°, -30°, 70°)
bird.rotation += (targetRotation - bird.rotation) * SMOOTHING
```

## Feedback

### Visual

- Bird sprite flap animation matches game tempo.
- Bird rotation conveys momentum.
- Score digits pop in at each pipe passed (brief scale bump).
- Medal animation on game-over (flash sweep reveals medal tier).

### Audio

- Flap sound on tap (short wing whoosh).
- Point sound on pipe pass (chime).
- Hit sound on collision (thud).
- Die sound after hit (game-over sting).
- Swoosh sound on UI transitions.

### Haptic

- Original: none.
- Some reconstructions / ports: vibration on hit.

## HUD

### In-game

- Score (large digits, top center, semi-transparent).

That's it. No ammo, no HP, no timer, no map.

### Game-over

- Title banner "Game Over".
- Score (current).
- Best score.
- Medal (bronze/silver/gold/platinum) if threshold met.
- "Play" button (restart).
- "Scoreboard" button (shows leaderboard).

## Game States

### Start Menu

- Title "Flappy Bird" scrolls in.
- "Tap to play" overlay.
- Bird idle-hovers.
- Game-over? Previous score visible behind.

### Pre-play (Ready)

- First tap: freezes tutorial overlay; bird begins falling.
- Pipes don't spawn yet; bird enters game when tapped.

### In-play

- Pipes scrolling; bird physics active.
- Score increments.

### Dying

- Collision detected; bird freezes briefly; no more input.
- Brief white flash.
- Bird falls to ground with rotation.

### Game Over

- Screen darkens slightly.
- Score card animates in.
- Accepts tap to restart.

## Control Philosophy

### One Button, Many Feelings

The tap itself has depth: early tap vs late tap, one tap vs. two rapid taps, stopped-tapping timing. Players develop tactile sense within 10 attempts.

### Binary Input + Analog Physics

Input is binary (tap yes/no). Physics is continuous (velocity, position). Skill is mapping binary to continuous — exactly-right taps at exactly-right times.

### No Latency Tolerance

Flappy Bird at 60 FPS is playable; at 30 FPS it feels sluggish; at 120 FPS many experienced players do better. Input-to-visual latency under 30ms is critical.

### Bird X Locked

Player has no horizontal agency. This simplifies learning — the problem is "time your taps right," not "position yourself and time." Zero spatial reasoning required.

### Ground + Ceiling as Implicit Rules

Hitting ground = death. Ceiling: bird hits and falls (some variants) or is capped and slides along (others). Either way, the vertical bounds are soft death zones.

### Art as UX

- Yellow bird vs green pipes: maximum contrast.
- Parallax scrolling: depth without confusion.
- No moving interactables except pipes: visual clutter zero.

### Death Without Penalty

Die → tap → retry. Zero friction. Session length = 5 seconds × N attempts; session can be 100 attempts in 5 minutes, or 2 attempts and quit. Both are valid.

### Addictiveness By Design (Unintentional)

Short sessions + instant retry + "I almost had it" = dopamine. Dong Nguyen noted this was unintentional and pulled the game over it. But it's now a studied pattern.
