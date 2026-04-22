# Progression Design — Risk of Rain 2

Two progression axes: **permanent unlocks** (survivors/items/alt skills) and **in-run items**. Almost everything gate-unlocked via achievements ("Challenges").

## Challenges (Unlock Gates)

~150+ challenges. Each unlocks:
- A new item (added to drop pool).
- A new equipment.
- A new survivor.
- An alt skill for a survivor.
- A skin / alt cosmetic.

Examples:
- **"Start"**: boot the game once → unlock Commando.
- **"Pause"**: beat game once as Commando → unlock Huntress.
- **"Naturopath"**: reach stage 5 without healing → unlock Rejuvenation Rack.
- **"The Demons and the Crabs"**: find 3 Newt Altars in one run → unlock Bazaar access.
- **"Obliterate at the Obelisk"**: end a run via Obliteration → unlock Artificer.
- **"Warrior"**: reach Hard difficulty on 7 stages → unlock Alloy Vulture item.

Players check their unlock log from the menu; completion is a soft 100% goal.

## Survivor Unlocks

13 base survivors, each unlock-gated:

| Survivor | Gated by |
|---|---|
| Commando | default |
| Huntress | clear 3 stages |
| MUL-T | clear 4 stages |
| Engineer | clear 30 stages (cumulative) |
| Artificer | Obliterate yourself |
| Mercenary | obliterate (alt condition) |
| Bandit | beat stage 3 without dying |
| REX | repair broken robot item on Abyssal Depths |
| Loader | beat Loader boss |
| Acrid | find hidden container in Rallypoint Delta |
| Captain | beat the game (Mithrix) |
| Railgunner | DLC-gated |
| Void Fiend | DLC-gated |

Unlocking order matters for new players — some later survivors (REX, Loader) require specific stages.

## Alt Skills

Each survivor has 4 skill slots × ~2–4 alt skills per slot. Alts unlock via:

- Survivor-specific challenges (e.g. Commando's alt utility requires clearing a stage without taking damage).

Alt skills drastically change a survivor. Commando's **Phase Round** (primary alt) is a piercing slug vs. the base dual pistols — completely different playstyle.

## Logbook Entries

Every enemy type has a logbook entry, unlocked by:
- Killing one (for most enemies).
- Finding a container they guard.
- Story-specific triggers (Mithrix logbook requires beating him).

Logbook entries contain lore, stats, and item behaviors. Not required but lore-hungry players fill them.

## Items Unlocked via Challenges

Of ~200 items, ~130 are unlock-gated. Running as a new player, your chest pools are filtered to only unlocked items. This naturally grows the loot pool run-over-run.

## Artifacts

16 artifacts; each unlocked by entering a code (found via hidden lore) at the Sky Meadow bulletin. Examples:
- Artifact of Command (hand-pick items).
- Artifact of Glass (5x damage, 1 HP).
- Artifact of Kin.

Each one changes how runs play. Mix-and-match is endgame.

## Eclipse Mode (Endgame)

Per-survivor, 8-tier stacking Eclipse:
- E1: teleporter charge faster, no one-shot protection.
- E2: shop prices +25%.
- ...
- E8: all prior + HP degrades over time, every hit ticks away max HP.

Beating E8 with all survivors is the platinum achievement (hundreds of hours).

## Prismatic Trials

Daily seeded run — everyone plays the same seed. Leaderboard-driven. Short single-stage.

## Currency Track

| Currency | Scope | Earned | Spent |
|---|---|---|---|
| Gold | in-run | Kills, breakables | Chests, shrines |
| Lunar Coins | persistent | Rare enemy drop (~1/run), also challenge rewards | Lunar pods, Bazaar items |
| XP (soft) | persistent | End-of-run | Unlock banner ranks (cosmetic) |

Lunar Coins trickle slowly — an 80-hour player accumulates ~200 coins, enough for ~40 lunar pickups.

## Long-Tail Motivation

- **Completion percentage** visible on title screen.
- **Per-survivor stats** tracked.
- **Leaderboards** (Prismatic Trial + Eclipse times).
- **Seasonal events** (Halloween skins etc).
- **Community challenges** (external: modding community for self-imposed "no item" runs, speedruns).

## Rebuild Scope

For a minimum viable rebuild:
- 4 survivors (Commando, Huntress, Engineer, Artificer).
- 50 items.
- 6 stages.
- 3 difficulty modes.
- 1 boss per stage + Mithrix.
- Eclipse deferred.

This captures the loop but is ~20% of the content. Full scope demands years of DLC-style expansion.

## Co-op Progression

Host/client state:
- **Unlocks are per-player** (your unlock pool persists on your account).
- **Mid-run pool** uses host's unlock intersection with clients' pools (can be configured to use union).
- **Challenges** can be completed as either host or client.

Co-op is the motivation vector for many players — the "hey let's stack Ceremonial Daggers" moment.
