// src/pages/content/client/ui/menuManager.js
// This file handles injecting the ZeroZapp menu button and its dropdown using plain JavaScript.
// It reads menu options from menu.tsx and uses DOM manipulation for rendering and interaction.

// Import menu options data
import { menuOptions } from '@pages/content/ui/menu'; // Import menuOptions

// Import actions
import { handleBulkArchive, requestCancelBulkArchive } from '../features/chatActions';

let visualButtonContainer = null;
let dropdownMenuElement = null;

// State variables for archiving process
let isArchiving = false;
let currentArchivingKey = null;

// Define the Archive SVG icon HTML
const archiveIconHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
`;

async function handleSelectOption(key) {
    console.log('[menuManager] Menu option selected:', key);

    if (dropdownMenuElement) {
        dropdownMenuElement.style.display = 'none';
    }

    if (typeof key === 'string' && key.startsWith('archive-')) {
        if (isArchiving && key === currentArchivingKey) {
            console.log('[menuManager] Cancel archiving action triggered for key:', key);
            requestCancelBulkArchive();
            isArchiving = false;
            currentArchivingKey = null;
            updateMenuItemStates();
        } else if (!isArchiving) {
            console.log('[menuManager] Starting archiving action for key:', key);
            isArchiving = true;
            currentArchivingKey = key;
            updateMenuItemStates();
            await handleBulkArchive(key);
        }
    }
}

function updateMenuItemStates() {
    console.log('[menuManager] updateMenuItemStates called. Current state:', { isArchiving, currentArchivingKey });
    
    if (!dropdownMenuElement) return;

    const items = dropdownMenuElement.querySelectorAll('.zerozapp-dropdown-item');

    items.forEach(item => {
        const htmlItem = item;
        const itemKey = htmlItem.getAttribute('data-key');
        const originalOption = menuOptions.find(opt => opt.key.toString() === itemKey);

        if (!originalOption) return;

        console.log('[menuManager] updateMenuItemStates: Processing item with key:', itemKey);

        if (oldClickListener) {
            htmlItem.removeEventListener('click', oldClickListener);
            delete (htmlItem)._storedClickListener;
        }

        htmlItem.textContent = originalOption.label;
        htmlItem.style.cursor = 'pointer';
        htmlItem.style.opacity = '1';
        htmlItem.style.color = '#e9edef';

        if (isArchiving) {
            if (itemKey === currentArchivingKey) {
                htmlItem.textContent = 'Cancelar aquela operação...';
                htmlItem.style.color = '#ff9800';
                htmlItem.style.cursor = 'pointer';

                const cancelListener = () => {
                    isArchiving = false;
                    currentArchivingKey = null;
                    updateMenuItemStates();
                    requestCancelBulkArchive();
                };
                htmlItem.addEventListener('click', cancelListener);
                (htmlItem)._storedClickListener = cancelListener;
            } else {
                htmlItem.textContent = originalOption.label;
                htmlItem.style.opacity = '0.5';
                htmlItem.style.cursor = 'not-allowed';
            }
        } else {
            htmlItem.textContent = originalOption.label;
            htmlItem.style.opacity = '1';
            htmlItem.style.color = '#e9edef';
            htmlItem.style.cursor = 'pointer';

            const originalListener = () => handleSelectOption(itemKey);
            htmlItem.addEventListener('click', originalListener);
            (htmlItem)._storedClickListener = originalListener;
        }
    });
}

window.addEventListener('message', (event) => {
    if (event.data?.event === 'archive-process-finished') {
        isArchiving = false;
        currentArchivingKey = null;
        updateMenuItemStates();
    }
});

function createVisualButtonElement() {
    const button = document.createElement('button');
    button.className = "xjb2p0i xk390pu x1heor9g x1ypdohk xjbqb8w x972fbf xcfux6l x1qhh985 xm0m39n xh8yej3 x1y1aw1k x1sxyh0 xwib8y2 xurb0ha";
    button.setAttribute('aria-label', 'ZeroZapp Actions');
    button.setAttribute('title', 'ZeroZapp Actions');
    button.setAttribute('data-tooltip', 'ZeroZapp Actions');
    button.setAttribute('tabindex', '-1');
    button.setAttribute('data-navbar-item', 'true');
    button.type = 'button';

    button.innerHTML = `
        <div class="x1c4vz4f xs83m0k xdl72j9 x1g77sc7 x78zum5 xozqiw3 x1oa3qoh x12fk4p8 xeuugli x2lwn1j x1nhvcw1 x1q0g3np x6s0dn4 x1n2onr6" style="flex-grow: 1;">
            <div class="x1c4vz4f xs83m0k xdl72j9 x1g77sc7 x78zum5 xozqiw3 x1oa3qoh x12fk4p8 xeuugli x2lwn1j x1nhvcw1 x1q0g3np x6s0dn4 x1n2onr6" style="flex-grow: 1;">
                <div>
                    <span aria-hidden="true" data-icon="archive-custom" class="">
                        ${archiveIconHTML}
                    </span>
                </div>
            </div>
        </div>
    `;

    button.addEventListener('click', (event) => {
        if (dropdownMenuElement) {
            const isHidden = dropdownMenuElement.style.display === 'none';
            dropdownMenuElement.style.display = isHidden ? 'block' : 'none';

            if (isHidden) {
                const buttonRect = button.getBoundingClientRect();
                dropdownMenuElement.style.top = `${buttonRect.bottom + window.scrollY}px`;
                dropdownMenuElement.style.left = `${buttonRect.left + window.scrollX}px`;
            }
        }
        event.stopPropagation();
    });

    return button;
}

function createDropdownMenuElement() {
    const menu = document.createElement('div');
    menu.className = 'zerozapp-dropdown-menu';
    menu.style.position = 'fixed';
    menu.style.backgroundColor = '#128c7e';
    menu.style.padding = '8px 0';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    menu.style.zIndex = '1000';
    menu.style.display = 'none';

    menuOptions.forEach(option => {
        const item = document.createElement('div');
        item.className = 'zerozapp-dropdown-item';
        item.textContent = option.label;
        item.setAttribute('data-key', option.key.toString());
        menu.appendChild(item);
    });

    return menu;
}

export function injectMenu() {
    const navbar = document.querySelector('#side > header > div > div > div > div');
    if (!navbar) return;

    visualButtonContainer = document.createElement('div');
    visualButtonContainer.className = 'zerozapp-button-container';
    navbar.appendChild(visualButtonContainer);

    const button = createVisualButtonElement();
    visualButtonContainer.appendChild(button);

    dropdownMenuElement = createDropdownMenuElement();
    document.body.appendChild(dropdownMenuElement);

    updateMenuItemStates();
}

export function removeMenu() {
    if (visualButtonContainer) {
        visualButtonContainer.remove();
        visualButtonContainer = null;
    }
    if (dropdownMenuElement) {
        dropdownMenuElement.remove();
        dropdownMenuElement = null;
    }
}