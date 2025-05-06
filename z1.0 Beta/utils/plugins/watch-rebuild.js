import { WebSocket } from 'ws';
import { LOCAL_RELOAD_SOCKET_URL } from '../reload/constant.js';

// Classe para interpretar mensagens do WebSocket
class MessageInterpreter {
  static send(message) {
    return JSON.stringify(message);
  }
  
  static receive(serializedMessage) {
    return JSON.parse(serializedMessage);
  }
}

export default function watchRebuild(config) {
  const { afterWriteBundle } = config;
  const ws = new WebSocket(LOCAL_RELOAD_SOCKET_URL);
  
  return {
    name: 'watch-rebuild',
    writeBundle() {
      /**
       * Quando a compilação for concluída, envia uma mensagem para o servidor de recarregamento.
       * O servidor de recarregamento enviará uma mensagem para o cliente para recarregar ou atualizar a extensão.
       */
      ws.send(MessageInterpreter.send({ type: 'build_complete' }));

      // Executa o callback após um pequeno atraso para garantir que tudo foi salvo
      sendNextQueue(() => {
        if (typeof afterWriteBundle === 'function') {
          afterWriteBundle();
        }
      });
    },
  };
}

// Função auxiliar para executar um callback na próxima iteração do loop de eventos
function sendNextQueue(callback) {
  setTimeout(() => {
    callback();
  }, 0);
}
