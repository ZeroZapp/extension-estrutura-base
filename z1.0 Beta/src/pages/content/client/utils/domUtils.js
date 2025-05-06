// src/pages/content/client/utils/domUtils.js

/**
 * @typedef {import('@pages/content/types').ReactProps} ReactProps
 */

/**
 * Finds the React properties (__reactProps$) associated with a DOM element.
 * @param {Element} dom The DOM element to find React props for.
 * @returns {Promise<ReactProps | undefined>} A promise that resolves with the React props or undefined.
 */
export async function findReactAsync(dom) {
  return new Promise(resolve => {
    if (!dom || typeof dom !== 'object') {
      resolve(undefined);
      return;
    }

    const key = Object.keys(dom).find(key => key.startsWith('__reactProps$'));
    if (key) {
      resolve(dom[key]);
    } else {
      resolve(undefined);
    }
  });
}

/**
 * Waits for a DOM element matching the selector to appear.
 * @param {string} selector The CSS selector to wait for.
 * @param {number} [timeout=30000] The maximum time to wait in milliseconds.
 * @returns {Promise<Element | null>} A promise that resolves with the element or null if not found.
 */
export function waitForSelector(selector, timeout = 30000) {
  return new Promise((resolve, reject) => {
    // Check if the element already exists
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    // Set up a mutation observer to watch for changes to the DOM
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Set a timeout to stop observing after the specified time
    if (timeout) {
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    }
  });
}