# Rules & Physics Design — Pong

Pong's entire design is rule-density vs. simplicity. A handful of parameters tuned across 1972 → today produce wildly different feels: competitive, casual, punishing, lazy. This doc captures the parameter space and the classic tuning.

## Core Rules

1. First to N points wins. N = 11 (classic), 15 (some variants), or first-to-lead-by-2.
2. A point scored when ball crosses opponent's back wall.
3. Ball re-serves from center after each point.
4. Paddles cannot cross centerline (implied by X-locked positioning).

That's the rule set. Every additional behavior is physics.

## Court Dimensions

### Original Atari

- Court width: 858 pixels (maps to screen width).
- Court height: 525 pixels.
- Paddle width: ~4 pixels.
- Paddle height: ~40 pixels.
- Ball size: 2×2 to 4×4 pixels.
- Centerline: column of 8-pixel dashes down middle.

### Modern Reconstruction (standard 16:9 canvas)

- Court 800 × 600 or 1280 × 720.
- Paddle: 10 × 80 or 16 × 120.
- Ball: 10 × 10 or 16 × 16.

## Paddle Parameters

| Parameter | Classic Value | Tunable Range |
|---|---|---|
| Width (X) | 4 px | 3-20 |
| Height (Y) | 40 px | 20-150 (cheese mode) |
| Max speed | ~300 px/s | 100-1000 |
| Acceleration | instant (original) | gradual (modern) |
| Hit zones | 8 | 1 (flat) to 32 (granular) |
| Position X (P1) | ~20 px from left | — |
| Position X (P2) | ~20 px from right | — |

## Ball Parameters

| Parameter | Classic Value | Tunable Range |
|---|---|---|
| Size | 2-4 px | 1-30 |
| Initial speed | ~300 px/s | 100-800 |
| Max speed (cap) | ~900 px/s | 500-2000 |
| Speed tier increments | 4, 12, 16 hits | custom |
| Serve delay | 1 second | 0-3 |
| Max reflection angle | ±75° | ±45° - ±85° |
| Angle per hit zone | determined by zone math | — |

## Reflection Math

Given:
- `ball.x`, `ball.y`: ball position
- `ball.vx`, `ball.vy`: velocity
- `paddle.y`: paddle center Y
- `paddle.height`: paddle height

On paddle collision:
```
hitOffset = (ball.y - paddle.y) / (paddle.height / 2)  // [-1, 1]
hitOffset = clamp(hitOffset, -1, 1)
maxAngle = 75°  // or tunable
angle = hitOffset * maxAngle
speed = sqrt(ball.vx² + ball.vy²)
ball.vx = -sign(ball.vx) * speed * cos(angle)
ball.vy = speed * sin(angle)
```

This produces the classic "hit with top of paddle to shoot upward" behavior.

### English / Spin (optional)

Add paddle velocity to ball:
```
ball.vy += paddle.vy * kSpinFactor  // kSpinFactor ~0.3
```

Allows skilled players to impart extra curvature. Not in original Pong.

## Wall Bounce

Top wall at `y = 0`, bottom at `y = courtHeight`:
```
if ball.y - ball.radius < 0:
    ball.y = ball.radius
    ball.vy *= -1
    playSound(wallHit)
if ball.y + ball.radius > courtHeight:
    ball.y = courtHeight - ball.radius
    ball.vy *= -1
    playSound(wallHit)
```

Elastic collision; no energy loss (classic).

## Scoring

```
if ball.x < 0:
    score.P2 += 1
    serveBall(toPlayer=1)
if ball.x > courtWidth:
    score.P1 += 1
    serveBall(toPlayer=2)
```

On serve:
- Ball position = court center.
- Ball direction = toward player who was scored on (alternate behavior: toward scorer).
- Ball speed = initial tier.
- Brief pause (0.5-1s) before release.

## Game Over

```
if score.P1 >= TARGET_SCORE: P1 wins
if score.P2 >= TARGET_SCORE: P2 wins
```

Classic: race to 11.
Tournament variant: win by 2 (sudden death at 10-10).

## Speed Escalation Table

Classic original:

