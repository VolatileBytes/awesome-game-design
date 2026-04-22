# Economy Design — Escape from Duckov

Single-player economy is easier to tune than PvP — no other players breaking the market. Still rich with vendor interactions, crafting, and value trades.

## Currency

| Currency | Source | Spend |
|---|---|---|
| **Coins (Duck-bucks)** | Vendor sells, raid loot | Vendor buys, Home Base upgrades |
| **Crafting Parts** | Scrap, raid drops | Workbench recipes |
| **Barter Items** | Specific drops | Vendor barter trades |

No dollars / euros split like Tarkov — single-currency simplifies.

## Vendors

Each vendor:
- Stock (items they sell).
- Buy list (what they'll accept + price).
- Barter trades (item-for-item offers).
- Rep (player-specific).
- Level gate (some locked until PMC level).

### Vendors Roster

| Vendor | Specialty |
|---|---|
| **Mechanic Duck** | Weapons, mods, repair |
| **Doctor Duck** | Medical supplies |
| **Farmer Duck** | Food, seeds, garden tools |
| **Merchant Duck** | General goods, raw materials |
| **Smith Duck** | Armor, helmets, melee |
| **Tactician Duck** | Tactical gear, grenades |
| **Questmaster Duck** | Unique rewards, rep check |

## Loot Tiers (Per-Zone)

| Tier | Examples | Coin Value |
|---|---|---|
| Common | Scrap metal, small parts, standard ammo | 10-100 |
| Uncommon | Armor pieces, T2 weapon, medkit | 200-800 |
| Rare | T3 weapon, high-tier mod, GPU-analog | 1000-5000 |
| Epic | T4 weapon, unique armor | 5000-15000 |
| Legendary | T5 weapon, boss trophy | 15000+ |

Raids produce mixed loot; focused farming possible in specific zones.

## Selling Loot

Vendor-specific:
- **Mechanic**: pays top for weapons + parts.
- **Doctor**: pays top for medical supplies.
- **Farmer**: pays for food + organic matter.
- **Merchant**: pays generic for everything, at a discount.

Sell at specialist for ~20-30% more than generic.

## Barter

- **Craft item A → item B** via vendor's barter offer.
- Used for high-tier items locked behind specific trades.
- Example: "trade 5 circuit boards + 2 duck tape → unique sight."

## Crafting Economy

Workbench recipes:
- **Requires**: parts (scrap) + coins + time.
- **Produces**: weapon parts, armor, medical, food, grenades, unique weapons.

High-tier weapons often craftable from parts + schematic (quest reward).

Food cooking:
- Raw food → cooked food (heal more, last longer).
- Advanced food (energy drink, duck-stroganoff) crafted with multiple reagents.

## Home Base Upgrades Economy

| Upgrade | Costs | Returns |
|---|---|---|
| Medbay T2 | 5k coins + 50 scrap + 10 meds | Faster HP regen |
| Medbay T3 | 25k + 200 scrap + 20 advanced meds | Surgery unlock |
| Workbench T2 | 8k + 80 scrap + 5 tools | Higher-tier crafts |
| Workbench T3 | 30k + 300 scrap + 20 tools | Legendary crafts |
| Garden T2 | 3k + 40 scrap + 5 seeds | Better yield |
| Stash T2 | 10k + 50 parts | +4x4 cells |
| Stash T3 | 50k + 200 parts | +8x8 cells |

Upgrades cascade: T2 enables T3.

## Insurance

Optional: pay vendor coins to insure items:
- Fee ~5-10% of item value.
- Return in raids where item isn't recovered by AI (there's no AI collection in SP; typically return in time on death).
- Limited slots; weapon + armor priority.

## Resource Generation

### Farm/Garden
- Grows food + barter items in real-time.
- Pick every 30 minutes (real-time or raid-count).

### Bitcoin Farm Equivalent
- Passive coin generation through Home Base modules.
- Feeds slow idle income; supplements raid earnings.

### Daily Challenges (Optional)
- Micro-quests offer small cash rewards.
- No FOMO / time-limited essentials.

## Price Dynamics

Unlike Tarkov's Flea Market, single-player economy is **vendor-driven**:
- Prices are fixed per rep level.
- Rare items gated by rep level, not scarcity.
- No auction system (no players to compete with).

Player can't flip prices — economy balance is dev-tuned.

## Loss Events

Dying in raid:
- Lose in-raid inventory (weapons, armor, mods, loot found).
- Keep Secure Pouch + stash + Home Base.
- Pay insurance fee on specific items for recovery.

## Economic Progression

```
Level 1-10:
- Scavenge everything.
- Sell garbage for 50-200 coins.
- Buy T1 meds, basic ammo.

Level 10-20:
- Farm specific zones for T2 loot.
- Craft first weapons.
- Upgrade Workbench to T2.

Level 20-30:
- Barter T3 items.
- Higher-tier loadouts.
- Medbay + Workbench T3.

Level 30-50:
- Endgame bosses drop T5.
- Craft legendary weapons.
- Complete rare barters.
```

## Vendor Rep Mechanics

Rep 0-100:
- 0-20: LL1 stock.
- 20-40: LL2 unlock.
- 40-70: LL3 unlock.
- 70-100: LL4 (best).

Rep from:
- Completing vendor quests.
- Selling specific items to them.
- Not completing rival-vendor offers.
- NPC dialogue choices.

## Inflation Control

- Coins sink via vendor prices + upgrades + repair.
- Crafting cost balances: farm-raid coin income.
- End-game items cost: scales to late-game income.

No wipe mechanic — economy must self-balance over full playthrough.

## Design Philosophy

### No Grind-to-Win

Every piece of gear is earnable in ~5-20 raids. Player time respected.

### No Pay-to-Progress

Single purchase. Cosmetic DLC possible but not pay-to-win.

### Rewarding Exploration

Loot tables encourage visiting varied zones for different items.

### Solo Balance

Prices set so solo-play economy sustains without cheese.

## Rejected Designs

- **Flea Market-equivalent**: not needed without PvP.
- **Real-money currency**: not in design.
- **Item decay / durability to zero**: still durability but with repair options.
- **Wipes**: permanent progression.
