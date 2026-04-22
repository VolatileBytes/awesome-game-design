---
id: pong
title: Pong — Web / HTML5 Canvas Implementation
version: 0.1.0
description: Canonical web reconstruction of Pong — HTML5 Canvas, vanilla JS, requestAnimationFrame loop, ~200 lines total.
tags: [web, html5, canvas, javascript, tutorial, zero-dependencies]
---

# Pong — Web / HTML5 Canvas Implementation

Engine overlay for Pong. See [base GDD](../../GDD.md).

> Pong's original hardware is TTL logic (no CPU, no software). This overlay documents a modern HTML5 Canvas + JavaScript reconstruction — the canonical "hello world" of web game dev. Entire game fits in <200 lines with zero dependencies.

## Target

- **Runtime**: any modern browser (Chrome 120+, Firefox 120+, Safari 17+).
- **Rendering**: HTML5 Canvas 2D API.
- **Input**: Keyboard (KeyboardEvent) + Mouse (MouseEvent) + Gamepad API (optional).
- **Audio**: Web Audio API (OscillatorNode for classic blips).
- **Build**: none required; raw index.html + game.js.
- **Target fps**: 60 via requestAnimationFrame.
- **Size**: <5 KB total.

## Stack

| Piece | Technology |
|---|---|
| Rendering | `<canvas>` 2D context |
| Game loop | `requestAnimationFrame` |
| Input | `addEventListener('keydown' / 'keyup' / 'mousemove')` |
| Audio | Web Audio API |
| State | Plain JS objects |
| No framework | Vanilla JS, no React/Vue/etc. |

## Architecture

### Single-File Layout

```
index.html   # <canvas id="game" width="800" height="600"></canvas>
game.js      # everything else
```

For learning. Production might split into modules (rendering, input, physics, game state) but Pong doesn't need the structure.

### Game Loop

```javascript
let lastTime = 0;
function gameLoop(now) {
    const dt = (now - lastTime) / 1000;  // seconds
    lastTime = now;
    
    update(dt);
    render();
    
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
```

Fixed-timestep variant (for determinism):

```javascript
const STEP = 1 / 60;
let accumulator = 0;

function gameLoop(now) {
    const frameTime = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    accumulator += frameTime;
    
    while (accumulator >= STEP) {
        update(STEP);
        accumulator -= STEP;
    }
    
    render();
    requestAnimationFrame(gameLoop);
}
```

### State

```javascript
const state = {
    court: { width: 800, height: 600 },
    paddles: [
        { x: 20,  y: 260, width: 10, height: 80, vy: 0, score: 0 },
        { x: 770, y: 260, width: 10, height: 80, vy: 0, score: 0 },
    ],
    ball: { x: 400, y: 300, radius: 6, vx: 300, vy: 150 },
    hitCount: 0,
    serving: false,
    serveTimer: 0,
    keys: {},
    paused: false,
};
```

### Physics Step

```javascript
function update(dt) {
    if (state.paused) return;
    if (state.serving) {
        state.serveTimer -= dt;
        if (state.serveTimer <= 0) state.serving = false;
        return;
    }
    
    updatePaddles(dt);
    updateBall(dt);
    checkCollisions();
    checkScore();
}

function updatePaddles(dt) {
    const p1 = state.paddles[0], p2 = state.paddles[1];
    const speed = 400;
    p1.vy = (state.keys.KeyS ? 1 : 0) - (state.keys.KeyW ? 1 : 0);
    p2.vy = (state.keys.ArrowDown ? 1 : 0) - (state.keys.ArrowUp ? 1 : 0);
    p1.y = clamp(p1.y + p1.vy * speed * dt, 0, state.court.height - p1.height);
    p2.y = clamp(p2.y + p2.vy * speed * dt, 0, state.court.height - p2.height);
}

function updateBall(dt) {
    state.ball.x += state.ball.vx * dt;
    state.ball.y += state.ball.vy * dt;
}
```

### Collision Detection

```javascript
function checkCollisions() {
    const b = state.ball;
    
    // Walls
    if (b.y - b.radius < 0) {
        b.y = b.radius;
        b.vy *= -1;
        playBeep(245);
    }
    if (b.y + b.radius > state.court.height) {
        b.y = state.court.height - b.radius;
        b.vy *= -1;
        playBeep(245);
    }
    
    // Paddles
    for (const p of state.paddles) {
        if (rectCircleCollide(p, b)) {
            reflectOffPaddle(p, b);
            playBeep(360);
            state.hitCount++;
            bumpSpeed();
        }
    }
}

function reflectOffPaddle(paddle, ball) {
    const hitOffset = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
    const clamped = clamp(hitOffset, -1, 1);
    const maxAngle = (75 * Math.PI) / 180;
    const angle = clamped * maxAngle;
    const speed = Math.hypot(ball.vx, ball.vy);
    ball.vx = -Math.sign(ball.vx) * speed * Math.cos(angle);
    ball.vy = speed * Math.sin(angle);
    
    // Separate from paddle to prevent re-collision
    if (ball.vx > 0) ball.x = paddle.x + paddle.width + ball.radius + 1;
    else              ball.x = paddle.x - ball.radius - 1;
}

function bumpSpeed() {
    const n = state.hitCount;
    const speedMult = n < 4 ? 1.0 : n < 12 ? 1.33 : n < 16 ? 1.66 : 2.0;
    const baseSpeed = 300;
    const targetSpeed = baseSpeed * speedMult;
    const current = Math.hypot(state.ball.vx, state.ball.vy);
    state.ball.vx *= targetSpeed / current;
    state.ball.vy *= targetSpeed / current;
}
```

