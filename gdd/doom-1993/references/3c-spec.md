# 3Cs Spec — DOOM (1993)

Doom's controls feel timeless because of three things: speed, strafe, and hitscan. Camera is rigidly first-person on a 2.5D axis; the marine is a disembodied floating hand; movement is absurdly fast. Doom is pre-WASD — default controls were arrow keys — but the semantics that became FPS-standard (look, strafe, fire) were codified here.

## Camera

### Perspective

- First-person, rendered by BSP traversal + column renderer.
- Nominal 320×200 screen; `fov = 90°` horizontal.
- **No vertical look** (no Y-axis pitch) in original Doom — player always looks horizontal.
- No free aim vertically; auto-aim handles vertical targeting within a Y cone.

### Head Position

- Fixed height relative to sector floor (~41 units).
- Crouches impossible (no vertical movement toggle).
- Jump impossible (no Z-axis player input; original Doom lacks jumping).
- Height auto-adjusts on sloping floors / stair-step sectors.

### View Bobbing

- Slight sinusoidal Y offset synced to footsteps.
- Tunable in modern ports; always on in vanilla.

### Pain Visuals

- Red tint overlay on damage taken; intensity proportional to damage.
- Yellow tint on picking up items (brief).
- Green tint on radiation suit active.
- White flash on invulnerability sphere pulses.

### HUD (Status Bar)

Fixed-height bar at bottom showing:
- Doomguy's face mugshot (reflects health / damage direction).
- Health, armor, ammo (selected weapon).
- Weapon slots (lit up = owned).
- Ammo reserve counts (all types).
- Keycard indicators.

Mugshot face changes: full health = confident; low health = bloody; damage direction = looks toward attacker; Berserk = grinning rage face.

### Full-screen mode

Optional: remove status bar for borderless view. HUD collapses to numerical overlays. (Modern ports default to fullscreen.)

## "Character" (Doomguy)

### Representation

- No third-person model; no visible body in-game.
- Only the weapon hand is rendered (overlay sprite).
- Player mugshot (face portrait) on HUD represents the marine.

### Weapon Render

- Sprite overlay in lower half of screen.
- Bob animation matches footstep rhythm.
- Raise/lower animations on weapon switch.
- Fire animation per weapon (flash + recoil + shell eject where applicable).
- Fixed sprite rotation (no aim bob).

### Collision

- Cylinder collider (16 unit radius, 56 unit height).
- No per-limb hitbox; hitscan/projectiles check cylinder intersection.

## Controls

### Original Default (DOS 1993)

| Input | Action |
|---|---|
| ↑ / ↓ | Move forward / back |
| ← / → | Turn left / right |
| Alt + ← / → | Strafe left / right |
| Ctrl | Fire |
| Shift | Run (hold) |
| Space | Use (open door, press switch) |
| 1-7 | Select weapon by slot |
| Tab | Automap |
| Esc | Menu |

Strafe-lock via Alt was the original "secondary move" semantics. Later rebinding (often to A/D) plus mouse look set the FPS control convention.

### Mouse Support

Present in vanilla; off by default.
- Mouse X → turn (horizontal look).
- Mouse Y → move forward/back (later ports: look up/down with freelook).
- Left click: fire.
- Right click: forward (historical quirk).

### Modern Convention (Post-Quake, via source ports)

| Input | Action |
|---|---|
| W / A / S / D | Forward / strafe left / back / strafe right |
| Mouse | Look (X = turn, Y = pitch with freelook) |
| Left click | Fire |
| Right click | Alt fire (modern WAD extensions) |
| E | Use |
| 1-7 | Weapon |
| R | Reload (modern mods only; vanilla had no reload) |
| Shift | Run |
| Space | Jump (source ports only; vanilla has no jump) |
| Ctrl | Crouch (source ports only) |

### Gamepad (modern ports)

- Left stick: move (analog).
- Right stick: look (analog).
- Triggers: fire + alt fire.
- Face buttons: use, jump (if port supports), weapon swap.
- D-pad: weapon slots.

## Movement Physics

### Speed

- Walk: 1050 map units/sec.
- Run (Shift held): 2100 map units/sec.
- Equivalent: ~32 mph run speed (assuming 1 unit = 1 inch).
- Faster than Doomguy ever moves in any sequel.

### Acceleration

- Instant (no ramp-up).
- Applied friction when input released — decelerates.

### Strafe

- Same max speed as forward.
- Diagonal movement: combined input gives √2 higher net speed (the "diagonal speed-up bug" that became a feature).

### Strafe-run

- Exploit: pressing SR50 (strafe-run-50) key activates a bound key that strafes at 1.4× normal.
- Turbo movement; speedrunning technique.

