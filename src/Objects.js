import React, { useEffect, useState, createContext, useContext } from 'react';
import { Container, TilingSprite, AnimatedSprite, Sprite } from 'pixi.js';
import { asyncSetupSprites, usePixiApp } from './pixiUtils';
import source from './assets/spritesheet.png';
import sprites from './assets/sprites';

const objectContext = createContext();
const SCALE = 1;
const GROUND_HEIGHT = 100 * SCALE;
const PLAYERFALLSPEED = 8 * SCALE;
const PLAYERHORIZONTALPOSITION = 100 * SCALE;
const PLAYERVERTICALPOSITION = 200 * SCALE;
const PLAYERMAXVELOCITY = -3 * SCALE;
const PIPEWIDTH = 80 * SCALE;
const PIPEHEIGHT = 1200 * SCALE;
const PLAYERGRAVITY = 0.4 * SCALE;
const MINPIPEHEIGHT = 50 * SCALE;
const PIPEVERTICALGAP = 190 * SCALE;
const GAMESPEED = 35 * 0.25;
const PIPEHORIZONTALGAP = PIPEWIDTH * 7;

export const ProvideObjects = ({ children }) => {
    const app = usePixiApp()
    const [spriteObjects, setSpriteObjects] = useState({});
    const height = app.renderer.height;
    const width = app.renderer.width;

    useEffect(() => {
        const textures = asyncSetupSprites(source, sprites)
        const background = new Background(textures.background, width, height);
        const pipeContainer = new PipeContainer(textures.pipe, app);
        const ground = new Ground(textures.ground, width, height - GROUND_HEIGHT);

        const bird = new Bird([
            textures['bird_000'],
            textures['bird_001'],
            textures['bird_002'],
            textures['bird_001'],
        ]);

        [background, pipeContainer, ground, bird].forEach(child =>
            app.stage.addChild(child),
        );

        setSpriteObjects({
            background,
            pipeContainer,
            ground,
            bird,
        })
    }, [app])

    return <objectContext.Provider value={spriteObjects}>{children}</objectContext.Provider>;
}

export const useObjects = () => {
  return useContext(objectContext);
};

class FlappySprite extends Sprite {
    constructor(...args) {
      super(...args);
      this.scale.set(SCALE);
    }
  }
  
class Ground extends TilingSprite {
    constructor(texture, width, skyHeight) {
      super(texture, width, GROUND_HEIGHT);
      this.tileScale.set(SCALE * 2);
      this.position.x = 0;
      this.position.y = skyHeight;
    }
  }
  
class Background extends FlappySprite {
    constructor(texture, width, height) {
      super(texture);
      this.position.x = 0;
      this.position.y = 0;
      this.width = width;
      this.height = height;
    }
  }

export const boxesIntersect = (a, b, paddingA = 0) => {
    const ab = a.getBounds();
    ab.x += paddingA;
    ab.width -= paddingA * 2;
    ab.y += paddingA;
    ab.height -= paddingA * 2;

    const bb = b.getBounds();
    return (
        ab.x + ab.width > bb.x &&
        ab.x < bb.x + bb.width &&
        ab.y + ab.height > bb.y &&
        ab.y < bb.y + bb.height
    );
}

class PipeContainer extends Container {
    pipes = [];
    pipeIndex = 0;
  
    constructor(pipeTexture, app) {
      super();
      this.pipeTexture = pipeTexture;
      this.width = app.renderer.width;
      this.app = app;
      this.position.x = app.renderer.width + PIPEWIDTH / 2;
    }
  
    tryAddingNewPipe = () => {
      if (!this.pipes.length) return;
      const { pipe } = this.pipes[this.pipes.length - 1];
      if (-pipe.position.x >= PIPEHORIZONTALGAP) {
        this.addNewPipe();
      }
    };
  
    moveAll = () => {
      let score = 0;
      for (let index = 0; index < this.pipes.length; index++) {
        this.move(index);
        if (this.tryScoringPipe(index)) {
          score += 1;
        }
      }
      return score;
    };
  
    tryScoringPipe = index => {
      const group = this.pipes[index];
  
      if (
        !group.scored &&
        this.toGlobal(group.pipe.position).x < PLAYERHORIZONTALPOSITION
      ) {
        group.scored = true;
        return true;
      }
      return false;
    };
  
    move = index => {
      const { pipe, pipe2 } = this.pipes[index];
      pipe.position.x -= GAMESPEED;
      pipe2.position.x -= GAMESPEED;
    };
  
