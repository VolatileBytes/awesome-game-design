# Saga Map Design

The **saga map** is Candy Crush's primary navigation UI and progression visualization. It's a long, meandering visual path with thousands of level nodes, episode markers, and social presence.

## Layout

### Vertical Scrolling Path

- **Orientation**: vertical scroll (thumb-swipe up/down friendly)
- **Path width**: ~4–5 levels wide at any camera position
- **Episode boundary**: visual break + theme shift
- **Total length**: scrolls through 10,000+ level nodes

### Camera

- **Auto-center**: on player's current unlocked level on open
- **Free scroll**: player can drag up (completed levels) or down (preview locked)
- **Snap-to-level**: light snap to level node center when scroll ends
- **Zoom**: fixed; no pinch-zoom (differentiates from Royal Match's pannable palace)

## Level Nodes

### Node States

- **Locked**: greyed out icon; shows level number
- **Unlocked, not cleared**: colored icon; "Play" prompt on tap
- **Cleared (1 star)**: 1 star above the node
- **Cleared (2 stars)**: 2 stars
- **Cleared (3 stars)**: 3 stars + golden badge
- **Current**: pulsing glow; player avatar sits here

### Node Types

- **Normal level** (white candy node)
- **Hard level** (labeled with devil icon, red tint)
- **Super Hard level** (flame icon, darker red)
- **Sugar Drop level** (candy-drop icon during event)
- **Jelly Queen / Bubblegum Boss** (boss icon on specific levels)
- **Episode goal** (trophy at episode end)

## Episodes

- Visual **backdrop change** per episode: Candy Town → Bubblegum Bridge → Pastille Pyramid → etc.
- **Character cameo** at episode boundaries (Tiffi meets Yeti, etc.)
- **Unlock animation**: fanfare + new-area reveal when progressing
- **Episode intro/outro**: 2-3 line narrative from Tiffi + Mr. Toffee

## Gates (Mid-Map Blockers)

### Ticket Gates

- Placed every ~15 episodes
- Visual: a closed gate with padlock
- Prompts:
  - **Wait** (3 days until auto-open)
  - **Ask friends** (request from 3 friends; opens on responses)
  - **Buy** ticket (~100 gold or $1.99)

### Quest Gates (rare)

- Require N stars across the prior episode
- Or require 3-star on specific level

## Social Layer on the Map

### Friend Avatars

- Show friend's current level on the map (opt-in via Facebook)
- Creates **visible competition**: "Friend X is at level 500, you're at 450"
- Tap friend icon → challenge, send life, view profile

### Social Bubbles

- "Jessica beat level 456 in 1 move!" — floating notification on level
- Prompts player to try to match

## The Player Avatar

- Cute animated character (Tiffi in classic; customized in modern)
- Walks between nodes on level complete (short animation)
- Expressive: cheers on clear, sulks on fail
- Tapping avatar opens profile: stars earned, lives, boosters

## UI Elements

### Top Bar (on map)

- **Level count**: how many levels completed
- **Stars total**: sum across all levels
- **Life counter**: ♥ × 5 + regen timer
- **Gold bar count**

### Bottom Bar

- **Daily spin** button (if available)
- **Events** tab
- **Shop** tab
- **Social** (friends, chat, invites)

### Episode Banner

- Top banner showing current episode name + progress (e.g., "Bubblegum Bridge 7/15")

## Progression Feedback

### Level-Complete Celebration

- Star fanfare + score popup
- Stars "shoot" to cumulative total
- If end-of-episode: full-screen episode-complete animation with reward chest

### Ticket Gate Crossing

- Dramatic "gate opens" animation
- Character walks through
- Reveal of next area

## Replay Access

- Tap any cleared level to replay
- Shows: "Best score: X", "Stars earned"
- Replay costs 1 life

## Preview Locked Content

- Scroll down past current level to see upcoming episodes
- **Preview mode**: see episode themes, not level details (creates curiosity)
- "Coming soon" badges on recent-update levels

## Performance

- **Virtualized rendering**: only visible ~20 levels rendered
- **Scrolling**: 60fps smooth even on low-end devices
- **Asset streaming**: episode art loads on scroll

## Design Goals

- **Visible journey**: player sees how far they've come + how far to go
- **Social pressure**: friend positions drive engagement
- **Curiosity**: unseen episodes motivate continued play
- **Celebration**: every level clear has visual reward on the map

## Production / Asset Requirements

### Per Episode (15 levels)

- **Backdrop illustration** (1 layered scene)
- **Path spline** (level positions defined)
- **2 character cameos** (intro/outro)
- **Theme music variant** (subtle tweak of base)
- **1 boss level** (flagged difficulty + unique flourish)

### Scale

- **10,000+ levels**: 670+ episodes
- **Art team**: 2–4 environment artists on ongoing live content
- **Character animators**: 1–2 per cameo

## Technical Implementation (Unity)

- **Tilemap or spline-path**: level positions baked to asset
- **Scroll rect**: single long vertical scroll rect with episode prefabs
- **Node prefab pool**: pool of level node prefabs; recycle as scroll
- **Friend overlay**: separate layer; positions drawn from server data

## Contrast with Royal Match

| Feature | Candy Crush | Royal Match |
|---|---|---|
| Meta | Saga map only | Saga map + Palace home |
| Stars | Vanity (1/2/3 per level) | Currency (spent on palace) |
| Gates | Ticket gates | None; stars gate palace tasks |
| Social on map | Friend avatars | None (kingdom chat separate) |
| Narrative | Episode intros only | Continuous King Robert story |

Candy Crush's approach: **laser focus on level path**. Royal Match: **home-base expansion**.
