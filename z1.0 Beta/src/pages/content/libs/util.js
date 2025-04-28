// src/pages/content/libs/util.js
function MessageToContent(type, message) {
    message = typeof message === 'string' ? JSON.parse(message.toString()) : message;
  
    window.postMessage(
      {
        type: type,
        msg: message,
      },
      '*',
    );
  
    console.log('---> message from client to bot');
    console.log(`type: ${type}`);
    console.log(message);
  }
  
  function MessageToBackground(type, message, callback) {
    chrome.runtime.sendMessage(
      {
        message: message,
        method: type,
      },
      function (response) {
        if (typeof callback === 'function') {
          callback(response);
        }
      },
    );
  }
  
  function listenerMessageFromClient() {
    window.addEventListener('message', function (evt) {
      console.log('message listener in background script');
      console.log(evt);
  
      const type = evt.data.type;
      const message = evt.data.msg;
  
      MessageToBackground(type, message);
    });
  }
  
  // Exportar as funções
  window.util = {
    MessageToContent,
    MessageToBackground,
    listenerMessageFromClient
  };