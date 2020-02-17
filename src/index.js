import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Background from './assets/background';
import { renderToStaticMarkup } from 'react-dom/server';

// const App = () => {
//     const svgString = encodeURIComponent(renderToStaticMarkup(<Background />));
//     const dataUri = `url("data:image/svg+xml,${svgString}") no-repeat center center`;
//     return <Game background={dataUri}></Game>
// }

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
