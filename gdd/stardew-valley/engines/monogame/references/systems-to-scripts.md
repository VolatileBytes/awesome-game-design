# Systems → Scripts Map — Stardew Valley (MonoGame)

## Namespace Layout

Stardew Valley uses a flat namespace (`StardewValley`) with top-level classes rather than deeply-nested namespaces. This map organizes by responsibility.

| Category | Key Classes |
|---|---|
| Root | `Game1`, `SaveGame`, `GameLocation` |
| Player | `Farmer`, `FarmerRenderer`, `FarmerSprite` |
| Items | `Item`, `Object`, `Tool`, `MeleeWeapon`, `FishingRod`, `Furniture`, `Hat`, `Boots`, `Ring`, `Clothing` |
| Tools | `Hoe`, `WateringCan`, `Pickaxe`, `Axe`, `Scythe` |
| NPCs | `NPC`, `Character`, `Monster` |
| Combat | `Monster`, `Projectile`, `DebuffingProjectile`, `Slingshot` |
| Crops | `Crop`, `HoeDirt`, `TerrainFeature` |
| Animals | `FarmAnimal`, `AnimalHouse`, `Building` |
| Buildings | `Building`, `Coop`, `Barn`, `Shed`, `GreenhouseBuilding`, `FishPond`, `SlimeHutch` |
| Dialogue | `Dialogue`, `DialogueBox`, `Event` |
| Events | `Event`, `EventCommand` |
| Friendship | `Friendship`, `NPC.getFriendship` |
| Quests | `Quest`, `ItemDeliveryQuest`, `SlayMonsterQuest`, `FishingQuest` |
| UI | `IClickableMenu`, `InventoryMenu`, `GameMenu`, `CraftingPage`, `SocialPage` |
| Shops | `ShopMenu`, `StardewValley.Menus.BuyAnimalsMenu` |
| Save | `SaveGame`, `NewSaveGame` |
| Net | `NetFields`, `Netcode.Net*` |
| Minigames | `IMinigame`, `Minigame.FishingGame`, `PrairieKingMini`, `JunimoKartMini` |
| Audio | `SoundBank`, `Song` |
| World State | `StardewValley.Utility`, `Game1.worldState` |

## Root

| Class | Responsibility |
|---|---|
| `Game1` | MonoGame-derived root; static state holds time, season, player, current location |
| `SaveGame` | Root serialization container; XML I/O |
| `GameLocation` | Base class for every map; holds NPCs, objects, warps, terrain |
| `LocationRequest` | Pending location change (warp) |

## Player

| Class | Responsibility |
|---|---|
| `Farmer` | Player avatar; inventory, stats, XP, friendship, mail, quests |
| `FarmerSprite` | Animation state machine |
| `FarmerRenderer` | Composite sprite rendering (body + hair + hat + shirt + tool) |
| `FarmerTeam` | Co-op shared state |
| `Inventory` | Item grid (36 slots) |
| `Stats` | Per-player statistics tracking |

## Items

| Class | Responsibility |
|---|---|
| `Item` | Abstract base |
| `Object` | Most world items (crops, geodes, cooked, artisan) |
| `Tool` | Hoe, axe, pickaxe, etc. base |
| `MeleeWeapon` | Sword, club, dagger |
| `Slingshot` | Ranged |
| `FishingRod` | Rod + minigame launcher |
| `Furniture` | Placeable indoor decor |
| `Clothing`, `Hat`, `Boots`, `Ring` | Wearables |
| `ColoredObject` | Objects with color data (crops, flowers) |

## NPCs

| Class | Responsibility |
|---|---|
| `Character` | Base sprite + movement |
| `NPC` | Villager with schedule, dialogue, gifts, events |
| `Pet` | Cat / dog at farm |
| `Horse` | Mount |
| `Junimo` | Community center spirits |
| `Child` | Player's children |
| `TrashBear` | Special 1.3+ NPC |

## Combat / Monsters

| Class | Responsibility |
|---|---|
| `Monster` | Base enemy AI |
| `GreenSlime`, `BigSlime`, `DustSpirit`, `RockCrab`, `Ghost`, `Skeleton`, `ShadowBrute`, `ShadowShaman`, `Serpent`, `SquidKid`, `Bat`, `Grub`, `Fly`, `Mummy`, `LavaLurk`, `IridiumBat` | Specific monsters |
| `Projectile` | Slingshot ammo + monster projectiles |
| `DebuffingProjectile` | Poison / slow |
| `Skill.CombatSkill` | XP + bonuses |

## Crops / Terrain

| Class | Responsibility |
|---|---|
| `TerrainFeature` | Base for grass, trees, hoe-dirt, paths |
| `HoeDirt` | Tilled tile holding a Crop |
| `Crop` | Growing crop state |
| `Grass` | Pasture grass |
| `Tree` | Fruit / hardwood trees |
| `FruitTree` | Fruit tree w/ seasonal yield |
| `Bush` | Berry bush |
| `GiantCrop` | 3x3 giant variant |

