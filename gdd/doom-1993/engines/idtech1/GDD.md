---
id: doom-1993
title: DOOM (1993) — id Tech 1 Implementation
version: 0.1.0
description: Engine overlay for DOOM on id Tech 1 (Doom engine) — C, fixed-point math, BSP rendering, WAD data format, software rendering at 320×200.
tags: [idtech1, doom, c, bsp, software-renderer, fixed-point, dos, open-source]
---

# DOOM — id Tech 1 Implementation

Engine overlay for DOOM. See [base GDD](../../GDD.md).

> id Tech 1 (the Doom engine) is a software-renderer written in C for DOS. BSP tree traversal + column rendering + fixed-point math + visplane floor rendering = 2.5D illusion on 1993 hardware. Source was GPL'd in 1997; spawned 100+ ports.

## Target

- **Hardware (original)**: Intel 386 (recommended 486), 4 MB RAM, VGA 320×200 256-color, Sound Blaster (optional).
- **OS (original)**: MS-DOS 5.0+.
- **Rendering**: Software, 320×200, column-based.
- **Tic rate**: 35 tics/sec (fixed).
- **Language**: C (C89); some inline assembly for performance-critical loops (DOS only).
- **Code size**: ~40,000 lines of C.

## Stack

| Piece | Technology |
|---|---|
| Language | C89 |
| Renderer | Software (BSP + column rasterizer + visplanes for floors/ceilings) |
| Math | 16.16 fixed-point |
| Platform I/O | DOS/BIOS direct access (VGA, sound, keyboard, mouse) |
| Network | IPX packet driver (DOS TSRs); serial / modem via DOS |
| Data | WAD file format (lump-based archive) |
| Sound | DMX sound library (Paul Radek) |
| Music | MUS format (id) played via OPL2/OPL3 FM synthesis |

Modern source ports (Chocolate Doom, GZDoom, dsda-doom) re-target this to SDL2/OpenGL/Vulkan + 64-bit C/C++.

## Source Tree (linuxdoom-1.10, released 1997)

```
linuxdoom-1.10/
├── am_map.c/h          # Automap
├── d_main.c/h          # Main loop, startup
├── d_net.c/h           # Network
├── f_finale.c/h        # End-game sequence
├── f_wipe.c/h          # Screen wipe transition
├── g_game.c/h          # Game state, save/load
├── hu_lib.c/h          # HUD library
├── hu_stuff.c/h        # HUD
├── i_main.c/h          # Platform main (Linux)
├── i_net.c/h           # Network I/O
├── i_sound.c/h         # Sound output
├── i_system.c/h        # Platform abstraction
├── i_video.c/h         # Video output
├── info.c/h            # Thing/state tables
├── m_argv.c/h          # Command-line args
├── m_bbox.c/h          # Bounding box math
├── m_cheat.c/h         # Cheat codes
├── m_fixed.c/h         # Fixed-point math
├── m_menu.c/h          # Menu
├── m_misc.c/h          # Misc utils
├── m_random.c/h        # RNG (lookup table)
├── m_swap.c/h          # Byte swap
├── p_ceilng.c          # Ceiling movement
├── p_doors.c           # Doors
├── p_enemy.c           # Monster AI
├── p_floor.c           # Floor movement
├── p_inter.c           # Item pickup, damage
├── p_lights.c          # Light flicker
├── p_local.h           # Gameplay header
├── p_map.c             # Movement + collision
├── p_maputl.c          # Map utility
├── p_mobj.c            # Map objects (things)
├── p_plats.c           # Platforms / lifts
├── p_pspr.c            # Player sprites (weapons)
├── p_saveg.c           # Save game
├── p_setup.c           # Map load
├── p_sight.c           # Line of sight
├── p_spec.c            # Special sectors
├── p_switch.c          # Switch textures
├── p_telept.c          # Teleporters
├── p_tick.c            # Game logic tic
├── p_user.c            # Player logic
├── r_bsp.c             # BSP renderer
├── r_data.c            # Render data
├── r_draw.c            # Low-level drawing
├── r_main.c            # Renderer main
├── r_plane.c           # Visplanes (floors/ceilings)
├── r_segs.c            # Wall segments
├── r_sky.c             # Sky rendering
├── r_things.c          # Sprites (actors)
├── s_sound.c           # Sound logic
├── sounds.c            # Sound table
├── st_lib.c            # Status bar library
├── st_stuff.c          # Status bar
├── tables.c            # Sin/cos/tan tables (precomputed)
├── v_video.c           # Video buffer
├── w_wad.c             # WAD file I/O
├── wi_stuff.c          # Intermission screens
├── z_zone.c            # Zone memory allocator
```

