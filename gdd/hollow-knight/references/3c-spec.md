# 3Cs Spec — Hollow Knight

Tight, responsive controls and a camera that prioritizes combat and platforming clarity. Hand-drawn 2D visuals paired with frame-perfect mechanics.

## Camera

- **2D side-scrolling**, orthographic.
- Follows player with subtle smoothing (~4 frames lag).
- Look-up / look-down: holding up/down pans camera slightly to peek.
- Auto-pan in boss arenas (locked bounds).
- Slight zoom shift on boss / important event (minor).
- Screen-shake: nail hits, boss slams, crystal smashes.
- Transitions: fade + corridor walk on area change (no literal loads; streaming is near-instant).

## Character

Knight avatar:
- ~60px tall (small figure; world feels large).
- Expressive silhouette despite mute face.
- Nail carried on back → swung on attack.
- Cloak flutter animates cleanly.
- 8 movement animations: idle, walk, run, jump-rise, jump-apex, jump-fall, land, dash.
- Combat animations: attack-left/right/up/down, parry, spell-cast, heal-hold.

Sprite is hand-drawn vector (not pixel); scales crisply.

## Controls

### Default PC Bindings

| Input | Action |
|---|---|
| A / D (or arrows) | Move left/right |
| Space / Z | Jump |
| X / LMB | Attack (nail) |
| S + X | Down-attack (pogo) |
| ↑ + X | Up-attack |
| C / Shift | Dash (after ability unlock) |
| A / RMB | Focus (heal, hold) |
| Q (hold) | Cast spell menu (hold + direction) |
| S + Shift | Super-dash |
| W (hold) + Space | Wings (double-jump) |
| E | Dream Nail |
| Tab | Map |
| Esc | Menu |

Controller default similar; customizable.

### Platforming Inputs

- **Jump variable height**: tap → short; hold → full.
- **Coyote time**: small grace frames after leaving ledge.
- **Jump buffering**: pressing jump slightly before landing still jumps.
- **Wall-jump**: on wall-cling + jump; consistent arc.
- **Down-attack (pogo)**: bounces off enemies/spikes (Zelda-inspired; crucial platforming technique).

### Combat Inputs

- **Directional attack**: attack-up (Up + X), attack-down (Down + X), attack-sides (X).
- **Nail-Art**: hold X → release for charged strike (only with Nail-Arts charm/training).
- **Spell cast**: hold Q → directional input.
- **Focus**: hold A/RMB to heal — vulnerable during 1 second cast.

## Feedback

- **Hit confirm**: brief hitstop on connecting blow.
- **Nail bounce**: visible recoil sprite on wall / shield hit.
- **Damage**: screen flash white + knockback arc.
- **Heal**: golden glow surrounds player while focusing.
- **Shade creation**: dark circle + dramatic audio when player dies.

Hitstop is subtle but present; gives weight to nail strikes.

## Haptics

- Dash: short rumble (controller).
- Wall-cling: brief pulse.
- Boss hits: rumble on taking damage.

## UI

Minimal HUD, top-left:
- Mask icons (HP).
- Soul orb (magic resource).
- Geo count (currency).

No health bars on enemies. No damage numbers. No hit markers.

No minimap overlay during gameplay. Full map pulled via menu (pause).

## Audio

- Music shifts by area; subtle ambient beds; orchestral themes for major events.
- SFX: nail clang, cloak whoosh, bug chitter, water drops.
- Silence is intentional in vast empty rooms — emphasizes scale + loneliness.

## Accessibility

- Colorblind mode for spell differentiation.
- Difficulty is fixed (no easy mode in base; DLC bosses have attunement).
- Gamepad rumble configurable.
- Steam Deck verified.

## Control Philosophy

### Frame-Tight Responsiveness

Input → action is minimum-latency. Jump is 2-frame response. Dash is 1-frame start. This is essential for Souls-like dodge timing.

### Predictable Physics

Jump arc consistent. Dash distance consistent. Enemies have predictable telegraphs. Failure = player error, not mechanic randomness.

### No Auto-Aim

All attacks are directional. Player must face target. No assist on platforming — precision required.

### Read-and-React

Combat rewards observation. Each enemy has tells; each boss has phases. Pattern learning is the game.

### Difficulty Without Artifice

No scaling. Enemies don't buff based on level. Hallownest is dangerous the first time and forever, but you improve — not the numbers.
