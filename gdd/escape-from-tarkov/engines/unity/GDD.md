---
id: escape-from-tarkov
title: Escape from Tarkov — Unity Implementation
version: 0.1.0
description: Unity engine overlay for Escape from Tarkov — hardcore extraction shooter with ballistic sim, 7-zone health, and persistent session-server architecture.
tags: [unity, fps, extraction-shooter, hardcore, persistent-economy]
---

# Escape from Tarkov — Unity Implementation

Engine overlay for Escape from Tarkov. See [base GDD](../../GDD.md).

> Shipping game is built on **Unity 2018/2019** with heavy custom modifications. This document reflects the as-shipped engine stack and architecture, not a hypothetical port.

## Target

- **Unity**: 2018.x → 2019.x → 2022.x (BSG upgrades slowly; legacy systems cling).
- **Render**: Forward renderer with heavy shader customization; deferred for some maps.
- **Networking**: Hybrid — session servers for raids; backend services for stash/traders.
- **Platforms**: Windows PC only.
- **Target fps**: 60 native target; hardware-heavy (CPU-bound on high-player maps).

## Core Architecture

### Two-World Separation

1. **Meta world**: launcher + stash + traders + hideout. Single-player local session backed by backend.
2. **Raid world**: session-server with 8-14 players, AI, maps.

Exit a raid → session ends; results persist to backend → meta world updates.

### Hybrid Netcode

- **Raid** = dedicated session server per-raid.
- Server authoritative for: position, HP, hit registration, loot, AI.
- Client predicts: own movement, weapon animation, inventory (local cache).
- **Meta** = HTTP calls to backend REST services.

## Core Systems

### Player Character

```csharp
public class PlayerPMC : NetworkedEntity {
    public HealthController Health;         // 7-zone HP
    public InventoryController Inventory;   // tetris grid
    public WeaponController Weapons;
    public MovementController Movement;
    public StaminaController Stamina;
    public SkillController Skills;
    public StatusEffectController StatusFx;  // bleed, fracture, pain, tremor
    public AudioEmitter AudioEmitter;
    public CameraController Camera;
}
```

### Health (7-Zone)

```csharp
public class HealthController {
    public Dictionary<BodyZone, BodyZoneHealth> Zones;

    public void ApplyDamage(DamageInfo info) {
        var zone = Zones[info.TargetZone];
        zone.CurrentHp -= info.DamageAfterArmor;
        if (zone.CurrentHp <= 0) OnZoneBlackedOut(zone);
        if (info.CausesBleed) ApplyBleed(zone, info.BleedType);
        if (info.CausesFracture) ApplyFracture(zone);
        CheckDeath();
    }

    public void CheckDeath() {
        if (Zones[BodyZone.Head].CurrentHp <= 0) Die(DeathCause.Headshot);
        else if (Zones[BodyZone.Thorax].CurrentHp <= 0) Die(DeathCause.ThoraxFatal);
    }
}

public enum BodyZone { Head, Thorax, Stomach, LeftArm, RightArm, LeftLeg, RightLeg }
```

### Ballistics

```csharp
public class BulletProjectile : Projectile {
    public AmmoDef Ammo;  // caliber, damage, pen, frag, velocity
    public Vector3 Velocity;
    public float LifetimeSec;
    
    public void Step(float dt) {
        Velocity.y -= GRAVITY * dt;        // drop
        var rayStart = transform.position;
        var rayEnd = rayStart + Velocity * dt;
        
        if (Physics.Raycast(rayStart, Velocity.normalized, out var hit, Velocity.magnitude * dt)) {
            HandleHit(hit);
        } else {
            transform.position = rayEnd;
        }
        
        LifetimeSec -= dt;
        if (LifetimeSec <= 0) Destroy();
    }

    void HandleHit(RaycastHit hit) {
        var armor = ResolveArmorForHit(hit);
        var penResult = RollPenetration(Ammo.PenPower, armor);
        if (penResult.Penetrated) {
            var zone = HitboxResolver.GetBodyZone(hit.collider);
            var damage = ComputeDamage(Ammo, penResult, zone);
            hit.collider.GetComponentInParent<PlayerPMC>()?.Health.ApplyDamage(new DamageInfo(...));
            if (Ammo.FragChance > RngRoll()) SpawnFragments(hit.point);
        } else if (penResult.Ricochet) SpawnRicochet();
    }
}
```

### Armor

```csharp
public class ArmorItem : Item {
    public int ArmorClass;               // 1-6
    public int DurabilityCurrent;
    public int DurabilityMax;
    public float BluntThroughput;        // % damage through even when blocked
    public ArmorMaterial Material;       // Aramid, UHMWPE, Steel, Ceramic, Titanium
    public BodyZone[] ZonesCovered;
}

public static class PenetrationSolver {
    public static PenResult Roll(int penPower, int armorClass, int durabilityPct) {
        float chance = ComputeChance(penPower, armorClass, durabilityPct);
        return new PenResult {
            Penetrated = chance > RngRoll(),
            DamageReduction = ComputeReduction(penPower, armorClass),
            ArmorDamage = ComputeArmorDamage(...),
        };
    }
}
```

