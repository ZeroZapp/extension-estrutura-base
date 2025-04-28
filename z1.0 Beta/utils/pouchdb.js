// src/utils/pouchdb.js
import PouchDB from 'pouchdb';
import 'pouchdb-find';
import 'pouchdb-adapter-idb';

class Database {
  constructor() {
    this.db = new PouchDB('zerozap', {
      adapter: 'idb',
      auto_compaction: true
    });
  }

  async init() {
    try {
      // Criar índices
      await this.db.createIndex({
        index: {
          fields: ['type', 'timestamp']
        }
      });
      
      // Criar índices adicionais
      await this.db.createIndex({
        index: {
          fields: ['userId', 'chatId']
        }
      });
      
      console.log('PouchDB inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar PouchDB:', error);
      throw error;
    }
  }

  async addDocument(doc) {
    try {
      return await this.db.put(doc);
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      throw error;
    }
  }

  async getDocument(id) {
    try {
      return await this.db.get(id);
    } catch (error) {
      console.error('Erro ao obter documento:', error);
      throw error;
    }
  }

  async find(query) {
    try {
      return await this.db.find(query);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      throw error;
    }
  }

  async removeDocument(id) {
    try {
      const doc = await this.db.get(id);
      return await this.db.remove(doc);
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      throw error;
    }
  }
}

// Exportar singleton
const database = new Database();
export default database;