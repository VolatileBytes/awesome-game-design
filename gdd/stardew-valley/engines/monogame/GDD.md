---
id: stardew-valley
title: Stardew Valley — MonoGame Implementation
version: 0.1.0
description: MonoGame/XNA implementation overlay for Stardew Valley — custom C# 2D engine with Tiled maps, tick-based time simulation, and content pipeline for pixel-art assets.
tags: [monogame, xna, csharp, 2d, pixel-art, custom-engine]
---

# Stardew Valley — MonoGame Implementation

Engine overlay for Stardew Valley. See [base GDD](../../GDD.md).

> Stardew Valley is built on MonoGame (originally XNA) with a custom framework. This doc outlines the real engine architecture and patterns.

## Target

- **Framework**: MonoGame (cross-platform XNA successor).
- **Language**: C# (.NET).
- **Platforms**: PC (Windows/Mac/Linux), PS4/5, Xbox, Switch, iOS, Android.
- **Target fps**: 60.
- **Install size**: <500MB.
- **Save size**: ~1-10MB per save file.

## Packages / Dependencies

- **MonoGame.Framework**: rendering, input, audio.
- **xTile**: tile-map engine (reads Tiled + custom TBIN format).
- **SDL2**: window/input on non-Windows.
- **Newtonsoft.Json**: save serialization (pre-1.6; later may use XML).
- **Lidgren**: pre-Netcode networking (co-op).
- **Steamworks.NET** / platform SDKs: storefront integration.

## Architecture

### Game Loop

```csharp
public class Game1 : Game {
    public static Game1 Instance;
    public static SpriteBatch SpriteBatch;
    public static LocationContext CurrentLocation;
    public static Farmer Player;
    public static int TimeOfDay;    // e.g., 1430 = 2:30 PM
    public static int Season;       // 0=Spring, 1=Summer, 2=Fall, 3=Winter
    public static int DayOfMonth;
    public static int Year;
    
    protected override void Update(GameTime gameTime) {
        Input.Update();
        Player.Update(gameTime);
        CurrentLocation.Update(gameTime);
        NpcManager.UpdateAll(gameTime);
        TimeController.Tick(gameTime);
        DialogueManager.Update();
        MinigameManager.Update();
    }
    
    protected override void Draw(GameTime gameTime) {
        GraphicsDevice.Clear(Color.Black);
        SpriteBatch.Begin(samplerState: SamplerState.PointClamp);
        CurrentLocation.DrawBelow(SpriteBatch);
        Player.Draw(SpriteBatch);
        NpcManager.DrawAll(SpriteBatch);
        CurrentLocation.DrawAbove(SpriteBatch);
        UI.Draw(SpriteBatch);
        SpriteBatch.End();
    }
}
```

### Time Model

- Real time → game time at ~43:1 ratio (one real second ≈ 43 game seconds).
- TimeOfDay in 24-hour format (600 = 6am, 2600 = 2am next morning = forced sleep).
- `OnTimeChanged` event fires every 10 in-game minutes.
- NPC schedules evaluate on time change.
- Crops advance on day transition (sleep).

### Locations

Each map = xTile TMX/TBIN file + `GameLocation` class instance:

```csharp
public class GameLocation {
    public xTile.Map Map;
    public string Name;
    public List<NPC> Characters;
    public NetObjectList<TerrainFeature> TerrainFeatures;
    public NetObjectList<Object> Objects;
    public NetObjectList<Warp> Warps;
    public WeatherData Weather;
    
    public virtual void performAction(string action, Farmer who, Location tileLocation) {
        // Custom tile action (dialogue, warp, shop, etc.)
    }
}
```

Locations: Farm, Town, Pierre's, Saloon, Mine, Mountain, Forest, Beach, Desert, Island, etc.

### Warps (location transitions)

Tiles can have Warp properties → player walks onto tile → triggers warp to target location + tile.

### Player (Farmer)

```csharp
public class Farmer : Character {
    public Inventory Inventory;
    public int Stamina;
    public int Health;
    public int HairStyle, HairColor, Shirt, Pants, Skin, Eyes, Accessory;
    public int Money;
    public SerializableDictionary<string, int> FriendshipData;
    public NetStringList EventsSeen;
    public NetStringList MailReceived;
    public NetStringList Quests;
    public int MiningLevel, FarmingLevel, FishingLevel, ForagingLevel, CombatLevel;
    public int MiningXP, FarmingXP, ...;
    public Tool CurrentTool;
    
    public void tickUpdate(GameTime time, GameLocation location) {
        MovementUpdate(time);
        ToolUsageUpdate(time);
        InteractionUpdate();
    }
}
```

### Items

Item hierarchy:

```csharp
public abstract class Item {
    public string Name;
    public int ParentSheetIndex;  // sprite sheet lookup
    public int Quality;           // 0=regular, 1=silver, 2=gold, 4=iridium
    public int Stack;
    public virtual int salePrice() { ... }
}

public class Object : Item { ... }         // crops, geodes, misc
public class Tool : Item { ... }           // hoe, axe, pickaxe, etc.
public class MeleeWeapon : Tool { ... }
public class Slingshot : Tool { ... }
public class FishingRod : Tool { ... }
public class Hat, Boots, Clothing : Item { ... }
```

Each loaded from `Data/ObjectInformation.xnb` or game's data files — key-indexed by ParentSheetIndex.

### Crops

