# Systems → Scripts Map — Flappy Bird (Cocos2d)

Maps each gameplay system to Cocos2d-iPhone classes / methods. Structure assumes an Objective-C implementation following Cocos2d v2 conventions. Cocos2d-x equivalents use the same scene graph / method semantics with C++ syntax.

## File Layout

```
Classes/
├── AppDelegate.{h,m}              # Framework bootstrap
├── Scenes/
│   ├── MainMenuScene.{h,m}        # Title
│   ├── GameScene.{h,m}            # Gameplay
│   └── GameOverLayer.{h,m}        # Score overlay
├── Entities/
│   ├── Bird.{h,m}                 # Bird sprite + physics
│   ├── Pipe.{h,m}                 # Pipe pair
│   ├── Ground.{h,m}               # Scrolling ground
│   └── Background.{h,m}           # Parallax sky/buildings
├── Managers/
│   ├── AudioManager.{h,m}         # SFX wrapper
│   └── ScoreManager.{h,m}         # Best score persistence
└── Support/
    ├── Constants.h                # Tuning values
    └── GameState.h                # Enum state

Resources/
├── sprites/atlas.{plist,png}
├── audio/sfx_*.wav
└── fonts/flappy-font.fnt
```

## Scenes

| Scene | File | Role |
|---|---|---|
| `MainMenuScene` | `MainMenuScene.m` | Title screen; tap to start → GameScene |
| `GameScene` | `GameScene.m` | Main gameplay; owns all entities |
| `GameOverLayer` | `GameOverLayer.m` | End-of-run overlay (child of GameScene) |

Navigation:
```
AppDelegate
    [CCDirector runWithScene: MainMenuScene]
                    ↓ (tap)
             GameScene
                    ↓ (game over)
             GameOverLayer (added as child)
                    ↓ (restart tap)
             GameScene (new instance)
```

## Entities

### Bird

| Property / Method | Purpose |
|---|---|
| `vy` (CGFloat) | Vertical velocity |
| `alive` (BOOL) | If false, ignores flap + physics |
| `flap` | Set vy to JUMP_VELOCITY; play sound |
| `update:(CCTime)dt` | Apply gravity; clamp velocity; update position; rotate sprite |
| `startFlapAnimation` | CCRepeatForever wing-cycle animation |
| `onDeath` | Stop flap animation; mark not alive; start rotation/tumble |

### Pipe

| Property / Method | Purpose |
|---|---|
| `scored` (BOOL) | Has this pipe awarded a point yet |
| `initWithGapY:(CGFloat)` | Create top + bottom pipe sprites with gap |
| `boundingBoxTop` | CGRect for top pipe collision |
| `boundingBoxBottom` | CGRect for bottom pipe collision |

### Ground

| Property / Method | Purpose |
|---|---|
| `scrollBy:(CGFloat)amount` | Translate; wrap offscreen back to end |

### Background

| Property / Method | Purpose |
|---|---|
| `scrollBy:(CGFloat)amount` | Slow-scroll via CCParallaxNode layer |
| `switchToNight` | Random: day/night background variant |

## Managers

### AudioManager

| Method | Purpose |
|---|---|
| `+sharedInstance` | Singleton access |
| `preloadAll` | Preload SFX via SimpleAudioEngine |
| `playSound:(NSString *)filename` | Play effect |

Sounds:
- `sfx_wing.wav` — flap
- `sfx_point.wav` — pipe pass
- `sfx_hit.wav` — collision
- `sfx_die.wav` — game-over
- `sfx_swoosh.wav` — UI

### ScoreManager

| Method | Purpose |
|---|---|
| `+bestScore` | Load from NSUserDefaults |
| `+setBestScore:` | Save to NSUserDefaults |
| `+medalForScore:` | Return bronze/silver/gold/platinum or nil |

## GameScene — Gameplay

| Property | Purpose |
|---|---|
| `_state` (GameState) | READY / PLAYING / DYING / DEAD |
| `_bird` | Bird entity |
| `_pipes` (NSMutableArray) | Active pipes |
| `_timeSinceLastPipe` | Spawn timer |
| `_score` | Current run score |
| `_scoreLabel` | CCLabelBMFont |

### Lifecycle Methods

