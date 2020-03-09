import React, { useState, useEffect, useCallback } from 'react';
import AudioVisualiser from './AudioVisualiser';

const AudioAnalyser = ({ audio, flap }) => {
  const [audioData, setAudioData] = useState(new Uint8Array(0));

  useEffect(() => {
    let rafId = null;
    let dataArray = new Uint8Array(0);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let newAnalyser = audioContext.createAnalyser();
    const tick = () => {
      if(newAnalyser) newAnalyser.getByteTimeDomainData(dataArray);
      setAudioData(dataArray.slice(0))
      // console.log(dataArray)
      rafId = requestAnimationFrame(tick);
    }
    dataArray = new Uint8Array(newAnalyser.frequencyBinCount);
    let source = null;
    if(audio) source = audioContext.createMediaStreamSource(audio);
    source.connect(newAnalyser);
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      newAnalyser.disconnect();
      source.disconnect();
      newAnalyser = null;
    }
  }, [audio]);

  // console.log(audioData)

  return <AudioVisualiser audioData={audioData} flap={flap}/>;
}

export default AudioAnalyser;
