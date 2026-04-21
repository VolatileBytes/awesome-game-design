# UX Pillars

## 1. Readability Under Chaos

By minute 15 of a run there may be 500+ enemies, 200+ projectiles, and hundreds of damage numbers on screen simultaneously. The player must still be able to answer "am I safe to move left?" in under 0.3 seconds.

### Principles

- **Silhouette first, detail second.** Every enemy type must be recognisable from a 16×16 silhouette. Colour and animation come after.
- **One colour per threat tier.** Normal enemies: muted / desaturated. Elites: saturated warning colour (orange/red). Bosses: unique palette. Projectiles inherit owner colour.
- **Player is always the visual anchor.** The player sprite is the most contrast-y thing on screen. Never blends.
- **Limit visual density per event class.** At most N damage numbers / second globally. Beyond N, accumulate and show a single summary number. N is a tuning knob (start around 40).
- **Don't colour-code information via hue alone.** Shape, size, and motion must also differentiate, for colourblind accessibility.

### Anti-patterns

- Identical enemy sprites with different HP bars → the player can't triage
- Projectiles that blend with enemy sprites → the player can't see what's hitting them
- Damage numbers larger than enemies → obscures the actual danger

## 2. Feedback Per Event

Every meaningful in-world event has a visual and audio cue. Feedback is load-bearing — it is *how* the player learns what their build does without reading the wiki.

### Required feedback

- **Hit connects:** damage number pop, target flash, tiny pause-frame (1–2 frames), small sound
- **Kill:** gem drop animation, kill sound, optional XP +N blip
- **Level-up:** screen darken + pause + card entrance, loud sting
- **Weapon evolution:** screen flash, unique sound, evolved weapon name card overlay
- **Arcana pickup:** screen pulse, arcana art flash, music motif
- **Take damage:** red vignette, i-frame flash on player, thud sound
- **Gold pickup:** small shimmer, soft chime; batch visually if multiple same-frame

### Calibration

- Feedback volume should be **logarithmic** in quantity. The 1st hit gets a full sound; hits 100–200 on the same frame share one sound. Otherwise audio mixes into a wall of noise.
- Feedback should scale **with rarity of event**. A common weapon tick is quiet; a weapon evolution is deafening. The player learns this hierarchy through play.

## 3. Pause-to-Read

The only reading the game demands is during the level-up draft. That draft is a **full pause** — not a slow-time, not a modal overlay on a live game. Three reasons:

1. **The game is chaotic.** The player cannot make a real decision while dodging.
2. **Reading time varies.** New players read the card text. Experienced players glance at the icon. Pause serves both.
3. **It rewards getting hit with breathing room.** Level-ups are tied to XP, which is tied to kills, which are dense — so level-up pauses punctuate the run.

### Card layout rules

- Card **icon** is the primary information carrier. It is centred and large.
- Card **name** is secondary. Bold, large.
- Card **level → level description** is tertiary. Readable but scanned.
- Evolution prerequisites visible **on the card** of the relevant weapon passive, not hidden in a menu.

## 4. Accessibility

The game's visual load is extreme by default. Give the player levers:

- **Damage number density** — off / low / normal / high
- **Screen shake** — off / half / full
- **Flash intensity** — off / reduced / full
- **Colourblind palette swaps** — deuteranopia, protanopia, tritanopia presets; gem and enemy-tier colours are the priority targets
- **Pause-on-focus-loss** — toggleable (some players prefer to have the game run in the background)
- **Remappable controls** — on PC, all inputs remappable

### What not to offer

- **No difficulty slider for the run itself.** The progression is the difficulty curve. Offering "easy/normal/hard" breaks meta balance.
- **No DPS meter** in the HUD. It encourages grinding over playing. Optional post-run stats screen is fine.

## 5. Empty Moments Are Forbidden

The game is loud. That is the contract. Dead air — a second where nothing is happening — is a failure state.

- If spawns thin out, increase density; never let the screen go empty mid-run
- If the player is stationary and nothing is attacking them for >2 seconds, trigger a wave
- Between runs, the meta-shop and character select should still have animation and music — never a flat menu

## 6. Juice Budget

Juice (screen shake, flashes, particles, slow-mo) is not free. Overdoing it is the most common failure mode for this genre.

Budget rules:
- **Normal hits:** 0 shake, 0 flash, 1-frame pause-frame at most
- **Elite hits:** mild shake, mild flash
- **Boss hits:** full shake, screen rumble, pronounced flash
- **Weapon evolution:** once-per-run spectacle, full juice
- **Run end:** full desaturation, drumhit, fade

If every hit feels like an evolution, nothing does.

## 7. Onboarding

The first 3 runs of a new player are the most fragile. They will either understand the loop and continue, or bounce off. UX rules specific to the first-run experience:

- **No tutorial text blocks.** The game teaches through the draft itself — every card has a description, and the first draft is often forced to explain.
- **Guaranteed first weapon evolution by minute 10.** The first run should *show* the evolution mechanic. Weight the draft pool toward the starter weapon's evolution passive.
- **Gold is visible from run 1.** The meta shop is unlocked immediately. The first 100 gold buys a tier-1 passive. The loop is visible from the start.
- **No failure shame.** Death cuts straight to the results screen, which cuts straight to the gold spend. The friction between "I died" and "I'm stronger" is < 5 seconds.
