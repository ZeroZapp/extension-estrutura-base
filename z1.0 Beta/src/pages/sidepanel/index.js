import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import SidePanel from './SidePanel.jsx';

// Encontra o container da aplicação
const sidepanelRoot = document.querySelector('#sidepanel-root');

// Verifica se o container existe
if (!sidepanelRoot) {
  throw new Error('Cannot find #sidepanel-root');
}

// Cria a raiz do React e renderiza o componente SidePanel
const root = createRoot(sidepanelRoot);
const element = React.createElement(SidePanel, null);
root.render(element);