### Wall slides

- When moving into wall at angle, velocity along wall tangent is preserved.
- Lets player slide around corners without losing speed.

### No gravity while walking

- Player on floor; no fall state except stepping off ledges.
- Steps ≤ 24 units: instantly climb.
- Steps > 24: blocked as wall.
- Falls off ledge: gravity applied; landing OK except at >300 units/sec vertical = damage.

## Weapon Controls

### Fire

- Hold Ctrl (or click mouse).
- Fire rate per weapon fixed; some weapons automatic (chaingun), some per-click (rocket launcher, BFG).
- Weapon raise animation on selection (~12-15 frames).
- Weapon lower on switch (~12-15 frames).

### Auto-aim

- Vertical auto-aim within a cone (~10°).
- Horizontal: player must aim.
- Resolves Doom's no-look-up problem — shots auto-track enemies above/below.

### No reload

- Ammo deducted per shot; magazine concept doesn't exist.
- "Reload" is a modern mod addition.

### Weapon switching

- Via keys 1-7 OR mousewheel (source ports).
- Instant queue; locks out fire during raise/lower.

## Interaction

### Use (Space)

- Open doors.
- Press switches.
- Activate lifts/elevators.
- Read text in certain maps.

No "pickup" button — contact-pickup (walk over items).

### Pickup Rules

- Health: picked up automatically if not at max.
- Armor: picked up if better (Green over nothing, Mega over Green, not Green over Mega).
- Ammo: always picked up up to max.
- Weapons: picked up even if owned (refills ammo of that type).
- Keys: picked up always.

### Doors

- Regular door: Use to open; closes after delay.
- Locked door: requires keycard/skull; Use attempt with wrong color = "You need a red key to activate this object."
- Exit door: Use to end level.

## Combat Inputs

### Strafe-circle

- Core technique: strafe around enemy while firing.
- Keeps player perpendicular to enemy's attack line.
- Especially effective vs slow projectiles (Imp fireballs, Baron/Cacodemon balls).

### Backpedal

- Walk backward while firing; maintains distance from melee enemies.

### Rocket jump

- Aiming down into floor and firing rocket while moving = launches player forward/up slightly.
- Emergent (not designed); became a speedrun staple.

## Feedback

### Visual

- Muzzle flash per shot.
- Enemy reaction sprites (pain frames).
- Blood splash on hitscan contact (red particles, gib on high damage).
- Screen flash on pickup/damage.
- Status bar mugshot reacts to damage direction.

### Audio

- Per-weapon sound (shotgun pump, chaingun spin, BFG charge/fire).
- Enemy awake/sight sounds ("AAAOOH" Pinky, "AAAARGH" Imp).
- Enemy death sounds.
- Ambient: computer hums, acid bubbles, Hell shrieks.
- MIDI soundtrack loops per level.

### Haptic

- Not applicable in 1993 DOS.
- Modern gamepad ports: rumble on fire + damage.

## Input Latency

- Target: 1 frame (~28ms at 35 FPS tic-rate).
- Doom runs at fixed 35 tics/sec; input polled per tic.
- Hitscan weapons: resolved same tic as press.
- Projectiles: spawned this tic; travel next tic forward.

## Minimap / Automap

- Tab to toggle.
- Line-drawn 2D top-down.
- Shows visited walls, discovered secrets (partial mode), doors, keycards.
- Zoomable, scrollable.
- Cheat IDDT toggles full map + item sprites + monster dots.

## Control Philosophy

### Speed Over Aim

Doom's marine moves faster than the player can accurately aim. This forces reactive play — snap shots, wide arcs, shotgun over pistol. Aim-heavy shooters (Counter-Strike, Apex) are the opposite philosophy.

### No Vertical Look As Constraint

Designing around "no up/down look" forced horizontal-only combat encounters. When source ports added freelook, much of Doom's map design still holds because the auto-aim handles vertical.

### Contact-Pickup Speed

No hold-to-loot. Walking over items grabs them. Keeps combat flow uninterrupted.

### Fire + Move as Primary

Fire and movement are separate inputs; both are held simultaneously by default. The entire gameplay vocabulary fits in "move around, shoot things, press use on doors."

### WASD Came Later

Doom's default was arrow keys + Alt-strafe. Thresh, John Romero himself, and early competitive Quake players popularized WASD. Doom's semantics migrated; its keybindings didn't.

### Auto-Aim as Accessibility

Vertical auto-aim made Doom playable without mouse look. Kids playing on keyboard-only could hit flying Cacodemons. Remove auto-aim (modern purist setting) and difficulty spikes.
