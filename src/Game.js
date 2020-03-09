import React, { useState, useRef, useEffect, useCallback } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { Sprite, Stage } from "react-pixi-fiber";
import { usePixiApp, usePixiTicker } from './pixiUtils';
import { animate, useObjects } from './Objects';
import { getMicrophone } from './Audio/Audio';
import AudioAnalyser from './Audio/AudioAnalyser';

const Game = () => {
    const app = usePixiApp();
    const gameCanvas = useRef();
    const [isStarted, setIsStarted] = useState(false);
    const [pixiApp, setPixiApp] = useState();
    const [isDead, setIsDead] = useState(false);
    const [stopAnimating, setStopAnimating] = useState(false);
    const [score, setScore] = useState(0);
    const [audio, setAudio] = useState();
    const [count, setCount] = useState(1)



    const saveHighScore = (value) => console.log(value)
    const onScore = useCallback(() => setScore(score + 1))

    const startGame = () => {
        if (isDead) return;
        if (!isStarted) {
            setIsStarted(true);
            setScore(0);
            pipeContainer.addNewPipe();
        }
        bird.updateBirdSpeed()
    }

    const restart = () => {
        setIsStarted(false);
        setIsDead(false);
        setStopAnimating(false)
        setScore(0)
        bird.restart();
        pipeContainer.restart();
        // animate(stopAnimating, isDead, isStarted, saveHighScore, setStopAnimating, setIsDead, onScore)
    };

    const onPress = async () => {
        if (isDead) {
            await restart();
        } else {
            if(!audio) {
                const newAudio = await getMicrophone()
                setAudio(newAudio)
            }
            startGame();
        }
    }

    const {
        background,
        pipeContainer,
        ground,
        bird,
    } = useObjects()

    if(pipeContainer) {
        window.blah = pipeContainer;
        // pipeContainer.addNewPipe(-200);
        // pipeContainer.addNewPipe(-800);
        // pipeContainer.addNewPipe(-500);
    }
    usePixiTicker(() => {
        animate(bird, ground, pipeContainer, stopAnimating, isDead, isStarted, saveHighScore, setStopAnimating, setIsDead, onScore, app.renderer.height)
    }, [bird, ground, pipeContainer])

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
        <div>
            <KeyboardEventHandler
                handleKeys={['all']}
                onKeyEvent={(key, e) => onPress()} 
            />
            <div style={{ position: 'absolute', zIndex: 20, color: 'black', fontSize: 60 }}>Score: {score}</div>
            {audio ? <AudioAnalyser audio={audio} flap={startGame}></AudioAnalyser> : null}
        </div>)
}

export default Game;
