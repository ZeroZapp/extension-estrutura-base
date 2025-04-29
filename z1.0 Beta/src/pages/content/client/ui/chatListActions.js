// src/pages/content/client/ui/chatListActions.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import ActionButton from '@pages/content/ui/button';
import { Model } from '@pages/content/types/index';
import { findReactAsync } from '../utils/domUtils';
import { onDelayedAction } from '../features/chatActions';
import injectedStyle from '@pages/content/ui/injected.css?inline';

const BUTTON_CONTAINER_CLASS = 'zerozapp-action-buttons-container';
const CHAT_LIST_ITEM_SELECTOR = '#pane-side [role="listitem"]';
const PROCESSED_MARKER_ATTR = 'data-zerozapp-processed';

/**
 * Injects the ActionButton (snooze) into a single chat list item element.
 * @param {Element} element The chat list item DOM element.
 */
async function injectButtonIntoChatItem(element) {
    // Avoid processing the same element multiple times
    if (element.hasAttribute(PROCESSED_MARKER_ATTR)) {
        return;
    }
    element.setAttribute(PROCESSED_MARKER_ATTR, 'true');

    // Check if a button container already exists (e.g., from a previous script version)
    if (element.querySelector(`.${BUTTON_CONTAINER_CLASS}`)) {
        console.log('[chatListActions] Button container already exists for this item. Skipping injection.');
        return;
    }

    let chatModel = null;
    try {
        const elementProps = await findReactAsync(element);
        // Try common paths to find the model within the element's React props
        chatModel = elementProps?.children?.props?.children?.props?.model ||
                    elementProps?.children?.[0]?.props?.chat;

        if (!chatModel?.id?._serialized) {
            // console.warn('[chatListActions] Could not extract chat model from list item props.');
            element.removeAttribute(PROCESSED_MARKER_ATTR); // Allow reprocessing if model wasn't found
            return; // Cannot add button without model context
        }
        // console.log(`[chatListActions] Found chat model: ${chatModel.id._serialized}`);
    } catch (e) {
        console.error('[chatListActions] Error finding chat model from list item props:', e);
        element.removeAttribute(PROCESSED_MARKER_ATTR); // Allow reprocessing on error
        return; // Don't add button on error
    }

    // --- Find Injection Point ---
    // Find the main container within the list item based on inspection
    const mainContentContainer = element.querySelector('div._ak8l');
    const listItemContainer = element.querySelector('div._ak72'); // Seems correct based on logs/HTML

    if (!mainContentContainer || !listItemContainer) {
        console.warn('[chatListActions] Could not find necessary containers (mainContent or listItem) within list item. Selectors may need update.', { mainContentContainer, listItemContainer });
        element.removeAttribute(PROCESSED_MARKER_ATTR);
        return;
    }

    // --- Create and Inject Button Container ---
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add(BUTTON_CONTAINER_CLASS);
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.alignItems = 'center';
    buttonsContainer.style.marginLeft = '8px'; // Add some space
    buttonsContainer.style.flexShrink = '0';

    // Inject the button container next to the main content block
    // We'll insert it *after* the main content container within the list item container
    if (listItemContainer instanceof HTMLElement && mainContentContainer.parentNode === listItemContainer) {
         // Apply flex to parent if needed, ensure alignment
         listItemContainer.style.display = 'flex';
         listItemContainer.style.alignItems = 'center';
         listItemContainer.style.justifyContent = 'space-between'; // Push button container to the right

        // Insert the button container
        listItemContainer.insertBefore(buttonsContainer, mainContentContainer.nextSibling);
        // console.log('[chatListActions] Injected button container into:', listItemContainer);
    } else {
        console.warn('[chatListActions] Could not reliably inject button container. Parent structure mismatch.');
        element.removeAttribute(PROCESSED_MARKER_ATTR);
        return;
    }


    // --- Render Button Component ---
    try {
        const shadow = buttonsContainer.attachShadow({ mode: 'open' });
        const shadowRootElement = document.createElement('div');
        shadow.appendChild(shadowRootElement);

        const styleElement = document.createElement('style');
        styleElement.innerHTML = injectedStyle;
        shadow.appendChild(styleElement);

        createRoot(shadowRootElement).render(
            <React.StrictMode>
                <ActionButton
                    onSelectDatetime={(datetime) => {
                        // Pass the specific chatModel for this item to the action handler
                        if (chatModel) {
                            onDelayedAction(datetime, chatModel);
                        } else {
                            console.error('[chatListActions] chatModel is null when onSelectDatetime was called.');
                        }
                    }}
                />
            </React.StrictMode>
        );
        // console.log(`[chatListActions] Rendered ActionButton for chat ${chatModel.id._serialized}`);
    } catch (renderError) {
        console.error(`[chatListActions] Error rendering ActionButton for chat ${chatModel?.id?._serialized}:`, renderError);
        buttonsContainer.remove(); // Clean up if render fails
        element.removeAttribute(PROCESSED_MARKER_ATTR);
    }
}

