import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
  OFFLINE_DATA: 'offline_data',
  DRAFT_NOTES: 'draft_notes',
  LAST_SYNC: 'last_sync',
};

export const storage = {
  // Operações básicas
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
    }
  },

  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Erro ao ler do storage:', error);
      return null;
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do storage:', error);
    }
  },

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar storage:', error);
    }
  },

  // Funções específicas
  async saveAuthData(token, userData) {
    await Promise.all([
      this.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
      this.setItem(STORAGE_KEYS.USER_DATA, userData)
    ]);
  },

  async getAuthData() {
    const [token, userData] = await Promise.all([
      this.getItem(STORAGE_KEYS.AUTH_TOKEN),
      this.getItem(STORAGE_KEYS.USER_DATA)
    ]);
    return { token, userData };
  },

  async clearAuthData() {
    await Promise.all([
      this.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      this.removeItem(STORAGE_KEYS.USER_DATA)
    ]);
  },

  async saveSettings(settings) {
    await this.setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  async getSettings() {
    return await this.getItem(STORAGE_KEYS.SETTINGS);
  },

  // Cache offline
  async saveOfflineData(data) {
    await this.setItem(STORAGE_KEYS.OFFLINE_DATA, {
      ...data,
      timestamp: Date.now()
    });
  },

  async getOfflineData() {
    const data = await this.getItem(STORAGE_KEYS.OFFLINE_DATA);
    if (!data) return null;
    
    // Verificar se os dados não estão muito antigos (24 horas)
    const isStale = Date.now() - data.timestamp > 24 * 60 * 60 * 1000;
    return isStale ? null : data;
  },

  // Rascunhos
  async saveDraftNote(id, note) {
    const drafts = await this.getItem(STORAGE_KEYS.DRAFT_NOTES) || {};
    drafts[id] = { ...note, timestamp: Date.now() };
    await this.setItem(STORAGE_KEYS.DRAFT_NOTES, drafts);
  },

  async getDraftNotes() {
    return await this.getItem(STORAGE_KEYS.DRAFT_NOTES) || {};
  },

  async removeDraftNote(id) {
    const drafts = await this.getItem(STORAGE_KEYS.DRAFT_NOTES) || {};
    delete drafts[id];
    await this.setItem(STORAGE_KEYS.DRAFT_NOTES, drafts);
  }
};