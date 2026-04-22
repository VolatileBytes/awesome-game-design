---
id: doom-1993
title: DOOM (1993) — Unity Implementation
version: 0.1.0
description: Unity reconstruction of DOOM — retro FPS in URP, CharacterController-based movement, billboard sprite enemies, ScriptableObject weapons/monsters, custom WAD loader optional. Spiritual port, not source-accurate.
tags: [unity, urp, retro-fps, character-controller, billboard-sprites, scriptableobject, c-sharp]
---

# DOOM (1993) — Unity Implementation

Engine overlay for DOOM. See [base GDD](../../GDD.md).

> Unity doesn't use BSP trees, software rendering, or WAD files natively — Unity is a hardware-accelerated 3D engine with PBR materials and GPU rendering. This overlay documents a **spiritual Unity port** that preserves DOOM's feel (fast movement, shotgun combat, billboard sprites, 2.5D level design) while using modern Unity idioms. For source-accurate DOOM, use a dedicated port like Chocolate Doom or GZDoom compiled via WebGL — not Unity.

## Target

- **Unity version**: 2022.3 LTS minimum (URP).
- **Render pipeline**: URP with post-processing (CRT-scanline shader optional for authenticity).
- **Physics**: CharacterController + Rigidbody (projectiles + corpses).
- **Input**: Unity Input System.
- **Platforms**: all; VR variants exist (see DOOM VFR, third-party mods).
- **Target FPS**: 60+ (modern); can lock to 35 to mimic original tic rate.

## Stack

| Piece | Technology |
|---|---|
| Rendering | URP 3D with 2D sprite billboards for actors |
| Movement | CharacterController (fast, controllable) |
| Weapons | ScriptableObject data + player weapon state machine |
| Enemies | MonoBehaviour FSM + billboard sprite + NavMesh or custom pathing |
| Levels | Unity scenes OR runtime-loaded WAD (via community Unity WAD loader) |
| Audio | AudioSource per event + spatial blend |
| UI | Canvas for HUD, status bar, menu |
| Save | JsonUtility + PlayerPrefs |
| Multiplayer | Unity Netcode for GameObjects (NGO) or Mirror |

## Project Structure

```
Assets/_Doom/
├── Scenes/
│   ├── MainMenu.unity
│   ├── E1M1_Hangar.unity
│   ├── E1M2_NuclearPlant.unity
│   └── ...
├── Scripts/
│   ├── Player/
│   │   ├── PlayerController.cs          # Movement + look
│   │   ├── PlayerHealth.cs              # HP, armor, damage
│   │   ├── PlayerInventory.cs           # Weapons, ammo, keys
│   │   └── WeaponController.cs          # Selected weapon + firing
│   ├── Weapons/
│   │   ├── WeaponData.cs                # ScriptableObject base
│   │   ├── HitscanWeapon.cs
│   │   ├── ProjectileWeapon.cs
│   │   └── MeleeWeapon.cs
│   ├── Enemies/
│   │   ├── EnemyBase.cs                 # Base MonoBehaviour
│   │   ├── EnemyData.cs                 # ScriptableObject stats
│   │   ├── EnemyState.cs                # FSM states: Idle/Chase/Attack/Pain/Death
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
│   │   ├── StatusBar.cs                 # Classic Doom status bar
│   │   ├── CrosshairHUD.cs
│   │   ├── DamageFlash.cs               # Red tint on damage
│   │   └── FaceController.cs            # Mugshot reactions
│   ├── Audio/
│   │   └── SoundManager.cs              # 2D + 3D SFX
│   ├── Systems/
│   │   ├── GameManager.cs
│   │   ├── SaveSystem.cs
│   │   └── Cheats.cs                    # IDDQD, IDKFA, etc.
│   └── Rendering/
│       ├── SpriteBillboard.cs           # Always face camera
│       ├── EightDirectionalSprite.cs    # Classic 8-angle sprite
│       └── RetroShader.shader           # Low-res + palette + dither
├── ScriptableObjects/
│   ├── Weapons/
│   │   ├── Fist.asset
│   │   ├── Chainsaw.asset
│   │   ├── Pistol.asset
│   │   ├── Shotgun.asset
│   │   ├── Chaingun.asset
│   │   ├── RocketLauncher.asset
│   │   ├── PlasmaRifle.asset
│   │   └── BFG9000.asset
│   ├── Enemies/
│   │   ├── Zombieman.asset
│   │   ├── ShotgunGuy.asset
│   │   ├── Imp.asset
│   │   ├── Pinky.asset
│   │   ├── Spectre.asset
│   │   ├── LostSoul.asset
│   │   ├── Cacodemon.asset
│   │   ├── BaronOfHell.asset
│   │   ├── Cyberdemon.asset
│   │   └── SpiderMastermind.asset
│   └── Skill/
│       ├── ITYTD.asset
│       ├── HNTR.asset
│       ├── HMP.asset
│       ├── UV.asset
│       └── Nightmare.asset
├── Prefabs/
│   ├── Player.prefab
│   ├── Enemies/
│   ├── Items/
│   ├── Doors/
│   ├── Projectiles/
│   └── UI/
├── Sprites/
│   ├── Monsters/                        # Sprite sheets per enemy (8 angles × N frames)
│   ├── Items/
│   └── Weapons/                         # First-person weapon hand sprites
├── Audio/
├── Materials/
├── Shaders/
└── Settings/
    └── URPAsset_Doom.asset
```

