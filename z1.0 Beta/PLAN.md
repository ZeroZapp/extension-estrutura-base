# Plano de Refatoração: ZeroZapp 2.0

## 1. Objetivo

Refatorar a extensão ZeroZapp existente ("ZeroZapp 2.0") para melhorar a robustez, manutenibilidade e organização do código, mantendo a funcionalidade principal de "Inbox Zero" e a dependência do `window.Store`. O objetivo é criar um código autoral, utilizando tecnologias modernas para desenvolvimento de extensões Chrome, e remover dependências externas (`dash.z0z.app`).

## 2. Funcionalidades Essenciais

*   **Adiar Conversas (Snooze):**
    *   Injeta um ícone/botão de adiar nas conversas do WhatsApp Web.
    *   Mostra um seletor de data/hora para agendar o desarquivamento.
    *   Ao confirmar: Arquiva a conversa no WhatsApp (via `Store.Cmd`) e salva os detalhes do agendamento localmente (ID da conversa, data/hora agendada).
    *   Lista as conversas adiadas no Side Panel, permitindo visualização e edição do agendamento.
    *   Monitora o tempo (usando `chrome.alarms`) para desarquivar automaticamente as conversas (via `Store.Cmd`).
    *   Permite desarquivar manualmente as conversas pelo Side Panel (via `Store.Cmd`).
*   **Arquivamento em Massa:**
    *   Oferece uma opção para arquivar todas as conversas individuais (via `Store.Cmd`).
    *   Oferece uma opção para arquivar todos os grupos (via `Store.Cmd`).
    *   [Possível Melhoria] Adicionar filtros para arquivar conversas com base em critérios (ex: inativas por X dias).
*   **Resumo/Sugestão de Resposta (IA):**
    *   Mantém a funcionalidade de resumo e sugestão de resposta.
    *   Permite que o usuário configure sua própria chave de API (ex: OpenAI) nas opções da extensão.
    *   A extensão faz chamadas diretas para a API configurada a partir do background script para gerar os resumos e sugestões.
    *   [Possível Melhoria] Implementar um sistema de cache para reduzir o número de chamadas à API.
    *   [Possível Melhoria] Permitir que o usuário escolha diferentes modelos de IA (se a API suportar).

## 3. Stack Tecnológica Proposta

*   **Manifest:** V3
*   **Linguagem:** TypeScript
*   **Framework UI:** React
*   **Build Tool:** Vite
*   **Estilização:** Tailwind CSS (com NextUI opcionalmente)
*   **Armazenamento:** `chrome.storage.local`
*   **Comunicação:** `chrome.runtime.sendMessage`, `chrome.tabs.sendMessage`, `window.postMessage`
*   **Agendamento:** `chrome.alarms`
*   **Interação WA:** Acesso direto ao `window.Store` (requer script injetado na página e possivelmente `moduleraid` ou similar).

## 4. Arquitetura Proposta

### 4.1. Estrutura de Diretórios (Ajustada para `window.Store`)