| Hit Count | Speed Multiplier |
|---|---|
| 0-3 | 1.0 (slow) |
| 4-11 | 1.33 |
| 12-15 | 1.66 |
| 16+ | 2.0 (cap) |

Reset counter on each serve.

## AI Opponent Variants

### Tracking AI (easy)

```
targetY = ball.y
paddle.y += clamp(targetY - paddle.y, -aiMaxSpeed, aiMaxSpeed)
```

Follow ball directly; beats beginners, loses to humans.

### Predictive AI (medium)

When ball heading toward AI side:
1. Calculate ball arrival Y at paddle X via ballistic extrapolation.
2. Account for wall bounces en route.
3. Move paddle toward predicted Y.

Handles angles correctly; challenging to beat.

### Capped-Error AI (hard but beatable)

Predictive AI with:
- Small random jitter added to predicted Y.
- Reaction delay (0.1-0.3s).
- Max paddle speed slightly below ball max.

Simulates human-like imperfect play.

## Variants

### Pong Doubles

- 2 paddles per side.
- Either partner can hit.
- Cooperative positioning.

### Breakout

- Pong-adjacent: one paddle at bottom, destroy brick wall with ball.

### Super Pong

- Four paddles, 4-player free-for-all.

### Volley / Video Olympics

- 50+ rule-tweaked variants in the Atari 2600 cartridge.

## Tuning for Feel

### "Too easy" fix

- Increase initial ball speed.
- Smaller paddles.
- Steeper max reflection angle.

### "Too hard" fix

- Larger paddles.
- Slower ball.
- Shallower max reflection.

### Classic arcade feel

- Fast ball progression.
- Small paddles.
- Short match (first to 11).
- Paddle zone reflections (8 zones).

### Casual / living-room feel

- Slower ball.
- Larger paddles.
- First to 15 or first to 21.
- Wider max reflection angle for expressive rallies.

## Edge Cases

### Ball stuck horizontally

If somehow `ball.vy ≈ 0`, the ball bounces endlessly without progress. Fix: minimum vertical component (e.g., `|vy| ≥ 0.1 × speed`).

### Paddle phase-through

At very high ball speeds, the ball can skip past a paddle between frames.
Fix: continuous collision detection (CCD) — sweep-check ball segment against paddle rect.

### Center freeze

On reset, if both players hold still, the ball approaches their paddle at 0 Y-speed.
Fix: small random angle on serve (±10°) instead of perfect horizontal.

### Paddle speed exploit

If paddle velocity is added to ball (English), capping paddle speed prevents infinite ball acceleration.

## Multiplayer

### Local (original design)

- Two humans, one screen, two controllers.
- No networking.
- Latency: frame-perfect (both inputs on same machine).

### Online (modern port)

- Server-authoritative preferred.
- Client prediction for own paddle; reconcile on packet.
- Ball simulated on server; clients render.
- ~50-100ms round-trip acceptable.

### Couch Co-op vs. Matchmaking

Pong's DNA is couch co-op. Online Pong feels alien without voice/video of opponent. Most modern Pong-likes re-integrate shared-context (streamer mode, party mode, shared audio).

## Design Philosophy

### Constraints As Feature

2D, two inputs, three sounds. Pong proves that minimal rule sets produce deep play — Pong-like games are still being invented 50+ years later.

### Physics Is The Game

No power-ups, no weapons, no progression. The physics simulation IS the design. Tune physics → tune feel.

### Social > Single-Player

Pong works best as a 2-player. Against AI, it's a demo. Local multiplayer was Pong's cultural payload.

### Symmetric by Default

Both players have identical paddles, speeds, mechanics. Asymmetric Pong variants exist but the base design is fair.

### No Narrative

No story, no character, no theme beyond "two paddles, one ball." Purest formalism in game design.

## Rejected Patterns

- **Power-ups**: Arkanoid's genre — not Pong's.
- **Random ball angles**: removes skill; angle must be deterministic from hit zone.
- **Time limits**: Pong is score-based; timer would distort.
- **Multiple balls**: Pong is one ball. Multiplying breaks tension.
- **Paddle HP / damage**: Pong is physics-only, no attrition.
