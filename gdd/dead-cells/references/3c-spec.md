# 3C Spec — Dead Cells

## Character

**The Prisoner** (cell possessing a headless corpse): 2D side-view sprite, ~24px tall in base render, upscaled with pixel-perfect filter.

- **Run speed**: ~210 u/s.
- **Jump**: ~2.5 tile height; double jump possible with mutation.
- **Dodge roll**: ~180u dash, 14 frame total, iframes frames 4–10.
- **Fall**: variable-height jump (release to shorten); fast-fall by down-input in air.
- **Ledge grab**: auto-grab on tile edge; climb up with up-input.

Weapon set: two main weapon slots + two skill slots + 4 mutations.

## Camera

**2D side-scroll** camera.
- Follows player with leading offset in facing direction.
- Clamps at biome bounds.
- Zoom level: fixed; pixel-accurate scaling.
- Small shake on big hits, bigger shake on parry-stun.
- Camera moves up on upward jumps (anticipate fall).

## Controls

### Gamepad (primary)

| Input | Action |
|---|---|
| Left stick / D-pad | Move |
| A / X | Jump (hold → higher) |
| B / Circle | Dodge roll |
| X / Square | Weapon 1 |
| Y / Triangle | Weapon 2 |
| RB / R1 | Skill 1 |
| LB / L1 | Skill 2 |
| RT / R2 | Interact / pick up |
| LT / L2 | Health potion |
| Up + A | Climb / enter door |
| Down + A | Fast-fall through platform |

### Keyboard + Mouse

| Input | Action |
|---|---|
| WASD | Move |
| Space | Jump |
| Shift | Roll |
| Mouse L | Weapon 1 |
| Mouse R | Weapon 2 |
| Q / E | Skill 1 / Skill 2 |
| R | Health potion |
| F | Interact |

## Feel Rules

1. **Every attack cancellable into roll**, but only after hit frames. This makes chaining feel aggressive but requires commit to animation.
2. **Input buffer ~6 frames**: press attack slightly before combo completes; game queues it.
3. **Hitboxes generous on player, tight on enemies**: coyote-time-style lenience.
4. **Coyote time**: 6 frames after leaving a platform you can still jump.
5. **Momentum-based jump**: running jump carries arc; standing jump goes straight up.
6. **Fall damage only in specific DLC biomes**: base game has none to encourage aerial combat.

## Animation Commit

- **Attack animations commit** but are partially cancelable into roll.
- **Roll** is fully uninterruptible (for consistency of iframes).
- **Combo chain**: 2–4 swings with increasing damage on the last hit.

## Core Actions Table

| Action | Startup (f) | Active (f) | Recovery (f) | Notes |
|---|---:|---:|---:|---|
| Light attack (sword) | 4 | 3 | 10 | 3-hit combo |
| Heavy attack (axe) | 10 | 4 | 18 | big stagger |
| Dodge roll | 1 | 9 iframes | 4 | |
| Jump squat | 2 | release | — | |
| Parry (shield) | 0 (holding) | while held | 6 | perfect window 8–12f |
| Skill (grenade) | 10 | throw | 8 | |

At 60fps, a frame = 16.7ms.

## Mobile Adaptation

- **Virtual d-pad** left side; action buttons right side.
- **Auto-attack** toggle in accessibility settings.
- **Bigger touch targets** for mobile: each button ~15% of screen width.
- **Context-sensitive interact**: hold anywhere near an interactable.

## Platforms

- **Switch / Steam Deck**: gamepad default, 60fps locked.
- **iOS / Android**: virtual buttons + auto-attack accessibility.
- **Desktop**: keyboard + mouse primary with full remapping.

Any rebuild must preserve the signature "attack → roll → attack" rhythm with frame-perfect cancels.
