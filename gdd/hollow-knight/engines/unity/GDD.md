---
id: hollow-knight
title: Hollow Knight — Unity Implementation
version: 0.1.0
description: Unity implementation overlay for Hollow Knight — hand-drawn 2D metroidvania with tight combat, ability-gated exploration, and PlayMaker FSM behavior authoring.
tags: [unity, 2d, metroidvania, hand-drawn, playmaker, fsm]
---

# Hollow Knight — Unity Implementation

Engine overlay for Hollow Knight. See [base GDD](../../GDD.md).

> Hollow Knight ships on Unity (as built by Team Cherry). Known for extensive PlayMaker FSM use for enemy/boss behavior. This doc outlines the real engine architecture.

## Target

- **Unity**: originally built on 5.6 era; maintained through 2020.x.
- **Render**: built-in pipeline with custom 2D shaders.
- **Input**: InControl (legacy) / Unity Input Manager.
- **Platforms**: PC, Mac, Linux, Switch, PS4, Xbox One.
- **Target fps**: 60.
- **Install size**: ~5-10GB.

## Packages / Tools

| Tool | Purpose |
|---|---|
| PlayMaker | Visual FSM authoring (enemy + boss behavior) |
| InControl | Cross-platform input |
| 2DTK / custom | Sprite atlas + animation |
| TextMesh Pro | UI text |
| tk2d (legacy) | 2D tooling pre-Unity-official |
| Custom shaders | Distortion, 2D lighting, silhouettes |

## Architecture

### Game Manager

Central singleton orchestrating scene flow:

```csharp
public class GameManager : MonoBehaviour {
    public static GameManager Instance;
    public PlayerData PlayerData;       // save data
    public SaveGameData SaveData;
    public SceneData CurrentScene;
    public GameState State;
    public HeroController HeroController;
    public UIManager UIManager;
    
    public void LoadScene(string sceneName, GatewayType gateway) {
        State = GameState.Loading;
        StartCoroutine(LoadSceneRoutine(sceneName, gateway));
    }
    
    public void Die() {
        PlayerData.instance.geoPool = PlayerData.instance.geo;
        CreateShade(currentPosition);
        SaveGame();
        RestartAtLastBench();
    }
}
```

### Hero (Player)

```csharp
public class HeroController : MonoBehaviour {
    public HeroActions Actions;          // InControl action set
    public Rigidbody2D Rb;
    public HeroAnimationController Anim;
    public InputHandler Input;
    public HeroBox HeroBox;              // hitbox
    public Movement Movement;
    public Combat Combat;
    public Spell SpellControl;
    public Focus FocusControl;
    public DashHandler Dash;
    public SuperDash SuperDash;
    public WallSlide WallSlide;
    
    void FixedUpdate() {
        Movement.FixedUpdate();
        Combat.FixedUpdate();
    }
}
```

State machine handles movement / action flags (can-attack, can-dash, can-cast, in-focus, in-parry, stunned).

### PlayerData (Save)

```csharp
public class PlayerData {
    public static PlayerData instance;
    
    public int health;
    public int maxHealth;
    public int maxHealthBase;
    public int heartPieces;
    public int MPCharge;
    public int MPReserveMax;
    public int geo;
    public int geoPool;                  // at shade
    public Vector3 hazardRespawnLocation;
    public Vector3 respawnPos;
    public string respawnScene;
    public string respawnMarkerName;
    public bool atBench;
    
    public bool hasDash, hasWalljump, hasDoubleJump, hasSuperDash;
    public bool hasShadowDash;              // shade cloak
    public bool hasAcidArmour;
    public bool hasDreamNail;
    public bool hasDreamGate;
    public int dreamOrbs;
    public int nailSmithUpgrades;
    public int nailDamage;
    
    public bool[] hasCharm;                 // [45]
    public int[] equippedCharms;            // slot → charm id
    public int charmSlots;
    public int charmSlotsFilled;
    public bool overcharmed;
    
    public Dictionary<string, bool> sceneData; // per-scene flags
    public Dictionary<string, int> enemyKills;
    
    public int trinket1, trinket2, trinket3, trinket4;  // relics
    public int grubsCollected;
    public int grubRewards;
    public int[] essenceGained;
    
    // ...hundreds of flags
}
```

Every NPC conversation, boss kill, grub rescue, shortcut opened = a boolean flag in PlayerData.

### PlayMaker FSM (Enemy Behavior)

Most enemies use PlayMaker graphs:
- Visual state machine editor.
- Named states (Idle, Chase, Wind-Up, Attack, Recover, Stun).
- Transitions triggered by: in-sight, in-range, damage-taken, timer-elapsed.
- Actions: play animation, spawn projectile, play sound, set variable.

Boss FSMs are dozens of states with complex transition logic. Soul Master has ~50 states; Hornet ~40.

