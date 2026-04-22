---
id: balatro
title: Balatro — Unity Implementation
version: 0.1.0
description: Unity-specific implementation overlay for Balatro — poker-deckbuilder roguelite with chips × mult scoring engine and 150+ composable Jokers.
tags: [unity, deckbuilder, roguelike, card-game, poker]
---

# Balatro — Unity Implementation

Engine overlay for Balatro. See [base GDD](../../GDD.md).

> Original: LÖVE (Lua + C), solo-built by LocalThunk. Mobile port (Playstack) uses Unity. This spec targets a Unity 2022.3 LTS rebuild.

## Target

- **Unity**: 2022.3 LTS
- **Render pipeline**: URP 2D (for the CRT post-process and card shaders)
- **Input**: New Input System (pointer + keyboard + gamepad)
- **Platforms**: PC / Mac / Switch / iOS / Android
- **Networking**: none (seed leaderboard via HTTPS GET only)

## Packages

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP 2D + Render Feature for CRT post |
| `com.unity.inputsystem` | Cross-platform input |
| `com.unity.textmeshpro` | Card typography |
| `com.unity.ugui` | Canvas UI |
| `com.unity.addressables` | Joker / card art loading |
| `com.unity.localization` | 10+ languages |
| `com.unity.mathematics` | Deterministic `double` math |

Third-party:
- **DOTween Pro** — card tween animations (the score-tally feel).
- **Newtonsoft.Json** — save files.
- **MessagePack-CSharp** — optional compact save.

## Core Architecture

### Sim / View Split

- **`Sim.RunState`** — pure data: current ante, blind, deck state, hand, Jokers, gold.
- **`Sim.ScoringEngine`** — applies the hand-scoring pipeline, emits events.
- **`View.TableView`** — consumes events, drives animations.

Sim is deterministic given a 64-bit seed.

### Data-Driven Content

Every Joker, consumable, blind, and voucher is a ScriptableObject:

```csharp
[CreateAssetMenu(menuName = "Balatro/Joker")]
public class JokerDefinition : ScriptableObject {
    public string Id;
    public string Title;
    [TextArea] public string Description;
    public JokerRarity Rarity;
    public int BaseCost;
    public TriggerPointFlags Triggers;      // OnCardScored, OnHeld, Independent, OnBlindStart, etc.
    public EffectNode Effect;               // graph
    public Sprite Art;
    public int OrderInShop;
}
```

Same pattern for `ConsumableDefinition`, `BlindDefinition`, `VoucherDefinition`, `DeckDefinition`.

### Effect Graph

See [scoring-engine.md](references/scoring-engine.md). Jokers, enhancements, editions, seals, and consumable effects all plug into the same effect node system. A new Joker ships as a ScriptableObject referencing existing nodes — no code change.

### Deterministic RNG

Run seed is a 64-bit string (e.g. `"BALATRO"` hashed). Each decision point consumes from a typed RNG stream:

```csharp
public class SimRandom {
    public SimRandom ForStream(string streamName);  // "shuffle", "shop", "pack", "boss"
    public uint Next();
    public int Range(int min, int max);
    public T Pick<T>(IReadOnlyList<T> list);
    public T PickWeighted<T>(IReadOnlyList<(T item, double weight)> list);
}
```

Separate streams prevent "spending a reroll" from changing future shuffle order.

Used for: hand shuffle, shop item rolls, boss blind selection, Tarot effects, Spectral rolls, Legendary Joker drops.

## Project Layout

```
Assets/
  _Project/
    Art/
      Cards/              # 52 base cards × variants (Foil/Holo/Polychrome shaders)
      Jokers/             # 150 Joker sprites
      Consumables/
      UI/
      VFX/
      Shaders/
        CRTPost.shader
        HoloCard.shader
        PolychromeCard.shader
    Audio/
      Music/
      SFX/                # chip sfx, mult sfx, score tally ticks
    Data/
      Jokers/             # 150 .asset files
      Consumables/
      Blinds/
      Vouchers/
      Decks/
      Challenges/
    Prefabs/
      PlayingCard
      JokerCard
      ConsumableCard
      ScoreReadout
    Scenes/
      Boot.unity
      Title.unity
      Run.unity            # one scene drives entire run
    Scripts/
      Sim/
        Scoring/
        Shop/
        Run/
      View/
      UI/
      Input/
      Save/
      Meta/                # unlocks, completion grid
```

The entire gameplay fits in **one scene** (`Run.unity`) — unlike Slay the Spire, there's no map to navigate. The shop and blind screens are just UI states in the same scene.

## Scoring Pipeline

See [scoring-engine.md](references/scoring-engine.md) for implementation detail. Summary:

```
PlayHand(selectedCards) →
  ScoringEngine.Score(hand, state) →
    yields events: BaseHandEvaluated, CardScored, JokerTriggered, FinalScoreCalculated
  RunState.CurrentBlindScore += finalScore
  if score ≥ target: BlindCleared
  else if hands == 0: RunEnded
```

Event stream is the single contract between Sim and View.

## Save / Load

- JSON save on every state boundary: blind cleared, shop closed, consumable used.
- Save payload: deck composition, Jokers in order, consumables, current ante + blind, gold, seed, hand history.
- Resume: restore state deterministically; any interrupted hand is re-offered at the exact same state.

```csharp
public class RunSnapshot {
    public string Seed;
    public string DeckId;
    public int Ante, BlindIndex;
    public int Money;
    public List<CardInstanceSnapshot> FullDeck;
    public List<JokerSnapshot> Jokers;  // ordered
    public List<ConsumableSnapshot> Consumables;
    public List<CardInstanceSnapshot> CurrentHand;
    // ... etc
}
```

## Performance

- Deck: 52–70 cards; Jokers: ≤ 10; consumables: ≤ 5. Tiny state.
- Primary perf concern: **score tally animation** has to stay buttery at 60fps while the count may go into 10+ digits.
- Pool DOTween sequences. Pool damage-number labels. Pool card-flash particles.
- Mobile target: 60fps on iPhone 11 / mid-2020 Android.

## Big-Number Handling

Endless mode scores can exceed `2^53` (double precision mantissa limit). Options:

1. **BigInteger**: exact, heavier. Use for Endless mode only.
2. **Custom big-float**: `(double mantissa, int exponent)` with renormalization. Fast, lossy past 15 digits but visually indistinguishable.

Recommendation: use `double` for early antes (up to 10^15), swap to big-float for Endless. Match original's display format: `1.234e18`.

## Localization

10+ languages in original. Card/Joker descriptions contain keywords that need localized inline formatting:

```
"+4 Mult for every {suit:heart} card scored"
```

The formatter swaps `{suit:heart}` with the suit icon at render time; the string asset stays tokenized.

## Modding Hooks

Community mods for Balatro (Steamodded) are popular. For Unity port:
- Jokers/consumables as ScriptableObject + effect graph → modders add .asset files via AssetBundle.
- Custom `EffectNode` subclasses in a .dll for exotic behaviors.
- `Mods/` folder at user data path; game discovers bundles at boot.

This mirrors Slay the Spire's approach (see that GDD for pattern) — already proven.

## Platform Notes

- **Switch**: menu layout needs gamepad-first design; hotkey hints visible.
- **Mobile**: no right-click → long-press for tooltips; reorder via drag with haptic tick.
- **Desktop**: support mouse + keyboard hotkeys; discoverability of keyboard shortcuts via in-game tooltip.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Scoring Engine](references/scoring-engine.md)
