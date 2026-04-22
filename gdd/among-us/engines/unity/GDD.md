---
id: among-us
title: Among Us — Unity Implementation
version: 0.1.0
description: Unity implementation overlay for Among Us — 2D top-down social deduction with host-authoritative networking.
tags: [unity, 2d, multiplayer, mobile, cross-platform]
---

# Among Us — Unity Implementation

Engine overlay for Among Us. See [base GDD](../../GDD.md).

> Among Us is built in Unity (as shipped by Innersloth). This doc describes a reconstruction-friendly Unity 2022.3 LTS architecture.

## Target

- **Unity**: 2022.3 LTS (original shipped on older Unity versions).
- **Render**: URP 2D or built-in 2D for small install size.
- **Input**: New Input System (keyboard + mouse + touch + gamepad).
- **Platforms**: iOS, Android, PC (Steam, Epic), Xbox, PlayStation, Switch.
- **Target fps**: 60 (30 on low-end mobile).
- **Install size**: <500MB (mobile-critical).

## Packages

| Package | Purpose |
|---|---|
| `com.unity.render-pipelines.universal` | 2D URP |
| `com.unity.inputsystem` | Cross-platform input |
| `com.unity.netcode.gameobjects` (NGO) | Networking |
| `com.unity.services.multiplayer` | Relay + lobby (if via UGS) |
| `com.unity.purchasing` | IAP (ad-free, cosmetics) |
| `com.unity.ads` | Mobile ads |
| `com.unity.addressables` | Cosmetic streaming |
| `com.unity.localization` | Multi-language |
| `com.unity.analytics` | Engagement metrics |

## Architecture

### Host-Authoritative Networking

The host client owns simulation state; other clients are input-forwarders + visualization. Host-migration if host disconnects (best-effort).

```csharp
public class GameHost : NetworkBehaviour {
    public MatchState Match;
    public List<PlayerState> Players;
    public SabotageState Sabotage;
    
    [ServerRpc(RequireOwnership = false)]
    public void KillServerRpc(ulong killerClientId, ulong victimClientId) {
        var killer = GetPlayer(killerClientId);
        var victim = GetPlayer(victimClientId);
        if (!killer.CanKill(victim, Match.KillCooldown)) return;
        victim.IsDead = true;
        victim.BodyPosition = victim.Position;
        killer.KillCooldown = Match.KillCooldown;
        BroadcastDeathClientRpc(victimClientId);
    }
    
    [ClientRpc]
    void BroadcastDeathClientRpc(ulong victimId) { /* fx only */ }
}
```

No dedicated server — peer-to-peer with host elected. Relay server (e.g., Unity Relay, Photon) for NAT traversal only; no authoritative logic there.

### Match Flow

```csharp
public enum MatchPhase {
    Lobby,
    RoleAssignment,
    Active,
    Meeting,
    VoteResolve,
    Results,
}

public class MatchController : NetworkBehaviour {
    public NetworkVariable<MatchPhase> Phase = new(MatchPhase.Lobby);
    public NetworkList<PlayerState> Players;
    
    public void StartMatch() {
        AssignRoles();
        AssignTasks();
        Phase.Value = MatchPhase.Active;
    }
    
    void AssignRoles() {
        var impostorCount = Config.ImpostorCount;
        var impostors = Players.Shuffled().Take(impostorCount);
        foreach (var p in Players) p.Role = impostors.Contains(p) ? Role.Impostor : Role.Crewmate;
    }
}
```

### Player State

```csharp
public struct PlayerState : INetworkSerializable {
    public ulong ClientId;
    public FixedString32Bytes Name;
    public Color32 BodyColor;
    public int HatId, SkinId, VisorId, PetId;
    public Role Role;
    public Vector2 Position;
    public bool IsDead;
    public bool IsDisconnected;
    public float KillCooldown;
    public NativeList<TaskAssignment> Tasks;
}
```

Only position + alive-state + cosmetics sync to clients. Tasks sync only to assigned player. Role sync only to fellow impostors.

### Movement

Client-predicted movement with host reconciliation:

```csharp
public class PlayerMovement : NetworkBehaviour {
    public float Speed => HostConfig.Speed;
    
    void Update() {
        if (!IsOwner) return;
        var input = ReadInput();
        var delta = input * Speed * Time.deltaTime;
        transform.Translate(delta);
        SubmitPositionServerRpc(transform.position);
    }
    
    [ServerRpc]
    void SubmitPositionServerRpc(Vector2 pos) {
        if (ValidateMove(pos)) SyncPositionClientRpc(OwnerClientId, pos);
    }
}
```

Simple since top-down 2D; no complex collision prediction.

### Vision System

```csharp
public class VisionController : MonoBehaviour {
    public float CrewVisionRadius = 5f;
    public float ImpostorVisionRadius = 15f;
    public Material VisionMask;
    
    void Update() {
        float radius = Player.Role == Role.Impostor ? ImpostorVisionRadius : CrewVisionRadius;
        if (Sabotage.Current == SabotageType.Lights && Player.Role != Role.Impostor)
            radius *= 0.5f;
        VisionMask.SetFloat("_Radius", radius);
    }
}
```

Shader-based fog-of-war; radial reveal around player + raycast blockers (walls).

### Tasks

Each task = prefab + ScriptableObject definition:

```csharp
[CreateAssetMenu(menuName = "AmongUs/Task")]
public class TaskDef : ScriptableObject {
    public string Id;
    public TaskCategory Category;    // Short, Long, Common, Visual
    public string RoomName;
    public float ExpectedDuration;
    public GameObject PanelPrefab;   // Minigame UI
}

public class TaskInstance {
    public TaskDef Def;
    public bool Completed;
    public float StartTime;
    
    public void OnComplete() {
        Completed = true;
        MatchController.Instance.IncrementTaskBarServerRpc();
    }
}
```

Minigames are self-contained UI panels (wire connection, card swipe, pattern match, etc.). Each minigame is a MonoBehaviour under its own Canvas.

### Sabotage

```csharp
public enum SabotageType { None, Lights, O2, Reactor, Comms, Doors }

public class SabotageController : NetworkBehaviour {
    public NetworkVariable<SabotageType> Current = new(SabotageType.None);
    public NetworkVariable<float> SabotageTimer = new(0);
    public NetworkVariable<Vector2Int> FixProgress = new(Vector2Int.zero);
    
    [ServerRpc(RequireOwnership = false)]
    public void TriggerSabotageServerRpc(SabotageType type, ulong callerId) {
        if (Players.Get(callerId).Role != Role.Impostor) return;
        if (Current.Value != SabotageType.None) return;
        Current.Value = type;
        SabotageTimer.Value = type.GetDuration();
    }
    
    [ServerRpc(RequireOwnership = false)]
    public void ProgressFixServerRpc(int terminalIndex) {
        var fp = FixProgress.Value;
        if (terminalIndex == 0) fp.x = 1;
        if (terminalIndex == 1) fp.y = 1;
        FixProgress.Value = fp;
        if (Current.Value.RequiresDualFix() && fp.x == 1 && fp.y == 1) ResolveSabotage();
        else if (!Current.Value.RequiresDualFix()) ResolveSabotage();
    }
}
```

### Meeting System

```csharp
public class MeetingController : NetworkBehaviour {
    public NetworkVariable<float> DiscussionTimer;
    public NetworkVariable<float> VotingTimer;
    public NetworkList<VoteRecord> Votes;
    
    public void StartMeeting(ulong reporterId, ulong? bodyId) {
        MatchController.Instance.Phase.Value = MatchPhase.Meeting;
        DiscussionTimer.Value = Config.DiscussionSeconds;
        TeleportAllToMeetingTableClientRpc();
    }
    
    [ServerRpc(RequireOwnership = false)]
    public void CastVoteServerRpc(ulong voterId, long targetId) {
        Votes.Add(new VoteRecord { Voter = voterId, Target = targetId });
        if (Votes.Count >= GetAliveCount()) ResolveVote();
    }
    
    void ResolveVote() {
        var tally = Votes.GroupBy(v => v.Target).ToDictionary(g => g.Key, g => g.Count());
        var top = tally.OrderByDescending(kv => kv.Value).First();
        var tie = tally.Count(kv => kv.Value == top.Value) > 1;
        if (!tie && top.Key >= 0) EjectPlayer((ulong)top.Key);
        CheckWinCondition();
        MatchController.Instance.Phase.Value = MatchPhase.Active;
    }
}
```