```
Example: Crawlid FSM
Idle → PatrolLeft → (reached edge) → TurnRight → PatrolRight → ...
      ↓ (hero in sight + damage taken)
    Flinch → PatrolLeft (resume)
      ↓ (HP 0)
    Death
```

### Combat

```csharp
public class HeroCombat : MonoBehaviour {
    public NailSlash NailSlashPrefabs;       // directional
    public float NailDamage => PlayerData.instance.nailDamage;
    
    public void AttackInput() {
        if (!CanAttack()) return;
        var direction = ResolveAttackDirection();
        var slashInstance = Instantiate(GetSlashPrefab(direction), transform);
        slashInstance.StartSlash();
        Anim.Play("Attack");
        Cooldown(AttackCooldown);
    }
    
    public void TakeDamage(GameObject source, int damage, Vector2 knockback) {
        if (PlayerData.instance.isInvincible) return;
        PlayerData.instance.health -= damage;
        HUDManager.UpdateMasks();
        HeroAnim.Play("Hurt");
        Rb.velocity = knockback;
        InvincibilityFrames(30);
        if (PlayerData.instance.health <= 0) GameManager.Instance.Die();
    }
}
```

### Spells

```csharp
public class SpellControl : MonoBehaviour {
    public void CastFireball() {
        if (PlayerData.instance.MPCharge < 33) return;
        PlayerData.instance.MPCharge -= 33;
        var projectile = Instantiate(
            PlayerData.instance.fireballLevel == 2 
                ? ShadeSoulPrefab 
                : VengefulSpiritPrefab,
            transform.position,
            transform.rotation
        );
        projectile.GetComponent<HeroProjectile>().Init(transform.right);
        Anim.Play("SpellFireball");
        Invincibility(15);
    }
}
```

### Focus (Healing)

```csharp
public class FocusControl : MonoBehaviour {
    public bool IsFocusing;
    public float FocusTimer;
    public float FocusDuration = 1.0f;   // reduced by Quick Focus
    
    public void StartFocus() {
        if (PlayerData.instance.MPCharge < 33) return;
        if (PlayerData.instance.health == PlayerData.instance.maxHealth) return;
        IsFocusing = true;
        FocusTimer = 0;
    }
    
    void Update() {
        if (!IsFocusing) return;
        FocusTimer += Time.deltaTime;
        if (FocusTimer >= FocusDuration) CompleteFocus();
    }
    
    void CompleteFocus() {
        PlayerData.instance.MPCharge -= 33;
        PlayerData.instance.health += 1;
        HUDManager.UpdateMasks();
        IsFocusing = false;
    }
}
```

### Charms

```csharp
[CreateAssetMenu(menuName = "HK/Charm")]
public class CharmDef : ScriptableObject {
    public int Id;
    public string Name;
    public int NotchCost;
    public CharmCategory Category;
    public Sprite Icon;
    public string Description;
}
```

Equipped charms tracked in `PlayerData.equippedCharms[]`. Charm effects applied via per-charm components on hero:

```csharp
public class Charm_LongNail : MonoBehaviour {
    void OnEnable() {
        if (PlayerData.instance.equippedCharm_6) NailSlashExtent += 0.5f;
    }
}
```

Or tag-check at relevant moments (`if (PlayerData.equippedCharm_6) damage *= 1.25`).

### Shade System

```csharp
public class ShadeManager : MonoBehaviour {
    public void CreateShade(Vector3 position, string scene, int geo, int mp) {
        PlayerData.instance.shadePos = position;
        PlayerData.instance.shadeScene = scene;
        PlayerData.instance.geoPool = geo;
        PlayerData.instance.shadeMP = mp;
    }
    
    public void SpawnShadeIfInScene(string sceneName) {
        if (PlayerData.instance.shadeScene != sceneName) return;
        var shade = Instantiate(ShadePrefab, PlayerData.instance.shadePos, Quaternion.identity);
        shade.GetComponent<ShadeEnemy>().Init(PlayerData.instance.geoPool, PlayerData.instance.shadeMP);
    }
    
    public void OnShadeDefeated() {
        PlayerData.instance.geo += PlayerData.instance.geoPool;
        PlayerData.instance.MPCharge = Mathf.Min(PlayerData.instance.MPReserveMax, PlayerData.instance.MPCharge + 33);
        ClearShade();
    }
}
```

### Scenes

Each map area = one Unity scene (technically many sub-scenes per room in world). Scene loading:

```csharp
public IEnumerator LoadSceneRoutine(string sceneName, GatewayType gateway) {
    StartFade();
    yield return SceneManager.LoadSceneAsync(sceneName);
    FindSpawnPointForGateway(gateway);
    HeroController.transform.position = spawnPoint.position;
    EndFade();
    SceneEntered?.Invoke(sceneName);
}
```

Scene transitions are between adjacent rooms; tight streaming feels like no-load.

