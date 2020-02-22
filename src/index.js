import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import { ProvidePixi, usePixiApp } from './pixiUtils';
import { ProvideObjects } from './Objects';

const App = () => {
    const app = usePixiApp();
    const gameCanvas = useRef();

    useEffect(() => {
        if(app) gameCanvas.current.appendChild(app.view); 
    }, [app])

    return <div ref={gameCanvas}><Game /></div>
}

ReactDOM.render(<ProvidePixi width={ window.innerWidth } height={ window.innerHeight }><ProvideObjects><App /></ProvideObjects></ProvidePixi>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