## Animals

| Class | Responsibility |
|---|---|
| `FarmAnimal` | Chicken, cow, sheep, etc. |
| `AnimalHouse` | Coop/Barn interior + capacity |
| `Building` | Placed building on farm |
| `Coop`, `Barn`, `Stable`, `Mill`, `Silo`, `Shed`, `GreenhouseBuilding` | Specific building types |
| `FishPond` | Per-fish aquaculture |
| `SlimeHutch` | Slime farming |

## Dialogue / Events

| Class | Responsibility |
|---|---|
| `Dialogue` | NPC line + portrait tag |
| `DialogueBox` | Menu displaying dialogue |
| `Event` | Cutscene definition + executor |
| `EventCommand` | Single cutscene action |
| `MovieData` | Movie theater content |

## Friendship

| Class | Responsibility |
|---|---|
| `Friendship` | Per-NPC state (points, status, gifts-today) |
| `Farmer.friendshipData` | Dictionary<string, Friendship> |
| `Utility.improveFriendship` | Helper |

## Quests

| Class | Responsibility |
|---|---|
| `Quest` | Base class |
| `ItemDeliveryQuest` | "Bring X to Y" |
| `SlayMonsterQuest` | Kill-count |
| `FishingQuest` | Catch specific fish |
| `ResourceCollectionQuest` | Gather item |
| `SocializeQuest` | Meet everyone |
| `CraftingQuest` | Craft item |
| `SpecialOrder` | Mr. Qi / town special quests (1.4+) |

## Community Center

| Class | Responsibility |
|---|---|
| `CommunityCenter` | CC location + bundle state |
| `JunimoNoteMenu` | Bundle submission UI |
| `Bundle` | Per-bundle ingredient list |
| `BundleReward` | Bundle completion reward |

## Buildings / Farms

| Class | Responsibility |
|---|---|
| `Farm` | Main farm location |
| `FarmHouse` | Player's house interior |
| `Cabin` | Farmhand houses (co-op) |
| `Robin` (NPC) | Carpenter; building purchases |
| `Clint` (NPC) | Blacksmith; tool upgrades |
| `Wizard` (NPC) | Respec shrine |

## Inventory / UI

| Class | Responsibility |
|---|---|
| `IClickableMenu` | Base UI menu |
| `InventoryMenu` | Player inventory grid |
| `GameMenu` | Tabbed menu (inventory, skills, social, etc.) |
| `CraftingPage` | Craft UI |
| `SocialPage` | NPC friendship list |
| `SkillsPage` | XP bars + professions |
| `OptionsPage` | Settings |
| `CollectionsPage` | Museum / stats |
| `ExitPage` | Save + exit |
| `ShopMenu` | Vendor UI |
| `ChooseFromListMenu` | Generic picker |
| `LevelUpMenu` | Profession choice at 5/10 |

## Minigames

| Class | Responsibility |
|---|---|
| `BobberBar` | Fishing minigame |
| `PrairieKingMini` | Saloon arcade |
| `JunimoKartMini` | Saloon arcade |
| `GrangeDisplay` | Fall Fair display |
| `CalicoSpin` | Casino wheel |
| `FishingGame` | Whole fishing flow |
| `AbigailGame` | Abigail's arcade reflex |

## Saving

| Class | Responsibility |
|---|---|
| `SaveGame` | Serialization root |
| `NewSaveGame` | New file setup |
| `SaveGame.Save` | XML writer |
| `SaveGame.Load` | XML reader + version migrator |
| `NetFields` | Netcode.Net* variable registration for co-op sync |

## Audio

| Class | Responsibility |
|---|---|
| `SoundBank` | Loaded SFX |
| `Song` | Background music |
| `Game1.playSound` | Trigger SFX by id |
| `Game1.changeMusicTrack` | Context-aware music |

## Net / Co-op

| Class | Responsibility |
|---|---|
| `Server` | Host logic |
| `Client` | Farmhand logic |
| `NetFarmerRoot` | Replicated Farmer |
| `Netcode.NetList<T>` | Replicated list |
| `Netcode.NetString` | Replicated string |
| `Netcode.NetObjectList` | Replicated object list |
| `Multiplayer` | Game1.multiplayer singleton; orchestrates messages |

## Tests (community-reconstructed)

| Test | Covers |
|---|---|
| `CropGrowthTests` | Phase advancement, regrowth, seasonal death |
| `FriendshipTests` | Gift scoring, decay, thresholds |
| `SaveRoundtripTests` | Serialize → deserialize → equality |
| `ScheduleTests` | NPC schedule resolution per time/season |
| `BundleCompletionTests` | Community Center bundle matching |
| `ToolUpgradeTests` | Upgrade path + cost enforcement |
| `CombatTests` | Damage + crit + weapon modifiers |
