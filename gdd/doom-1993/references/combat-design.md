# Combat Design — DOOM (1993)

Doom's combat is fast, chaotic, and tuned around the idea that the player should be constantly moving, constantly switching weapons, and constantly re-prioritizing targets. Encounter design was explicit ("the monster composition IS the fight"); weapon identity was explicit (each gun has a role); damage math was tight.

## Weapon Stats

| Weapon | Slot | Ammo/shot | Damage | Fire Rate (tics) | Range | Projectile |
|---|---|---|---|---|---|---|
| Fist | 1 | — | 2-20 (avg ~5) | 12 | melee | — |
| Berserk fist | 1 | — | 20-200 (avg 50) | 12 | melee | — |
| Chainsaw | 1 | — | 2-20/tic | 4 | melee contact | — |
| Pistol | 2 | 1 bullet | 5-15 (5 × 1-3) | 17 | hitscan | — |
| Shotgun | 3 | 1 shell | 35-105 (7 × 5-15) | 40 | hitscan (spread) | — |
| Chaingun | 4 | 1 bullet | 5-15 | 4 | hitscan | — |
| Rocket Launcher | 5 | 1 rocket | 20-160 + splash | 26 | projectile | rocket (20 units/tic) |
| Plasma Rifle | 6 | 1 cell | 5-40 (avg 22) | 3 | projectile | plasma bolt (25 units/tic) |
| BFG 9000 | 7 | 40 cells | 100-800 + 15-110 × 40 tracers | 50 | projectile | bfg shot |

Tics = 1/35 sec. Smaller tic count = faster fire rate.

## Damage Formula

Damage per shot = base × random(1, N):
- Pistol/chaingun: `5 × [1-3]` → 5, 10, 15 per bullet.
- Shotgun: `5 × [1-3]` per pellet × 7 pellets.
- Plasma: `5 × [1-8]`.
- Rocket: base 20 + `[0-64]` random = 20-84 direct; splash 20-128.

### Hitscan vs. Projectile

- **Hitscan** (pistol, shotgun, chaingun): instant. Trace a ray from player to first blocker. Deal damage if it's a monster.
- **Projectile** (rockets, plasma, BFG): spawned mobj moves at fixed velocity; damage on collision.
- **Melee** (fist, berserk, chainsaw): hitscan within ~64 unit range.

## Ammo Types + Capacities

| Ammo | Pickup | Cap (backpack 2×) |
|---|---|---|
| Bullets | Clip +10, Box +50 | 200 (400) |
| Shells | Shell +4, Box +20 | 50 (100) |
| Rockets | Rocket +1, Box +5 | 50 (100) |
| Cells | Cell +20, Pack +100 | 300 (600) |

Backpack item doubles all capacities.

## Armor

| Armor | Starting | Absorption |
|---|---|---|
| Green Armor | 100 | 33% |
| Mega Armor | 200 | 50% |

- Damage splits between HP and armor per absorption %.
- Armor depletes 1 point per 3 damage absorbed (at 33%) or 1 per 2 (at 50%).
- Mega Armor fills to 200 regardless of current green armor.

## Health

| Item | Heal | Max |
|---|---|---|
| Stimpack | 10 | 100 |
| Medikit | 25 | 100 |
| Health Bonus (bottle) | 1 | 200 |
| Soul Sphere | 100 | 200 |
| Megasphere | to 200 | 200 + Mega armor |

Health caps at 100 for standard pickups (Stim, Medikit); bonuses allow >100 up to 200; Soul/Mega ignore 100 cap up to 200.

## Monster Stats

| Monster | HP | Attack Range | Damage | Speed (units/tic) |
|---|---|---|---|---|
| Zombieman | 20 | hitscan | 3-15 | 8 |
| Shotgun Guy | 30 | hitscan × 3 | 3-15 × 3 | 8 |
| Imp | 60 | melee + fireball | 3-24 melee / 3-24 projectile | 8 |
| Pinky Demon | 150 | melee | 4-40 | 10 |
| Spectre | 150 | melee | 4-40 | 10 (~50% invisible) |
| Lost Soul | 100 | charge | 3-24 (+ramming) | 8 |
| Cacodemon | 400 | fireball | 5-40 | 8 |
| Baron of Hell | 1000 | melee + fireball | 10-80 | 8 |
| Cyberdemon | 4000 | rocket launcher | 20-160 + splash | 16 |
| Spider Mastermind | 3000 | chaingun hitscan | 3-15 × sustained | 12 |

