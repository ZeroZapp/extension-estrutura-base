// src/pages/content/injected/index.js
import 'webextension-polyfill';
import './toggleTheme';

console.log('[injected/index.js] Script execution started.');

// Injeta inicializer.js primeiro
if (!document.getElementById('clientjs')) {
  console.log('[injected/index.js - Log] Attempting to inject clientjs...');
  try {
    const element = document.createElement('script');
    element.id = 'clientjs';
    element.src = chrome.runtime.getURL('src/pages/content/client/index.js');
    (document.head || document.documentElement).appendChild(element);
    
    element.onerror = (error) => {
      console.error('[injected/index.js - Error] Failed to load clientjs script:', error);
    };
  } catch (error) {
    console.error('[injected/index.js - Critical Error] Error during clientjs injection:', error);
  }
} else {
   console.log('[injected/index.js - Log] clientjs already found, skipping injection.');
}

// Função para carregar moduleraid
function loadModules() {
  console.log('[injected/index.js - Log] loadModules function called.');
  if (!document.getElementById('moduleraidjs')) {
    console.log('[injected/index.js - Log] Attempting to inject moduleraid.js...');
    try {
      const element = document.createElement('script');
      element.id = 'moduleraidjs';
      element.src = chrome.runtime.getURL('src/pages/moduleraid/index.js');
      
      element.onload = () => {
        console.log('[injected/index.js - Success] moduleraid.js loaded successfully.');
        
        // Check if window.Store was populated
        setTimeout(() => {
          console.log('[injected/index.js - Debug] Checking window.Store status:',
            {
              'Store exists': !!window.Store,
              'Store modules': window.Store ? Object.keys(window.Store).join(', ') : 'N/A',
              'WhatsApp version': window.WVERSION || 'unknown'
            }
          );
        }, 1000);
      };
      
      element.onerror = (error) => {
        console.error('[injected/index.js] Error during moduleraid.js injection:', error);
      };
      
      (document.head || document.documentElement).appendChild(element);
    } catch (error) {
      console.error('[injected/index.js] Error during moduleraid.js injection:', error);
    }
  } else {
     console.log('[injected/index.js - Log] moduleraid.js already found, skipping injection.');
  }
}

// Event listener para mensagens
window.addEventListener('message', async function (evt) {
  console.log('[injected/index.js] window.addEventListener - Message received:', evt.data);
  
  // Prevent loop from own messages or non-relevant messages
  if (evt.source !== window || evt.data?.response || !evt.data?.to && !evt.data?.source) {
    return false;
  }

  // Handle different message sources
  if (evt.data?.source === 'zerozapp-summary-callback' && evt.data?.event === 'show_summary_bubble') {
    console.log('[injected/index.js] Received show_summary_bubble event:', evt.data.payload);
    const { summary, error } = evt.data.payload;
    if (summary) {
      displaySummaryBubble(summary);
    }
  }
});

// Listener chrome.runtime.onMessage
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('[injected/index.js] chrome.runtime.onMessage - Message received:', request);
  console.log('[injected/index.js] chrome.runtime.onMessage - Message received:', request);
  console.log('on message received in content', request, sender, sendResponse);
});

// Função para verificar se estamos no WhatsApp Web
function isWhatsAppWeb() {
  return window.location.hostname === 'web.whatsapp.com';
}

// Função para enviar eventos para o background script
function sendEvent(eventType, data) {
  chrome.runtime.sendMessage({
    type: eventType,
    data: data
  });
}

// Função para capturar novas mensagens
function captureMessages() {
  const MESSAGE_SELECTOR = '.message-in, .message-out';
  const MESSAGE_CONTAINER_SELECTOR = '#main .message-list';

  function processNewMessage(messageElement) {
    const messageInfo = {
      id: messageElement.getAttribute('data-id'),
      fromMe: messageElement.classList.contains('message-out'),
      timestamp: messageElement.getAttribute('data-pre-plain-timestamp'),
      content: messageElement.querySelector('.message-body')?.textContent,
      status: messageElement.getAttribute('data-status')
    };

    sendEvent('NEW_MESSAGE', messageInfo);
  }

  function checkForNewMessages() {
    const messages = document.querySelectorAll(MESSAGE_SELECTOR);
    messages.forEach(message => {
      if (!message.dataset.processed) {
        message.dataset.processed = 'true';
        processNewMessage(message);
      }
    });
  }

  const messageContainer = document.querySelector(MESSAGE_CONTAINER_SELECTOR);
  if (messageContainer) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          checkForNewMessages();
        }
      });
    });

    observer.observe(messageContainer, {
      childList: true,
      subtree: true
    });
  }
}

// Função para capturar status das conversas
function captureChatStatus() {
  const CHAT_SELECTOR = '.chat-list-item';

  function processChat(chatElement) {
    const chatInfo = {
      id: chatElement.getAttribute('data-id'),
      name: chatElement.querySelector('.chat-title')?.textContent,
      lastMessage: chatElement.querySelector('.message-preview')?.textContent,
      unreadCount: chatElement.querySelector('.unread-count')?.textContent
    };

    sendEvent('CHAT_STATUS', chatInfo);
  }

  function checkChats() {
    const chats = document.querySelectorAll(CHAT_SELECTOR);
    chats.forEach(processChat);
  }

  const chatList = document.querySelector('.chat-list');
  if (chatList) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          checkChats();
        }
      });
    });

    observer.observe(chatList, {
      childList: true,
      subtree: true
    });
  }
}

// Inicialização do script injetado
function init() {
  if (!isWhatsAppWeb()) {
    console.log('Not on WhatsApp Web');
    return;
  }

  console.log('Injected script initialized');

  captureMessages();
  captureChatStatus();
}

// Executar
init();