| Method | Purpose |
|---|---|
| `init` | Build scene graph, register update, seed entities |
| `onEnter` | Register touch listener |
| `onExit` | Remove touch listener |
| `update:(CCTime)dt` | Master per-frame tick: bird, pipes, ground, background, collisions, scoring |

### Gameplay Methods

| Method | Purpose |
|---|---|
| `spawnPipe` | Create Pipe with random gap Y; add to scene + array |
| `updatePipes:(CCTime)dt` | Scroll all pipes left; remove offscreen |
| `checkCollisions` | Bird AABB vs pipe AABBs vs ground |
| `checkScore` | For each unscored pipe where bird has passed: +1 |
| `startGame` | READY → PLAYING; begin pipe spawning |
| `gameOver` | Stop gameplay; play hit SFX; schedule UI |
| `showGameOver` | Present GameOverLayer |

### Input Methods

| Method | Purpose |
|---|---|
| `ccTouchesBegan:withEvent:` | Dispatch tap to state: start / flap / restart |

## GameOverLayer — End Screen

| Property / Method | Purpose |
|---|---|
| `initWithScore:best:` | Lay out score + best + medal |
| `playSwooshIntro` | Slide-in animation |
| `onRestartTap` | Reload GameScene |

Layout:
- "Game Over" banner (top).
- Score card panel (mid).
- Medal sprite (animated flash).
- Current score + best score digits.
- "Play" button (CCMenuItemImage).
- "Scoreboard" button (CCMenuItemImage).

## Constants (`Constants.h`)

```objc
// World
extern const CGFloat WORLD_WIDTH;       // 288
extern const CGFloat WORLD_HEIGHT;      // 512
extern const CGFloat GROUND_HEIGHT;     // 112
extern const CGFloat GROUND_TOP_Y;      // 112

// Bird
extern const CGFloat BIRD_X;            // 72
extern const CGFloat BIRD_START_Y;      // 256
extern const CGFloat GRAVITY;           // 1600
extern const CGFloat FLAP_VELOCITY;     // -450
extern const CGFloat MAX_FALL_SPEED;    // 800

// Pipe
extern const CGFloat PIPE_WIDTH;        // 52
extern const CGFloat PIPE_GAP;          // 110
extern const CGFloat PIPE_SPEED;        // 150
extern const CGFloat PIPE_INTERVAL;     // 1.5
extern const CGFloat PIPE_MIN_GAP_Y;    // 180
extern const CGFloat PIPE_MAX_GAP_Y;    // 400

// Scoring
extern const int MEDAL_BRONZE_THRESHOLD; // 10
extern const int MEDAL_SILVER_THRESHOLD; // 20
extern const int MEDAL_GOLD_THRESHOLD;   // 30
extern const int MEDAL_PLATINUM_THRESHOLD; // 40
```

## State Enum (`GameState.h`)

```objc
typedef NS_ENUM(NSInteger, GameState) {
    GameStateReady = 0,    // Pre-first-tap; overlay visible
    GameStatePlaying,      // Active play
    GameStateDying,        // Collision happened; bird still falling
    GameStateDead          // Game over screen showing
};
```

## Collision Check Helpers

| Function | Purpose |
|---|---|
| `CGRectIntersectsRect(a, b)` | Stdlib AABB overlap |
| `nodeToParentTransform` | Convert child's local rect to parent space |
| `CGRectApplyAffineTransform` | Apply transform to rect |

For pipe collision, pipe's top/bottom sprites have transforms relative to Pipe node; apply to get world-space rects before testing against bird.

## Animation Tables

### Bird wing cycle

| Frame # | Sprite Frame |
|---|---|
| 0 | `bird0.png` |
| 1 | `bird1.png` |
| 2 | `bird2.png` |

Loop at 0.1s/frame = 10 FPS.

### Death tumble

CCRotateBy + CCMoveBy sequence:
```
CCRotateBy (duration 0.3, angle 720°)
CCMoveBy (duration 0.3, y to ground)
```

## Audio Trigger Points

| Event | Sound |
|---|---|
| Tap (flap) | sfx_wing.wav |
| Pipe passed | sfx_point.wav |
| Collision detected | sfx_hit.wav |
| Game-over screen | sfx_die.wav |
| UI transition | sfx_swoosh.wav |

## Typical Call Graph — Successful Pipe Pass