## Core Gameplay Scripts

### PlayerController.cs

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

[RequireComponent(typeof(CharacterController))]
public class PlayerController : MonoBehaviour {
    [SerializeField] float walkSpeed = 7f;
    [SerializeField] float runSpeed = 14f;      // ~2x walk, matches Doom's fast run
    [SerializeField] float gravity = 20f;
    [SerializeField] float mouseSensitivity = 2f;
    [SerializeField] Transform cameraTransform;

    CharacterController cc;
    Vector2 moveInput;
    Vector2 lookInput;
    bool running;
    float verticalVelocity;
    float pitch;

    // Input System callbacks
    public void OnMove(InputAction.CallbackContext ctx) => moveInput = ctx.ReadValue<Vector2>();
    public void OnLook(InputAction.CallbackContext ctx) => lookInput = ctx.ReadValue<Vector2>();
    public void OnRun(InputAction.CallbackContext ctx)  => running = ctx.ReadValueAsButton();

    void Awake() {
        cc = GetComponent<CharacterController>();
        Cursor.lockState = CursorLockMode.Locked;
    }

    void Update() {
        // Look
        transform.Rotate(Vector3.up, lookInput.x * mouseSensitivity);
        pitch -= lookInput.y * mouseSensitivity;
        pitch = Mathf.Clamp(pitch, -89f, 89f);
        cameraTransform.localEulerAngles = new Vector3(pitch, 0, 0);

        // Move
        Vector3 forward = transform.forward * moveInput.y;
        Vector3 right   = transform.right   * moveInput.x;
        Vector3 horizontal = (forward + right).normalized * (running ? runSpeed : walkSpeed);

        if (cc.isGrounded) verticalVelocity = -1f;
        else verticalVelocity -= gravity * Time.deltaTime;

        Vector3 velocity = horizontal + Vector3.up * verticalVelocity;
        cc.Move(velocity * Time.deltaTime);
    }
}
```

### WeaponData.cs (ScriptableObject)

```csharp
using UnityEngine;

public enum AmmoType { None, Bullets, Shells, Rockets, Cells }
public enum WeaponKind { Melee, Hitscan, Projectile }

[CreateAssetMenu(fileName = "Weapon", menuName = "Doom/Weapon")]
public class WeaponData : ScriptableObject {
    public string weaponName;
    public int slot;
    public WeaponKind kind;
    public AmmoType ammoType;
    public int ammoPerShot = 1;

