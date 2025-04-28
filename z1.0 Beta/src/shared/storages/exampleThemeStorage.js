// src/shared/storages/exampleThemeStorage.js
import { createStorage, StorageType } from './base';

const Theme = {
  light: 'light',
  dark: 'dark'
};

const storage = createStorage('theme-storage-key', Theme.light, {
  storageType: StorageType.Local,
  liveUpdate: true,
  sessionAccessForContentScripts: true
});

const exampleThemeStorage = {
  ...storage,
  // TODO: extends your own methods
  toggle: async () => {
    await storage.set(currentTheme => {
      return currentTheme === Theme.light ? Theme.dark : Theme.light;
    });
  }
};

export default exampleThemeStorage;