// Importando as dependências necessárias
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@pages/options/index.css';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import Options from './Options';

// Configurando o reload automático para desenvolvimento
refreshOnUpdate('pages/options');

/**
 * Função principal que inicializa o componente de opções
 * Esta função é responsável por montar o componente React
 * dentro do contêiner da página de opções da extensão
 */
function init() {
  // Buscando o contêiner principal da aplicação
  const appContainer = document.querySelector('#app-container');
  
  // Verificando se o contêiner existe
  if (!appContainer) {
    throw new Error('Cannot find #app-container');
  }
  
  // Criando a raiz do React e renderizando o componente Options
  const root = createRoot(appContainer);
  root.render(<Options />);
}

// Inicializando a aplicação
init();