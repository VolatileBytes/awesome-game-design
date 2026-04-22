---
id: helldivers-2
title: Helldivers 2 — Unreal Implementation
version: 0.1.0
description: Unreal Engine 5 overlay for Helldivers 2 reimplementation — third-person shooter with host-authoritative co-op, stratagem system, and persistent war.
tags: [unreal, unreal-engine-5, third-person, co-op, pve]
---

# Helldivers 2 — Unreal Implementation

Engine overlay for Helldivers 2. See [base GDD](../../GDD.md).

> The shipping game uses **Autodesk Stingray** (since-defunct). This doc describes a hypothetical **Unreal Engine 5** port: UE5 is the closest practical modern target for a third-person shooter with 200+ enemy AIs, large open biomes, and networked co-op.

## Target

- **Unreal Engine 5** (5.3+).
- **Lyra-style starter** for networking + ABP skeleton.
- **Networking**: UE's Replication Graph + custom P2P host-auth, Steam/Epic Online Services for party/matchmaking.
- **Platforms**: Windows PC primary; PS5 secondary; Xbox parity.
- **Target fps**: 60 console, 120+ PC; 30fps floor on PS5 Quality mode.

## Plugins

| Plugin | Purpose |
|---|---|
| Lyra starter patterns | ABP, input, inventory skeletons |
| Gameplay Ability System (GAS) | Weapons, abilities, stratagems as GameplayAbilities |
| Enhanced Input | Remappable + contextual input |
| Niagara | VFX (explosions, blood, fire, laser) |
| Mass Entity | High-density enemy AI |
| World Partition | Open biome streaming |
| Chaos Destruction | Destructible bug nests, fortifications |
| Replication Graph | Large-session replication |
| Online Subsystem (Steam/EOS) | Party + matchmaking |
| Wwise or MetaSounds | Spatial audio + stratagem stingers |

## Core Architecture

### Session + World

```cpp
UCLASS()
class AHelldiverGameMode : public AGameMode {
    UPROPERTY() UMissionInstance* Mission;
    UPROPERTY() UGalacticWarClient* GalacticWarClient;
    UPROPERTY() UStratagemRegistry* Stratagems;

    virtual void BeginPlay() override {
        InitMission();
        SpawnPlayers();
        InitAISubsystem();
        StartMissionTimer();
    }
};

UCLASS()
class UMissionInstance : public UObject {
    UPROPERTY() FMissionDef Def;
    UPROPERTY() FName PlanetId;
    UPROPERTY() int32 Difficulty;
    UPROPERTY() float TimeRemainingSec;
    UPROPERTY() TArray<UObjective*> Objectives;
    UPROPERTY() FRandomStream Seed;
};
```

### Host-Authoritative Simulation

- Host is the `ENetRole::ROLE_Authority`.
- All damage, enemy AI, stratagem effects, objective state = `AActor::bReplicates = true` with `SetReplicates(true)`.
- Clients run UE's rep framework; prediction only for local player movement.

### Helldiver Pawn

```cpp
UCLASS()
class AHelldiver : public ACharacter {
    UPROPERTY() USkeletalMeshComponent* ArmorMesh;
    UPROPERTY() UCameraComponent* ThirdPersonCamera;
    UPROPERTY() USpringArmComponent* CameraBoom;

    UPROPERTY(Replicated) float HealthCurrent, HealthMax = 150;
    UPROPERTY(Replicated) float StaminaCurrent, StaminaMax = 100;
    UPROPERTY(Replicated) FLoadout CurrentLoadout;
    UPROPERTY() UHelldiverAbilitySystem* AbilitySystem;

    UFUNCTION(Server, Reliable) void ServerFirePrimary(FFireInput Input);
    UFUNCTION(Server, Reliable) void ServerThrowStratagem(FVector Destination, EStratagemId Id);
    UFUNCTION(Server, Reliable) void ServerStimInject();
    UFUNCTION(Server, Reliable) void ServerStratagemCode(EStratagemDirection Direction);
};
```

## Stratagem System

### Code Input

```cpp
UCLASS()
class UStratagemInputController : public UActorComponent {
    UPROPERTY() TArray<EDirection> CurrentCode;
    UPROPERTY() bool bMenuOpen;

    void OnMenuOpen() { CurrentCode.Empty(); bMenuOpen = true; }
    void OnDirection(EDirection Dir) {
        CurrentCode.Add(Dir);
        if (FStratagemDef* Match = FindMatch(CurrentCode)) {
            if (Match->InputCode.Num() == CurrentCode.Num()) {
                ArmStratagem(Match);
            }
        } else if (NoPartialMatch(CurrentCode)) {
            ResetCode();
        }
    }
};
```

### Stratagem Definition

```cpp
USTRUCT()
struct FStratagemDef {
    UPROPERTY() FName Id;
    UPROPERTY() FText DisplayName;
    UPROPERTY() EStratagemCategory Category;
    UPROPERTY() TArray<EDirection> InputCode;
    UPROPERTY() float CooldownSec;
    UPROPERTY() float CallInTimeSec;
    UPROPERTY() int32 UsesPerMission;  // -1 = infinite
    UPROPERTY() TSubclassOf<UStratagemEffect> EffectClass;
    UPROPERTY() FName IconAssetId;
};
```

### Stratagem Effects

