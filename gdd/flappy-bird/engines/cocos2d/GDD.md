---
id: flappy-bird
title: Flappy Bird — Cocos2d Implementation
version: 0.1.0
description: Engine overlay for Flappy Bird on Cocos2d — Dong Nguyen's reported framework. CCScene + CCNode scene graph, CCAction, CCPhysicsBody or custom vy integration, sprite sheets, simple collision.
tags: [cocos2d, cocos2d-x, mobile, ios, objective-c, 2d-sprite]
---

# Flappy Bird — Cocos2d Implementation

Engine overlay for Flappy Bird. See [base GDD](../../GDD.md).

> Dong Nguyen reportedly built Flappy Bird in Cocos2d (likely Cocos2d-iPhone, Objective-C). Cocos2d-x is the cross-platform C++ evolution. This overlay covers the Cocos2d idioms the game uses: scene graph, CCScene → CCLayer → CCSprite hierarchy, CCAction for animations, CCEventDispatcher for input, custom update for physics.

## Target

- **Runtime (original)**: iOS 5+ (circa 2013 iPhone 4 / 4S / 5).
- **Runtime (later Android)**: Android 4+.
- **Language (original)**: Objective-C.
- **Language (Cocos2d-x)**: C++11.
- **Rendering**: OpenGL ES 2.0.
- **Framerate target**: 60 FPS.
- **App size**: ~1-2 MB.
- **Frameworks (iOS)**: Cocos2d-iPhone 2.x, CoreGraphics, AudioToolbox, AVFoundation.

## Stack

| Piece | Technology |
|---|---|
| Rendering | Cocos2d (OpenGL ES wrapper) |
| Scene management | CCDirector + CCScene + CCLayer |
| Animation | CCAction (CCAnimation, CCSequence, CCRepeatForever) |
| Input | CCTouchDispatcher (cocos2d v2) / CCEventDispatcher (cocos2d-x v3+) |
| Audio | SimpleAudioEngine (CocosDenshion) |
| Physics | Manual; no Chipmunk / Box2D needed |
| Storage | NSUserDefaults / UserDefault (best score) |
| Ads | iAd + AdMob SDKs |

## Project Structure (Cocos2d-iPhone)

```
FlappyBird/
├── Classes/
│   ├── AppDelegate.h/.m
│   ├── MainMenuScene.h/.m       # Title screen
│   ├── GameScene.h/.m           # Actual gameplay
│   ├── GameOverScene.h/.m       # End screen (or layer atop GameScene)
│   ├── Bird.h/.m                # Bird entity
│   ├── Pipe.h/.m                # Pipe pair entity
│   ├── Ground.h/.m              # Scrolling ground
│   ├── Background.h/.m          # Parallax backgrounds
│   └── AudioManager.h/.m        # SFX wrapper
├── Resources/
│   ├── sprites/
│   │   ├── atlas.plist          # Sprite sheet
│   │   ├── atlas.png
│   ├── audio/
│   │   ├── sfx_wing.wav
│   │   ├── sfx_point.wav
│   │   ├── sfx_hit.wav
│   │   ├── sfx_die.wav
│   │   └── sfx_swoosh.wav
│   └── fonts/
│       └── flappy-font.fnt      # Bitmap font for digits
├── Info.plist
└── main.m
```

## Cocos2d Core Idioms

### CCDirector

Singleton managing rendering + scene stack:

```objc
[[CCDirector sharedDirector] runWithScene:[MainMenuScene scene]];
[[CCDirector sharedDirector] replaceScene:[CCTransitionFade transitionWithDuration:0.5f scene:[GameScene scene]]];
```

### CCScene / CCLayer / CCNode

Scene graph:

```
CCScene
└── CCLayer (e.g., GameScene)
    ├── Background (parallax)
    ├── Ground (scrolling)
    ├── PipeContainer
    │   ├── Pipe (pair)
    │   ├── Pipe (pair)
    │   └── ...
    ├── Bird
    ├── ScoreLabel
    └── UIOverlay
```

Each node has position, scale, rotation, anchor; children inherit transform.

### CCSprite

```objc
// Create sprite from atlas frame
CCSprite *bird = [CCSprite spriteWithSpriteFrameName:@"bird0.png"];
bird.position = ccp(72, 256);
[self addChild:bird z:10];
```

### CCAction

Declarative animation and movement:

