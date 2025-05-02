// src/shared/storages/AppConfigStorage.js
import { createStorage, StorageType } from './base';

const initConfig = {
  inbox_uuid: 'none',
  owner: 'none',
  openaiApiKey: '',
  summaryPrompt: `Você é um assistente especialista em gerar resumos envolventes e bem organizados de conversas e grupos de WhatsApp com foco em negócios, SaaS e inovação.
...
`,
  replyPrompt: ''
};

const storage = createStorage('app_config', initConfig, {
  storageType: StorageType.Local,
  liveUpdate: true,
  sessionAccessForContentScripts: true
});

const dataStorage = {
  ...storage,
  onChange: (callback) => {
    const listener = () => {
      callback(storage.getSnapshot());
    };
    storage.subscribe(listener);
    return () => {
      storage.unsubscribe(listener);
    };
  }
};

export default dataStorage;