# Performance Patterns

The naive Unity implementation of a bullet-heaven game falls over at roughly 100 enemies. A shipped build has to handle 500–1000 enemies, 200+ projectiles, and hundreds of damage numbers at once. The gap is made up entirely through avoidance of Unity's default paths.

## Non-Negotiable Budget

Target frame budget at 60 FPS: **~16 ms/frame**.

Rough allocation for this genre:
- Input + player + camera: < 0.5 ms
- Enemy update: 2–3 ms
- Projectile update + fire patterns: 1–2 ms
- Damage resolution: 2–3 ms
- Rendering (sprites, UI, VFX): 4–6 ms
- Everything else (audio, GC): 1–2 ms

If any of these blow up, frame drops are visible. The most common offenders in order: rendering (too many draw calls), damage resolution (OverlapCircleAll with 500 colliders), GC (allocations in Update).

## Pool Everything

### Never `Instantiate` in a running game

Every dynamic object — enemy, projectile, gem, damage number, VFX burst — comes from a pool. Pools are:

- **Pre-warmed** at run start to the expected max count
- **Sized generously** — 200 enemies per common type, 500 projectiles per weapon type, 100 damage numbers
- **Grow-capped** — if the pool is exhausted, the oldest is recycled (enemy visually culled first)

```csharp
public class Pool<T> where T : Component {
    readonly Stack<T> free = new();
    readonly T prefab;
    readonly Transform parent;

    public Pool(T prefab, int size, Transform parent) {
        this.prefab = prefab; this.parent = parent;
        for (int i = 0; i < size; i++) {
            var inst = Object.Instantiate(prefab, parent);
            inst.gameObject.SetActive(false);
            free.Push(inst);
        }
    }
    public T Get() {
        var t = free.Count > 0 ? free.Pop() : Object.Instantiate(prefab, parent);
        t.gameObject.SetActive(true); return t;
    }
    public void Release(T t) {
        t.gameObject.SetActive(false); free.Push(t);
    }
}
```

### Unity's built-in `ObjectPool<T>` is acceptable

`UnityEngine.Pool.ObjectPool<T>` works and is well-tested. Use it over rolling your own unless you need the pool to be inspectable.

## Skip Physics

Unity's 2D physics cannot handle hundreds of simulated bodies. Do not use Rigidbody2D on enemies or projectiles.

**What to use instead:**

- **Transform-direct movement.** Enemies move their `transform.position`; no Rigidbody.
- **Spatial hash for proximity queries.** A uniform grid with cell size ≈ largest projectile radius. Insert each enemy on spawn and on move. Query by cell.
- **Collision via overlap, not contacts.** Projectile hit = "which enemies are in my spatial hash cell + 8 neighbours, within my radius". Player hit = "which enemies are within my i-frame-aware radius".

### Spatial hash sketch

```csharp
public class SpatialHash {
    readonly Dictionary<int, List<Enemy>> cells = new();
    readonly float cellSize;
    public SpatialHash(float cellSize) { this.cellSize = cellSize; }
    int Hash(Vector2 p) => ((int)(p.x/cellSize) * 73856093) ^ ((int)(p.y/cellSize) * 19349663);
    public void Insert(Enemy e) { ... }
    public void Move(Enemy e, Vector2 oldPos) { ... }
    public void Query(Vector2 center, float radius, List<Enemy> results) { ... }
}
```

Cost at 500 enemies: roughly 10× faster than `Physics2D.OverlapCircleAll`, and produces zero GC.

## Avoid Allocations in Update

Every allocation inside `Update()` becomes a GC hitch later. The worst offenders:

| Bad | Good |
|---|---|
| `GetComponent<T>()` | Cache reference at `Awake()` |
| `GameObject.FindObjectOfType<T>()` | Use `RunState.I` or a service locator |
| `new List<T>()` inside update | Reuse a field-level list; call `.Clear()` |
| `foreach` over `Transform.GetComponentsInChildren<T>()` | Cache children in a list once |
| `string` concatenation for UI | TMP's `SetText` with `StringBuilder` or pooled strings |
| `Physics2D.OverlapCircleAll` (allocates) | `Physics2D.OverlapCircleNonAlloc` with a reusable buffer |
| `LINQ` (`.Where`, `.ToList`, `.Select`) | Hand-rolled for loops |