## Fixed-Point Math

All position, velocity, angle math uses 16.16 fixed-point integers:

```c
typedef int fixed_t;  // 16 integer bits, 16 fractional bits

#define FRACBITS   16
#define FRACUNIT   (1 << FRACBITS)

// Multiply two fixed-point numbers
fixed_t FixedMul(fixed_t a, fixed_t b) {
    return ((long long)a * b) >> FRACBITS;
}

// Divide
fixed_t FixedDiv(fixed_t a, fixed_t b) {
    if ((abs(a) >> 14) >= abs(b))
        return (a ^ b) < 0 ? INT_MIN : INT_MAX;
    return ((long long)a << FRACBITS) / b;
}
```

No floating-point anywhere. Hardware FPUs weren't universal in 1993 (486SX lacked FPU; 486DX had it).

## Angles as 32-bit ints

```c
typedef unsigned angle_t;  // 0-2^32; wraps cleanly as unsigned
#define ANG45   0x20000000
#define ANG90   0x40000000
#define ANG180  0x80000000
#define ANG270  0xC0000000
```

Sin/cos lookup via fixed 8192-entry tables (tables.c).

## Game Loop

```c
while (!quit) {
    D_Display();           // Render frame
    
    if (gametic > oldgametic) {
        G_Ticker();        // Run game logic for each tic since last display
        oldgametic = gametic;
    }
    
    D_RunFrame();          // Wait for next tic
}
```

Display runs at whatever speed hardware allows; game logic runs at exactly 35 tics/sec.

### Ticker

```c
void G_Ticker() {
    // Poll input commands from all players (network sync)
    for (int i = 0; i < MAXPLAYERS; i++)
        if (playeringame[i])
            G_BuildTiccmd(&netcmds[i]);
    
    // Advance simulation
    P_Ticker();  // Run all map objects (monsters, projectiles, etc.)
    S_UpdateSounds(players[consoleplayer].mo);
    HU_Ticker();
    ST_Ticker();
    AM_Ticker();
    WI_Ticker();
}
```

## BSP Rendering

### BSP Tree

- Precomputed at map-build time.
- Binary space partition: recursively splits map along linedefs into "sectors" of space.
- Each leaf (sub-sector) is convex.
- Rendering: traverse tree front-to-back; draw walls in each sub-sector.

### Renderer Pass

```c
void R_RenderPlayerView(player_t *player) {
    R_SetupFrame(player);     // Camera position, angle, FOV
    R_ClearClipSegs();         // Reset clip buffers
    R_ClearDrawSegs();
    R_ClearPlanes();           // Reset visplanes
    R_ClearSprites();
    
    R_RenderBSPNode(numnodes - 1);  // Traverse BSP tree from root
    
    R_DrawPlanes();            // Draw floor/ceiling visplanes
    R_DrawMasked();            // Draw sprites + masked textures
}
```

### R_RenderBSPNode (recursive)

```c
void R_RenderBSPNode(int bspnum) {
    if (bspnum & NF_SUBSECTOR) {
        R_Subsector(bspnum & ~NF_SUBSECTOR);  // Leaf
        return;
    }
    
    node_t *bsp = &nodes[bspnum];
    int side = R_PointOnSide(viewx, viewy, bsp);
    
    R_RenderBSPNode(bsp->children[side]);     // Near side first
    
    if (R_CheckBBox(bsp->bbox[side ^ 1]))     // Far side visible?
        R_RenderBSPNode(bsp->children[side ^ 1]);
}
```

### Column Renderer

Each visible wall segment is drawn as vertical columns of pixels:

```c
void R_DrawColumn() {
    // For each screen Y:
    //   Look up texel in wall texture based on (x, y) → texture V coordinate
    //   Map via lighting/colormap lookup
    //   Write to framebuffer
}
```

