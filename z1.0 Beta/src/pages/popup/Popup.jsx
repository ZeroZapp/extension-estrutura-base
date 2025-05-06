// Importações básicas do React
import React from 'react';

// Importação do componente ConversationsList que será exibido
import ConversationsList from '@src/pages/sidepanel/ConversationsList';

// Importação do provedor de UI do NextUI para estilização
import { NextUIProvider } from '@nextui-org/react';

// Importação de HOCs para tratamento de suspense e erro
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

/**
 * Componente principal do popup da extensão
 * Este componente serve como container principal que exibe a lista de conversas
 * O popup é a janela que aparece quando o usuário clica no ícone da extensão
 */
const Popup = () => {
  return React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      NextUIProvider,
      null,
      React.createElement(
        'div',
        { className: 'p-5 bg-zinc-950 h-screen dark' },
        React.createElement(ConversationsList, null)
      )
    )
  );
};

export default withErrorBoundary(
  withSuspense(Popup, React.createElement('div', null, ' Loading ... ')),
  React.createElement('div', null, ' Error Occur ')
);