# Systems → Scripts Map — DOOM (id Tech 1)

Maps each gameplay system to the C files and functions in `linuxdoom-1.10` (the 1997 GPL source release). File prefixes carry meaning:

- **D_** driver / main / top-level.
- **G_** game state / save-load.
- **P_** playsim (physics, AI, interaction, map logic).
- **R_** renderer.
- **I_** platform-specific I/O (Interface).
- **M_** misc utilities / menu / math.
- **S_** sound logic.
- **W_** WAD I/O.
- **V_** video buffer.
- **Z_** zone memory allocator.
- **HU_ / ST_ / WI_ / F_ / AM_** HUD, status bar, intermission, finale, automap.

## Top-Level

| System | File | Key Functions |
|---|---|---|
| Main entry | `i_main.c` | `main()` — platform main, calls `D_DoomMain()` |
| Game startup | `d_main.c` | `D_DoomMain()`, `D_DoomLoop()` |
| Main game loop | `d_main.c` | `D_DoomLoop()` — while(!quit) { render; ticker; net } |
| Platform abstraction | `i_system.c/h` | `I_Init()`, `I_Quit()`, `I_GetTime()`, `I_Error()` |

## Game State

| System | File | Key Functions |
|---|---|---|
| Game globals | `d_main.c`, `doomstat.h` | `gamestate`, `gameaction`, `players[]`, `consoleplayer` |
| Tic driver | `g_game.c` | `G_Ticker()`, `G_BuildTiccmd()`, `G_PlayerFinishLevel()` |
| Game mode transitions | `g_game.c` | `G_InitNew()`, `G_DoNewGame()`, `G_LoadLevel()`, `G_DoCompleted()` |
| Level exit | `g_game.c` | `G_ExitLevel()`, `G_SecretExitLevel()` |
| Save / Load | `p_saveg.c` | `P_ArchivePlayers()`, `P_ArchiveWorld()`, `P_ArchiveThinkers()`, `P_UnArchive*()` |

## Playsim — Tic

| System | File | Key Functions |
|---|---|---|
| Per-tic sim | `p_tick.c` | `P_Ticker()` — runs all thinkers, player updates |
| Thinker list | `p_tick.c` | `P_AddThinker()`, `P_RemoveThinker()`, `P_RunThinkers()` |
| Player update | `p_user.c` | `P_PlayerThink()`, `P_MovePlayer()`, `P_CalcHeight()` |
| Mobj update | `p_mobj.c` | `P_MobjThinker()`, `P_SpawnMobj()`, `P_RemoveMobj()` |

## Playsim — Movement + Collision

| System | File | Key Functions |
|---|---|---|
| XY movement | `p_mobj.c` | `P_XYMovement()` |
| Z movement | `p_mobj.c` | `P_ZMovement()` (gravity, floor/ceiling clamp) |
| Try move | `p_map.c` | `P_TryMove()`, `P_CheckPosition()` |
| Path traversal | `p_maputl.c` | `P_PathTraverse()`, `P_BlockLinesIterator()`, `P_BlockThingsIterator()` |
| Line of sight | `p_sight.c` | `P_CheckSight()` |
| Radius attack (splash) | `p_map.c` | `P_RadiusAttack()` |
| Hitscan | `p_map.c` | `P_LineAttack()`, `P_AimLineAttack()`, `PTR_ShootTraverse()` |

## Playsim — Enemies (AI)

| System | File | Key Functions |
|---|---|---|
| Monster behavior | `p_enemy.c` | `A_Look()`, `A_Chase()`, `A_FaceTarget()` |
| Monster attacks | `p_enemy.c` | `A_PosAttack()`, `A_SPosAttack()`, `A_CPosAttack()`, `A_TroopAttack()`, `A_SargAttack()`, `A_HeadAttack()`, `A_BruisAttack()`, `A_SkullAttack()`, `A_CyberAttack()`, `A_SpidRefire()` |
| Boss specific | `p_enemy.c` | `A_BossDeath()`, `A_BrainAwake()`, `A_BrainSpit()`, `A_BrainScream()` |
| BFG spray | `p_enemy.c` | `A_BFGSpray()` |
| Sight / hearing | `p_enemy.c` | `P_LookForPlayers()`, `P_CheckMeleeRange()`, `P_CheckMissileRange()` |
| Movement direction | `p_enemy.c` | `P_Move()`, `P_NewChaseDir()` |

