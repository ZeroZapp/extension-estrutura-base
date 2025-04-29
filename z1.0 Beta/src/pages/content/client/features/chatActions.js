import moment from 'moment-timezone';
import { Model } from '@pages/content/types/index';
import { getActiveChatModel } from '../utils/storeUtils'; // Import necessary utility

// --- Snooze Action ---

/**
 * Handles the action to "snooze" a chat.
 * This involves archiving the chat immediately and sending a message
 * to the background script/content script bridge to schedule its unarchiving.
 * @param datetime The ISO datetime string when the chat should reappear (UTC).
 * @param chatModel The model object of the chat to snooze.
 */
export const onDelayedAction = async (datetime, chatModel) => {
  // Update global selection state (if still needed, otherwise remove)
  window.lastSelection = window.lastSelection || { datetime: '', text: '' }; // Ensure it exists and conforms to type
  window.lastSelection.datetime = datetime;
  console.log('[chatActions] Updated window.lastSelection.datetime to:', datetime);
  console.log('[chatActions] onDelayedAction triggered for:', chatModel.id._serialized, 'at', datetime);

  // Check for required Store modules before proceeding
  const requiredStoreModules = ['WidFactory', 'ProfilePic', 'Chat', 'Cmd'];
  let storeReady = !!window.Store;
  let missingOnDelayedAction = [];
  if (storeReady) {
      requiredStoreModules.forEach(mod => {
          if (!(window.Store)[mod]) {
              storeReady = false;
              missingOnDelayedAction.push(`Store.${mod}`);
          }
      });
  } else {
      missingOnDelayedAction.push('window.Store');
  }

  if (!storeReady) {
      console.error(`[chatActions - onDelayedAction] window.Store or required modules not ready! Missing: ${missingOnDelayedAction.join(', ')}`);
      // Maybe notify the user here?
      return;
  }

  const datetimeUTC = moment(datetime).utc().format(); // Ensure UTC format
  const nowUTC = moment().utc().format();
  const chatWid = window.Store.WidFactory.createWid(chatModel.id._serialized);
  const last_message = chatModel.msgs?._models?.[chatModel.msgs._models.length - 1]; // Get the actual last message
  let profilePicture = null;

  try {
    const profile = await window.Store.ProfilePic.requestProfilePicFromServer(chatWid);
    profilePicture = profile?.eurl;
  } catch (error) {
    console.warn('[chatActions - onDelayedAction] Could not get profile pic:', error);
  }

  // --- Immediate Archiving ---
  try {
      if (window.Store?.Cmd?.archiveChat) {
           console.log(`[chatActions - onDelayedAction] Archiving chat ${chatModel.id._serialized} immediately...`);
           await window.Store.Cmd.archiveChat(chatModel, true); // true to archive
           console.log(`[chatActions - onDelayedAction] Chat ${chatModel.id._serialized} archived.`);
      } else {
           console.error('[chatActions - onDelayedAction] Store.Cmd.archiveChat not available, cannot archive.');
           // Notify user? Fallback?
      }
  } catch (archiveError) {
       console.error(`[chatActions - onDelayedAction] Error during immediate archiving for ${chatModel.id._serialized}:`, archiveError);
       // Notify user?
  }
  // --- End Archiving ---

  // Send message for scheduling the unarchive action
  console.log(`[chatActions - onDelayedAction] Sending schedule data for ${chatModel.id._serialized} via postMessage`);
  window.postMessage({
      to: 'content', // Target the content script listener
      event: 'delayed', // Custom event name for snoozing
      payload: {
        identifier: chatModel.id._serialized,
        picture: profilePicture,
        user: chatModel.id.user,
        title: chatModel.formattedTitle,
        type: chatModel.groupMetadata ? 'group' : 'chat',
        last_message_id: last_message?.id?._serialized, // Send ID if available
        datetime: datetimeUTC, // Snooze until time (UTC)
        now: nowUTC, // Time the snooze was set (UTC)
      },
  }, '*');
};


// --- Single Chat Archive Action (for shortcut) ---

/**
 * Archives the currently active chat. Used by keyboard shortcuts.
 */
export async function archiveActiveChat() {
    console.log('[chatActions - Shortcut] archiveActiveChat called.');
    // Check specifically for Store.Cmd.archiveChat
    if (!window.Store?.Cmd?.archiveChat) {
      console.error(`[chatActions - Shortcut] Store.Cmd.archiveChat not available. Store exists: ${!!window.Store}, Store.Cmd exists: ${!!window.Store?.Cmd}`);
      // Notify user?
      return;
    }

    const activeChatModel = await getActiveChatModel(); // Use utility function

    if (activeChatModel) {
      try {
        console.log(`[chatActions - Shortcut] Archiving chat ${activeChatModel.id._serialized}...`);
        // Ensure chat is closed before archiving if it's active? (Original code had this check in bulk archive)
        // if (activeChatModel.active && window.Store.Cmd.closeChat) {
        //     await window.Store.Cmd.closeChat(activeChatModel);
        // }
        await window.Store.Cmd.archiveChat(activeChatModel, true); // true to archive
        console.log(`[chatActions - Shortcut] Chat ${activeChatModel.id._serialized} archived successfully via shortcut.`);
      } catch (error) {
        console.error(`[chatActions - Shortcut] Error archiving chat ${activeChatModel.id._serialized}:`, error);
        // Notify user?
      }
    } else {
      console.warn('[chatActions - Shortcut] No active chat found to archive.');
      // Notify user?
    }
}


