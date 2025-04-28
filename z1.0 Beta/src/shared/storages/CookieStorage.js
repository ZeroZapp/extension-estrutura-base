// src/shared/storages/CookieStorage.js
import { createStorage, StorageType } from './base';

const CookieStorage = createStorage('cookie_storage', {}, {
  storageType: StorageType.Local,
  liveUpdate: true,
  sessionAccessForContentScripts: true
});

export default CookieStorage;