### Scoring + Serve

```javascript
function checkScore() {
    const b = state.ball;
    if (b.x < 0) { state.paddles[1].score++; serveBall(1); }
    if (b.x > state.court.width) { state.paddles[0].score++; serveBall(-1); }
    if (state.paddles[0].score >= 11 || state.paddles[1].score >= 11) gameOver();
}

function serveBall(toward) {
    state.ball.x = state.court.width / 2;
    state.ball.y = state.court.height / 2;
    const angle = (Math.random() - 0.5) * (Math.PI / 4);  // ±22.5°
    const speed = 300;
    state.ball.vx = Math.cos(angle) * speed * toward;
    state.ball.vy = Math.sin(angle) * speed;
    state.hitCount = 0;
    state.serving = true;
    state.serveTimer = 1.0;
    playBeep(500, 0.3);  // score buzz
}
```

### Rendering

```javascript
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function render() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, state.court.width, state.court.height);
    
    // Centerline
    ctx.strokeStyle = 'white';
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(state.court.width / 2, 0);
    ctx.lineTo(state.court.width / 2, state.court.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Paddles
    ctx.fillStyle = 'white';
    for (const p of state.paddles) {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
    
    // Ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Score
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.paddles[0].score, state.court.width / 4, 60);
    ctx.fillText(state.paddles[1].score, (state.court.width / 4) * 3, 60);
}
```

### Input

```javascript
window.addEventListener('keydown', e => state.keys[e.code] = true);
window.addEventListener('keyup',   e => state.keys[e.code] = false);

// Pause
window.addEventListener('keydown', e => {
    if (e.code === 'Space') state.paused = !state.paused;
});

// Mouse (single-player variant): P1 = mouse
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    state.paddles[0].y = clamp(y - state.paddles[0].height / 2, 0,
                                state.court.height - state.paddles[0].height);
});
```

### Audio (Web Audio API)

```javascript
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(freq, duration = 0.09) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}
```

Three frequencies cover original Pong:
- 245 Hz: wall hit.
- 360 Hz: paddle hit.
- 500 Hz (longer): score.

### Helpers

```javascript
function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function rectCircleCollide(rect, circle) {
    const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
    const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy < circle.radius * circle.radius;
}
```

## Single-Player AI Mode

```javascript
function aiUpdate(paddle, dt) {
    const ball = state.ball;
    if (ball.vx < 0) return;  // ball moving away; AI idle
    
    const predictedY = predictBallArrival(ball, paddle.x);
    const target = predictedY - paddle.height / 2;
    const diff = target - paddle.y;
    const maxSpeed = 350;  // slower than player for fairness
    paddle.y += clamp(diff, -maxSpeed * dt, maxSpeed * dt);
}

function predictBallArrival(ball, targetX) {
    let x = ball.x, y = ball.y, vx = ball.vx, vy = ball.vy;
    while ((vx > 0 && x < targetX) || (vx < 0 && x > targetX)) {
        const dt = 1 / 60;
        x += vx * dt;
        y += vy * dt;
        if (y < 0) { y = -y; vy = -vy; }
        if (y > state.court.height) { y = 2 * state.court.height - y; vy = -vy; }
    }
    return y;
}
```

## Performance

- 60 fps trivially on any device (including mobile browsers).
- Total frame budget at 60fps: 16.67ms. Pong uses <1ms.
- No GC pressure; state updated in-place.
- Canvas 2D is fast enough; no WebGL needed.

## Responsive Sizing

```javascript
function resize() {
    const scale = Math.min(
        window.innerWidth / 800,
        window.innerHeight / 600
    );
    canvas.style.width = `${800 * scale}px`;
    canvas.style.height = `${600 * scale}px`;
}
window.addEventListener('resize', resize);
resize();
```

## Mobile Touch (optional)

```javascript
canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const y = (touch.clientY - rect.top) * (state.court.height / rect.height);
    state.paddles[0].y = clamp(y - state.paddles[0].height / 2, 0,
                                state.court.height - state.paddles[0].height);
});
```

## Total Code

~180 lines of JS + ~20 lines HTML. Entire game including AI, sound, scoring, rendering, match logic.

## Extending

From the baseline, learning extensions:
- **Visual polish**: particle trail on ball, screen shake on score.
- **Power-ups**: Arkanoid-adjacent — avoid in pure Pong.
- **Online multiplayer**: WebSocket or WebRTC; server-authoritative ball.
- **Tournament mode**: bracket + history.
- **Accessibility**: adjustable paddle size + ball speed + high-contrast.
- **Themes**: re-skin with different visuals while keeping physics.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Rules & Physics Design](../../references/rules-design.md)
- [3Cs Spec](../../references/3c-spec.md)
