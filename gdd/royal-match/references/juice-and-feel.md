# Juice and Game Feel

"Juice" is the invisible-but-critical polish that turns a working puzzle into a compulsive one. Royal Match is widely cited as one of the most "juicy" match-3 games — this doc is the playbook.

## What "Juice" Means

Visual, audio, and haptic feedback that makes every action **feel** weighty, rewarding, responsive. Every tap/swipe should produce:
- Visual response within 1 frame
- Audio within 50ms
- Haptic feedback within 100ms
- Clear cause-and-effect animation

## The Match-3 Sensory Loop

### The Swap

**Visuals**:
- Pieces slide smoothly (120ms) with ease-out
- Subtle glow on the two pieces while moving
- If invalid swap, pieces bounce back with a small "nope" shake

**Audio**:
- "Whoosh" during slide
- Soft "click" when they lock

**Haptic**:
- Tiny tick on swap start

### The Match

**Visuals**:
- Matched pieces **bounce up slightly** (250ms)
- Then **explode** in a burst of small particles matching their color
- A tiny **"+10"** or "Match!" pops up
- Pieces above **shake slightly** (anticipating falling)

**Audio**:
- "Pop!" — matches the piece type (cake sound, jar sound)
- Ascending pitch per chained match: 1st match C, 2nd D, 3rd E, etc.

**Haptic**:
- Short vibration (10ms) per match
- Longer (30ms) for match-4 or match-5

### The Cascade (falling pieces)

**Visuals**:
- Pieces fall with gravity + slight bounce on land
- New pieces enter with a little "plop"
- If a new match chains, the cycle repeats louder

**Audio**:
- Cascading notes as each new match triggers
- Scale ascends: C, D, E, F, G... until 5 chains → topaz chime

### The Power-Up Creation

**Visuals**:
- Rocket: pieces converge + spin + transform into a rocket sprite with a glow
- Bomb: pieces merge + briefly **pulse** + transform into bomb
- Lightball: pieces spiral + transform into a shiny swirling orb
- **Slow-mo** for 300ms during transformation (dramatic)

**Audio**:
- Power-up specific stinger: "Zzzzhoom!" for rocket, "Whoom!" for bomb, "Ching!" for lightball

**Haptic**:
- Medium pulse when power-up created

### The Power-Up Fire

**Visuals**:
- **Rocket**: shoots across in a lightning-bolt streak with explosion particles
- **Bomb**: central flash + radial explosion + screen shake
- **Lightball**: swirling energy across the whole grid consuming color

**Audio**:
- Each has a distinct "fire" sound layered with collision impacts

**Haptic**:
- Strong pulse on fire
- Short pulses per piece destroyed (for bomb)

### The Combo

When two power-ups merge (Rocket + Bomb, Bomb + Bomb, Rocket + Rocket):

**Visuals**:
- 500ms charge-up with particle buildup
- Big release: often screen-wide effect
- Camera shake (stronger than standard)
- Screen flash (color flash)

**Audio**:
- Orchestra hit + escalated stinger
- Chained cascade audio after

**Haptic**:
- Long vibration (200ms) with pulse pattern

## The Level Complete Moment

**Visuals**:
- All remaining moves transform into Rockets (auto-fire)
- Rockets chain-fire across the grid, big cascading explosions
- Big "LEVEL COMPLETE!" text zooms in with sparkles
- Stars + coins shoot up from the bottom
- King Robert (or character) dances briefly
- Palace in background has a small sparkle

**Audio**:
- Triumphant orchestra hit
- Coin collection sounds (rising pitch)
- Crowd cheer (for big wins)

## Character Reactions

- **King Robert** watches from the corner
- **Idle**: occasional breathing, blink
- **Match-4**: raise eyebrow, nod
- **Big combo**: grin, cheer
- **Level complete**: big clap + throw hat
- **Level fail**: sad face, sigh animation

Character presence **personalizes** abstract game events.

## The Fail Moment

Juice applies to failure too:

**Visuals**:
- "Out of Moves" text fades in gently
- King Robert's sad animation (brief)
- Offer: "+5 moves for 900 coins" button prominent

**Audio**:
- Soft descending note (not harsh)
- No music interrupt — just the failure sound over ambient

**Haptic**:
- One soft buzz

**Design goal**: failure must feel **disappointing enough to want to try again** but not **punishing enough to quit**.

## Score Popups

Every match/event has a floating popup:
- Large font, bold color matching the pieces
- Springs up with ease-out-back tween (300ms)
- Multipliers appear as "x3", "x5" in gold for combos

## Color & Light

- Warm, saturated palette (never drab)
- Pieces are **readable at a glance** (color + shape)
- Backgrounds **change per chapter** (gardens have green tint, kitchens are warm yellow)
- Highlight on just-matched pieces for 50ms before explode

## The "Sweet!" Moments

Designed moments that reward the player:

- **"Sweet!"** popup on 3-in-a-row
- **"Delicious!"** on 4+
- **"Divine!"** on cascading chain
- **"Royal!"** on massive combo

Each feels like a **micro-celebration**.

## Sound Design Principles

- **Many layers, brief**: a match sound is ~200ms
- **Ascending patterns**: reward chain builds pitch
- **Musical coherence**: all sound effects harmonize with the background music key
- **Distinct instruments** per event type (piano for normal match, brass for combo, strings for level-complete)

## Music

- **Puzzle music**: upbeat, medium-tempo, varied per chapter
- **Palace music**: calm, exploratory
- **Boss levels**: tense, dramatic
- **Level complete**: victory fanfare

Music is muted on iPhone when other audio playing (respects user's media).

## Haptic Design

iOS (Android similar):
- **Light**: piece swap, match
- **Medium**: power-up creation, combo
- **Heavy**: level complete, failure (different pattern)

Haptic is **off-able** for users who don't want it; but most leave it on.

## Performance Considerations

- All juice effects pooled (GameObjects + particles)
- Frame-rate target: 60 FPS on all animations
- LOD: simpler animations on low-end devices

## Testing Juice

- **Iterate** with quick build-and-test cycles
- **Record video** and replay in slow-mo to verify timing
- **A/B test**: reduce juice by 50%, measure engagement — usually engagement drops noticeably
- **Playtest**: watch players; if they smile when matching, juice is good

## The Juice Budget

Don't juice everything equally:
- **Base match**: moderate juice (happens hundreds of times)
- **Combo**: high juice (rare, exciting)
- **Level complete**: very high juice (climactic moment)
- **Failure**: medium-low juice (we don't want to celebrate it)

## Anti-Patterns

- **Over-juice**: if every match is screen-shaking, the big moments lose impact
- **Juice without audio**: visual juice without sound feels hollow
- **Generic juice**: reused effects per piece type lose personality
- **Juice in menus**: menus are for decisions, not celebration
- **Slow juice blocking gameplay**: long animations that pause gameplay (over 500ms) break flow
