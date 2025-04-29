import('@pages/content/client/inicializer');
import { Model } from '@pages/content/types/index';

console.log('[client/index.js] Script execution started.');

window.addEventListener('message', async evt => {
  console.log('[client/index.js] window.addEventListener - Message received:', evt.data);
  if (evt.data?.response) {
    return false;
  }

  const { event, to, payload } = evt.data;

  if (to !== 'client') {
    return false;
  }

  console.log(`window.addEventListener evento recebido no client`, { event, to, payload });

  if (event === 'delayed') {
    try {
      console.log('[client/index.js] Accessing window.Store.Chat.get in delayed handler.');
      const chat = await window.Store.Chat.get(payload.identifier);

      if (chat.active) {
        await window.Store.Cmd.closeChat(chat);
      }

      window.Store.Cmd.archiveChat(chat, true);
      window.Store.Cmd.markChatUnread(chat, true);
    } catch (error) {
      console.log('[client/index.js] Error accessing window.Store in delayed handler:', error);
      console.log('Erro ao arquivar chat', error);
    }

    const me = window.Store.InfoDevice.getMe().user;

    const newData = { ...evt.data, to: 'content', me: me };

    console.log('dados compartilhados com content', newData);

    window.postMessage(newData, '*');

    return;
  }

  if (event === 'undelayed') {
    try {
      console.log('[client/index.js] Accessing window.Store.Chat.get in undelayed handler.');
      const chat = await window.Store.Chat.get(payload.identifier);
      console.log('[client/index.js] Accessing window.Store.Cmd in undelayed handler.');
      window.Store.Cmd.archiveChat(chat, false);
      window.Store.Cmd.markChatUnread(chat, true);
    } catch (error) {
      console.log('[client/index.js] Error accessing window.Store in undelayed handler:', error);
      console.log('Erro ao arquivar chat', error);
    }
    return;
  }

  if (event === 'archive') {
    try {
      console.log('[client/index.js] Accessing window.Store.Chat.get in archive handler.');
      const chat = await window.Store.Chat.get(payload.identifier);

      if (chat.active) {
        await window.Store.Cmd.closeChat(chat);
      }

      if (!chat.archive) {
        window.Store.Cmd.archiveChat(chat, true);
      }
    } catch (error) {
      console.log('[client/index.js] Error accessing window.Store in archive handler:', error);
      console.log('Erro ao arquivar chat', error);
    }
    return;
  }

  if (event === 'unarchive') {
    try {
      console.log('[client/index.js] Accessing window.Store.Chat.get in unarchive handler.');
      const chatId = payload.id?._serialized || payload.identifier;
      console.log(`[client/index.js] Tentando desarquivar chat com ID: ${chatId}`, {
        payloadRecebido: payload,
        temId: !!payload.id,
        temIdSerialized: !!payload.id?._serialized,
        temIdentifier: !!payload.identifier
      });

      if (!chatId) {
        console.error('[client/index.js] Erro ao desarquivar: identificador não encontrado no payload', payload);
        return;
      }

      const chat = await window.Store.Chat.get(chatId);

      if (!chat) {
        console.error(`[client/index.js] Chat não encontrado para o ID: ${chatId}`);
        return;
      }

      console.log(`[client/index.js] Chat encontrado para desarquivar:`, {
        id: chat.id?._serialized,
        isArchived: chat.archive
      });

      if (chat.archive) {
        console.log(`[client/index.js] Desarquivando chat: ${chatId}`);
        window.Store.Cmd.archiveChat(chat, false);
        console.log(`[client/index.js] Comando de desarquivamento enviado para: ${chatId}`);
      } else {
        console.log(`[client/index.js] Chat ${chatId} já está desarquivado.`);
      }
    } catch (error) {
      console.log('[client/index.js] Error accessing window.Store in unarchive handler:', error);
      console.error('[client/index.js] Erro ao desarquivar chat:', error);
    }
    return;
  }

  if (event === 'open-conversation') {
    try {
      console.log('Abrir conversa', payload);
      console.log('[client/index.js] Accessing window.Store.WidFactory in open-conversation handler.');
      const chatWid = window.Store.WidFactory.createWid(payload.identifier);
      console.log('[client/index.js] Accessing window.Store.Chat.find in open-conversation handler.');
      const chat = await window.Store.Chat.find(chatWid);
      console.log('[client/index.js] Accessing window.Store.Cmd in open-conversation handler.');
      await window.Store.Cmd.openChatBottom(chat);
    } catch (error) {
      console.log('[client/index.js] Error accessing window.Store in open-conversation handler:', error);
      console.error('[client/index.js] Erro ao abrir conversa:', error);
    }
    return;
  }
});