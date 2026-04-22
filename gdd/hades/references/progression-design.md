# Progression Design — Hades

Hades has **six interlocking progression tracks**. A player isn't always climbing all six, but at any moment 2–3 are progressing.

## Track 1: Story Escapes

The canonical story requires ~10 completed escape runs (reach Hades, defeat him, see ending). Each escape:
- Triggers new story beats on return to hub.
- Unlocks new NPC dialogue.
- Adds Persephone / surface story layers post-first-escape.

**Credits** roll after the 10th escape (roughly). Most players hit this around 40 hours.

## Track 2: Mirror of Night (persistent passives)

12 Mirror nodes; each has 2 mutually-exclusive paths. Upgrade with **Darkness** (dark-glowing currency from rooms).

| Mirror node | Path A | Path B |
|---|---|---|
| Shadow Presence / Chthonic Vitality | dash-strike damage+ | max HP+ |
| Infernal Soul / Stubborn Defiance | more Cast ammo | 2nd chance revive |
| Greater Reflex / Ruthless Reflex | +1 dash | slow during Cast |
| Boiling Blood / Abyssal Blood | +damage vs enemies ≥ full HP | +damage low HP |
| Deadly Strike / Ambrosial Kiss | +crit chance | healing boost |
| Fiery Presence / Thick Skin | +damage per kill streak | -damage taken |
| Privileged Status / Family Favorite | better Boon rarity | cheaper items |
| Gods' Pride / Gods' Legacy | higher starting Boon tier | Boons stacked from prior runs |
| Olympian Favor | gods appear more often |
| Dark Foresight | see Boon reward icons earlier |
| Fated Authority | reroll Boons |
| Fated Persuasion | reroll room rewards |

Mirror: ~500–2000 Darkness per node. Total ~30 runs worth of Darkness.

## Track 3: Weapon Mastery (Infernal Arms + Aspects)

- Unlock weapons: 4 Chthonic Keys each (from Elysium chests, first-clear rewards).
- Unlock weapon **aspects**: Titan Blood (rare drop from boss first-clears per region per weapon).
- Hidden Aspects: reveal backstory via specific keepsake + dialogue conditions (e.g. Chaos Aegis requires interacting with Chaos many times with the shield).

A completion-focused player unlocks all 24 aspects and pumps them all to max mastery.

## Track 4: Pact of Punishment (Heat)

Post-first-escape, the Pact appears. Escalate difficulty to earn rewards:

- Each weapon has 5 reward slots: Darkness, Gemstones, Diamonds, Ambrosia, Titan Blood.
- Each slot requires reaching a new Heat threshold: 1, 2, 3, 4, 5 Heat for first pass; 8, 10+ for later.
- Higher Heats demand smarter play — Hard Labor + Extreme Measures is a sharp difficulty jump.

Heat gives the game its endgame spine: 32 Heat × 24 aspects = 768 completion cells.

## Track 5: Relationships (Social)

21 gift-eligible NPCs, each at 10 Nectar + 1 Ambrosia for "Companion" tier.

- **Nectar** is earned in runs; gifting a Nectar advances a relationship.
- **Ambrosia** is rare (Pact / shop); locks in the max tier.
- Each relationship has a cutscene line, an outfit/interaction unlock, and some unlock a **Keepsake** (equippable run effect).
- Some relationships gated by story progress (Persephone only unlocks post-escape).

## Track 6: House Contractor

Spend **Gems** (common) and **Diamonds** (rare) on environmental upgrades:
- Fountain of Styx (HP restore in hub).
- Infernal Troves (bonus chests in the Underworld).
- Well of Charon (buy consumables mid-run).
- Urn variants, decoration, Zagreus's room cosmetics.

Long tail of contractor projects (100+ items) gate light story dialog.

## Currency Overview

| Currency | Earned from | Spent on | Persistence |
|---|---|---|---|
| Darkness | Any room | Mirror of Night | Permanent |
| Gemstones | Rooms (bonus) | Contractor | Permanent |
| Nectar | Chests, Charon | Gift to NPCs | Used up on gift |
| Ambrosia | Pact rewards | Gift max-tier | Used up on gift |
| Keys | Chests | Unlock weapons, unlock Mirror nodes | Permanent |
| Titan Blood | Boss first clears | Upgrade weapon aspects | Permanent |
| Diamonds | Pact rewards, high-Heat | Contractor high-tier | Permanent |
| Obol | In-run drops | Charon shop | Lost on run end |

## Run Economy

Within a run:

- **HP**: max 50 base (scales with Mirror); restored by **Fountains** (1 per region) and **Centaur Hearts** (rare drops).
- **Obol**: 50–200 per run typical; shop prices 80–300 per item.
- **Bloodstones**: 3 cast ammo, recoverable on pickup.
- **Boon count**: 15–25 by end of successful run.

## Unlock Cadence (by escape count)

| Run # | Unlocked |
|---|---|
| 1 | Meg fight (tutorial gate) |
| 2–5 | Mirror base nodes, dialogue expansion |
| 6–10 | Most NPCs visible; first escape typical |
| 10–20 | All weapons unlocked; aspect unlocks begin |
| 20–40 | Heat climb; relationships maxing |
| 40–80 | Aspects mastered; Pact combinations mastered |
| 80+ | Hidden aspects; highest Heat; completion grid |

Pacing target: every 2–3 runs, at least one unlock event. Runs never feel empty.

## Gifting & Pacing

The gifting system creates a **dialog budget**:
- Each NPC has a line queue (sometimes 30+ lines).
- You can only advance 1 line per interaction per return to hub.
- Nectar lets you "jump" part of the queue.
- This pacing ensures story discovery feels continuous — the game doesn't dump its writing all at once.

## Design Lessons

- **Multiple axes means no dead runs**: even a failed run advances gifting, darkness, dialogue.
- **Long tail with many short hooks**: dozens of small goals beat one big grind.
- **Heat gives endless endgame**: once relationships maxed, Heat provides dozens more runs of skill progression.
