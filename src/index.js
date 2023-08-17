import React from 'react';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Router from './router/Router';
import './index.css';
import './custom.scss';
import FiltroAlerta from './filters/alerta/Alerta';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FiltroAlerta>
      <Router />
    </FiltroAlerta>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
