// Importando as dependências necessárias
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@pages/options/index.css';
import Options from './Options.jsx';

// Encontra o container da aplicação
const appContainer = document.getElementById('app-container');

// Verifica se o container existe
if (!appContainer) {
  throw new Error('Cannot find #app-container');
}

// Cria a raiz do React e renderiza o componente Options
const root = createRoot(appContainer);
const element = React.createElement(Options, null);
root.render(element);