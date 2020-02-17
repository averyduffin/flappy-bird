import React, { useState, useEffect, useRef } from 'react';

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  const [id, setId] = useState();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const clearCurrentInterval = () => clearInterval(id)
    function tick() {
      savedCallback.current(clearCurrentInterval);
    }
    if (delay !== null) {
      let intervalId = setInterval(tick, delay);
      setId(intervalId);
      return () => clearInterval(intervalId);
    }
  }, [delay]);
  return id;
}