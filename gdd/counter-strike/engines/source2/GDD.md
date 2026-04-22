---
id: counter-strike
title: Counter-Strike — Source 2 Implementation
version: 0.1.0
description: Source 2 engine overlay for Counter-Strike — server-authoritative subtick netcode, volumetric smokes, VSCRIPT maps.
tags: [source2, fps, multiplayer, server-authoritative]
---

# Counter-Strike — Source 2 Implementation

Engine overlay for Counter-Strike. See [base GDD](../../GDD.md).

> Valve's own engine. Reimplementing on a non-Valve engine would require rebuilding the networking model, the entity system, and BSP-style map compilation from scratch. This document describes the **Source 2 architecture as shipped**, for reference.

## Target

- **Engine**: Source 2 (2023+ branch, as shipped with CS2).
- **Render**: custom Vulkan/DirectX 12 renderer; Panorama UI for HUD.
- **Netcode**: UDP, custom subtick protocol.
- **Platforms**: Windows, Linux, macOS (client); Linux-only dedicated server.
- **Target fps**: 240+ on competitive rigs; floor at 144.

## Engine Systems Used

| System | Purpose |
|---|---|
| Source 2 Renderer | Vulkan/DX12 forward+ |
| Source 2 Physics | Rubikon (rigid body, projectile) |
| Source 2 Audio | Steam Audio HRTF + mixers |
| Source 2 Networking | Deterministic client-prediction + subtick |
| VConsole | Live dev console |
| Hammer 2 | Map editor (BSP + mesh hybrid) |
| Panorama | HTML-like UI framework |
| VScript | Lua scripting for map logic |

## Core Architecture

### Server Authoritative Sim

Authoritative state lives on the dedicated server. Client prediction + reconciliation for own movement; no prediction for other players' actions.

```cpp
class CSGameSim {
    TickIndex currentTick;
    double tickTimeMs = 15.625;  // 64 tick
    PlayerArray<10> players;
    Entities entities;
    MatchState matchState;
    EconomyState economy;
    Map* map;
    NetChannel* channels[10];

    void StepTick() {
        ReceiveInputs();          // subtick-stamped
        ApplyInputs();            // deterministic physics
        SimulateProjectiles();
        ResolveHits();            // with lag-comp rewind
        UpdateRoundLogic();       // plant/defuse/timer
        BroadcastSnapshot();
    }
};
```

### Subtick Input Stamping

```cpp
struct SubtickInput {
    TickIndex tick;
    float subtickFraction;   // 0.0-1.0 of tick duration
    Vec2 moveDir;
    Vec2 aimDelta;
    uint32_t buttons;
};

class SubtickResolver {
    HitResult ResolveShot(PlayerId shooter, SubtickInput input) {
        double precise_time = GetTickStartTime(input.tick) 
                            + input.subtickFraction * tickTimeMs;
        auto world = worldHistory.GetStateAt(precise_time - shooter.latency);
        return RayTrace(world, shooter.viewRay);
    }
};
```

### Lag Compensation

```cpp
class LagCompensation {
    CircularBuffer<WorldState, 64> history;  // last ~1 second

    HitResult RewindAndTrace(PlayerId shooter, Ray ray, double clientViewTime) {
        WorldState rewind = history.InterpolateAt(clientViewTime);
        for (auto& p : rewind.players) {
            if (p.id == shooter) continue;
            if (ray.IntersectsHitbox(p.hitboxes)) {
                return { p.id, p.hitGroup, ComputeDamage(...) };
            }
        }
        return NoHit;
    }
};
```

## Map System

### Hammer 2 Maps

Maps are a hybrid of:
- **BSP solids** (carved brushes, legacy Source 1 compatible).
- **Mesh entities** (detail props, modular kits).
- **Nav mesh** (AI pathfinding; bots use it).
- **Visibility portals** (PVS occlusion for rendering perf).
- **VScript hooks** (round start, bomb plant events).

Compiled to:
- `.vpk` asset bundle.
- `.vmap_c` compiled binary.
- Nav mesh + visibility data baked.

### Map Metadata

Each map declares:
```
MapInfo {
    string name;
    string author;
    MapType type;            // bomb_defuse | hostage | wingman
    BombSite[] bombSites;    // A + B
    SpawnSet tSpawns;
    SpawnSet ctSpawns;
    BuyZone[] buyZones;
    RadarConfig radar;       // 2D top-down callouts
    GrenadePhysicsGeometry physGeom;
}
```

## Weapon System

```cpp
class Weapon {
    WeaponDef def;
    int currentAmmo;
    int reserveAmmo;
    float heat;              // for full-auto heat curves
    float sprayIndex;        // 0..magazine for recoil pattern
    bool scoped;

    void Fire(Player* shooter, SubtickInput input) {
        if (cannotFire()) return;
        sprayIndex++;
        Vec2 recoil = def.recoilPattern[sprayIndex % def.patternLength];
        Ray shot = ComputeShot(shooter, recoil, def.accuracy(shooter.state));
        auto hit = lagComp.RewindAndTrace(shooter.id, shot, input.subtickTime);
        if (hit.valid) ApplyDamage(hit.target, ComputeDamage(def, hit));
        BroadcastShotEvent(shooter, shot, hit);
    }
};

struct WeaponDef {  // data-driven; .txt / .vdata
    int baseDamage;
    float armorPenetration;
    int cycleTimeMs;
    int magazine;
    int reserveMax;
    float reloadTimeSec;
    float switchTimeSec;
    AccuracyCurve accuracyStand, accuracyCrouch, accuracyMove, accuracyJump;
    Vec2[] recoilPattern;
    float recoilRecoveryPerSec;
    int penetrationPower;
    int price;
    int killReward;
    string viewModel;
    string worldModel;
    string fireSoundEvent;
    string reloadAnim;
};
```

