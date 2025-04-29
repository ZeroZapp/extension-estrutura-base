// src/pages/content/client/utils/storeUtils.js
import { findReactAsync } from './domUtils';

/**
 * Waits for window.Store and specified modules to be available.
 * @param {string[]} [requiredModules=['Chat', 'Cmd', 'WidFactory']] The modules to wait for.
 * @param {number} [timeout=30000] The maximum time to wait in milliseconds.
 * @param {number} [interval=200] The interval between checks in milliseconds.
 * @returns {Promise<void>} A promise that resolves when Store and modules are available.
 */
function waitForStore(requiredModules = ['Chat', 'Cmd', 'WidFactory'], timeout = 30000, interval = 200) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const store = window.Store;
      let allModulesFound = !!store;
      let missingModules = [];

      if (allModulesFound) {
        for (const moduleName of requiredModules) {
          if (!(store)[moduleName]) {
            allModulesFound = false;
            missingModules.push(moduleName);
          }
        }
      } else {
        missingModules.push('window.Store itself');
      }

      if (allModulesFound) {
        clearInterval(checkInterval);
        console.log(`[waitForStore - Success] Store and required modules [${requiredModules.join(', ')}] found after ${Date.now() - startTime}ms.`);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        const errorMsg = `Timeout waiting for window.Store and/or required modules [${missingModules.join(', ')}] after ${timeout / 1000} seconds.`;
        console.error(`[waitForStore - Timeout] ${errorMsg}`);
        reject(new Error(errorMsg));
      }
    }, interval);
  });
}

/**
 * Waits for the Store to be ready and then attempts to unarchive a specific chat.
 * @param {string} chatId The chat ID to unarchive.
 * @param {number} [retries=10] The number of retry attempts.
 * @param {number} [delay=500] The delay between retries in milliseconds.
 * @returns {Promise<{status: string, action?: string, message?: string}>} A promise that resolves with the operation result.
 */
async function waitForStoreAndUnarchive(chatId, retries = 10, delay = 500) {
  console.log(`[waitForStoreAndUnarchive - Start] Waiting for Store. ChatID: ${chatId}, Attempt: ${11 - retries}/10.`);
  const requiredModules = ['Chat', 'Cmd', 'WidFactory'];
  let storeReady = !!window.Store;
  let missingModulesWait = [];

  if (storeReady) {
    requiredModules.forEach(mod => {
      if (!(window.Store)[mod]) {
        storeReady = false;
        missingModulesWait.push(`Store.${mod}`);
      }
    });
  } else {
    missingModulesWait.push('window.Store');
  }

  if (storeReady) {
    console.log(`[waitForStoreAndUnarchive] Store is ready for ${chatId}. Proceeding with unarchive.`);
    try {
      const chatWid = window.Store.WidFactory.createWid(chatId);
      const chatModel = await window.Store.Chat.find(chatWid);
      if (chatModel && chatModel.archive) {
        console.log(`[waitForStoreAndUnarchive] Attempting to unarchive ${chatId}...`);
        await window.Store.Cmd.archiveChat(chatModel, false);
        console.log(`[waitForStoreAndUnarchive] Unarchive command sent for ${chatId}.`);
        return { status: 'ok', action: 'unarchived_attempted' };
      } else if (chatModel) {
        console.log(`[waitForStoreAndUnarchive] Chat ${chatId} already unarchived.`);
        return { status: 'ok', action: 'already_unarchived' };
      } else {
        console.warn(`[waitForStoreAndUnarchive] Chat model not found for ${chatId}.`);
        return { status: 'ok', action: 'not_found' };
      }
    } catch (e) {
      console.error(`[waitForStoreAndUnarchive] Error during unarchive process for ${chatId}:`, e);
      return { status: 'error', message: e.message || 'Unknown error during unarchive' };
    }
  } else if (retries > 0) {
    console.log(`[waitForStoreAndUnarchive - Retry] Store not ready for ${chatId}. Missing: ${missingModulesWait.join(', ')}. Retrying in ${delay}ms...`);
    return new Promise(resolve => {
      setTimeout(async () => {
        const result = await waitForStoreAndUnarchive(chatId, retries - 1, delay);
        resolve(result);
      }, delay);
    });
  } else {
    console.error(`[waitForStoreAndUnarchive - Fail] Store or required modules not ready for ${chatId} after multiple retries. Missing: ${missingModulesWait.join(', ')}`);
    return { status: 'error', message: `Store or modules (${missingModulesWait.join(', ')}) not ready after retries` };
  }
}

/**
 * Attempts to find the Model object for the currently active/selected chat in the WhatsApp UI.
 * @returns {Promise<any | null>} A promise that resolves with the chat model or null if not found.
 */
async function getActiveChatModel() {
  console.log('[getActiveChatModel] Attempting to get active chat model...');

  // 1. Try via selected list item
  const activeChatElement = document.querySelector('#pane-side [role="listitem"] [aria-selected="true"]')?.closest('[role="listitem"]');
  if (activeChatElement) {
    try {
      const elementProps = await findReactAsync(activeChatElement);
      const chatModel = elementProps?.children?.props?.children?.props?.model || elementProps?.children?.[0]?.props?.chat;
      if (chatModel?.id?._serialized) {
        console.log(`[getActiveChatModel] Found active chat model via list item: ${chatModel.id._serialized}`);
        return chatModel;
      }
    } catch (e) {
      console.error('[getActiveChatModel] Error finding chat model from list item props:', e);
    }
  }

  // 2. Try via main chat header (if a chat is open)
  const headerElement = document.querySelector('#main > header');
  if (headerElement) {
    try {
      const headerProps = await findReactAsync(headerElement);
      const chatModel = headerProps?.children?.[0]?.props?.chat;
      if (chatModel?.id?._serialized) {
        console.log(`[getActiveChatModel] Found active chat model via header: ${chatModel.id._serialized}`);
        return chatModel;
      }
    } catch (e) {
      console.error('[getActiveChatModel] Error finding chat model from header props:', e);
    }
  }

  console.warn('[getActiveChatModel] Could not find active chat model via list item or header.');
  return null;
}