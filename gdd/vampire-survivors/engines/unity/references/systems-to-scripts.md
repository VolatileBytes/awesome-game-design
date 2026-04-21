# Systems → Scripts Map

This document maps every system in the base GDD to a concrete Unity C# class or ScriptableObject. Use it as the skeleton for the `Scripts/` folder.

## Top-Level

| Class | Kind | Responsibility |
|---|---|---|
| `GameBootstrap` | MonoBehaviour | Loads Addressables catalogue, reads save file, transitions to menu |
| `MenuController` | MonoBehaviour | Main menu, character select, stage select, shop |
| `RunState` | MonoBehaviour | Root of the run. Held in Game scene. Static `RunState.I` accessor. |
| `GameLoop` | MonoBehaviour | Owns `Update()` order via explicit method calls; avoids cross-MB race conditions |
| `ServiceLocator` | static class | Holds references to systems (SpatialHash, DamagePool, etc.) |

## Player

| Class | Kind | Responsibility |
|---|---|---|
| `PlayerController` | MonoBehaviour | Owns movement, HP, i-frames, death |
| `PlayerStats` | MonoBehaviour | Aggregated stat block, recomputed when passives/arcana change |
| `PlayerAnimator` | MonoBehaviour | Sprite direction flip, walk cycle |
| `InputReader` | ScriptableObject | Exposes `Move`, `Pause` events; decouples input from consumers |

## Weapons

| Class | Kind | Responsibility |
|---|---|---|
| `WeaponDefinition` | ScriptableObject | Per-level stat table, evolution partner ref, projectile prefab ref, fire pattern enum |
| `WeaponRuntime` | class (non-MB) | Runtime instance — current level, current cooldown, points back to def |
| `WeaponSystem` | MonoBehaviour | Ticks cooldowns across all equipped `WeaponRuntime`, calls pattern strategies |
| `IFirePattern` | interface | `Fire(RunState state, WeaponRuntime wep)` — one impl per archetype |
| `FirePattern_ForwardArc` | class | Whip-style |
| `FirePattern_Homing` | class | Wand-style |
| `FirePattern_Orbit` | class | Bible-style — spawns + maintains orbiting children |
| `FirePattern_Aura` | class | Garlic-style — persistent area |
| `FirePattern_Area` | class | Santa Water-style — drops zones |
| `FirePattern_Ring` | class | Lightning Ring-style — random strikes |

The fire pattern is an **enum on the definition** that maps to a pattern implementation — not a subclass of `WeaponDefinition`. This keeps the SO authorable in the Editor without polymorphic SO authoring pain.

## Projectiles

| Class | Kind | Responsibility |
|---|---|---|
| `ProjectilePool` | MonoBehaviour | Pre-spawns N projectiles per definition, recycles |
| `ProjectileBehaviour` | MonoBehaviour | Lifetime, movement, pierce count, on-hit callback |
| `AuraBehaviour` | MonoBehaviour | Persistent area around owner, ticks damage |
| `HomingProjectile` | MonoBehaviour | Targets nearest enemy using `SpatialHash` |
| `OrbitProjectile` | MonoBehaviour | Child of owner, rotates around anchor |

All projectiles reuse a pooled `Transform` — no `Instantiate`/`Destroy` during a run.

## Enemies

| Class | Kind | Responsibility |
|---|---|---|
| `EnemyDefinition` | ScriptableObject | HP, speed, damage, gem tier, prefab, behaviour tag |
| `EnemyPool` | MonoBehaviour | Per-def pools, grows with cap |
| `EnemyBrain` | MonoBehaviour | Cached direction to player, updated at low frequency; moves transform |
| `EnemySpawner` | MonoBehaviour | Reads `StageDefinition.waves` keyed by `RunState.time`; emits spawn events |
| `EnemySpawnPattern` | static / enum | Radial ring, stream, arc, elite-escort, boss, shaped |
| `SpatialHash` | class | 2D grid hash of enemy positions; used by projectile targeting and gem magnet |

**Enemy behaviour is deliberately dumb.** A Brain that does `transform.position += (player.position - self.position).normalized * speed * dt` is enough for 95% of enemies. Specialised behaviour (teleporter, sniper) extends `EnemyBrain`.

## Damage & Collision

