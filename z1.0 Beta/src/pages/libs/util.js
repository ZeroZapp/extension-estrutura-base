// src/pages/libs/util.js
export function MessageToContent(type, message) {
    message = typeof message == 'string' ? JSON.parse(message.toString()) : message;
  
    window.postMessage(
      {
        type: type,
        msg: message,
      },
      '*',
    );
  
    window.postMessage(
      {
        type: 'tipo',
        msg: 'mensagem',
      },
      '*',
    );
  
    console.log('---> message from client to bot');
    console.log(`type: ${type}`);
    console.log(message);
  }
  
  export function MessageToBackground(type, message, callback) {
    browser.runtime.sendMessage(
      {
        message: message,
        method: type,
      },
      function (response) {
        if (typeof callback == 'function') {
          callback(response);
        }
      },
    );
  }
  
  export function listenerMessageFromClient() {
    window.addEventListener('message', function (evt) {
      console.log('message listener in background script');
      console.log(evt);
  
      const type = evt.data.type;
      const message = evt.data.msg;
  
      MessageToBackground(type, message);
    });
  }