# Scaling Design — Risk of Rain 2

The "Risk" in the title is a **time pressure mechanic**. Difficulty rises as you stall; rewards scale too — the pace tension drives every decision.

## Difficulty Timer

A hidden float `difficulty_coeff` updates each second:

```
difficulty_coeff = f(time_elapsed, stages_cleared, current_difficulty_setting)
```

Internally known as "Time" — the HUD shows it as a difficulty tier label:

| Time elapsed (Drizzle) | Label | Approx tier |
|---|---|---:|
| 0:00 | Easy | 1 |
| 4:00 | Medium | 2 |
| 9:00 | Hard | 3 |
| 15:00 | Very Hard | 4 |
| 22:00 | Insane | 5 |
| 30:00 | Impossible | 6 |
| 40:00+ | HAHAHAHAHA | 7+ |

Difficulty setting multipliers (Drizzle / Rainstorm / Monsoon / Eclipse):
- Drizzle: 0.5x.
- Rainstorm: 1.0x.
- Monsoon: 1.5x.
- Eclipse (1–8): stacking modifiers on top.

## What Scales

Each monster has base stats + a per-level formula:

```
enemy_hp = base_hp × (1 + 0.3 × (level - 1))
enemy_dmg = base_dmg × (1 + 0.2 × (level - 1))
enemy_level = 1 + floor(time_elapsed / 60) ~approx
```

Beyond that:
- **Spawn count**: `+1 enemy per spawn wave per difficulty tier`.
- **Spawn variety**: more enemy types unlock as time progresses (Wisp → Jellyfish → Imp → Greater Wisp → Imp Overlord → ...).
- **Elite prefixes**: Blazing (fire aura + burn), Glacial (freeze on hit), Overloading (shock), Celestine (aggression), Malachite (anti-heal), Voidtouched (damage resistance).
- **Boss count**: normal = 1 boss; Shrine of Mountain adds +1 per stack; looping adds +1.

## Stage Pressure

Each stage has a hidden **soft timer**:
- ~5 min target: optimal pace.
- 10+ min: enemies scaling faster than your build grows.
- 20+ min: usually game over if no teleporter done.

The teleporter event itself scales with current difficulty, creating a crescendo.

## Scaling Strategy

Player agency in the tension:

- **Speedrun pace**: skip shrines, teleporter quickly → lower difficulty at boss fight → easier boss → fewer items → harder later stages.
- **Grinder pace**: open every chest, use every shrine → more items but higher difficulty at teleporter.
- **Looping pace**: after stage 5, you can loop back to stage 1 — new items refresh but difficulty carries over. Loop 2 stage 1 is typically harder than loop 1 stage 5.

## Stage Progression

After stage 5, you can choose:
- **Commencement** (Mithrix final boss) via lunar teleporter.
- **Loop back to stage 1** (for more items / harder).
- **Void realm** (DLC): alternate post-stage-5 destination.

Looping is infinite in theory — records exist for loop 20+.

## Boss Scaling

Each stage's teleporter spawns a boss. Bosses have:
- Stage 1 pool: Beetle Queen, Stone Titan, Wandering Vagrant.
- Later stages: harder mix + bigger HP pools.
- At looped difficulty: bosses scale to `level = time/60`, HP easily in 6 digits by loop 3.

Bosses also have **elite variants** at high difficulty: Blazing Stone Titan etc.

## Time-of-Life Scaling

Your **overall build value** must outpace scaling:
- Items × attack speed × crit × proc chance × proc damage → multiplicative.
- At ~10 stages looped with 30+ legendaries, damage numbers are in the millions.
- Balance target: a skilled player should fail around loop 3–5 on Monsoon with default survivor.

## Artifacts

Toggleable modifiers found via deciphering codes mid-run. Some alter scaling:

- **Artifact of Kin**: only one enemy type per stage (harder or easier depending on type).
- **Artifact of Swarms**: 2x enemies, half HP.
- **Artifact of Evolution**: enemies get items at each stage (scary in loops).
- **Artifact of Glass**: player takes 5x damage, deals 5x damage.
- **Artifact of Sacrifice**: chests removed; enemies drop items.

Artifacts are how players tune difficulty after hitting the skill ceiling.

## Multiplayer Scaling

Co-op adjusts scaling:
- **Enemy HP** +50% per additional player (so 4p = +150%).
- **Enemy count** scales with player count.
- Gold is shared on pickup; items are per-player.

This keeps solo and 4-player equivalently difficult.

## Testing / Tuning

- **Simulate 1000 runs** per survivor × difficulty tier, report:
  - Avg stages cleared.
  - Avg items at death.
  - Most common cause of death (by enemy type).
- **Scaling curves** reviewed every patch; no boss should one-shot a standard build at base stage's expected power level.
- **Elite frequency**: should feel rare early (1 per stage), common late (per wave).
- **Mutation timing**: Blazing Stone Titan should first appear around stage 3–4 on Monsoon.
