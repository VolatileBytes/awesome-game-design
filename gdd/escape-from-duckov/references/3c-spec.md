# 3C Spec — Escape from Duckov

## Character

Top-down perspective. The player duck is visible in full-body:
- ~128x128 sprite or small 3D model, depending on art style choice.
- Walking / running / crouched stance visible.
- Equipped weapon, armor, backpack visible in model (duck-scale).
- Muzzle flash + attacks visible from above.

Enemies visible at same scale; top-down readability is important.

## Camera

**Fixed top-down** view, slight tilt (3/4-ish).

Camera behaviors:
- **Follow player** with smoothing; lerps ahead slightly when moving.
- **Mouse-aim**: cursor determines firing direction; camera nudges toward cursor direction for more visibility.
- **Zoom**: limited; optionally tighter for sniper scope.
- **Shake**: on explosions, big hits, nearby grenades.
- **LOS fade**: objects between camera and player fade transparent if blocking view.

## Controls

### Keyboard + Mouse (primary)

Movement:
- **WASD**: move.
- **Shift**: sprint (limited by stamina).
- **Ctrl**: crouch.
- **Space**: dodge-roll (short iframes).

Combat:
- **Left Mouse**: fire.
- **Right Mouse**: ADS (zoomed + accuracy).
- **R**: reload.
- **Q**: swap weapon.
- **E**: interact (loot, door, extract).
- **1-4**: weapon slot.
- **G**: grenade.
- **F**: use quick-slot (meds, painkiller).
- **Tab**: inventory.

### Controller
- Left stick: move.
- Right stick: aim (twin-stick style).
- Triggers: fire + ADS.
- D-pad: quick-slots.
- A: interact.
- B: dodge-roll.
- Y: reload.

## Feel Rules

1. **Tight gunplay.** Bullets go toward cursor; no random spread beyond weapon specs. Aim is direct.
2. **Weight matters.** Heavier weapons slow movement; backpacks load slow walking.
3. **Meds mid-raid.** Healing takes visible seconds — exposed while healing.
4. **Duck flavor.** Character quacks on hit; enemy ducks drop feathers; SFX lean toward absurd.
5. **Raids end in your hands.** No random death; you made a bad call.

## Input Buffering

- Weapon swap is queued.
- Reload can be canceled.
- Dodge-roll interrupts other actions.

## HUD

Top-down shooters need more HUD than first-person:
- **HP bar** (bottom-left) + zone icons for blacked limbs.
- **Ammo** (bottom-center with mag + reserve).
- **Current weapon** icon + mode.
- **Mini-map** (top-right) — but faded / limited info (not all enemies visible).
- **Quest tracker** (right side).
- **Extract indicators**: arrow + distance on active extract.

Customizable — toggle minimap on/off for higher challenge.

## Inventory UI

Full-screen Tetris grid — same as Tarkov:
- Character slots (left).
- Backpack/rig contents (right).
- Loot container contents (center/floor).
- Drag/drop items.
- Rotate items to fit.

## Audio

- **Weapon fire**: distinct per gun.
- **Quack-based VO**: ducks complain, cheer, yell.
- **Enemy audio**: hear approach.
- **Environmental ambient**: per-zone (abandoned town, underground, factory, forest).
- **Music**: ambient exploration + combat stingers.

## Visual Design

- **Cartoon duck art**: silhouettes are legible; body parts visible.
- **Environment**: grungy, post-apocalyptic but with duck-scale props (duck-sized tables, chairs).
- **Props**: real-world tools scaled up relative to ducks.
- **Lighting**: stylized shadows; day/night per zone.
- **VFX**: muzzle flashes, blood (feathers?), explosions, bullet impacts.

## Accessibility

- Full keybind remap.
- HUD customizable.
- Text size options.
- Colorblind for damage indicators.
- No twitch-precision requirements — can pause tactical decisions.

## "Feel" in One Sentence

Escape from Duckov feels right when you, a duck in a military vest, gun down a dozen enemy ducks, loot a duck-sized suitcase of rifle parts, hear a "QUACK" over your shoulder, and extract with your pouch full before darkness closes in.
