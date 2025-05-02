// src/pages/content/client/utils/domUtils.js
import { reactProps } from '@pages/content/types/index';

/**
 * Finds the React properties (__reactProps$) associated with a DOM element.
 * @param {Element} dom The DOM element.
 * @returns {Promise<reactProps | undefined>} A promise that resolves with the React props or undefined.
 */
export async function findReactAsync(dom) {
  return new Promise(resolve => {
    const key = Object.keys(dom).find(key => key.startsWith('__reactProps$'));
    if (key) {
      resolve(dom[key]);
    } else {
      // Fallback for older React versions or different injection methods
      const oldKey = Object.keys(dom).find(key => key.startsWith('__reactProps'));
      if (oldKey) {
        resolve(dom[oldKey]);
      } else {
        resolve(undefined);
      }
    }
  });
}

/**
 * Waits for a DOM element matching the selector to appear.
 * @param {string} selector The CSS selector to wait for.
 * @param {number} [timeout] Optional timeout in milliseconds.
 * @returns {Promise<Element | null>} A promise that resolves with the element or null if timed out or not found.
 */
export function waitForSelector(selector, timeout = 30000) {
  return new Promise((resolve) => {
    let timeoutId = null;

    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        if (observer) observer.disconnect();
        resolve(element);
      }
    };

    const observer = new MutationObserver(checkElement);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    checkElement(); // Check immediately in case element is already present

    timeoutId = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}