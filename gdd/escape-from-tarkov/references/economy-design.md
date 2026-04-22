# Economy Design — Escape from Tarkov

The economy is the loop after combat. Every rouble is earned per-raid; every piece of loot is a gamble on whether you survive.

## Currencies

| Currency | Role |
|---|---|
| **Roubles** | Primary; used everywhere |
| **US Dollars** | Accepted by some traders (Peacekeeper) |
| **Euros** | Accepted by some traders (Peacekeeper) |
| **Bitcoin (physical)** | Loot item; high rouble value |
| **GPU (physical)** | Loot item; crafting + barter |
| **Barter items** | Specific items required for trader barter trades |

Roubles are the main currency. Dollars/Euros traded to-and-from roubles at trader-bound rates (Skier: 112 RUB/USD).

## Traders

Each trader has:
- **Level** (1-4): gated by player level + completion of specific quests + required Loyalty Level.
- **Stock** (items for sale): restocks every 3 hours.
- **Barter trades** (items needed to acquire a reward item).
- **Insurance**: some traders offer insurance.

### Traders Roster

| Trader | Specialty | Currency |
|---|---|---|
| **Prapor** | Russian surplus weapons, ammo | Roubles |
| **Therapist** | Medical supplies, barter items | Roubles |
| **Fence** | Used goods, fleamarket-ish | Roubles |
| **Skier** | Western weapons, tactical gear | Euros |
| **Peacekeeper** | US Dollars, NATO gear | USD |
| **Mechanic** | Weapon attachments, modding | Roubles |
| **Ragman** | Clothing, armor, armor rigs | Roubles |
| **Jaeger** | Bolt-action rifles, hunting | Roubles |
| **Ref** | Cultist-related, religious loot | Roubles |
| **Lightkeeper** | End-game quest trader | Roubles |

Trader reputation is per-trader; raising it unlocks next tier.

## Flea Market

- Unlocked at PMC level 15.
- Player auction: post items at rouble price.
- Item filter: by ballistic class, condition, mods, etc.
- Daily search limit (fair-use cap).
- Sale fee: ~5-10% of listed price.
- Barters possible (items for items).

Flea = the economic backbone late-wipe. Early wipe, Flea is locked = trader-only meta.

### Flea Market Price Dynamics

Prices fluctuate real-time:
- High-demand items (high-tier ammo, keycards, barter parts): climb mid-wipe.
- Crash when a patch drops loot buffs.
- Economic simulator: BSG intentionally tunes rare items.

## Hideout

Upgradeable base:
- **Stash**: primary inventory.
- **Bitcoin Farm**: GPUs produce BTC over time.
- **Medstation**: craft meds.
- **Lavatory**: craft cleaning items.
- **Workbench**: weapon upgrades, craft weapons, mod repair.
- **Intelligence Center**: quest perks + Flea Market fee reduction.
- **Scav Case**: consume items → random loot after hours real-time.
- **Booze Generator**: craft alcohol.
- **Library**: skill boost via reading.
- **Shooting Range**: train weapon skills.
- **Gym**: strength/endurance training.
- **Heating / Generator / Water Collector**: passive consumables.
- **Air Filtering**: stamina regen.

### Upgrade Costs

Each module has 3+ tiers:
- Raw items (duct tape, wires, tools).
- Roubles.
- Time: 1-48h real-time wait.
- Level gate: min PMC level.
- Prereq modules: dependency tree.

Full Hideout = dozens of hours of gameplay spread over months.

## Insurance

- Pay trader (Prapor/Therapist) to insure item before raid.
- If you die and item is **not looted**: insurance returns item in ~24-48h (real hours).
- If looted: insurance invalid.
- Item condition returned: same as when died.

Insurance = inventory recovery mechanic. Costs 1-5% of item value.

## Quests

- ~400+ quests across all traders.
- Rewards: roubles, trader rep, items, stash upgrades.
- Types:
  - **Kill X of Y**: eliminate specific Scav / boss count.
  - **Find and Hand-in**: bring item to trader.
  - **Find in Raid**: locate specific quest item on map (cannot buy from Flea).
  - **Location visit / mark**: place marker on map.
  - **Extract with specific items**: escape carrying specific loadout.
- **Prerequisites**: completion gates next quest.

Kappa container = end-game quest chain; offers 3x5 Secure Container.

## Loot Value Tiers

| Tier | Examples | Rouble Range |
|---|---|---|
| Trash | Bolts, duct tape, toilet paper | 500-5k |
| Common | Salewa, gunpowder, standard mags | 5k-15k |
| Uncommon | GPU, Labs keycard Red | 30k-1M |
| Rare | Military COFDM, intel folder | 100k-300k |
| Extreme | LEDX, graphics card, LT-shell | 500k-2M |
| Extreme+ | Labs keycards Red/Violet | 2-15M |

## Ratio-of-Raiders

A healthy economy has:
- 30-40% of raids end in extract with gear.
- 70%+ raids produce some loot.
- Insurance recovery offsets 20-30% of losses.
- Traders restock consistently.
- Flea Market liquidity: can sell most items within 2 hours.

If any tilt: community revolts (trader stock shortages, insurance not returning, Flea crashes).

## Economic Controversies

- **Trader stock scarcity**: early wipe = certain items unobtainable on Flea (locked until lvl 15).
- **Flea Market "culling"**: certain items made Flea-exclusive or locked out.
- **PVE mode economy**: new solo/co-op PvE mode has different economy rules.
- **Real-money trading (RMT)**: cheaters sell in-game roubles for real $; Battlestate bans aggressively.
- **Wipe cycle economy reset**: community debates cycle length.

## Wipe Economics

A wipe cycle ~6 months:
- **Week 1-2**: Everyone broken; melee + Makarov combat; trader level 1 only.
- **Week 3-4**: Flea unlocks; economy accelerates.
- **Month 2-3**: Full trader levels accessible; Kappa grinding begins.
- **Month 4-6**: End-game; Labs + Lightkeeper meta.
- **Wipe announcement**: Battlestate announces date; prices peak for last-ditch value-trades.

## Barter Trades

Many trader offerings are barter (not rouble cash):
- Peacekeeper: USD + specific items for high-tier.
- Fence: scrap items for random items.
- Ragman: tactical gear for armor.
- Jaeger: medical items for bolt-action attachments.

Specialist players **barter-farm**: buy low barter-input, turn into barter-output, profit.

## Design Philosophy

Battlestate's economic design:
- **Everything has value**: toilet paper is a quest item, bolts are craft ingredients.
- **Risk/reward scales with map tier**: Labs/Streets high-tier; Ground Zero safe.
- **Player-driven market smooths trader pricing**: Flea fills the gaps.
- **Wipes prevent stagnation**: resets power creep.
- **Insurance teaches non-frustration**: losing everything is the norm, but not permanent.

## Rejected Designs

- **Persistent skins / cosmetics**: Tarkov's art is realist; cosmetics largely absent.
- **Gacha mechanics**: not Tarkov's design.
- **Pay-to-win**: BSG has kept premium edition to stash size + starting perks + Kappa-eligible; not gear upgrades.
- **Cross-platform economies**: PC-only; no mobile equivalent.
