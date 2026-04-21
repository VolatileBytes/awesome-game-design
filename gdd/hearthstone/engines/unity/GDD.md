---
id: hearthstone
title: Hearthstone — Unity Implementation
version: 0.1.0
description: Unity-specific implementation guide for a turn-based class-based CCG with rich minion board combat, spells, weapons, and hero powers.
tags: [unity, mobile, pc, card-game, turn-based]
---

# Hearthstone — Unity Implementation

Engine overlay for the Hearthstone GDD. See [GDD.md](../../GDD.md).

## Target

- **Unity**: 2022.3 LTS or later
- **Render pipeline**: URP (3D boards with flat-stylized cards)
- **Input**: New Input System, mouse + touch unified
- **Platforms**: iOS + Android + PC/Mac (tablet-first design, desktop-adapted)
- **Networking**: server-authoritative turn-based

## Package List

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP |
| `com.unity.inputsystem` | Mouse + touch |
| `com.unity.cinemachine` | Cinematic moments (legendary plays) |
| `com.unity.addressables` | Card art + VFX loaded on demand |
| `com.unity.textmeshpro` | UI + card text |
| `com.unity.ugui` | Canvas, UI |
| `com.unity.localization` | Multi-language |
| `com.unity.timeline` | Scripted reveal sequences |

Third-party:
- **DOTween** — card tweens (fly-in, flip, attack)
- **MessagePack-CSharp** — wire format
- **FMOD / Wwise** — rich audio (each card has a voiced quote)

## Core Architecture

### Server-Authoritative Turn-Based

- Server owns all hidden state (shuffled deck draw order, hand of each player)
- Server runs the game rules engine authoritatively
- Client reflects server state + animates

### Sim / View Separation

- `Game.Sim` — pure C# rules engine; the "game"
- `Game.View` — MonoBehaviours driving the visual presentation
- Sim runs on server; client can mirror for animation previews but trusts server

### Event-Driven Resolution

When a card is played, the sim emits a stream of **events**:
- `MinionSummoned`
- `SpellCast`
- `BattlecryTriggered`
- `DamageDealt`
- `MinionDied`
- `DeathrattleTriggered`

The view consumes these events and plays appropriate animations. Ordering is strictly defined.

## Project Layout

```
Assets/
  _Project/
    Art/
      Cards/                  # card art per card
      Heroes/
      Boards/                 # tavern boards (themed per expansion)
      VFX/                    # spell effects, combat hits
      UI/
    Data/
      Cards/                  # ScriptableObject per card
      HeroPowers/
      Classes/
      Expansions/
    Prefabs/
      CardView
      MinionView
      HeroView
      SpellVFX
      BoardScene/
    Scenes/
      Boot.unity
      Menu.unity
      Match.unity
      Collection.unity
      Arena.unity
    Scripts/
      Core/
      Sim/                    # rules engine
      View/
      Net/
      Cards/                  # card effects
      HeroPowers/
      Classes/
      UI/
      Collection/
      Economy/
      Arena/
      Events/
```

## Card System

### ScriptableObject Definition

```csharp
[CreateAssetMenu]
public class CardDefinition : ScriptableObject {
    public string Id;
    public string DisplayName;
    public CardType Type;  // Minion, Spell, Weapon, HeroCard, Location
    public HeroClass Class; // Neutral or specific
    public Rarity Rarity;
    public int Cost;
    public int Attack;     // Minion, Weapon
    public int HP;         // Minion (or Durability for Weapon)
    public MinionTribe Tribe;  // Beast, Demon, etc.
    public List<Keyword> Keywords;
    public string TextTemplate;
    public Sprite Art;
    public CardEffect Effect;  // data-driven effect asset
}
```

### Effect Strategy

```csharp
public abstract class CardEffect : ScriptableObject {
    public virtual void OnBattlecry(SimContext ctx, MinionInstance self, TargetSpec target) { }
    public virtual void OnDeathrattle(SimContext ctx, MinionInstance self) { }
    public virtual void OnSpellCast(SimContext ctx, SpellContext spell, TargetSpec target) { }
    public virtual void OnTurnStart(SimContext ctx, MinionInstance self) { }
    public virtual void OnTurnEnd(SimContext ctx, MinionInstance self) { }
    public virtual void OnDamageDealt(SimContext ctx, MinionInstance self, int damage, CardInstance target) { }
    // ...more triggers
}
```

