# 3Cs — Character, Camera, Controls

Hearthstone is a board-oriented card game: the 3Cs adapt to board management on a virtual tabletop.

## Character → Hero Portrait

The player's "character" is their Hero Portrait:
- A large animated bust at the center-bottom of the board
- Classes have unique portraits (Jaina for Mage, Garrosh for Warrior, etc.)
- **Alternate heroes** are cosmetic collectibles — same class, different look
- **Emotes**: click own hero for "Greetings" / "Thank you" / "Oops" / etc.
- Hero HP, Armor, Attack (if any), Hero Power button docked around the portrait

## Camera → Board View

One fixed camera:
- **Board top-down** (actually 3/4 perspective — stylized tavern table)
- **Opponent side** at top, **Player side** at bottom
- **Hand** fanned along the bottom
- **Decks** at left/right
- **Mana crystal row** at the right edge
- **Rope timer** visible near the End Turn button

### Board Feel

- Cards have **physical weight**: they thud when played
- Minions have **idle breathing animations**
- **Clickable board elements** that respond (innkeeper on the side, barrels, etc.)
- Seasonal / expansion boards have theme-specific animations (frozen throne, dragon's lair, etc.)

### Dramatic Camera Moments

- **Legendary play**: gold glow, horn fanfare, camera zooms
- **Lethal**: "The Reaper" effect, enemy hero cracks apart
- **Big spell**: casting animation sweeps the board
- **Combo hero power** (Rogue): small stinger

## Controls → Click/Drag First, Touch-Adapted

### On Desktop
- **Click and drag** a card from hand to the board to play
- **Click** a minion → click a target (attack)
- **Keyboard shortcuts**: `N` new turn, `Enter` concede menu, `Esc` menu

### On Mobile
- **Drag** is primary
- **Long press** a card for full text + keyword tooltip
- **Drag to portrait** for direct-damage spells
- **Tap** an own minion → target with arrow

### Mana UI
- Mana crystals fill from the pool as you hover / drag cards
- **Insufficient mana**: card is greyed out

### Rope
- 90-second turn timer (visible as a burning rope)
- Ends automatically when it burns through
- **Pinging animation** when turn ends (hurry-up sound)

### UX Affordances

- **Hover a minion**: show all affecting auras + keywords
- **Right-click** (desktop) or **long-press** (mobile) for full card text
- **Turn-auto-pass** after last action if possible (optional setting)
- **Graveyard** viewer: see what's died
- **History log**: last 5 actions (who played what, what died)

## Accessibility

- **Colorblind settings**: attack/HP colors adjustable
- **Text size**: large font option
- **Replay-safe**: games can be saved as replays (client-side) for review
- **Audio cues**: turn start, rope warning, legendary plays have distinct stings
- **Squelch**: mute opponent emotes in one click
