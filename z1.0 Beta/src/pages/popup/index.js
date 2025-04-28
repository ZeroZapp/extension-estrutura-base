// Importando as dependências necessárias
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@pages/popup/index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import Popup from './Popup';

// Configurando o reload automático para desenvolvimento
refreshOnUpdate('pages/popup');

/**
 * Função principal que inicializa o popup
 * Esta função é responsável por montar o componente React
 * dentro do contêiner da página de popup da extensão
 */
function init() {
  // Buscando o contêiner principal da aplicação
  const appContainer = document.querySelector('#app-container');
  
  // Verificando se o contêiner existe
  if (!appContainer) {
    throw new Error('Cannot find #app-container');
  }
  
  // Criando a raiz do React e renderizando o componente Popup
  const root = createRoot(appContainer);
  root.render(<Popup />);
}

// Inicializando a aplicação
init();