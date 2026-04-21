# Team League Design

Toon Blast's team league is the **social retention engine**. It transforms a solo puzzle game into a weekly community competition, dramatically increasing engagement and LTV.

## Structure

### Teams

- **50 members** per team (cap)
- **Free to create** or join existing
- **Captain** role: one per team; can kick/promote
- **Officer** role: appointed by captain; can kick members
- **Member** role: default

### Team Profile

- **Team name** + custom icon
- **Motto** (short description)
- **Requirements** (min levels, language pref)
- **League tier badge**
- **Trophy shelf** (past league wins)

## Weekly League Cycle

### Schedule

- **Monday 00:00 UTC**: cycle starts
- **Sunday 23:59 UTC**: cycle ends; rewards issued

### Leagues (Tiered)

1. **Bronze**
2. **Silver**
3. **Gold**
4. **Platinum**
5. **Diamond**
6. **Master**
7. **Grand Master**

### Movement

- **Top 3 teams** in each league: promote to next tier
- **Bottom 3 teams**: demote to previous tier
- **Middle**: stay

### Scoring

- **Team score = sum of stars earned by active members that week**
- Each level cleared contributes its star count (1, 2, or 3)
- **Replays don't contribute** (each level counted once per week) — prevents farming

### Leaderboard Display

- Live-updating team standings within league
- Individual contributor rankings inside team
- **Notifications**: "We're 2 stars from 1st place!"

## Rewards

### Team-Wide (per league tier × finish position)

| Finish | Bronze | Gold | Diamond | Grand Master |
|---|---|---|---|---|
| 1st | 500 coins + 3 boosters | 1500 + 5 | 3000 + 10 | 5000 + 15 |
| 2nd | 300 | 1000 | 2200 | 3500 |
| 3rd | 200 | 700 | 1500 | 2500 |
| 4th–10th | 100 | 400 | 800 | 1200 |
| 11th–30th | 50 | 200 | 400 | 600 |

### Individual Bonus

- **Top 10 contributor** in team: 2x coin bonus
- **Top 3 contributor**: extra booster pack

### Visual Rewards

- **League trophy** for team profile
- **Badge** for member profile
- **Seasonal cosmetic** at Grand Master (e.g., special avatar frame)

## Team Chat

### Features

- **Real-time text chat**: team-only
- **Emoji reactions**
- **@mention** specific members
- **Pinned messages**: captain can pin important info (recruit text, event reminders)
- **Auto-translate**: Google Translate integration for multi-language teams

### Moderation

- Report button (flag offensive content)
- Captain kick privileges
- Automated profanity filter

## Life Gifts

### Life Request

- **Tap "ask team for lives"** button when out of lives
- Request appears in team chat
- **Any teammate** can grant free (one-tap)
- Grantor's pool is infinite (no cost to them)
- Receiver gets life instantly

### Designed Incentive

- **Grantor gets tiny coin bonus** (e.g., 10 coins)
- Encourages low-cost giving
- Creates **pro-social reciprocity**: "You helped me → I help you"

### Cap

- **5 life requests per day** per receiver (prevents spam)

## Team Events

### Weekly Mini-Event

- **Team Task**: 24-hour collective objective
  - "Team clears 500 cubes today"
  - "Team defeats 30 toon traps today"
- Rewards: coins + booster per member

### Team Race

- **48-hour** event
- Teams compete in a specific objective category
- **Winner team gets** bonus league points

### Solidarity Event

- **All-member participation required**: each member must clear at least 3 levels
- Reward: everyone gets boost

## Matchmaking / League Placement

- **New team**: starts in Bronze
- **Promoted**: next tier
- **Relegated**: previous tier
- **League pool**: ~30 teams per league shard
- **Shards**: teams bucketed by tier + activity level

## Retention Mechanics

### Activity Requirements

- **Captain** can set min-weekly-star requirement
- **Auto-kick**: teams can auto-kick members with 0 stars for 2 weeks
- Keeps teams active, promotes turnover

### Shoutouts

- Team chat bot: "Congrats @Alex for clearing level 200!"
- Celebrates individual milestones publicly

### Recruit Prompts

- When team below 50 members: "Invite friends" button prominent
- Viral loop for growth

## Key Design Principles

- **Low barrier to join**: free teams abundantly
- **Social obligation, not cost**: feel bad missing a week, not pay
- **Reciprocity loop**: give lives → receive lives
- **Visible progress**: see team + individual rank live
- **Inclusive rewards**: even last place gets something

## Analytics

- **% players in a team**: ~70%+ after level 50
- **Team retention**: 60%+ of team members active weekly
- **Team players' ARPDAU**: 2–3x non-team players
- **Churn in team**: significantly lower than solo

## Competitive vs Cooperative

Toon Blast's league is **cooperative within team, competitive between teams**:
- Team members help each other
- Teams compete for league rank
- Promotes **team bonding** + **tribal loyalty**

## Anti-Patterns

- **Pay-to-win team**: if spending directly wins league, breaks fairness
- **Overly demanding** requirements: scare away casual players
- **Toxic chat**: moderation is critical
- **Dead teams** (inactive captain): player is stuck; give migration options
- **Opaque scoring**: if team doesn't understand why they win/lose, disengage

## Comparison to Royal Match's Kingdoms

| Feature | Toon Blast Team | Royal Match Kingdom |
|---|---|---|
| Size | 50 members | 30 members |
| Meta | Weekly star league | Seasonal events |
| Chat | Yes | Yes |
| Gifts | Lives only | Lives + hearts |
| Competition | Within league (tiered) | Cross-kingdom events |

Toon Blast's team system is **more intensive**; Royal Match's is lighter and optional.