    [Header("Damage")]
    public int baseDamage = 5;
    public int damageMultipliersUpTo = 3;   // damage = baseDamage * random(1..multi)
    public int pelletsPerShot = 1;          // shotgun = 7
    public float spreadDegrees = 0f;        // hitscan pellet spread

    [Header("Timing (tics; 1 tic = 1/35 sec)")]
    public int raiseTics = 12;
    public int fireTics = 17;
    public int lowerTics = 12;

    [Header("Projectile (if Projectile kind)")]
    public GameObject projectilePrefab;
    public float projectileSpeed = 20f;

    [Header("Audio")]
    public AudioClip fireSound;
    public AudioClip dryFireSound;

    [Header("Visuals")]
    public Sprite[] fireFrames;
    public Sprite idleSprite;
    public Sprite raiseSprite;
    public Sprite lowerSprite;
}
```

### WeaponController.cs

```csharp
using System.Collections;
using UnityEngine;

public class WeaponController : MonoBehaviour {
    [SerializeField] PlayerInventory inventory;
    [SerializeField] Transform muzzlePoint;
    [SerializeField] Camera fpCamera;
    [SerializeField] SpriteRenderer handSprite;
    [SerializeField] AudioSource audioSource;

    const float TIC = 1f / 35f;
    WeaponData current;
    bool firing;

    public void EquipWeapon(WeaponData weapon) {
        current = weapon;
        StartCoroutine(RaiseWeapon(weapon));
    }

    public void OnFire() {
        if (firing || current == null) return;
        if (!inventory.HasAmmo(current.ammoType, current.ammoPerShot)) {
            audioSource.PlayOneShot(current.dryFireSound);
            return;
        }
        StartCoroutine(FireCoroutine());
    }

    IEnumerator FireCoroutine() {
        firing = true;
        inventory.ConsumeAmmo(current.ammoType, current.ammoPerShot);
        audioSource.PlayOneShot(current.fireSound);

        foreach (var frame in current.fireFrames) {
            handSprite.sprite = frame;
            yield return new WaitForSeconds(2 * TIC);
        }

        switch (current.kind) {
            case WeaponKind.Hitscan:   FireHitscan();   break;
            case WeaponKind.Projectile: FireProjectile(); break;
            case WeaponKind.Melee:     FireMelee();     break;
        }

        yield return new WaitForSeconds(current.fireTics * TIC);
        handSprite.sprite = current.idleSprite;
        firing = false;
    }

    void FireHitscan() {
        for (int i = 0; i < current.pelletsPerShot; i++) {
            Vector3 spread = Random.insideUnitSphere * current.spreadDegrees;
            Quaternion rot = Quaternion.Euler(spread) * fpCamera.transform.rotation;
            Ray ray = new Ray(fpCamera.transform.position, rot * Vector3.forward);
            if (Physics.Raycast(ray, out RaycastHit hit, 1000f)) {
                int damage = current.baseDamage * Random.Range(1, current.damageMultipliersUpTo + 1);
                hit.collider.GetComponent<IDamageable>()?.TakeDamage(damage, hit.point, -ray.direction);
            }
        }
    }

    void FireProjectile() {
        GameObject proj = Instantiate(current.projectilePrefab, muzzlePoint.position, fpCamera.transform.rotation);
        proj.GetComponent<Rigidbody>().linearVelocity = fpCamera.transform.forward * current.projectileSpeed;
    }

    void FireMelee() {
        // Forward raycast with short range; melee-specific damage
        if (Physics.Raycast(fpCamera.transform.position, fpCamera.transform.forward, out RaycastHit hit, 2f)) {
            int damage = current.baseDamage * Random.Range(1, current.damageMultipliersUpTo + 1);
            hit.collider.GetComponent<IDamageable>()?.TakeDamage(damage, hit.point, -fpCamera.transform.forward);
        }
    }

