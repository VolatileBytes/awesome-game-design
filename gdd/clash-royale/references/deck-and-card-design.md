# Deck & Card Design

This is the highest-leverage design document in the game. Balance, meta, and player skill all route through the card/deck system.

## Card Structure

Every card has:
- **Cost** (1–9 elixir)
- **Rarity** (common, rare, epic, legendary, champion)
- **Type** (troop, building, spell)
- **Attributes** depending on type:
  - Troops: HP, DPS, targeting (air/ground/both/buildings-only), range (melee/ranged/sight), speed, count (singleton/pair/swarm), deploy time, special abilities
  - Buildings: HP, DPS (or none if passive), lifetime, deploy time, special abilities
  - Spells: damage, radius, duration, stun/effect, deploy delay

## Card Roles

A card fits one or more roles:

| Role | Description | Example |
|---|---|---|
| **Win Condition** | Can take a tower alone if untouched. Deck is usually built around 1. | Hog Rider, Giant, X-Bow, Graveyard, Balloon |
| **Tank** | High HP, soaks damage, enables the push | Giant, Golem, Mega Knight, PEKKA |
| **Mini-Tank** | 3-5 elixir, mid HP, flexible | Knight, Ice Golem, Valkyrie |
| **Splash Damage** | AoE, kills swarms | Valkyrie, Wizard, Bomber, Baby Dragon |
| **Swarm** | Low HP, multiple units | Skeleton Army, Minion Horde, Goblin Gang |
| **Air** | Can hit air / is air itself | Minion, Baby Dragon, Inferno Dragon |
| **Support / DPS** | Behind a tank, melts targets | Musketeer, Archer, Princess |
| **Spell (small)** | 1-3 elixir, cycles, cleans up small threats | Log, Zap, Barbarian Barrel |
| **Spell (medium)** | 3-4 elixir, value trade | Fireball, Poison, Arrows |
| **Spell (big)** | 6 elixir, finisher | Rocket, Lightning |
| **Building (defensive)** | Soaks, deflects, distracts | Tesla, Cannon, Inferno Tower, Bomb Tower |
| **Building (offensive)** | Wins match if unpunished | X-Bow, Mortar |
| **Cycle** | ≤2 elixir, return the win condition to hand faster | Skeletons, Ice Spirit, Fire Spirit |
| **Utility** | Specialised (freeze, rage, mirror, clone, graveyard) | Freeze, Rage, Mirror |

A well-built deck **covers 5–7 roles with 8 cards**. No deck covers all roles; missing roles are the deck's **matchup weakness**, by design.

## Card Archetypes (Deck-Level)

### Beatdown
- Big tank + support + cycle + spells
- Plays from the back → builds giant push as elixir recharges
- Average elixir cost: 4.0–4.4
- Win condition: Giant, Golem, Lava Hound, Electro Giant
- Weakness: cycle decks that outpace, strong spells that kill support

### Cycle
- Cheap win condition + cycle cards + small spells
- Plays fast, cycles the win condition to hand repeatedly
- Average elixir cost: 2.6–3.2
- Win condition: Hog Rider, Miner, X-Bow (cycle variant), Royal Hogs
- Weakness: big tank pushes that survive a cycle rotation

### Control
- Defensive cards + counter-attack units + 1 win condition
- Plays reactively, waits for opponent commits, counter-pushes
- Average elixir cost: 3.4–3.8
- Win condition: Miner, Graveyard, Mega Knight, Royal Giant
- Weakness: siege/X-Bow (hard to pressure), fast rushes

### Bait
- Multiple swarms/buildings that bait a specific spell (usually Log)
- Forces the opponent to burn a small spell, then punishes
- Average elixir cost: 3.0–3.4
- Weakness: opponents with multiple small spells; splash units

### Siege
- X-Bow or Mortar in the back lane, defends around them
- Slow, defensive, grindy
- Average elixir cost: 3.0–3.5
- Weakness: tanks that reach the siege building, Rocket spell

### Hybrid / Bridge-Spam
- Mini-tank + win condition at bridge → constant pressure
- Average elixir cost: 3.4–3.8
- Weakness: strong defence in both lanes

## Elixir Economy (Match-Level)

The match is a **continuous trade game**. Every card you play is an elixir cost; every card your opponent plays to counter is also an elixir cost. The difference is the **trade**.

- **+1 elixir trade**: you spent 3, killed their 4 — you're +1
- **-2 trade**: you spent 5, killed their 3 — you're -2
- **Neutral trade**: equal elixir, both cards die

Over 3 minutes, accumulated trades determine who has "elixir advantage" and can push. A 4-elixir advantage is the rough threshold at which a push becomes unanswerable.

### Designer's Rule

Every card's design is **benchmarked against its expected counters**. A 4-elixir card should be beatable by a 3-elixir counter played correctly (so playing the 4-elixir card is a commitment, not a free action). If any card has no 4-or-cheaper counter, it becomes meta-defining (usually badly). This rule is why the roster reads like a rock-paper-scissors chart: every strong card has 2–3 cheap answers.

## Balance Process

### Patch Cadence

- **Balance update every 2 weeks**
- **Meta rebalance every quarter** (a larger pass with 4–8 cards touched, often reworks)
- **New cards every 2 months**, paced so the roster grows but doesn't explode

### Change Types

- **Stat tweak**: ±5–10% HP/DPS/duration. Most common. Low risk.
- **Rework**: a card's mechanic changes (e.g. Witch summons skeletons faster, Balloon's death bomb radius shrinks). Medium risk.
- **New card**: adds a new role or shakes an existing one. High risk; telemetry shows the first 2 weeks after a new card are always meta-volatile.

### What Balancing Is Actually About

Balancing is not "make every card equally strong". It is:
- **Ensuring at least 5–8 decks are tier-1 viable across the archetype grid**
- **Avoiding degenerate matchups** (free win / free loss)
- **Keeping the roster's most-loved cards playable in at least one competitive deck**

A balance team that optimises for "card parity" instead of "deck diversity" will unintentionally create an omni-meta where every deck looks the same.

## New Player Card Curation

- At first trophies, players have ~8-12 cards
- The draft of which card comes first matters — give them:
  - A tank (Giant)
  - A splash damager (Valkyrie or Baby Dragon)
  - A ranged DPS (Musketeer or Archer)
  - A small spell (Arrows or Zap)
  - A cheap cycle card (Skeletons)
  - A building (Cannon or Tesla)
  - A swarm (Minions)
  - A flex spot (Fireball)
- This is a **tutorial-safe** deck that teaches the game's fundamentals

## Testing New Cards

- **Internal PvP** with the design team
- **Sandbox deploys** — new card available in a themed challenge before hitting ladder
- **Training camp** — tutorial bots with tuned AI
- **Staged ladder rollout** — new card available on tournament standard at first, then ladder

Skipping any of these and launching a new card straight to ladder is how meta disasters happen.

## Card Design Checklist (Before Ship)

- Does the card fit at least one role?
- At its cost, is there at least one cheaper counter?
- At its cost, is there at least one equal-cost trade?
- Can it fit into at least 2 deck archetypes?
- Does it interact with a signature keyword (pierce, spawn-on-death, shield, dash, etc.)?
- Is the visual silhouette distinct from existing cards at a glance?
- Does it generate a satisfying play pattern (the moment when it's played well)?

A new card that fails **any** of these usually becomes either dominant (breaks meta) or forgotten (dust in the collection).
