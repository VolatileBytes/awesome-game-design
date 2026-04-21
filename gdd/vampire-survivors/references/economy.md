# Economy

## Two Currencies

The game has **one soft currency** (gold) and a set of **gated unlocks** (achievements → characters, weapons, stages). No hard currency. No real-money store inside the run.

### Gold

Earned in-run, persists **regardless of outcome**. Sources:
- Enemy drops (small + random)
- Destructible scene props (coins, gold piles)
- Chest payouts
- Kill counts at end-of-run (small bonus)

Multipliers: `Greed` passive (in-run), **character bonus** (some characters gain more gold), and meta-shop `Greed` tier.

### Achievements

Long-term progress gates. Types:
- **Play an X-level weapon for 10 minutes** → unlocks evolution recipe visibility, or a new weapon
- **Reach minute Y on stage Z** → unlock stage or character
- **Kill N of enemy type** → unlock a themed weapon
- **Equip X with Y** (the hidden one) → unlock an easter-egg weapon

Achievements are the primary long-term engagement hook. They should be:
- **Discoverable** by playing naturally (you will trip over 60–70% of them)
- **Obscure** for a second tier (community-discovered, wiki-driven)
- **Guided** via an in-menu checklist that hints but doesn't spoil

## Meta Power-Up Shop

Purchased with gold outside a run. Permanent passive bumps. Each has **5–10 tiers** on a steep cost curve.

Suggested baseline tiers:

| Power-up | Effect | Tiers |
|---|---|---|
| Might | +5% damage per tier | 5 |
| Armor | +1 flat dmg reduction per tier | 3 |
| Max Health | +10% per tier | 5 |
| Recovery | +0.1 HP/s per tier | 5 |
| Cooldown | -2% cooldown per tier | 5 |
| Area | +5% per tier | 5 |
| Speed | +5% per tier | 5 |
| Luck | +5% per tier | 5 |
| Growth | +5% XP per tier | 5 |
| Greed | +5% gold per tier | 5 |
| Curse | +5% enemy threat per tier (opt-in for gold bonus) | 5 |
| Revival | +1 revive per run | 2 |
| Reroll | +1 reroll per run | 7 |
| Skip | +1 skip per run | 7 |
| Banish | +1 banish per run | 7 |

### Cost Curve

Costs ramp sharply. Typical shape: tier-1 is affordable after one good run; tier-5 costs ~30× tier-1. This keeps the shop engaging across dozens of runs without going stale.

Concretely (tunable): `cost_n = base * multiplier^n`, with `multiplier ≈ 2.3`.

### Curse Is a Modifier, Not a Pure Buff

Curse **increases enemy damage, speed, HP, and spawn rate**, in exchange for a gold multiplier (and sometimes higher rare-drop rates). It is the only "harder" knob. Players who have capped the easy shop items turn Curse on to re-earn tension.

## Unlock Graph

```
Completing achievements → unlocks new characters / weapons / stages
New weapons join the global draft pool
New stages add new spawn tables + new arcana spawn points
New characters add new starting weapons + stat quirks
→ future runs have more build variety → faster evolution discovery → more achievements earned
```

The loop is **expansive, not escalating**. Each unlock adds a permutation, not a bigger number. This is what keeps the game engaging past run 20 — even if meta-power plateaus, build variety keeps increasing.

## Revive

A revive restores HP when the player would die, once per run (stacks with `Revival` tier). Revives should be:
- **Silent**: no pause, no dialog — HP restores, enemies near player get a small knockback, play continues
- **Rare**: maxed at 2 per run; the game should not become a dodge-death simulator

## Curse / Hyper / Endless

Post-game tuning levers, unlocked per stage once it's cleared:
- **Curse** — hard-mode modifier set (discussed above)
- **Hyper** — per-stage alternate, usually: denser spawns, stronger enemies, different music, better gold multiplier
- **Endless** — removes The Reaper, lets the player see how long they can hold

These are **not the main loop**. They are a long-tail engagement layer for players who've seen everything. The designer should **not** tune the base game to accommodate players who've spent 50 hours in Hyper — those are a minority.

## Monetisation Footprint

- The full game is purchased once.
- Post-launch expansions (DLC) are the primary ongoing revenue.
- **No IAP inside the run.** No gold-for-money. No revive-with-money. The run is sacred.
- Cosmetic DLC is acceptable; mechanical DLC is acceptable as long as it expands the unlock graph rather than paywalling the existing one.
