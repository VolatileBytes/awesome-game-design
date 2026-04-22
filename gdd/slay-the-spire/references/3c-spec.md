# 3C — Slay the Spire

Turn-based card combat has no character controller, no physics camera. The 3C are really Cards, Canvas, Controls.

## Character (the Deck)

The "character" the player controls is their deck state:

- **Draw pile** (top-down stack)
- **Hand** (5 cards default; displayed fanned at bottom)
- **Discard pile** (played + end-of-turn hand discards)
- **Exhaust pile** (removed for the combat)
- **Player HP / energy / block / status effects** (above hand)

The player avatar is a static portrait on the left of the combat view; it plays attack/defend animations when cards resolve, nothing more. No locomotion.

## Camera

- **Combat view**: static 2D, fixed framing. Player portrait left, enemies right, HUD around edges.
- **Map view**: full-screen branching path diagram, vertical scroll within the act.
- **Event view**: narrative illustration + text + choice buttons.
- **Deck/draft modals**: overlay the combat or map view.

No camera transitions beyond simple fades. Game is effectively a collection of static screens.

## Controls

### Desktop

- **Mouse**: primary input. Click card → drag to target (for targeted attacks) or drop in play zone (for non-targeted).
- **Right-click / hover**: inspect card or enemy.
- **Number keys 1–5**: quick-play cards from hand.
- **E**: end turn.
- **M**: view map.
- **D**: view deck.

### Mobile (Unity port)

- **Tap card**: preview.
- **Tap-and-drag**: play card (drag to enemy for targeted, flick up for non-targeted).
- **Long-press**: inspect.
- **Pinch**: zoom map.

## Card UX

- **Playable cards** glow gold; cards you can't afford (energy) are greyed out.
- **Target-required cards** force a line-draw from hand to enemy on drag.
- **Enemy intents** are icons above each enemy: attack value, defend, buff, debuff, unknown. Update every turn before the player's next turn.
- **Card tooltips** on hover show all keyword definitions (vulnerable, weak, exhaust, ethereal, etc.).

## Feedback

- **Screen shake** on big hits.
- **Damage numbers** pop from targets in scaled text.
- **Combat log** (toggleable) shows every damage/status event.
- **Death animation**: enemy shrinks + dissolves; player death ends the run.

## Juice Scaling

Slay the Spire is famously restrained visually — every effect reads clearly because the art is flat and the animation is minimal. Don't over-juice a deckbuilder; clarity > spectacle.
