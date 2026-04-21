# Core Gameplay (3C) — Candy Crush Saga

## Character / Board

The player controls the **board**, not a character. The visible state:
- Grid of candies (6 colors + special candies)
- Obstacles (jellies, chocolate, locks, meringue, marmalade, cake bomb)
- Score counter + moves remaining + objectives panel

No avatar; the player **is the hand** swiping candies.

## Controls

### Touch (primary)

- **Swipe** candy in 4 directions: up, down, left, right
- **Tap** a special candy (striped, wrapped, color bomb) to consume it solo
- **Drag** from one candy to adjacent: more forgiving than precise swipe

### Desktop (saga on web / Windows)

- **Click** candy, then click adjacent
- **Click-drag** equivalent to swipe
- No keyboard support

### Input Tolerances

- Swipe threshold: ~20 pixels or ~15° angle
- Tap & hold to preview what a special candy does (tutorial mode)
- Invalid-swap animation: 150ms bounce-back

## Camera

- **Fixed 2D top-down** view of the board
- Board centered; UI on top (moves/objective) and bottom (booster bar)
- **Saga map camera**: vertical scroll, auto-centers on player's current level
- **Zoom on big combos**: brief 1.05x zoom for Color Bomb + Color Bomb

## Feedback

### Visual

- **Candy shakes** before match confirms (~100ms anticipation)
- **Pop animation** + candy-colored particle burst on match
- **Sugar trails** follow cascading candies
- **Sweet!**, **Tasty!**, **Delicious!**, **Divine!**, **Sugar Crush!** text banners
- **Sugar Crush finale**: remaining moves transform to striped candies and fire

### Audio

- **Candy pop**: tonal pop per match (rising pitch per cascade)
- **Mr. Toffee voice**: "Sweet!", "Divine!", "Sugar Crush!" (iconic)
- **Background music**: upbeat "Candy Factory" theme loop
- **Sugar Crush jingle**: triumphant upward scale

### Haptic (mobile)

- Light tap per swap
- Medium per match-4
- Heavy per Color Bomb fire
- Pattern-pulse per Sugar Crush

## Readability

- **Color + shape**: 6 candy colors also have distinct shapes (red=jelly drop, blue=square, green=ball, yellow=moon, orange=oval, purple=flower) for colorblind accessibility
- **Specials glow**: striped candies show directional stripes, wrapped pulse, color bomb sparkles
- **Obstacle distinction**: locks darker than chocolate darker than jelly
- **HUD**: objective top-left, moves top-right, score top-center

## Accessibility

- Colorblind mode (bonus distinct symbols)
- Sound off / music off
- Reduced motion option (less screen shake)
- Text scale for dialog

## UI Components

- **HUD** (in level): objective panel (top-left), moves (top-right), score (top), boosters (bottom)
- **Level-start modal**: preview objective + pre-level boosters option
- **Pause menu**: sound/music/quit
- **Out-of-moves modal**: "+5 moves for 900 gold" offer
- **Level-complete**: stars + score + gold reward + "continue" button
- **Saga map**: path of levels, episode markers, player avatar, friend avatars
- **Shop**: gold bundles, booster bundles, lives
- **Daily reward spinner**
- **Events tab**

## State-Driven UI Principles

- One focal element at a time (board during play, dialog on state change)
- Progressive disclosure: don't reveal combo potential until player is ready
- Celebrate small wins (every match has feedback)
- Silence failure (gentle, never harsh — "out of moves" is soft)
