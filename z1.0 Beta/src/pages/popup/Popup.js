// Importações básicas do React
import React from 'react';

// Importação do arquivo CSS do popup
import '@pages/popup/Popup.css';

// Importação do componente ConversationsList que será exibido
import ConversationsList from '@src/pages/sidepanel/ConversationsList';

// Importação do provedor de UI do NextUI para estilização
import { NextUIProvider } from '@nextui-org/react';

/**
 * Componente principal do popup da extensão
 * Este componente serve como container principal que exibe a lista de conversas
 * O popup é a janela que aparece quando o usuário clica no ícone da extensão
 */
const Popup = () => {
  return (
    // React.StrictMode ajuda a identificar problemas potenciais no código
    // e fornece feedback sobre práticas obsoletas
    <React.StrictMode>
      // NextUIProvider é necessário para que os componentes NextUI funcionem corretamente
      <NextUIProvider>
        {/* 
          Container principal do popup com estilização:
          - p-5: padding de 5 unidades
          - bg-zinc-950: fundo escuro (cor cinza escura)
          - h-dvh: altura ocupando toda a tela
          - dark: tema escuro
        */}
        <div className="p-5 bg-zinc-950 h-dvh dark">
          {/* Renderiza o componente ConversationsList que mostra todas as conversas */}
          <ConversationsList />
        </div>
      </NextUIProvider>
    </React.StrictMode>
  );
};

// Exporta o componente Popup para ser usado em outros arquivos
export default Popup;