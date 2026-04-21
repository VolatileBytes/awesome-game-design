# Juice & Game Feel — Candy Crush Saga

Candy Crush's juice defined the match-3 genre's feel. While newer games (Royal Match) push further, the Candy Crush language of "pop!", "Sweet!", and "Sugar Crush!" is the iconic benchmark.

## Principles

- **Every interaction has response**: swap, match, cascade — all audible + visible
- **Positive reinforcement**: failure is soft; success is celebrated
- **Escalation**: matches → combos → Sugar Crush finale; feedback intensifies
- **Mr. Toffee's voice**: iconic narrator; owns the brand

## The Swap

### Visual

- Candies slide smoothly (~120ms, ease-out)
- Slight trailing sparkle
- Invalid: 150ms bounce-back with "nope" shake

### Audio

- Whoosh during slide
- Click on lock
- Invalid: soft "uh-uh" buzz

### Haptic

- Light tap on swap lock

## The Match

### Visual

- **Bounce up** (~250ms) — anticipation
- **Explode** in color-matched particle burst
- **+10 / +20** score popup rises from match position
- Nearby candies shake in sympathy

### Audio

- Candy pop: pitched to match piece type
- **Ascending scale** per cascade: C, D, E, F, G...
- Cascade 5+: topaz chime finale

### Haptic

- Light per match
- Medium per match-4
- Heavier per match-5 / combo

## Cascades

### Visual

- Candies fall with gravity + squash-on-landing
- New candies enter with "plop"
- Chain popup: "Sweet!" → "Tasty!" → "Delicious!" → "Divine!" → "Sugar Crush!"

### Audio

- Cascading pitch builds as chain extends
- Crowd "ooh" background layer on 3+ chain

## Special Candy Creation

### Striped Candy

- Match-4: pieces converge, spin, transform with **directional stripe sparkle**
- Audio: "Zing!"
- Haptic: medium pulse

### Wrapped Candy

- L/T match: pieces pulse, wrap in gold foil
- Audio: "Wrap!"
- Haptic: medium pulse

### Color Bomb

- Match-5: pieces spiral inward, merge into iridescent orb
- Audio: "Bzzt!" (electrical)
- **Slow-mo**: 300ms for drama
- Haptic: heavy pulse

## Special Candy Fire

### Striped

- Lightning-bolt streak across row or column
- Each piece it hits: explosion particle
- Audio: "Whoosh!" + row of "pops"

### Wrapped

- 3×3 flash explosion → pieces fall → **second** 3×3 explosion (2-stage)
- Audio: "Boom!" + "Boom!" (paired)
- Haptic: heavy double-pulse

### Color Bomb

- Lightning streams out to every candy of chosen color
- Each target sparks + pops
- Audio: building crescendo + multi-pop

## Combos (Two Specials)

### Visual

- 500ms charge-up
- Screen flash (color-matched)
- Giant explosion with debris + particles
- Camera shake (stronger per tier)

### Audio

- Orchestra hit / crescendo
- Chained "pop" layer after

### Haptic

- Long 200ms pulse pattern

## The Sugar Crush (Level Complete Finale)

This is Candy Crush's signature moment:

### Visual

- All remaining moves **transform into Striped Candies**
- Auto-fire in sequence, 1 per ~200ms
- Screen lights up with streaking lightning
- Score rockets up
- "Sugar Crush!" text banner zooms in
- Confetti rain

### Audio

- **"Sugar Crush!"** voice (iconic Mr. Toffee)
- Triumphant brass crescendo
- Coin / star collection rising-pitch cascade

### Haptic

- Rhythmic pulses per auto-fire

### Design Intent

- Transforms "unused moves = missed opportunity" into "every unused move = bonus celebration"
- Makes 3-star tear-ups satisfying
- Key motivator for efficient play (leave more moves = bigger Sugar Crush)

## Iconic Voice Lines (Mr. Toffee)

- **"Sweet!"** — match-4 or combo
- **"Tasty!"** — 2-cascade chain
- **"Delicious!"** — 3-cascade chain
- **"Divine!"** — 4+ cascade
- **"Sugar Crush!"** — level complete finale

These voice lines are cultural — the game's identity.

## The Fail Moment

### Visual

- "Out of Moves" text fades in gently (not harsh)
- Mr. Toffee on-screen "aww" expression
- "+5 Moves for 900 gold?" offer appears

### Audio

- Soft descending note (not a buzzer)
- Mr. Toffee "Oh dear..." (sad)
- Music continues; no harsh cut

### Haptic

- Single soft buzz

### Design Intent

- Failure feels **disappointing**, not **punishing**
- Encourages retry, not quit

## Character Reactions

- **Tiffi** (main character): cheers on match, sad on fail, hops around on level complete
- **Mr. Toffee**: provides voice narration throughout
- **Boss characters** (Jelly Queen, Yeti): taunt or react based on progress
- **Pet interactions** (modern Candy Crush): pet reacts to gameplay

## Score Popups

- **"+60"** floating text on every match
- **"x2"**, **"x3"** multipliers in gold for cascades
- **"Sweet!"** banners at combo events
- Springs up with ease-out-back (300ms)

## Audio Architecture

- **Background music**: upbeat candy factory theme, ~2-minute loops
- **SFX layers**: pop, crunch, sparkle, coin
- **Voice**: Mr. Toffee voice pool (50+ lines)
- **Music mutes on iOS**: respects other audio (Spotify, etc.)

## Sound Design Principles

- **Every event under 200ms**: fast feedback
- **Musical coherence**: SFX harmonize with background music key
- **Distinct per piece type**: each candy color has signature pop
- **Ascending patterns**: chains build pitch

## Color & Light

- Bright, high-saturation palette
- Candies always **readable at a glance** (shape + color)
- Background **changes per chapter** (Candy Town warm, Bubblegum Bridge cool)
- Highlight glow on just-matched pieces (50ms before explosion)

## Performance

- All effects pooled (particles, popups, sound effects)
- 60fps target; low-end devices get LOD effects
- Background music streams (not fully loaded)

## Anti-Patterns

- **Over-juice**: if every match shakes the screen, big moments lose impact
- **Juice without audio**: visual alone feels hollow
- **Generic juice**: same sound per candy type = loss of personality
- **Juice in menus**: menus are for decisions, not celebration
- **Blocking juice**: don't pause gameplay >500ms for effects