```objc
// Flap animation: 3 frames looped
NSArray *frames = @[
    [CCSpriteFrameCache sharedSpriteFrameCache].spriteFrameByName(@"bird0.png"),
    [CCSpriteFrameCache sharedSpriteFrameCache].spriteFrameByName(@"bird1.png"),
    [CCSpriteFrameCache sharedSpriteFrameCache].spriteFrameByName(@"bird2.png"),
];
CCAnimation *anim = [CCAnimation animationWithSpriteFrames:frames delay:0.1f];
CCAnimate *animate = [CCAnimate actionWithAnimation:anim];
CCRepeatForever *flap = [CCRepeatForever actionWithAction:animate];
[bird runAction:flap];

// Scroll ground forever
CCMoveBy *move = [CCMoveBy actionWithDuration:2.0f position:ccp(-288, 0)];
CCPlace *reset = [CCPlace actionWithPosition:ccp(0, 0)];
CCSequence *seq = [CCSequence actions:move, reset, nil];
[ground runAction:[CCRepeatForever actionWithAction:seq]];
```

## Bird Entity

```objc
@interface Bird : CCSprite
@property (nonatomic) CGFloat vy;
@property (nonatomic) BOOL alive;
- (void)flap;
- (void)update:(CCTime)dt;
@end

@implementation Bird
- (id)init {
    self = [super initWithSpriteFrameName:@"bird0.png"];
    if (self) {
        self.alive = YES;
        self.vy = 0;
        self.anchorPoint = ccp(0.5, 0.5);
        [self startFlapAnimation];
    }
    return self;
}

- (void)flap {
    if (!self.alive) return;
    self.vy = -450.0f;  // Cocos2d Y points up; negative = jump in screen coords
    [[AudioManager sharedInstance] playSound:@"sfx_wing.wav"];
}

- (void)update:(CCTime)dt {
    if (!self.alive) return;
    
    self.vy += 1600.0f * dt;            // Gravity (downward)
    self.vy = MIN(self.vy, 800.0f);     // Terminal velocity
    
    CGFloat newY = self.position.y - self.vy * dt;  // Invert for Cocos2d screen coords
    self.position = ccp(self.position.x, newY);
    
    // Rotation
    CGFloat targetRotation = CLAMP(self.vy / 500.0f * 90.0f, -30.0f, 70.0f);
    self.rotation = targetRotation;
}
@end
```

(Note: Cocos2d Y-axis points up; Y increases going up. Gravity in world coords means negative Y change. Sign conventions vary in reconstructions.)

## Pipe Entity

```objc
@interface Pipe : CCNode
@property (nonatomic) BOOL scored;
- (id)initWithGapY:(CGFloat)gapY;
@end

@implementation Pipe
- (id)initWithGapY:(CGFloat)gapY {
    self = [super init];
    if (self) {
        CCSprite *top = [CCSprite spriteWithSpriteFrameName:@"pipe-green.png"];
        top.flipY = YES;
        top.anchorPoint = ccp(0, 0);
        top.position = ccp(0, gapY + PIPE_GAP / 2);
        [self addChild:top];
        
        CCSprite *bottom = [CCSprite spriteWithSpriteFrameName:@"pipe-green.png"];
        bottom.anchorPoint = ccp(0, 1);
        bottom.position = ccp(0, gapY - PIPE_GAP / 2);
        [self addChild:bottom];
        
        self.scored = NO;
    }
    return self;
}
@end
```

## Game Loop