## Playsim — Interaction

| System | File | Key Functions |
|---|---|---|
| Item pickup | `p_inter.c` | `P_TouchSpecialThing()`, `P_GiveWeapon()`, `P_GiveAmmo()`, `P_GiveBody()`, `P_GiveArmor()` |
| Damage | `p_inter.c` | `P_DamageMobj()`, `P_KillMobj()` |
| Player death | `p_user.c`, `p_inter.c` | `P_DeathThink()`, `P_KillMobj()` |

## Playsim — Weapons (Player Sprite)

| System | File | Key Functions |
|---|---|---|
| Weapon FSM | `p_pspr.c` | `P_SetupPsprites()`, `P_SetPsprite()`, `P_MovePsprites()` |
| Fire actions | `p_pspr.c` | `A_FirePistol()`, `A_FireShotgun()`, `A_FireShotgun2()`, `A_FireCGun()`, `A_FireMissile()`, `A_FirePlasma()`, `A_FireBFG()` |
| Melee | `p_pspr.c` | `A_Punch()`, `A_Saw()` |
| Recharge logic | `p_pspr.c` | `A_ReFire()`, `A_CheckReload()` |
| Weapon switch | `p_user.c` | `P_BringUpWeapon()`, `P_DropWeapon()` |

## Playsim — Sectors / Specials

| System | File | Key Functions |
|---|---|---|
| Special sector effects | `p_spec.c` | `P_PlayerInSpecialSector()`, `P_UpdateSpecials()` |
| Doors | `p_doors.c` | `T_VerticalDoor()`, `EV_DoDoor()`, `EV_DoLockedDoor()` |
| Floors | `p_floor.c` | `T_MoveFloor()`, `EV_DoFloor()`, `EV_BuildStairs()` |
| Ceilings | `p_ceilng.c` | `T_MoveCeiling()`, `EV_DoCeiling()` |
| Platforms / Lifts | `p_plats.c` | `T_PlatRaise()`, `EV_DoPlat()` |
| Lights | `p_lights.c` | `T_LightFlash()`, `T_StrobeFlash()`, `T_Glow()` |
| Switches | `p_switch.c` | `P_ChangeSwitchTexture()`, `P_InitSwitchList()` |
| Teleport | `p_telept.c` | `EV_Teleport()` |

## Playsim — Map Loading

| System | File | Key Functions |
|---|---|---|
| Map setup | `p_setup.c` | `P_SetupLevel()` — loads all map lumps |
| Load vertexes | `p_setup.c` | `P_LoadVertexes()` |
| Load linedefs | `p_setup.c` | `P_LoadLineDefs()` |
| Load sidedefs | `p_setup.c` | `P_LoadSideDefs()` |
| Load sectors | `p_setup.c` | `P_LoadSectors()` |
| Load things | `p_setup.c` | `P_LoadThings()` — spawns mobjs |
| Load BSP | `p_setup.c` | `P_LoadNodes()`, `P_LoadSubsectors()`, `P_LoadSegs()` |
| Blockmap | `p_setup.c` | `P_LoadBlockMap()` |

## Renderer

| System | File | Key Functions |
|---|---|---|
| Main render | `r_main.c` | `R_RenderPlayerView()`, `R_SetupFrame()`, `R_Init()` |
| BSP traversal | `r_bsp.c` | `R_RenderBSPNode()`, `R_Subsector()`, `R_ClipPassWallSegment()` |
| Wall segments | `r_segs.c` | `R_StoreWallRange()`, `R_RenderSegLoop()` |
| Visplanes | `r_plane.c` | `R_ClearPlanes()`, `R_FindPlane()`, `R_DrawPlanes()`, `R_DrawSpan()` |
| Low-level column draw | `r_draw.c` | `R_DrawColumn()`, `R_DrawSpan()`, `R_DrawMaskedColumn()` |
| Sprites | `r_things.c` | `R_AddSprites()`, `R_DrawMasked()`, `R_DrawVisSprite()` |
| Data / textures | `r_data.c` | `R_GenerateComposite()`, `R_InitTextures()`, `R_CacheTexture()` |
| Sky | `r_sky.c` | `R_InitSkyMap()` |

