# 3Cs Spec

## Camera

- **Projection:** orthographic, top-down
- **Zoom:** fixed. The visible play area is small enough that enemies spawn off-screen and close to engagement range within 1–2 seconds. Too zoomed-out and the player sees danger too early; too close and ranged threats feel cheap.
- **Follow:** rigid follow on the player, no lag, no dead-zone. Movement-only input means a lagging camera would make the game feel floaty without any benefit.
- **Bounds:** unbounded for open-plane stages; clamped to level bounds for stages with physical walls.
- **Shake:** on elite spawns, boss hits, and arcana pickups. Intensity adjustable in accessibility settings. Never on normal hits — would become noise.
- **No manual camera input.** The game assumes the camera always shows exactly what the player needs.

## Character

- **Locomotion:** 8-directional, constant speed modulated by the `Speed` passive. Analog stick yields full 360° direction; keyboard is snapped to 8 dirs.
- **Acceleration:** effectively instant (>1 screen-width per second squared). The game is about positioning, not momentum.
- **Facing:** visually the sprite mirrors left/right to face movement direction. There is no logical facing — all weapons fire on their own rules.
- **Collision:** circular collider with a small radius (roughly half the sprite width). Walls and scene props block movement; enemies do not (they pass through each other and through the player, dealing damage on overlap).
- **Hit model:** invulnerability frames after each hit (~0.3s). Without i-frames a stack of enemies deletes the player in one frame.
- **Death:** zero HP → run ends immediately. No ragdoll, no revive animation. Cut to results screen.

## Controls

| Input | Action |
|---|---|
| Left stick / WASD | Move |
| D-pad / arrow keys | Navigate level-up cards |
| A / Enter / LMB | Confirm card |
| B / Esc | Pause menu |
| Start / P | Pause |

No attack button. No interact button. No dash (base game). No inventory — selections happen through the level-up draft.

### Anti-patterns to avoid

- **Don't add a "hold to sprint".** Modulate base speed via passives. An always-on sprint breaks positioning design.
- **Don't add aim.** The whole point is that the player does not aim — weapons do. Aiming turns the game into a twin-stick shooter.
- **Don't add an attack input.** Auto-fire is load-bearing. If you give the player one attack button, players will rebind everything else and the game will drift.

## Movement Feel Targets

- Time-to-cross-screen: 3–4 seconds at base speed
- Time-to-react-to-off-screen-threat: 1.5–2 seconds from visible to engageable
- Rotation in place: instantaneous (zero-radius pivot)
- Invulnerability window after taking damage: ~300 ms, with brief sprite flash

## Menu & Pause UX

- **Level-up draft:** full game pause. Cards presented centred, large, readable at a glance. Icons carry information; text is confirmation.
- **Pause menu:** instant. Shows current build (weapons + passives + arcana), run timer, kills, DPS.
- **No confirmation dialogs** inside a run. Draft picks are final; the reroll/skip/banish are the only "undo" mechanisms.
