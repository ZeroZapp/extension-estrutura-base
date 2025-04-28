// src/shared/storages/AppConfigStorage.js
import { BaseStorage, createStorage, StorageType } from './base';

const AppConfig = {
  inbox_uuid: 'none',
  owner: 'none',
  openaiApiKey: '',
  summaryPrompt: `Você é um assistente especialista em gerar resumos envolventes e bem organizados de conversas e grupos de WhatsApp com foco em negócios, SaaS e inovação.
...
`,
  replyPrompt: ''
};

// Removido o type AppConfigStorage que não existe em JavaScript

const initConfig = {
  inbox_uuid: 'none',
  owner: 'none',
  openaiApiKey: '',
  summaryPrompt: `...`,
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
    return storage.subscribe(callback);
  }
};

export default dataStorage;