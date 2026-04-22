---
id: escape-from-duckov
title: Escape from Duckov — Unity Implementation
version: 0.1.0
description: Unity-specific implementation overlay for Escape from Duckov — top-down extraction shooter with persistent stash and solo-tuned economy.
tags: [unity, top-down-shooter, extraction, single-player]
---

# Escape from Duckov — Unity Implementation

Engine overlay for Escape from Duckov. See [base GDD](../../GDD.md).

> Shipping game uses Unity; exact version not publicly documented. This doc describes the architecture for a Unity 2022.3 LTS target.

## Target

- **Unity**: 2022.3 LTS.
- **Render pipeline**: URP 2D (sprites + 2D lighting) or URP 3D (for small-scale isometric).
- **Input**: New Input System (keyboard + mouse + controller).
- **Platforms**: PC primary; Steam Deck + mobile possible.
- **Target fps**: 60 / 120.

## Packages

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP |
| `com.unity.inputsystem` | Input |
| `com.unity.addressables` | Asset streaming per zone |
| `com.unity.textmeshpro` | UI |
| `com.unity.ai.navigation` | AI pathing |
| `com.unity.2d.animation` | Rigged duck sprites |
| `com.unity.localization` | Multi-language |

Third-party:
- **DOTween**: UI tweens.
- **Newtonsoft.Json**: save files.
- **A* Pathfinding Project** (optional): smoother AI nav.

## Core Architecture

### Single-Player Sim

Everything runs locally; no session server:

```csharp
public class GameController : MonoBehaviour {
    public PlayerController Player;
    public RaidController ActiveRaid;
    public HomeBaseController HomeBase;
    public SaveSystem SaveSystem;
    public bool InRaid => ActiveRaid != null;
    
    public void StartRaid(ZoneDefinition zone, LoadoutData loadout) {
        ActiveRaid = new RaidController(zone, loadout, Player);
        ActiveRaid.OnRaidEnd += OnRaidEndHandler;
        LoadScene(zone.SceneName);
    }
    
    public void OnRaidEndHandler(RaidResult result) {
        SaveSystem.PersistRaidResult(result);
        UnloadScene(ActiveRaid.Zone.SceneName);
        LoadScene("HomeBase");
        ActiveRaid = null;
    }
}
```

### Player Character

```csharp
public class PlayerDuck : MonoBehaviour {
    public HealthController Health;
    public InventoryController Inventory;
    public WeaponController CurrentWeapon;
    public MovementController Movement;
    public StaminaController Stamina;
    public StatusEffectController StatusFx;
    public DuckAudioEmitter AudioEmitter;
    public TopDownCameraTarget CameraTarget;
}
```

### Health (4-Zone)

```csharp
public class HealthController : MonoBehaviour {
    public BodyZoneHP Head = new(30);
    public BodyZoneHP Torso = new(150);
    public BodyZoneHP Arms = new(80);
    public BodyZoneHP Legs = new(80);
    
    public void ApplyDamage(BodyZone zone, float damage, DamageInfo info) {
        var z = GetZone(zone);
        z.Current -= damage;
        if (info.CausesBleed) StatusFx.ApplyBleed(zone, info.BleedSeverity);
        if (info.CausesFracture) StatusFx.ApplyFracture(zone);
        if (zone == BodyZone.Head && z.Current <= 0) Die();
        if (zone == BodyZone.Torso && z.Current <= 0) Die();
    }
}
```

### Ballistics

Top-down doesn't need bullet-drop:
- Hitscan for SMGs, pistols, rifles (instant resolution).
- Projectiles for slow-travel rounds (explosives, rockets, some long-range).

```csharp
public class WeaponController {
    public void Fire(Vector2 direction) {
        var ammo = CurrentMagazine.Peek();
        if (ammo == null) return;
        
        CurrentMagazine.Pop();
        var spread = ComputeSpread(weapon, state);
        var shotDir = ApplySpread(direction, spread);
        
        if (weapon.IsHitscan) {
            var hit = Physics2D.Raycast(Origin, shotDir, weapon.MaxRange, EnemyLayer);
            if (hit.collider) HandleHit(hit, ammo);
        } else {
            SpawnProjectile(Origin, shotDir, weapon.ProjectileSpeed, ammo);
        }
        
        ApplyRecoilKick(weapon);
        PlayFireFX(weapon);
        AudioEmitter.PlayFire(weapon);
    }
}
```

### Armor Penetration

```csharp
public static class PenetrationSolver {
    public static PenResult Roll(AmmoDef ammo, ArmorInstance armor) {
        var penChance = Mathf.Clamp01(
            (ammo.PenPower - armor.Class) / 5.0f +
            (1 - armor.DurabilityPct) * 0.3f
        );
        var roll = Random.value;
        if (roll < penChance) return PenResult.Penetrated;
        if (roll < penChance + 0.2f) return PenResult.Partial;
        return PenResult.Blocked;
    }
}
```

### Top-Down Camera

```csharp
public class TopDownCamera : MonoBehaviour {
    public Transform Target;
    public float FollowSmoothing = 0.1f;
    public float LookAheadDistance = 2f;
    public Vector2 MouseInfluence = new(0.3f, 0.3f);
    
    void LateUpdate() {
        var mouseWorld = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        var mouseDir = ((Vector2)mouseWorld - (Vector2)Target.position).normalized;
        var lookAhead = mouseDir * LookAheadDistance * MouseInfluence;
        var targetPos = (Vector2)Target.position + lookAhead;
        transform.position = Vector3.SmoothDamp(transform.position, targetPos, ref vel, FollowSmoothing);
    }
}
```

