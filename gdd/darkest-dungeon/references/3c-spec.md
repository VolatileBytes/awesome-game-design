# 3C Spec — Darkest Dungeon

## Character (party)

4 heroes in a horizontal formation (front → back). Each is a 2D rigged sprite, ~300px tall. The party moves as a single icon in the hallway view.

- **In hallway**: party walks left-to-right automatically as player inputs direction; torch hovers above.
- **In encounter**: party locked in position; skills target enemy ranks.
- **In camp (rest)**: heroes seated around fire; animate ambient.

Heroes have an **affliction state overlay** (portrait is framed red/gold when afflicted/virtuous).

## Camera

Fixed **2D side-view** for dungeons. Zoom levels:
- **Map view**: overhead map of explored rooms.
- **Hallway view**: party from side, ~50% width of screen.
- **Encounter view**: zoomed in, both parties visible, portraits at bottom.
- **Town view**: Hamlet composite image with buildings clickable.

Camera shakes on crits, boss attacks, big stress events. No 3D, no free camera.

## Controls

### Mouse + Keyboard (primary)

Dungeon:
- **Arrow keys / AD**: move party in hallway.
- **Click room**: path-find to that room.
- **Right-click enemy**: view stats/description.
- **1–4**: select hero's skill slots.
- **Q/W/E/R**: quick-select formation positions.
- **Tab**: toggle map view.
- **Space**: end turn / continue.

Combat:
- **Click skill** → **Click target**.
- **Pass (P)**.
- **Move left/right** (arrow keys with shuffle).
- **Item (I)**.

### Gamepad (PS/Xbox/Switch)

Left stick navigates. A = confirm. B = back. X = skill select. Y = map. Triggers cycle active hero.

### Mobile / Touch

- Tap skill → tap target.
- Swipe map for exploration.
- Larger UI elements for portraits.
- Toggle text-size in accessibility.

## Feel Rules

1. **Deliberate pacing**: combat is slow, thoughtful. No twitch.
2. **Narrator voice reacts**: crits trigger a narrator line ("A devastating blow!"). Stress crossings trigger flavor VO ("Some wounds never heal...").
3. **High contrast visuals**: dark backgrounds + lit character art for legibility.
4. **Typography is diegetic**: skill names, damage numbers use thematic serif fonts. Matches the gothic tone.
5. **Everything has weight**: missing a crucial attack is accompanied by a swooshy whiff sound + narrator groan.

## Input Buffering

- **No buffering** — each decision is a deliberate click. This is intentional; the game is all about choice weight, not reflex.
- **Confirm modal** on irreversible choices (end run early, abandon hero in camp).

## Hero Portrait System

At bottom of screen during combat:
- 4 hero portraits left (player), 4 enemy portraits right.
- Turn order bar at top (who goes next).
- Hero portrait shows: HP bar, Stress bar, class icon, status icons (bleed, stun, buff, affliction).

On hero click: expanded panel with quirks, skills, equipment, trinkets.

## Audio

- **Narrator** by Wayne June — a Lovecraft-style voice. 800+ lines.
- **Stinger music** on ambushes, afflictions, boss reveals.
- **Ambient loops** per region (undead wind in Ruins, muddy squelch in Warrens).
- **SFX**: each skill has attack + impact + crit layer. Crits have a "CRACK" layer.

## Animation Philosophy

- **Minimal idle animation** when waiting for input.
- **Full animation on action**: skill fires, camera zooms briefly, impact VFX, damage numbers float, portrait reacts.
- **Exaggerated poses**: each class has signature silhouette (Highwayman's coat, Vestal's cowl).

## Accessibility

- **Text speed**: narrator pace adjustable (or mutable).
- **Dyslexia font**: alternative UI font.
- **Color-blind patterns**: status icons use shapes + colors.
- **Radiant mode**: tuned for shorter sessions (less grind, same tone).
