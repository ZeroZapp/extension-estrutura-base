// src/pages/panel/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@pages/panel/index.css';
import Panel from './panel.jsx';

function init() {
  const appContainer = document.getElementById('app-container');
  if (!appContainer) {
    throw new Error('Cannot find #app-container');
  }
  const root = createRoot(appContainer);
  const element = React.createElement(Panel, null);
  root.render(element);
}

init();