## Math

| System | File | Key Functions |
|---|---|---|
| Fixed point | `m_fixed.c/h` | `FixedMul()`, `FixedDiv()` |
| RNG | `m_random.c` | `M_Random()`, `P_Random()`, `rndtable[]` |
| Bounding box | `m_bbox.c` | `M_ClearBox()`, `M_AddToBox()` |
| Trig tables | `tables.c` | `finesine[]`, `finecosine[]`, `finetangent[]`, `tantoangle[]` |
| Point to angle | `r_main.c` | `R_PointToAngle()`, `R_PointToAngle2()` |
| Point on side | `p_maputl.c` | `P_PointOnLineSide()`, `P_PointOnDivlineSide()` |

## WAD

| System | File | Key Functions |
|---|---|---|
| WAD load | `w_wad.c` | `W_InitMultipleFiles()`, `W_AddFile()` |
| Lump lookup | `w_wad.c` | `W_GetNumForName()`, `W_CheckNumForName()` |
| Lump read | `w_wad.c` | `W_ReadLump()`, `W_CacheLumpNum()`, `W_CacheLumpName()` |

## Memory

| System | File | Key Functions |
|---|---|---|
| Zone alloc | `z_zone.c` | `Z_Init()`, `Z_Malloc()`, `Z_Free()`, `Z_ChangeTag()`, `Z_FreeTags()` |

## Sound

| System | File | Key Functions |
|---|---|---|
| Sound manager | `s_sound.c` | `S_Init()`, `S_StartSound()`, `S_StartSoundAtVolume()`, `S_StopSound()` |
| Music | `s_sound.c` | `S_StartMusic()`, `S_ChangeMusic()`, `S_StopMusic()` |
| 3D audio | `s_sound.c` | `S_AdjustSoundParams()` — volume / stereo based on listener distance |
| Sound table | `sounds.c` | `S_sfx[]`, `S_music[]` |
| Platform sound | `i_sound.c` | `I_StartSound()`, `I_StopSound()`, `I_SoundIsPlaying()` |

## Network

| System | File | Key Functions |
|---|---|---|
| Net driver | `d_net.c` | `NetUpdate()`, `TryRunTics()`, `D_ArbitrateNetStart()` |
| Platform net | `i_net.c` | `I_InitNetwork()`, `I_NetCmd()` |

## Input

| System | File | Key Functions |
|---|---|---|
| Event queue | `d_main.c` | `D_ProcessEvents()`, `D_PostEvent()` |
| Player input | `g_game.c` | `G_BuildTiccmd()` — reads keys/mouse, writes ticcmd_t |
| Platform input | `i_system.c` | `I_GetEvent()` |

## HUD / Menu / UI

| System | File | Key Functions |
|---|---|---|
| HUD | `hu_stuff.c` | `HU_Init()`, `HU_Start()`, `HU_Ticker()`, `HU_Drawer()` |
| HUD lib | `hu_lib.c` | `HUlib_clearTextLine()`, `HUlib_addMessageToSText()` |
| Status bar | `st_stuff.c` | `ST_Init()`, `ST_Start()`, `ST_Ticker()`, `ST_Drawer()` |
| Status bar lib | `st_lib.c` | `STlib_initNum()`, `STlib_updateNum()` |
| Menu | `m_menu.c` | `M_Responder()`, `M_Drawer()`, `M_StartControlPanel()` |
| Cheat parser | `m_cheat.c` | `cht_CheckCheat()` — "iddqd" detector etc. |

## Intermission / Finale

