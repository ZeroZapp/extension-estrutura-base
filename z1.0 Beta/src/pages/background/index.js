// src/pages/background/index.js
import 'webextension-polyfill';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import md5 from 'md5';

PouchDB.plugin(PouchDBFind);
const db = new PouchDB('conversations', { adapter: 'idb' });

db.createIndex({
  index: { fields: ['action', 'start_action'] }
});

db.changes({
  since: 'now',
  live: true,
  include_docs: true
}).on('change', function(change) {
  try {
    console.log('[Background] Attempting to send DB_CHANGE message. Change data:', JSON.stringify(change));
    chrome.runtime.sendMessage({ type: 'DB_CHANGE', data: change }, response => {
      if (chrome.runtime.lastError) {
        console.error('[Background] Error sending DB_CHANGE message:', chrome.runtime.lastError.message);
      }
    });
  } catch (error) {
    console.error('[Background] Exception caught while sending DB_CHANGE message:', error);
  }
});

function conversation_hash(inbox_uuid, identifier) {
  const hash = md5(inbox_uuid + identifier).toUpperCase();
  return hash;
}

async function update_document(collection, id, update) {
  return new Promise((resolve, reject) => {
    db.get(id)
      .then(doc => {
        const updatedDoc = { ...doc, ...update };
        db.put(updatedDoc);
        resolve(updatedDoc);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function open_options() {
  chrome.runtime.openOptionsPage();
}

// Configurar alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'check_conversations') {
    // Lógica para verificar conversas
    console.log('Checking conversations...');
  }
});

// Criar alarme para verificar conversas
chrome.alarms.create('check_conversations', {
  periodInMinutes: 15 // Verificar a cada 15 minutos
});

// Configurar mensagens
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DB_CHANGE') {
    console.log('DB change received:', message.data);
    sendResponse({ status: 'received_and_processed' });
  }
  return true;
});

// Inicializar o background
console.log('Background initialized');