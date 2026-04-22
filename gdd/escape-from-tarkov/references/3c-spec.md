# 3C Spec — Escape from Tarkov

## Character

First-person; visible:
- Hands + weapon + attachments.
- Some limb visibility on lean/ADS.
- Shadow cast on ground.

Third-person only in inventory screens (full-body preview), lobby, pre-raid.

Character model: 4-state animation rig (idle/walk/run/sprint/prone/crouch), hit reactions per body zone.

Body visible with:
- **Armor plate carrier** (chest rig, armor vest).
- **Helmet + face shield** (class-ranked).
- **Backpack** (visible silhouette; bigger = louder + more loot).
- **Weapon** (silhouette tells enemy tier at range).

## Camera

First-person. FOV 50-75 (default 50 for hardcore; community pushes max 75).

Camera behaviors:
- **Sway**: heavy when running, minimal when still.
- **Weapon weight affects sway**: heavy weapons sway more.
- **ADS transition**: slow (realistic); can't ADS-snap.
- **Free-look** (alt-hold): rotate head without rotating body — crucial for scanning.
- **Lean** (Q/E): peek around corners.
- **Stance** (stand/crouch/prone) blended with 1-9 stance-adjust scroll.
- **Shake**: on hit, on explosion, on suppressed hit.

Head-bob: realistic; nauseating for some. Adjustable.

## Controls

### Keyboard + Mouse (primary)

Movement:
- **WASD**: move.
- **Shift**: hold-sprint or toggle-sprint.
- **W+W**: toggle auto-run.
- **Ctrl**: crouch.
- **X**: prone.
- **C**: stance adjust (hold).
- **B**: auto-run-toggle.
- **Alt (hold)**: free-look.
- **Q / E**: lean left/right.
- **1/2/3**: 3/4/5-tier lean increments.

Combat:
- **Left Mouse**: fire.
- **Right Mouse**: ADS.
- **R**: reload (requires manually swap mags).
- **B**: change fire mode (semi/auto).
- **T**: inspect weapon.
- **V / B / N**: weapon slots (primary, secondary, pistol, melee).
- **Y/U**: inspect ammo in mag (count visible for some weapons).
- **Space**: jump (short, impractical).

Tactical:
- **Tab**: inventory (in-raid).
- **O**: raid time.
- **F1-F12**: bind meds/grenades.
- **G**: throw grenade.
- **H**: toggle headphones.
- **N**: change sight / mode.
- **F / Num+**: interact (loot, door, extract).
- **Mouse-wheel**: fire rate / mag count / fine zoom.

### Controller
Not supported.

## Feel Rules

1. **Every input costs a heartbeat.** Dragging an AK mag out of a chest rig takes 1-2 seconds — seconds during which you can't fire.
2. **Audio is a sense.** Close your eyes, you can hear an opponent's reload, footsteps, mag swap.
3. **Suppressive fire works.** A bullet cracking past your ear disorients; people flinch.
4. **Fear is real.** The raid can be empty for 20 minutes, then a footstep sends your heart rate up.
5. **Inventory time = exposure time.** Checking a backpack in-raid takes seconds; players killed mid-loot is a tropes.

## Input Buffering

Almost zero:
- Reload cancels with any movement.
- ADS is physical; cannot buffer during reload.
- Cannot ADS + sprint + shoot simultaneously.
- Fire mode change mid-shot is committed.

Some inventory actions can queue (drag-stack), but combat actions are immediate-apply.

## HUD (Minimal)

Default: basically nothing on screen.
- Raid timer (bottom-right).
- Weapon fire mode (top-right corner).
- Crosshair (off by default).

Item-based info surfaces:
- Wearing a Compass: compass widget top of screen.
- Wearing a GPS: minimap widget (special item).

**Third-party mods/cheats** often add HUD; core game keeps it off.

## Inventory UI

Separate screen (Tab):
- Character paper-doll (left): helmet, headwear, face-cover, vest, chest rig, backpack, armband, secure container, holster, primary 1/2, melee.
- Ground (right): loot container at your feet / body / container interactable.
- Grid view: drag + drop.
- Right-click: unload, split, merge.

**Quick-slots** (bottom bar): bindable items (meds, grenades).

**Match-accelerated** inventory: heavy looting leaves you in menu for 5-10s per item — exposed.

## Audio

- **Footsteps**: directional, distance-accurate, surface-aware (grass, concrete, metal).
- **Movement noise scales with speed + weight**: walking = quiet; sprinting full-kit = LOUD.
- **Weapon fire**: recognizable per caliber + suppressor state.
- **Reload**: unique per magazine (tactical vs standard).
- **Bolt action / pump**: distinct cycle.
- **Breathing**: stamina exhaustion audible to self.
- **Heartbeat**: at low HP.
- **Heavy bleed**: gurgling sound.
- **Pain sobbing**: on blacked zone.

**HRTF** (off by default): toggles head-transfer function for 3D audio.
**Sordin / ComTac headphones**: in-game item that amplifies distant audio while clipping loud.

## Audio Geometry

- **Sound occlusion**: walls muffle.
- **Sound diffraction**: around corners.
- **Vertical sound**: floor above / below audible differently.

Maps with vertical design (Interchange, Reserve) reward audio-geometry mastery.

## Visual Design

- **Semi-realistic MilSim**: muted palette, worn textures, ambient dread.
- **Weapon customization visible**: scopes, flashlights, grips, handguards — distinct silhouettes.
- **Player kit tiering readable**: "geared" player looks different from "bag runner."
- **Weather**: fog, rain, snow, night, dawn. Affects sight and audio.

## Accessibility

Limited in modern-AAA terms:
- Key rebinds.
- Some visual accessibility settings (brightness, gamma).
- No colorblind-specific modes.
- Hardcore design; small audience concessions.

## "Feel" in One Sentence

Tarkov feels right when you hear one footstep across an empty map, your pulse spikes, and you spend 90 seconds lying flat in one corner to see if it happens again.
