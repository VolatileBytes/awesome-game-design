---
id: hades
title: Hades
version: 0.1.0
description: Isometric action roguelite set in Greek mythology. Escape the Underworld as Zagreus, son of Hades, using weapons and god-granted Boons. Death is canon — each run reveals more story, characters, and upgrades.
tags: [pc, mobile, console, action, roguelike, roguelite, indie, single-player, hack-and-slash, narrative]
engines: [unity]
---

# Hades

Hades (2020, Supergiant Games) proved that roguelites can tell a real story. Play as Zagreus, trying to escape the Underworld; die, return to the House of Hades, talk to Olympian gods and the staff. Each death is a chapter. 50+ hours to "complete" the narrative across dozens of escape attempts.

## Pillars

1. **Failure is progress** — dying is *the* canonical way to advance story; there is no bad run.
2. **Moment-to-moment feel** — dash-attacks, responsive hitboxes, parries, perfect 60fps combat on any hardware.
3. **Build diversity** — 6 weapons × 4 aspects × 10 gods of Boons × rare synergies = thousands of build permutations.
4. **Writing first** — fully-voiced cast (40+ characters), dialogue changes based on every run, relationship building.
5. **Visual clarity** — painterly 2D art, but every enemy attack telegraph is readable at a glance.

## Core Loop

```
House of Hades (hub)
  → talk to characters, gift nectar, upgrade Mirror of Night with Darkness
  → choose weapon + aspect at the Urns
  → enter Tartarus (chamber 1)
    → kill all enemies → choose room reward (Boon/gold/Darkness/...)
    → proceed through ~14 chambers + miniboss (Megaera/Alecto/Tisiphone)
  → enter Asphodel (chamber 2) → miniboss (Hydra variants)
  → enter Elysium (chamber 3) → miniboss (Theseus + Asterius)
  → enter Styx/Temple (chamber 4) → final boss: Hades himself
  → win OR die → return to House → resources persist
```

A single run: 30–50 minutes. Full story clear: 50–80 hours.

## Characters & Boons

Ten Olympians + minor gods grant **Boons** — persistent run-scoped blessings that modify your attacks/specials/casts/dashes:

- **Zeus** — chain lightning, jolted status.
- **Poseidon** — knockback, wave splash, damage on impact.
- **Athena** — deflect, reduced incoming damage, dash-strike block.
- **Aphrodite** — weak status, charm status on enemies.
- **Ares** — Doom status (damage delay), blades.
- **Artemis** — crit chance, seeking arrows.
- **Dionysus** — Hangover (stacking DoT), festive fog.
- **Demeter** — chill (slow), frost damage.
- **Hermes** — speed, dash recovery, rush attacks.
- **Hestia** — scorch (dot), searing effects (secret to late game).

Boons stack additively in categories. **Duo Boons** require 2 specific gods at specific tiers. **Legendary Boons** require specific gods + prerequisite combos.

Goal of a run: a coherent build — e.g. Aphrodite-weak + Dionysus-hangover + Demeter-chill = slow cripple build.

## Weapons (Infernal Arms)

6 base weapons, each with 4 **aspects** (variant forms):

| Weapon | Aspects |
|---|---|
| Stygian Blade (sword) | Zagreus, Nemesis, Poseidon, Arthur |
| Varatha (spear) | Zagreus, Achilles, Hades, Guan Yu |
| Aegis (shield) | Zagreus, Chaos, Zeus, Beowulf |
| Coronacht (bow) | Zagreus, Chiron, Hera, Rama |
| Malphon (fists) | Zagreus, Talos, Demeter, Gilgamesh |
| Exagryph (rail gun) | Zagreus, Eris, Hestia, Lucifer |

Each weapon has 3 aspects unlocked via Titan Blood + base Aspect; Hidden Aspects unlock by revealing backstory.

## Progression

**Permanent (run-to-run):**
- **Mirror of Night** — spend Darkness on 12 passive upgrades (HP, dash-strike damage, starting Boon rarity, second life).
- **Pact of Punishment** (post-first-clear) — 30+ "Heat" modifiers stacked for +reward; up to 32 Heat per weapon.
- **Keepsakes** (36 total) — carry one per run, grants effect + god bias.
- **Codex** — entries unlock as you meet/learn.
- **Relationships** — 20+ NPCs with gift → level → epilogue arcs.
- **House contractor** — spend Gems + Diamonds on environmental unlocks.

**Run-scoped:**
- Health, obol (gold for shops), keys (for upgrades), nectar/ambrosia (for gifts), Titan Blood.
- Boons, Boon levels, Pom of Power (Boon upgrade fruit), Daedalus hammers (weapon upgrades).

## Writing & Story

- 60+ distinct characters with full VO.
- ~21,000 unique voice lines.
- Dialogue system reacts to: current weapon, current Boon, recent deaths, items gifted, which god you just saw.
- Story beats trigger at predetermined run counts (10 escapes is a rough target for "credits").
- Post-credits: infinite content via Heat system + secret stories (Persephone, Hypnos's journal, etc.).

## Engine

Original: Supergiant's proprietary **SGE** engine (also used for Bastion/Transistor/Pyre), C# core, custom tooling. Rebuild target: Unity — isometric 2D with URP, for cross-platform reach (Steam Deck, Switch, iOS).

## References

- [3C Spec](references/3c-spec.md)
- [Combat Design](references/combat-design.md)
- [Boon System](references/boon-system.md)
- [Progression Design](references/progression-design.md)
- [Narrative System](references/narrative-system.md)
- [Unity Implementation](engines/unity/GDD.md)
