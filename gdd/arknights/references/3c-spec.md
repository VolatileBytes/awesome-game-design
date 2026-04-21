# 3Cs — Character, Camera, Controls

Arknights is a tile-grid tower defense; the 3Cs adapt to a top-down tactical game.

## Character — Doctor + Operators

### Doctor (the player avatar)

- You play **"The Doctor"** — an amnesiac commander in a post-apocalyptic world
- Present only in story scenes (hooded figure, canonically unnamed)
- Operators address you as "Doctor"
- No in-game movement; the Doctor is the player's identity, not a unit

### Operators (Deployable Units)

- Anime-style characters with full art, VA, and lore
- Each has a unique visual (chibi sprite on tile grid) + full art portrait
- **Character-driven** — players form attachments to favorites
- Voice lines play on deploy, retreat, and major actions

### Character Depth

- Each Operator has: profile, backstory, recorded "files" (unlockable as you level), voice lines, modules
- This depth creates **waifu/husbando** gameplay — collect and deepen your favorite operators

## Camera — Top-Down Tile Grid

- **Angle**: 45° top-down isometric
- **Zoom**: zoom in to see sprites, zoom out to see full map
- **Pan**: drag the map; always stays within stage bounds
- **Lock-to-enemy**: optional feature — camera follows the lead enemy

### Dramatic Camera Moments

- **Stage start**: camera pans over the map showing enemy paths
- **Boss entry**: brief cinematic zoom on the boss
- **Operator deploy**: small zoom + VA line + deploy direction indicator
- **Skill cinematic**: some high-star Operators' S3 skill triggers a brief screen effect

## Controls — Touch-First

### Deployment
- **Drag** an Operator portrait from the bottom bar to a tile
- Highlighted tiles show legal placement
- **Release on a tile** + drag finger to choose **facing direction**
- Tap deploy icon → confirm

### Unit Actions
- **Tap** a deployed Operator → popup: Skill button, Retreat button, stats
- **Manual skill**: tap skill button when SP full
- **Retreat**: return the Operator to the bench (partial DP refund, redeployment cooldown)

### Time Controls
- **Pause**: pause mid-stage (essential for thinking)
- **1x / 2x speed**: speed up the action (essential for farming)
- **Restart**: give up, restart the stage

### Stage Overview
- Bottom bar: deployable Operators (draggable)
- Top bar: DP counter, kill count, leak count, timer
- Right: Operator bench (pool of ready-to-deploy)
- Pause / speed / settings button

### Auto-Deploy (Clear / Auto-Battle)
- Once a stage is cleared with full stars, "Auto" button unlocks
- Re-runs the exact same stage using a recorded play
- Saves stamina on repeat farming

## UI / HUD

### In-Stage HUD
- DP counter (top-left)
- Kill / Leak counter (top-center)
- Speed + Pause (top-right)
- Operator bench (bottom)
- Deployment limit indicator

### Operator Info Popup
- Tapping an Operator shows: HP bar, SP bar, skill icon, retreat button

### Minimap?
- No minimap — the stage is visible on one screen
- Vertical stages may require some scrolling

## UX Principles

### Pause Is King
- Stages are puzzles. Pausing to think is **encouraged**, not a crutch.
- Pause works instantly; combat resumes only when unpaused
- This is the key UX that makes the TD **puzzle-like** rather than frantic

### Manual vs Auto Skills
- Players prefer auto by default for speed
- Manual skills reward precise timing (save big ult for boss pass-by)
- UI lets you set each skill to auto or manual

### Speed-Up
- 2x speed for farming is essential quality-of-life
- Some events include 3x speed

## Accessibility

- **Colorblind-safe**: enemy class icons + colors
- **Font size** adjustable
- **Button size** adjustable
- **Auto-deploy**: for players who can't manage rapid deployment
- **Simplified effects**: option to reduce particle count on lower-end devices