```
/zerozapp-v2/
├── public/
│   ├── icon-34.png
│   ├── icon-128.png
│   └── _locales/
│       └── en/
│           └── messages.json
├── src/
│   ├── assets/
│   │   ├── img/
│   │   │   └── logo.svg
│   │   └── style/
│   │       └── theme.scss
│   ├── pages/
│   │   ├── background/         # Lógica do Service Worker
│   │   │   ├── index.html
│   │   │   └── index.ts
│   │   ├── content/
│   │   │   ├── client/
│   │   │   │   ├── features/
│   │   │   │   │   ├── chatActions.ts
│   │   │   │   │   └── keyboardShortcuts.ts
│   │   │   │   ├── ui/
│   │   │   │   │   ├── chatListActions.tsx
│   │   │   │   │   └── menuManager.tsx
│   │   │   ├── injected/       # Script injetado na página (acesso ao window.Store)
│   │   │   │   └── index.ts    # Ponto de entrada, lógica principal de interação WA
│   │   │   ├── ui/             # Componentes React reutilizáveis
│   │   │   │   ├── button.tsx
│   │   │   │   ├── menu.tsx
│   │   │   │   └── root.tsx
│   │   │   ├── index.ts
│   │   │   ├── style.scss
│   │   │   └── window.d.ts
│   │   ├── devtools/
│   │   │   ├── index.html
│   │   │   └── index.ts
│   │   ├── libs/
│   │   │   ├── AsyncMessagePort.ts
│   │   │   └── util.ts
│   │   ├── options/
│   │   │   ├── index.css
│   │   │   ├── index.html
│   │   │   └── index.tsx
│   │   ├── panel/
│   │   │   ├── index.css
│   │   │   ├── index.html
│   │   │   └── index.tsx
│   │   ├── popup/
│   │   │   ├── index.css
│   │   │   ├── index.html
│   │   │   └── index.tsx
│   │   └── sidepanel/
│   │       ├── index.css
│   │       ├── index.html
│   │       └── index.tsx
│   ├── shared/             # Código compartilhado (tipos, storage, utils)
│   │   ├── storages/
│   │   │   └── AppConfigStorage.ts
│   │   └── utils/
│   │       └── logger.ts
│   ├── vite-env.d.ts
│   └── global.d.ts
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```
*(Nota: A estrutura exata dentro de `injected/` pode evoluir durante a implementação. This directory structure is based on the file list provided in environment_details and may not be 100% accurate.)*

### 4.2. Fluxos de Comunicação Principais (Ajustado para `window.Store`)

*   **Adiar:** UI Injetada (src/pages/content/client/ui/menuManager.tsx) -> Lógica Injetada (src/pages/content/client/injected/index.ts) [Chama `Store.Cmd.archiveChat`, Salva no `chrome.storage.local` via mensagem para BG] -> BG (src/pages/background/index.ts) [Agenda Alarme] -> Side Panel (src/pages/sidepanel/SidePanel.tsx) [Lê `chrome.storage.local`] -> BG [Alarme Dispara] -> Lógica Injetada (src/pages/content/client/injected/index.ts) [Chama `Store.Cmd.archiveChat(false)`]
*   **IA:** UI Injetada (src/pages/content/client/ui/menuManager.tsx) -> Lógica Injetada (src/pages/content/client/injected/index.ts) [Extrai Msgs via `Store.Chat`] -> BG (src/pages/background/index.ts) [Chama API Externa] -> Lógica Injetada (src/pages/content/client/injected/index.ts) [Exibe Resultado]

### 4.3. Diagrama da Arquitetura (Mermaid - Conceitual)

```mermaid
graph LR
    subgraph Browser
        subgraph WhatsApp_Tab [WhatsApp Web Tab]
            direction TB
            InjectedScript[src/pages/content/client/injected/index.ts] -- Access --> WA_Window[window (incl. Store)]
            InjectedScript -- Use --> WA_DOM[WhatsApp DOM (para UI)]
            InjectedScript -- Renders --> UI_Comp[UI Components (src/pages/content/client/ui/)]
        end
        SP[Side Panel (src/pages/sidepanel/SidePanel.tsx)]
        OP[Options Page (src/pages/options/Options.tsx)]
    end

    subgraph Extension_Process
        direction TB
        ContentScript[src/pages/content/client/index.ts]
        BG[Background SW (src/pages/background/index.ts)]
        ST[chrome.storage]
        AL[chrome.alarms]

        ContentScript -- chrome.runtime.sendMessage --> BG
        BG -- chrome.tabs.sendMessage --> ContentScript

        BG -- Read/Write --> ST
        BG -- Use --> AL
    end

    subgraph External_Services
        AI_API[3rd Party AI API]
    end

    InjectedScript -- window.postMessage --> ContentScript
    ContentScript -- window.postMessage --> InjectedScript

    BG -- Send Message --> SP
    BG -- HTTP Request --> AI_API
    AI_API -- HTTP Response --> BG
    SP -- Read/Write --> ST
    OP -- Read/Write --> ST

    style WA_Window fill:#ddd,stroke:#333
    style InjectedScript fill:#f9f,stroke:#333
    style ContentScript fill:#fcf,stroke:#333
    style SP fill:#ccf,stroke:#333
    style OP fill:#ccf,stroke:#333
    style BG fill:#9cf,stroke:#333
    style ST fill:#fec,stroke:#333
    style AL fill:#fec,stroke:#333
    style AI_API fill:#9c9,stroke:#333
```

