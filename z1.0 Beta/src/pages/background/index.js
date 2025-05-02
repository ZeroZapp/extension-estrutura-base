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

// Função para atualizar o badge
async function updateBadge() {
  try {
    const result = await db.find({
      selector: {
        $or: [{ action: 'delayed' }, { action: 'overdue' }],
      },
    });

    const count = result.docs.length;
    
    if (count > 0) {
      chrome.action.setBadgeText({ text: count.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#dc3545' }); // Vermelho para tarefas atrasadas
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  } catch (error) {
    console.error('[Background] Error updating badge:', error);
  }
}

// Atualizar badge inicialmente
updateBadge();

// Configurar alarme para verificar tarefas atrasadas
chrome.alarms.create('delayed-actions', {
  delayInMinutes: 0.25, // Começa após 15 segundos
  periodInMinutes: 0.25 // Repete a cada 15 segundos (0.25 minutos)
});

// Ouvinte para o alarme
chrome.alarms.onAlarm.addListener(async function(alarm) {
  if (alarm.name === 'delayed-actions') {
    console.log('[Background Alarm] Verificando tarefas atrasadas...');

    const agora = new Date().toISOString();
    console.log('agora', agora);

    try {
      const result = await db.find({
        selector: {
          action: 'delayed',
          start_action: { $lte: agora }, // Busca por tarefas com data de vencimento anterior à atual
        },
      });

      if (result.docs.length > 0) {
        console.log('[Background Alarm] Encontradas tarefas atrasadas:', result.docs.length);
        
        // Processar cada tarefa atrasada
        result.docs.forEach(async function(doc) {
          try {
            console.log(`[Background Alarm] Processando tarefa atrasada ID: ${doc._id}`);
            
            // Verificar se há uma aba do WhatsApp Web aberta
            chrome.tabs.query({ url: 'https://web.whatsapp.com/*' }, function(tabs) {
              if (tabs.length > 0) {
                // Enviar mensagem para o content script para processar a tarefa
                const message = {
                  type: 'process_delayed_task',
                  identifier: doc.identifier,
                  action: doc.action
                };
                
                chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
                  if (chrome.runtime.lastError) {
                    console.error(`[Background Alarm] Erro ao enviar mensagem para processar tarefa:`, chrome.runtime.lastError.message);
                  } else {
                    console.log(`[Background Alarm] Mensagem enviada para processar tarefa ID: ${doc._id}`);
                  }
                });
              } else {
                console.warn('[Background Alarm] Nenhuma aba do WhatsApp Web encontrada para processar tarefa');
              }
            });
          } catch (error) {
            console.error(`[Background Alarm] Erro ao processar tarefa atrasada ID: ${doc._id}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('[Background Alarm] Erro ao buscar tarefas atrasadas:', error);
    }
  }
});

// Configurar mensagens
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
    
    // Atualizar badge quando houver mudanças
    updateBadge();
  } catch (error) {
    console.error('[Background] Exception caught while sending DB_CHANGE message:', error);
  }
});

// Ouvinte de mensagens do content script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'DB_CHANGE') {
    console.log('DB change received:', message.data);
    sendResponse({ status: 'received_and_processed' });
  }
  return true;
});

// Inicializar o background
console.log('Background initialized');