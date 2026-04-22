# Social Deduction Design — Among Us

Among Us' mechanics are scaffolding for conversation. Every interaction produces information, suspicion, or alibi. Design goals: create ambiguity, reward observation, make lying plausible, make truth provable.

## Information Asymmetry

### What Impostors Know

- All impostor identities (other impostors shown in red).
- Kill cooldown state (precise timer).
- Full map including vents.
- Can see through Lights sabotage.

### What Crewmates Know

- Only their own tasks.
- Cannot distinguish impostor from crewmate visually.
- Can observe: other players' locations, task-bar progress, body positions, sabotage events.
- Admin map (Skeld) shows player positions as dots per room.
- Vitals panel (Polus/Airship) shows who is alive/dead.
- Security cameras (Skeld, Polus, Airship) show live feed of specific corridors.

### What Everyone Knows

- Public events: lights off, doors closed, reactor meltdown, body report.
- Meeting outcomes: who was ejected, vote counts (if public).
- Task bar progress (aggregate, not per-player).

## Alibi Systems

Among Us gives crewmates tools to prove innocence — but these tools have counterplay:

### Visual Tasks

Tasks that produce public animations:
- **Medbay Scan** (Skeld, MIRA, Polus): 10s scan produces hologram visible to anyone in medbay.
- **Empty Garbage/Chute**: dumps garbage visibly.
- **Clear Asteroids** (Skeld Weapons): laser animation visible.
- **Submit Scan** (Polus): body scan with visible result.

If host disables visual tasks → crew loses a major alibi source. Hosts trade speed for readability here.

### Admin Map (Skeld/Polus/Airship)

Live player-count per room. Doesn't identify players, just room occupancy. Camp Admin = verify claims.

### Security Cameras

Wall-mounted cameras in specific corridors. Lights blink on cameras when active — tell to impostors. Claim of "I was on cams" can be verified if camera was active.

### Vitals

Polus/Airship has Vitals panel — shows per-player alive/dead/disconnected state. When a player "flatlines" on vitals, time of death narrows suspect list.

## Lying Tools (Impostor)

### Fake Tasks

Impostors see fake task markers. Walk to task location, open panel, wait appropriate duration, close panel. Indistinguishable from real task unless interrupted.

### Vent Mobility

Vent network lets impostor teleport between rooms. Crewmates walking corridor-by-corridor are slower. Key impostor tactic: kill in one room, vent to other side of map, claim long walk.

### Common Task Trap

If host uses common tasks (all crewmates share it), impostors don't get it in task list. "I was doing X common task" is a lie a crewmate can counter with "we all had that and I finished."

### Self-Report

Impostor kills, then immediately reports own kill. Creates presumed alibi ("why would I report my own kill?"). Counter: savvy crew track who had access and time.

### Sabotage as Distraction

Call sabotage right before/after kill to pull crew away from body or split groups. O2/Reactor forces fix; lights lets impostor kill in reduced-vision.

### Shapeshifter (Role Variant)

Impostor can briefly disguise as another player (temporary). Creates witness-testimony doubt.

## Meeting Dynamics

### Discussion Phase

- Free text chat (or voice if external).
- Players share observations: "I saw X vent", "Y was with me in medbay", "task bar didn't move when Z was alone at comms."
- Timer pressures decisions; no stalling indefinitely.

### Voting

- Anonymous or public (host setting).
- Vote skip OR vote-eject-player.
- Majority ejects; tie skips.

### Confirm Ejects Setting

- On: reveals ejected role ("X was the impostor" or "not").
- Off: harder mode — no feedback on vote correctness.

### Strategic Calls

Crew tactics:
- **Emergency meeting on new info**: button-hog pressures readers.
- **Silent observation**: watch without voicing; strike in meeting.
- **Task confirmation**: broadcast task-bar movements to narrow suspect windows.
- **"With me" testimony**: locking an alibi pair.

Impostor tactics:
- **Parity pressure**: when impostor+crew even, need ejection or parity win.
- **Sow discord**: accuse teammate subtly to split crew attention.
- **Survive skip votes**: quiet impostor can ride skips to endgame.

## Deduction Information Value

| Signal | Strength |
|---|---|
| Vent witness | Very strong (crewmates can't vent base) |
| Body location + walking path | Strong (who had access) |
| Admin map count change | Moderate (ambiguous identity) |
| Task bar progress | Moderate (confirms someone did task, not who) |
| Self-report | Weak (can be impostor cover) |
| "Was with me" | Strong if verified (alibi pair) |
| Visual task witness | Very strong (confirmed crew) |

## Role Balance

Impostor win-rate target: ~50% across competent lobbies. Off-balance levers:
- Kill cooldown (shorter = more impostor kills).
- Map size (larger = more room to isolate but slower traversal).
- Player count (higher = noisier info).
- Task count (fewer = faster crew win).
- Vision (reduced crew vision = impostor advantage).
- Number of impostors.

Host tunes for group — party mode (easy crew) vs. competitive mode (tight balance).

## Psychological Layers

- **Bluffing**: innocent crew accused often panics (appears guilty); experienced impostors stay calm.
- **Groupthink**: majority dogpile can eject innocents.
- **Silence tells**: quiet players suspected; over-defensive players suspected.
- **Voting reads**: who votes for whom reveals suspicions.

Design minimally scripts these layers — emerge from mechanics + human behavior.

## Competitive Scenes

- **Proximity chat mods** (Town of Us, etc.): add voice-chat-when-near layer.
- **Ranked mode** (added 2023): MMR-tracked competitive lobbies.
- **Tournament rules**: standardized settings (kill cooldown, task count, meeting limits).

Design Philosophy: mechanics thin, conversation deep. Among Us works at 6 players and 15; at 5-minute matches and 20-minute tourneys; on mobile and streaming setups. The social layer does the heavy lifting.
