import React, { useState, useRef, useEffect, useCallback } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { Sprite, Stage } from "react-pixi-fiber";
import { usePixiApp, usePixiTicker } from './pixiUtils';
import { animate, useObjects } from './Objects';

const Game = () => {
    const app = usePixiApp();
    const gameCanvas = useRef();
    const [isStarted, setIsStarted] = useState(false);
    const [pixiApp, setPixiApp] = useState();
    const [isDead, setIsDead] = useState(false);
    const [stopAnimating, setStopAnimating] = useState(false);
    const [score, setScore] = useState(0);

    const saveHighScore = (value) => console.log(value)
    const onScore = useCallback(() => setScore((points) => (points + 1)))

    const startGame = () => {
        if (!isStarted) {
            setIsStarted(true);
            setScore(0);
            pipeContainer.addNewPipe();
        }
        bird.updateBirdSpeed()
        // updateBirdSpeed()
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

    const onPress = () => {
        if (isDead) {
            restart();
        } else {
            startGame();
        }
    }

    const {
        background,
        pipeContainer,
        ground,
        bird,
    } = useObjects()

    const [count, setCount] = useState(1)
    usePixiTicker(() => animate(bird, ground, pipeContainer, stopAnimating, isDead, isStarted, saveHighScore, setStopAnimating, setIsDead, setScore, app.renderer.height), [bird, ground, pipeContainer])

    return (
        <div>
            <KeyboardEventHandler
                handleKeys={['all']}
                onKeyEvent={(key, e) => onPress()} 
            />
        </div>)
}

export default Game;
