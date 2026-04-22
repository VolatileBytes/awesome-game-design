# Systems → Scripts Map — DOOM (1993) Unity

Maps each gameplay system to Unity C# scripts, ScriptableObjects, components, and scene objects. This is a spiritual Unity port — semantics parallel DOOM but implementation is Unity-native (NavMesh, CharacterController, Rigidbody, URP).

## Namespace Organization

- `Doom.Player` — player controller, health, inventory, weapons.
- `Doom.Weapons` — weapon data + behaviors.
- `Doom.Enemies` — enemy AI, data, FSM.
- `Doom.Level` — doors, lifts, switches, damage floors, teleports.
- `Doom.Items` — pickups.
- `Doom.UI` — HUD, status bar, menus.
- `Doom.Audio` — sound manager.
- `Doom.Systems` — game manager, save/load, cheats.
- `Doom.Rendering` — billboard, 8-directional sprite, retro shader support.

## Project Layout

```
Assets/_Doom/
├── Scenes/
│   ├── MainMenu.unity
│   └── Levels/E1M1_Hangar.unity, ...
├── Scripts/
│   ├── Player/
│   │   ├── PlayerController.cs
│   │   ├── PlayerHealth.cs
│   │   ├── PlayerInventory.cs
│   │   └── WeaponController.cs
│   ├── Weapons/
│   │   ├── WeaponData.cs
│   │   ├── HitscanWeapon.cs
│   │   ├── ProjectileWeapon.cs
│   │   └── RocketProjectile.cs
│   ├── Enemies/
│   │   ├── EnemyBase.cs
│   │   ├── EnemyData.cs
│   │   ├── ImpAI.cs
│   │   ├── PinkyAI.cs
│   │   ├── CacodemonAI.cs
│   │   └── BaronAI.cs
│   ├── Level/
│   │   ├── DoorController.cs
│   │   ├── LiftController.cs
│   │   ├── SwitchController.cs
│   │   ├── TeleportPad.cs
│   │   └── DamageFloor.cs
│   ├── Items/
│   │   ├── Pickup.cs
│   │   ├── HealthPickup.cs
│   │   ├── ArmorPickup.cs
│   │   ├── WeaponPickup.cs
│   │   ├── AmmoPickup.cs
│   │   ├── KeyPickup.cs
│   │   └── PowerupPickup.cs
│   ├── UI/
│   │   ├── StatusBar.cs
│   │   ├── FaceController.cs
│   │   ├── DamageFlash.cs
│   │   └── CrosshairHUD.cs
│   ├── Audio/SoundManager.cs
│   ├── Systems/
│   │   ├── GameManager.cs
│   │   ├── SaveSystem.cs
│   │   └── Cheats.cs
│   └── Rendering/
│       ├── SpriteBillboard.cs
│       └── EightDirectionalSprite.cs
├── ScriptableObjects/
│   ├── Weapons/*.asset
│   ├── Enemies/*.asset
│   └── Skill/*.asset
├── Prefabs/
│   ├── Player.prefab
│   ├── Enemies/
│   ├── Weapons/
│   ├── Items/
│   ├── Projectiles/
│   └── Doors/
├── Sprites/
├── Audio/
└── Settings/URPAsset_Doom.asset
```

## Player

### GameObject

```
Player (CapsuleCollider + CharacterController + Rigidbody)
├── CameraRig
│   ├── Main Camera (FP)
│   └── WeaponHand (SpriteRenderer child of camera)
├── PlayerController
├── PlayerHealth
├── PlayerInventory
├── WeaponController
└── AudioSource (player SFX)
```

### Classes

| Class | Role |
|---|---|
| `PlayerController` | WASD movement via CharacterController; mouse look (X rotate body, Y rotate camera) |
| `PlayerHealth` | HP + Armor; takes damage; death → reload checkpoint |
| `PlayerInventory` | Weapons bool flags, ammo counts, keys bitmask |
| `WeaponController` | Current weapon; fire animation coroutine; raise/lower |

### Movement constants (PlayerController)

