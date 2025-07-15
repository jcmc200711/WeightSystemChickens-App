import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './inputs'; // Asegúrate de que esta ruta sea correcta para tu componente App
import {Regis} from './registers';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Regis/>
  </React.StrictMode>,
);