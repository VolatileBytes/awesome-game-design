# Core Gameplay (3C) — Toon Blast

## Character / Board

The player controls the board. Visible state:
- Grid of colored cubes (4–5 colors)
- Obstacles and trapped characters
- Move counter, objective panel, booster bar

The **cartoon characters** (Bruno, Cooper, Wally) appear in the UI corner — reactive, emotive — but the player is still the tapping hand.

## Controls

### Touch (primary)

- **Single tap** on any cube in a group of 2+ same-color → blast
- **Tap power-up** to consume solo
- **Drag power-up** onto cube to trigger combo (special interaction)
- Tap radius: generous (whole cube area); forgiving misses

### Desktop (web version)

- **Click** equivalent to tap
- Same single-input pattern

### Input Tolerances

- Tap-radius generous; very forgiving
- Invalid tap (lone cube): cube wiggles + "can't blast" sound
- Double-tap same cube: no-op after first

## Camera

- **Fixed 2D** view, top-down
- Board centered
- **Saga map camera**: vertical scroll with player avatar
- **Zoom flourish**: brief 1.1x zoom on Disco Ball + Disco Ball combo

## Feedback

### Visual

- **Cube press**: cube depresses ~50ms
- **Blast**: cubes explode outward with matching color particles
- **Cascade trail**: falling cubes streak
- **Character reaction**: Bruno cheers / frowns in corner
- **Star splashes**: on power-up creation, star burst with scale sparkle
- **Screen flash**: on combo (color-matched)

### Audio

- **Pop** on small blast (2–4 cubes)
- **BOOM** on larger blast (5+)
- **Character voice**: Bruno "Haha!", Cooper "Meow!", Wally "Owwww"
- **Musical cascade**: ascending pitch on chain
- **Victory fanfare**: level-complete brass

### Haptic (mobile)

- Light tap per blast
- Medium per power-up creation
- Heavy per combo
- Rhythm pulse per Sugar-Crush-style finale

## Readability

- **Color + shape**: cube shapes also embossed (spots, stripes) for colorblind
- **Power-ups glow**: rockets have stripes, bombs pulse, disco ball sparkles
- **Obstacle distinction**: wood grain on crates, icy sheen on ice cubes
- **Group highlight**: on hover/press, adjacent same-color cubes glow briefly

## Accessibility

- Colorblind mode
- Sound/music off
- Reduced motion
- Text scale

## UI Components

- **HUD** (in level):
  - Objective panel (top-left): "30 red cubes left"
  - Moves counter (top-right)
  - Boosters (bottom bar)
- **Character avatar** (corner): Bruno/Cooper/Wally reacting
- **Pause menu**: sound, quit, buy moves
- **Out-of-moves modal**: "+5 moves for 900 coins"
- **Level-complete**: stars + coins + character cheer
- **Saga map**: neighborhood scroll with level nodes
- **Team menu**: chat, request lives, view league
- **Shop**: coin packs, boosters, piggy bank

## State-Driven UI Principles

- One focal element (board during play)
- Always show objective and moves clearly
- Celebrate progress with character reactions
- Soft failure: no harsh sounds on out-of-moves
