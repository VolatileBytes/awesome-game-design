---
id: darkest-dungeon
title: Darkest Dungeon — Unity Implementation
version: 0.1.0
description: Unity-specific implementation overlay for Darkest Dungeon — turn-based gothic RPG with formation combat, stress system, and long-term estate management.
tags: [unity, turn-based, rpg, gothic, 2d]
---

# Darkest Dungeon — Unity Implementation

Engine overlay for Darkest Dungeon. See [base GDD](../../GDD.md).

> Original: Adobe AIR + custom scripting. Red Hook's own tooling. Rebuild target: Unity 2022.3 LTS for modern platform reach.

## Target

- **Unity**: 2022.3 LTS
- **Render pipeline**: URP 2D (for rim lighting on hero portraits + parallax dungeon BGs).
- **Input**: New Input System (pointer + keyboard + gamepad).
- **Platforms**: PC/Mac, Switch, iOS, Android, Steam Deck.
- **Target fps**: 60 (sim is turn-based; only animations need smoothness).

## Packages

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | URP 2D |
| `com.unity.inputsystem` | Input |
| `com.unity.textmeshpro` | UI, narrator captions |
| `com.unity.addressables` | Hero/enemy asset streaming |
| `com.unity.localization` | i18n |
| `com.unity.2d.animation` | Rigged character animation |

Third-party:
- **Spine 2D** — used by original game for rig animation; community license.
- **FMOD Studio** — narrator VO routing + dynamic music.
- **DOTween Pro** — UI tweens.
- **Newtonsoft.Json** — save files.

## Core Architecture

### Deterministic Sim

Combat is strictly turn-based; no real-time sim. Deterministic state machine driven by a seeded RNG:

```csharp
public class CombatState {
    public List<HeroState> Heroes;         // 4 heroes
    public List<EnemyState> Enemies;       // 1–4 enemies
    public List<Combatant> TurnOrder;
    public int CurrentTurnIndex;
    public int RoundNumber;
    public SimRandom Rng;
    public List<CombatEvent> EventLog;
}
```

All combat math uses integer damage. Float is avoided in RNG paths.

### Data-Driven Content

```csharp
[CreateAssetMenu(menuName = "DD/Class")]
public class HeroClassDefinition : ScriptableObject {
    public string Id;
    public SkillDefinition[] Skills;       // all 7 class skills
    public CampSkillDefinition[] CampSkills;
    public QuirkRestrictionList QuirkRules;
    public int BaseHP;
    public int BaseSpeed;
    public int BaseAccuracy, BaseDodge, BaseProt, BaseCrit;
    public List<StatPerLevel> GrowthTable;
    public GameObject BattlePrefab;        // rigged sprite
}

[CreateAssetMenu(menuName = "DD/Skill")]
public class SkillDefinition : ScriptableObject {
    public string Id;
    public int UsableFromRanks;             // bitflag 0b1111 = all
    public int TargetsRanks;                // bitflag
    public TargetType Target;               // self, ally, enemy, allAllies, allEnemies
    public float DamageMultiplier;          // vs weapon damage
    public int AccuracyMod;
    public int CritMod;
    public int SelfMove;                    // + forward, - backward
    public int TargetMove;                  // for shuffle skills
    public List<StatusApplyDefinition> ApplyOnHit;
    public EffectGraph Effect;              // graph for complex skills
}

[CreateAssetMenu(menuName = "DD/Enemy")]
public class EnemyDefinition : ScriptableObject {
    public string Id;
    public int MaxHP, Speed, Prot, Dodge;
    public List<AttackDefinition> Attacks;
    public AIPickerDefinition AI;
    public Sprite Portrait;
    public GameObject BattlePrefab;
}
```

### Effect Graph

Skills use the same effect graph pattern as Slay the Spire / Balatro / Hades GDDs:

```csharp
public abstract class EffectNode : ScriptableObject {
    public abstract IEnumerable<CombatEvent> Execute(EffectContext ctx);
}

public class DealDamageEffect : EffectNode { ... }
public class ApplyStatusEffect : EffectNode { ... }    // Bleed, Blight, Stun, Mark, etc.
public class HealEffect : EffectNode { ... }
public class DealStressEffect : EffectNode { ... }
public class HealStressEffect : EffectNode { ... }
public class ShuffleEffect : EffectNode { ... }
public class MoveSelfEffect : EffectNode { ... }
public class GuardEffect : EffectNode { ... }
public class ConditionalEffect : EffectNode { ... }
public class SequenceEffect : EffectNode { ... }
```