    IEnumerator RaiseWeapon(WeaponData weapon) {
        handSprite.sprite = weapon.raiseSprite;
        yield return new WaitForSeconds(weapon.raiseTics * TIC);
        handSprite.sprite = weapon.idleSprite;
    }
}
```

### EnemyBase.cs (FSM)

```csharp
using UnityEngine;
using UnityEngine.AI;

public enum EnemyState { Idle, Chase, Attack, Pain, Death }

[RequireComponent(typeof(NavMeshAgent))]
public class EnemyBase : MonoBehaviour, IDamageable {
    [SerializeField] protected EnemyData data;
    [SerializeField] protected EightDirectionalSprite spriteRenderer;
    [SerializeField] protected AudioSource audioSource;

    protected NavMeshAgent agent;
    protected EnemyState state;
    protected Transform target;
    protected int health;
    protected float attackCooldown;

    protected virtual void Awake() {
        agent = GetComponent<NavMeshAgent>();
        health = data.maxHealth;
        state = EnemyState.Idle;
    }

    protected virtual void Update() {
        switch (state) {
            case EnemyState.Idle:   UpdateIdle();   break;
            case EnemyState.Chase:  UpdateChase();  break;
            case EnemyState.Attack: UpdateAttack(); break;
            case EnemyState.Pain:   UpdatePain();   break;
        }
    }

    protected virtual void UpdateIdle() {
        // Scan for player; if seen, transition to Chase
        if (CanSeePlayer()) {
            target = Player.Instance.transform;
            state = EnemyState.Chase;
            audioSource.PlayOneShot(data.sightSound);
        }
    }

    protected virtual void UpdateChase() {
        if (!target) { state = EnemyState.Idle; return; }
        agent.SetDestination(target.position);
        float dist = Vector3.Distance(transform.position, target.position);
        if (dist <= data.attackRange) {
            state = EnemyState.Attack;
            agent.isStopped = true;
        }
    }

    protected virtual void UpdateAttack() {
        if (!target) { state = EnemyState.Idle; return; }
        attackCooldown -= Time.deltaTime;
        if (attackCooldown <= 0) {
            Attack();
            attackCooldown = data.attackInterval;
        }
        float dist = Vector3.Distance(transform.position, target.position);
        if (dist > data.attackRange) {
            state = EnemyState.Chase;
            agent.isStopped = false;
        }
    }

    protected virtual void UpdatePain() {
        // Short stagger; return to Chase
        // Set by PainCoroutine
    }

    protected virtual void Attack() {
        // Overridden per enemy type
    }

    public void TakeDamage(int amount, Vector3 hitPoint, Vector3 hitDirection) {
        health -= amount;
        if (health <= 0) { Die(); return; }
        if (Random.value < data.painChance) { EnterPain(); }
        if (data.infighting) RetargetAttacker();
    }

    protected void EnterPain() {
        state = EnemyState.Pain;
        StartCoroutine(PainCoroutine());
    }

    System.Collections.IEnumerator PainCoroutine() {
        audioSource.PlayOneShot(data.painSound);
        yield return new WaitForSeconds(data.painDuration);
        state = EnemyState.Chase;
    }

    protected virtual void Die() {
        state = EnemyState.Death;
        agent.enabled = false;
        GetComponent<Collider>().enabled = false;
        audioSource.PlayOneShot(data.deathSound);
        // Drop pickup if any
        if (data.dropPrefab) Instantiate(data.dropPrefab, transform.position, Quaternion.identity);
        // Play death sprite animation
        spriteRenderer.PlayDeathAnimation();
    }

    bool CanSeePlayer() {
        if (!Player.Instance) return false;
        Vector3 toPlayer = Player.Instance.transform.position - transform.position;
        if (toPlayer.magnitude > data.sightRange) return false;
        if (Physics.Raycast(transform.position + Vector3.up, toPlayer.normalized, out RaycastHit hit, data.sightRange)) {
            return hit.transform.CompareTag("Player");
        }
        return false;
    }