```objc
@implementation GameScene {
    Bird *_bird;
    NSMutableArray *_pipes;
    CCTime _timeSinceLastPipe;
    int _score;
    GameState _state;
}

- (id)init {
    self = [super init];
    if (self) {
        [self setupBackground];
        [self setupGround];
        [self setupBird];
        [self setupPipes];
        [self setupScore];
        [self setupInput];
        
        _state = GameStateReady;
        
        [self scheduleUpdate];  // Register for per-frame update: call self.update(dt)
    }
    return self;
}

- (void)update:(CCTime)dt {
    if (_state == GameStateReady) return;
    if (_state == GameStateDead) return;
    
    [_bird update:dt];
    
    [self updatePipes:dt];
    [self updateGround:dt];
    [self checkCollisions];
    [self checkScore];
}

- (void)updatePipes:(CCTime)dt {
    _timeSinceLastPipe += dt;
    if (_timeSinceLastPipe > PIPE_INTERVAL) {
        [self spawnPipe];
        _timeSinceLastPipe = 0;
    }
    
    NSMutableArray *toRemove = [NSMutableArray array];
    for (Pipe *pipe in _pipes) {
        pipe.position = ccp(pipe.position.x - PIPE_SPEED * dt, pipe.position.y);
        if (pipe.position.x < -PIPE_WIDTH) {
            [toRemove addObject:pipe];
        }
    }
    for (Pipe *pipe in toRemove) {
        [pipe removeFromParent];
        [_pipes removeObject:pipe];
    }
}

- (void)checkCollisions {
    CGRect birdBox = [_bird boundingBox];
    for (Pipe *pipe in _pipes) {
        // Pipe has two sprites (top and bottom); test each
        for (CCSprite *part in pipe.children) {
            CGRect partBox = [part boundingBox];
            partBox = CGRectApplyAffineTransform(partBox, [pipe nodeToParentTransform]);
            if (CGRectIntersectsRect(birdBox, partBox)) {
                [self gameOver];
                return;
            }
        }
    }
    
    if (_bird.position.y < GROUND_TOP_Y) {
        [self gameOver];
    }
}

- (void)checkScore {
    for (Pipe *pipe in _pipes) {
        if (!pipe.scored && _bird.position.x > pipe.position.x + PIPE_WIDTH) {
            pipe.scored = YES;
            _score++;
            [[AudioManager sharedInstance] playSound:@"sfx_point.wav"];
            [self updateScoreLabel];
        }
    }
}

- (void)gameOver {
    _bird.alive = NO;
    _state = GameStateDying;
    [[AudioManager sharedInstance] playSound:@"sfx_hit.wav"];
    
    // Brief flash, then show game over UI
    CCSprite *flash = [CCSprite spriteWithTexture:
        [[CCTextureCache sharedTextureCache] addImage:@"whiteflash.png"]];
    flash.opacity = 255;
    [self addChild:flash z:100];
    [flash runAction:[CCFadeOut actionWithDuration:0.2f]];
    
    [self scheduleOnce:@selector(showGameOver) delay:0.5f];
}

- (void)showGameOver {
    _state = GameStateDead;
    [[AudioManager sharedInstance] playSound:@"sfx_die.wav"];
    
    int bestScore = [[NSUserDefaults standardUserDefaults] integerForKey:@"bestScore"];
    if (_score > bestScore) {
        [[NSUserDefaults standardUserDefaults] setInteger:_score forKey:@"bestScore"];
        bestScore = _score;
    }
    
    GameOverLayer *overlay = [[GameOverLayer alloc] initWithScore:_score best:bestScore];
    [self addChild:overlay z:200];
}
@end
```

## Input

### Cocos2d-iPhone v2

```objc
- (void)onEnter {
    [super onEnter];
    [[CCTouchDispatcher sharedDispatcher] addStandardDelegate:self priority:0];
}

- (void)onExit {
    [[CCTouchDispatcher sharedDispatcher] removeDelegate:self];
    [super onExit];
}

- (void)ccTouchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    if (_state == GameStateReady) {
        [self startGame];
    } else if (_state == GameStatePlaying) {
        [_bird flap];
    } else if (_state == GameStateDead) {
        [[CCDirector sharedDirector] replaceScene:[GameScene scene]];
    }
}
```

### Cocos2d-x v3+

```cpp
auto listener = EventListenerTouchOneByOne::create();
listener->onTouchBegan = [this](Touch* touch, Event* event) -> bool {
    if (state == STATE_READY) { startGame(); }
    else if (state == STATE_PLAYING) { bird->flap(); }
    else if (state == STATE_DEAD) { restartGame(); }
    return true;
};
_eventDispatcher->addEventListenerWithSceneGraphPriority(listener, this);
```

## Parallax Background

```objc
- (void)setupBackground {
    // Sky (static)
    CCSprite *sky = [CCSprite spriteWithSpriteFrameName:@"background-day.png"];
    sky.anchorPoint = ccp(0, 0);
    [self addChild:sky z:0];
    
    // Buildings: parallax layer, slow scroll
    CCParallaxNode *parallax = [CCParallaxNode node];
    CCSprite *buildings1 = [CCSprite spriteWithSpriteFrameName:@"buildings.png"];
    CCSprite *buildings2 = [CCSprite spriteWithSpriteFrameName:@"buildings.png"];
    [parallax addChild:buildings1 z:1 parallaxRatio:ccp(0.5, 0) positionOffset:ccp(0, 200)];
    [parallax addChild:buildings2 z:1 parallaxRatio:ccp(0.5, 0) positionOffset:ccp(288, 200)];
    [self addChild:parallax z:1];
}

- (void)updateParallax:(CCTime)dt {
    _parallax.position = ccp(_parallax.position.x - 30 * dt, _parallax.position.y);
    // Wrap when offscreen: reset to 0 when -288
}
```

## Ground (infinite scroll)

Use two ground sprites, move both left, teleport back when offscreen:

```objc
- (void)updateGround:(CCTime)dt {
    CGFloat scroll = GROUND_SPEED * dt;
    
    _groundA.position = ccp(_groundA.position.x - scroll, _groundA.position.y);
    _groundB.position = ccp(_groundB.position.x - scroll, _groundB.position.y);
    
    if (_groundA.position.x < -288) {
        _groundA.position = ccp(_groundB.position.x + 288, _groundA.position.y);
    }
    if (_groundB.position.x < -288) {
        _groundB.position = ccp(_groundA.position.x + 288, _groundB.position.y);
    }
}
```

