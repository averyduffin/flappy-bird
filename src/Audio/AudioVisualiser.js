import React, { useState, useEffect, useCallback, useRef } from 'react';

const THRESHHOLD = 75

const AudioVisualiser = ({ audioData, flap }) => {
//   const [audioData, setAudioData] = useState(new Uint8Array(0));
    const canvasRef = useRef();
    const MAX = 128;

    useEffect(() => {
        const canvas = canvasRef.current;
        const height = canvas.height;
        const width = canvas.width;
        const context = canvas.getContext('2d');
        let x = 0;
        const sliceWidth = (width * 1.0) / audioData.length;
        context.lineWidth = 2;
        context.strokeStyle = '#000000';
        context.clearRect(0, 0, width, height);
        context.beginPath();
        context.moveTo(0, height / 2);
        let avg = 0;
        let max = 0;
        for (const item of audioData) {
            avg += Math.abs(item - MAX);
            max = Math.max(max, Math.abs(item - MAX));
            const y = (item / 255.0) * height;
            context.lineTo(x, y);
            x += sliceWidth;
        }
        // console.log(max);
        if(max > THRESHHOLD) {
            flap();
            // console.log("loud", max);
        }
        // if(avg > 100) {
        //     // flap();
        //     console.log("loud", max);
        // }
        context.lineTo(x, height / 2);
        context.stroke();
    }, [audioData, canvasRef, flap])

  return <canvas width="300" height="300" ref={canvasRef}/>;
}

export default AudioVisualiser;
