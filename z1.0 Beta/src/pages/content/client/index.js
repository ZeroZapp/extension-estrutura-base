// src/pages/content/client/index.js
import 'webextension-polyfill';

console.log('[client/index.js] Client script initialized.');

// Função para inicializar o client
function initializeClient() {
  console.log('[client/index.js] Initializing client...');

  // Configurar comunicação com o background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[client/index.js] Received message from background:', request);
    
    // Processar diferentes tipos de mensagens
    switch (request.type) {
      case 'INITIALIZE':
        console.log('[client/index.js] Initializing client from background...');
        break;
        
      case 'SEND_MESSAGE':
        console.log('[client/index.js] Sending message:', request.data);
        // Implementar lógica de envio de mensagem
        break;
        
      default:
        console.log('[client/index.js] Unknown message type:', request.type);
    }
  });

  // Configurar event listener para mensagens do injected script
  window.addEventListener('message', (event) => {
    console.log('[client/index.js] Received message from injected:', event.data);
    
    // Processar diferentes tipos de mensagens
    if (event.data.type === 'NEW_MESSAGE') {
      console.log('[client/index.js] New message received:', event.data.data);
      // Enviar para o background
      chrome.runtime.sendMessage({
        type: 'NEW_MESSAGE',
        data: event.data.data
      });
    }
  });
}

// Inicializar o client
initializeClient();