    protected void RetargetAttacker() {
        // Implement infighting targeting
    }
}
```

### EnemyData.cs (ScriptableObject)

```csharp
[CreateAssetMenu(fileName = "Enemy", menuName = "Doom/Enemy")]
public class EnemyData : ScriptableObject {
    public string monsterName;
    public int maxHealth = 60;
    public float moveSpeed = 3f;
    public float sightRange = 30f;
    public float attackRange = 10f;
    public float attackInterval = 1.5f;
    public float painChance = 0.2f;
    public float painDuration = 0.3f;
    public bool infighting = true;

    [Header("Attacks")]
    public int meleeDamage = 3;
    public int meleeMultipliers = 8;         // 3 × [1..8] = 3-24
    public GameObject projectilePrefab;

    [Header("Audio")]
    public AudioClip sightSound;
    public AudioClip attackSound;
    public AudioClip painSound;
    public AudioClip deathSound;

    [Header("Sprites (8-directional per frame)")]
    public Sprite[][] walkFrames;             // walkFrames[angle][frame]
    public Sprite[][] attackFrames;
    public Sprite[][] painFrames;
    public Sprite[] deathFrames;

    [Header("Drops")]
    public GameObject dropPrefab;             // e.g., Zombieman → Clip
}
```

### SpriteBillboard.cs

```csharp
using UnityEngine;

public class SpriteBillboard : MonoBehaviour {
    Camera mainCamera;

    void Start() { mainCamera = Camera.main; }

    void LateUpdate() {
        transform.rotation = Quaternion.LookRotation(
            transform.position - mainCamera.transform.position,
            Vector3.up);
    }
}
```

### EightDirectionalSprite.cs

```csharp
using UnityEngine;

public class EightDirectionalSprite : MonoBehaviour {
    [SerializeField] SpriteRenderer sr;
    [SerializeField] Sprite[] angles; // 0=front, 1=front-right, ..., 7=front-left

    Transform target;  // Player

    void Update() {
        if (!target) return;
        Vector3 toViewer = target.position - transform.position;
        toViewer.y = 0;
        float angle = Mathf.Atan2(toViewer.x, toViewer.z) * Mathf.Rad2Deg;
        angle -= transform.eulerAngles.y;
        if (angle < 0) angle += 360f;
        int index = Mathf.FloorToInt(((angle + 22.5f) % 360f) / 45f);
        sr.sprite = angles[index];
    }

    public void PlayDeathAnimation() {
        // Play death sprite sequence coroutine
    }
}
```

## Level Design

### Scene Construction

- **Blockout**: ProBuilder for corridors, rooms, stairs. (Unity has first-class ProBuilder integration.)
- **Texturing**: URP Lit shader with emission for lava / goo; tiling textures at low res for retro feel.
- **Doors**: MovingPlatform prefab with DoorController script; opens up/down when activated by player.
- **Lifts**: Same system, moves on trigger.
- **Switches**: Collider + SwitchController; triggers named events.
- **Teleport**: TeleportPad collider; on trigger enter, move player to paired destination.

### NavMesh

- Bake NavMesh in each level scene.
- NavMeshAgent on enemies; acts as pathing.
- No need for BSP; Unity's navmesh handles any 3D topology.

### Damage Floors

```csharp
public class DamageFloor : MonoBehaviour {
    [SerializeField] int damagePerTic = 20;
    [SerializeField] float tickInterval = 1f;

