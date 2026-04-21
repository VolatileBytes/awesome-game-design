# Brawler Design

Brawler design is the engine of the game. Each brawler is a self-contained mini-game. Roster coherence > individual brawler power.

## Anatomy of a Brawler

| Component | Function |
|---|---|
| **Basic Attack** | 3-ammo cartridge, reloads over ~1.5–2.5 seconds (per brawler); varies in projectile count, pattern, range, damage |
| **Super** | The defining mechanic. Charged by dealing damage. Usually alters the fight state: burst damage, mobility, heal, zone control, transformation |
| **Gadget 1 & 2** | Cooldown-based utility (usually 20–30 seconds); unlocked at Power 7 and 10 |
| **Star Power 1 & 2** | Passive modifier; choose one of two; unlocked at Power 9 / 10 |
| **Hypercharge** | Level 11+; a boosted Super with persistent stat buffs during cast |
| **HP** | Low / Medium / High |
| **Speed** | Very Slow / Slow / Normal / Fast / Very Fast |
| **Range** | Very Short / Short / Normal / Long / Very Long |
| **Trait** | Passive quirk (e.g. Leon's Invisibility, Bo's Traps). Some brawlers have traits, many don't. |

## Design Principles

### 1. Every Brawler Plays Differently

No two brawlers should feel like clones. A brawler with a 3-shot scatter shotgun (Shelly) plays entirely different from a brawler with a long-range piercing sniper shot (Piper). Even when mechanics overlap (heavy-tank), the super defines the identity.

### 2. Super Must Be Memorable

The Super is what people **talk about** when they play a brawler:
- "Shelly's super is a massive shotgun blast that knocks back and destroys walls."
- "El Primo's super is a flying piledriver."
- "Spike's super is a slowing spike zone."
- "Jessie's super is a turret."

A brawler with a forgettable Super is forgettable. Design checkpoints for Super:
- Does it change the state of the fight?
- Does it have a moment of drama when cast?
- Does it have a counter-play?

### 3. Clear Role Assignment

A brawler should fit one clear primary role (see GDD). Secondary role is fine. But the role must be **legible in the first match** with the brawler — the player shouldn't have to read a wiki to understand "oh, this is a tank, I should play close."

### 4. Counter-Play Exists

For every brawler, the design must answer: **what brawlers beat them, and why?**
- Beat tanks with range (marksmen, artillery)
- Beat marksmen with burst / mobility (assassins)
- Beat assassins with zone control (controllers)
- Beat controllers with mobility/range (damage dealers)

If a brawler has no counter, it's oppressive. If a brawler loses to everything, it's weak. Both are bugs.

### 5. Numerical Budget

Each brawler has a fixed "budget":
- HP
- Damage-per-second
- Super impact
- Mobility
- Range

You can't have all five. A high-HP brawler sacrifices range or damage. A high-range brawler has low HP. Exceptions exist (usually Legendaries) but break patterns — and balance around that is harder.

## Role-by-Role Design Notes

### Damage Dealer

- Normal to medium HP, normal to long range, high DPS
- Play pattern: front line, consistent poke damage
- Super: usually an AoE damage burst or reload boost
- Counter: tanks that close distance, assassins with burst
- Examples: Colt, Bibi, Rico, Piper

### Tank

- High HP, short range, moderate damage
- Play pattern: close and bully; soak damage to create space
- Super: often mobility to close gap (charge, leap, teleport) or damage-redirect
- Counter: range, artillery, displacement (knockbacks)
- Examples: El Primo, Bull, Frank, Rosa, Darryl

### Support

- Low-medium HP, medium range, moderate damage
- Play pattern: stay in middle, heal / boost teammates
- Super: heal aura, shield, teleport-assist, repositioning
- Counter: assassins can dive them, marksmen can pick them off
- Examples: Poco, Pam, Gene, Max

### Assassin

- Low HP, short range, very high burst damage + mobility
- Play pattern: flank, burst a target, retreat
- Super: mobility (teleport, jump, invisibility) or damage boost
- Counter: area-denial brawlers (controllers, artillery), high HP that outlasts the burst
- Examples: Leon, Mortis, Crow, Edgar, Fang

### Controller

- Medium HP, medium range, moderate damage, zone control
- Play pattern: deny space, force opponents into bad positions
- Super: big zone effect (slow, sticky, wall, summon)
- Counter: brawlers who can ignore the zone (mobility, long range)
- Examples: Bo, Tick, Sprout, Amber

### Marksman

- Low-medium HP, very long range, very high damage
- Play pattern: backline; pick off targets from afar
- Super: big burst or massive range extension
- Counter: assassins, brawlers who break line of sight
- Examples: Piper, Brock, Bea, Belle

### Artillery

- Low HP, long range, indirect fire (ignores line of sight)
- Play pattern: lob damage from behind cover
- Super: massive zone shell
- Counter: assassins, brawlers that close distance
- Examples: Barley, Dynamike, Sprout, Tick, Jaguar

## Super Design Patterns

Supers fall into a handful of archetypes:

| Archetype | Example | Function |
|---|---|---|
| **Nuke** | Shelly blast | Burst damage cone/area |
| **Mobility** | Edgar jump | Repositioning tool |
| **Zone** | Spike spikes | Deny space |
| **Summon** | Jessie turret | Leave behind a helper |
| **Transform** | Crow self-buff | Temporarily become stronger |
| **Heal** | Pam heal-station | Sustain teammates |
| **Lock-out** | Gene pull | Reposition enemies |

A new brawler often introduces a novel super variant (e.g. wall destruction, temporary invulnerability, crowd summon).

## Gadget Design

Gadgets are **shorter, smaller-impact, cooldown-based** utilities. Examples:
- Heal a small amount
- Dash short distance
- Knockback
- Invisibility for 1 second
- Reload faster
- Teleport

Gadgets **complement** the Super — they should solve a different problem than the Super solves.

## Star Power Design

Star Powers are **passive modifiers** that deepen a brawler's identity.
- "Your basic attack slows enemies hit"
- "Your Super leaves a damage zone behind"
- "You reload faster when below 50% HP"
- "Your gadget also heals you"

They are **choice points**: a player picks one of two, making the brawler slightly different. This is subtle but important — two copies of the same brawler with different Star Powers play slightly differently.

## Hypercharge

- At Power 11
- **Both Super meter and a Hypercharge meter fill as the player deals damage**
- Activate: next Super is a boosted "Hyper" variant — extra damage, extra range, movement boost, or a unique effect unique to that brawler
- Hypercharge is a **comeback mechanic** — a scripted Power 11 player can turn a fight around with a well-timed Hyper

## Onboarding for New Brawlers

When a player unlocks a new brawler, the game should:
- Show a short tutorial-sparring pitting them against a bot with that brawler
- Highlight the Super via a small cinematic (showing the ability being cast)
- Provide a "meta tip" for how the brawler is typically played

## Testing & Balance

Each new brawler goes through:
- **Internal playtest** with the design team
- **Sandbox / training camp** deploys to a limited server pool
- **Soft launch** in a limited region
- **Global release** with a sharp eye on trophy win rates and mastery engagement

A brawler that wins > 60% of matches at launch is over-tuned. A brawler that wins < 45% is under-tuned. Tune the gap via **base stats first**, then Star Powers, then gadgets. Base stats are the last to change because every change ripples.
