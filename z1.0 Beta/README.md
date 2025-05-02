# ZeroZapp - Gerenciador de Conversas do WhatsApp

## 📋 Descrição
ZeroZapp é uma extensão do Chrome que ajuda você a gerenciar suas conversas do WhatsApp Web de forma mais eficiente. Com ela, você pode:
- Visualizar todas as suas conversas pendentes
- Arquivar conversas importantes
- Remover conversas da lista
- Gerenciar suas mensagens de forma organizada

## 🚀 Instalação

1. Abra o Chrome e vá em:
   - Chrome -> Configurações -> Extensões
   - Ative o modo de desenvolvedor
   - Clique em "Carregar extensão descompactada"
   - Selecione a pasta do projeto

## 📱 Uso

1. Abra o WhatsApp Web em seu navegador
2. Clique no ícone da extensão na barra de ferramentas do Chrome
3. O popup da extensão mostrará a lista de suas conversas pendentes
4. Você pode:
   - Clicar em uma conversa para abri-la
   - Usar o menu dropdown para:
     - Conversar
     - Terminar Conversa
     - Arquivar
     - Desarquivar
     - Remover da Lista

## 🛠️ Tecnologias Utilizadas

- React
- JavaScript
- PouchDB
- NextUI
- Lucide React
- Vite
- Vitest

## 📁 Estrutura do Projeto

# ZeroZap - Sistema de Notificações e Alertas

## Versão
z1.0 Beta

## Funcionalidades Implementadas

### Sistema de Badges
- Indicador visual no ícone da extensão
- Mostra o número de tarefas atrasadas
- Muda a cor para vermelho (#dc3545) quando há tarefas atrasadas
- Atualiza automaticamente quando há mudanças no banco de dados

### Sistema de Alertas
- Verificação periódica de tarefas atrasadas (a cada 15 segundos)
- Processamento automático de tarefas com data de vencimento passada
- Atualização do status das tarefas no banco de dados
- Integração com o WhatsApp Web para processamento de tarefas

### Sistema de Notificações
- Comunicação bidirecional entre background e content script
- Atualização em tempo real do estado das tarefas
- Sincronização automática do banco de dados
- Logging detalhado para depuração

## Arquitetura

### Componentes Principais
1. **Background Script**
   - Gerenciamento de alarmes
   - Verificação de tarefas atrasadas
   - Atualização do badge
   - Comunicação com o content script

2. **Sistema de Alarmes**
   - Verifica tarefas atrasadas a cada 15 segundos
   - Processa tarefas automaticamente
   - Atualiza o estado no banco de dados

3. **Banco de Dados (PouchDB)**
   - Armazenamento local das tarefas
   - Índices para busca rápida
   - Sincronização automática

## Funcionamento

1. **Inicialização**
   ```javascript
   // Configura alarme para verificar tarefas atrasadas
   chrome.alarms.create('delayed-actions', {
     delayInMinutes: 0.25, // Começa após 15 segundos
     periodInMinutes: 0.25 // Repete a cada 15 segundos
   });
   ```

2. **Verificação de Tarefas**
   ```javascript
   // Busca tarefas atrasadas no banco de dados
   const result = await db.find({
     selector: {
       action: 'delayed',
       start_action: { $lte: agora } // Tarefas com data de vencimento passada
     }
   });
   ```

3. **Processamento de Tarefas**
   ```javascript
   // Processa cada tarefa atrasada
   result.docs.forEach(async function(doc) {
     // Atualiza status para 'overdue'
     // Envia mensagem para o content script
     // Atualiza o badge
   });
   ```

4. **Atualização do Badge**
   ```javascript
   // Atualiza o badge com o número de tarefas atrasadas
   if (count > 0) {
     chrome.action.setBadgeText({ text: count.toString() });
     chrome.action.setBadgeBackgroundColor({ color: '#dc3545' });
   }
   ```

## Dependências
- PouchDB 8.0.1
- webextension-polyfill
- md5

## Considerações

- O sistema usa o banco de dados local (PouchDB) para armazenamento
- As verificações são feitas a cada 15 segundos para manter o sistema responsivo
- O badge é atualizado automaticamente quando há mudanças no banco de dados
- O sistema mantém a sincronização entre o background e o content script

## Próximos Passos

1. Implementação de testes unitários
2. Adição de logs mais detalhados
3. Otimização do sistema de alarmes
4. Implementação de fallbacks para casos de erro
