# 3Cs Spec — Stardew Valley

Tuned for cozy top-down 2D pixel-art. Immediate, readable, relaxed controls that encourage experimentation.

## Camera

- **Top-down 2D**, orthographic, slight angle to suggest depth.
- Follows player with tight smoothing (~4 tile buffer).
- Pixel-snap ensures crisp 16x16 sprite grid.
- No zoom in base game; mods and recent updates added zoom controls on some platforms.
- Screen shake: reserved for heavy events (earthquake cutscenes, explosions).
- Fade transitions on map-change.

## Character

Player sprite is 16x16 body + 16x16 head, four-direction walking animation:
- Customizable at character creation: gender, hair, shirt, pants, skin, eye color, accessories.
- Changeable in-game via shrine / wizard's tower.
- Carrying pose when holding tool / gift / fish.
- Fishing pose during rod cast.
- Swing animation per tool.

Animation tight and punchy; sprite-flash on damage.

## Controls

### PC (Keyboard + Mouse)

| Input | Action |
|---|---|
| WASD / arrows | Move |
| Left click / C / X | Use tool / interact |
| Right click | Alt interact (check object, pet animal) |
| Shift | Run (default on in base) |
| 1-0 hotbar | Select tool/item |
| Tab | Switch hotbar row |
| E | Open inventory |
| Esc | Menu |
| F | Journal |
| M | Map |

### Gamepad

- Left stick: move.
- A: use tool / interact.
- X: alt interact.
- RB/LB: hotbar cycle.
- Y: inventory.

### Mobile

- Virtual joystick or tap-to-move (player toggles).
- Tap tile to select target.
- Hotbar UI on-screen.

## Tools

Each tool has:
- **Use cost**: stamina per swing.
- **Area of effect**: some tools upgrade to larger AOE (sprinkler-like water pattern).
- **Upgrade path**: Copper → Steel → Gold → Iridium (blacksmith + ore + days).

Tool use pattern:
- Equip tool from hotbar.
- Click/A to swing; animates + consumes stamina.
- Hold to charge (higher-tier tools unlock charged swings).

## Interaction Model

### Tiles

Map = grid of 16x16 tiles. Every tile has type:
- Grass, dirt, tilled soil, watered soil, water, stone, wood.
- Tiles can be interacted: hoe tills, watering can waters, seeds plant.

### Objects

Placed on tiles:
- Crops, furniture, machines, decorations.
- Hit with tool → effect (chop tree, break rock, etc.).
- Right-click → check contents (harvest crop, empty machine).

### NPCs

- Walk on schedules per hour of day.
- Talk: walk to NPC, interact → dialogue box.
- Gift: click NPC while gift is selected tool/item.

## UI Principles

- **Cozy frames**: soft-cornered wood/purple UI reminiscent of 16-bit RPGs.
- **Non-obscuring**: HUD edges; center is playable.
- **Keyboard-friendly**: all menus navigable without mouse.

### HUD

- Top-right: time, date, season, weather.
- Top-right (hover): money.
- Bottom: hotbar (12 slots).
- Bottom-left: quest notification indicator.
- Right: stamina + HP meters.

## Feedback

- Tool swing: satisfying sprite animation + audio cue per type.
- Crop harvest: bounce + particle + coin icon if sold.
- Friendship +: heart particle over NPC on gift acceptance.
- Festival music shift: immersive audio per festival type.
- Daily 2am: screen dim + forced sleep.

## Accessibility

- Large text option.
- Color-blind modes for crop highlighting.
- Autosave per day (no save-to-current-moment in base).
- Co-op pause affects all players (host-controlled).

## Control Philosophy

Stardew's controls are deliberately forgiving:
- No action is irreversible in a single day.
- Sleeping resets stamina fully.
- No timing-precise gameplay (except fishing minigame).
- Controls mappable to whatever feels comfortable.

Design goal: player should never feel punished by input. Mistakes cost minutes, never days.
