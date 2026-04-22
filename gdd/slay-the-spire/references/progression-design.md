# Progression Design — Slay the Spire

Two progression tracks: **in-run** (card draft + relic acquisition + HP management) and **meta** (ascension ladder + unlock pool).

## In-Run Progression

### The Map (per act)

Branching vertical map:
- Bottom row: 4–5 entry nodes you pick from.
- Rows build upward, each row has node connections to 1–3 of next row's nodes.
- Boss sits alone at the top.

Path selection is as strategic as card play. Priority order typically:
1. Elites early (you're strong, can handle the fight, get a relic).
2. Shops before a big draft decision.
3. Rests before Act bosses (to heal or upgrade).
4. Avoid empty events on a lean build.
5. Prioritize treasure nodes when accessible.

### HP as a Resource

You start with modest HP (Ironclad 80, Silent 70, Defect 75, Watcher 72) and damage permanently drains HP between fights. Healing:
- Rest node (30% HP).
- Healing potions (consumable).
- Specific relics (Meat on the Bone, Magic Flower).
- Rare: full-rest events.

Going into a boss at 30% HP with a weak deck = run over. Economy is balancing HP loss against card quality.

### Act Boss Relic

Beating an act boss = pick 1-of-3 boss relics. Boss relics are *high-power with a drawback*:

- **Pandora's Box**: transform all Strikes and Defends into random cards. Deck-warping.
- **Ectoplasm**: +1 energy, but no gold from combat. Breaks the shop economy.
- **Runic Dome**: +1 energy, but intents are hidden. Breaks planning.

These relics are the run's biggest decision moments.

## Meta-Progression

### Ascension Ladder

Per character. Tiers 0 (standard) through 20. Each tier persistent on the character slot; beat the act 3 final boss at tier N to unlock tier N+1.

| Tier | Additional rule |
|---|---|
| A1 | Elites appear more often |
| A2 | Stronger elite variants |
| A3 | Stronger common monster variants |
| A4 | Stronger boss variants |
| A5 | −5 max HP |
| A6 | Healing reduced to 25% |
| A7 | Max HP −2 at combat start |
| A8 | Stronger elite debuffs |
| A9 | −5 starting gold |
| A10 | Die at 0% (removes checkpoint-like forgiveness) |
| A11 | Pick 1 of 3 fewer cards post-combat |
| A12 | Rare card chance −20% |
| A13 | Less gold from common fights |
| A14 | Lower max-HP gain from events |
| A15 | Events have worse outcomes |
| A16 | Elites apply status more often |
| A17 | Stronger elites |
| A18 | Stronger bosses |
| A19 | Common monsters apply Weak/Vulnerable more |
| A20 | Double boss at act 3 end |

A20 Heart (true final boss) is the community's target mastery level.

### Card Pool Unlocks

Starting pool = subset of each character's cards. New cards unlock after cumulative in-run floors played:
- Unlock set 1: ~floor 30 total
- Unlock set 2: ~floor 60 total

Players see a new-card screen after the run when unlocks trigger.

### Relic Pool Unlocks

Similar ladder; relics gate behind floors-played.

### Achievement Unlocks

Beating each character on A20 unlocks colorless card additions (universal cards drafted from all characters).

## No Currency / No Shop

Progression is pure skill + play-count unlocks. No real-money purchase, no XP bars, no daily dailies. The progression is mastery of a dense system.

## Custom Modes

- **Daily Climb**: seeded run, leaderboard, modifier stack.
- **Custom Run**: pick character, ascension, modifiers ("endless", "infinity spire"), test builds.

## Run End

- **Success**: kill Act 3 boss → ascend to Act 4 (The Heart) if available → end-screen.
- **Failure**: HP hits 0 → end-screen showing map path, deck, relics, score.
- Score includes floor reached, enemies killed, max HP retained, deck size, unique bonuses.

## Telemetry (for rebuild)

Track:
- Run length (floors).
- Characters played + ascension tier.
- Cards drafted / skipped / removed.
- Relics collected.
- Death enemy + floor.
- Post-run deck composition.

Use to balance card pool (underpowered cards show low pick rate; overpowered cards show run-win correlation).
