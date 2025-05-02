import { Model } from '@pages/content/types/index';
import { findReactAsync } from '../utils/domUtils'; // Adjust path as needed

/**
 * Extracts messages from a given chat model object.
 * @param chatModelParam The chat model object.
 * @returns A JSON string representing the messages, or '[]' if none found.
 */
export function extractMessagesFromModel(chatModelParam) {
  console.log(`[messageUtils] Extracting messages for chat: ${chatModelParam?.id?._serialized || 'UNKNOWN'}`);
  if (!chatModelParam?.msgs?._models || chatModelParam.msgs._models.length === 0) {
    console.warn(`[messageUtils] No messages found in chat ${chatModelParam?.id?._serialized || 'UNKNOWN'}`);
    return '[]'; // Return empty JSON array string
  }

  const messages = chatModelParam.msgs._models.map(msg => ({
    id: msg.id?._serialized,
    timestamp: msg.t, // Message timestamp
    sender: msg.id?.fromMe ? 'me' : msg.sender?.shortName || msg.sender?.pushname || msg.id?.remote?.user, // Sender info
    type: msg.type, // Message type (chat, image, etc.)
    body: msg.body || msg.caption || '[Media without text]', // Message content
  }));

  console.log(`[messageUtils] Extracted ${messages.length} messages from chat ${chatModelParam.id._serialized}.`);
  return JSON.stringify(messages, null, 2); // Return formatted JSON string
}

/**
 * Attempts to get the messages JSON for the currently active chat by finding its model via the DOM.
 * @returns A promise that resolves with the JSON string of messages or null if the active chat/model cannot be found.
 */
export async function getMessagesJsonForActiveChat() {
  console.log('[messageUtils] Attempting to get active chat messages via DOM...');

  // 1. Find the active chat list item element
  const activeChatElement = document.querySelector('#pane-side [role="listitem"] [aria-selected="true"]')?.closest('[role="listitem"]');

  if (!activeChatElement) {
    console.warn('[messageUtils] Could not find active chat list item element. Trying header fallback...');
    // Fallback: Try finding the chat model via the main header
    const headerElement = document.querySelector('#main > header');
    if (headerElement) {
        try {
            const headerProps = await findReactAsync(headerElement);
            const chatModelFromHeader = headerProps?.children?.[0]?.props?.chat; // Path from original code
             if (chatModelFromHeader?.id?._serialized) {
                 console.log(`[messageUtils] Found active chat via header: ${chatModelFromHeader.id._serialized}`);
                 return extractMessagesFromModel(chatModelFromHeader); // Extract messages from this model
             }
        } catch (e) {
            console.error('[messageUtils] Error finding chat model from header props:', e);
        }
    }
     console.warn('[messageUtils] No active chat found via list item or header.');
    return null; // Could not find active chat
  }

  // 2. Extract the chat model from the list item element
  let activeChatModel = null;
  try {
      const elementProps = await findReactAsync(activeChatElement);
      // Paths from original code (makeActions and getActiveChatModel)
      activeChatModel = elementProps?.children?.props?.children?.props?.model ||
                        elementProps?.children?.[0]?.props?.chat;

      if (!activeChatModel?.id?._serialized) {
           console.warn('[messageUtils] Could not extract chat model from active list item props.');
           return null;
      }
       console.log(`[messageUtils] Found active chat via list item: ${activeChatModel.id._serialized}`);
  } catch (e) {
      console.error('[messageUtils] Error finding chat model from list item props:', e);
      return null;
  }

  // 3. Extract messages from the found model
  return extractMessagesFromModel(activeChatModel);
}