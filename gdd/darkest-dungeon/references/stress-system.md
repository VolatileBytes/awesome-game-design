# Stress System — Darkest Dungeon

Stress is Darkest Dungeon's defining mechanic. It's why the game ships so many warnings about psychological distress and why "overconfidence is a slow killer."

## What Is Stress

A **second HP bar** on each hero, 0–200:

- **0**: fine.
- **1–99**: accumulating, no effect yet.
- **100**: Affliction check — 75% Affliction, 25% Virtue. A narrator stinger fires.
- **100–199**: the hero is Afflicted (or Virtuous).
- **200**: Heart Attack — drops to Death's Door; if already at DD → death.

## Stress Damage

Every combat action can deal stress:

- **Enemy attacks**: some explicitly list "Stress damage: X" in their move.
  - Madman's "Witness Me!": 15 stress to all heroes.
  - Swine Skiver: 5 stress to target.
- **Crits received**: +3 stress on target.
- **Miss / dodge**: 0 stress (correct!).
- **Darkness**: low-torch fights deal +30% stress.
- **Trap sprung on party**: stress.
- **Watching ally die or crit-die**: 20+ stress to other heroes.

## Stress Heals

- **Jester Finale**: -15 stress all allies + massive damage if kill.
- **Crusader "Inspiring Cry"**: -5 stress adjacent (rank 2,3).
- **Houndmaster "Cry Havoc"**: -15 stress adjacent.
- **Camp actions**: "Tell a Tale" (-10), "Pep Talk" (-15 one), "Encouraging Tale" (-30).
- **Town activities**: Tavern (-30 to -50), Abbey (-30 to -50).
- **Crits dealt**: -3 stress on hero.

## Affliction (75% of 100-stress check)

Afflictions are **debuff + behavior chaos**:

| Affliction | Behavior |
|---|---|
| Abusive | deals stress to allies; refuses healing |
| Hopeless | lower damage, chance to pass turn |
| Masochistic | refuses heal; walks into danger |
| Irrational | random skill choice |
| Paranoid | skips turns, applies self-debuffs |
| Fearful | flees position (shuffles), debuffs |
| Selfish | refuses buffs for allies |

An afflicted hero actively worsens the party: passes turns, stresses allies, shuffles formation.

## Virtue (25% of 100-stress check)

Rare; the hero becomes **superhuman** temporarily:

| Virtue | Buff |
|---|---|
| Stalwart | +10 dmg, +10 dodge |
| Focused | +crit, +acc |
| Courageous | +dmg + heal party |
| Powerful | +damage big bonus |
| Vigorous | +HP + heal on hit |

Virtuous heroes reduce stress each turn, heal allies, and fight through the encounter.

## Resistance to Affliction

- Each hero has stress **resistance** (class stat, 10–45%).
- Trinkets and quirks modify.
- Even with high resist, affliction can fire.

## Stress Accumulation Rules

Stress damage is applied:
- On hit (after damage).
- On crit received.
- On dungeon events (curios, room hazards).
- On death of ally.
- Over time on dungeons longer than expected.

Stress only heals in specific skill windows and in Hamlet.

## Design Intent

### Why a second HP bar?

Red Hook's insight: **RPGs have dodge, HP, and death**. Stress adds a third axis:
- **HP** = physical resilience.
- **Stress** = psychological resilience.
- **Death** = final consequence.

Hitting Stress threshold triggers party-internal dynamics (afflicted ally becomes problem), adding systemic complexity.

### Why does Stress persist between fights?

- Makes dungeon length a balance concern: longer dungeons accumulate stress.
- Makes torch management matter: light costs torches (consumed) but reduces stress gain.
- Makes camping strategic: do you heal HP or stress?

## Estate Management

Back at Hamlet:

- **Abbey**: Meditation (stress + quirk removal chance), Cloister (stress heal), Flagellation (big stress heal but HP loss — only Flagellant enjoys it).
- **Tavern**: Drink (stress heal, chance to get disease), Gamble (stress heal, cost money), Brothel (stress heal, chance disease).

Some heroes refuse specific activities based on quirks:
- A pious hero can't Brothel.
- A "hard drinker" prefers Tavern.
- A "deviant" refuses Abbey.

This creates scheduling puzzles: you can't just put everyone through the Abbey; costs scale and activities are per-building capacity.

## Disease & Quirk Interplay

Stress + disease + quirks form an **entropic debt** the player accumulates. Heroes get "resolution" lines — dead quirks or permanent negative traits (Kleptomaniac, Known Cheat) — that persist.

Trinkets (hero-equipped items) often trade buffs for quirks: e.g. "+15% damage; +15% stress received."

## Implementation Hooks

- **Stress is a property on hero state** (0–200 int).
- **Stress is modified by typed events**: `ApplyStress(target, amount, source)` → trigger resistances, quirks, trinkets.
- **Threshold crossings fire affliction check**: `if (hero.stress >= 100 && !hero.hasResolve) RollAffliction()`.
- **Affliction state is a hero mode** (like a stance): modifies which skills they'll use, applies per-turn effects.

## Balance Probes

- Player's average stress gain per room should be ~5–15 (low-threat dungeon) or 20–40 (boss dungeon).
- Stress heal rate: ~10–20 per fight from stress-heal skills.
- Net: a Long dungeon should leave the party at ~60–90 stress average on success — stressful but manageable.
- Affliction % should feel like "several times per dungeon" (3–5 times across 4 heroes × 8 rooms).

## Mod Considerations

- Stress rules are tightly coupled to enemy design and dungeon pacing. Modders must tune together.
- Some popular mods reduce affliction % / add Virtue chance — which Red Hook intentionally rejects as "missing the point."