Profile with the Allocations view in Profiler. Target: **zero allocations per frame** during steady-state play.

## Damage Numbers

Naive implementation: instantiate a `TMP_Text` per hit. This is a killer — each TMP text is ~3 draw calls, and fill rate drops off a cliff.

Better:
- **Pool** 100–200 pre-instantiated TMP instances
- **Reuse** — on hit, grab one from the pool, position + `SetText`, tween out, return to pool on completion
- **Use the same canvas** for all of them; set `pixelPerfect = false`
- **Consider a single MeshRenderer + MeshCombine** for damage numbers if count explodes past 200 — but usually the pool + tween is enough

If hit rate exceeds the number-per-second budget, **stack** damage: the UI merges same-position hits into a single number that grows. This is both a perf and a readability win.

## Rendering

- **SRP Batcher** must be on. Confirm all materials are SRP-compatible (URP Lit / Sprite Default).
- **Single atlas per entity class.** All common enemies on one atlas; all projectiles on one atlas; all gems on one atlas. Mismatched materials break batching instantly.
- **No dynamic Lights.** URP 2D lights are cheap but not free at count. Use baked or no lights; sell mood through colour.
- **Disable sprite `Mask Interaction`** unless needed — it forces per-renderer state.
- **Don't use `Animator` for 500 enemies.** Use a simple time-indexed sprite swapper script if you need frame animation: `sprite = frames[(int)(Time.time * fps) % frames.Length]`. An Animator per enemy is ~50 µs; 500 of them is 25 ms.

## VFX

- Use shader-based effects (hit flash via `MaterialPropertyBlock`) instead of particle systems when possible.
- When using particle systems, set **Max Particles low** and **Disable "Play On Awake"** on pooled instances.
- **Batch VFX** where possible: screen-shake for elite deaths is one Cinemachine impulse, not per-enemy.

## Culling

Enemies far off-screen **still count for performance** even if you don't render them. Two levers:

1. **Spawn-cap by distance** — don't spawn > 2 screens away from the player.
2. **Freeze culled enemies** — enemies that go more than 1 screen off-screen for > 2 seconds are pooled back. They'll respawn from the spawn table. Skip this for elites and bosses.

## Time Scale for Pause

Weapons, enemies, and projectiles must **respect `Time.timeScale`**. This means:

- Use `Time.deltaTime`, not `Time.unscaledDeltaTime`, for all gameplay
- Use `Time.unscaledDeltaTime` **only** for pause-menu animations, level-up card tweens, and screen-shake decay

## Determinism Is Not Required

The game is not replay-deterministic. Use `Random.Range` freely. Do not use a shared RNG for the full run (it is a premature optimisation and a debugging liability).

## Profiling Workflow

Profile early and often. The minimum:

1. **In-editor Profiler** during a 10-minute test run. Watch GC.Alloc and main-thread ms.
2. **Deep Profiling** on a dev build, once, when something feels off. Don't live in Deep Profile — it distorts what's expensive.
3. **Frame Debugger** to confirm batch breaks.
4. **Memory Profiler** to catch leaks (pooled objects that are never released).

Benchmark milestones:
- **100 enemies + 50 projectiles:** must be 60 FPS on a low-end laptop
- **300 enemies + 150 projectiles:** must be 60 FPS on a mid-range desktop
- **500+:** target 60 FPS on a current desktop; 30 FPS acceptable as a stretch

Fix the first violation you hit before continuing. A perf regression shipped today is a perf rewrite tomorrow.

## Mobile Notes (If Targeted)

If Android / iOS are targets:
- Halve default pool sizes; cap visible enemy count at ~150
- Use 2× sprite atlas sizes for large screens (iPad) but 1× for phones
- Pre-compile shader variants to avoid stutter on first fire
- Target 30 FPS, not 60 — battery life matters more than smoothness in this genre
- Prefer **URP Mobile 2D Renderer** over the desktop 2D Renderer
