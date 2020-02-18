import React, { useState, useEffect, useRef } from 'react';

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let intervalId = null
    const clearCurrentInterval = () => clearInterval(intervalId)
    function tick() {
      savedCallback.current(clearCurrentInterval);
    }
    if (delay !== null) {
      intervalId = setInterval(tick, delay);
      return () => clearInterval(intervalId);
    }
  }, [delay]);
}