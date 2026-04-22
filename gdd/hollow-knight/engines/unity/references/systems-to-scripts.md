# Systems → Scripts Map — Hollow Knight (Unity)

## Namespace Layout

Hollow Knight uses a flat naming convention (mostly `GlobalEnums` and untyped namespace in released builds). This map organizes by responsibility.

| Category | Key Classes |
|---|---|
| Management | `GameManager`, `UIManager`, `GameCameras`, `SceneLoad` |
| Player | `HeroController`, `HeroActions`, `HeroAnimationController` |
| Combat | `NailSlash`, `HeroSpellControl`, `SpellControl`, `HealthManager` |
| Save | `PlayerData`, `SceneData`, `SaveGameData`, `GameManagerLoadSave` |
| Enemies | `HealthManager`, `DamageHero`, PlayMaker FSMs |
| NPCs | `DialogueBox`, `NPCInteraction` |
| Progression | `HeroController.CollectMaskShard`, `PlayerData.hasDash`, etc. |
| Map | `GameMap`, `MinimapPin`, `MapZoneTag` |
| Charms | `CharmIconList`, `PlayerData.equippedCharms` |
| UI | `HUDManager`, `InventoryOpen`, `InventoryClose` |
| Audio | `AudioManager`, `MusicCue`, `SoundBank` |
| Input | `InputHandler` (InControl-wrapped) |

## Management

| Class | Responsibility |
|---|---|
| `GameManager` | Global singleton; state, scene loading, save orchestration |
| `UIManager` | HUD + menus + pause screen |
| `GameCameras` | Camera rig root |
| `SceneLoad` | Fade + scene transition coroutine |
| `GameState` | Enum: Exit, Main, Scene, Cutscene, Paused, Loading, etc. |
| `GameConfig` | Host-configurable settings |
| `GlobalEnums` | Shared enums |

## Hero

| Class | Responsibility |
|---|---|
| `HeroController` | Root player component |
| `HeroActions` | InControl binding wrapper |
| `HeroAnimationController` | Animation state routing |
| `HeroBox` | Hitbox collider + damage reception |
| `InputHandler` | Raw input → semantic inputs |
| `HeroLight` | Personal lantern light effect |
| `ParrySystem` | Parry frame detection |
| `tk2dSpriteAnimator` | Sprite animation player (legacy) |

## Movement

| Class | Responsibility |
|---|---|
| `HeroController.Move` | Horizontal velocity application |
| `HeroController.Jump` | Jump with variable height |
| `HeroController.DoubleJump` | Monarch Wings |
| `HeroController.WallSlide` | Mantis Claw cling |
| `HeroController.WallJump` | Jump from wall |
| `HeroController.Dash` | Mothwing Cloak dash |
| `HeroController.SuperDash` | Crystal Heart dash |
| `HeroController.ShadeDash` | Shade Cloak dash |
| `HeroController.CoyoteTime` | Jump grace window |
| `HeroController.JumpBuffer` | Buffered jump input |

## Combat

| Class | Responsibility |
|---|---|
| `HeroCombat` | Attack coordination |
| `NailSlash` | Individual slash spawn + hitbox |
| `SpellFireball` | Vengeful Spirit / Shade Soul |
| `SpellDive` | Desolate Dive / Descending Dark |
| `SpellWraith` | Howling Wraiths / Abyss Shriek |
| `HeroSpellControl` | Spell dispatch + cost |
| `FocusControl` | Heal channel |
| `NailArt` | Charged nail technique (Cyclone/Dash/Great Slash) |
| `HealthManager` | Unified HP container (player + enemies) |
| `DamageHero` | Damage dealer component on enemy hitboxes |

## Enemies

| Class | Responsibility |
|---|---|
| `HealthManager` | Enemy HP + death |
| `EnemyDeathEffects` | Death FX + loot |
| `EnemyHitEffectsArmoured` / `Uninfected` | Hit reactions |
| `DropGeo` | Geo drops on death |
| `EnemyDreamnailReaction` | Dream Nail essence yield |
| `EnemyJournalRecord` | Hunter's Journal entry |
| PlayMaker FSMs | Per-enemy AI graph |

Enemy list (abridged):
- `Crawlid`, `Vengefly`, `TikTik`, `MosquitoFly` (entry enemies)
- `GruzMother`, `FalseKnight` (early boss)
- `ShrumalOgre`, `FungifiedHusk` (fungus enemies)
- `MossCharger`, `Mawlurk` (greenpath)
- `BelflyBox`, `AcidFly` (royal waterways)
- `Nosk`, `DeepnestDweller` (deepnest)
- `SoulMaster`, `SoulWarrior` (city)
- `HornetBoss1`, `HornetBoss2` (Hornet rematches)
- `BrokenVessel`, `PureVessel` (vessel bosses)
- `TheRadiance`, `AbsoluteRadiance` (final bosses)
- `NightmareKingGrimm` (DLC)

## Charms

