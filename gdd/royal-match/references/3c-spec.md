# 3Cs — Character, Camera, Controls

Royal Match is a match-3 grid game with a narrative meta-layer. 3Cs apply to both.

## Character — King Robert + Companions

### King Robert

- Mascot and primary emotional anchor
- Appears at top of grid during play (watching the player)
- Reacts to big plays (cheers, claps)
- Full-body cartoon character with exaggerated facial expressions

### Supporting Cast

- **Queen**, **Butler**, **Knight**, **Wizard**, etc.
- Appear in story scenes
- Characterful dialogue bubbles during palace restoration
- Voice-like sounds (no real voice, just emotes — cost-effective localization)

### Character Design Principles

- **Cartoonish** — Disney-Pixar-adjacent, appeals broadly
- **Warm color palette**
- **Expressive**: big eyes, big reactions
- **Wordless humor** where possible (international appeal)

## Camera — Grid + Palace

### Level Screen (Puzzle Grid)

- Top-down 2D view of the match-3 grid
- Grid occupies center 60% of screen
- Top: objective + moves counter + power-ups carried over
- Bottom: boosters, menu

### Palace Screen (Meta)

- 3D-feeling 2D illustrated mansion view
- **Scrollable vertically** through rooms
- **Tap a task pin** → spend stars to activate restoration
- Between tasks, watch short animated scenes

### Dramatic Camera Moments

- **Big combo**: camera shake + slow-mo briefly
- **Level complete**: zoom to goal met + fireworks
- **Restoration complete** (room done): pan around the finished room with a mini-cinematic
- **Story beat**: camera focuses on character dialogue

## Controls — Touch-First

### Match-3 Controls

- **Tap and drag** (swipe) to swap two pieces
- Swipe distance minimal — just direction
- **Tap a power-up** to fire it manually (Lightball)
- **Tap activated power-up** (once placed in grid) to fire

### Palace Controls

- **Tap a task** with a star icon → activate restoration (costs stars)
- **Swipe to pan** the palace view
- **Tap characters** for dialogue

### Menu Controls

- **Big buttons**, low-information UI
- Level select: big "Play" button centered
- Settings hidden in a single menu button

## UX Principles

### Immediate Feedback

- Every tap/swipe has audio + visual feedback within 100ms
- Piece movement is smooth (not instant)
- Matches "explode" visibly before pieces disappear
- Combos chain with escalating audio

### No Information Overload

- Minimal text in UI; icons + colors
- Levels show objective with icons only (3 cakes = image of cake + "3")
- "Play" is the most prominent button always

### Reward at Every Step

- Every match: piece explodes + score pops up
- Every combo: audio stinger
- Every level end: fireworks + star + coins
- Every palace task: short animation + story beat

### Failure as Soft

- Fail a level: short "sad" animation; offer +5 moves
- Lives depleted: wait or buy (not a hard stop)
- No harsh "GAME OVER" — always a path forward

## Accessibility

- **Colorblind mode**: pieces have shape differentiation not just color
- **No time pressure mode** (for moves-limit levels this is default)
- **Reduce motion** for players sensitive to effects
- **Mute/SFX toggle** separately
- **Large-tap targets**: important for older / less dexterous players

## Haptic Feedback

- **Match**: short gentle buzz
- **Combo**: medium buzz
- **Power-up fire**: strong buzz
- **Level complete**: double buzz
- **Fail**: soft buzz
