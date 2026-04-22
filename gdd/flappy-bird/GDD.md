---
id: flappy-bird
title: Flappy Bird
version: 0.1.0
description: Dong Nguyen's 2013 one-button mobile game — tap to flap a bird between green pipes, miss once and die. Viral phenomenon, pulled from stores at peak, progenitor of the "hyper-casual" genre.
tags: [mobile, casual, arcade, one-button, hyper-casual, viral, indie]
engines: [cocos2d, unity]
---

# Flappy Bird

Released May 24, 2013 by Dong Nguyen (.GEARS Studios, Hanoi) on iOS. Tap the screen to make the bird flap upward; gravity pulls it down. Navigate through vertical gaps between green pipes. Hit a pipe or the ground: instant death. Score one point per pipe passed. No continues, no power-ups, no progression.

Flappy Bird went viral in January 2014, vaulting to #1 on the US iOS App Store despite having been available for 8 months with minimal attention. Nguyen reported ~$50,000/day in ad revenue at peak. On February 9, 2014, Nguyen pulled the game from both iOS and Android stores, citing guilt over its addictiveness and the "problem" it had become. Phones with the game pre-installed sold for thousands of dollars on eBay.

The game launched the "hyper-casual" genre: minimal mechanics, punishing difficulty, ad-revenue monetization, and the ragequit-then-replay compulsion loop. Dozens of clones (Flappy Bird Family, Splashy Fish, Ironpants, etc.) flooded app stores within weeks.

## Snapshot

| Field | Value |
|---|---|
| Designer | Dong Nguyen |
| Studio | .GEARS Studios (Hanoi, Vietnam) |
| Engine | Cocos2d-x (reportedly; reconstructions often use Cocos2d / Unity / HTML5) |
| Release | 2013-05-24 (iOS), 2014-01-30 (Android) |
| Removed | 2014-02-09 |
| Platform | iOS (initial), Android (later) |
| Genre | Arcade / side-scroller / hyper-casual |
| Perspective | 2D side-on |
| Players | 1 |
| Monetization | Ad banner (later interstitial) |
| Development time | ~2-3 days, per interviews |
| Peak revenue | ~$50,000/day (reported) |
| Typical run length | 5-30 seconds |

## Design Pillars

1. **One Input** — tap anywhere. That's the entire control vocabulary.
2. **Instant Death** — no HP, no shield, no margin. One hit = restart.
3. **Infinite Runner** — no levels, no boss, no end. Just the next pipe.
4. **Punishing Curve** — difficulty plateaus quickly; skill progression is all player.
5. **Recognizable Art** — Mario-pipes-green, yellow bird, pixelated NES palette. Nostalgic + instantly parseable.

## The Game Loop

1. Tap to start.
2. Bird flaps; starts falling.
3. Tap to flap upward; release to fall.
4. Approach pipe pair (upper + lower, with vertical gap).
5. Navigate bird through gap.
6. +1 point when bird's X passes pipe's X.
7. Repeat — pipes scroll endlessly from right to left.
8. Collision with pipe / ground / ceiling → death animation → game over screen.
9. Display final score, best score, medal.
10. Tap to restart.

## Physics

### Gravity

- Constant downward acceleration.
- In most reconstructions: ~1600 units/sec² (scales with screen).
- Feels heavier than Super Mario jumps; makes each tap meaningful.

### Flap (Jump Impulse)

- Sets vertical velocity to fixed upward value (e.g., -450 units/sec).
- Overrides current velocity — you don't add to it; you replace it.
- Cap on upward velocity (max Y speed).

### Rotation

- Bird rotates based on vertical velocity:
  - Velocity upward → rotate nose up (~-30°).
  - Velocity downward → rotate nose down (up to ~70°).
- Rotation is smoothed over frames for visual polish.

### Horizontal

- Bird's X is fixed on screen (camera follows); world scrolls left.
- Scroll speed constant.

## Pipes

### Placement

