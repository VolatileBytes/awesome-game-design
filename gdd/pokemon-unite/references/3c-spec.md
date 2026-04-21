# 3Cs — Character, Camera, Controls

## Character — Your Pokémon

The "character" is whichever Pokémon you selected. Each:
- Distinct visuals + animations (idle, run, basic-attack, move 1, move 2, Unite cinematic)
- Signature voice/cry
- Evolution stages visually change the model mid-match
- Holowear skins alter appearance only (never stats)

### Character Feel

- Each Pokémon has a **signature movement speed** + **attack range**
- **Attack cadence** differs: Cinderace is rapid-fire; Snorlax is slow but meaty
- **Move rhythm**: each move has a recognizable cast animation + satisfying hit feedback

### Evolution Moments

- When a Pokémon evolves (Charmander → Charmeleon → Charizard), a **short animation** plays + the model swaps
- Match pauses nobody; you're still in the fight
- Audio stinger + particle burst = reward moment

## Camera — 3rd-person top-down MOBA

- **Camera angle**: ~45-degree top-down
- **Follow**: locks to player Pokémon
- **Pan**: limited manual panning via right-screen drag (optional — many don't)
- **Zoom**: fixed by Pokémon (ranged Pokémon get slightly wider FOV)

### Minimap

- Top-right corner
- Shows: goals, wild Pokémon alive/dead, allies, visible enemies
- **Pings** (smart pings): "Attack!", "Retreat!", "Gathering here!"
- Tappable to focus camera briefly

### Dramatic Camera Moments

- **Unite Move cast**: small cinematic — camera briefly focuses on you, bloom + slow-mo
- **Boss KO**: camera pans to the fallen boss + buff aura
- **Zapdos steal**: epic zoom + shake when Zapdos is stolen from the enemy team
- **Match end**: winner team poses in arena

## Controls — Mobile-First Dual Thumb

### Left Thumb (Movement)

- **Virtual stick** anchored bottom-left
- 360° analog
- Tap and drag to move
- Optional auto-aim toggle

### Right Thumb (Combat)

- **Basic attack button**: tap for nearest target; hold for manual aim
- **Move 1 button** (level 4/5): tap for auto-target; hold for directional aim
- **Move 2 button** (level 6/7): same as Move 1
- **Unite Move button** (level 9): long-cooldown super; hold-release fires
- **Battle Item button**: active consumable
- **Score/Dunk button**: appears when you're in range of an enemy goal

### Smart Aim

- Move buttons default to **auto-target** nearest enemy
- **Hold** a move button to switch to manual aim (directional cone)
- Accessibility: pure-auto and pure-manual modes both supported

### Quick Chat / Pings

- Ping radial: emits smart pings to team (Help, On My Way, Retreat, Gather)
- Voice emote: Pokémon cry with an emote animation

## UX

### In-Match HUD

- **Score**: both teams' current score at top
- **Match timer**: top-center
- **Personal status**: HP + XP bar + move cooldowns at bottom
- **Energy count**: center-bottom (how much you're carrying)
- **Mini-map**: top-right
- **Objective timers**: when big bosses spawn (Drednaw at 7:00, Zapdos at 2:00 remaining)

### Pre-Match Screen

- Pick Pokémon + Held Items + Battle Item
- Team composition overview
- Roles displayed (so you know if you have a Defender, Supporter, etc.)

### End-of-Match Screen

- MVP: single best-performing player gets a medal
- Per-player stats: kills, assists, damage dealt, damage taken, scoring
- Reward screen: XP, currency, chests

## Accessibility

- **Colorblind-safe**: teams have text labels + icons
- **Font size** adjustable
- **Auto-aim** default for new players; toggle to manual
- **Audio cues** for key events: objective spawn, scoring, Unite ready
