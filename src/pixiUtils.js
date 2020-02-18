import React, { useState, useEffect, useContext, createContext, useRef } from "react";
import * as PIXI from 'pixi.js';
const { Rectangle, Texture } = PIXI;

const pixiContext = createContext();

export function ProvidePixi({ gameCanvas, width, height, children }) {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    const app = new PIXI.Application({
        // gameCanvas,
        autoResize: false,
        width,
        height,
    });
    return <pixiContext.Provider value={app}>{children}</pixiContext.Provider>;
}

export const usePixiApp = () => {
  return useContext(pixiContext);
};

export const usePixiTicker = (callback, watchers) => {
    const app = usePixiApp()
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback, watchers]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      app.ticker.add(tick)
    }, []);
  }
  
export const  asyncSetupSprites = (resource, spriteSheet) => {
  //   const texture = await Texture.fromExpoAsync(resource);
  //   const texture = Texture.fromBuffer(resource, 189, 192, {});
    const texture = Texture.from(resource);
  //  console.log(spriteSheet)
    let textures = {};
    for (const sprite of spriteSheet) {
      const { name, x, y, width, height } = sprite;
      try {
        const frame = new Rectangle(x, y, width, height);
        textures[name] = new Texture(texture.baseTexture, frame);
      } catch ({ message }) {
        console.error(message);
      }
    }
    return textures;
  }















// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const signin = (email, password, code) => {
  };

  const sendEmail = (email, password) => {
  };

  const signout = () => {
  };

  const sendPasswordResetEmail = email => {
  };

  // This method is not needed with Auth0 but added in case your exported Divjoy ...
  // ... template makes a call to auth.confirmPasswordReset().
  const confirmPasswordReset = (password) => {
  };

  // Get the current user using stored access_token
  const getCurrentUser = () => {
  };

  const isAuthenticated = () => {

  }

  const resetPassword = () => {
  }

  const checkisAuth = async() => {
  }

  // Get user on mount
  useEffect(() => {
    setUser(getCurrentUser())
    checkisAuth().then(isAuthed => {
    })
  }, []);

  return {
    user,
    signin,
    signout,
    isAuthenticated,
    sendPasswordResetEmail,
    confirmPasswordReset,
    resetPassword
  };
}