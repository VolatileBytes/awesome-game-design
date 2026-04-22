---
id: slay-the-spire
title: Slay the Spire — Unity Implementation
version: 0.1.0
description: Unity-specific implementation overlay for Slay the Spire — turn-based deckbuilder roguelike with seeded runs, card effect engine, and branching map.
tags: [unity, deckbuilder, roguelike, turn-based]
---

# Slay the Spire — Unity Implementation

Engine overlay for Slay the Spire. See [base GDD](../../GDD.md).

> Original game is Java/LibGDX (desktop) + Unity (mobile, by Humble Games). Rebuilds target Unity.

## Target

- **Unity**: 2022.3 LTS
- **Render pipeline**: URP 2D
- **Input**: New Input System (pointer + keyboard)
- **Platforms**: PC primary, mobile secondary
- **Networking**: none (fully offline, daily-seed leaderboard optional)

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP 2D |
| `com.unity.inputsystem` | Pointer + keyboard input |
| `com.unity.textmeshpro` | Card text, keyword tooltips |
| `com.unity.ugui` | Canvas-based UI |
| `com.unity.addressables` | Card/relic asset loading |
| `com.unity.localization` | Multi-language |

Third-party:
- **DOTween** — card tween animations
- **Newtonsoft.Json** — save file format
- **MessagePack-CSharp** — optional compact save

## Core Architecture

### Data-Driven Content

All cards, relics, enemies, events as ScriptableObjects:

```csharp
[CreateAssetMenu(menuName = "Spire/Card")]
public class CardDefinition : ScriptableObject {
    public string Id;
    public string Title;
    public int Cost;              // -1 = X-cost
    public CardType Type;         // Attack, Skill, Power, Status, Curse
    public CardRarity Rarity;
    public CharacterClass Class;
    public TargetType Target;
    public List<CardKeyword> Keywords;
    public CardEffectGraph Effect;   // graph of effect nodes
    public CardEffectGraph UpgradedEffect;
    public Sprite Art;
}
```

Similarly for `RelicDefinition`, `EnemyDefinition`, `EventDefinition`, `PotionDefinition`.

### Effect System

Cards don't contain hardcoded logic. Each card has an **effect graph** — a list of effect nodes resolved sequentially:

```
Effect graph example (Bash):
  [DealDamage(target: hand, amount: 8)]
  [ApplyStatus(target: hand, status: Vulnerable, stacks: 2)]
```

Effect nodes:

```csharp
public abstract class EffectNode : ScriptableObject {
    public abstract void Execute(EffectContext ctx);
}

public class DealDamageEffect : EffectNode { ... }
public class ApplyBlockEffect : EffectNode { ... }
public class DrawCardsEffect : EffectNode { ... }
public class ApplyStatusEffect : EffectNode { ... }
public class ExhaustSelfEffect : EffectNode { ... }
public class GainEnergyEffect : EffectNode { ... }
```

The graph pattern makes adding cards trivial — designers compose existing effects without writing new code.

### Sim / View Separation

- `Sim.CombatState` — pure data: decks, HP, energy, status, intents.
- `Sim.CombatSim` — state transitions, returns event stream.
- `View.CombatView` — consumes events, drives animations.
- Sim is deterministic given RNG seed.

### Deterministic RNG

```csharp
public class SimRandom {
    private uint _seed;
    public uint Next() { /* xorshift */ }
    public int Range(int min, int max) { ... }
    public T Pick<T>(IList<T> list) { ... }
}
```

Used for:
- Card draw shuffle (seeded from run seed + floor + turn).
- Combat reward card roll.
- Event outcome roll.
- Map generation.

Same seed = same map, same draws, same rewards. Enables daily challenge + bug repro.

## Project Layout