```cpp
UCLASS(Abstract)
class UStratagemEffect : public UObject {
public:
    virtual void Execute(AHelldiver* Caller, FVector BeaconLocation) PURE_VIRTUAL;
};

UCLASS() class UEagleAirstrikeEffect : public UStratagemEffect {
    virtual void Execute(AHelldiver* Caller, FVector BeaconLocation) override {
        auto* Eagle = SpawnEagle();
        Eagle->SetTargetRun(BeaconLocation);
    }
};

UCLASS() class USupportWeaponDropEffect : public UStratagemEffect {
    UPROPERTY() TSubclassOf<AWeaponPickup> WeaponClass;
    virtual void Execute(AHelldiver* Caller, FVector BeaconLocation) override {
        SpawnHellpod(BeaconLocation, WeaponClass);
    }
};

UCLASS() class UOrbitalStrikeEffect : public UStratagemEffect {
    virtual void Execute(AHelldiver* Caller, FVector BeaconLocation) override {
        SpawnOrbitalProjectile(BeaconLocation, DelaySec);
    }
};
```

## Enemy AI — Mass Entity

High-density hordes use **Mass Entity** (not `AActor` per enemy):

```cpp
USTRUCT()
struct FTerminidFragment {
    FVector Position;
    FVector Velocity;
    float HpCurrent;
    ETerminidType Type;
    int32 TargetEntityId;
};

UCLASS()
class UTerminidMovementProcessor : public UMassProcessor {
    virtual void Execute(FMassEntityManager&, FMassExecutionContext&) override {
        ForEachEntity([&](FMassEntityHandle Entity, FTerminidFragment& Bug) {
            SteerTowardsTarget(Bug);
            ApplyMovement(Bug);
        });
    }
};
```

Boss-class enemies (Bile Titan, Factory Strider, Hulk) stay as individual `AActor` for fidelity.

## Damage System (GAS)

```cpp
UCLASS()
class UDamageAbility : public UGameplayAbility {
    UPROPERTY() float Damage;
    UPROPERTY() int32 PenetrationRating;

    void ComputeHit(AActor* Target, FHitResult Hit) {
        auto ArmorClass = GetArmorClass(Target, Hit.BoneName);
        if (PenetrationRating < ArmorClass) return;  // bounce
        float Multiplier = GetWeakSpotMultiplier(Target, Hit.BoneName);
        float FinalDamage = Damage * Multiplier;
        ApplyDamage(Target, FinalDamage);
    }
};
```

## Hellpod / Reinforcement

```cpp
UCLASS()
class AHellpod : public AActor {
    UPROPERTY() AHelldiver* Occupant;
    UPROPERTY() FVector TargetLocation;
    UPROPERTY() float DescentSpeed;

    void Tick(float DT) override {
        Descent();
        if (AtDestination()) {
            ApplyLandingImpact();    // kill enemies in radius
            Occupant->PossessAfterLanding();
        }
    }
};
```

## Eagle / Orbital Projectiles

Scripted actors with physics + Niagara trails:
```cpp
UCLASS()
class AEagleAircraft : public AActor {
    UPROPERTY() FVector TargetStrikeLocation;
    UPROPERTY() TSubclassOf<AStrikeProjectile> ProjectileClass;

    void FlyIn() { /* spline path */ }
    void DropProjectiles() { /* spawn + broadcast */ }
    void FlyOut();
};
```

## UI

**UMG + Common UI** framework:

```
Widgets/
  HUD/
    CrosshairWidget
    StaminaWidget
    StratagemTrayWidget
    StratagemInputOverlay  // shows key-by-key code progress
    TeamRoster  // 3x teammate HP + stratagem cooldowns
    Minimap
    ObjectiveTracker
    ReinforcementsRemaining
  Ship/
    GalaxyMap
    MissionBriefing
    Armory
    StratagemUnlockStore
    WarbondsScreen
    SuperstoreScreen
```

## Galactic War Client

```cpp
UCLASS()
class UGalacticWarClient : public UGameInstanceSubsystem {
    UFUNCTION() void FetchState();       // GET /galactic-war
    UFUNCTION() void SubmitMissionResult(FMissionResult Result);
    UFUNCTION() void FetchMajorOrder();
    UPROPERTY() FGalacticWarState CachedState;
};

USTRUCT()
struct FGalacticWarState {
    UPROPERTY() TMap<FName, FPlanetStatus> Planets;
    UPROPERTY() FMajorOrder CurrentOrder;
    UPROPERTY() int64 StateVersion;
};
```

## Audio

Wwise or MetaSounds layered:
- Weapon fire events: shot + mechanics + tail + report echo.
- Stratagem call-in stingers.
- Enemy bark triggers (Stalker roar, Bile Titan stomp).
- Propaganda radio during lulls.
- Music reactive to enemy density.

## Netcode Layers

```
UE Replication Graph (spatial + relevance filter)
  ↓
Actor replication (Player, Enemy boss, Stratagem)
  ↓
Mass Entity replicated via custom replicator (only local bubble)
  ↓
Reliable RPC for stratagems, deaths, extract
Unreliable multicast for damage FX, sounds
```

## Persistence

- **Local save**: last loadout, warbond progress.
- **Backend**: player level, medals, super credits, warbond unlocks, ship upgrades.
- **Session** state (mission): host-authoritative, lost on session end (only results persist).

## Performance

- 60fps on PS5 at difficulty 7.
- Helldive (9) at 60fps requires upper-tier PC (RTX 3070+).
- World Partition streams biome tiles — max ~2-3km playable.
- Mass Entity keeps 200+ bugs at <1ms/frame.

## Accessibility

- Input remap per-action.
- Accessibility preset with auto-stim, aim assist, larger HUD.
- Subtitles with speaker ID.
- Colorblind modes (UE plugin + custom shaders for hit-indicators).

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Combat Design](../../references/combat-design.md)
- [Stratagem Design](../../references/stratagem-design.md)
- [Netcode](../../references/netcode.md)
