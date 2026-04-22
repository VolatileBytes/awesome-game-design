# 3C Spec — Hades

## Character

**Zagreus**: isometric 2D sprite, ~1.5m tall. Fluid 8-directional movement with sprint acceleration. Death animation canon (not game-over).

Move states:
- **Idle**: ambient sway animation.
- **Run**: full speed (~500u/s) after ~0.1s acceleration.
- **Dash**: invulnerability frames during the entire dash (0.15s). 1 base charge, refreshes on ground.
- **Attack**: weapon-dependent. Can interrupt run into attack cleanly, but attacks commit to their animation.
- **Cast**: ranged burst. Uses Bloodstones (~3 charges); recovered by picking up stones from where they landed.
- **Special**: weapon-dependent alt-attack (sword spin, spear throw, shield bash).

## Camera

Fixed-angle **3/4 top-down isometric**. Camera follows Zagreus with slight lead in the aim direction. Camera clamps at room edges. No zoom, no tilt — the game is always legible from the same perspective.

- Screen shake on big hits (restrained — not Vampire Survivors levels).
- Damage numbers + crit/elemental flashes above enemies.

## Controls

### Gamepad (primary)

| Input | Action |
|---|---|
| Left stick | Move |
| Right stick | Aim (applies to attack/special/cast/dash-strike) |
| A / X | Attack |
| X / Square | Special |
| Y / Triangle | Cast |
| B / Circle | Dash |
| RT / R2 | Interact / Call of the God (when charged) |
| LT / L2 | Hold to zoom-aim (bow) |
| Start | Pause / Boon reference |

### Keyboard + Mouse

| Input | Action |
|---|---|
| WASD | Move |
| Mouse position | Aim |
| LMB | Attack |
| RMB | Special |
| Q | Cast |
| Space | Dash |
| E | Interact |
| F | Call (when charged) |

Mouse aim is significantly more precise for bow/rail; gamepad autolock makes melee easier.

## Feel Rules

These are the non-negotiables from Supergiant's design:

1. **Dash ≥ 50% of your time input.** The game is balanced around constant dashing; if a player feels punished for dashing, tune it.
2. **Every hit you take is fair.** Telegraphs must be visible for ≥ 0.4s before the strike; no invisible attacks. If a player dies, they should say "I should have dodged that."
3. **Screen readability > visual flourish.** Even during Ares's blade storm + Dionysus's fog, the player's character and enemy attacks must remain readable.
4. **Animations commit, but cancels exist.** Attacks play their whole animation, but you can cancel into dash at key frames ("dash-cancel" is a mastery tech).
5. **Immediate pickup.** No "hold to equip" — walk over obol/keys and they're yours.

## Input Timings

| Action | Startup | Active | Recovery |
|---|---|---|---|
| Sword light attack (3-hit combo) | 6f / 8f / 10f | 2f / 2f / 3f | 8f / 10f / 20f |
| Spear thrust | 8f | 4f | 12f |
| Bow draw (full) | 30f charge | release | 8f |
| Shield block | 0f (hold) | while held | 4f on release |
| Dash | 1f | 9f (iframes) | 4f |
| Cast | 6f | launch | 16f |

At 60fps, 1f = ~16.7ms. Dash iframes ~150ms.

Whatever engine rebuild chooses — these timings are the source of truth.
