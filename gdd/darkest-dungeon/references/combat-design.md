# Combat Design — Darkest Dungeon

Combat is turn-based, positional, and statistical. Each decision has 3–5 meaningful factors; the "right" choice is rarely obvious.

## Turn Structure

```
1. Each combatant rolls SPD + d8 for initiative.
2. Sort descending; ties broken by random.
3. On a combatant's turn:
     a. If stunned → skip; remove stun tokens.
     b. Tick statuses (bleed, blight deal their damage).
     c. Active turn: pick action.
     d. Resolve action (hit/miss, crit, damage, apply statuses).
     e. Apply reactions (retaliate, counter if triggered).
4. End-of-turn: refresh stances, advance mark/guard counters.
5. If party wiped → run fails. If enemies wiped → loot + end encounter.
```

## Actions

- **Skill**: each hero picks 4 of 7 skills for the dungeon.
- **Move**: shift left/right 1 rank (some skills allow more movement).
- **Pass**: skip turn (rarely useful).
- **Item**: provisions, trinkets with active use, torch management.
- **Guard**: if skill grants it — bodyguard an ally.
- **Retreat**: flee encounter (costs resources, stress).

## Skill Attributes

Each skill has:

- **Usable from ranks**: [1,2,3,4] flags — which ranks the user must be in.
- **Targets ranks**: [1,2,3,4] — which enemy ranks can be targeted.
- **Damage range**: [min, max].
- **Accuracy bonus / penalty**: +/− modifiers.
- **Crit chance**: +/−.
- **Self-effects**: move self N ranks forward/back after skill.
- **Target effects**: Bleed X for N turns, Blight, Stun, Mark, Debuff, Buff, Heal, Stress deal/heal, Shuffle.

Example: **Crusader Smite**
- Usable from 1, 2
- Targets 1, 2
- Damage 1.0× (modifier)
- Crit +5%
- Bonus: +15% damage vs. Unholy enemies

## Damage Math

```
roll damage range → D
adjust for crit (auto ×1.5 damage)
adjust for damage modifier (buffs, debuffs, trinkets)
adjust for target PROT (protection = flat damage reduction %)
apply stance/quirk modifiers
final_damage = max(1, floor(D))
```

If target's PROT is 40%, it reduces by 40%. No crit can be fully-mitigated.

## Accuracy & Dodge

```
hit_chance = attacker.accuracy - target.dodge
  + skill_accuracy_mod
  + position_modifier (backline enemies vary)
```

Accuracy capped at 95% (crits can miss).

## Crit Chance

```
crit_chance = base (5-10%) + skill_crit_mod + buffs + quirks
  − enemy dodge/prot reductions (no — crits are just chance)
```

Crits:
- Deal 1.5× damage.
- Reduce target's Stress by 3 (hero crits).
- Deal +stress to target if enemy crits on hero.
- Trigger narrator line.
- Refresh some passives.

## Statuses

| Status | Effect | Duration |
|---|---|---|
| Bleed | X/turn HP damage | N turns |
| Blight | X/turn HP damage (poison) | N turns |
| Stun | skip next turn | 1 turn (rarely 2) |
| Mark | next attacker gets +crit; some skills do bonus dmg | N turns |
| Dodge buff | +X dodge | N turns |
| Dmg buff | +X% damage | N turns |
| Prot buff | +X% PROT | N turns |
| Stress +/- | over time | N turns |
| Debuff (various) | -ACC, -DMG, -PROT, etc. | N turns |
| Guard | redirect attacks targeting ally to self | N turns |

Bleed and Blight resisted via **RES stats** — BleedRES, BlightRES (0–100%).

## Positions

Formation is a core puzzle:
- **Rank 1 (front)**: usually tanks, melee DPS.
- **Rank 2**: melee/support hybrid.
- **Rank 3**: ranged/support/debuff.
- **Rank 4 (back)**: ranged DPS, healers.

**Shuffle attacks** force heroes to swap positions. When this happens, many of your skills become unusable until you reposition — which also costs turns.

## Camping Skills

In medium+ dungeons, camp 1–2 times:
- Fire lit with torch (safe turns 4).
- Each hero uses 1–4 camping skill slots (pre-selected at Survivalist).
- Camp skills: heal HP, heal stress, buff next fight, remove disease, etc.
- Ambush risk: in some camps, a monster wave attacks mid-camp.

## Death's Door

When HP reaches 0:
- Hero is at Death's Door (special state).
- +33% dodge, +X resistances.
- Next damage roll: % chance to survive; if failed → death.
- Heal back to 1+ HP to exit Death's Door (but "Death's Door Recovery" gives big debuff next turn).

Death is permanent — hero goes to Graveyard.

## Boss Fights

Each region has ~5 bosses across difficulty tiers:

- **Necromancer** (Ruins, apprentice): summons skeletons.
- **Hag** (Weald): stuffs hero in cauldron → disabled.
- **Swine Prince + Wilbur** (Warrens): two-unit fight.
- **Siren** (Cove): charms heroes → fight own party.
- **Flesh** (Ruins): multi-part boss, appendages.
- **Drowned Crew** (Cove).
- **Shrieker** (apprentice): steals trinkets → must chase.
- **Pounding Flesh** (Darkest Dungeon final).
- **Shambler** (rare event): high-level ambush; ultra-dangerous.

Bosses have scripted attack patterns — memorizable, counterable with preparation.

## Radiant vs. Darkest Mode

- **Radiant**: weeks shorter, heroes level faster, less grind. 40-hour target.
- **Darkest**: original vision; heroes who level past dungeon's difficulty tier refuse to return → forced to recruit fresh for higher-tier missions.
- **Stygian** (DLC): hardcore — limited deaths, timer.

## Design Philosophy

Red Hook's combat design ethos:
- **No perfect build**: every party has weaknesses.
- **Risk is real**: you must accept that heroes WILL die.
- **Recovery > prevention**: healers > dodges; the game expects hits.
- **Trinkets are meaningful**: not flat % buffs, often have tradeoffs.

## Testing

- Every skill usable in its declared ranks.
- Every target filter (ranks / enemy positions) resolves correctly.
- Crit damage = 1.5× base; no exceptions unless explicit skill mod.
- Bleed/Blight tick at proper turn phase.
- Status resistance caps at 100%.
- AI prioritization: does enemy AI act per its design data correctly?
- Balance probes: simulate 10k random parties vs each boss → track win rate.