| Class | Kind | Responsibility |
|---|---|---|
| `DamageSystem` | MonoBehaviour | Batches contact queries; uses SpatialHash for hit resolution |
| `IDamageable` | interface | `TakeDamage(float amount, DamageType type, Vector2 source)` |
| `DamageType` | enum | Physical, Fire, Holy, Arcane, Poison (extensible) |
| `KnockbackSystem` | MonoBehaviour | Applies a short impulse to transforms; no physics |

**No Rigidbody2D on enemies or projectiles.** `Physics2D` is used only via `OverlapCircleNonAlloc` inside `DamageSystem`, and only if `SpatialHash` is not sufficient.

## Pickups

| Class | Kind | Responsibility |
|---|---|---|
| `GemPickup` | MonoBehaviour | Tier, value, magnet target transform |
| `GoldPickup` | MonoBehaviour | Value |
| `HealPickup` | MonoBehaviour | Small HP restore |
| `ChestPickup` | MonoBehaviour | Opens drafting UI with 1–5 level-ups |
| `MagnetSystem` | MonoBehaviour | Each frame: within `Magnet` radius → lerp gems to player; on collide → grant XP |

## Progression / Draft

| Class | Kind | Responsibility |
|---|---|---|
| `XPController` | MonoBehaviour | Tracks XP, computes next threshold, emits `OnLevelUp` |
| `LevelUpDraftController` | MonoBehaviour | Pauses game, picks 3 cards from weighted pool, waits for input |
| `DraftPool` | class | Logic for weighting (starter bias, evolution-hinting, banish/reroll state) |
| `EvolutionChecker` | static class | Given `RunState`, returns pending evolutions (weapon@8 + passive@1+) |
| `ArcanaPicker` | MonoBehaviour | Handles arcana pickup interaction and selection UI |

## Arcana

| Class | Kind | Responsibility |
|---|---|---|
| `ArcanaDefinition` | ScriptableObject | Effect script reference, icon, flavour text |
| `IArcanaEffect` | interface | Subscribes to RunState events and mutates behaviour |
| `ArcanaEffect_FireBuilds` / `ArcanaEffect_Gemini` / etc. | classes | One per arcana, self-registering |

Arcana effects **hook into events**, not a central resolver. Keeps each effect self-contained and deletable.

## Economy

| Class | Kind | Responsibility |
|---|---|---|
| `GoldWallet` | MonoBehaviour | In-run + meta balances; persists meta to save |
| `ShopController` | MonoBehaviour | Tier purchase, cost curve, applies bonuses to `PlayerStats` at run start |
| `UnlockLedger` | ScriptableObject singleton | Tracks unlocks; emits events when a new one fires |
| `AchievementChecker` | MonoBehaviour | Listens to run events; writes to `UnlockLedger` |

## UI

| Class | Kind | Responsibility |
|---|---|---|
| `HUDController` | MonoBehaviour | HP bar, XP bar, timer, kills, gold, current build icons |
| `DraftCardUI` | MonoBehaviour | Renders one card; handles hover/confirm |
| `DamageNumberPool` | MonoBehaviour | Pool of pre-instanced TMP damage numbers; reused |
| `PauseMenu` | MonoBehaviour | Run state snapshot + options |
| `ResultsScreen` | MonoBehaviour | End-of-run stats, gold transfer animation, chain to meta-shop |
| `MetaShopUI` | MonoBehaviour | Tiered power-up purchase |
| `CharacterSelect` | MonoBehaviour | Unlocked characters + per-character stats quirk display |

## VFX

| Class | Kind | Responsibility |
|---|---|---|
| `VFXPool` | MonoBehaviour | Pools hit sparks, explosions, evolution bursts |
| `ScreenShake` | MonoBehaviour | Cinemachine impulse source wrapper |
| `DamageFlash` | MonoBehaviour | Sprite shader trick for hit flash (MaterialPropertyBlock) |

## Data Flow Summary

```
InputReader → PlayerController → PlayerMovement
                                        ↓
EnemySpawner → EnemyPool → EnemyBrain → SpatialHash
                                        ↓
WeaponSystem → IFirePattern → ProjectilePool → ProjectileBehaviour
                                        ↓
                               DamageSystem → IDamageable.TakeDamage
                                        ↓
                               Enemy death → GemPickup → MagnetSystem → XPController → LevelUpDraftController
                                        ↓
                                                   Draft pick → PlayerStats / WeaponRuntime update
```

Every node is a MonoBehaviour or a plain class owned by `RunState`. No MB talks to another MB except through `RunState.I` or a direct injected ref.
