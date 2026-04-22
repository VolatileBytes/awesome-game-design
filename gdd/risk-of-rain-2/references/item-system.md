# Item System — Risk of Rain 2

The item system is the game. Every pickup stacks, every stack matters, the visible "item wall" in your inventory is the dopamine.

## Item Types

### Passive (the bulk)

Held in inventory. Auto-apply their effect every frame / on trigger.

Examples:
- **Soldier's Syringe** (white): +15% attack speed per stack.
- **Tri-Tip Dagger** (white): 10% chance per hit to apply Bleed (60% of damage over 3s). Per stack +10% chance.
- **Kjaro's Band** (green): 8% chance per hit to spawn a fire tornado dealing 300% TOTAL damage. Per stack +300%.
- **Ceremonial Dagger** (red): on kill, fire 4 homing daggers for 150% damage each. Per stack +150%.
- **Gesture of the Drowned** (lunar): auto-fire equipment when ready; equipment cooldown +50%. Stacks reduce cooldown penalty.

### Equipment (1 slot, manual activate)

Usable with cooldown:
- **Preon Accumulator** (140s): charge up → fire beam. Massive damage.
- **Royal Capacitor**: instant lightning on target.
- **Disposable Missile Launcher**: 12 missile salvo.
- **Crowdfunder**: drops coins, auto-fires a weak gun.

Only 1 equipment at a time; picking up replaces.

### Boss items (yellow)

Drop from bosses. Powerful persistent effects:
- **Titanic Knurl**: +40 max HP, +1.6 regen, stacks.
- **Queen's Gland**: summon a beetle guard ally.
- **Molten Perforator**: chance on hit to spawn 3 magma balls.

### Lunar items (blue)

Bought with Lunar Coins (persist across runs). Strong + tradeoff:
- **Corpsebloom**: huge heal amount but only 10%/s drip.
- **Shaped Glass**: ×2 damage, half HP.
- **Transcendence**: HP → shield (only regenerates out of combat).
- **Brittle Crown**: refund some damage as gold.

### Void items (purple, DLC)

"Corrupt" equivalents of normal items. All copies of the normal item become the void version:
- **Safer Spaces** (void): blocks one hit per 15s, but you can't stack it.
- **Benthic Bloom**: auto-corrupt other items.

Corruption is the expansion's major mechanic addition.

## Item Stacking Math

Most items are **linear**:
- Soldier's Syringe: +15% per stack, no cap. 20 stacks = +300% attack speed.
- Paul's Goat Hoof: +14% move speed per stack.
- Tougher Times: 15% first stack; hyperbolic scaling — 2 stacks = 28% block chance, 10 stacks = 78%, cap 100%.

Some items use **hyperbolic scaling** to prevent 100% (dodge, crit):
```
effect = base / (base + stacks^-1) — no, simpler:
effect = 1 - 1/(1 + stacks * per_stack)
```

Example: Hopoo Feather (jump) — linear; each stack adds 1 extra jump. 20 Hopoo = 21 jumps.

## Printers

Special machines:
- **Duplicator** (white/green/red/boss): convert 1 item of listed tier into a specific item.
- **Cauldron** (printer variant): convert N low-tier items into 1 higher-tier item.

This lets players "launder" unwanted items into build-specific keystones.

## Scrappers

- **Scrapper** (per tier): convert a held item into "Scrap" (a generic placeholder item of that tier).
- Scrap itself has no effect — but duplicators prefer to consume scrap over meaningful items.

This is the "clean up junk" mechanic.

## Chests & Drop Rates

| Chest | Cost (stage 1) | Item tier rolls |
|---|---:|---|
| Small chest | 25 gold | 80% common / 20% uncommon |
| Large chest | 50 gold | 80% uncommon / 20% legendary |
| Legendary chest | 400 gold | 80% legendary / 20% boss |
| Adaptive chest | 25 gold | damage resistance reward |
| Equipment barrel | 25 gold | equipment roll |
| Multishop | 25–50 gold | 3 options, open one |
| Lunar pod | 1 Lunar Coin | 1 lunar item |

Prices scale with difficulty meter, not just stage.

## Item Synergies

The game's design lets items combine into absurd loops:

- **Kjaro's Band + Runald's Band + Wungus + ...**: proc chain damage.
- **Ukelele** (chain lightning) + **AtG Missile** (rocket) + **Will-o-the-wisp** (fire) + crit → "Proc chain" that hits 5+ items per hit.
- **Ceremonial Dagger + on-kill items**: every kill triggers a cascade.
- **Bands (Kjaro/Runald) + crit + attack speed**: blow up rooms.

These emergent combos drive the "what if" experimentation.

## Item Rarity Tuning

Item rarity is **per-pickup roll**, not global. Each chest rolls independently.

Weighted by:
- Chest tier.
- Item unlock progress (locked items don't drop).
- "Command" artifact (hand-pick instead of rolling; degrades randomness).

## Data Model

```csharp
[CreateAssetMenu(menuName = "RoR2/Item")]
public class ItemDefinition : ScriptableObject {
    public string Id;
    public ItemTier Tier;                  // Common, Uncommon, Legendary, Boss, Lunar, Equipment, Void
    public ItemCategory Category;          // Damage, Utility, Healing, OnKill, OnHit, Movement
    public bool IsVoidCorruption;
    public ItemRef VoidOriginal;           // for void items, what they corrupt
    public Mesh InventoryModel;
    public List<TriggerHookDefinition> Triggers;
    public EffectGraph Effect;
    public LocalizedString Description;
    public float[] StackValues;            // per-stack effect scaling
}
```

Triggers are event-driven: `OnHit`, `OnKill`, `OnTakeDamage`, `PerSecond`, `OnEnterStage`, `OnTeleporterActivate`.

## Balance Philosophy

- **No item is bad**: every item fits some build.
- **But some are "pickup priority"**: Soldier's Syringe > monster tooth in most builds.
- **Legendaries shape runs**: finding a Ceremonial Dagger changes your entire kill priority.

Hopoo's design ethic: **more items more fun** > perfect balance. Too many legendaries on the floor? That's a good run. Not a bug.

## Testing

- Every item applies its effect correctly at stack counts 1, 10, 100.
- Hyperbolic-scaling items never exceed their cap.
- Proc chain items don't infinite-loop (cap recursion depth).
- Void corruption replaces all stacks of original + future pickups.
- Co-op: item visual inventory syncs across clients.
- Drop weighting respects locked items.
