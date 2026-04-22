# NPC & Relationship Design — Stardew Valley

Thirty-plus villagers live in Pelican Town. Each has schedules, preferences, backstories, and hearts-based relationship progression. Relationships are a progression axis equal to farming or combat.

## NPC Roster

### Marriage Candidates (12)

Six bachelors, six bachelorettes:

**Bachelors**: Alex, Elliott, Harvey, Sam, Sebastian, Shane.
**Bachelorettes**: Abigail, Emily, Haley, Leah, Maru, Penny.

All are hetero/bi-compatible regardless of player gender.

### Non-Marriage Villagers (~18)

Pierre, Caroline, Lewis, Marnie, Robin, Demetrius, Jodi, Kent (Y2+), Linus, Pam, George, Evelyn, Willy, Clint, Gus, Vincent, Jas, Dwarf, Wizard, Krobus, Sandy, Leo (Ginger Island), Professor Snail, etc.

Each has 10-heart cap with unique cutscenes.

### Special NPCs

- **The Dwarf** (mines): unlocks via translation; sells special items.
- **Krobus** (sewers): unlocks via skeleton key + Wednesday visits.
- **Wizard** (Cindersap Forest): magical quests + character respec.
- **Sandy** (Desert): unlocks via bus repair.
- **Leo** (Ginger Island): unlocks via island exploration.

## Heart System

Each NPC: 0-14 hearts.
- **0-8**: regular friendship.
- **8-10**: romance threshold (marriage candidates).
- **10**: max friendship + marriage eligible.
- **11-14**: post-marriage hearts (spouse-only).

### Heart Gain Sources

- **Talking daily**: +20 friendship points per conversation (first of day only).
- **Gifts**: varies by preference (see Gift Scoring below).
- **Quests**: +50-150 friendship per completion.
- **Festivals**: participating rewards everyone.
- **Relationship events (cutscenes)**: unlocks at heart milestones.

### Heart Decay

If NPC isn't greeted/gifted for a while, friendship decays slowly. Harder to maintain 30 NPCs at 10 hearts than farming-optimize.

### Heart Thresholds

| Hearts | Points |
|---|---|
| 1 | 250 |
| 2 | 500 |
| 4 | 1000 |
| 6 | 1500 |
| 8 | 2000 |
| 10 | 2500 |

## Gift System

Each NPC has:
- **Loved** (+80 friendship): personal favorites.
- **Liked** (+45): general positive.
- **Neutral** (+20): any item.
- **Disliked** (-20): negative.
- **Hated** (-40): strong negative.

2 gifts per NPC per week (Mon-Sun). Birthday gift: 8x multiplier.

### Gift Strategy

- Universal loved items: Prismatic Shard, Pearl, Rabbit's Foot, Golden Pumpkin.
- Universal liked: most artisan goods, flowers.
- Universal disliked: certain monster loot, weeds.

Each NPC's preference list learnable via trial, gift screen (Y2+), or online guides.

### Birthdays

One birthday per season (one-on-one day). Loved gift + high-value = massive friendship burst.

## Cutscenes

Heart events unlock at milestones:
- **2 hearts**: initial backstory glimpse.
- **4 hearts**: deeper reveal.
- **6 hearts**: midpoint.
- **8 hearts**: vulnerable moment.
- **10 hearts**: climactic + marriage eligibility.
- **14 hearts** (post-marriage): ongoing relationship content.

Each cutscene is authored dialogue + scripted movement. Choices sometimes affect relationship or future dialogue.

## Schedules

Each NPC walks a daily route. Example:
- Haley: wakes 9am → primps at mirror → leaves 11am for town → shops → beach in afternoon → home by 7pm.
- Seasonal variants: summer routes differ from winter.
- Weather variants: rain keeps indoor-prone NPCs home.
- Festival: all NPCs teleport to festival location on festival day.

Map shows NPC positions at current hour.

## Romance

### Becoming Eligible

- Reach 8 hearts with romance candidate.
- Buy Bouquet from Pierre (200g).
- Give to candidate → they're your boyfriend/girlfriend.
- Continue heart-building.

### Marriage Proposal

- Reach 10 hearts while dating.
- Obtain Mermaid Pendant (from Old Mariner, 5000g, beach during rain).
- Give to candidate → 3 days later, wedding cutscene.

### Marriage Effects

- Spouse moves into farmhouse.
- Adds spouse-specific room to house.
- Spouse does chores (watering, feeding animals, repairing fences).
- Children possible after 2 weeks (up to 2).

### Polyamory / Cheating

- Gifting bouquet to multiple candidates creates a cutscene where they all discover and shun the player.
- Recovery possible but painful.

## Children

After marriage, option after ~7 days:
- First child: 14 days to birth/adopt.
- Second child: similar wait.
- Genders random.
- Children age: crib → toddler (non-interactive).
- In current version, children don't age further (design-frozen).

## Divorce

- 50k gold at Mayor's Manor.
- Ex-spouse is hostile for a while.
- Can re-marry another candidate.
- Witch's Hut can remove ex entirely (reset).

## Non-Romance Relationships

Pam, Lewis, etc. still have heart events (up to 10). Community lore, NPC backstories, town history.

Examples:
- **Linus** (hermit): reveals backstory on philosophy of simplicity.
- **Pam** (bus driver): alcoholism subplot.
- **Kent** (soldier husband, Y2+): PTSD from war.
- **Shane** (depression + alcoholism): one of the most vulnerable arcs; non-optional to learn about.

## Quests

### Randomly-Generated Mail Quests

Delivered via mailbox:
- "Bring X item to Y NPC by day Z."
- Rewards: gold + friendship.

### Scripted Story Quests

- Linked to heart events, community center, or major content.
- Not time-gated.

### Help Wanted Board (Town)

- Daily board outside Pierre's.
- Request types: deliver item, kill N monsters, fish N fish.
- Rewards: 2-3x item value + friendship.

## Festivals as Relationship Events

Per-season festivals involve NPCs:
- **Flower Dance** (Spring 24): dance partner choice (romance implication).
- **Luau** (Summer 11): potluck soup — quality affects Governor's reaction.
- **Fall 16**: Stardew Fair; mini-events with NPCs.
- **Spirit's Eve** (Fall 27): spooky maze.
- **Winter 15**: Feast of the Winter Star; anonymous gift exchange.
- **Winter 25**: Moonlight Jellies.

## Design Philosophy

### Writing Depth as Feature

Every NPC gets full character arc. Shane's depression, Pam's alcoholism, Haley's vanity unraveling — Stardew tackles adult themes in cozy wrapping.

### Cozy Doesn't Mean Shallow

Relationships are emotionally genuine. Cutscenes can be unsettling, vulnerable, hopeful.

### Player Agency

Player chooses:
- Who to romance (or nobody).
- How to treat NPCs.
- Gender expression — marriage is gender-neutral.
- Whether to ignore social entirely (all content beatable solo).

### No Urgency

NPCs don't die or leave. All content persists. Players can build relationships over multiple in-game years.

### Breadth Over Focus

30 NPCs is unusual — most games focus on 4-6 deep characters. Stardew gives breadth; no "right" friend to invest in.

## Rejected Patterns

- **Time-gated relationships**: all NPCs remain across years.
- **Pay-to-progress romance**: everything earnable via play.
- **Dating sim min-max**: multiple-partner betrayal has consequences.
- **Non-marriageable NPCs being less-developed**: most have 10-heart arcs regardless.