Highly optimized loop; inner loop was often rewritten in x86 assembly.

### Visplanes

Floors and ceilings of each sector are rendered as "visplanes":

- Visplane: represents one contiguous flat surface at one light level + one texture.
- Scan-line converted row-by-row.
- Hard limit 128 per frame; exceeding = crash (classic Doom limitation).

### Sprite Rendering

- Sprites (monsters, items) drawn last with per-column depth test.
- Billboards always face camera.
- 8 rotation frames per animation state (front, front-right, right, etc.).

## WAD File I/O

```c
typedef struct {
    char        identification[4];  // "IWAD" or "PWAD"
    int         numlumps;
    int         infotableofs;       // Offset to directory
} wadinfo_t;

typedef struct {
    int         filepos;
    int         size;
    char        name[8];            // Lump name, null-terminated max 8 chars
} filelump_t;

// Loaded lumps table
extern lumpinfo_t *lumpinfo;
extern int numlumps;

void *W_CacheLumpName(const char *name, int tag) {
    int lump = W_GetNumForName(name);
    return W_CacheLumpNum(lump, tag);
}

// Load and pin a lump in zone memory
void *W_CacheLumpNum(int lump, int tag) {
    if (!lumpcache[lump]) {
        byte *ptr = Z_Malloc(lumpinfo[lump].size, tag, &lumpcache[lump]);
        W_ReadLump(lump, ptr);
    }
    return lumpcache[lump];
}
```

### Multi-WAD stack

- IWAD loaded first (doom.wad / doom2.wad).
- PWAD(s) loaded after via `-file`; overrides IWAD entries with same name.
- Z_Malloc handles memory; Z_Free when lump evicted.

## Zone Memory Allocator

Custom heap allocator:

```c
typedef struct memblock_s {
    int         size;
    void       **user;          // Ptr-to-ptr (set to 0 when freed)
    int         tag;            // PU_STATIC, PU_LEVEL, PU_PURGELEVEL
    int         id;             // Sentinel
    struct memblock_s *next, *prev;
} memblock_t;

// Tags:
// PU_STATIC - forever (game engine data)
// PU_SOUND - sound effect (purgable when needed)
// PU_MUSIC - music track
// PU_DAVE - misc dave
// PU_LEVEL - freed when level unloaded
// PU_LEVSPEC - level special (lights, effects)
// PU_CACHE - cached data (purgable)
// PU_PURGELEVEL - lowest priority, purged first
```

Purged lumps: when heap full, system frees lowest-tag blocks.

## Monster AI (finite state machine)

Each monster has an `mobj_t` with a state pointer:

```c
typedef struct {
    fixed_t     x, y, z;
    angle_t     angle;
    spritenum_t sprite;      // Which sprite
    int         frame;       // Which frame
    
    mobjinfo_t *info;        // Type-specific info (HP, speed, radius, etc.)
    state_t    *state;       // Current FSM state
    int         tics;        // Tics remaining before state transition
    
    int         health;
    int         target;      // Target mobj (player or monster)
    // ...
} mobj_t;

typedef struct {
    spritenum_t sprite;
    int         frame;
    int         tics;        // How long in this state
    actionf_t   action;      // Callback (A_Look, A_Chase, A_PosAttack, etc.)
    statenum_t  nextstate;
    int         misc1, misc2;
} state_t;
```

State table (info.c) defines ~1000 states; transitions based on tics remaining.

### Action functions

Action function library (p_enemy.c):

- `A_Look` — idle; scan for player in sight.
- `A_Chase` — move toward target; pick attack when in range.
- `A_FaceTarget` — rotate toward target.
- `A_PosAttack` — zombieman pistol attack.
- `A_SPosAttack` — shotgun zombie attack.
- `A_CPosAttack` — chaingunner burst.
- `A_TroopAttack` — imp melee + fireball.
- `A_SargAttack` — demon bite.
- `A_HeadAttack` — cacodemon fireball.
- `A_BruisAttack` — baron of hell.
- `A_CyberAttack` — cyberdemon rocket.
- `A_SpidRefire` — spider mastermind sustained fire.
- `A_BFGSpray` — BFG tracer spawner.
- ...