- Spawned off-screen right; travel left at constant speed.
- Spawn interval: every ~1.5 seconds of game time.
- Gap Y-position randomized within safe range.
- Gap size: ~120 px on standard iPhone resolution (unchanging).
- Upper pipe: spawns at random Y from top; extends down.
- Lower pipe: bottom, with gap-size distance between them.

### Despawn

- Once off-screen left, pipes despawn (garbage collect).

### Scoring

- Each pipe has an "isPassed" flag.
- When bird's X > pipe's right edge and not yet scored: score +1.

## Collision

### Hitbox Types

- Bird: AABB (or circle) around sprite.
- Pipe: two AABBs (upper and lower).
- Ground: AABB at screen bottom.
- Ceiling: implicit (player can't fly off top; some variants allow).

### Resolution

- No physics resolution — collision = game over instantly.
- Death animation plays: bird tumbles down, hits ground, bounces, settles.
- Input disabled during death animation.

## Scoring

| Score | Medal |
|---|---|
| 10+ | Bronze |
| 20+ | Silver |
| 30+ | Gold |
| 40+ | Platinum |

No points beyond display; game doesn't end at any score. Players chase personal bests.

## Visual Design

### Bird

- 3-frame flap animation sprite (wings up, middle, down).
- Yellow base color (some versions: red, blue).
- 16×16 (approximate original pixel size on iPhone 4 / 5).

### Pipes

- Green pipe sprite with highlight edge.
- Visually identical to Super Mario pipes (visual nod, allegedly copyright-adjacent).
- Variable height per pipe pair.

### Background

- Parallax layers:
  - Sky: solid blue.
  - Clouds / buildings: slow-scroll.
  - Ground: fast-scroll (matches pipe scroll).
- Day / night variant (random at game start): blue sky vs dark purple.

### UI

- Score: large centered digits (Nintendo-NES-style font).
- Tap to start: title + "Tap to play" prompt.
- Game Over: score + best + medal + "OK" button + share.

## Audio

### Sounds

- **Flap (sfx_wing)**: soft whoosh on tap.
- **Score (sfx_point)**: chime on passing pipe.
- **Hit (sfx_hit)**: thud on pipe/ground collision.
- **Die (sfx_die)**: death jingle.
- **Swoosh (sfx_swoosh)**: menu transition.

No music. Silence + SFX.

## Difficulty

- No adjustment; single fixed difficulty for all players.
- Skill curve is purely player improvement.
- First pipe: ~15-25% of new players fail.
- Score of 10: requires consistent practice; most new players hit this after 10-50 attempts.
- Score of 40+ (platinum): elite-tier; represents hours of practice.

## Why It Went Viral

### Theories

- **Shareability**: quick runs, screenshot-worthy scores, "beat my score?" social dynamic.
- **Ragequit mechanic**: failure fast → restart instantly → just-one-more.
- **Ad monetization**: free-to-play + banner ads = zero friction to try.
- **Mysterious timing**: no marketing; unclear why it spiked in January 2014. Possibly influencer pickup (PewDiePie, reaction videos).
- **Nostalgic aesthetics**: NES-style visuals tap 80s/90s gaming.

### Meta-factors

- App Store algorithm boost once it trended.
- Novelty: mobile games were either CandyCrush-style or Angry-Birds-style; Flappy Bird was uniquely punishing.
- Anti-design: every mobile UX convention violated — no tutorial, no difficulty ramp, no rewards.

## Removal

- Feb 9, 2014: Dong Nguyen tweets he's taking the game down.
- Reason cited: "The game was too addictive; it became a problem."
- Game removed from App Store + Google Play.
- Not deleted from devices that had it; phones with it installed sold $500-$1000+ on eBay.
- Clones filled the vacuum within hours.

## Clones + Descendants

### Immediate Clones (Feb-Mar 2014)

- **Splashy Fish**: Flappy Bird with fish art.
- **Ironpants**: Jetpack equivalent.
- **Clumsy Bird**: Literal reskin.
- **Fly Birdie**: Identical mechanics.
- Hundreds more; App Store approval process briefly flooded.

### Spiritual Successors

- **Flappy Bird Family** (Aug 2014, Nguyen): Amazon Fire TV only; coop + tournament modes.
- **Swing Copters** (Aug 2014, Nguyen): Horizontal Flappy Bird; different input.
- **Geometry Dash** (2013, preceded): one-tap platformer; inspired by same space.
- **Crossy Road** (2014): another one-input hyper-casual.

### Genre Legacy

- "Hyper-casual" as a recognized mobile genre emerges 2014-2015.
- Pioneering studios: Voodoo, Ketchapp, SayGames.
- Characterized: one-input mechanics, instant death / restart, heavy ad monetization, quick-to-prototype (2-3 day dev cycle).

## Business Model

### Original

- Free to download.
- Single banner ad at top of screen.
- No in-app purchases.
- Pure ad impressions = revenue.

### At Peak

- Claimed $50,000/day (Nguyen, interviews).
- Scaled to tens of millions of downloads.
- Revenue primarily from game-over screen (ad views per attempt).

### Cynical Analysis

- Restart cycle = high ad views per minute of play.
- Punishing difficulty = more restarts = more ads.
- Monetization unintentionally aligned with addictive feedback loop.

## Cultural Impact

- Spawned "hyper-casual" genre categorization.
- Referenced in media (South Park, etc.).
- Academic studies on mobile addiction cite Flappy Bird.
- Inspired essays on minimal design (Eric Tivel, Eric Barone).
- "Tap to flap" mechanic = permanent vocabulary item in game design.

## Design Philosophy

### Minimalism as Core

One input, one verb, one failure state. Unlike Candy Crush (multiple piece types, multiple match mechanics, progression, boosters), Flappy Bird is a single tuned interaction.

### Punishment as Hook

Instant death feels unfair — until you learn. Skill ceiling is steep; this drives retention. Forgiving games have no "I can do better next time" hook.

### No Progression

No unlocks, no new pipes, no bosses. What progresses is player skill. This is zen gameplay: the challenge is you vs. you.

### Visual Theft / Homage

Green pipes are overt Mario references; copyright status contested but never legally resolved. This is both nostalgic appeal and a risk; Nintendo never sued.

### Speed of Development

Dong reportedly built this in 2-3 days. The design is so spare that iteration was fast; the tuning (gravity, flap impulse, pipe gap, speed) was everything. This is a lesson in "the tuning IS the design."

### Pocket Game

Runs are 5-30 seconds. Perfect for elevator, bus, bathroom. Mobile-native design respecting real context of play.

## Tuning Parameters

Canonical values (approximate, from reverse-engineering):

| Parameter | Value |
|---|---|
| Gravity | 1600 px/s² (or similar; varies by screen) |
| Flap velocity | -450 px/s |
| Max fall velocity | 800 px/s |
| Pipe gap size | 110-130 px |
| Pipe spawn interval | 1.5s |
| World scroll speed | 150 px/s |
| Bird X position | 1/3 screen width |
| Bird rotation | -20° up, up to 90° down |

These produce "the feel." Tweaks of ±10% produce noticeably worse games.

## Technical Notes

- Reportedly built in Cocos2d-x (some sources: Cocos2d-iPhone).
- Native iOS (Objective-C; no Swift yet widely used in 2013).
- Android port: Cocos2d / Java bridge.
- ~1-2 MB total app size.
- Runs at 60 FPS on iPhone 4+.

## Reconstruction Complexity

- **Beginner**: 100-200 lines in any modern engine. Pong-level simplicity.
- **Weekend project**: Unity / Godot / Phaser / Cocos2d-x.
- **Polish**: day/night cycle, smoothed bird rotation, particle feathers, proper audio timing.

## Reversed Engineering

- Sprite sheets extracted and published within days.
- Physics tuning reverse-engineered; canonical values documented above.
- Dozens of open-source recreations on GitHub.

## References

- [3Cs Spec](references/3c-spec.md)
- [Design Analysis](references/design-analysis.md)

## Engine Overlays

- [Cocos2d](engines/cocos2d/GDD.md)
- [Unity](engines/unity/GDD.md)
