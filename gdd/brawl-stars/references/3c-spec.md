# 3Cs Spec

## Camera

- **Projection:** orthographic-ish perspective with a slight tilt (3/4). Looks "painted" top-down, but you can see brawler faces.
- **Zoom:** fixed. Landscape orientation. Arena fits on screen with a small vertical pan as the camera follows your brawler.
- **Follow:** soft-follow on your brawler with a small dead-zone. The camera offsets toward your aim direction so you can see slightly farther in the direction you're firing — this is a signature feel.
- **Shake:** on mega-hits (exploding safes, Super ults, boss deaths). Mild, not per-hit.
- **Match-start cam:** a 1–2 second pan over the arena at match start, then settles on your brawler.
- **Victory cam:** slow zoom on the winning team, confetti, Trophy Road gains.

## Player ("Character")

Your brawler is an on-screen character, distinct from most mobile games.
- Attached HUD: HP bar above the brawler, Super-charge ring around the brawler's portrait, ammo pips around the fire button
- Visual distinction is critical: every brawler has a **silhouette-level unique look** (shape, colour, accessory)
- Brawlers have short voice/sound callouts ("Oh yeah!") to emphasise identity

## Controls

Dual virtual sticks, with several affordances for mobile.

| Input (left thumb) | Action |
|---|---|
| Left virtual stick | Move |

| Input (right thumb) | Action |
|---|---|
| **Tap** fire button | Auto-aim shot at nearest visible enemy |
| **Hold-drag** fire button | Manual aim — a targeting line/arc shows the projectile trajectory; release to fire |
| Tap **Super** button | Auto-aim or manual-aim Super (same rules) |
| Tap **Gadget** button | Gadget (usually non-directional; uses cooldown) |
| Tap **Hypercharge** button | Activate Hypercharge (when available) |

### Auto-Aim Vs. Manual Aim

This is the most important UX decision in the entire game.

- **Auto-aim** fires at the nearest enemy in the player's forward arc. It is forgiving: a fast tap releases a decent shot.
- **Manual aim** shows a trajectory indicator; fire angle is continuous, and the player can aim past walls (for artillery) or lead a moving target (for snipers).

Both are legitimate. Competitive players use manual. Casual players use auto. The game never forces one.

### Fire Arc Indicator

When manual-aiming:
- **Direct attacks**: a straight line up to the weapon's max range
- **Arc attacks** (grenade, bombs): a parabola ending at the target point
- **Spread attacks** (shotgun): a cone
- **Curved / chain attacks**: their unique projectile shape

The indicator is **one of the most-polished UX elements** in the game. Without it, manual aim is unplayable.

## Movement

- **8-directional from keyboard**, **full-analog from stick**
- **Movement speed** is a brawler stat (default ~2.4 tiles/sec, variable per brawler)
- **No sprint / dash** button on base brawlers — dashes are integrated into Supers or gadgets
- **Collisions** against walls and destructible terrain
- **Bushes** hide the brawler visually; enemies not inside can't see you

## HUD

- **Top center**: score / timer / team composition
- **Left side**: mini-map (tiny, optional — shows teammates, objectives)
- **Bottom left**: movement stick
- **Bottom right**: fire button, Super, Gadget (+ Hypercharge if available)
- **Top-left player**: HP + Super-charge ring + brawler portrait
- **Above brawlers**: name + HP bar; ammo pips visible near your own brawler

## Feel Targets

- **Tap-to-fire to projectile visible**: < 50 ms
- **Super charge fill animation**: smooth per damage event, no big jumps
- **Hit feedback**: small shake on your brawler when you take damage, audio cue, HP bar flicker
- **Death**: 1-second fade, respawn countdown timer visible
- **Respawn**: 3 seconds default; clear spawn-protection visual (glowing ring)

## Anti-patterns

- **Making manual aim harder than auto-aim**. If auto-aim is always stronger, manual is dead content.
- **Cluttered HUD**. On mobile, every extra icon eats thumb space. Start minimal.
- **Tiny fire button**. The right-side action area must be thumb-sized; ~15% of screen width minimum.
- **Hidden cooldowns**. Gadget and Super must always show their charge/cooldown state clearly.
- **Sound-only cues for critical events**. Many players mute mobile games — every audio cue must have a visual equivalent.