## Project Layout

```
Assets/
  _Project/
    Art/
      Heroes/               # rigged sprite sheets per class
      Enemies/
      Bosses/
      Dungeons/            # parallax backgrounds per region
      UI/
      VFX/
    Audio/
      Narrator/            # 800+ lines from Wayne June
      SFX/
      Music/               # per-region stinger + ambient
    Data/
      Classes/              # 15 class SOs
      Skills/               # 7 × 15 = ~100 skill SOs (+ alts)
      Enemies/
      Bosses/
      Trinkets/             # ~200 SOs
      Quirks/               # ~100 SOs
      Dungeons/             # region + mission types
      Curios/               # random room-encounter objects
      Camping/              # ~30 camping skills
    Prefabs/
      HeroBattlePrefab/
      EnemyBattlePrefab/
      HamletBuildings/
      UI/
    Scenes/
      Boot.unity
      Title.unity
      Hamlet.unity
      Dungeon.unity         # single scene drives all dungeon gameplay
    Scripts/
      Sim/
      View/
      UI/
      Meta/
      Save/
      Narrator/
```

## Dungeon Generation

Dungeons are **procedural hallways + rooms**:
- Generate 6–10 rooms connected by hallways.
- Each hallway = 2–4 "step" positions.
- Place mandatory objectives (boss room, exit, gather points).
- Fill rooms with curios, treasure, enemy encounters.
- Mission type dictates objective (clear 4 boss, explore 90%, etc.).

```csharp
public class DungeonGenerator {
    public DungeonLayout Generate(DungeonDef def, MissionType mission, uint seed) { ... }
}

public class DungeonLayout {
    public List<Room> Rooms;
    public List<Hallway> Hallways;
    public Room StartRoom, BossRoom;
}
```

## Combat Flow

```csharp
public class CombatController : MonoBehaviour {
    CombatState _state;

    public async Task RunCombat() {
        StartCombat();
        while (!IsResolved()) {
            var combatant = _state.TurnOrder[_state.CurrentTurnIndex];
            if (combatant.IsStunned) { SkipTurn(combatant); continue; }
            TickStatuses(combatant);
            var action = combatant.IsHero
                ? await GetPlayerInput(combatant)
                : PickAIAction(combatant);
            var events = ExecuteAction(combatant, action);
            await PlayEventsInView(events);
            AdvanceTurn();
        }
        EndCombat();
    }
}
```

## Narrator System

A `NarratorService` subscribes to key combat events and plays appropriate VO lines:

```csharp
public class NarratorService {
    private readonly VoiceDriver _voice;
    public void OnEvent(CombatEvent e) {
        var line = _lineLibrary.PickFor(e);
        if (line != null) _voice.Play(line);
    }
}
```

Line library is data-driven. Events: crit dealt, crit received, affliction triggered, virtuous triggered, heart attack, hero death, room cleared, curio discovered. Each has a line pool; picked at random but no repeats within a short window.

## Save / Load

Persistent game save:

```csharp
public class SaveData {
    public EstateState Estate;           // buildings, heirlooms, gold, graveyard
    public List<HeroState> Roster;       // all living + recruited heroes
    public CalendarState Calendar;       // current week, upcoming dungeons
    public DungeonSnapshot InDungeon;    // nullable; mid-dungeon
    public StoryState Story;             // DD missions completed, flags
}
```

Auto-save every dungeon step. Manual save on Hamlet screen.

## Performance

- Dungeon sim has ~12 rigged sprites max on screen (4 heroes + 4 enemies + torch + effects).
- Turn-based: no 60Hz physics. Budget is VFX + animation.
- Loading a dungeon scene < 5s on HDD.
- Hamlet scene < 3s.

## Mobile Considerations

- Touch: all menus + combat tap-friendly; portraits sized ≥ 80px on phones.
- No double-tap — single tap confirm, two-finger for cancel.
- Haptic feedback on crits + afflictions.
- Performance: UI pass is heavy (many portraits + icons); lazy-load outside viewport.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Combat Design](../../references/combat-design.md)
- [Stress System](../../references/stress-system.md)
