# Narrative System — Hades

Hades's story engine is the feature most rebuilds underestimate. ~21,000 voice lines, a queue per NPC, conditional triggers on run state — it's a whole subsystem.

## Design Goals

1. **No line ever plays twice** (until that NPC's queue empties).
2. **Lines feel reactive** to current run (weapon, death cause, Boon set).
3. **No branching trees** — linear queues with conditions, not conversation graphs.
4. **Content expandable**: writing team adds lines without code changes.

## Line Structure

Each NPC has an ordered **dialogue queue**. A line is:

```
DialogueLine {
  id: string                   # for analytics/debugging
  npc: NpcId
  priority: int                # lower = earlier in queue
  preconditions: list<Cond>    # e.g. "killed boss X", "has Boon Y", "escape count ≥ N"
  oneShot: bool                # if true, removed from queue after play
  recurring: bool              # if true, returns to queue after some cooldown
  voiceAssetId: string         # wav/ogg
  text: LocalizedString
  camera: CameraShotRef        # close-up on speaker
  followUpLines: list<LineRef> # optional in-conversation continuation
  gates: list<Gate>            # e.g. "must have gifted nectar recently"
}
```

## Hub Interaction Loop

Every time Zagreus dies and returns to the House:

1. **Scan all NPCs** in the hub.
2. For each NPC, find highest-priority queued line with all preconditions met.
3. **Attach exclamation marker** above NPC if a new line is ready.
4. On player interaction: play line, mark as consumed, trigger follow-ups if any.

The conditions engine is the key — it queries the current run's metadata:

```
Cond: RunCount >= 5
Cond: LastWeaponUsed == "Varatha"
Cond: GiftedNectarTo(Meg) >= 3
Cond: Has Boon from Zeus in current run
Cond: Died to Asterios last run
Cond: Mirror node "Boiling Blood" upgraded
Cond: Reached Chamber 40+
Cond: House upgrade "Fountain" built
```

## Barks (In-Run Lines)

Mid-run lines trigger dynamically:

- **Boon accept**: god delivers unique line based on which Boon you took.
- **Room clear**: occasional bark from a god whose Boon you have.
- **Boss re-encounter**: Meg/Alecto/Tisiphone each have 10+ lines depending on weapon / prior defeats.
- **Hades observes**: Hades himself comments when you reach him, changing by run count.

Each bark is a short voice clip (1–3 seconds) and a captioned text overlay, not a full camera cut.

## Relationship Arcs

Each NPC's queue has **arc markers**:
- **Stranger** → **Acquaintance** → **Friend** → **Companion** → **Epilogue**.
- Gifting Nectar advances the arc by 1 step; each step gates new lines in the queue.
- **Ambrosia** (for romanceable NPCs) unlocks a date scene + unique keepsake upgrade.

## Persephone Meta-Arc

The core story is gated by **escape count** + specific NPC gifts + specific dialog triggers. Once Zagreus escapes:
- Meets Persephone on the surface.
- Returns for additional escapes with expanded queues for surface lore.
- Family reconciliation arc unfolds over 10–20 more runs.

Final credits roll only after Persephone returns to the House, which has its own prerequisite chain (gifting Hades Ambrosia, etc.).

## Implementation Pattern

The system works great as a **data-driven rules engine** — writers edit CSVs/YAML; engineers own the conditions DSL.

### Example line file (CSV row):

```
id, npc, priority, preconditions, text_key, voice_id, oneShot
zag_meg_010, Meg, 10, "escape_count>=2 & last_weapon=sword", "ZAG_MEG_010_TEXT", "meg/zag_010.ogg", true
```

Preconditions parse into:

```csharp
Condition.And(
  Condition.MinEscapeCount(2),
  Condition.LastWeaponId("sword")
)
```

## Voice Acting Budget

A budget reality check for rebuilds:
- 21,000 lines × $3–5/line studio rate = ~$70k–$100k of VO.
- Only 8–10 core roles are heavy (Zag, Hades, Nyx, Meg, Achilles, gods); most NPCs have < 400 lines.
- Plan recording in batches: write 6 months' worth of lines before each session.

A non-commercial rebuild can use placeholder text-only; the *system* is what this doc is about.

## Pitfalls

- **Queue exhaustion**: some obsessive players talk to NPCs after every single death; queues empty fast. Solution: recurring "empty queue" lines ("Nothing to say at the moment" — with 10+ variants to not feel repetitive).
- **Localization**: 21k lines × 12 languages = 250k+ localized strings. Translation memory + a strict tokenization system is required.
- **Spoiler gates**: lines must be gated by story state so "Persephone" isn't mentioned until player has met her.
- **Save compatibility**: adding lines via patch should not break mid-run queues — always append to existing NPC queues.

## Data Model (Unity)

```csharp
[CreateAssetMenu(menuName = "Hades/NPC")]
public class NpcDefinition : ScriptableObject {
    public string Id;
    public string DisplayName;
    public List<DialogueLineDefinition> Queue;
    public bool IsGiftable;
    public KeepsakeDefinition UnlockableKeepsake;
    public List<ArcStage> ArcStages;
}

[CreateAssetMenu(menuName = "Hades/DialogueLine")]
public class DialogueLineDefinition : ScriptableObject {
    public string Id;
    public int Priority;
    public string PreconditionExpression;   // DSL
    public bool OneShot;
    public bool Recurring;
    public LocalizedString Text;
    public AudioClip Voice;
    public CameraShotDefinition Camera;
    public List<DialogueLineDefinition> FollowUps;
}
```

## Test Targets

- Every line eventually playable given correct run state.
- No orphan line (not reachable from any precondition state).
- No infinite recursion through follow-ups.
- Queue scaling: 1000+ lines per NPC loads < 100ms.
- Localization completeness: every language has every line.
