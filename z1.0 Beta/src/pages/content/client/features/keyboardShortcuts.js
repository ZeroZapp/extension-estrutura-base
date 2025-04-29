import { archiveActiveChat } from './chatActions'; // Import the action

/**
 * Handles the keydown event to detect the archive shortcut (Ctrl+E).
 * @param event The KeyboardEvent object.
 */
function handleArchiveShortcut(event) {
    // Log detailed info for debugging if needed
    // console.log('[keyboardShortcuts Debug] Keydown event:', { key: event.key, code: event.code, ctrlKey: event.ctrlKey, altKey: event.altKey, shiftKey: event.shiftKey, metaKey: event.metaKey });

    // Check for Ctrl + E (case-insensitive)
    if (event.ctrlKey && event.key.toLowerCase() === 'e') {
      console.log('[keyboardShortcuts] Ctrl+E detected.');
      event.preventDefault(); // Prevent default browser action (e.g., search)
      event.stopPropagation(); // Stop the event from bubbling up
      archiveActiveChat(); // Call the archive function
    }
}

/**
 * Initializes the keyboard shortcut listener.
 */
export function setupKeyboardShortcuts() {
    console.log('[keyboardShortcuts] Setting up keyboard shortcut listener for Ctrl+E.');
    // Remove existing listener first to prevent duplicates if this runs multiple times
    document.removeEventListener('keydown', handleArchiveShortcut);
    document.addEventListener('keydown', handleArchiveShortcut);
}

/**
 * Removes the keyboard shortcut listener.
 */
export function removeKeyboardShortcuts() {
    console.log('[keyboardShortcuts] Removing keyboard shortcut listener.');
    document.removeEventListener('keydown', handleArchiveShortcut);
}