### Chat

```csharp
public class ChatController : NetworkBehaviour {
    [ServerRpc(RequireOwnership = false)]
    public void SendMessageServerRpc(FixedString128Bytes msg, ulong senderId) {
        if (MatchController.Phase != MatchPhase.Meeting) return;
        if (Players.Get(senderId).IsDead) return;
        BroadcastMessageClientRpc(msg, senderId);
    }
}
```

Profanity filter applied client-side and server-side. Quick-chat preset strings avoid keyboard entry on mobile.

### Cosmetics

```csharp
[CreateAssetMenu(menuName = "AmongUs/Hat")]
public class HatDef : ScriptableObject {
    public string Id;
    public Sprite FrontSprite, BackSprite;
    public Vector2 AttachOffset;
    public CosmicubeId ContainedIn;
}
```

Addressables-stream cosmetic sprites. Players own cosmetic list stored server-side (or local on offline mode).

### Input

```csharp
public class ContextActionController : MonoBehaviour {
    public ContextAction Current;
    
    void Update() {
        Current = ResolveContextAction();  // Use, Kill, Report, Vent, Sabotage
        UI.UpdateButton(Current);
    }
    
    ContextAction ResolveContextAction() {
        if (NearBody) return ContextAction.Report;
        if (Role == Role.Impostor && OnVent) return ContextAction.Vent;
        if (Role == Role.Impostor && NearVictim && KillReady) return ContextAction.Kill;
        if (NearTaskPanel) return ContextAction.Use;
        return ContextAction.None;
    }
}
```

One dynamic button handles all interactions. Input binding on PC: E / Space / Mouse. Mobile: touch.

## Data Layout

```
Assets/
  _Project/
    Art/
      Maps/
        Skeld/
        Mira/
        Polus/
        Airship/
        Fungle/
      Characters/
        BodyColors/
        Hats/
        Skins/
        Visors/
        Pets/
      UI/
    Audio/
      Music/
      SFX/
    Data/
      Tasks/              # TaskDef SOs
      Maps/               # MapDef SOs (rooms + vents)
      Cosmetics/          # HatDef, SkinDef, etc.
      Cosmicubes/
      GameModes/          # Classic, Hide-n-Seek, Roles
    Prefabs/
      Player/
      TaskPanels/
      NetworkRoot/
    Scenes/
      Lobby.unity
      Map_Skeld.unity
      Map_Mira.unity
      Map_Polus.unity
      Map_Airship.unity
      Map_Fungle.unity
    Scripts/
      Gameplay/
      Tasks/
      Sabotage/
      Meeting/
      Cosmetics/
      Net/
      UI/
      Input/
```

## UI

Canvas-based (UGUI):
- Task list HUD.
- Sabotage menu (impostor).
- Minimap overlay.
- Meeting screen (avatars + vote buttons).
- Chat log.
- Lobby / character customization screen.

Localized via TextMeshPro + Unity Localization.

## Performance

- Target install <500MB (mobile).
- Sprite atlases per map.
- Addressables for cosmetic DLC.
- LOD not needed (flat 2D).
- Network budget: ~10 KB/s typical (host→clients), bursty on meeting teleport.

## Anti-Cheat

Light:
- Host-authoritative critical actions (kill, vote, task completion).
- Kill range + cooldown validated server-side.
- Task completion validated via panel-open + duration checks.
- Client modifications possible but limited impact (host is truth).

Server-side moderation for toxic behavior (chat filters, reports).

## Mobile Specifics

- Touch joystick (bottom-left).
- Context button (bottom-right).
- Task panel full-screen on tap.
- Vertical orientation locked in gameplay; landscape only.
- Ads (interstitial between matches) for free-tier.
- IAP flow via native billing.

## Cross-Platform

- Shared progression across platforms (account-linked).
- Cross-play opt-in lobbies.
- Input-agnostic UX; no input advantage.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Social Deduction Design](../../references/social-deduction-design.md)
- [Map Design](../../references/map-design.md)
