import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import SidePanel from './SidePanel';

refreshOnUpdate('pages/sidepanel');

function init() {
  const sidepanelRoot = document.querySelector('#sidepanel-root');
  if (!sidepanelRoot) {
    throw new Error('Cannot find #sidepanel-root');
  }
  const root = createRoot(sidepanelRoot);
  root.render(<SidePanel />);
}

init();