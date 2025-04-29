🧩 ZeroZapp — Integração com WhatsApp Web

Este módulo é responsável pela integração da extensão ZeroZapp com o WhatsApp Web, incluindo injeção de scripts, manipulação de mensagens, atalhos de teclado, interface visual e controle de chats.

📁 Estrutura de Diretórios
bash
Copiar
Editar
src/pages/content/client/
├── features/
│   ├── chatActions.js             # Ações sobre chats (arquivar, snooze, etc)
│   ├── keyboardShortcuts.js       # Atalhos de teclado personalizados
│   └── messageUtils.js            # Utilitários de mensagem e chat
├── utils/
│   ├── domUtils.js                # Funções auxiliares para manipulação do DOM
│   └── storeUtils.js              # Acesso e verificação do WhatsApp Store
└── ui/
    ├── menuManager.js             # Gerencia o menu da extensão
    ├── summaryManager.js          # Exibe resumos de conversas
    └── chatListActions.js         # Ações relacionadas à lista de chats
🔄 Fluxo de Inicialização (inicializer.js)
Aguarda o carregamento do WhatsApp Web

Injeta os estilos visuais necessários

Inicializa os módulos utilitários

Configura listeners de eventos e atalhos de teclado

Injeta e configura a interface da extensão

🧠 Módulos e Responsabilidades
1. inicializer.js – Sistema de Inicialização
Aguarda o window.Store estar pronto

Injeta estilos (injected.css)

Inicializa componentes e observadores

2. chatActions.js – Sistema de Comunicação com o WhatsApp
Arquivamento e snooze de chats

Comunicação direta com window.Store

Manipulação de mensagens e chats

3. messageUtils.js – Sistema de Mensagens
Extração e formatação de mensagens

Busca de chats ativos

Modelos reutilizáveis de mensagens

4. keyboardShortcuts.js – Sistema de Atalhos
Atalhos como Ctrl + E para arquivar chats

Prevenção de conflitos com atalhos do navegador

Registro e remoção de listeners

5. ui/ – Sistema de UI Injetada
Gerenciamento de menus, resumos e botões de ação

Manipulação visual dos elementos da interface do WhatsApp

6. injected.css – Sistema de Estilos
Estilização dos elementos da extensão

Integração visual fluida com o WhatsApp Web

⚠️ Pontos de Atenção
Sempre verificar se window.Store está carregado

Remover listeners ao recarregar ou reinjetar o script

Usar try/catch e console.debug para rastreamento de erros

Seguir a ordem de carregamento correta entre os módulos

🐞 Depuração
Use logs no console para rastrear eventos e problemas:

javascript
Copiar
Editar
console.debug('[INIT] Inicialização iniciada...');
console.debug('[STORE] WhatsApp Store disponível');
console.debug('[UI] Menu injetado com sucesso');
console.error('[ERROR] Falha ao injetar elemento:', error);
📃 Licença
Este projeto segue os termos da MIT License.