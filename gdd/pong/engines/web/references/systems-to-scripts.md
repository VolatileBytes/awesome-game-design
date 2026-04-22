# Systems → Scripts Map — Pong (Web / HTML5 Canvas)

Pong is tiny. Everything fits in one file; this map organizes the functions and state primitives used in a reference JS implementation.

## File Layout

```
pong/
  index.html      # <canvas> + <script src="game.js">
  game.js         # entire game (~180 LOC)
  (optional) assets/
    beep-hit.wav
    beep-wall.wav
    beep-score.wav
```

## Module Organization (If Split)

If you elect to split into modules (not necessary for Pong):

```
src/
  main.js               # entry point; runs loop
  state.js              # state factory
  loop.js               # requestAnimationFrame driver
  update/
    paddles.js
    ball.js
    collisions.js
    scoring.js
  render/
    canvas.js           # rendering fns
  input/
    keyboard.js
    mouse.js
    touch.js
    gamepad.js
  audio/
    beep.js             # Web Audio oscillator
  ai/
    opponent.js         # single-player AI
```

## Functions / Objects

### Entry

| Symbol | Role |
|---|---|
| `initGame()` | Set up canvas context, state, input listeners |
| `gameLoop(now)` | requestAnimationFrame callback |
| `update(dt)` | Physics + collision + scoring tick |
| `render()` | Draw current state to canvas |

### State

| Symbol | Role |
|---|---|
| `state` | Root game state object |
| `state.court` | Court dimensions |
| `state.paddles[0]`, `state.paddles[1]` | Paddle state |
| `state.ball` | Ball state |
| `state.hitCount` | Rally hit counter |
| `state.serving`, `state.serveTimer` | Serve pause state |
| `state.keys` | Active key map (boolean flags) |
| `state.paused` | Pause flag |

### Update

| Function | Role |
|---|---|
| `updatePaddles(dt)` | Apply input to paddle Y |
| `updateBall(dt)` | Advance ball position |
| `checkCollisions()` | Walls + paddles |
| `rectCircleCollide(rect, circle)` | AABB-circle overlap test |
| `reflectOffPaddle(paddle, ball)` | Angle-based reflection math |
| `bumpSpeed()` | Speed tier progression |
| `checkScore()` | Score detection + serve reset |
| `serveBall(direction)` | Reset ball to center |

### Render

| Function | Role |
|---|---|
| `render()` | Top-level draw |
| `drawCourt(ctx)` | Background + centerline |
| `drawPaddle(ctx, paddle)` | Paddle rect |
| `drawBall(ctx, ball)` | Ball circle |
| `drawScore(ctx, paddles)` | Score digits |
| `drawPauseOverlay(ctx)` | Paused state |

### Input

| Function | Role |
|---|---|
| `attachInputListeners()` | Add keyboard/mouse/touch handlers |
| `handleKeyDown(e)` | Set state.keys[code] = true |
| `handleKeyUp(e)` | Set state.keys[code] = false |
| `handleMouseMove(e)` | Map mouse Y → P1 paddle Y |
| `handleTouchMove(e)` | Map touch Y → P1 paddle Y |
| `handleGamepad(gamepad)` | Poll Gamepad API each frame |

### Audio

| Function | Role |
|---|---|
| `playBeep(freq, duration)` | Oscillator note |
| `playHit()` | 360 Hz paddle beep |
| `playWall()` | 245 Hz wall beep |
| `playScore()` | 500 Hz longer buzz |

### AI (single-player)

| Function | Role |
|---|---|
| `aiUpdate(paddle, dt)` | Move AI paddle toward prediction |
| `predictBallArrival(ball, targetX)` | Ballistic simulate to target X |
| `setAIDifficulty(level)` | Tune max speed + jitter |

### Helpers

| Function | Role |
|---|---|
| `clamp(v, min, max)` | Numeric clamp |
| `hypot(x, y)` | √(x²+y²); ES6 Math.hypot |
| `randAngle(maxDeg)` | Random serve angle within ±maxDeg |
| `resize()` | Responsive canvas sizing |

### Game State Transitions

| Function | Role |
|---|---|
| `startMatch()` | Reset scores + ball; begin |
| `pauseMatch()` | Toggle pause |
| `resumeMatch()` | Clear pause |
| `gameOver(winner)` | Display result; offer restart |
| `restartMatch()` | Reset and restart |

## Constants / Config

| Constant | Value | Role |
|---|---|---|
| `COURT_W` | 800 | Canvas width |
| `COURT_H` | 600 | Canvas height |
| `PADDLE_W` | 10 | Paddle width |
| `PADDLE_H` | 80 | Paddle height |
| `PADDLE_SPEED` | 400 | Paddle px/sec |
| `BALL_RADIUS` | 6 | Ball radius |
| `BALL_SPEED_INIT` | 300 | Initial ball px/sec |
| `MAX_ANGLE_DEG` | 75 | Reflection angle cap |
| `TARGET_SCORE` | 11 | Match length |
| `SERVE_DELAY` | 1.0 | Seconds between serves |

## Tests (optional)

Unit tests for predictable math:

| Test | Covers |
|---|---|
| `reflectOffPaddleTest` | Given hit offset, expected angle |
| `bumpSpeedTest` | Hit counter → speed tier mapping |
| `checkScoreTest` | Ball X out-of-bounds triggers score |
| `rectCircleCollideTest` | Overlap + corner edge cases |
| `predictBallArrivalTest` | Deterministic ballistic result |

## HTML Shell

```html
<!DOCTYPE html>
<html>
<head>
  <title>Pong</title>
  <style>
    html, body { margin: 0; height: 100%; background: black; display: flex; align-items: center; justify-content: center; }
    canvas { image-rendering: pixelated; max-width: 100%; max-height: 100%; }
  </style>
</head>
<body>
  <canvas id="game" width="800" height="600"></canvas>
  <script src="game.js"></script>
</body>
</html>
```

That's the entire shell. Pong is genuinely this small.