// --- Bulk Archive Actions (from Menu) ---

let cancelArchiveRequested = false; // Module-level flag for cancellation

/**
 * Initiates the cancellation of an ongoing bulk archive process.
 */
export function requestCancelBulkArchive() {
    console.log('[chatActions] Received cancel-archive request.');
    cancelArchiveRequested = true;
}

/**
 * Handles the bulk archiving of chats based on the selected menu option.
 * @param key The key corresponding to the menu option ('archive-groups', 'archive-chats', 'archive-all').
 */
export async function handleBulkArchive(key) {
    console.log('[chatActions - Bulk] Handling bulk archive request for key:', key);

    // Check for required Store modules
    const requiredArchiveModules = ['Chat', 'Cmd'];
    let archiveStoreReady = !!window.Store;
    let missingForArchive = [];
    if(archiveStoreReady) {
        requiredArchiveModules.forEach(mod => {
            if (!(window.Store)[mod]) {
                archiveStoreReady = false;
                missingForArchive.push(`Store.${mod}`);
            }
        });
    } else {
        missingForArchive.push('window.Store');
    }

    if (!archiveStoreReady) {
      console.error(`[chatActions - Bulk] Store or required modules not ready for archiving! Missing: ${missingForArchive.join(', ')}`);
      // Notify UI about failure?
      window.postMessage({ event: 'archive-process-finished', to: 'react-ui', error: `Store not ready: Missing ${missingForArchive.join(', ')}` }, '*');
      return;
    }

    let chatsToArchive = [];
    const allChats = window.Store.Chat._models || [];

    if (key === 'archive-groups') chatsToArchive = allChats.filter(c => c.groupMetadata && !c.archive);
    else if (key === 'archive-chats') chatsToArchive = allChats.filter(c => !c.groupMetadata && !c.archive);
    else if (key === 'archive-all') chatsToArchive = allChats.filter(c => !c.archive);
    else {
        console.warn(`[chatActions - Bulk] Unknown or non-archive key received: ${key}`);
        return; // Not an archive action we handle here
    }

    // Reset cancellation flag before starting
    cancelArchiveRequested = false;
    const totalChats = chatsToArchive.length;
    console.log(`[chatActions - Bulk] Starting archive process for ${totalChats} chats.`);
    // Notify UI that process started (optional)
    window.postMessage({ event: 'archive-process-started', to: 'react-ui', total: totalChats }, '*');


    if (totalChats > 0) {
      for (let i = 0; i < totalChats; i++) {
        const chat = chatsToArchive[i];
        // Check for cancellation before processing each chat
        if (cancelArchiveRequested) {
          console.log('[chatActions - Bulk] Archive process cancelled by user.');
          break; // Exit the loop
        }

        console.log(`[chatActions - Bulk] Archiving chat ${chat.id._serialized} (${i + 1}/${totalChats})`);
        try {
          // Close chat if it's active before archiving (important for stability)
          if (chat.active && window.Store.Cmd.closeChat) {
            console.log(`[chatActions - Bulk] Closing active chat ${chat.id._serialized} before archiving.`);
            await window.Store.Cmd.closeChat(chat);
            await new Promise(resolve => setTimeout(resolve, 150)); // Small delay after closing
          }

          await window.Store.Cmd.archiveChat(chat, true);
          console.log(`[chatActions - Bulk] Chat ${chat.id._serialized} archived (${i + 1}/${totalChats})`);

          // Notify UI about progress
          window.postMessage({ event: 'archive-progress', to: 'react-ui', current: i + 1, total: totalChats }, '*');

        } catch (error) {
          console.error(`[chatActions - Bulk] Error archiving chat ${chat.id._serialized}:`, error);
          // Continue with next chat even if one fails
        }
      }

      // Notify UI that process is complete
      window.postMessage({ event: 'archive-process-finished', to: 'react-ui', success: true }, '*');
    } else {
      console.log('[chatActions - Bulk] No chats to archive for key:', key);
      // Notify UI about no chats found?
      window.postMessage({ event: 'archive-process-finished', to: 'react-ui', success: false, message: 'No chats found to archive' }, '*');
    }
}