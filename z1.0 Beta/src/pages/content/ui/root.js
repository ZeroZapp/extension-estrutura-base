import { createRoot } from 'react-dom/client';
import App from '@pages/content/ui/app';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectedStyle from './injected.css?inline';

refreshOnUpdate('pages/content');

const root = document.createElement('div');
root.id = 'zero-zap-root';
root.style.cssText = `position: absolute; top: 0; left: 0; z-index: 9999999999;`;

document.body.prepend(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

// Injetar estilos no shadow DOM
const styleElement = document.createElement('style');
styleElement.innerHTML = injectedStyle;

shadowRoot.appendChild(styleElement);
root.prepend(styleElement);
shadowRoot.appendChild(rootIntoShadow);

createRoot(rootIntoShadow).render(<App />);