## Score Display

Custom bitmap font for digits:

```objc
CCLabelBMFont *scoreLabel = [CCLabelBMFont labelWithString:@"0" fntFile:@"flappy-font.fnt"];
scoreLabel.position = ccp(144, 448);
[self addChild:scoreLabel z:100];

- (void)updateScoreLabel {
    [_scoreLabel setString:[NSString stringWithFormat:@"%d", _score]];
}
```

## Audio

```objc
@interface AudioManager : NSObject
+ (AudioManager *)sharedInstance;
- (void)playSound:(NSString *)filename;
@end

#import "SimpleAudioEngine.h"

@implementation AudioManager
+ (AudioManager *)sharedInstance {
    static AudioManager *instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[AudioManager alloc] init];
        [[SimpleAudioEngine sharedEngine] preloadEffect:@"sfx_wing.wav"];
        [[SimpleAudioEngine sharedEngine] preloadEffect:@"sfx_point.wav"];
        [[SimpleAudioEngine sharedEngine] preloadEffect:@"sfx_hit.wav"];
        [[SimpleAudioEngine sharedEngine] preloadEffect:@"sfx_die.wav"];
        [[SimpleAudioEngine sharedEngine] preloadEffect:@"sfx_swoosh.wav"];
    });
    return instance;
}

- (void)playSound:(NSString *)filename {
    [[SimpleAudioEngine sharedEngine] playEffect:filename];
}
@end
```

## Persistence

```objc
// Save best score
[[NSUserDefaults standardUserDefaults] setInteger:newBest forKey:@"bestScore"];
[[NSUserDefaults standardUserDefaults] synchronize];

// Load
int best = (int)[[NSUserDefaults standardUserDefaults] integerForKey:@"bestScore"];
```

## Medals

```objc
- (NSString *)medalImageForScore:(int)score {
    if (score >= 40) return @"medal-platinum.png";
    if (score >= 30) return @"medal-gold.png";
    if (score >= 20) return @"medal-silver.png";
    if (score >= 10) return @"medal-bronze.png";
    return nil;  // No medal
}
```

## Ad Integration

### iAd (Apple's deprecated framework used in 2013)

```objc
@interface AppDelegate () <ADBannerViewDelegate>
@property (nonatomic, strong) ADBannerView *bannerView;
@end

// In application:didFinishLaunching:
self.bannerView = [[ADBannerView alloc] init];
self.bannerView.delegate = self;
```

### AdMob (Google)

```objc
@import GoogleMobileAds;
self.bannerView = [[GADBannerView alloc] initWithAdSize:kGADAdSizeBanner];
self.bannerView.adUnitID = @"ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX";
```

Shown on game-over screen; removed during gameplay.

## Performance

- 60 FPS target on iPhone 4.
- Draw calls: minimal. Bird + ~10 pipes + ground + background = <20 draws.
- Sprite batch: atlas reduces draw calls further (all sprites from one atlas = 1 draw).
- Memory: <10 MB runtime.

## Build (Cocos2d-iPhone)

1. Xcode 5, iOS 5+ SDK.
2. Cocos2d-iPhone framework as dependency.
3. Link: Cocos2d, CocosDenshion, QuartzCore, OpenGLES, AudioToolbox.
4. Build → archive → upload to App Store Connect.

## Build (Cocos2d-x, modern)

```bash
cocos new FlappyBird -p com.example.flappybird -l cpp -d /projects
cd /projects/FlappyBird
# Add resources
cocos compile -p ios
cocos compile -p android
```

Supports iOS, Android, Windows, Mac, Linux — same codebase.

## Alternative Engines (Recreations)

| Engine | Notes |
|---|---|
| **Unity 2D** | Rigidbody2D + BoxCollider2D; easy prototype |
| **Godot** | KinematicBody2D + tilemap; free |
| **Phaser (JS)** | Excellent for browser Flappy Bird clones |
| **LÖVE2D (Lua)** | Minimal; popular for 2-hour game jams |
| **PyGame (Python)** | Educational; simple |
| **Raylib** | C / C++; <100 LOC possible |

## Total Code (Cocos2d-iPhone original-style)

- ~300-500 lines of Objective-C.
- ~10-20 resource files (sprites + sounds).
- Plus Cocos2d framework (external).

Still genuinely small. The game's simplicity translates directly to small code.

## References

- [Systems → Scripts Map](references/systems-to-scripts.md)
- [Design Analysis](../../references/design-analysis.md)
- [3Cs Spec](../../references/3c-spec.md)
