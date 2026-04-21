# 3Cs Spec

Clash of Clans has **two distinct camera modes**: Village view and Attack view. Each has different rules.

## Village View (Home Base)

### Camera
- Perspective, 3/4 top-down, rotatable within limits via 2-finger gesture
- **Pinch-zoom** for closer inspection
- **Drag** to pan across the base — the village is larger than the screen
- Returns to default zoom on mode exit

### Player Avatar
- No avatar. The player is God of this village.
- The village **labourer** (builder) visuals appear when upgrades are active, a cosmetic thing

### Controls
| Input | Action |
|---|---|
| Tap building | Select / show details / "Info" + "Upgrade" |
| Tap + drag on selected building | Move (in edit mode) |
| Two-finger pinch | Zoom |
| Two-finger rotate | Rotate view (limited angles) |
| Drag empty area | Pan |
| Double-tap building | Shortcut to upgrade menu |
| Tap resource collector | Collect (accumulated tap-drag gesture) |

### Edit Mode
- A dedicated mode that hides HUD, activates grid, allows free placement of buildings/walls
- Layout presets: save up to N layouts per village
- **Copy/paste** via layout code string (community feature)

## Attack View

### Camera
- Locked perspective on the target's base
- Player pans over the base before attacking (scouting phase)
- Zoom limits are tighter than Village view
- Camera stays on whatever you're drag-dropping troops at; a mini-map in the corner shows your troop movements

### Player Avatar
- No avatar. The attacker is God of the horde.
- Heroes (Barbarian King, Archer Queen, etc.) are visible entities with their own HUD elements

### Controls (Scouting Phase)
| Input | Action |
|---|---|
| Pinch/pan | Inspect the base |
| Tap building | Peek info: type, level, hit points |

### Controls (Deploy Phase)
| Input | Action |
|---|---|
| Tap army slot (bottom strip) | Select troop/spell/hero |
| Tap empty ground | Deploy one unit of the selected type (ring of deployable tiles lights up) |
| Drag across ground | Deploy multiple units along a line |
| Tap spell | Select spell |
| Drag spell onto target area | Deploy spell |
| Tap hero | Select hero (unique unit, one deploy) |
| Tap hero button | Activate hero ability (post-deploy) |
| Two-finger gesture | Pan camera (not zoom during attack — too disorienting) |
| "Surrender" | End attack early |

### Deploy Rules
- Troops can only be deployed on the **outer edge** of the map grid (a few tiles inside the border)
- If there are **red zone blockers** (walls that reach the edge, or buildings that block the edge), those tiles are non-deployable
- Tile deployability is visualised: tiles turn **red** when illegal

## HUD

### Village View HUD
- Top-left: resources (gold, elixir, dark elixir, gems)
- Top-right: settings, profile, mail, shop
- Bottom: Attack, Shop, Army, Clan, More
- Mid-right: current attacker notifications, builder hut status

### Attack View HUD
- Top: timer (3:00 countdown), star indicators (current stars earned), destruction percent
- Bottom: army strip (all troops, spells, heroes)
- Mid-right: heroes + their abilities + Clan Castle troops
- Bottom-right: surrender

## Feel Targets
- Village pan should be smooth, no jank; village buildings remain interactable during a drag
- Attack deploy should be responsive (≤ 100 ms tap-to-unit-visible)
- Hero deploy should be ceremonial (brief pose animation, camera pan to hero ≤ 1s — this is a signature moment)
- Spell deploy should have a **preview circle** visible while dragging, never without

## Anti-patterns to avoid
- **Don't invert camera pan.** Pan direction must match finger direction. Early clones have shipped inverted pan and it feels broken.
- **Don't allow zoom so far that individual tiles lose meaning.** The grid must be legible.
- **Don't require a confirmation dialog for every deploy.** Deploy is commit. Pacing matters in a 3-minute attack.
- **Don't let the camera reset mid-attack.** Players want camera stability; auto-following troops or auto-zoom is disorienting.
