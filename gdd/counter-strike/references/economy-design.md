# Economy Design — Counter-Strike

Economy is the game's second scoreboard. You're not just fighting the enemy team — you're starving their bank account.

## Money Flow

### Starting Money

- First round of each half: $800.
- Team resets money on half-swap but keeps weapons (dropped at end of half).

### Round Income

| Event | Payout |
|---|---:|
| Win (elimination) | $3250 |
| Win (bomb detonate) | $3250 |
| Win (defuse) | $3250 |
| Win (time) | $3250 |
| Loss 1 consecutive | $1400 |
| Loss 2 consecutive | $1900 |
| Loss 3 consecutive | $2400 |
| Loss 4 consecutive | $2900 |
| Loss 5+ consecutive | $3400 |
| Plant bonus (T only, even on loss) | $800 split across team |

**Team income cap per round (winning team)**: $3250. Losing team is bounded by the loss-bonus curve.

### Kill Rewards

Kill reward scales by weapon:

| Weapon | Reward |
|---|---:|
| AWP | $100 |
| Auto snipers | $300 |
| Rifles (AK/M4) | $300 |
| SMGs | $600 |
| Pistols | $300 |
| Shotguns | $900 |
| Knife | $1500 |
| Grenade kill | $300 |
| Teammate kill | -$300 |

SMGs overpay intentionally — anti-eco enforcement (CTs with MP9 can farm Ts with pistols hard).

## Money Cap

$16,000 hard cap. Overflow is lost.

Implication: don't hoard. If you're at $16k, spend for your teammates (drop rifles).

## Buy Types

### Pistol Round (rd 1 / rd 13 in CS2)
- $800 budget.
- Buy: armor ($650), pistol upgrade (USP-S → P250/Deagle), maybe 1 utility.
- Result: most players run Glock + armor + flash, or force Deagle.

### Full Buy
- ~$4700+ budget.
- Rifle (AK/M4 $2700/$3100) + armor+helmet ($1000) + utility ($1250).
- Target: 3-4 full utility per player.

### Force Buy
- $2000-3500 range.
- Rifle or upgraded pistol + partial armor + minimal utility.
- Bet: win the round and catch up.

### Eco (Save)
- <$2000.
- Pistol + maybe armor or grenade.
- Intent: lose the round, save $ for next.

### Semi-Eco / Anti-Eco
- Mid-range.
- Sometimes CT "anti-eco" with MP9s to farm kill reward on low-economy Ts.

## Weapon Pricing

| Category | Weapon | Cost |
|---|---|---:|
| Pistol | Glock/USP | Free |
| Pistol | P250 | $300 |
| Pistol | Five-SeveN / Tec-9 | $500 |
| Pistol | Deagle | $700 |
| Pistol | Dual Berettas | $300 |
| Pistol | CZ | $500 |
| SMG | MP9 / MAC-10 | $1250 |
| SMG | MP7 | $1500 |
| SMG | UMP | $1200 |
| SMG | P90 | $2350 |
| SMG | Bizon | $1400 |
| Shotgun | Nova | $1050 |
| Shotgun | XM1014 | $2000 |
| Shotgun | MAG-7 | $1300 |
| Shotgun | Sawed-Off | $1100 |
| Rifle | Galil | $1800 |
| Rifle | Famas | $2050 |
| Rifle | AK-47 | $2700 |
| Rifle | M4A4 | $3100 |
| Rifle | M4A1-S | $2900 |
| Rifle | AUG | $3300 |
| Rifle | SG 553 | $3000 |
| Sniper | SSG 08 (scout) | $1700 |
| Sniper | AWP | $4750 |
| Sniper | G3SG1 / SCAR-20 | $5000 |
| Heavy | M249 | $5200 |
| Heavy | Negev | $1700 |
| Armor | Kevlar | $650 |
| Armor | Kevlar + Helmet | $1000 |
| Util | HE / Flash / Smoke / Molly | $300 / $200 / $300 / $400-500 |
| Defuse kit (CT) | - | $400 |

## Economic Strategy

### Breaking a Full Buy Team

If enemy is rich (5 AKs), go aggressive — kill 2-3 of them, they drop rifles, you loot. Rifles swing rounds.

### Save vs Force

Rule of thumb: if you lose and everyone has $2000, **save** — you're at $2000 + $2400 loss bonus = $4400 next, full buy next. If you force, you risk going $0 and being stuck on pistols for 3 rounds.

### Loss Bonus

The escalating loss bonus is a **mercy curve**. A team losing 4 rounds in a row gets $3400 — enough for rifles. This lets them "reset" economy on round 5 with a full-buy.

### Kill Steal for $ 

Kill rewards incentivize taking kills for the player, not just team. Exception: SMGs/pistols reward more than rifles.

## Drop Economy

Players can **drop weapons**:
- Rich teammate drops rifle to poor teammate.
- Dropped weapons persist on ground until picked up.
- Dead-player weapons can be looted by either team.

Team captains ("IGL" = in-game leader) often manage drops + buys centrally via voice.

## Half-Time Reset

- Both teams swap sides.
- Money resets to $800.
- Weapons drop (no carry across sides).
- Effectively a fresh pistol round.

## Overtime Economy

- Money resets to $10,000.
- MR3 (first to 4 in 6 rounds wins).
- Less eco strategy; more full-buys.

## Why Economy Works

Valve's design insight: in most FPS, every round starts equal. In CS, **compounding advantage** creates swings — a team that wins 3 in a row can afford utility gold, while the other team is reduced to pistols.

But the loss bonus prevents runaway — you can always claw back with one round.

This creates the "comeback": a team down 3-12 can still make it 13-13 if they land a force round at the right moment.

## Balance Probes

- Pistol-round win rate should be ~52-55% for winner's side in subsequent round (money compounds but not overwhelmingly).
- Force-buy win rate: ~30% (not nothing; meaningful).
- Eco win rate: ~10% (possible but brave).
- A team never stuck below $2000 for more than 3 rounds thanks to loss bonus.

## Community Concerns

- Kill reward for AWP ($100) is intentionally low to prevent "AWP farming" a poor team.
- SMG over-reward ($600) intentionally punishes mass pistol-only pushes.
- Teammate-kill penalty is small ($300) given rifles cost $2700+ — friendly-fire isn't economically destructive.

## Rejected Designs

- **Progression unlocks** (earn weapons per round): would disconnect $ from weapon choice.
- **Loot crates on map**: would break economy determinism.
- **Respawn purchasing**: breaks round integrity.
- **Killing for full weapon recovery**: creates snowballing.
