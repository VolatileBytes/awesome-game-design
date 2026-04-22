# Combat Design — Hades

Hades combat is **arcade with depth**: quick 2–4 minute rooms, tight button set, huge build variance.

## Room Structure

Each chamber follows the same rhythm:

1. **Enter** (0.5s fade-in; enemies spawn staggered).
2. **Clear** — kill all enemies (wave count 1–3 depending on chamber).
3. **Reveal reward** — red-glowing urn appears in the center.
4. **Pick up reward** → door to next chamber opens.
5. **Walk through door** → load next chamber (seamless transition, not loading screen).

Rooms 1–14 of Tartarus loop the same ~30 room templates; RNG shuffles enemy sets and layouts.

## Enemies

~40 base enemy types across 4 regions + variants (armored, elite, revenge). Each telegraphs differently:

- **Numbskulls** (Tartarus): melee charge, tells with crouch.
- **Wretched Thugs**: ranged shots, tells with flash.
- **Bone Hydras**: ranged + summon; needs target priority.
- **Voidstones/Dire Gorgons**: AoE ground patterns, dodge via movement not dash.
- **Minotaurs** (Elysium elites): parry-able charge; pattern memorization key.
- **Theseus chariot**: staged boss with weapon swaps; teaches "adapt-or-die."

### Enemy Design Rules

1. **One primary tell, one timing.** A Wretched Thug only does their "big shot" — no surprise attacks.
2. **No homing past ~0.5s.** Projectiles commit to an arc so dashes can read the pattern.
3. **Colors indicate affiliation.** Red = hostile, purple = void, gold = elite.
4. **Elites have audio cue.** A low gong plays when an elite enters the room.

## Damage Pipeline

```
Damage event
   ↓
Apply attacker damage modifiers (Boons: +damage, crit rolls)
   ↓
Apply status modifiers on target (Vulnerable ×2, Weak -30%)
   ↓
Apply armor reduction (bosses / elites have armor value)
   ↓
Apply defender damage mods (Athena's dash-strike shield block)
   ↓
Subtract from HP → spawn damage number → play hit reaction
   ↓
If HP ≤ 0 → death VFX + resource drops
```

All math is **integer**. Float damage would break Codex counters.

## Status Effects

| Status | Effect | Source |
|---|---|---|
| Weak | -30% damage dealt | Aphrodite |
| Doom | damage delay — applied after 1.1s | Ares |
| Chill | slow (stacks up to 10) | Demeter |
| Hangover | 10 DoT over 4s (stacks) | Dionysus |
| Jolted | +50% next shock damage | Zeus |
| Exposed | +10% to back attacks | Artemis |
| Charmed | temporarily allied | Aphrodite (Duo) |
| Scorched | burning DoT | Hestia |
| Marked | +crit | Artemis |

Statuses are data-driven (see Unity SO design). Each status has: stacks cap, duration, tick interval, damage-on-tick, on-apply VFX.

## Call of the God

A meter fills as you take damage. Once full, the RT/R2 button fires a god-specific ultimate:

- Zeus's Aid: big stationary AoE.
- Athena's Aid: temporary invulnerability.
- Demeter's Aid: giant slow-cone.

Calls add a "panic button" layer — emergency healing/clearing when overwhelmed.

## Bosses

Each boss has **3 phases**, triggered at HP thresholds:

- **Phase 1** (full → 66%): telegraphed patterns; easy to read.
- **Phase 2** (66% → 33%): add a new attack; mix patterns.
- **Phase 3** (33% → 0%): escalate intensity; boss powers visibly up.

Boss arenas are bigger than normal rooms, with no dash-through walls. Arena hazards (Asterius charges into pillars breaking them) create dynamic cover.

## Heat (Pact of Punishment)

Escape-completion unlocks the Pact. Apply Heat modifiers to tune difficulty:

| Condition | Heat cost | Effect |
|---|---:|---|
| Hard Labor | 1–4 | +20% enemy damage per stack |
| Lasting Consequences | 1–4 | -1 max HP restore per Fountain |
| Convenience Fee | 1–4 | +10% shop prices |
| Jury Summons | 1–2 | +1 enemy type per room |
| Extreme Measures | 1–4 | bosses gain new attacks (readability-preserving) |
| Forced Overtime | 1–2 | enemies hit harder over time |
| Tight Deadline | 1–3 | timer per region |
| Approval Process | 1–2 | fewer Boon choices per pick |
| Calisthenics Program | 1–2 | enemies gain +25% HP |

Up to 32 Heat on a single weapon. Each Heat level unlocks the next weapon's reward slot.

## Balance Philosophy

Supergiant's balance target: **a skilled player with no Boons can clear base-difficulty runs**. Every build works eventually; Boons are tools to make clears faster, not prerequisites. This keeps new-weapon onboarding gentle.

## Test Targets

- Every weapon + aspect clears 32 Heat at least in theory (seed audited).
- Every Boon's damage number matches its tooltip.
- No enemy attack is undodgeable from starting room position.
- Frame-perfect dash-cancel works on every weapon combo.
- Hitbox sizes match visual sprites within ±8px.
