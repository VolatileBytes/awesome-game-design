# 3Cs — Character, Camera, Controls

Marvel Snap is a menu-driven card game with no "character" in the platformer sense. Adapt 3Cs accordingly.

## Character → "Board Avatar"

The player is represented by:
- **Avatar**: a circular portrait; shown at the top of the board
- **Title**: decorative banner earned via progression
- **Card Back**: shown on face-down cards

There's no character movement; the avatar expresses identity and collection flex.

## Camera → Board View

One fixed camera view:
- **Landscape orientation**, portrait mode on phone
- **Opponent side at top**, player side at bottom
- **Three locations** in a horizontal row in the middle
- **Hand** at the bottom
- **Mana tracker** at bottom-right
- **Cube counter** and **stake indicator** at the top

### Dramatic Camera Moments

- **Snap**: screen flash, cube icon zooms in, audio stinger
- **Reveal sequence**: camera pans across locations left-to-right
- **Winner announcement**: zoom into the winning location, particle burst
- **Big card play**: the card slams onto the board, screen shake

## Controls → Touch-First

### Card Play
- **Drag card** from hand to a location
- Card locks in and can be dragged back (until end-turn commit)
- **End Turn**: big submit button bottom-right

### Snap
- **Snap button** top-center
- Tap to activate; confirm with a second tap

### Retreat
- **Retreat button** — slide up from bottom or via menu
- Cuts losses; confirm via modal

### Card Info
- **Long-press** any card to see full text + effects preview
- **Tap** opponent's revealed card to read its effect

## UX Considerations

### Simultaneous Reveal
- Players commit moves **secretly**
- When both commit, a "Revealing..." animation plays
- Reveal sequence is **orchestrated** (not raw simultaneous) for drama — cards flip one-by-one based on priority rules

### Priority Order
- Higher-powered cards reveal first
- Ties broken by the "priority player" (changes each turn)
- This creates **strategic depth** — baiting reveals is a skill

### Networking
- See [unity/references/netcode-architecture.md](../engines/unity/references/netcode-architecture.md) for the simultaneous-commit flow

## Accessibility

- **Colorblind-safe**: all key info has text + icons, not color alone
- **Font scale**: large-font mode
- **Tap-only mode**: for players who can't drag reliably
- **Audio cues** for turn end, snap, match result
