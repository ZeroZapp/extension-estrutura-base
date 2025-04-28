// src/shared/utils/utils.js

class Utils {
    // Formatar data
    static formatDate(date) {
      return new Date(date).toLocaleString();
    }
  
    // Gerar ID único
    static generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  
    // Verificar se é WhatsApp Web
    static isWhatsAppWeb() {
      return window.location.href.includes('web.whatsapp.com');
    }
  
    // Verificar se é WhatsApp Desktop
    static isWhatsAppDesktop() {
      return window.location.href.includes('desktop.whatsapp.com');
    }
  
    // Formatar número de telefone
    static formatPhoneNumber(phone) {
      if (!phone) return '';
      return phone.replace(/[^0-9]/g, '');
    }
  
    // Gerar hash simples
    static generateHash(str) {
      let hash = 0;
      if (str.length === 0) return hash;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      return Math.abs(hash);
    }
  
    // Deep clone
    static deepClone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
  
    // Verificar se é objeto vazio
    static isEmptyObject(obj) {
      return Object.keys(obj).length === 0;
    }
  
    // Gerar UUID
    static generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }
  
  // Exportar a classe
  window.Utils = Utils;