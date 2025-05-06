// Inicializa o cliente do conteúdo
console.log('ZeroZapp: Inicializando cliente de conteúdo');

// Local Utilities & Features
import { waitForSelector } from './utils/domUtils';
import { waitForStore } from './utils/storeUtils';
import { initSummaryManager } from './ui/summaryManager';
import { injectMenu } from './ui/menuManager';
import { initChatListActions } from './ui/chatListActions';

console.log('👋 [inicializer] Initializing refactored script... - Script execution started');

// Initial check (optional, but can be useful for debugging)
console.log('[inicializer - Initial Check] Store status:', { 'typeof window.Store': typeof window.Store });

// Selector to wait for before initializing features that interact with the WA UI
const INITIAL_ELEMENT_SELECTOR = "[data-icon='new-chat-outline']"; // Or a more stable selector if available

// Global state (consider moving to a dedicated state management solution if it grows)
window.lastSelection = window.lastSelection || { datetime: '', text: '' };

// --- Main Initialization Logic ---
waitForSelector(INITIAL_ELEMENT_SELECTOR, 15000) // Wait for up to 15 seconds
  .then(async (element) => {
    if (!element) {
        console.error(`[inicializer] Initial element ('${INITIAL_ELEMENT_SELECTOR}') not found after timeout. Initialization aborted.`);
        return;
    }
    console.log(`[inicializer] Initial element ('${INITIAL_ELEMENT_SELECTOR}') found. Proceeding with initialization...`);

    try {
        console.log('[inicializer] Requesting module load via postMessage...');
        window.postMessage({ event: 'load-modules', to: 'content' }, '*');

        // Wait for WhatsApp's internal Store and necessary modules to be ready
        console.log('[inicializer] Waiting for window.Store and modules [Chat, Cmd, WidFactory, ProfilePic]...');
        await waitForStore(['Chat', 'Cmd', 'WidFactory', 'ProfilePic']);
        console.log('[inicializer] Successfully waited for window.Store and required modules.');

        // Initialize UI Managers - AFTER window.Store is available
        console.log('[inicializer] Initializing UI Managers (initSummaryManager, injectMenu, initChatListActions)');
        
        // Initialize summary manager
        initSummaryManager();
        
        // Inject menu
        injectMenu();
        
        // Initialize chat list actions
        initChatListActions();
        
        console.log('[inicializer] All UI managers initialized successfully.');
    } catch (error) {
        console.error('[inicializer] Error during initialization:', error);
    }
  })
  .catch((error) => {
    console.error('[inicializer] Error during initialization:', error);
  });

// Carrega o script principal
const script = document.createElement('script');
script.src = chrome.runtime.getURL('src/pages/content/injected/index.js');
script.type = 'module';

// Adiciona o script ao documento
const container = document.head || document.documentElement;
container.appendChild(script);