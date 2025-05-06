import makeManifest from './plugins/make-manifest.js';
import customDynamicImport from './plugins/custom-dynamic-import.js';
import addHmr from './plugins/add-hmr.js';
import watchRebuild from './plugins/watch-rebuild.js';
import inlineVitePreloadScript from './plugins/inline-vite-preload-script.js';

export const getPlugins = (isDev) => [
  makeManifest({ getCacheInvalidationKey }),
  customDynamicImport(),
  // You can toggle enable HMR in background script or view
  addHmr({ background: true, view: true, isDev }),
  isDev && watchRebuild({ afterWriteBundle: regenerateCacheInvalidationKey }),
  // For fix issue#177 (https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/177)
  inlineVitePreloadScript(),
].filter(Boolean);

const cacheInvalidationKeyRef = { current: generateKey() };

export function getCacheInvalidationKey() {
  return cacheInvalidationKeyRef.current;
}

function regenerateCacheInvalidationKey() {
  cacheInvalidationKeyRef.current = generateKey();
  return cacheInvalidationKeyRef;
}

function generateKey() {
  return `${Date.now().toFixed()}`;
}