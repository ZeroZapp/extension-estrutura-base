// src/pages/content/client/ui/summaryManager.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import SummaryDisplay from '@pages/content/ui/SummaryDisplay.jsx';

let summaryRoot = null;
let summaryContainer = null;

// State for managing the summary display
let summaryState = {
  show: false,
  content: '',
  chatId: '',
  isLoading: false,
  error: null
};

/**
 * Renders or updates the SummaryDisplay component based on the current state.
 */
function renderSummaryUI() {
  if (!summaryContainer) {
    summaryContainer = document.createElement('div');
    summaryContainer.id = 'summary-container';
    document.body.appendChild(summaryContainer);
  }

  if (!summaryRoot) {
    summaryRoot = createRoot(summaryContainer);
  }

  if (summaryState.show) {
    summaryRoot.render(
      <React.StrictMode>
        <SummaryDisplay
          content={summaryState.content}
          isLoading={summaryState.isLoading}
          error={summaryState.error}
          onClose={hideSummary}
        />
      </React.StrictMode>
    );
  } else if (!summaryState.show && summaryRoot) {
    summaryRoot.unmount();
    summaryRoot = null;
    if (summaryContainer && summaryContainer.parentNode) {
      summaryContainer.parentNode.removeChild(summaryContainer);
    }
    summaryContainer = null;
  }
}

/**
 * Shows the summary display.
 * @param {string} chatId The ID of the chat being summarized.
 */
function showSummary(chatId) {
  summaryState = {
    ...summaryState,
    show: true,
    chatId,
    isLoading: true,
    content: '',
    error: null
  };
  renderSummaryUI();
}

/**
 * Hides the summary display and resets its state.
 */
function hideSummary() {
  summaryState = {
    show: false,
    content: '',
    chatId: '',
    isLoading: false,
    error: null
  };
  renderSummaryUI();
}

/**
 * Updates the summary content.
 * @param {string} content The summary text.
 */
function setSummaryContent(content) {
  summaryState = {
    ...summaryState,
    content,
    isLoading: false,
    error: null
  };
  renderSummaryUI();
}

/**
 * Sets the summary display to an error state.
 * @param {string} error The error message.
 */
function setSummaryError(error) {
  summaryState = {
    ...summaryState,
    error,
    isLoading: false
  };
  renderSummaryUI();
}

/**
 * Sets the summary display to a loading state.
 */
function setSummaryLoading() {
  summaryState = {
    ...summaryState,
    isLoading: true,
    error: null
  };
  renderSummaryUI();
}

/**
 * Initializes the summary manager (currently just ensures the UI is initially hidden).
 */
function initSummaryManager() {
  // Ensure the summary is hidden on initialization
  hideSummary();
}

export {
  showSummary,
  hideSummary,
  setSummaryContent,
  setSummaryError,
  setSummaryLoading,
  initSummaryManager
};