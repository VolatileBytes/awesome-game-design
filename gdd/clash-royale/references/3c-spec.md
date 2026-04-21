# 3Cs Spec

## Camera

- **Projection:** perspective, fixed 3/4 view with a strong vertical axis. Arena fits entirely in portrait without panning.
- **Zoom:** fixed. No player zoom control.
- **Follow:** none — the camera is locked. Shake on king tower hits and spell impacts is allowed; keep it subtle.
- **Orientation:** player's king tower is at the bottom, opponent's at the top. This never flips — even when viewing a replay of the losing side, the client re-orients so the viewer is always bottom.
- **Cinematics:** none in-match. Victory/defeat cam zoom is at match end, not during play.

## Player ("Character")

There is no avatar. The player is represented by:
- Their **hand** (bottom strip of 4 cards + next-in-queue preview)
- Their **elixir bar** (the resource meter above the hand)
- Their **tower state** (princess towers left/right + king tower centre)
- A player **name tag + emote button** above the hand strip

## Controls

All touch. No gesture complexity beyond drag + tap.

| Input | Action |
|---|---|
| Tap card | Select (shows drop zones) |
| Drag card onto arena | Preview placement ghost on valid tiles |
| Release on valid tile | Deploy |
| Release off-arena | Cancel (no cost) |
| Tap emote button | Open emote wheel |
| Tap emote | Send to opponent (visible to both) |
| Tap tower | Show tower HP (quick info) |

### Drop Zone Rules

- **Troops** can be placed anywhere on your side of the river by default
- **Buildings** same as troops
- **Spells** can be placed anywhere on the arena (including opponent's side)
- **Elixir Golem**, **Battle Healer**, and similar "backline" cards can be placed anywhere on your side, same as troops
- Once a princess tower is destroyed, the opponent can place troops on your side of the river in that lane (aggressive push extension)

### Haptics and Micro-Feedback

- **On card pickup:** small haptic + slight card scale-up
- **On valid tile hover:** tile highlights; card ghost previews exact spawn position
- **On invalid tile hover:** card ghost dims, drop zone shows red outline
- **On deploy:** satisfying *thunk*, card slides back into deck, elixir drains smoothly
- **On card arriving back in hand:** subtle rise animation + soft chime

## Arena View

- **Tile grid** is ~18 wide × 32 tall. Not shown explicitly — the player perceives "lanes and zones", not cells.
- **Visible elixir regen** on the bar is continuous; integer elixir threshold is indicated by notches.
- **Tower HP** is shown as a numeric above each tower, with a horizontal bar under it.
- **Card cost vs. current elixir** is visualised by card colour: cards the player can afford are **lit**, cards they can't afford are **dim/grey**.

## Anti-patterns to avoid

- **Don't let the player zoom the camera.** Breaks the deliberate scale tradeoffs.
- **Don't show opponent elixir.** Hiding it is core. It separates good from great players.
- **Don't show opponent's hand.** Only cards they play are revealed.
- **Don't stack card information on the card.** The card shows cost + art + level. Stats are in the long-press tooltip, not on the main face.
- **Don't make the drop animation skippable.** The ~400ms deploy tell is the opponent's reaction window. Removing it destroys the game's timing.

## Feel Targets

- Card pickup to placement ghost visible: **≤ 50 ms**
- Deploy touch to unit spawn: **~400 ms** (the "deploy charge" animation)
- Unit appears to unit begins attacking: tunable per unit (0.5s–1.5s)
- Spell placement to spell effect: **~0.8s** (gives the opponent a reaction window on slower spells like poison; near-instant on zap/log for balance)
