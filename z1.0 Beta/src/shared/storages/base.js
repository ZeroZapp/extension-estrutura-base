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
  
  export type BaseStorage = {
    get: () => Promise<any>;
    set: (value: any) => Promise<void>;
    getSnapshot: () => any;
    subscribe: (listener: () => void) => () => void;
  };
  
  export type StorageConfig = {
    storageType?: typeof StorageType[keyof typeof StorageType];
    sessionAccessForContentScripts?: boolean;
    liveUpdate?: boolean;
  };
  
  export function createStorage(key, fallback, config = {}) {
    const {
      storageType = StorageType.Local,
      sessionAccessForContentScripts = false,
      liveUpdate = true
    } = config;
  
    const storage = {
      get: async () => {
        const result = await chrome.storage[storageType].get(key);
        return result[key] || fallback;
      },
  
      set: async (value) => {
        await chrome.storage[storageType].set({ [key]: value });
      },
  
      getSnapshot: () => {
        return chrome.storage[storageType].get(key).then(result => result[key]);
      },
  
      subscribe: (listener) => {
        chrome.storage.onChanged.addListener((changes, areaName) => {
          if (areaName === storageType && changes[key]) {
            listener();
          }
        });
  
        return () => {
          chrome.storage.onChanged.removeListener(() => {});
        };
      }
    };
  
    return storage;
  }