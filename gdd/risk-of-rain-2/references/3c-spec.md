# 3C Spec — Risk of Rain 2

## Character

Third-person 3D. Survivor-specific height and rig. Shared base controller:

- **Run speed**: base 7 m/s (scales with items like Energy Drink).
- **Jump**: 1.5m height, 2 air jumps if Hopoo Feather item stacked.
- **Sprint**: hold Shift/button — locks primary attack but adds ~46% speed.
- **Utility skill**: dodge/blink/dash per survivor.
- **Ground slam**: optional item (Razor Wire).

Movement is survivor-differentiated:
- **Commando**: standard run + rolls.
- **Loader**: grapple swing — hugely different kinematics.
- **Artificer**: fly via jetpack (Flamethrower skill is flight).
- **Mercenary**: sword dashes = mobility.

## Camera

Third-person **over-the-shoulder** with adjustable side.
- Default FOV: 60 (adjustable up to 120).
- Camera follows player with smoothing lag.
- Aim ray comes from camera, not player (important for projectile alignment).
- Vertical tilt clamp: ±85°.
- On heavy hit: tiny camera kick (restrained compared to Call of Duty).

## Controls

### Keyboard + Mouse (primary)

| Input | Action |
|---|---|
| WASD | Move |
| Mouse | Look / aim |
| Shift | Sprint |
| Space | Jump |
| Left click | Primary attack (weapon 1) |
| Right click | Secondary attack (weapon 2) |
| Q | Utility (dash/blink) |
| R | Special |
| E | Interact / pick up |
| Tab | Inventory overview |
| 1..4 | Equipment / use |
| M | Scoreboard |
| G | Ping system |

### Gamepad

| Input | Action |
|---|---|
| Left stick | Move |
| Right stick | Look |
| RT | Primary |
| LT | Secondary |
| RB | Utility |
| LB | Special |
| A | Jump |
| B | Sprint (toggle) |
| X | Interact |
| Y | Equipment |
| D-pad | Scoreboard / Ping |

## Feel Rules

1. **Movement is fun on its own**: traversing a stage without fighting should feel good. Double jumps, sprints, grapples are satisfying.
2. **Items change movement**: Hopoo Feather (jump), Energy Drink (sprint speed), Wax Quail (jump-sprint fling). These shape the run's feel more than weapons do.
3. **Attacks interruptible by movement**: rare in shooters. RoR2 lets you cancel most animations into jump/sprint.
4. **Hitscan dominant but projectiles exist**: Commando is hitscan, Artificer is slow projectile. Mixed.
5. **No recoil**: no weapon kick / spray pattern. Skill is positioning + build, not micro-aim.
6. **Audio spatialization key**: enemy cues (Greater Wisp charging, Imp leader warping) need crystal-clear spatial audio.

## Unique Traversal Mechanics

- **Huntress Blink**: 3-charge teleport.
- **Loader Grapple**: pull self to point + knockback.
- **Merc Eviscerate**: dash-through multiple enemies.
- **Captain Orbital Probe**: no traversal but tactical tool.
- **Acrid Leap**: medium jump with damage on landing.

Each survivor's movement skill defines their stage clear rhythm.

## Hit Feedback

- Target reticle turns red on hit.
- Kill reticle: brief white flash.
- Damage numbers float from target (toggleable).
- On crit: golden number + higher-pitched sfx.
- On kill: crunchy sound layered over enemy death.
- On low HP: red vignette + heartbeat audio.

## Platform Notes

- **PC primary**: keyboard + mouse is best for Artificer / Railgunner precision.
- **Console**: aim-assist helps; most viable.
- **Mobile (hypothetical)**: would need twin-stick with aim-assist; potentially simplify survivor count.

## Accessibility

- **Colorblind modes**: 3 palettes (critical for item color tiers).
- **Reduced motion**: disable camera shake, flash reductions.
- **Autosprint**: toggle.
- **Adjustable text size**: UI scaling 80–120%.