## Grenade System

Each grenade is a projectile entity:

```cpp
class Grenade : PhysicsEntity {
    GrenadeDef def;
    float fuseRemaining;

    void Tick() {
        physics.Step();          // Rubikon physics
        fuseRemaining -= dt;
        if (fuseRemaining <= 0) Detonate();
    }

    virtual void Detonate() = 0;
};

class SmokeGrenade : Grenade {
    VolumetricSmoke smoke;
    void Detonate() override {
        smoke.Expand(position, duration: 18s);
        RegisterSmokeVolume(smoke);  // bullet/sight intersection
    }
};

class Flashbang : Grenade {
    void Detonate() override {
        for (auto& p : GetPlayersInLOS(position, angle: 180°)) {
            p.ApplyFlash(ComputeFlashDuration(p, position));
        }
    }
};
```

Volumetric smoke (CS2 new):
- Raymarched volumetric grid; bullets can cut holes.
- Interacts with HE grenades (explosion clears).

## Economy System

```cpp
class EconomyManager {
    void OnRoundEnd(RoundResult result) {
        for (auto& p : players) {
            p.money += CalculateRoundReward(p, result);
            p.money = min(p.money, 16000);
        }
    }

    int CalculateRoundReward(Player& p, RoundResult r) {
        if (p.team == r.winner) return 3250;
        int loss = r.consecutiveLosses[p.team];
        return min(1400 + 500 * loss, 3400);
    }
};
```

## Round Logic (VScript + C++ hybrid)

Round state machine:
```
enum RoundState {
    Warmup, FreezeTime, Active, BombPlanted, RoundEnd, HalfTime, Overtime
}
```

Events fire to VScript:
- `OnRoundStart(round: int)`
- `OnBombPlanted(site: 'A'|'B', player: PlayerId)`
- `OnBombDefused(player: PlayerId)`
- `OnPlayerDeath(victim, killer, weapon, headshot: bool)`

Maps can hook events to trigger map-specific behaviors (elevator, moving train, etc.).

## Audio

Steam Audio provides:
- **HRTF**: 3D audio, direction-accurate.
- **Occlusion**: walls dampen; sound "bends" through doors (approximated).
- **Reverb zones**: per-map reverb tags.

Each weapon has a **sound event** (fire + reload + tail):
```
WeaponSoundEvent {
    string fireEventName;    // "weapon_ak47.Single"
    float maxRange;          // 20m typically
    AttenuationCurve falloff;
    LayerSet layers;         // report + mechanics + tail
}
```

## Panorama UI

HUD + menus in **Panorama** (Valve's HTML/CSS/JS-like framework):
- Buy menu, scoreboard, kill-feed, minimap, HUD.
- Customizable via workshop.
- Sandboxed; can't read sensitive memory.

```xml
<root>
  <Label id="Money" text="{{ localPlayer.money | currency }}"/>
  <KillFeed id="KillFeed" items="{{ events.kills }}"/>
  <Minimap id="Minimap" map="{{ mapName }}"/>
</root>
```

## Networking Layers

```
Layer                  | Role
-----------------------+-------
UDP Socket             | Transport
ReliableChannel        | Reliable commands (chat, events)
UnreliableChannel      | Snapshots
Compression (LZ4)      | Snapshot delta compression
Subtick Input Buffer   | Client → server input stream
Lag Comp History       | Server rewind buffer
Client Prediction      | Local movement prediction
Interpolation Buffer   | Remote player smoothing
```

## Anti-Cheat

- **VAC agent**: process scanning, signature match.
- **VAC Live**: server-side demo review.
- **Trust Factor**: server-side score.
- **Server sanity checks**: input rate limits, impossible movement detection.
- **Hit validation**: server re-traces shot; client can't forge.

## Demo System

Every match records to `.dem`:
- All snapshots (~128 KB/s compressed).
- All inputs.
- All voice audio (optional).

Replay: rewind, slow-mo, free-cam, bookmark.

## File Layout (high-level)

```
game/csgo/
  scripts/               # weapon defs, map configs (.vdata)
  maps/                  # .vmap_c compiled maps
  materials/             # textures, shaders
  models/                # player/weapon/prop meshes
  sound/                 # sound events + banks
  panorama/              # UI
  resource/              # strings, fonts
  cfg/                   # server/client configs
```

## Performance

- 240+ fps on 2023-era mid-tier hardware.
- Server CPU budget per tick: 15.6ms / 10 players = ~1.5ms per player.
- Smoke volumetrics = largest new GPU cost (CS2).

## Reimplementing on Unity/Unreal (thought experiment)

### Hardest parts to reproduce
1. **Subtick** — requires deep engine-level input stamping, not supported by stock Unity/Unreal.
2. **Lag compensation** — buffer history + rewind; doable but complex.
3. **Hammer maps** — no equivalent; would need bespoke map tool.
4. **Volumetric smokes with bullet-interaction** — custom volume renderer + physics.
5. **HRTF audio fidelity** — Steam Audio plugin helps.

### What ports cleanly
- Weapon data (JSON → SO/DataAsset).
- Economy / round state (plain C# or C++).
- VScript hooks (map-level scripting).
- HUD (Panorama ↔ UGUI/UMG).

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Netcode](../../references/netcode.md)
- [Combat Design](../../references/combat-design.md)
