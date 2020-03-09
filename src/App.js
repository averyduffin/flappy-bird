import React, { useState } from 'react';
import { Circle } from 'react-shapes';
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import Pipe from './Pipe';
import { useInterval } from './utils';
import backgroundUrl from './assets/background.svg';
import { getMicrophone } from './Audio/Audio';
import AudioAnalyser from './Audio/AudioAnalyser';
// import BackgroundUrl from './assets/background.svg';

// import logo from './logo.svg';
// import './App.css';

const BIRD_RADIUS = 20;
const BIRD_LEFT = 350;
const GRAVITY = 0.8;
const PIPE_SPEED = 7

const initialPipes = (width, height) => {
    const count = 3;
    const pipes = [];
    for (let i = 1; i < count; i++) {
        const x = width + (width / i);
        pipes.push({
            upperPipeHeight: (height / 2) - (Math.random() * 200),
            bottomPipeHeight: (height / 2) - (Math.random() * 200),
            x: x
        })
    }
    return pipes;
}

const App = () => {
    const WINDOW_HEIGHT = window.innerHeight;
    const WINDOW_WIDTH = window.innerWidth;
    const [audio, setAudio] = useState();
    const [birdHeight, setBirdHeight] = useState(WINDOW_HEIGHT / 2);
    const [velocity, setVelocity] = useState(0);
    const [pipes, setPipes] = useState(initialPipes(WINDOW_WIDTH, WINDOW_HEIGHT));

    useInterval((clearCurrentInterval) => {
      let newBirdHeight = birdHeight;
      const birdCrashed = newBirdHeight > WINDOW_HEIGHT - BIRD_RADIUS * 2; // hit the bottom
      if(birdCrashed){
        clearCurrentInterval();
        return;
      }

      const pipeWasHit = pipes.find(pipe => pipe.isHit) // hit pipe
      if(pipeWasHit){
        clearCurrentInterval();
        return;
      }

      const newVelocity = (velocity + GRAVITY) * 0.9;
      console.log(newBirdHeight, newVelocity)
      newBirdHeight = newVelocity + newBirdHeight;

      const newPipes = pipes.map(pipe => {
          const {x, upperPipeHeight } = pipe
          const newX = pipe.x - PIPE_SPEED
          if (newX < 0) {
              return {
                  upperPipeHeight: (WINDOW_HEIGHT / 2) - (Math.random() * 200),
                  bottomPipeHeight: (WINDOW_HEIGHT / 2) - (Math.random() * 200),
                  x: WINDOW_WIDTH - 40
              }
          } else {
              let isHit = false;
              const xDifference = (BIRD_LEFT - x)
              const hitOnX = xDifference < 10 && xDifference > 0;
              const hitOnUpperY = newBirdHeight < upperPipeHeight;
              const hitOnLowerY = newBirdHeight + BIRD_RADIUS > (window.innerHeight - pipe.bottomPipeHeight)
              if ((hitOnUpperY || hitOnLowerY) && hitOnX) {
                  isHit = true
              }

              return {
                  ...pipe,
                  x: newX,
                  isHit: isHit
              }
          }
      })
      setVelocity(newVelocity);
      setBirdHeight(newBirdHeight);
      setPipes(newPipes);
    }, 15)

    const stopMicrophone = () => {
      audio.getTracks().forEach(track => track.stop());
      setAudio(null)
    }

    const toggleMicrophone = async () => {
      if(audio) {
        await stopMicrophone();
      } else {
        const newAudio = await getMicrophone()
        setAudio(newAudio)
      }
    }

    return (
        <div 
          className="App" 
          style={{
            background: `url(${backgroundUrl})`,
            height: window.innerHeight,
            width: window.innerWidth,
          }}
        >
          {/* <Background></Background> */}
          {/* <KeyHandler keyEventName={KEYPRESS} keyValue="s" onKeyHandle={() => setVelocity(newVelocity => newVelocity - 25)} /> */}
          <div style={{ left: BIRD_LEFT, top: birdHeight, position: 'absolute' }}>
            <Circle r={BIRD_RADIUS} fill={{ color: '#2409ba' }} stroke={{ color: '#E65243' }} strokeWidth={3} />
          </div>
          {pipes.map(pipe => {
            const {x, upperPipeHeight, isHit} = pipe;
            const bottomPipeTop = window.innerHeight - pipe.bottomPipeHeight;
            const bottomPipeHeight = pipe.bottomPipeHeight;
  
            return <Pipe key={x} isHit={isHit} upperPipeHeight={upperPipeHeight} bottomPipeHeight={bottomPipeHeight} x={x} bottomPipeTop={bottomPipeTop} />
          })}
        </div>
    )
}

export default App;