    void OnTriggerStay(Collider other) {
        var hp = other.GetComponent<PlayerHealth>();
        if (hp && Time.time % tickInterval < Time.deltaTime) {
            hp.TakeDamage(damagePerTic);
        }
    }
}
```

## Visual Authenticity

### Low-Resolution Rendering

- URP Render Target: render to 320×200 (or 640×400) RenderTexture.
- Display that texture scaled up with point filtering on final output.
- Use `Screen.SetResolution(320, 200, false)` + full-screen blit OR a URP custom pass.

### Palette Shader

- Custom shader: quantize output to 256-color Doom palette (PLAYPAL lump).
- Sample final color → lookup in palette texture → output.

### Sprites with Bilinear Off

- Sprite import settings: Filter Mode = Point, Compression = None.

### CRT / Scanline Effect

- URP post-process volume with custom scanline shader.
- Optional; off by default.

## Sounds

### Classic Doom sound set

- Pistol: DSPISTOL.
- Shotgun: DSSHOTGN.
- Chaingun: DSCHGUN.
- Rocket fire: DSRLAUNC.
- Plasma: DSPLASMA.
- BFG: DSBFG.
- Imp sight: DSBGSIT1.
- Imp attack: DSBGACT.
- Imp death: DSBGDTH1.
- ...

AudioSource on each enemy; spatial blend = 1 (3D).

## HUD / Status Bar

### Classic Status Bar

Replicate Doom's bottom bar:

```
[Ammo]  [Health]  [Mugshot]  [Armor]  [Keys]  [AmmoReserves]
```

Canvas UI using Images + TMP_Text. Mugshot face changes:

- Full HP: confident, looking straight.
- <75%: slight worried.
- <50%: bloody.
- <25%: severely bloody.
- On damage: looks toward damage source (based on hit direction).
- Berserk active: grinning rage face.
- Invulnerability: godmode face (different sprite set).

### Modern HUD (optional)

- Remove status bar; floating HP / ammo numbers + crosshair.

## Difficulty

### SkillLevelData.cs (ScriptableObject)

```csharp
[CreateAssetMenu(fileName = "Skill", menuName = "Doom/Skill")]
public class SkillLevelData : ScriptableObject {
    public string levelName;
    public float damageMultiplier = 1f;
    public float ammoMultiplier = 1f;
    public bool respawnMonsters = false;
    public float monsterSpeedMultiplier = 1f;
    public int monsterPlacementFlags;  // Bitmask for skill-specific placements
}
```

## Multiplayer

### Unity Netcode for GameObjects (NGO)

- Server-authoritative for modern FPS best practice.
- Client prediction for local player.
- `NetworkBehaviour` replaces `MonoBehaviour` on networked entities.
- NetworkTransform for position sync.
- RPCs for fire events.

Classic lockstep would be possible (simpler) but server-auth is modern standard.

## WAD Integration (advanced)

For source-accurate map loading from WAD files:

- Community projects: "UnityDoom" (runtime WAD parser → Unity meshes).
- Parse linedefs/sidedefs/sectors → build Unity geometry procedurally.
- Load textures/sprites/sounds from WAD lumps.
- Enables playing original Doom levels in Unity's engine.

Non-trivial. Most Unity Doom-likes don't bother — they design Unity-native levels.

## Build Targets

- WebGL: runs in browser.
- Desktop: Win/Mac/Linux.
- Android/iOS: with on-screen controls.
- VR: add XR Interaction Toolkit; free-look becomes head-tracked.

## Performance

- Unity DOOM-like runs at 200+ FPS on 2020+ hardware.
- Sprite draws are cheap (single quad per enemy).
- Enemy NavMeshAgent: budget ~50 active at once without optimization.
- For Doom's dense encounters (100+ enemies): object pool + disabled-when-offscreen.

## Testing

- Play mode: spawn player in test scene; shoot dummy enemy; verify damage.
- Edit mode: verify ScriptableObject tuning loads correctly.

## Total Complexity

- Core scripts: ~2000-3000 lines of C#.
- Plus ScriptableObject data assets, prefabs, sprites.
- A competent solo dev: ~2-3 months of part-time work for a complete episode.

## Examples / References

- **Doom 3 BFG Edition source** (actual id Tech 4 code) — for proper reference.
- **Unity Retro FPS Jam** entries — dozens of Doom-inspired Unity projects.
- **GZDoom + Unity hybrids** — experimental; rare.
- **Quake-Unity** reconstructions — similar-era 3D FPS, also retro-styled.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Combat Design](../../references/combat-design.md)
- [Map Design](../../references/map-design.md)
- [3Cs Spec](../../references/3c-spec.md)
- [Netcode](../../references/netcode.md)