### Audio

- Custom music director.
- Per-area music swap on scene enter.
- Boss stingers + phase transitions.
- SFX bus: nail, enemy, environment, UI.

### Save / Load

JSON-encoded PlayerData:

```csharp
public static class SaveSystem {
    public static void Save(int slot) {
        var data = new SaveGameData {
            PlayerData = PlayerData.instance,
            SceneData = SceneData.instance,
            Version = CurrentVersion,
            Timestamp = DateTime.UtcNow.Ticks,
        };
        var json = JsonUtility.ToJson(data);
        File.WriteAllText(GetSavePath(slot), json);
    }
    
    public static SaveGameData Load(int slot) {
        var json = File.ReadAllText(GetSavePath(slot));
        return JsonUtility.FromJson<SaveGameData>(json);
    }
}
```

Auto-save on bench rest. Manual save slots (4 base game).

### UI (HUD + Menus)

```csharp
public class HUDManager : MonoBehaviour {
    public MaskHUD MaskDisplay;
    public SoulOrbHUD SoulDisplay;
    public GeoCounter GeoDisplay;
    public CharmInventory CharmUI;
    public DialogueBox DialogueUI;
    
    public void UpdateMasks() {
        MaskDisplay.Refresh(PlayerData.instance.health, PlayerData.instance.maxHealth);
    }
}
```

Pause menu → inventory, charms, map, journal (Hunter's + Dream), options.

### Map

- Map texture per area (hand-drawn PNG).
- Player marker + NPC pins overlaid.
- Scene fog revealed on bench rest.

```csharp
public class GameMap : MonoBehaviour {
    public Dictionary<string, RoomMapData> RoomMaps;
    public void RevealRoom(string roomName) {
        RoomMaps[roomName].Visited = true;
        MapUI.RenderPins();
    }
}
```

### Dream Nail

```csharp
public class DreamNail : MonoBehaviour {
    public void Activate() {
        if (TargetEnemy != null) {
            DisplayDreamDialogue(TargetEnemy.DreamText);
            GainEssence(TargetEnemy.EssenceValue);
        }
        if (TargetWhisperingRoot != null) {
            EnterDreamRoom(TargetWhisperingRoot.DreamRoomScene);
        }
    }
}
```

Dream Gate: marked warp anywhere.

### NPC Dialogue

PlayMaker FSMs control NPC dialogue:
- Proximity trigger → dialogue FSM starts.
- Dialogue boxes text streams from localization tables.
- Choices via button inputs.

### Camera

```csharp
public class CameraController : MonoBehaviour {
    public Transform Target;
    public float Smoothing = 0.2f;
    public Vector2 LookOffset;
    
    void LateUpdate() {
        var lookInput = InputHandler.GetLookInput();
        LookOffset = Vector2.Lerp(LookOffset, lookInput * 2f, Time.deltaTime * 2);
        var desired = Target.position + (Vector3)LookOffset;
        transform.position = Vector3.SmoothDamp(transform.position, desired, ref vel, Smoothing);
    }
}
```

Boss arena lock: overrides target with arena center; clamps to arena bounds.

## Data Layout

```
Assets/
  _Project/
    Art/
      Knight/
      Enemies/
        Crossroads/
        Greenpath/
        ...
      Environments/
        Crossroads/
        Greenpath/
        FungalWastes/
        ...
      UI/
    Audio/
      Music/
        Greenpath/
        CityOfTears/
        ...
      SFX/
    Data/
      Charms/           # CharmDef SOs
      Enemies/          # EnemyDef SOs
      Spells/           # SpellDef SOs
      Dialogue/         # Localization XML
      MapData/
    Prefabs/
      Hero/
      Enemies/
      VFX/
      Projectiles/
    Scenes/
      GameManager.unity
      Dirtmouth.unity
      Crossroads_01.unity
      Crossroads_02.unity
      Greenpath_01.unity
      Greenpath_02.unity
      Town_NPC.unity
      ...
    Scripts/
      Hero/
      Enemy/
      Combat/
      UI/
      Net/ (none; SP only)
      Save/
    FSM/  (PlayMaker graphs)
      Enemies/
      Bosses/
      NPCs/
```

Hundreds of scenes — one per room. Tight streaming between scenes creates illusion of seamless world.

## Performance

- Target 60fps on Switch in dock.
- Sprite atlasing per area.
- Audio streaming; music cross-fade at scene transitions.
- Culling: sprites outside camera disabled.
- PlayMaker FSMs pause when enemy off-screen (LOD via enable/disable).

## Mod Community

Unofficial mod scene (Modding API):
- Custom bosses (Pale Court mod).
- Difficulty adjustments.
- Item rando.
- QoL fixes.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Combat Design](../../references/combat-design.md)
- [Map Design](../../references/map-design.md)
- [Progression Design](../../references/progression-design.md)
