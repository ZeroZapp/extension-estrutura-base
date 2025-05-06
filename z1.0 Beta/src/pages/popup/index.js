// Importações necessárias
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@pages/popup/index.css';
import Popup from './Popup.jsx';

// Encontra o container da aplicação
const appContainer = document.getElementById('app-container');

// Verifica se o container existe
if (!appContainer) {
  throw new Error('Cannot find #app-container');
}

// Cria a raiz do React e renderiza o componente Popup
const root = createRoot(appContainer);
const element = React.createElement(Popup, null);
root.render(element);