| Class | Responsibility |
|---|---|
| `CharmDef` | SO: id, name, cost, effects |
| `PlayerData.hasCharm[]` | Ownership bitset |
| `PlayerData.equippedCharms[]` | Equipped list |
| `CharmIconList` | UI display |
| `CharmUpdate` | Per-charm effect application |

## NPCs

| Class | Responsibility |
|---|---|
| `NPCInteraction` | Dialogue trigger |
| `DialogueBox` | Text display |
| `DialogueEvents` | Post-dialogue actions |
| `SimpleNPCBox` | Generic dialogue NPC |
| `MerchantNPC` | Shop handler |
| `Bench` | Save + heal + charm swap |
| `Stag` | Fast travel |
| `Cornifer` | Map seller |
| `Iselda` | Map upgrade seller |
| `Sly` | Dirtmouth shop |
| `Salubra` | Charm notch + charm seller |
| `Nailsmith` | Nail upgrade |
| `Nailmaster` | Nail-Art teacher |
| `Seer` | Essence trader |
| `Grubfather` | Grub reward NPC |
| `Bretta` | Rescue mission NPC |
| `Quirrel` / `Cloth` / `Tiso` / `Myla` | Wandering NPCs |

## Map

| Class | Responsibility |
|---|---|
| `GameMap` | Map controller |
| `RoomMapData` | Per-scene map data |
| `MinimapPin` | Points of interest marker |
| `MapZoneTag` | Area classifier on scene |
| `CompassIcon` | Player position indicator |
| `MapMarker` | Placed player marker |

## Save / Persistence

| Class | Responsibility |
|---|---|
| `PlayerData` | Serialized player state (all flags + stats) |
| `SceneData` | Per-scene flag state (broken doors, activated switches) |
| `SaveGameData` | Root container |
| `GameManager.SaveGame` | Serialize to JSON |
| `GameManager.LoadGame` | Deserialize + restore |
| `PersistentBoolItem` / `PersistentIntItem` | Per-object persistence helpers |

## UI

| Class | Responsibility |
|---|---|
| `HUDManager` | Top-left HUD |
| `MaskHUD` | Mask display |
| `SoulOrbHUD` | Soul orb |
| `GeoCounter` | Geo display |
| `InventoryPage` | Pause menu page |
| `CharmsPage` | Charm equip UI |
| `EquipmentPage` | Nail + spells page |
| `JournalPage` | Hunter's Journal |
| `DreamJournalPage` | Dream readings |
| `MapPage` | Map view |
| `OptionsMenu` | Settings |
| `DialogueBox` | In-world dialogue |
| `PromptMarker` | Button prompt near interactable |

## Audio

| Class | Responsibility |
|---|---|
| `AudioManager` | Bus + mixer |
| `MusicCue` | Per-scene music track |
| `AudioSourcePool` | Pooled sources |
| `SoundBank` | SFX catalog |
| `FootstepAudio` | Surface-aware footsteps |

## Input

| Class | Responsibility |
|---|---|
| `InputHandler` | Wraps InControl |
| `HeroActions` | Semantic action set |
| `MenuInputHandler` | UI navigation |

## Scenes (Abridged — Hundreds Total)

| Scene | Region |
|---|---|
| `Dirtmouth_01` | Surface town |
| `Crossroads_##` | Forgotten Crossroads rooms |
| `Fungus1_##` | Greenpath |
| `Fungus2_##` | Fungal Wastes |
| `Ruins1_##` | City of Tears upper |
| `Ruins2_##` | City of Tears lower |
| `Mines_##` | Crystal Peak |
| `Waterways_##` | Royal Waterways |
| `Deepnest_##` | Deepnest |
| `Abyss_##` | Abyss |
| `RestingGrounds_##` | Resting Grounds |
| `GG_##` | Godhome pantheons (Godmaster DLC) |

## PlayMaker FSM Patterns (Typical Boss)

Boss FSM example — Soul Master (~50 states):

```
Start Pause → Intro → Phase 1 Choose Attack
                          ↓
Phase 1 Attack: Slam | Fireball Spread | Dash
                          ↓ (after attack)
                      Recover → Choose Next
                          ↓ (HP < 50%)
                      Phase 2 Transition (invuln)
                          ↓
Phase 2 Choose: Slam Combo | Fast Dash | Desperation
                          ↓ (HP == 0)
                      Death
```

FSM variables track: HP, player position, attack-cooldown, chosen-pattern.

## Tests (Community Reconstruction)

| Test | Covers |
|---|---|
| `CombatDamageTests` | Nail damage + charm modifiers |
| `SoulEconomyTests` | Focus cost + spell cost vs. cap |
| `ShadeReclaimTests` | Death → shade spawn → reclaim Geo |
| `SaveRoundtripTests` | PlayerData → JSON → PlayerData |
| `CharmNotchTests` | Overcharm state + effect application |
| `ProgressionGateTests` | Required abilities for area access |