## Map Objects

```c
// Spawn a mobj at (x,y,z)
mobj_t *P_SpawnMobj(fixed_t x, fixed_t y, fixed_t z, mobjtype_t type) {
    mobj_t *mobj = Z_Malloc(sizeof(mobj_t), PU_LEVEL, NULL);
    memset(mobj, 0, sizeof(mobj_t));
    
    mobjinfo_t *info = &mobjinfo[type];
    mobj->type = type;
    mobj->info = info;
    mobj->x = x;
    mobj->y = y;
    mobj->radius = info->radius;
    mobj->height = info->height;
    mobj->flags = info->flags;
    mobj->health = info->spawnhealth;
    mobj->state = &states[info->spawnstate];
    mobj->tics = mobj->state->tics;
    mobj->sprite = mobj->state->sprite;
    mobj->frame = mobj->state->frame;
    
    P_SetThingPosition(mobj);  // Place in sector + blockmap
    
    return mobj;
}
```

### P_MobjThinker

Per-tic update:

```c
void P_MobjThinker(mobj_t *mobj) {
    // Momentum integration
    if (mobj->momx | mobj->momy)
        P_XYMovement(mobj);
    
    // Gravity + falling
    if ((mobj->z != mobj->floorz) || mobj->momz)
        P_ZMovement(mobj);
    
    // State advance
    if (mobj->tics != -1) {
        mobj->tics--;
        if (!mobj->tics)
            P_SetMobjState(mobj, mobj->state->nextstate);
    }
}
```

## Collision

### Line collision

Ray-line intersection via P_PathTraverse:

```c
boolean P_PathTraverse(fixed_t x1, fixed_t y1, fixed_t x2, fixed_t y2,
                      int flags, boolean (*trav)(intercept_t *));
```

Walks blockmap cells intersected by line segment. For each blockmap cell, tests linedefs + things inside. Calls callback for each intersection.

### Player movement

```c
boolean P_TryMove(mobj_t *thing, fixed_t x, fixed_t y) {
    // Check target position; if floor step too high, block.
    if (!P_CheckPosition(thing, x, y))
        return false;
    
    // Unlink from old position
    P_UnsetThingPosition(thing);
    thing->floorz = tmfloorz;
    thing->ceilingz = tmceilingz;
    thing->x = x;
    thing->y = y;
    P_SetThingPosition(thing);
    
    return true;
}
```

## Weapon / Pspr

Player sprite (weapon overlay) is its own mini-FSM:

```c
typedef struct {
    state_t    *state;
    int         tics;
    fixed_t     sx, sy;     // Screen position (for bob / recoil)
} pspdef_t;

// Per-weapon state tables:
// S_PISTOL, S_PISTOL1, S_PISTOL2, S_PISTOL3, S_PISTOLFLASH
// Each advances through frames on tic timer; fires via action callback.

void A_FirePistol(player_t *player, pspdef_t *psp) {
    S_StartSound(player->mo, sfx_pistol);
    P_SetMobjState(player->mo, S_PLAY_ATK2);
    player->ammo[weaponinfo[player->readyweapon].ammo]--;
    
    P_SetPsprite(player, ps_flash, weaponinfo[player->readyweapon].flashstate);
    
    P_BulletSlope(player->mo);  // Auto-aim vertical angle
    P_GunShot(player->mo, !player->refire);  // Hitscan with spread if 2nd+ shot
}
```

## Sound

### DMX library

- Abstracts sound card (Sound Blaster, Roland, etc.).
- Loads .WAV lumps (actually custom DMX format).
- `I_StartSound` plays SFX at position.
- Distance attenuation + stereo separation per listener position.

### Music

- MUS format (id custom); similar to MIDI.
- Played via FM synthesis on OPL2/OPL3 (AdLib/Sound Blaster).
- MIDI soundtracks: BOBBY.MUS, DM2TTL.MUS, etc.

## Network

