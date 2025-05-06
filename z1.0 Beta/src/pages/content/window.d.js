// Adiciona ao objeto window global
if (typeof window !== 'undefined') {
  // Estado de seleção
  window.lastSelection = window.lastSelection || {
    datetime: '',
    text: '',
  };

  // Versão do WhatsApp Web
  window.WVERSION = window.WVERSION || 0;

  // Objeto ModuleRaid
  window.mR = window.mR || null;

  // Objeto Store principal
  window.Store = window.Store || {
    // Dispositivo e informações do usuário
    InfoDevice: {
      getMe: () => ({ user: '' }),
    },

    // Gerenciamento de chats
    Chat: {
      find: (chatWid) => Promise.resolve({}),
      _models: [],
      get: (id) => Promise.resolve({}),
    },

    // Comandos do WhatsApp
    Cmd: {
      archiveChat: () => {},
      markChatUnread: () => {},
      openChatAt: () => {},
      closeChat: () => {},
      openChatBottom: () => {},
    },

    // Gerenciamento de IDs
    WidFactory: {
      createWid: (id) => id,
    },

    // Gerenciamento de fotos de perfil
    ProfilePic: {
      profilePicFind: () => ({ eurl: '' }),
      requestProfilePicFromServer: () => ({ eurl: '' }),
    }
  };
}