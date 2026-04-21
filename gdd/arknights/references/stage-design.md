# Stage Design

Arknights stages are **puzzle boxes**. Every stage is hand-designed; pause-and-think is the intended play style. This doc is the design playbook for stages.

## Anatomy of a Stage

| Element | Role |
|---|---|
| **Map Tile Grid** | 2D grid of tiles (approx 10-wide × 6-high typical) |
| **Spawn Points** | Where enemies appear (usually 2–3) |
| **Protect Point** | Where enemies exit (1–2, losing condition) |
| **Enemy Paths** | Fixed routes from spawn to protect point |
| **Tile Types** | Ground, High Ground, Obstacle, Special (e.g., conveyor, toxin) |
| **Deploy Points** | Tiles where you can place Operators |
| **Environment Mechanics** | Stage-specific effects (doors, toxic clouds, falling rocks) |
| **Wave Script** | Exact enemy spawn timing + type + path |
| **Sanity Cost** | 6–30 to attempt |

## Tile Types

- **Ground Tile**: melee (Guard, Defender, Vanguard, Specialist usually) can deploy
- **High Ground (Ranged) Tile**: ranged Operators (Sniper, Caster, Medic, Supporter) deploy
- **Obstacle**: enemies navigate around
- **Special Tiles**: box spawners, conveyors, event-specific

## Enemy Path Design

- **Single path** = simple defense; focus on a single lane
- **Split path** (T-junction) = players split forces, maybe leak
- **Loop path** = recycle enemies past multiple defense points
- **Hidden path** (flying enemies): enemies ignore tile paths

### Path Timing

- Enemies move at fixed speed per type
- Timing relative to DP generation: if a tank enemy appears before DP allows for a Defender → pressure
- **Pacing** per stage: early waves easy, mid waves introduce variety, final wave = finale

## Wave Structure

**Arknights stages** are scripted, not random:
- Wave script: `[time, enemy_type, spawn_point, path]`
- 3–5 waves per standard stage
- Each wave has a different composition
- **Mini-boss** or **final boss** at the last wave

## Enemy Types

- **Soldier**: basic ground enemy, dies in 1–3 hits
- **Fast Mover**: low HP but fast → requires early interception
- **Tank**: high HP + DEF → needs Arts damage or pierce
- **Caster**: ranged attacker → prioritize kill
- **Flying**: ignores terrain → Sniper/Caster on high ground
- **Healer**: heals other enemies → kill first
- **Boss**: unique mechanics (multiple phases, trigger conditions)

Each enemy is **designed to counter** a simple strategy. A pure Defender wall breaks against casters; pure Snipers break against tanks.

## Difficulty Scaling

### Chapter Progression
- Chapter N introduces a **new enemy type** or **mechanic** (toxic tile, respawn, shield)
- Design: player must use Operators they already own, creatively
- New chapters don't hard-gate: old stages are always replayable

### Stage Difficulty Curve
- **Normal**: story progression, medium challenge
- **Hard (Challenge)**: bonus version with harder variant
- **Event Challenge**: stages designed to push meta
- **Contingency Contract (CC)**: modifier-based challenge where players pick risk modifiers for rewards

## Stage Objectives (Scoring)

- **3 Stars**: 0 leaks, kill all enemies, clear within time → full reward
- **2 Stars**: some leaks, minor penalty
- **1 Star**: cleared with many leaks
- Must get 3★ for Sanity rebate (some events)

## Puzzle Design Patterns

### The "Block 3" Puzzle
- A Defender that blocks 3 enemies
- Narrow path forces enemies to queue
- Must use DEF to survive while damage dealers hit them

### The "Ranged Only"
- Heavy enemies on ground tiles
- Limited melee deploy tiles
- Forces range-heavy strategy

### The "Time Pressure"
- Many enemies, short time between waves
- Rewards efficient DP management + fast deploy

### The "Wave Cycle"
- Different enemy types per wave
- Player must swap Operators mid-stage (retreat + redeploy)
- **Fast-Redeploy Specialists** shine here

### The "Boss Dance"
- Boss has patterns — teleport, rage modes
- Must preserve specific skills for boss arrival

## Stage Mechanics Library

- **Toxic Tiles**: damage Operators standing on them
- **Ice Tiles**: slow Operators
- **Conveyor**: move Operators/enemies tile-by-tile
- **Falling Rocks**: time-based damage to specific tiles
- **Door Triggers**: some tiles open doors changing path
- **Switches**: pressing them toggles map state
- **Sandstorm (RI event)**: reduced visibility / debuffs
- **Contingency Contract** modifiers: "enemies gain +30% HP", "dying Operators drop bombs", etc.

## Event Stage Design

Events introduce **new stage archetypes**:
- **Rhodes Island Experimental**: boss rush with modifier stacking
- **Integrated Strategies**: roguelite runs with procedurally-chained stages
- **Stultifera Navis**: submerged naval theme with new tile types

Events **force experimentation** — new mechanics mean default squads need re-thinking.

## Stage Design Process

1. **Theme pick**: what's the stage "about"? A puzzle, a rush, a tank-heavy gauntlet?
2. **Map layout**: design tile grid
3. **Path design**: draw enemy routes
4. **Enemy wave scripting**: pick counter-matches
5. **Deploy point placement**: where can players set up?
6. **Internal playtest**: design team runs it
7. **Balance pass**: difficulty tuning
8. **Sanity cost**: tier it based on expected clear time

## Difficulty Testing

- **A-team clear**: with meta-6★ Operators, should clear 3★ in one attempt
- **B-team clear**: with 3-4★ Operators only, should 3★ clear with more effort
- **Low-end clear**: with starters only, 1-star achievable
- **Annihilation-esque** stages: meant for established veterans

## Farmability

Stages players **re-run for mats**:
- Normal chapter stages drop rare materials
- Players target specific stages for specific mats
- **Auto-deploy** after 3★ clear = essential quality of life for farming

## Anti-Patterns

- **RNG in wave scripts**: if enemies spawn randomly, puzzles break
- **One-shot mechanics**: enemies that kill Operators in one hit without counter-play feel unfair
- **Punishing pace**: stages that demand split-second deployment are stressful, not puzzling
- **Invisible rules**: mechanics that aren't explained or indicated on the tile → frustrating
- **Mat-scarcity on obscure stages**: force players to farm hated stages

## Event Pacing

- Main event: 3–5 weeks
- **Farm phase**: 2–3 weeks of grinding event stages for currency
- **Story phase**: plays out alongside; unlocks new stages
- **Challenge phase**: final week, high-difficulty version
- **Shop closure**: currency stops being earned → spend or lose

Event design balances **carrot on a stick** without **burnout** — usually 30-60 min/day of play suffices.