| System | File | Key Functions |
|---|---|---|
| Intermission | `wi_stuff.c` | `WI_Start()`, `WI_Ticker()`, `WI_Drawer()` |
| Final screen | `f_finale.c` | `F_Start()`, `F_Ticker()`, `F_Drawer()` |
| Screen wipe | `f_wipe.c` | `wipe_StartScreen()`, `wipe_EndScreen()`, `wipe_ScreenWipe()` |

## Automap

| System | File | Key Functions |
|---|---|---|
| Automap | `am_map.c` | `AM_Start()`, `AM_Responder()`, `AM_Ticker()`, `AM_Drawer()` |

## Video

| System | File | Key Functions |
|---|---|---|
| Video buffer | `v_video.c` | `V_CopyRect()`, `V_DrawPatch()`, `V_DrawBlock()` |
| Platform video | `i_video.c` | `I_SetPalette()`, `I_FinishUpdate()`, `I_UpdateNoBlit()` |

## Info Tables

| System | File | Key Functions |
|---|---|---|
| Thing type table | `info.c` | `mobjinfo[]` — one entry per monster/item type |
| State table | `info.c` | `states[]` — sprite frame + tics + action + nextstate |
| Sprite name table | `info.c` | `sprnames[]` |

## Constants / Macros

| Header | Contents |
|---|---|
| `doomdef.h` | Game version, network version, episode/map constants |
| `doomtype.h` | boolean, byte, typedefs |
| `doomstat.h` | Global game state vars |
| `dstrings.h` | UI string constants ("You need a red key to activate this object") |
| `p_local.h` | Playsim internal headers |
| `r_local.h` | Renderer internal headers |
| `m_fixed.h` | `FRACBITS`, `FRACUNIT` |

## Typical Call Graph — Player Fires Shotgun

1. `G_BuildTiccmd()` (`g_game.c`) — detect fire button.
2. `P_Ticker()` → `P_PlayerThink()` (`p_user.c`) — process ticcmd.
3. `P_BringUpWeapon()` / `P_MovePsprites()` (`p_user.c`, `p_pspr.c`) — advance pspr state.
4. When FIRE frame: `A_FireShotgun()` (`p_pspr.c`).
   - `S_StartSound()` — shotgun bang.
   - `P_SetMobjState()` — player attack anim.
   - Deduct ammo from `player->ammo[am_shell]`.
   - `P_BulletSlope()` (`p_map.c`) — auto-aim vertical.
   - Loop × 7 pellets: `P_LineAttack()` (`p_map.c`) with random spread.
5. `P_LineAttack()` → `P_PathTraverse()` (`p_maputl.c`) — raycasts.
   - For each mobj hit: `P_DamageMobj()` (`p_inter.c`).
6. `P_DamageMobj()`:
   - Subtract from `target->health`.
   - If killed: `P_KillMobj()` (advance to death state).
   - If pain chance: `P_SetMobjState(target, info->painstate)`.

## Typical Call Graph — Monster Pathing

1. `P_RunThinkers()` (`p_tick.c`) — per-tic.
2. `P_MobjThinker()` (`p_mobj.c`) — advance mobj.
3. `mobj->state->action(mobj)` — e.g., `A_Chase()`.
4. `A_Chase()` (`p_enemy.c`):
   - Target check: `P_LookForPlayers()`.
   - Choose attack: `P_CheckMeleeRange()` / `P_CheckMissileRange()`.
   - Move: `P_Move()` → `P_TryMove()` (`p_map.c`).
   - Set new state if attack ready: `P_SetMobjState(mobj, info->missilestate)`.

## Modern Source Port Variants

| Port | Added Since |
|---|---|
| Chocolate Doom | Original vanilla w/ SDL2; limit-preserving; most-faithful |
| PrBoom+ | Extended limits; OpenGL optional |
| dsda-doom | Demo-synced; speedrunner-focused |
| ZDoom / GZDoom | Full modding extensions, ZScript, slopes, 3D floors, freelook |
| Eternity | Advanced features; Heretic/Hexen support |
| Doomsday / jDoom | Per-pixel lighting, models; highly modded |
| Zandronum | Modern multiplayer |

All share the base `p_*.c` / `r_*.c` architecture semantically, though some are C++ rewrites.
