# 3C Spec — Counter-Strike

## Character

First-person human soldier. Visible:
- Weapon model (viewmodel) in lower-right.
- Hands holding weapon.
- Shadows cast under player.

Third-person only visible when:
- Spectating.
- Dead (killcam/replay).
- Demo playback.

Body is hitbox-accurate:
- **Head**: ~4× damage multiplier, separate hitbox.
- **Chest / stomach**: ~1× / 1.25×.
- **Arms**: ~1× but armor doesn't help.
- **Legs**: ~0.75×.

Model differentiates T vs CT visually (agents, gloves, silhouette).

## Camera

Fixed first-person. FOV 90° (default, adjustable 60–90 in CS2).

Camera behaviors:
- **Viewmodel sway**: subtle, cosmetic.
- **Recoil kick**: upward/lateral during spray (deterministic pattern).
- **Zoom**: scoped weapons (AWP/SSG/Scout/AUG/SG) toggle scoped FOV.
- **Death**: camera follows killer for kill-cam → orbits body.
- **Spectate**: free-cam / locked-first-person / locked-third-person.

No motion blur, no head-bob during strafe (competitive clarity).

## Controls

### Mouse + Keyboard (canonical)

Movement:
- **WASD**: move.
- **Shift**: walk (silent).
- **Ctrl**: crouch.
- **Space**: jump.

Combat:
- **LMB**: primary fire.
- **RMB**: secondary fire (zoom/burst/silencer toggle).
- **R**: reload.
- **Q**: last weapon.
- **1-5**: weapon slots (primary/secondary/knife/grenades/bomb).
- **G**: drop weapon.
- **E**: use (defuse / pickup).
- **B**: open buy menu (during freeze time or buy zone).

Communication:
- **K**: voice chat (push-to-talk).
- **Y**: all chat.
- **U**: team chat.
- **Mouse5**: ping wheel (CS2).

### Controller (limited)

CS has controller support but is not competitively viable. Tournament play is mouse+keyboard only.

## Feel Rules

1. **Crosshair is sacred.** It's the center of attention; player-customizable in deep detail.
2. **Hit feedback is minimal but unambiguous.** Blood spatter on enemy, damage number (CS2), directional damage indicator when hit.
3. **Death is instant, respawn is never** (within a round). You sit spectating, which is high-info time.
4. **Every click matters.** Tapping vs holding vs burst — the weapon teaches you its pattern.
5. **Time dilation is absent.** No slow-mo, no bullet-time. Reality speed only.

## Input Buffering

Essentially **none** in combat:
- Buy menu: clicks register immediately.
- Weapon switch: no queue; fast-switches cancel animations.
- No combo buffering.

Counter-strafing (the skill of stopping instantly) is tick-accurate; misplacing by 1 tick = inaccurate bullet.

## HUD Elements

```
+---------+                        +-----------+
|Minimap  |                        | Kill-feed |
+---------+                        +-----------+
  $ money

[                crosshair                    ]

HP [====]  |  Ammo 30/90  |  Armor [====] helm
Team HUD (top-center): 4 teammates' HP + weapon icon.
```

CS2 adds:
- **Damage numbers** on hits.
- **Bomb site indicators** (A/B on HUD when in zone).
- **Loadout preview** in freeze-time overlay.

## Audio

- **Footsteps**: directional, distance-audible (~20m).
- **Silent walk (shift)**: no footstep sound.
- **Reload**: unique per weapon; tells opponents you're out.
- **Grenade pins**: audible "ping."
- **Bomb plant/defuse**: universal "beep" (plant) / defuse sound.
- **Bullet impact near ear**: "whiz" — a miss past your head.
- **Radio calls**: canned voice lines triggered by events (plant, defuse, down).
- **Music kit**: plays during MVP / round end / 10-second warning.

HRTF on (default) for front/back disambiguation — crucial for positional play.

## Visual Design

- **Maps**: stylized but readable. Color palettes per map, low visual clutter at player-eye-level.
- **Weapon skins**: purely cosmetic; silhouette unchanged (competitive fairness).
- **Agents** (CS2): character skins; silhouette approximates canonical models. Some agents were temporarily banned from comp for camo issues.
- **Lighting**: maps are static-lit; dynamic lighting only on effects (muzzle flash, fire, flash).

## Accessibility

- Colorblind modes for kill feed + flashbang overlay.
- Crosshair color/shape fully custom.
- Audio: subtitles for voice lines; visualizer for directional audio (limited).
- Controls: full rebind.
- FOV / viewmodel / crosshair are so customizable that pro configs ship as shared files.

## "Feel" in One Sentence

Counter-Strike feels right when your bullets go exactly where your crosshair was at the moment you clicked — no forgiveness, no smoothing, no help.