1. `update:dt` on GameScene tick.
2. `[_bird update:dt]` — gravity integrated; position updated.
3. `[self updatePipes:dt]` — each pipe scrolled left.
4. `[self checkCollisions]` — no hit.
5. `[self checkScore]`:
   - For Pipe P: `P.scored == NO` AND `_bird.position.x > P.position.x + PIPE_WIDTH` → TRUE.
   - `P.scored = YES`.
   - `_score++`.
   - `[AudioManager playSound:@"sfx_point.wav"]`.
   - `[self updateScoreLabel]`.

## Typical Call Graph — Collision

1. `update:dt` → `[_bird update:dt]` → bird's new position intersects a pipe.
2. `[self checkCollisions]` iterates pipes:
   - `CGRectIntersectsRect(birdBox, topPipeBox) == YES`.
3. `[self gameOver]`:
   - `_state = GameStateDying`.
   - `_bird.alive = NO`.
   - `[AudioManager playSound:@"sfx_hit.wav"]`.
   - White flash sprite fade-out.
   - `[self scheduleOnce:@selector(showGameOver) delay:0.5]`.
4. 0.5 seconds later: `[self showGameOver]`:
   - `_state = GameStateDead`.
   - `[AudioManager playSound:@"sfx_die.wav"]`.
   - `GameOverLayer` added as child.
   - Score + best + medal displayed.

## Cocos2d-x C++ Equivalents

Objective-C → C++ translation patterns:

| Objective-C | Cocos2d-x C++ |
|---|---|
| `CCScene *scene = [CCScene node]` | `Scene* scene = Scene::create()` |
| `CCSprite *s = [CCSprite spriteWithSpriteFrameName:@"x.png"]` | `Sprite* s = Sprite::createWithSpriteFrameName("x.png")` |
| `[self addChild:x z:0]` | `this->addChild(x, 0)` |
| `[self scheduleUpdate]` | `this->scheduleUpdate()` |
| `ccp(x, y)` | `Vec2(x, y)` |
| `[self runAction:a]` | `this->runAction(a)` |
| Touch event via dispatcher | `EventListenerTouchOneByOne::create()` |

## Platform Entry Points

### iOS (Cocos2d-iPhone)

```objc
// AppDelegate.m
- (BOOL)application:(UIApplication *)app didFinishLaunchingWithOptions:(NSDictionary *)opts {
    [CCDirector sharedDirector] setAnimationInterval:1.0/60.0];
    [[CCDirector sharedDirector] runWithScene:[MainMenuScene scene]];
    return YES;
}
```

### Android (Cocos2d-x)

- `AppActivity.java` (Java) extends `Cocos2dxActivity`.
- Launches JNI → C++ `AppDelegate::applicationDidFinishLaunching` → `Director::getInstance()->runWithScene(MainMenuScene::create())`.

## Persistence

| Data | Storage | Access |
|---|---|---|
| Best score | NSUserDefaults (iOS) / SharedPreferences (Android) | `[NSUserDefaults ... integerForKey:@"bestScore"]` |
| Game completed count | NSUserDefaults | Same pattern |
| Medals unlocked | NSUserDefaults (bitmask) | Same pattern |

## Dependency Graph

```
AppDelegate
    → MainMenuScene
        → GameScene
            → Bird
            → Pipe (x N)
            → Ground
            → Background
            → AudioManager (singleton)
            → GameOverLayer
                → ScoreManager (for best score)
                → AudioManager
```

No circular dependencies. Clean hierarchy.

## Testing (optional)

Cocos2d-iPhone has weak unit test support. Typical approach: extract pure logic out of CCNodes.

| Test | Covers |
|---|---|
| `testGravityIntegration` | Bird.update produces correct vy, y |
| `testFlapVelocity` | Bird.flap sets vy to JUMP_VELOCITY |
| `testPipeScoreDetection` | Bird x > pipe.x + PIPE_WIDTH triggers score |
| `testCollisionAABB` | CGRectIntersectsRect positive/negative cases |
| `testMedalThresholds` | scoreManager.medalForScore returns correct string |

These can run in XCTest without Cocos2d scene graph.

## Summary

Flappy Bird's code fits on one brain. The entire game is:

1. Scene with some nodes.
2. Bird: vy + gravity + tap→vy.
3. Pipes: spawn, scroll, collide, score.
4. Ground: scroll.
5. Audio on events.
6. NSUserDefaults for best score.

~500 lines total, a weekend of work, a legend of gaming.
