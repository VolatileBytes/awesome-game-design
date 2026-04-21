# Economy

CoC has **three in-game resources** and **one premium currency**, plus magic items.

## Resources

| Resource | Source | Sink |
|---|---|---|
| **Gold** | Gold mines, raid loot | Upgrading most defensive buildings, walls |
| **Elixir** | Elixir collectors, raid loot, clan games | Upgrading army buildings, troops, walls (later) |
| **Dark Elixir** | Dark elixir drills, raid loot | Upgrading heroes, dark troops, dark spells |
| **Gems** (premium) | Small free trickle, purchases | Accelerate builders, skip timers, buy builders, decorations |

## Storages

Every resource has storage buildings that cap how much you can hoard. Upgrading storages raises the cap.

- **Gold Storage** / **Elixir Storage**: each upgrade ~+50–100k cap
- **Dark Elixir Storage**: ~+5-20k cap
- Later TH levels support multiple storages

Storage cap is a hidden progression gate. Many upgrades cost more than current storage holds, forcing the player to upgrade storage first.

## Raid Loot

- When you attack, you steal a percentage of the target's **available loot**
- Loot is bounded — you can't steal infinite; the defender keeps a reserve
- Loot percentages depend on TH level differences (attacking lower TH = reduced loot)
- **Dead bases** (inactive players) are loot gold mines and the bread and butter of early-mid game farming

## Defender Loot Retention

- When you are attacked, you lose a fraction of your resources (capped)
- **Shield** prevents further attacks after a heavy loss
- **Town Hall loot bonus**: if the attacker destroys your Town Hall, they get a bonus loot chunk; the defender gets a shield boost
- This is why some mid-game strategies **place the Town Hall outside the walls** (encourages attackers to take it → shield the defender, so they don't get fully raided)

## Gem Economy

Gems are the premium currency. Sources:

| Source | Rate |
|---|---|
| **Achievements** | 1,000+ gems over the course of the game |
| **Gem box** in village (random spawn, chop it) | ~25 gems/week |
| **Clan Games** | 100s per biweekly event |
| **Gold Pass premium** | Moderate gems |
| **Shop purchases** | Main source, $5 = 500 gems, steep curve |

### Primary Gem Sinks

- **Extra builders** (very expensive: 500 / 1000 / 2000 / 6000 gems for the 3rd / 4th / 5th / pet-related builders)
- **Skip build timer** (cost scales with time remaining)
- **Training boost** (10× training speed for a day)
- **Resource boosters** (2× collector rate for a day)
- **Cosmetic decorations** (vanity)

### "Walk-away" design

CoC is explicitly designed so that **you cannot complete it by paying**. Even spending $10,000 gets you upgrades faster but not a maxed-out account immediately — the longest upgrades have minimum completion times that can't be gem-skipped past a certain threshold. This is a deliberate anti-whaling guardrail.

## Gold Pass (Season Pass)

- **$4.99/month**, matches industry standard
- Benefits listed in progression doc; key benefits are the **Research Boost, Builder Boost, Training Boost, Season Bank**, plus hero skins and gems
- **Most efficient monetisation purchase in the game** — not even close to other gem packs
- The game telegraphs this via prompts ("Your season is X% complete! Consider the Gold Pass.")

## Shop

Organised into:
- **Featured** — time-limited deals, usually Gold Pass-adjacent
- **Resources** — gem-for-gold/elixir/DE packages
- **Magic Items** — gem-for-item (Books, Hammers, Runes, Potions)
- **Decorations** — cosmetic village items
- **Boosters** — time-limited boost buys

## Clan Castle Donations

- Clanmates can donate troops and spells into your Clan Castle
- The CC stores troops for **both attack and defense**
- Donating increases your clan reputation and unlocks clan levels
- **No money changes hands**; this is a goodwill economy — and it is huge. Top clans trade donations like candy.
- Donations have caps (per day, per request) to prevent carry abuse

## Magic Items (Resource-Adjacent)

| Item | Effect | Cost range |
|---|---|---|
| Book of Building | Instant finish a build timer | Very rare |
| Book of Heroes | Instant hero upgrade | Very rare |
| Book of Fighting / Spells | Instant lab research | Rare |
| Hammer of Building / Heroes / Spells / Fighting | Instant + free upgrade | Extremely rare |
| Rune of Gold / Elixir / DE | Fill storage | Common |
| Potion of Power / Heroes / Hero Prowess | Time-limited boost | Common |

Books and Hammers are **savings accounts** — players save them for the most expensive upgrades. The game rewards this discipline by offering them as sparse rewards.

## Anti-Patterns

- **Pay-to-skip-everything.** CoC deliberately caps how much gem-skipping can accelerate. Don't remove this cap in a clone.
- **Hiding loot math.** Players will reverse-engineer loot formulas anyway. Make them legible; the game is more trustworthy for it.
- **Excessive ad impressions.** CoC does not run ads (no rewarded video, no interstitials). If you add them, they must be opt-in and non-disruptive.
- **Loot box mechanics.** The Clan Games chest is not a loot box — it's a known-reward pick. Avoid gacha framing for resources.

## Minimum Viable Economy

If you were building a lighter CoC-like:
1. Two resources (gold + something else like wood) with storages and collectors
2. A premium currency for skip/builder purchases
3. Raids stealing a loot percentage, capped
4. Shields on heavy loss
5. A Gold Pass-style monthly subscription
6. Clan donations
7. Magic items / skip timers

Everything else — dark elixir, pets, super troops, siege machines, CWL — is additive on top.