## Monster Behavior

### State Machine (per monster)

```
SPAWN → IDLE → (saw player → CHASE) → (in range → ATTACK) → (post-attack → CHASE)
  ↑                                                                       ↓
  └────────────────────── (LOF lost → IDLE) ←──────────────────────────────┘

Any state → PAIN (on hit) → CHASE
Any state → DEATH (HP ≤ 0) → CORPSE
```

Pain state: enemy stutters, cannot attack. Pain chance per monster (Imp ~20%, Pinky ~180/255, Cacodemon ~128/255).

### Awaking

- Monster sees player → awake → starts sound → alerts other monsters in earshot (same sector tree).
- Propagation via "sound traveled" flag sectorwise.

### Infighting

- If monster A hits monster B (non-projectile crossfire), B targets A.
- Certain monsters immune to own species' attack (Imp/Baron fireballs don't hurt Imp/Baron).
- Infighting is key tactic — line up enemies, let them fight each other.

### Targeting

- Target: visible player in last N tics, or attacker if hit.
- Attack type chosen based on range (melee vs. ranged).

## Encounter Design

### Monster Mix

Effective encounters combine:
- **Ranged hitscanners** (zombies, shotgunners): force the player to take cover.
- **Slow projectile tankers** (imps, cacos): force dodging.
- **Melee rushers** (pinkies, lost souls): break cover play.
- **Bullet sponges** (barons): drain ammo, force DPS choices.

Single-type encounters are boring. Mixed encounters force prioritization.

### Closet Traps

- Hidden monster rooms triggered by stepping on a linedef or picking up an item.
- Back-spawn or teleport-in behind the player.
- Canonical Doom "oh shit" moment.

### Crushers

- Moving ceiling sectors that crush anything below.
- Used as trap OR tactical tool (lure monsters under).

### Ambient Threat

- Monsters pre-placed in corners, behind pillars.
- Player must clear line-of-sight to know what's there.

## Combat Tactics

### Strafe Circle

- Primary technique. Strafe around enemy while firing; avoid their attack line.
- Works on slow projectiles (Imp, Cacodemon, Baron) perfectly.

### Shotgun Two-Tap

- Shotgun at point-blank: 7 pellets × 15 max = 105 damage → one-shots Imps, two-shots Pinkies.

### Rocket Discipline

- Splash damages self (~half of target damage).
- Never fire at close range; never into enemy next to you.
- Best on clumps of weak enemies (imps, cacos).

### Plasma Spray

- High DPS; stunlocks Cacodemons and Barons.
- Ammo-hungry; reserve for boss-tier.

### BFG Trick

- BFG fires main projectile; on detonation, fires 40 invisible tracers from player position at targets in 45° cone.
- Trick: fire BFG, immediately turn toward target. Tracers do the damage.
- One BFG can clear a room.

### Chainsaw Cheese

- Chainsaw is melee but fuel is infinite.
- Pinkies can't attack while stunlocked in chainsaw pain state.
- Save ammo by chainsawing low-tier enemies.

### Berserk Surprise

- Berserk pack permanently empowers fist (stacks with invulnerability).
- Fist damages 50-200 per hit — one-shots many enemies.
- Conserves all ammo.

### Infighting Setup

- Shoot tough monster once (say, a Baron), then duck behind cover.
- Baron wanders, encounters other monsters, fights them.
- Save ammo; let monsters thin themselves.

## Difficulty Scaling

### By Skill Level

| Skill | Damage Taken | Monster Count | Ammo | Other |
|---|---|---|---|---|
| ITYTD | × 0.5 | 100% base | × 2 | — |
| HNTR | × 1 | fewer than HMP | × 1 | — |
| HMP | × 1 | base | × 1 | baseline |
| UV | × 1 | more than HMP | × 1 | faster attack rates |
| Nightmare | × 1 | UV + respawn | × 2 | monsters move/fire 2× speed; respawn every ~30s |