```c
typedef struct {
    int         id;              // Packet sequence
    int         gametic;         // Matches local tic
    ticcmd_t    cmds[MAXPLAYERS];
} netpacket_t;

typedef struct {
    signed char forwardmove;     // -50 to 50
    signed char sidemove;        // -50 to 50
    signed short angleturn;      // Absolute angle
    signed short consistancy;    // Checksum for desync detection
    byte         chatchar;       // Chat key
    byte         buttons;        // Fire, use, weapon change flags
} ticcmd_t;
```

### Broadcast pattern

```c
void NetUpdate() {
    // Build local ticcmd from input
    ticcmd_t cmd;
    G_BuildTiccmd(&cmd);
    
    // Send to all peers
    for (int p = 0; p < MAXPLAYERS; p++)
        if (p != consoleplayer && playeringame[p])
            I_SendPacket(p, build_packet(cmd));
    
    // Receive packets from peers
    while (I_HasPacket()) {
        netpacket_t pkt = I_GetPacket();
        memcpy(&netcmds[pkt.sender], &pkt.cmd, sizeof(ticcmd_t));
    }
    
    // When all players' commands received for next tic, advance
}
```

## RNG

```c
unsigned char rndtable[256] = {
    0x00, 0x08, 0x6D, 0xAF, 0x9B, 0xA7, ...  // Precomputed 256 bytes
};

int prndindex;

int P_Random() {
    prndindex = (prndindex + 1) & 0xff;
    return rndtable[prndindex];
}

int M_Random() {
    // Identical to P_Random but separate index (for game-state vs. aesthetic)
    static int rndindex = 0;
    rndindex = (rndindex + 1) & 0xff;
    return rndtable[rndindex];
}
```

Lookup table = perfect determinism across platforms (no RNG state drift). Entire game's randomness is fully seedable.

## Save Game

`P_SaveGame` serializes:
- Player state (health, ammo, weapons, position).
- All live mobj_t (via serialize state pointer as index).
- Linked things (targets, shooters, etc.) serialized by pointer → index → pointer.
- Sector light level, floor/ceiling heights.
- Active moving objects (platforms, doors, ceilings, floors).
- Active timers (door delays, light flickers).

Deterministic: load → simulation resumes identical.

## Modern Source Port Architecture (Chocolate Doom, dsda-doom)

- Retargeted to SDL2: video, sound, input, network UDP.
- Kept original fixed-point math for accuracy.
- Build on macOS / Linux / Windows / BSDs.
- Compile flags preserve vanilla limits (visplanes, savegame, etc.) or extend them.

### GZDoom / ZDoom

- C++ rewrite with:
  - Hardware OpenGL / Vulkan renderer (or keep software).
  - True 3D support (slopes, 3D floors via sector "thinking").
  - ZScript scripting for advanced mods.
  - Larger limits.

## Performance

Original Doom on 486DX2-66:
- 30-35 FPS typical in typical Doom maps.
- Dropped to 15-20 in visplane-heavy rooms (e.g., Nuclear Plant's large courtyard).
- Ceiling: visplane count + monster count.

## Build (original 1993, DOS)

- Watcom C compiler with DOS4GW extender.
- Made on NeXTSTEP workstations at id Software (Carmack's preference).
- Cross-compiled to DOS binary.
- Build system: custom Makefile.

## Build (modern source port)

```bash
# Chocolate Doom
git clone https://github.com/chocolate-doom/chocolate-doom.git
cd chocolate-doom
./autogen.sh
./configure
make
./src/chocolate-doom -iwad DOOM.WAD
```

Requires: SDL2, SDL2_mixer, SDL2_net.

## Testing

- Demo playback: record demo (-record) → replay (-playdemo).
- Deterministic sim means demo plays identically 30 years later.
- Community speedrun demos from 1994 still play perfectly on modern source ports.

## Total Complexity

- ~40,000 lines of C (linuxdoom-1.10).
- ~500 lines of x86 assembly (inner column renderer, blit).
- Modular architecture: rendering, game, network, sound, platform clearly separated.
- I_ prefix = platform-abstracted (portable later).
- R_ prefix = renderer.
- P_ prefix = playsim.
- G_ prefix = game state.
- D_ prefix = driver / main.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Combat Design](../../references/combat-design.md)
- [Map Design](../../references/map-design.md)
- [3Cs Spec](../../references/3c-spec.md)
- [Netcode](../../references/netcode.md)
