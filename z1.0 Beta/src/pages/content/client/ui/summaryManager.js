// src/pages/content/client/ui/summaryManager.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import SummaryDisplay from '@pages/content/ui/SummaryDisplay';

let summaryRoot = null;
let summaryContainer = null;

// State for managing the summary display
interface SummaryState {
  show: boolean;
  content: string;
  chatId: string;
  isLoading: boolean;
  error: string | null;
}

let summaryState: SummaryState = {
  show: false,
  content: '',
  chatId: '',
  isLoading: false,
  error: null,
};

/**
 * Renders or updates the SummaryDisplay component based on the current state.
 */
function renderSummaryUI() {
    if (!summaryContainer) {
        summaryContainer = document.createElement('div');
        summaryContainer.id = 'zerozapp-summary-container';
        const appContainer = document.getElementById('app') || document.body;
        appContainer.appendChild(summaryContainer);
        console.log('[summaryManager] Created summary container.');
    }

    if (summaryState.show && !summaryRoot) {
        summaryRoot = createRoot(summaryContainer);
        console.log('[summaryManager] Created summary React root.');
    }

    if (summaryState.show && summaryRoot) {
        console.log('[summaryManager] Rendering SummaryDisplay with state:', summaryState);
        summaryRoot.render(
            <React.StrictMode>
                <SummaryDisplay
                    summary={
                        summaryState.isLoading ? 'Gerando resumo...' :
                        summaryState.error ? `Erro: ${summaryState.error}` :
                        summaryState.content
                    }
                    chatId={summaryState.chatId}
                    onClose={() => {
                        hideSummary();
                    }}
                />
            </React.StrictMode>
        );
    } else if (!summaryState.show && summaryRoot) {
        console.log('[summaryManager] Unmounting SummaryDisplay.');
        summaryRoot.unmount();
        summaryRoot = null;
    }
}

/**
 * Shows the summary display.
 * @param {string} chatId The ID of the chat being summarized.
 */
export function showSummary(chatId: string) {
    console.log(`[summaryManager] Showing summary for chat: ${chatId}`);
    summaryState = {
        ...summaryState,
        show: true,
        chatId: chatId,
        isLoading: true,
        error: null,
    };
    renderSummaryUI();
}

/**
 * Hides the summary display and resets its state.
 */
export function hideSummary() {
    console.log('[summaryManager] Hiding summary.');
    summaryState = {
        show: false,
        content: '',
        chatId: '',
        isLoading: false,
        error: null,
    };
    renderSummaryUI();
}

/**
 * Updates the summary content.
 * @param {string} content The summary text.
 */
export function setSummaryContent(content: string) {
    console.log('[summaryManager] Setting summary content.');
    summaryState = {
        ...summaryState,
        content: content,
        isLoading: false,
        error: null,
    };
    if (summaryState.show) {
        renderSummaryUI();
    }
}

/**
 * Sets the summary display to an error state.
 * @param {string} error The error message.
 */
export function setSummaryError(error: string) {
    console.error('[summaryManager] Setting summary error:', error);
    summaryState = {
        ...summaryState,
        content: '',
        isLoading: false,
        error: error,
    };
    if (summaryState.show) {
        renderSummaryUI();
    }
}

/**
 * Sets the summary display to a loading state.
 */
export function setSummaryLoading() {
    console.log('[summaryManager] Setting summary to loading state.');
    summaryState = {
        ...summaryState,
        isLoading: true,
        content: '',
        error: null,
    };
    if (summaryState.show) {
        renderSummaryUI();
    }
}

/**
 * Initializes the summary manager (currently just ensures the UI is initially hidden).
 */
export function initSummaryManager() {
    console.log('[summaryManager] Initializing.');
    hideSummary();
}