### Keyword Handling

Keywords are flags on the MinionInstance:
- `HasTaunt`, `HasDivineShield`, `HasStealth`, `HasCharge`, `HasRush`, `HasWindfury`, `HasLifesteal`, `HasPoisonous`

Auras (like "your other murlocs have +1/+1") are evaluated by the sim when calculating stats each turn.

## Game State

```csharp
public class SimState {
    public Player PlayerA, PlayerB;
    public int TurnNumber;
    public PlayerId CurrentTurnPlayer;
    public List<MinionInstance> Board(PlayerId id);
    public HandState Hand(PlayerId id);
    public HeroState Hero(PlayerId id);
    public int Mana(PlayerId id);
    public WeaponInstance Weapon(PlayerId id);
}
```

### Player
- Deck (hidden from client)
- Hand (hidden from opponent)
- Board (public)
- Hero
- Hero Power
- Mana
- Weapon
- Graveyard

## Turn Resolution

```csharp
public class TurnProcessor {
    public void StartTurn(PlayerId id);
    public void PlayCard(PlayerId id, int handIndex, TargetSpec target);
    public void Attack(PlayerId id, SourceId attacker, TargetId target);
    public void UseHeroPower(PlayerId id, TargetSpec target);
    public void EndTurn(PlayerId id);
}
```

Each method validates the action (mana cost, legal target, etc.) and emits events.

## View

- `CardView` — card in hand; animate drag, hover, play
- `MinionView` — minion on board; idle, attack, takeHit, die
- `HeroView` — hero portrait; HP, armor, animate when hit
- `BoardView` — manages minion placement + layout
- `SpellVFX` — per-spell visual effect prefab
- `ComboAnimator` — sequences of events (multi-step plays)

### Event Playback

```csharp
public class EventPlayer {
    public IEnumerator Play(IEnumerable<SimEvent> events);
}
```

- Dequeues events
- Plays each with proper animation (tween duration, VFX, SFX)
- Waits for critical events (like "MinionDied" → cleanup) before proceeding

## Networking

- **WebSocket** connection to game server
- **Action packets**: `{playerId, action, targets}`
- **State packets**: full event list + public state snapshot
- **Turn timer**: server-owned; client displays remaining time
- **Reconnect**: client can resume mid-match

## Anti-Cheat

- Server-owned RNG (seeded, not client-visible)
- Server-owned hidden information (deck order, opponent's hand)
- Server validates every action

## Arena Mode

- **Draft**: server presents 3 cards → client picks 1 → repeat 30 times
- Draft state stored server-side
- Deck used in subsequent Arena matches

## Battlegrounds (Separate Mode)

A large subsection worth its own doc, but in brief:
- 8-player auto-chess
- Each round: shop phase (buy/sell minions) + battle phase (auto-resolved)
- Hero pool (random choice at start)
- Minion tribes + scaling
- This is technically a separate game mode sharing the infrastructure

## Performance

- ~10 minions on board max; < 100 spell particles active — trivial load
- **Mobile tablet** is the lowest target — URP with aggressive LOD, texture streaming
- **Card art lazy load** via Addressables; cards not in hand load on demand
- **Animation instancing** — if 7 copies of the same minion are on the board, share skeletons

## UI

- **Hand fan**: cards arc along bottom; repositions on hover
- **Mana tray**: right side; fills/empties with mana usage
- **Rope**: turn timer; visual burn
- **End turn button**: big and central-right
- **Hero Power button**: left of portrait; 2 mana cost visible
- **Target arrow**: when dragging a card or an attack, a ghostly arrow connects to target
- **Board hitboxes**: minion slots visible when dragging a minion card (shows position preview)

## Replay

- Action log + seed + initial decks = deterministic replay
- Stored server-side for a time; client can download for review
- Highlights: automatic clip generation at legendary plays / lethals

## Common Unity Pitfalls

- **Canvas rebuild on every minion summon**: batch UI updates; use DrivenRectTransform
- **Animator per minion**: Animator is heavy; for static-pose minions use sprite swap + tween
- **Spell VFX ungate'd**: pool all VFX; never Instantiate ParticleSystem in hot path
- **Audio source spam**: channel-limit; prioritize key audio (hero voiceover > ambient)
- **Long chains of coroutines**: for complex events, use a dedicated event queue with timing

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Effect System](references/effect-system.md)
