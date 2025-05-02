import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import React from 'react'; // Keep React import if any top-level JSX remains or for StrictMode potentially
import { NextUIProvider } from '@nextui-org/react'; // Keep if used by any injected component implicitly

// Local Utilities & Features
import { waitForSelector } from './utils/domUtils';
import { waitForStore } from './utils/storeUtils';
import { setupKeyboardShortcuts } from './features/keyboardShortcuts';
import { initSummaryManager } from './ui/summaryManager';
import { injectMenu } from './ui/menuManager';
import { initChatListActions } from './ui/chatListActions'; // Import the new module

// Styles
import injectedStyle from '@pages/content/ui/injected.css?inline'; // Keep if menuManager or summaryManager rely on it implicitly via shadow DOM

refreshOnUpdate('');
console.log('👋 [inicializer] Initializing refactored script... - Script execution started');

// Initial check (optional, but can be useful for debugging)
console.log('[inicializer - Initial Check] Store status:', { 'typeof window.Store': typeof window.Store });

// Selector to wait for before initializing features that interact with the WA UI
const INITIAL_ELEMENT_SELECTOR = "[data-icon='new-chat-outline']"; // Or a more stable selector if available

// Global state (consider moving to a dedicated state management solution if it grows)
// Ensure window.d.ts defines this structure
window.lastSelection = window.lastSelection || { datetime: '', text: '' };

// --- Main Initialization Logic ---
waitForSelector(INITIAL_ELEMENT_SELECTOR, 15000) // Wait for up to 15 seconds
  .then(async (element) => {
    if (!element) {
        console.error(`[inicializer] Initial element ('${INITIAL_ELEMENT_SELECTOR}') not found after timeout. Initialization aborted.`);
        // Maybe notify the user or background script?
        return;
    }
    console.log(`[inicializer] Initial element ('${INITIAL_ELEMENT_SELECTOR}') found. Proceeding with initialization...`);

    // Request module loading from the background/content script
    try {
        console.log('[inicializer] Requesting module load via postMessage...');
        window.postMessage({ event: 'load-modules', to: 'content' }, '*');

        // Wait for WhatsApp's internal Store and necessary modules to be ready
        console.log('[inicializer] Waiting for window.Store and modules [Chat, Cmd, WidFactory, ProfilePic]...');
        // Add ProfilePic as it's used in chatActions
        await waitForStore(['Chat', 'Cmd', 'WidFactory', 'ProfilePic']);
        console.log('[inicializer] Successfully waited for window.Store and required modules.');

        // Initialize UI Managers - AFTER window.Store is available
        console.log('[inicializer] Initializing UI Managers (initSummaryManager, injectMenu) - AFTER window.Store is available.');
        initSummaryManager();         // Sets up the container and initial state for the summary display
        injectMenu();           // Injects the main application menu into the header

        // Setup application features that depend on the Store
        setupKeyboardShortcuts(); // Activate Ctrl+E for archiving
        initChatListActions();    // Start injecting snooze buttons into the chat list

        console.log('[inicializer] Core initialization complete.');

    } catch (error) {
        console.error('[inicializer] Error during module load or Store wait:', error);
        // Consider notifying the user or stopping further initialization steps
        // Depending on the error, some features might still work partially.
    }
})
.catch(error => {
    // This catch is primarily for errors within waitForSelector itself, though unlikely
    console.error('[inicializer] Unexpected error during initial element wait:', error);
});

// Final log to indicate the script has run its course (initial setup phase)
console.log('[inicializer] Script finished initial setup.');

// Note: The listener for 'delayed' messages (for unarchiving) should be handled
// in the content script (e.g., src/pages/content/index.ts) which can reliably
// use chrome.runtime.onMessage and then call `waitForStoreAndUnarchive` from storeUtils.
// Similarly, handling responses for summarization requests would be in the content script.