    addNewPipe = (pipeLoc) => {
      const pipeGroup = {};
      const pipe = new Pipe(this.pipeTexture);
      const pipe2 = new Pipe(this.pipeTexture);
      pipe.rotation = Math.PI;

      // pipe.position.y = Math.floor(
      //   Math.random() * (800 - PIPEVERTICALGAP - 50) + 50
      // )
        
      // const maxPosition =
      //     Settings.skyHeight -
      //     Settings.minPipeHeight -
      //     Settings.pipeVerticalGap -
      //     pipe.height / 2;
      //   const minPosition = -(pipe.height / 2 - Settings.minPipeHeight);

      const skyHeight = this.app.renderer.height - GROUND_HEIGHT; // might have problems
      const maxPosition =
        skyHeight -
        MINPIPEHEIGHT -
        PIPEVERTICALGAP -
        PIPEHEIGHT / 2;
      const minPosition = -(PIPEHEIGHT / 2 - MINPIPEHEIGHT);
  
      pipe.position.y = Math.floor(
        Math.random() * (maxPosition - minPosition + 1) + minPosition,
      );
  
      pipe2.position.y = PIPEHEIGHT + pipe.position.y + PIPEVERTICALGAP;
      // pipe.position.x = pipe2.position.x = pipeLoc;
      pipe.position.x = pipe2.position.x = 0;
  
      pipeGroup.upper = pipe.position.y + PIPEHEIGHT;
      pipeGroup.lower = pipeGroup.upper + PIPEVERTICALGAP;
      pipeGroup.pipe = pipe;
      pipeGroup.pipe2 = pipe2;
  
      this.addChild(pipe);
      this.addChild(pipe2);
      this.pipes.push(pipeGroup);
      this.tryRemovingLastGroup();
    };
  
    tryRemovingLastGroup = () => {
      if (
        this.pipes[0].pipe.position.x + PIPEWIDTH / 2 >
        this.app.renderer.width //MIGHT CAUSE PROBLEMS
      ) {
        this.pipes.shift();
      }
    };
  
    setXforGroup = (index, x) => {
      const { pipe, pipe2 } = this.pipes[index];
      pipe.position.x = x;
      pipe2.position.x = x;
    };
  
    getX = index => {
      const { pipe } = this.pipes[index];
      return this.toGlobal(pipe.position).x;
    };
  
    restart = () => {
      this.pipeIndex = 0;
      this.pipes = [];
      this.children = [];
    };
  }
  
class Pipe extends FlappySprite {
    constructor(texture) {
      super(texture);
      this.width = PIPEWIDTH;
      this.height = PIPEHEIGHT;
      this.anchor.set(0.5);
    }
  }
  
class Bird extends AnimatedSprite {
    constructor(textures) {
      super(textures);
      this.animationSpeed = 0.2;
      this.anchor.set(0.5);
      this.width = 60 * SCALE;
      this.height = 48 * SCALE;
  
      this.speedY = PLAYERFALLSPEED;
      this.rate = PLAYERGRAVITY;
  
      this.restart();
    }

    updateBirdSpeed = () => {
      this.speedY = PLAYERFALLSPEED;
    }
  
    restart = () => {
      this.play();
      this.rotation = 0;
      this.position.x = PLAYERHORIZONTALPOSITION;
      this.position.y = PLAYERVERTICALPOSITION;
    };
  
    updateGravity = () => {
      this.position.y -= this.speedY;
      this.speedY -= this.rate;
  
      const FLAP = 35;
      this.rotation = -Math.min(
        Math.PI / 4,
        Math.max(-Math.PI / 2, (FLAP + this.speedY) / FLAP),
      );
    };
  }


  export const animate = (bird, ground, pipeContainer, stopAnimating, isDead, isStarted, saveHighScore, setStopAnimate, setIsDead, setScore, height) => {
    if (stopAnimating || !bird || !ground || !pipeContainer) {
        return;
    }
  
    if (isStarted) { // bird falling
      bird.updateGravity();
    }
    
    const skyHeight = height - GROUND_HEIGHT
    if(isDead) {
      bird.rotation += Math.PI / 4;
      if (bird.rotation > Math.PI / 2 && bird.position.y > skyHeight - bird.height / 2
      ) {
        saveHighScore();
        setStopAnimate(true);
      }
    } else {
      if (Math.abs(ground.tilePosition.x) > ground.width) { // move ground
          ground.tilePosition.x = 0;
      }
      ground.tilePosition.x -= GAMESPEED;
  
      if (bird.position.y + bird.height / 2 > skyHeight) {
        bird.stop();
        setIsDead(true);
      }
      const points = pipeContainer.moveAll();
      if (points) {
        setScore()
      }
      pipeContainer.tryAddingNewPipe();
  
      const padding = 5;
      for (const group of pipeContainer.pipes) {
        const { pipe, pipe2, upper, lower } = group;
        if (
          boxesIntersect(bird, pipe, padding) ||
          boxesIntersect(bird, pipe2, padding)
        ) {
          bird.stop();
          setIsDead(true);
        }
      }
    }
  }
  