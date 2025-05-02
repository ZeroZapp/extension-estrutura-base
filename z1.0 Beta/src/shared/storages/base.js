// src/shared/storages/base.js
export const StorageType = {
  Local: 'local',
  Sync: 'sync',
  Session: 'session'
};

export const SessionAccessLevel = {
  ExtensionPagesOnly: 'TRUSTED_CONTEXTS',
  ExtensionPagesAndContentScripts: 'TRUSTED_AND_UNTRUSTED_CONTEXTS'
};

export const BaseStorage = {
  get: () => Promise.resolve(),
  set: (value) => Promise.resolve(),
  getSnapshot: () => null,
  subscribe: (listener) => () => {}
};

export const StorageConfig = {
  storageType: StorageType.Local,
  sessionAccessForContentScripts: false,
  liveUpdate: true
};

let globalSessionAccessLevelFlag = false;

function checkStoragePermission(storageType) {
  if (chrome.storage[storageType] === undefined) {
    throw new Error(`Check your storage permission in manifest.json: ${storageType} is not defined`);
  }
  if (storageType === StorageType.Session && !globalSessionAccessLevelFlag) {
    throw new Error('Session storage is not enabled for content scripts');
  }
}

function updateCache(valueOrUpdate, cache) {
  if (typeof valueOrUpdate === 'function') {
    return valueOrUpdate(cache);
  }
  return valueOrUpdate;
}

export function createStorage(key, fallback, config = {}) {
  const {
    storageType = StorageType.Local,
    sessionAccessForContentScripts = false,
    liveUpdate = true
  } = config;

  let cache = null;
  let listeners = [];

  // Set global session storage access level for Session storage
  if (
    globalSessionAccessLevelFlag === false &&
    storageType === StorageType.Session &&
    sessionAccessForContentScripts === true
  ) {
    checkStoragePermission(storageType);
    chrome.storage[storageType].setAccessLevel({
      accessLevel: SessionAccessLevel.ExtensionPagesAndContentScripts
    });
    globalSessionAccessLevelFlag = true;
  }

  const _getDataFromStorage = async () => {
    checkStoragePermission(storageType);
    const value = await chrome.storage[storageType].get([key]);
    return value[key] ?? fallback;
  };

  const _emitChange = () => {
    listeners.forEach(listener => listener());
  };

  const storage = {
    get: async () => {
      if (cache === null) {
        cache = await _getDataFromStorage();
      }
      return cache;
    },

    set: async (valueOrUpdate) => {
      cache = await updateCache(valueOrUpdate, cache);
      await chrome.storage[storageType].set({ [key]: cache });
      _emitChange();
    },

    getSnapshot: () => {
      return cache;
    },

    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    }
  };

  return storage;
}