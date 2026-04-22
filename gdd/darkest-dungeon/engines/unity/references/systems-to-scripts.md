# Systems → Scripts Map — Darkest Dungeon (Unity)

Maps each system in the base GDD to concrete Unity namespaces and script classes.

## Namespace Layout

| Namespace | Purpose |
|---|---|
| `DarkestDungeon.Sim` | Deterministic combat/dungeon state, no MonoBehaviours |
| `DarkestDungeon.Sim.Combat` | Turn resolution, hit rolls, damage |
| `DarkestDungeon.Sim.Effects` | Effect graph nodes (damage/status/stress/shuffle) |
| `DarkestDungeon.Sim.Dungeon` | Hallway/room layout, exploration state |
| `DarkestDungeon.Sim.Estate` | Hamlet state, building levels, roster |
| `DarkestDungeon.View` | MonoBehaviours, sprite rigs, VFX drivers |
| `DarkestDungeon.UI` | Hero panels, skill bars, map, loot screens |
| `DarkestDungeon.Data` | ScriptableObject definitions (content) |
| `DarkestDungeon.Meta` | Calendar, story flags, Darkest mission progress |
| `DarkestDungeon.Save` | Save/load, migrations, JSON schema |
| `DarkestDungeon.Narrator` | VO picker, subtitle driver, FMOD routing |
| `DarkestDungeon.Input` | Input System actions, touch/gamepad adapters |

## Combat Sim

| Class | Responsibility |
|---|---|
| `Sim.Combat.CombatController` | Main turn loop; drives input + AI decisions |
| `Sim.Combat.CombatState` | Turn order, round, heroes/enemies, RNG, event log |
| `Sim.Combat.Combatant` | Shared hero/enemy fields: HP, Speed, statuses, rank |
| `Sim.Combat.HeroState` | Hero-only: Stress, Quirks, Trinkets, Affliction |
| `Sim.Combat.EnemyState` | Enemy-only: AI state, corpse flag, shuffle weight |
| `Sim.Combat.TurnResolver` | Rolls initiative, computes order, advances index |
| `Sim.Combat.HitRoll` | Accuracy vs dodge, crit roll, position modifiers |
| `Sim.Combat.DamagePipeline` | Rolls base damage, crit mult, PROT reduction |
| `Sim.Combat.StatusTicker` | Ticks Bleed/Blight/Buffs at turn start |
| `Sim.Combat.AIPicker` | Picks enemy action from `AIPickerDefinition` |
| `Sim.Combat.EventLog` | Append-only `CombatEvent` list for view + narrator |

## Effect Graph

| Class | Responsibility |
|---|---|
| `Sim.Effects.EffectNode` | Abstract SO base; `Execute(EffectContext)` yields events |
| `Sim.Effects.DealDamageEffect` | Roll damage, apply to target(s) |
| `Sim.Effects.ApplyStatusEffect` | Bleed, Blight, Stun, Mark, Guard, Buff/Debuff |
| `Sim.Effects.HealEffect` | HP restoration with variance |
| `Sim.Effects.DealStressEffect` | Stress damage with resistance roll |
| `Sim.Effects.HealStressEffect` | Stress relief (Jester Finale, camp skills) |
| `Sim.Effects.ShuffleEffect` | Reposition target(s); random or targeted rank |
| `Sim.Effects.MoveSelfEffect` | Forward/backward self-move after skill |
| `Sim.Effects.GuardEffect` | Redirect incoming attacks to self |
| `Sim.Effects.ConditionalEffect` | Branch on stance/status/marked/trait |
| `Sim.Effects.SequenceEffect` | Ordered composition of child effects |
| `Sim.Effects.EffectContext` | Source, target list, state, RNG, skill ref |

## Stress & Affliction

| Class | Responsibility |
|---|---|
| `Sim.Combat.StressSystem` | Adds/removes stress, triggers threshold checks |
| `Sim.Combat.AfflictionRoller` | 75/25 affliction vs virtue on crossing 100 stress |
| `Sim.Combat.HeartAttack` | Fires at 200 stress; drops to DD or kills |
| `Sim.Combat.AfflictionBehavior` | Per-affliction turn overrides (refuse heal, pass, stress allies) |
| `Sim.Combat.VirtueBehavior` | Per-virtue bonuses (stalwart, focused, courageous) |
| `Data.AfflictionDefinition` | SO: stat mods, behavior type, VO barks |
| `Data.VirtueDefinition` | SO: stat mods, heal aura, VO barks |

## Dungeon Exploration

| Class | Responsibility |
|---|---|
| `Sim.Dungeon.DungeonGenerator` | Build room graph + hallways from seed + mission |
| `Sim.Dungeon.DungeonLayout` | Rooms, hallways, start/boss references |
| `Sim.Dungeon.Room` | Id, contents, cleared flag, curio state |
| `Sim.Dungeon.Hallway` | Steps list, encounter placements, traps |
| `Sim.Dungeon.ExplorationController` | Party position, input → step advance, encounter triggers |
| `Sim.Dungeon.CurioInteraction` | Curio outcome rolls (gold/stress/disease/buff) |
| `Sim.Dungeon.TrapRoller` | Scouting vs base trap chance |
| `Sim.Dungeon.LightingSystem` | Torch level affects crit/stress/ambush weights |
| `Sim.Dungeon.CampingController` | Camp phase, skill picks, ambush roll |

## Hero / Estate Data

