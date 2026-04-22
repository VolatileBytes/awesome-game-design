# 3C Spec — Helldivers 2

## Character

Third-person-over-the-shoulder. The Helldiver is visible:
- Armored trooper, ~2m tall, heavy silhouette.
- Cape customizable (player-selected).
- Helmet + armor + cape slots cosmetic; armor also functional (light/medium/heavy + passive perk).
- Primary weapon held two-handed; secondary holstered.

Armor types:
- **Light (50-80 armor)**: fast stamina regen, fast sprint.
- **Medium (100-125)**: balanced.
- **Heavy (150-200)**: slow but tanky; best for extraction holds.

Armor passives: Scout (reduced detection), Servo-Assisted (longer throw), Extra Padding (+armor), Fortified (recoil reduction), Engineering Kit (more grenades), etc.

## Camera

Third-person over-right-shoulder. Camera behaviors:
- **Run**: slight sway, low-shake.
- **Aim down sights (ADS)**: camera snaps to tight view over scope.
- **Sprint**: camera pulls back, FOV widens.
- **Cover crouch**: camera lowers, hero crouches; no cover-snap like Gears.
- **Ragdoll**: you get launched a lot; camera follows body.
- **Reinforcement**: camera follows incoming Hellpod down.
- **Death**: killcam shows killer briefly; then spectator view of squadmates.

FOV: adjustable 55-100 (PC); console fixed 70-80.

Camera shake on: orbital impact, big explosion, bile titan stomp, Hellpod landing.

## Controls

### Controller (primary design target)

Movement:
- **Left stick**: move.
- **Left stick click**: sprint.
- **B / Circle**: dive prone.
- **X / Square**: reload / interact.
- **A / Cross**: jump / vault.

Combat:
- **RT / R2**: fire.
- **LT / L2**: aim down sights.
- **Y / Triangle**: swap to secondary.
- **D-pad**: stratagem code inputs + open stratagem menu.
- **LB / L1**: open stratagem menu (hold) + input stratagem codes.
- **RB / R1**: throw grenade / stratagem ball.
- **Dpad up**: ping.

### Keyboard + Mouse

- **WASD**: move.
- **Shift**: sprint.
- **Ctrl**: crouch / dive-prone (tap/hold).
- **Space**: jump.
- **Left Click**: fire.
- **Right Click**: ADS.
- **R**: reload.
- **E**: interact.
- **G**: grenade.
- **Ctrl-hold**: open stratagem menu; **WASD** types code; **Space**: throw beacon.
- **1-4**: weapon slot.

## Feel Rules

1. **Weight over agility.** Your Helldiver is heavy. Dive-prone has animation; you can't cancel it. Deaths from committing too hard to a dive are common and funny.
2. **Friendly fire is loud.** Bullets that hit allies flash friend-colored hit indicator; the victim's voice clip is a scream or "Helldiver down!"
3. **Ragdolling is a game mechanic.** Getting blown by an explosion is your cue to roll to cover. Ragdoll duration is tuned to be frustrating-then-funny (~2s).
4. **Stratagem input under pressure.** Tapping 8 directional keys while a Hunter leaps at you is the signature feel.
5. **Explosions are huge.** 500kg bomb, railcannon, orbital laser — the game's VFX budget is spent here.

## Input Buffering

- **Stratagem code**: full 8-direction sequence; you can miss-input and must restart.
- **Reload cancel**: available mid-reload via sprint/dive (cancels the action).
- **Weapon swap**: instant at any time.
- **Throw stratagem ball**: can pre-aim while entering code; throw triggered when code completes.

## HUD

Bottom-center: health + stamina + ammo (minimal).
Bottom-left: stratagem icons (with cooldowns).
Top-left: mini-map with ping markers.
Top-right: squad HP bars.
Compass (top edge): direction to objectives.
Stratagem input overlay (center, when active): shows key-by-key progress.

Subtitle captions for VO when enabled.

## Audio

- **Ambient biome** per planet (wind, insects, radio static).
- **Weapon audio**: each primary/secondary/support weapon has a distinct "signature" report.
- **Enemy audio**: Stalker roars (they're invisible), Hunter screeches, Bile Titan footsteps shake the world.
- **Stratagem ETA callouts**: "Stratagem inbound!" "Reinforcement deployed!"
- **Music**: wave-based stingers on enemy density spike and extraction.
- **Voice lines**: cheerful propaganda during lull, panic during wipe.

## Visual Design

- **Propaganda aesthetic**: Starship Troopers-meets-40k.
- **Color-tagged factions**: Terminids orange/green biomes, Automatons grey/red, Illuminate blue energy.
- **Planet biome variety**: jungle, arctic, desert, acid storm — each has weather that affects gameplay (fog obscures bugs; rain reduces fire effectiveness).
- **VFX priority**: explosions, orbital lasers, napalm all get big visible spectacle.

## Accessibility

- Full key rebind.
- Subtitles + caption size options.
- Colorblind modes for friend/enemy hit indicators.
- Stratagem code confirmation sound per key.
- Difficulty scaling via difficulty level.

## Signature Moments

- **Dropping onto a bug**: Hellpod lands on a Charger, instantly killing it; squad cheers.
- **Friendly 500kg bomb**: teammate throws bomb; misremembers toss; kills whole squad. The community named it "Democracy delivered."
- **Last-man extract**: 3 squadmates dead; lone Helldiver holds extraction under wave fire, gets on Pelican at timer 0.
- **Major Order liberation**: 1M+ players hit the global goal; in-game broadcast cheers.

## Feel in One Sentence

Helldivers 2 feels right when an explosion sends you tumbling 20 meters into a rock, and you laugh, crawl up, dive-prone, and call in a Railcannon Strike before the next Bile Titan crests the ridge.