### Inventory (Tetris)

```csharp
public class InventoryController {
    public PaperDollSlots EquipmentSlots;
    public GridContainer SecureContainer;     // 2x2 / 3x3 / 3x5
    public List<GridContainer> ChestRigs, Backpacks;

    public bool TryPlace(Item item, GridContainer container, Vector2Int origin) {
        if (!container.FitsAt(item.GridSize, origin)) return false;
        container.PlaceItem(item, origin);
        OnInventoryChanged();
        return true;
    }
}

public class GridContainer {
    public int Width, Height;
    public Item[,] Cells;
    public bool FitsAt(Vector2Int size, Vector2Int origin) { ... }
}
```

### Audio

Custom audio solution built on Unity's audio API + bespoke DSP:
- **Occlusion**: geometry raycasts between emitter and listener.
- **Diffraction**: audio "bends" around corners via multi-ray approximation.
- **HRTF** optional (BSG's implementation; post-patch added steam-audio inspired pass).
- **Distance attenuation curves** per-emitter-type (footsteps vs weapon vs voice).
- **Headphone item** filters listener audio (amplify + clip).

### AI

```csharp
public abstract class AIBase : NetworkedEntity {
    public AIState State;  // Patrol, Alert, Engage, Flee, Down
    public NavMeshAgent Nav;
    public AIWeaponController Weapons;
    public AISensor Sensor;  // sight cone + hearing
}

public class AIScav : AIBase { ... }
public class AIRaider : AIBase { ... }
public class AIBoss : AIBase { ... }
```

Sensor tick: 10Hz; checks hearing (heard shots, footsteps) + line-of-sight.

## Networking

### Session Server

Per-raid instance:
```csharp
public class RaidSession {
    public string SessionId;
    public MapDefinition Map;
    public List<PlayerPMC> Players;
    public List<AIBase> AIEntities;
    public LootSystem Loot;
    public float RaidTimeRemainingSec;
    public ServerTick Tick;

    public void StepTick() {
        UpdateAI();
        UpdatePlayers();
        UpdateProjectiles();
        UpdateLootRespawn();
        BroadcastSnapshot();
    }
}
```

### Client Prediction

Local player movement runs client-side; reconciled on snapshot mismatch.

Weapon firing: client fires animation immediately; server-authoritative on hit registration.

### Hit Reg Controversies

Tarkov hit reg has historical issues due to:
- High hit-zone fidelity (7 zones + armor segments).
- Bullet physics projectile simulation (not hitscan).
- Client-server latency + lag comp windows.

BSG has iterated; still perceived as worse than major FPS.

## Meta Systems

### Stash / Inventory Service

Backend persistent storage for:
- Stash contents (player's out-of-raid inventory).
- Hideout state (module levels, crafting queues).
- Skills + XP + quest progress.
- Trader levels + reputation.
- Account settings.

Backend sync: raid-end commit is atomic (gear on body → Flea-restitution-window, etc.).

### Hideout

Tick on real-time clock:
- Bitcoin Farm accumulates BTC per hour.
- Crafting queue finishes on schedule.
- Passive drip (water, electricity) consumes reagents.

Implemented as authoritative backend state; client fetches on Hideout open.

### Flea Market

- Centralized marketplace service.
- Players post offers; others browse + purchase.
- Rouble escrow + fees.
- Anti-fraud: RMT detection via telemetry.

### Traders

Per-trader data:
- Stock restocks (3-hour cadence).
- Barter trades (item requirements).
- Insurance: schedule return jobs.
- Quest givers: scripted quest objects.

## File & Data Layout

```
Assets/
  _Project/
    Characters/
    Weapons/
    Ammo/
    Armor/
    Medical/
    Quests/
    Hideout/
    Maps/
      Customs/
      Factory/
      ...
    Audio/
    UI/
    Scripts/
      Client/
      Server/
      Shared/
      Backend/
```

Data-driven with bespoke **JSON + ScriptableObject hybrid** for weapon/ammo/armor defs. Heavy use of custom editor tooling.

## Anti-Cheat

- **BattlEye** (kernel-level AC): continuous since launch.
- **Server-side validation**: impossible movement, impossible shots, impossible loot pickup.
- **BSG anti-cheat team**: aggressive account bans; public weekly ban lists.
- **VAC-like infrastructure**: BSG maintains hashset of banned-hardware.

## Known Tech Debt

- Legacy Unity 2018 inheritance: painful upgrade path.
- Custom audio system predates Unity's improvements; partially rewritten.
- Network code largely bespoke; not Unity NGO / Mirror.
- Inventory UI has been rewritten multiple times.
- Singleton managers from early development linger.

## Performance

- **CPU**: heavy — AI tick + audio DSP + physics for many projectiles.
- **GPU**: moderate; bottleneck rare.
- **RAM**: 16 GB recommended; 32 GB for Streets.

- 60fps on mid-tier CPU is achievable on most maps except Streets + Labs.
- Streets has been optimized multiple patches; still CPU-bound.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Combat Design](../../references/combat-design.md)
- [Economy Design](../../references/economy-design.md)