## 5. Análise da Abordagem Atual (Interação WA Web)

A versão existente (`handleClient.tsx`) depende fortemente do acesso ao objeto global `window.Store` do WhatsApp Web para obter dados e executar ações.

**Prós:** Acesso direto e programático a dados e funções. Permite funcionalidades como extração confiável de `chatId` e arquivamento/desarquivamento direto.
**Contras:** Extremamente frágil e propenso a quebrar com qualquer atualização do WhatsApp. Alta carga de manutenção.

## 6. Decisão de Abordagem para ZeroZapp 2.0 (Interação WA Web) - **DECIDIDO**

**Opção Escolhida: Opção 1 - Abordagem `window.Store`**

*   **Justificativa:** A necessidade de funcionalidades específicas, como a extração confiável do `chatId`, que se mostraram difíceis ou inviáveis com a abordagem DOM/Simulação em tentativas anteriores, justifica a escolha pela abordagem `window.Store`, apesar dos riscos.
*   **Mitigação:** O código será estruturado para isolar o acesso ao `Store` o máximo possível (ex: em `src/injected/store.ts`). A documentação interna sobre as partes do `Store` utilizadas será essencial. Será necessário um monitoramento contínuo e prontidão para atualizações quando o WhatsApp mudar.
*   **Foco:** Recriar a lógica *ao redor* do `Store` (modelos de dados, nomes de funções, organização do código) de forma autoral e mais limpa.

## 7. Plano de Refatoração Detalhado

1.  **Análise Inicial:**
    *   Revisar a estrutura de diretórios e arquivos para identificar áreas de melhoria.
    *   Analisar o código existente para identificar componentes reutilizáveis e áreas de complexidade.
    *   Identificar padrões de código que podem ser simplificados ou refatorados.

2.  **Refatoração Modular:**
    *   Extrair componentes reutilizáveis em módulos separados.
    *   Melhorar a modularidade do código, dividindo arquivos grandes em arquivos menores e mais focados.
    *   Implementar interfaces e tipos para melhorar a clareza e a segurança do código.

3.  **Melhoria da Legibilidade:**
    *   Remover comentários desnecessários e código comentado.
    *   Adicionar comentários JSDoc para documentar as funções e os componentes.
    *   Renomear variáveis e funções para torná-las mais descritivas.
    *   Formatar o código de forma consistente usando Prettier.

4.  **Otimização do Logging:**
    *   Implementar um sistema de níveis de log (debug, info, warn, error).
    *   Remover logs redundantes ou desnecessários.
    *   Adicionar contexto relevante aos logs para facilitar a depuração.

5.  **Testes Unitários:**
    *   Implementar testes unitários para os componentes e as funções principais.
    *   Garantir que os testes cubram todos os casos de uso importantes.
    *   Usar os testes para garantir que as mudanças não introduzam regressões.

6.  **Refatoração Específica do `window.Store`:**
    *   Isolar o acesso ao `window.Store` em um módulo dedicado (já existente: `src/injected/store.ts`).
    *   Criar tipos e interfaces para representar os dados do `window.Store` de forma mais clara e segura.
    *   Implementar funções para acessar e manipular os dados do `window.Store` de forma centralizada.
    *   Monitorar as mudanças no `window.Store` e adaptar o código conforme necessário.

7.  **Implementação de Melhorias (Opcional):**
    *   Implementar as melhorias identificadas nas seções de funcionalidades (ex: filtros de arquivamento, cache de IA).

## 8. Próximos Passos

1.  **Iniciar a implementação no modo "Code"**, seguindo este plano detalhado.