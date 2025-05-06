console.log('[injected/index.js] Script execution started.');

// Injeta clientjs se ainda não estiver carregado
if (!document.getElementById('clientjs')) {
  console.log('[injected/index.js] Tentando injetar clientjs...');
  try {
    const script = document.createElement('script');
    script.id = 'clientjs';
    script.src = chrome.runtime.getURL('src/pages/content/client/inicializer.js');
    (document.head || document.documentElement).appendChild(script);
    console.log('[injected/index.js] clientjs injetado com sucesso.');
  } catch (error) {
    console.error('[injected/index.js] Erro ao injetar clientjs:', error);
  }
} else {
  console.log('[injected/index.js] clientjs já carregado.');
}

// Função para carregar módulos adicionais
function loadModules() {
  console.log('[injected/index.js] Carregando módulos...');
  // Adicione aqui a lógica para carregar módulos adicionais
}

// Listener para mensagens
window.addEventListener('message', async (event) => {
  console.log('[injected/index.js] Mensagem recebida:', event.data);

  // Previne loop de mensagens ou mensagens não relevantes
  if (event.source !== window) return;
  if (event.data?.response) return;

  const { to } = event.data;
  if (to !== 'content') return;

  console.log('[injected/index.js] Mensagem processada:', event.data);

  // Adicione aqui o tratamento de mensagens específicas
});

// Inicialização
console.log('[injected/index.js] Script inicializado com sucesso.');

/**
 * DO NOT USE import someModule from '...';
 *
 * @issue-url https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/160
 *
 * Chrome extensions don't support modules in content scripts.
 * If you want to use other modules in content scripts, you need to import them via these files.
 */

// src/pages/moduleraid/index.js
(function () {
  const moduleId = Math.random().toString(36).substring(7);
  const modules = {};

  console.log(`[moduleRaid] Initializing module (ID: ${moduleId})`);

  const isCometVersion =
    window.Debug &&
    window.Debug.VERSION &&
    parseInt(window.Debug.VERSION.split('.')[1]) >= 3000;

  console.log('[moduleRaid] WhatsApp Environment:', {
    'window.Debug': typeof window.Debug,
    'window.Debug?.VERSION': window.Debug?.VERSION,
    'window.webpackChunk_web': typeof window.webpackChunk_web,
    'window.webpackChunkwhatsapp': typeof window.webpackChunkwhatsapp,
    'require function': typeof window.require,
  });

  function loadModules() {
    console.log('[moduleRaid] Starting module loading...');

    if (isCometVersion) {
      console.log('[moduleRaid] Using Comet strategy');
      loadCometModules();
    } else {
      console.log('[moduleRaid] Using legacy strategy');
      loadLegacyModules();
    }
  }

  function loadCometModules() {
    try {
      if (typeof window.require !== 'function') {
        console.error('[moduleRaid] Error: window.require is not available');
        return;
      }

      const debugModule = window.require('__debug');
      if (!debugModule || !debugModule.modulesMap) {
        console.error('[moduleRaid] Error: __debug module not available');
        return;
      }

      const moduleKeys = Object.keys(debugModule.modulesMap);
      console.log(`[moduleRaid] Found ${moduleKeys.length} module keys`);

      let successCount = 0;
      let failCount = 0;

      moduleKeys.forEach((key) => {
        try {
          const module = window.require(key);
          if (module) {
            modules[key] = module;
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
          console.warn(`[moduleRaid] Failed to load module ${key}:`, error);
        }
      });

      console.log(`[moduleRaid] Modules loaded: ${successCount} success, ${failCount} failed`);
    } catch (error) {
      console.error('[moduleRaid] Error in Comet strategy:', error);
    }
  }

  function loadLegacyModules() {
    console.log('[moduleRaid] Legacy module loading not implemented yet');
    // Implementar lógica para versões mais antigas se necessário
  }

  window.whatsappModules = modules;
  loadModules();
  console.log('[moduleRaid] Module loading complete');
})();