| Field | Default |
|---|---|
| `walkSpeed` | 7 |
| `runSpeed` | 14 (2× walk, matches Doom's fast run) |
| `gravity` | 20 |
| `mouseSensitivity` | 2 |
| `jumpHeight` | 0 (vanilla Doom has no jump) |

## Weapons

### ScriptableObject assets (one per weapon)

| Asset | Slot | Ammo | Damage Formula | Special |
|---|---|---|---|---|
| Fist.asset | 1 | None | 5 × [1..10] | Berserk toggle on asset field |
| Chainsaw.asset | 1 | Fuel(∞) | 5 × [1..10], tics=4 | Locked melee |
| Pistol.asset | 2 | Bullets | 5 × [1..3] | Hitscan, no spread |
| Shotgun.asset | 3 | Shells | 7 × 5 × [1..3] | Hitscan, 7 pellets spread |
| Chaingun.asset | 4 | Bullets | 5 × [1..3], tics=4 | Rapid hitscan |
| RocketLauncher.asset | 5 | Rockets | Projectile (rocket) | AoE on impact |
| PlasmaRifle.asset | 6 | Cells | Projectile (plasma), tics=3 | Fast projectile |
| BFG9000.asset | 7 | Cells × 40 | Projectile + 40 tracers | Mega AoE |

### WeaponController methods

| Method | Role |
|---|---|
| `EquipWeapon(WeaponData)` | Start raise coroutine; set current |
| `OnFire()` | Check ammo; start fire coroutine |
| `FireCoroutine()` | Play anim frames; dispatch kind (hitscan/projectile/melee) |
| `FireHitscan()` | Raycast from camera with spread × pellets |
| `FireProjectile()` | Instantiate projectile prefab; set velocity |
| `FireMelee()` | Short forward raycast; damage on hit |
| `RaiseWeapon()` / `LowerWeapon()` | Swap animation coroutines |

## Enemies

### Per-monster prefabs

```
Imp.prefab
├── NavMeshAgent
├── SpriteBillboard child
│   └── SpriteRenderer
├── EightDirectionalSprite
├── Collider (Capsule)
├── AudioSource
├── ImpAI (extends EnemyBase)
└── Reference: EnemyData (Imp.asset)
```

### FSM states (EnemyState enum)

| State | Entered When | Exits To |
|---|---|---|
| `Idle` | Spawn | Chase (when player sighted) |
| `Chase` | Player sighted | Attack (in range) / Idle (LOS lost) |
| `Attack` | In attack range | Chase (out of range) |
| `Pain` | Hit with pain-chance roll | Chase (after painDuration) |
| `Death` | HP ≤ 0 | — (terminal) |

### EnemyData fields (ScriptableObject)

| Field | Purpose |
|---|---|
| `maxHealth` | Spawn HP |
| `moveSpeed` | NavMeshAgent speed |
| `sightRange`, `attackRange` | AI ranges |
| `attackInterval` | Seconds between attacks |
| `painChance` | 0-1; probability per hit to enter Pain |
| `painDuration` | Seconds in Pain state |
| `infighting` | If true, retargets attackers who are other enemies |
| `meleeDamage`, `meleeMultipliers` | Damage formula |
| `projectilePrefab` | For ranged enemies |
| `sightSound`, `attackSound`, `painSound`, `deathSound` | Audio clips |
| `walkFrames`, `attackFrames`, `painFrames`, `deathFrames` | Sprite animation arrays |
| `dropPrefab` | Death drop (e.g., Zombieman drops Clip) |

### Per-enemy subclass overrides

| Subclass | Overrides |
|---|---|
| `ImpAI` | `Attack()` — melee OR spawn fireball projectile based on range |
| `PinkyAI` | `Attack()` — pure melee; faster `moveSpeed` |
| `CacodemonAI` | `Attack()` — projectile only; flies (NavMeshAgent disabled, custom motion) |
| `BaronAI` | `Attack()` — melee + fireball; high HP |
| `CyberdemonAI` | `Attack()` — rocket launcher projectile; boss behavior |
| `SpiderMastermindAI` | `Attack()` — sustained hitscan chaingun |

## Level (Sector Equivalents)

### DoorController.cs

```csharp
public class DoorController : MonoBehaviour {
    [SerializeField] float openHeight = 3f;
    [SerializeField] float openSpeed = 2f;
    [SerializeField] float stayOpenDuration = 4f;
    [SerializeField] KeyType requiredKey = KeyType.None;

    enum State { Closed, Opening, Open, Closing }
    State state = State.Closed;

    public void Use(PlayerInventory inv) {
        if (requiredKey != KeyType.None && !inv.HasKey(requiredKey)) {
            // Play "need key" sound
            return;
        }
        if (state == State.Closed) StartCoroutine(OpenSequence());
    }

    System.Collections.IEnumerator OpenSequence() {
        state = State.Opening;
        // Move up
        // Wait
        // Move down
    }
}
```

### LiftController.cs

- Similar; raises platform when activated.

### SwitchController.cs

- Trigger zone or "E to use" proximity; fires UnityEvent on activation.

### TeleportPad.cs

- OnTriggerEnter player: move to paired destination pad position + rotation.

### DamageFloor.cs

- OnTriggerStay player: apply damage per tick interval.

## Items (Pickups)

### Pickup.cs (base)

```csharp
public abstract class Pickup : MonoBehaviour {
    [SerializeField] protected AudioClip pickupSound;
    [SerializeField] protected bool respawnInMultiplayer = false;

    protected virtual void OnTriggerEnter(Collider other) {
        if (!other.CompareTag("Player")) return;
        if (TryPickup(other.GetComponent<PlayerInventory>())) {
            AudioSource.PlayClipAtPoint(pickupSound, transform.position);
            Destroy(gameObject);  // or disable for respawn
        }
    }

    protected abstract bool TryPickup(PlayerInventory inv);
}
```

### Subclasses

| Class | Effect |
|---|---|
| `HealthPickup` | Adds HP up to cap (100 Stim, 25 Medikit, 100 Soul up to 200) |
| `ArmorPickup` | Green 100 / Mega 200 |
| `WeaponPickup` | Adds weapon to inventory + ammo |
| `AmmoPickup` | +N of type |
| `KeyPickup` | Adds key to inventory |
| `PowerupPickup` | Berserk, Invulnerability, Invisibility, etc.; timed |

## UI

### StatusBar.cs

Canvas panel anchored bottom:

```
[HealthText] [MugshotImage] [ArmorText] [AmmoText]
             [FaceController updates mugshot sprite]
```

Refreshes every frame from PlayerHealth + PlayerInventory.

### FaceController.cs

```csharp
public class FaceController : MonoBehaviour {
    [SerializeField] Sprite[] facesByHealth;     // 5 sprites for 100→80→60→40→20 buckets
    [SerializeField] Sprite[] hurtFacesByHealth; // Same buckets, but "just got hit" version
    [SerializeField] Sprite invulnerabilityFace;
    [SerializeField] Sprite berserkFace;
    [SerializeField] Image faceImage;

    void Update() {
        var hp = Player.Instance.Health;
        int bucket = Mathf.FloorToInt(hp.Current / 20f);
        bucket = Mathf.Clamp(bucket, 0, 4);
        bool recentlyHurt = Time.time - hp.LastDamageTime < 0.7f;

        if (Player.Instance.Invulnerable) faceImage.sprite = invulnerabilityFace;
        else if (Player.Instance.BerserkActive) faceImage.sprite = berserkFace;
        else if (recentlyHurt) faceImage.sprite = hurtFacesByHealth[bucket];
        else faceImage.sprite = facesByHealth[bucket];
    }
}
```

### DamageFlash.cs

- Full-screen red overlay Image with alpha set on damage; fades out over ~0.5s.

### CrosshairHUD.cs

- Small + or dot in center. Optional; vanilla Doom had none.

## Audio

### SoundManager.cs

```csharp
public class SoundManager : MonoBehaviour {
    public static SoundManager Instance;

    [Header("UI")]
    public AudioClip menuSelect, menuBack;

    void Awake() { Instance = this; }

    public void PlaySFX(AudioClip clip, Vector3 position) {
        AudioSource.PlayClipAtPoint(clip, position);
    }

    public void PlayUI(AudioClip clip) {
        // 2D play (AudioSource on this GO with 2D spatialBlend)
    }
}
```

## Systems

### GameManager.cs

```csharp
public class GameManager : MonoBehaviour {
    public static GameManager Instance;

    [SerializeField] SkillLevelData currentSkill;
    public SkillLevelData Skill => currentSkill;

    public Episode CurrentEpisode { get; set; }
    public int CurrentMapIndex { get; set; }

    public void LoadMap(int episode, int mapIndex) { /* scene load */ }
    public void CompleteMap() { /* intermission + next */ }
    public void PlayerDied() { /* reload checkpoint */ }
}
```

### SaveSystem.cs

- JsonUtility serialize/deserialize PlayerHealth + PlayerInventory + mob positions.
- Save slots via PlayerPrefs + file in `Application.persistentDataPath`.

### Cheats.cs

- Classic cheat strings: IDDQD (godmode), IDKFA (all keys + weapons + ammo), IDCLIP (noclip), IDCLEV (warp).
- Key buffer; match against known codes.

## Interfaces

### IDamageable

```csharp
public interface IDamageable {
    void TakeDamage(int amount, Vector3 hitPoint, Vector3 hitDirection);
}
```

Implemented by: `PlayerHealth`, `EnemyBase`.

## Rendering Support

### SpriteBillboard.cs

- Simple LookAt camera; sprites always face viewer.

### EightDirectionalSprite.cs

- Compute viewing angle relative to sprite's forward.
- Index into 8-sprite array (N, NE, E, SE, S, SW, W, NW).
- Selects correct sprite for current animation frame.

### Low-res RenderTexture

- Optional: render to small RT (320×200 or 640×400) for retro aesthetic.
- Blit to screen with Point filter and palette shader.

## Projectiles

### RocketProjectile.cs

```csharp
public class RocketProjectile : MonoBehaviour {
    [SerializeField] float damage = 20f;
    [SerializeField] float splashRadius = 128f;
    [SerializeField] float splashDamage = 128f;
    [SerializeField] AudioClip explosionSound;
    [SerializeField] GameObject explosionFX;

    void OnCollisionEnter(Collision col) {
        col.collider.GetComponent<IDamageable>()?.TakeDamage((int)damage, col.contacts[0].point, -transform.forward);
        Explode();
    }

    void Explode() {
        foreach (var hit in Physics.OverlapSphere(transform.position, splashRadius)) {
            var dmg = hit.GetComponent<IDamageable>();
            if (dmg != null) {
                float dist = Vector3.Distance(transform.position, hit.transform.position);
                int splash = (int)(splashDamage * (1f - dist / splashRadius));
                dmg.TakeDamage(splash, transform.position, (hit.transform.position - transform.position).normalized);
            }
        }
        Instantiate(explosionFX, transform.position, Quaternion.identity);
        AudioSource.PlayClipAtPoint(explosionSound, transform.position);
        Destroy(gameObject);
    }
}
```

## Tags + Layers

| Tag | Used By |
|---|---|
| `Player` | Player GameObject |
| `Enemy` | All enemy prefabs |
| `Projectile` | Rocket, plasma, imp fireball |
| `Pickup` | All pickup items |
| `Door` | Door GameObjects |
| `Switch` | Switch triggers |

Layers:
- `Default` — world geometry.
- `Player`, `Enemy`, `Projectile` — for physics filtering.
- `Ignore Raycast` — weapon sprite in FP camera.

## Input Actions

`DoomControls.inputactions`:

| Action | Type | Binding |
|---|---|---|
| Move | Vector2 | WASD, Gamepad Left Stick |
| Look | Vector2 | Mouse delta, Gamepad Right Stick |
| Run | Button | Shift, Gamepad Left Stick Press |
| Fire | Button | Mouse Left, Gamepad RT |
| Use | Button | E / Space, Gamepad A |
| Weapon1..7 | Button | 1..7 keys |
| WeaponNext | Button | Mouse Wheel Up |
| WeaponPrev | Button | Mouse Wheel Down |
| Pause | Button | Escape |

## Typical Call Graph — Player Fires Shotgun

1. Input System fires `Fire` action on mouse down.
2. `WeaponController.OnFire()` invoked.
3. Ammo check: `PlayerInventory.HasAmmo(Shells, 1)` — yes.
4. `WeaponController.FireCoroutine()`:
   - Decrement shells.
   - Play fire SFX.
   - Play animation frames (muzzle flash).
   - Dispatch to `FireHitscan()` because Shotgun.kind = Hitscan.
5. `FireHitscan()`:
   - Loop 7 pellets.
   - Each: random spread direction from camera forward.
   - `Physics.Raycast` to 1000 units.
   - On hit: `hit.collider.GetComponent<IDamageable>()?.TakeDamage(damage, hit.point, -ray.direction)`.
6. For each hit `EnemyBase`:
   - `TakeDamage()` subtracts health.
   - If HP ≤ 0: `Die()` — state = Death, death animation, drop pickup.
   - Else: pain roll; if success, `EnterPain()`.

## Typical Call Graph — Enemy Chases Player

1. Unity Update → `EnemyBase.Update()` → `UpdateChase()`.
2. `agent.SetDestination(target.position)` — NavMeshAgent routes.
3. Distance check: if in attack range, transition to `Attack`.
4. In Attack: `Update()` → `UpdateAttack()` → `Attack()` (subclass override).
5. Subclass (`ImpAI.Attack()`):
   - If close: deal melee damage to player via raycast.
   - If far: instantiate fireball projectile.
6. Return to Chase if out of range.

## Prefabs with Required Components

### Player.prefab

Components on root:
- Transform
- CharacterController
- Rigidbody (kinematic — for collisions with triggers)
- CapsuleCollider
- AudioSource (player SFX)
- PlayerController
- PlayerHealth
- PlayerInventory
- WeaponController
- PlayerInput (Input System)

### Enemy prefabs (e.g., Imp.prefab)

Components on root:
- Transform
- CapsuleCollider
- NavMeshAgent
- AudioSource
- Rigidbody (kinematic)
- ImpAI (inherits EnemyBase)
- EightDirectionalSprite (on child)
- SpriteBillboard (on sprite child)
- Reference: EnemyData = Imp.asset

### RocketProjectile.prefab

- Rigidbody (dynamic, no gravity)
- SphereCollider (isTrigger = false)
- RocketProjectile script
- MeshRenderer / SpriteRenderer
- ParticleSystem (optional smoke trail)

### Door.prefab

- Transform
- BoxCollider (blocks when closed; opens via script moving transform)
- DoorController
- AudioSource (open/close sounds)

## Scene Setup per Map

| Scene Element | How |
|---|---|
| World geometry | ProBuilder or imported FBX |
| Lighting | Baked for static; realtime for flickering lights |
| NavMesh | Bake via Navigation window |
| Enemy placements | Drag prefabs into scene; GameObject activation flag per skill level |
| Item placements | Drag pickup prefabs |
| Player spawn | PlayerStart GameObject; tagged "Respawn" |
| Triggers | Door colliders, switch zones, teleport pads |
| Sector effects | DamageFloor, BlinkingLight on relevant region |

## Skill Level Application

At level start, `GameManager.ApplySkill()` iterates all enemy + pickup spawn points, enabling/disabling per skill flags:

```csharp
public class EnemySpawnPoint : MonoBehaviour {
    [SerializeField] GameObject enemyPrefab;
    [SerializeField] SkillFlags availableIn;  // bitmask

    void Start() {
        if ((availableIn & GameManager.Instance.Skill.Flags) != 0) {
            Instantiate(enemyPrefab, transform.position, transform.rotation);
        }
    }
}
```

## Save Data Format (JSON)

```json
{
  "saveSlot": 1,
  "episode": 1,
  "mapIndex": 3,
  "player": {
    "position": [120, 32, 250],
    "rotation": [0, 90, 0],
    "health": 100,
    "armor": 100,
    "armorClass": 2,
    "weapons": ["Fist", "Pistol", "Shotgun"],
    "ammo": { "Bullets": 150, "Shells": 25, "Rockets": 0, "Cells": 0 },
    "keys": ["Blue"]
  },
  "enemies": [
    { "id": "imp_01", "position": [...], "health": 60, "state": "Idle" },
    ...
  ],
  "doors": [
    { "id": "door_01", "state": "Open" }
  ]
}
```

## Integration Diagram

```
PlayerInput → PlayerController → CharacterController.Move()
            → WeaponController → FireCoroutine → (Hitscan | Projectile | Melee)
                                                    ↓
                                               IDamageable.TakeDamage()
                                                    ↓
                                              EnemyBase.Die() / PlayerHealth.Die()

GameManager → LoadMap → Scene loads → Enemies spawn via EnemySpawnPoint
            ↑ 
SaveSystem → JsonUtility ↔ Application.persistentDataPath
```

## What's NOT in this Unity port

- BSP trees (Unity uses its own spatial partitioning).
- WAD files (unless using community WAD loader).
- Fixed-point math (Unity uses float).
- 35-tic-rate simulation (we use Time.deltaTime at 60 FPS).
- Software rendering (URP with post-FX for retro look).
- Exact vanilla physics (Rigidbody/CharacterController ≠ original mobj_t).
- Deterministic RNG (Unity's `Random` is seedable but differs in behavior).

For vanilla-accurate DOOM, use a source port (GZDoom, Chocolate Doom), not Unity. Unity shines for making *a* DOOM-inspired game, not reproducing *the* DOOM.
