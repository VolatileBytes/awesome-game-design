# 3Cs Spec — Pong

The entire control vocabulary is "paddle up" and "paddle down." Camera is static. Character is a rectangle. Depth comes from input responsiveness and physical feel.

## Camera

- **Static orthographic top-down** (or side-on, depending on reading).
- No zoom, pan, or shake.
- Fixed court boundaries fill screen.
- On original hardware: camera IS the raster scan — there's no camera abstraction, just direct signal generation.

Court dimensions on original Pong:
- 858 × 525 pixels nominal (NTSC scanlines).
- Playable area slightly inset.

## "Character" (Paddles + Ball)

### Paddle

- White rectangle, ~4 pixels wide × ~40 pixels tall.
- No animation; fixed sprite rectangle.
- Position: locked X; variable Y.
- On original hardware: paddle was a bar of illuminated scanline pixels at specific X column.

### Ball

- White square, 2×2 to 4×4 pixels.
- Continuous velocity vector.
- No trail or blur effect on original — pure discrete jumps at refresh.

### Score Display

- Large 7-segment style digits at top of screen.
- One digit per player (0-15 range typical).

## Controls

### Original Atari Arcade (1972)

- **Player 1**: potentiometer dial (rotary), turns map directly to paddle Y position.
- **Player 2**: separate dial.
- **Coin**: insert for game start.

Analog input → continuous paddle position, no discrete steps.

### Modern Reconstruction

#### Keyboard (2-player local)

| Input | Player |
|---|---|
| W / S | P1 up/down |
| ↑ / ↓ | P2 up/down |

Rate-based movement (paddle moves N pixels per frame while key held) OR position-based (mouse).

#### Gamepad

| Input | Player |
|---|---|
| Left stick Y | Player (analog) |
| D-pad Up/Down | Player (discrete) |

#### Mobile Touch (single-player vs CPU)

- Drag paddle directly with finger.
- Analog position input.

#### Mouse

- Vertical mouse position → paddle Y (1:1 or scaled).
- Best feel; closest to original potentiometer.

## Paddle Physics

- Paddle is rigid; cannot deform.
- Clamp to screen top/bottom bounds.
- Max speed: matches dial twist rate on original; on keyboard, capped to reasonable interception speed.
- No inertia on original; some modern variants add drag for feel.

## Ball Physics

- Position advanced by velocity each frame.
- Collision checks per frame:
  - Top wall → reverse Y velocity.
  - Bottom wall → reverse Y velocity.
  - Paddle → reverse X velocity; adjust Y based on hit zone.
  - Scoring zone (left/right edge) → point scored, ball reset to center.

### Hit Zone Reflection (8-zone original)

Paddle divided into zones (top to bottom):
- Zone 1 (top): ball reflects upward-sharp.
- Zone 2: upward-moderate.
- Zone 3: upward-shallow.
- Zone 4: flat.
- Zone 5: flat.
- Zone 6: downward-shallow.
- Zone 7: downward-moderate.
- Zone 8 (bottom): downward-sharp.

New angle = deterministic function of hit zone.

### Speed Progression

Ball speeds up at specific rally thresholds:
- Start: slow (tier 1).
- After 4 paddle hits: medium (tier 2).
- After 12 paddle hits: fast (tier 3).
- After 16 paddle hits: very fast (tier 4, cap).

Reset to slow on each serve.

## Input Latency

The critical feel property:
- Analog input (dial / mouse) → paddle position = same frame.
- Digital input (key) → paddle moves within 1 frame.
- Hardware original had zero software latency — raster scan was the signal.

Modern builds must aim for <16ms input→screen latency.

## Feedback

### Visual

- Paddle rectangles redraw at new position each frame.
- Ball position updates per frame.
- Score increments immediately on scoring.
- Flash / color-invert on score (optional; not in original).

### Audio

Three sounds (1972 original):
- **Paddle hit**: ~360 Hz blip, ~90ms.
- **Wall hit**: ~245 Hz blip, ~90ms.
- **Score**: ~500 Hz ~1s buzz.

Modern variants may add music / more elaborate SFX but purists retain the blip set.

### Haptic

- Not applicable on original.
- Modern mobile / gamepad: light rumble on ball hit.

## Accessibility

- Large paddles = easier.
- Slower ball = easier.
- Some variants: tunable paddle size / ball speed / AI level.
- Colorblind: monochrome original is trivially accessible.

## Control Philosophy

### One-Dimensional Input, Infinite Expression

The paddle moves only on Y axis. Yet high-level play includes:
- **Timing reads** (when to move).
- **Pre-positioning** (predicting ball arrival).
- **Angle crafting** (choose paddle zone to serve specific angle back).
- **Psychological reads** (fake out opponent's movement).

### Analog Beats Digital

Dial / mouse / analog stick give smoothest Pong. Keyboard Pong is worse Pong — discrete position changes break precision reflection.

### Zero Latency Non-Negotiable

Every frame the paddle doesn't respond is a missed hit. Any Pong engine MUST prioritize input latency above everything else.

### Rectangles Are Enough

No particle effects, no camera shake, no screen warp. Pong's minimalism is not primitive — it's refined.