### Encounter Scaling

Skill flags per monster placement in WAD — mapper picks which enemies appear at each difficulty. UV != HMP + more of same; UV has additional enemies placed for the specific challenge.

### Pistol-start Discipline

- Each level starts with pistol + 50 bullets by default.
- Speedrun/purist convention: each level is balanced for pistol-start (not carried ammo/weapons).
- Modern "pistol-start" mode in ports forces per-level reset.

## Death + Reload

- Death: status bar face covered in blood; view tilts down; player can view end-of-life briefly.
- Reload: F6-F9 quicksave/quickload slots (vanilla).
- No checkpoints; save-game is player-initiated.

## Secrets

### Hidden Rooms

- Marked as "secret" sector tag.
- Revealing (walking in) increments Secrets counter; shown on end-of-level stats.
- Contain: weapons, ammo, health, armor, sometimes just easter eggs.

### Finding Secrets

- Misaligned textures (off-grid lump).
- Weird floor markings.
- Suspiciously wide walls.
- Skull switches in hidden corners.
- Sometimes telegraphed by light differences (texture changes).

### 100% Secrets

- Not all levels have 100%-findable secrets; some are intentionally unreachable or computed-only (engine-quirks).

## End-of-Level Stats

- Kills: `X / total` monsters killed.
- Items: `X / total` item pickups (weapons, armor, powerups, not health/ammo).
- Secrets: `X / total` secret sectors visited.
- Time: total time spent in level.
- Par: target time set by mapper.

Competitive scoring: 100% kills + 100% items + 100% secrets + par time = "UV-Max" category in speedrunning.

## Multiplayer Combat

### Deathmatch

- Respawn on death at randomized spawn points.
- Weapons from starting spawn + map-placed.
- Typically 4 players IPX LAN.
- Kill count scored; first to N or timer-based match length.
- Movement speed + shotgun + rocket launcher = signature DM combat.

### Deathmatch Variants

- **DM 1.0**: weapons stay, ammo respawns. Classic.
- **DM 2.0** (altdeath): weapons don't respawn; found once. Tactical map-control.

### Co-op

- Same campaign maps; friendly fire ON.
- Monster counts scale (multiplayer = more enemies placed).
- Items persist per-player (weapons given to all, but each player collects HP/armor separately).

## Combat Philosophy

### Always Moving

- Standing still is death; every enemy projectile is dodgeable.
- Doom's movement speed is built around the player NOT camping.

### Weapon Choice = Threat Assessment

- Player has 7 weapons; good player swaps constantly.
- Shotgun for mid-range, chaingun for stunlock, rocket for crowds, plasma for bosses.
- Ammo economy drives weapon selection.

### Sound is a Weapon

- Enemy sight sounds tell you what's around the corner.
- Weapon sounds tell you what the other player has (DM).
- Ambient demon noises tell you where to look.

### Chaos is a Feature

- Doom's encounter design leans into mess — 10+ enemies at once is common.
- Infighting cleans up automatically; player doesn't need to solo every demon.
- Chaos + speed + tight hit-detection = signature Doom pace.

### No Cover Shooter

- No lean system, no ADS, no crouch-in-cover.
- Walls are geometry, not gameplay cover.
- Combat is about flanking, not hiding.

## Balance Notes

### What's OP

- **Shotgun**: mid-range workhorse; one-shot kills everything Imp-and-below at close range.
- **Plasma rifle**: stun-locks everything except Cyberdemon.
- **BFG-trick**: can one-shot Cyberdemon with careful positioning.

### What's UP

- **Pistol**: only useful at level start.
- **Fist (non-berserk)**: essentially useless; finishing move only.
- **Rocket launcher at close range**: self-damaging; risk exceeds reward.

### What's Just Right

- **Chaingun**: DPS matches use case.
- **Chainsaw**: conserves ammo; fun factor high.

## Balance Comparisons: Doom vs. Doom II (Super Shotgun)

Doom II introduced the Super Shotgun (2 × shotgun damage, wider spread, slower reload). This single weapon reshaped combat design in Doom II — most mid-range encounters are "can I SSG this in 1-2 shots." Original Doom lacks SSG; combat rhythm is correspondingly slower and more varied.