```csharp
public class Crop {
    public int rowInSpriteSheet;
    public NetList<int> phaseDays;
    public int currentPhase;
    public int dayOfCurrentPhase;
    public int harvestIndex;
    public int regrowAfterHarvest;
    public string seasonsToGrowIn;
    public bool fullyGrown;
    public int indexOfHarvest;
    
    public bool newDay(int state) {
        dayOfCurrentPhase++;
        if (dayOfCurrentPhase > phaseDays[currentPhase]) {
            currentPhase++;
            dayOfCurrentPhase = 0;
        }
        if (currentPhase >= phaseDays.Count) fullyGrown = true;
        return true;
    }
}
```

Each crop planted = `HoeDirt.crop` instance on TerrainFeature tile.

### NPCs

```csharp
public class NPC : Character {
    public string defaultMap;
    public Dictionary<string, string> Schedule;     // time → location
    public Dictionary<string, string> Dialogue;     // day/season → line
    public Dictionary<string, string> Gifts;        // item → preference
    public SerializableDictionary<int, Event> Events;  // heart → event
    public int daysUntilNotInvisible;               // Kent in war
    
    public override void update(GameTime time, GameLocation location) {
        FollowSchedule(time);
        AnimateIdle();
    }
}
```

Schedule parsed from `Data/NPCSchedule/<name>.xnb`. Each day, NPC picks schedule variant based on season, day of week, weather, heart level.

### Dialogue

Text-based authored dialogue per NPC per context:
- Regular rotation (random from dialogue pool).
- Heart events (scripted).
- Quest dialogue.
- Festival dialogue.
- Weather dialogue.

Dialogue box UI: typed-out text, portraits swap based on emotion tag.

### Events (Cutscenes)

```
@<eventPosition>/<preconditions>/<setup>/<sequence>
```

Events defined in `Data/Events/<location>.xnb`. Evaluation: check preconditions (friendship, time, mail flags) → trigger on map enter.

Events can: move NPCs, play dialogue, change screen, warp, grant items.

### Friendship

```csharp
public class FriendshipData {
    public int Points;              // 0-max; hearts = points / 250
    public bool TalkedToToday;
    public int GiftsToday;
    public int GiftsThisWeek;
    public bool ProposalRejected;
    public DateTime LastGift;
    public string Status;           // Friendly, Dating, Engaged, Married, Divorced
}
```

Persisted per-NPC in Farmer.FriendshipData.

### Crafting & Cooking

Recipes = ID → ingredients dict → output item.
```csharp
public class CraftingRecipe {
    public string Name;
    public Dictionary<int, int> Ingredients;
    public int OutputIndex;
    public int OutputStack;
    public bool IsCookingRecipe;
}
```

Recipes learned added to `Farmer.craftingRecipes` / `cookingRecipes`.

### Saving

All save data serialized to XML:

```csharp
public class SaveGame {
    public Farmer Player;
    public List<Farmer> Farmhands;  // co-op
    public List<GameLocation> Locations;
    public int TimeOfDay;
    public int DayOfMonth;
    public int Season;
    public int Year;
    public WeatherData Weather;
    public NetStringList WorldState;
    
    public static void Save() {
        using var stream = File.Create(savePath);
        var serializer = new XmlSerializer(typeof(SaveGame));
        serializer.Serialize(stream, Instance);
    }
}
```

Single save per farmer; saved on sleep.

### Audio

- MonoGame `SoundEffect` + `Song` classes.
- Background music per location + season + weather.
- SFX: tool use, footsteps, NPCs, animals, combat.
- Footstep sound per surface type (grass, wood, stone).

### UI

IClickableMenu base class; derived menus:
- `InventoryMenu`, `GameMenu`, `CraftingPage`, `SocialPage`, `OptionsPage`.
- `ShopMenu`: vendor interface.
- `DialogueBox`: NPC chat.
- `LevelUpMenu`: profession choice at 5/10.
- Minigames: `JunimoKartMini`, `PrairieKingMini` (arcade at Saloon).

### Co-op Networking

Implemented in 1.3+:
- Host-authoritative; farmhand clients mirror state.
- `Net<T>` variables replicate critical state.
- 1 host + up to 3 farmhands in base.
- Farmhands have own cabins on farm.
- Shared money option or separate.

Connection: LAN, Steam Remote Play, or direct IP.

### Minigames

- **Fishing**: bar-keeps-fish minigame.
- **Prairie King**: arcade SHMUP at Saloon.
- **Junimo Kart**: arcade platformer at Saloon.
- **Calico Spin**: casino slot.
- **Grange Display**: fair contest.
- **Egg Hunt**: festival minigame.

Each is a `MonoBehaviour`-analog — a self-contained `IMinigame` class that takes over update/draw until complete.

## Content Pipeline

MonoGame's Content Pipeline (`.xnb` compiled assets):
- Textures: 2D pixel-art PNG → XNB.
- Data: JSON / XML → XNB dictionaries.
- Audio: WAV/OGG → XNB.
- Maps: Tiled TMX / TBIN → XNB.

Modders use SMAPI to patch content without re-encoding XNB (content packs + Harmony patches).

## Modding Architecture

Not officially supported by core — but SMAPI (Stardew Modding API) is de-facto standard:
- Intercepts game calls.
- Harmony-patches methods.
- Content packs edit XNB/JSON data.
- Mods community-driven; most popular: Content Patcher, Stardew Valley Expanded.

ConcernedApe has been supportive (1.6 added mod compat features).

## Performance

- 60fps on ~Atom-class hardware.
- Draw call management: per-location batches.
- NPC update: staggered schedules prevent spikes.
- Day transition: save + regen of timed events; short pause acceptable.

## Mobile Specifics

- Touch controls (virtual joystick + tap-to-use).
- Landscape orientation.
- Auto-save on background / app close.
- IAP-free; single purchase.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Farm Design](../../references/farm-design.md)
- [NPC Design](../../references/npc-design.md)
- [Economy Design](../../references/economy-design.md)