```
Assets/
  _Project/
    Art/
      Cards/              # one sprite per card
      Relics/
      Enemies/
      Portraits/
      UI/
      VFX/
    Data/
      Cards/              # CardDefinition SOs per character
      Relics/
      Enemies/
      Events/
      Potions/
      Maps/               # map generation configs
    Prefabs/
      CardView
      EnemyView
      RelicTrayItem
      MapNode
      HUD/
    Scenes/
      Boot.unity
      CharacterSelect.unity
      Map.unity
      Combat.unity
      Event.unity
      Shop.unity
      Rest.unity
      GameOver.unity
    Scripts/
      Core/
      Sim/
        Combat/
        Map/
      View/
      UI/
      Input/
      Save/
      Meta/                # ascension, unlocks
```

## Combat Sim

### State

```csharp
public class CombatState {
    public PlayerState Player;
    public List<EnemyState> Enemies;
    public List<CardInstance> DrawPile;
    public List<CardInstance> Hand;
    public List<CardInstance> DiscardPile;
    public List<CardInstance> ExhaustPile;
    public int Energy;
    public int Turn;
    public SimRandom Rng;
}

public class PlayerState {
    public int MaxHP, CurrentHP;
    public int Block;
    public Dictionary<StatusType, int> Statuses;
    public List<RelicInstance> Relics;
}

public class EnemyState {
    public EnemyDefinition Def;
    public int MaxHP, CurrentHP;
    public int Block;
    public Dictionary<StatusType, int> Statuses;
    public Intent CurrentIntent;
    public Intent NextIntent;
    public IEnemyAI AI;
}
```

### Tick

```csharp
public class CombatSim {
    public IEnumerable<CombatEvent> StartCombat() { ... }
    public IEnumerable<CombatEvent> PlayCard(CardInstance card, EnemyState target) { ... }
    public IEnumerable<CombatEvent> EndTurn() { ... }
}
```

Each method returns a stream of events the View consumes to animate:
- `CardPlayed`, `DamageDealt`, `BlockGained`, `StatusApplied`, `StatusTicked`, `CardDrawn`, `TurnEnded`, `EnemyIntentChosen`, `CombatEnded`.

## Map Generation

Generate once per act when entering.

```csharp
public class MapGenerator {
    public Map Generate(int act, uint seed) {
        // 15 rows (ST rule: 15 floors per act)
        // Start: 6 entry nodes
        // Generate 6 random paths via weighted pathfinding
        // Place mandatory elite + rest + treasure nodes
        // Boss at top
    }
}
```

Path generation is the canonical "ST algorithm": pick 6 starting points on row 1, traverse upward, enforce rules (no two elites adjacent vertically, at least 1 rest before boss, etc.).

## Enemy AI

Each enemy has an AI script that picks the next intent:

```csharp
public interface IEnemyAI {
    Intent ChooseIntent(EnemyState self, CombatState combat);
}
```

Typical patterns:
- **Fixed cycle**: Jaw Worm does Chomp→Bellow→Thrash→Chomp.
- **Weighted random**: 50% attack / 30% defend / 20% buff, no-repeat rules.
- **Conditional**: Gremlin Nob powers up on player skill plays.

Enemy AI is explicit data-driven behavior, not Unity's NavMesh/ML-Agents.

## Save / Load

- JSON save on every floor transition.
- Save includes: character, ascension, seed, floor, deck, relics, potions, gold, HP, map, visited nodes.
- Resume: reconstruct state on boot screen.

## Performance

- ~30–50 card instances in a deck.
- ~5–10 enemies max in combat.
- Static backdrop; no particle storm needed.
- Easy 60fps on 5-year-old hardware.
- Mobile: ensure card tweens don't allocate (pool DOTween sequences).

## Modding Hooks (optional)

Original Slay the Spire has a thriving mod community. Consider:
- Cards/relics defined as SO + effect graph → modders add SOs via asset bundles.
- Event scripts via visual graph or CSV+DSL.
- Character packs as separate addressable groups.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Card Effect System](references/card-effect-system.md)
