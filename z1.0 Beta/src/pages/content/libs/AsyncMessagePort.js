// src/pages/content/libs/AsyncMessagePort.js
class AsyncMessagePort {
    constructor() {
      this.pendingMessages = new Map();
  
      window.addEventListener('message', this.handleMessage.bind(this));
    }
  
    sendMessage(targetWindow, message, timeout = 5000) {
      return new Promise((resolve, reject) => {
        const messageId = Date.now().toString() + Math.random().toString(36);
  
        if (timeout >= 1) {
          const timeoutId = setTimeout(() => {
            this.pendingMessages.delete(messageId);
            reject(new Error('Timeout waiting for response'));
          }, timeout);
  
          this.pendingMessages.set(messageId, { resolve, reject, timeoutId });
        }
  
        targetWindow.postMessage({ id: messageId, ...message }, '*');
      });
    }
  
    handleMessage(event) {
      const { id, response, error } = event.data;
  
      // Prevent loop when message is a response
      if (!response) {
        return;
      }
  
      console.log('Response received from callback:', event.data);
  
      if (!id || !this.pendingMessages.has(id)) return;
  
      const { resolve, reject, timeoutId } = this.pendingMessages.get(id);
      clearTimeout(timeoutId);
      this.pendingMessages.delete(id);
  
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    }
  }
  
  // Exportar a classe
  window.AsyncMessagePort = AsyncMessagePort;