### LOS / Wall Fade

Use 2D shadow caster + object-fade shader:
- Walls block Vision cone.
- Objects between camera and player fade to 30% alpha.

```csharp
public class WallFader : MonoBehaviour {
    public float FadeRadius = 3f;
    SpriteRenderer sr;
    
    void Update() {
        var dist = Vector2.Distance(transform.position, Player.Instance.transform.position);
        float alpha = dist < FadeRadius ? 0.3f : 1.0f;
        sr.color = new Color(1, 1, 1, Mathf.Lerp(sr.color.a, alpha, Time.deltaTime * 5));
    }
}
```

## Inventory (Tetris)

```csharp
public class InventoryController {
    public PaperDollSlots EquipmentSlots;
    public GridContainer SecurePouch;  // 2x2
    public List<GridContainer> Rigs, Backpacks;
    
    public bool TryPlace(ItemInstance item, GridContainer container, Vector2Int origin) {
        if (!container.FitsAt(item.GridSize, origin, item.Rotation)) return false;
        container.Place(item, origin);
        InventoryChanged?.Invoke();
        return true;
    }
}

public class GridContainer {
    public int Width, Height;
    public Dictionary<Vector2Int, ItemInstance> Cells = new();
    public bool FitsAt(Vector2Int size, Vector2Int origin, int rotation) { ... }
}
```

## AI

Behavior tree + FSM hybrid:

```csharp
public abstract class EnemyAI : MonoBehaviour {
    public AIState State;
    public NavMeshAgent NavAgent;
    public AISensor Sensor;
    public AIWeaponController Weapon;
    public HealthController Health;
    public DropTableDef DropTable;
}

public class GruntDuck : EnemyAI { }
public class TacticalDuck : EnemyAI { }
public class BossDuck : EnemyAI {
    public List<BossPhase> Phases;
}
```

Sensor tick: 10Hz LOS + hearing.

## Home Base

Home Base is a separate scene:
```csharp
public class HomeBaseController : MonoBehaviour {
    public StashController Stash;
    public List<VendorController> Vendors;
    public WorkbenchController Workbench;
    public GardenController Garden;
    public MedbayController Medbay;
}
```

Each sub-system: persistent state saved to disk.

## Save / Load

Entirely file-based:
```csharp
public class SaveData {
    public PlayerProfile Player;
    public StashData Stash;
    public HomeBaseData HomeBase;
    public Dictionary<ZoneId, ZoneProgress> Zones;
    public Dictionary<QuestId, QuestProgress> Quests;
    public Dictionary<VendorId, VendorRep> Vendors;
    public long GameTimeMs;
}
```

Persisted as JSON; backup saves on each raid completion.

## UI

UI Toolkit (modern Unity UI) + UGUI hybrid:
```
UI/
  HUD/
    HealthBar.uxml
    AmmoDisplay.uxml
    Minimap.uxml
    QuestTracker.uxml
  Inventory/
    TetrisGrid.uxml
    ItemTooltip.uxml
    Dragger.uxml
  HomeBase/
    StashScreen.uxml
    VendorScreen.uxml
    WorkbenchScreen.uxml
  Menus/
    MainMenu.uxml
    Pause.uxml
    Settings.uxml
```

## Audio

Unity's audio with custom 2D attenuation:
```csharp
public class DuckAudioEmitter : MonoBehaviour {
    public AudioClip QuackHurt, QuackDeath, FootstepsConcrete, FootstepsGrass;
    public AudioSource Source;
    
    public void PlayQuack(QuackEvent ev) {
        var clip = ResolveClip(ev);
        Source.PlayOneShot(clip, ComputeVolume(ev));
    }
}
```

Distance-based attenuation, simple reverb zones per map area.

## Project Layout

```
Assets/
  _Project/
    Art/
      Characters/
        Ducks/
      Weapons/
      Armor/
      Environments/
        Outskirts/
        Suburbs/
        ...
    Audio/
      Quacks/
      Weapons/
      Ambient/
    Data/
      Weapons/        # SO defs
      Ammo/
      Armor/
      Items/
      Vendors/
      Zones/
      Quests/
      Crafting/
      AI/
    Prefabs/
      Player/
      Enemies/
      Loot/
      VFX/
    Scenes/
      Boot.unity
      MainMenu.unity
      HomeBase.unity
      Zone_Outskirts.unity
      Zone_Suburbs.unity
      ...
    Scripts/
      Sim/
      Player/
      AI/
      Inventory/
      UI/
      HomeBase/
      Save/
```

## Performance

- Target: 60fps on mid-tier hardware for large zones.
- Sprite batching for duck sprites.
- Enemy count: ~30 simultaneously visible.
- Addressables streams per-zone art.

## Mobile Considerations

If porting to mobile:
- Controls: virtual stick + tap-to-shoot.
- Simplified HUD.
- Reduced enemy counts per zone.
- Shorter raid timers.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Combat Design](../../references/combat-design.md)
- [Economy Design](../../references/economy-design.md)
