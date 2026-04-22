# 3Cs Spec — Among Us

Camera, character, and controls tuned for readable-at-a-glance social deduction on any platform.

## Camera

- **Top-down 2D**, orthographic, fixed zoom.
- Follows player center with zero smoothing lag (rigid).
- Vision cone: crewmate has limited sight radius (~6-8 tiles) through walls; impostor has extended sight.
- Lights sabotage reduces crew vision radius by ~50%.
- Minimap overlay on tap (doesn't pause action for others).
- No camera rotation. World orientation fixed.

## Character

Player avatar is a small bean/astronaut:
- Color-coded (12 colors; player picks in lobby).
- Hat/pet/skin slots (cosmetic only).
- Uniform hitbox across players (no advantage from appearance).
- Walk animation 8-direction; sprite moves smoothly.
- Death animation: body sprite remains as evidence.

No class distinction in silhouette — only color + cosmetics. This is deliberate: crewmate/impostor indistinguishable visually.

## Controls

### Movement

- **PC**: WASD or arrow keys (or mouse click-to-move on some builds).
- **Mobile**: virtual joystick (bottom-left).
- **Gamepad**: left stick.

Movement is constant-speed; no sprint, no crouch, no dodge. Speed is host-configured (0.5x - 3x).

### Context Actions

Bottom-right corner shows dynamic context button:
- **Use**: interact with task panel, door, admin, vitals.
- **Report**: when near body.
- **Kill** (impostor): when near isolated crewmate and cooldown ready.
- **Vent** (impostor): when on a vent.
- **Sabotage** (impostor): dedicated button opens sabotage menu.
- **Map**: opens overlay showing map + admin data if at admin.

One-tap / one-click. No combos. No input complexity.

### Task Interaction

Tap "Use" near task panel → task minigame opens → solve → auto-close.
- Minigames are short (3-15s): wire connection, card swipe, pattern match.
- Some require timing / dexterity; most are simple click sequences.
- Task can be abandoned (walk away) and resumed later.

### Chat

- **Meeting chat**: keyboard (PC) or touch keyboard (mobile).
- **Quick-chat**: preset phrases for mobile-no-keyboard players (colors, rooms, verbs).
- Voice: not built-in; third-party (Discord) commonly used.

Chat is unavailable outside meetings (no proximity chat in base game; community mods add it).

## Haptics / Feedback

- Kill: brief screen-shake + red flash for impostor + victim.
- Report: blue flash transition to meeting.
- Sabotage: persistent HUD warning; audio cue.
- Vote: check-mark animation; anonymous or public per host setting.

## Accessibility

- Text chat with high-contrast UI.
- Color-blind friendly: names + shapes (when enabled) distinguish players beyond color.
- Language support: multiple localizations.
- Subtitles for voice-like cues: all critical info is text + icon.

## Control Philosophy

One-button game. Context-sensitive bottom-right button is the whole input vocabulary for non-movement actions. This makes Among Us trivially learnable on any platform and on the first match.

Social complexity sits entirely in the conversation layer. Mechanics stay friction-free.