| Class | Responsibility |
|---|---|
| `Data.HeroClassDefinition` | Class base stats, 7 skills, camp skills, quirk rules |
| `Data.SkillDefinition` | Rank bitflags, targets, damage mult, effect graph |
| `Data.CampSkillDefinition` | Camp cost, target, effect |
| `Data.EnemyDefinition` | Stats, attacks, AI picker, battle prefab |
| `Data.BossDefinition` | Enemy def + scripted pattern refs |
| `Data.TrinketDefinition` | Buffs, tradeoffs, class restriction, set tag |
| `Data.QuirkDefinition` | Stat mods, triggers, sanitarium cost |
| `Data.CurioDefinition` | Outcome table, region, item-interact rules |
| `Data.AttackDefinition` | Enemy attack: target ranks, damage, stress, effect |
| `Data.DungeonDefinition` | Region, mission types, tileset, enemy pool |
| `Data.StatusApplyDefinition` | Status id, magnitude, duration, resist type |

## Estate / Meta

| Class | Responsibility |
|---|---|
| `Sim.Estate.EstateState` | Buildings, gold, heirlooms, graveyard |
| `Sim.Estate.BuildingController` | Apply upgrades, compute costs, capacity |
| `Sim.Estate.RecoveryController` | Abbey/Tavern slotting, per-hero resolution |
| `Sim.Estate.RosterManager` | Hire/dismiss, slot limits, hero mode filter |
| `Meta.CalendarState` | Week counter, upcoming missions, queued events |
| `Meta.StoryState` | DD mission completions, hero lock-ins, flags |
| `Meta.MissionScheduler` | Generates weekly mission list from story state |
| `Meta.ModeConfig` | Radiant/Darkest/Stygian tuning knobs |

## View / Animation

| Class | Responsibility |
|---|---|
| `View.CombatView` | Consumes `CombatEvent`s, drives portraits/rigs |
| `View.HeroRig` | Spine rig, anim states (idle/attack/hit/death) |
| `View.EnemyRig` | Same for enemies + corpse fade |
| `View.PortraitWidget` | HP/stress bars, status icons, affliction frame |
| `View.FormationController` | Smooth rank swaps on shuffle |
| `View.DamageFloater` | Floating damage/heal/stress numbers |
| `View.CritFlash` | Camera shake + zoom on crits/afflictions |
| `View.HallwayParallax` | Per-region BG scrolling |
| `View.TorchGlow` | Light radius + vignette from `LightingSystem` |

## UI

| Class | Responsibility |
|---|---|
| `UI.CombatHUD` | Turn order bar, skill tray, action preview |
| `UI.HeroPanel` | Expanded hero: quirks, trinkets, skills |
| `UI.MapOverlay` | Explored room graph, current position |
| `UI.LootScreen` | End-of-encounter rewards |
| `UI.HamletView` | Clickable building composite |
| `UI.BuildingUpgradeScreen` | Gold + heirloom spend interface |
| `UI.StagecoachScreen` | New recruit roster, hire flow |
| `UI.QuirkSanitariumScreen` | Lock/remove quirks, disease cure |

## Narrator

| Class | Responsibility |
|---|---|
| `Narrator.NarratorService` | Subscribes to events, picks + plays lines |
| `Narrator.LineLibrary` | Pool per event type, recency filter |
| `Narrator.VoiceDriver` | FMOD routing, duck music, subtitle fire |
| `Narrator.SubtitleDriver` | TMP caption reveal, timed hide |
| `Data.NarratorLineDefinition` | SO: event tag, VO clip ref, subtitle text, weight |

## Save / Load

| Class | Responsibility |
|---|---|
| `Save.SaveData` | Estate + Roster + Calendar + InDungeon + Story |
| `Save.SaveService` | Auto-save on step; manual on Hamlet |
| `Save.MigrationRunner` | Versioned schema upgrades |
| `Save.JsonConverters` | Newtonsoft converters for SO references |

## Input

| Class | Responsibility |
|---|---|
| `Input.CombatInputHandler` | Skill → target pick, keyboard shortcuts |
| `Input.DungeonInputHandler` | Hallway move, curio interact, map toggle |
| `Input.GamepadAdapter` | Stick → rank focus, triggers cycle hero |
| `Input.TouchAdapter` | Tap skill, tap target, swipe map |

## Cross-cutting

| Class | Responsibility |
|---|---|
| `Sim.SimRandom` | Seeded PCG; `ForStream("hit"/"loot"/"affliction"/…)` |
| `Sim.CombatEvent` | Typed events: Hit, Miss, Crit, Stress, Affliction, Death |
| `Sim.EventBus` | Dispatches events to View, Narrator, Analytics |
| `Diagnostics.SimReplay` | Replay log from seed for bug reports |

## Tests

| Test class | Covers |
|---|---|
| `Tests.HitRollTests` | Accuracy/dodge math, crit chance caps |
| `Tests.DamagePipelineTests` | PROT reduction, crit mult, min 1 |
| `Tests.StressSystemTests` | Threshold fires once per crossing; resist; heart attack |
| `Tests.AfflictionRollerTests` | 75/25 with seeded RNG |
| `Tests.StatusTickerTests` | Bleed/Blight tick order, stun consumption |
| `Tests.ShuffleTests` | Position updates + skill re-validation |
| `Tests.DungeonGeneratorTests` | Seeded layout determinism |
| `Tests.SaveRoundTripTests` | Full SaveData round-trip through JSON |
| `Tests.BalanceProbes` | 10k simulated party-vs-boss win rates |