/**
 * Finds all chat list items currently in the DOM and attempts to inject the button into each.
 */
async function processChatListItems() {
    const listItems = document.querySelectorAll(CHAT_LIST_ITEM_SELECTOR);
    // console.log(`[chatListActions] Found ${listItems.length} chat list items to process.`);
    for (const item of listItems) {
        // Process items sequentially with a small delay to avoid overwhelming the browser
        await injectButtonIntoChatItem(item);
        await new Promise(resolve => setTimeout(resolve, 10)); // Small delay between processing items
    }
}

// --- Initialization and Observation ---
let chatListObserver = null;
let intervalId = null;

/**
 * Starts observing the chat list for changes and periodically processes items.
 */
export function initChatListActions() {
    console.log('[chatListActions] Initializing chat list processing.');

    // Initial processing run
    processChatListItems();

    // --- Periodic Check (Fallback / Simple Approach) ---
    // Clear any existing interval first
    if (intervalId) clearInterval(intervalId);
    // Set interval to periodically check and process new/unprocessed items
    intervalId = setInterval(processChatListItems, 5000); // Check every 5 seconds
    console.log('[chatListActions] Started periodic check interval (5s).');


    // --- MutationObserver (More Efficient Approach - Optional) ---
    /*
    const paneSide = document.getElementById('pane-side');
    if (paneSide) {
        if (chatListObserver) chatListObserver.disconnect(); // Disconnect previous observer if any

        chatListObserver = new MutationObserver((mutations) => {
            let needsProcessing = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if added nodes are list items or contain list items
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof Element && (node.matches(CHAT_LIST_ITEM_SELECTOR) || node.querySelector(CHAT_LIST_ITEM_SELECTOR))) {
                            needsProcessing = true;
                        }
                    });
                }
                // Optionally, observe attribute changes if needed, e.g., selection changes
            }
            if (needsProcessing) {
                console.log('[chatListActions] Detected chat list changes via MutationObserver.');
                processChatListItems(); // Process the list on detected changes
            }
        });

        chatListObserver.observe(paneSide, {
            childList: true, // Observe direct children additions/removals
            subtree: true,   // Observe additions/removals in the entire subtree
            // attributes: false, // Add if needed
        });
        console.log('[chatListActions] Started MutationObserver for #pane-side.');
    } else {
        console.warn('[chatListActions] Could not find #pane-side to attach MutationObserver. Falling back to interval.');
        // Fallback to interval if observer setup fails
        if (!intervalId) {
             intervalId = setInterval(processChatListItems, 7000);
             console.log('[chatListActions] Started periodic check interval (7s) as fallback.');
        }
    }
    */
}

/**
 * Stops observing the chat list and clears the interval.
 */
export function stopChatListActions() {
    if (chatListObserver) {
        chatListObserver.disconnect();
        chatListObserver = null;
        console.log('[chatListActions] Stopped MutationObserver.');
    }
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('[chatListActions] Cleared periodic check interval.');
    }
}