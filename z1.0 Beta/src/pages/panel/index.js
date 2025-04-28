// src/pages/panel/index.js
import React from 'react';
import '@pages/panel/index.css';
import { createRoot } from 'react-dom/client';
import Panel from './Panel';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Cannot find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(<Panel />);
}

init();