import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@pages/content/ui/app';

// Encontra o container da aplicação
const appContainer = document.createElement('div');
appContainer.id = 'zerozapp-root';
document.body.appendChild(appContainer);

// Cria a raiz do React e renderiza o componente App
const root = createRoot(appContainer);
const element = React.createElement(App, null);
root.render(element);