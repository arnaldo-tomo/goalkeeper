// src/store/useAuthStore.js - Versão com melhor error handling
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// ⚠️ Import com try-catch para evitar erros
let ApiService;
try {
  ApiService = require('../services/api').default;
} catch (error) {
  console.error('Erro ao importar ApiService:', error);
  // Fallback mock
  ApiService = {
    auth: {
      getUser: () => Promise.resolve({ success: false }),
      login: () => Promise.resolve({ success: false }),
      register: () => Promise.resolve({ success: false }),
      logout: () => Promise.resolve({ success: true }),
      updateProfile: () => Promise.resolve({ success: false })
    }
  };
}

// Constantes para storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REMEMBER_ME: 'remember_me',
  LAST_LOGIN: 'last_login',
  LOGIN_ATTEMPTS: 'login_attempts'
};

// Estado inicial do usuário
const initialUserState = {
  id: null,
  name: '',
  email: '',
  timezone: 'America/Sao_Paulo',
  preferences: {
    theme: 'light',
    notifications: true,
    daily_reminder: true,
    weekly_report: true,
    sound_effects: true,
    haptic_feedback: true
  },
  ai_settings: {
    suggestions_enabled: true,
    auto_create_tasks: false,
    smart_scheduling: true
  },
  streak_days: 0,
  last_activity_at: null,
  created_at: null,
  updated_at: null
};

// Criar store com Zustand
const useAuthStore = create((set, get) => ({
  // ========================================
  // ESTADO INICIAL
  // ========================================
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,
  rememberMe: false,
  loginAttempts: 0,
  lastError: null,

  // ========================================
  // AÇÕES DE INICIALIZAÇÃO
  // ========================================
  
  /**
   * Inicializar store - carrega dados do AsyncStorage
   */
  initialize: async () => {
    try {
      set({ isLoading: true });
      console.log('Inicializando AuthStore...');

      // Carregar dados em paralelo com error handling
      let token, userData, rememberMe, loginAttempts;
      
      try {
        const results = await Promise.allSettled([
          AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
          AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME),
          AsyncStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS)
        ]);

        token = results[0].status === 'fulfilled' ? results[0].value : null;
        userData = results[1].status === 'fulfilled' ? results[1].value : null;
        rememberMe = results[2].status === 'fulfilled' ? results[2].value : null;
        loginAttempts = results[3].status === 'fulfilled' ? results[3].value : null;
        
      } catch (storageError) {
        console.error('Erro ao acessar AsyncStorage:', storageError);
        token = userData = rememberMe = loginAttempts = null;
      }

      // Se tem token e dados do usuário
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // Verificar se o token ainda é válido (com timeout)
          try {
            const response = await Promise.race([
              ApiService.auth.getUser(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 5000)
              )
            ]);
            
            if (response && response.success) {
              set({
                token,
                user: response.data,
                isAuthenticated: true,
                rememberMe: rememberMe === 'true',
                loginAttempts: parseInt(loginAttempts) || 0,
                isInitialized: true,
                isLoading: false
              });
              console.log('AuthStore inicializado com sucesso - usuário autenticado');
              return;
            }
          } catch (apiError) {
            console.warn('Erro ao verificar token, fazendo logout:', apiError);
            // Token inválido, limpar dados
            await get().clearAuthData();
          }
        } catch (parseError) {
          console.error('Erro ao fazer parse dos dados do usuário:', parseError);
          await get().clearAuthData();
        }
      }

      // Não autenticado
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        rememberMe: rememberMe === 'true',
        loginAttempts: parseInt(loginAttempts) || 0,
        isInitialized: true,
        isLoading: false
      });
      
      console.log('AuthStore inicializado - usuário não autenticado');

    } catch (error) {
      console.error('Erro ao inicializar auth store:', error);
      set({
        isInitialized: true,
        isLoading: false,
        lastError: 'Erro ao carregar dados de autenticação'
      });
    }
  },

  // ========================================
  // AÇÕES DE AUTENTICAÇÃO
  // ========================================

  /**
   * Fazer login
   */
  login: async (credentials) => {
    const { email, password, rememberMe = false } = credentials;
    
    try {
      set({ 
        isLoading: true, 
        lastError: null 
      });

      // Verificar tentativas de login
      const currentAttempts = get().loginAttempts;
      if (currentAttempts >= 5) {
        throw new Error('Muitas tentativas de login. Tente novamente em alguns minutos.');
      }

      // Fazer requisição de login com timeout
      const response = await Promise.race([
        ApiService.auth.login({ email, password }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na requisição')), 10000)
        )
      ]);
      
      if (response && response.success) {
        const { user, token } = response.data;
        
        // Salvar dados no AsyncStorage
        try {
          await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
            AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
            AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString()),
            AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString()),
            AsyncStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS) // Reset attempts
          ]);
        } catch (storageError) {
          console.error('Erro ao salvar dados no AsyncStorage:', storageError);
        }

        // Atualizar estado
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          rememberMe,
          loginAttempts: 0,
          lastError: null
        });

        return { success: true, message: 'Login realizado com sucesso!' };
        
      } else {
        throw new Error(response?.message || 'Credenciais inválidas');
      }

    } catch (error) {
      const newAttempts = get().loginAttempts + 1;
      
      // Salvar tentativas de login
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, newAttempts.toString());
      } catch (storageError) {
        console.error('Erro ao salvar tentativas de login:', storageError);
      }
      
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
      
      set({ 
        isLoading: false,
        loginAttempts: newAttempts,
        lastError: errorMessage
      });

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  /**
   * Registrar novo usuário
   */
  register: async (userData) => {
    try {
      set({ 
        isLoading: true, 
        lastError: null 
      });

      const response = await Promise.race([
        ApiService.auth.register(userData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na requisição')), 10000)
        )
      ]);
      
      if (response && response.success) {
        const { user, token } = response.data;
        
        // Salvar dados no AsyncStorage
        try {
          await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
            AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
            AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString())
          ]);
        } catch (storageError) {
          console.error('Erro ao salvar dados no AsyncStorage:', storageError);
        }

        // Atualizar estado
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          lastError: null
        });

        return { 
          success: true, 
          message: 'Conta criada com sucesso!' 
        };
        
      } else {
        throw new Error(response?.message || 'Erro ao criar conta');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao criar conta';
      
      set({ 
        isLoading: false,
        lastError: errorMessage
      });

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  /**
   * Fazer logout
   */
  logout: async (showConfirmation = true) => {
    try {
      // Mostrar confirmação se solicitado
      if (showConfirmation) {
        return new Promise((resolve) => {
          Alert.alert(
            'Sair da Conta',
            'Tem certeza que deseja sair?',
            [
              { 
                text: 'Cancelar', 
                style: 'cancel',
                onPress: () => resolve(false)
              },
              {
                text: 'Sair',
                style: 'destructive',
                onPress: async () => {
                  await get().performLogout();
                  resolve(true);
                }
              }
            ]
          );
        });
      } else {
        await get().performLogout();
        return true;
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      return false;
    }
  },

  /**
   * Executar logout (função interna)
   */
  performLogout: async () => {
    try {
      // Tentar fazer logout no servidor
      try {
        await Promise.race([
          ApiService.auth.logout(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
          )
        ]);
      } catch (error) {
        console.error('Erro ao fazer logout no servidor:', error);
      }
    } finally {
      // Limpar dados locais independentemente
      await get().clearAuthData();
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        lastError: null
      });
    }
  },

  // ========================================
  // AÇÕES UTILITÁRIAS
  // ========================================

  /**
   * Limpar dados de autenticação
   */
  clearAuthData: async () => {
    try {
      await Promise.allSettled([
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_LOGIN)
      ]);
    } catch (error) {
      console.error('Erro ao limpar dados de auth:', error);
    }
  },

  /**
   * Limpar erro
   */
  clearError: () => {
    set({ lastError: null });
  },

  /**
   * Resetar tentativas de login
   */
  resetLoginAttempts: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
      set({ loginAttempts: 0 });
    } catch (error) {
      console.error('Erro ao resetar tentativas de login:', error);
    }
  },

  /**
   * Atualizar último acesso
   */
  updateLastActivity: async () => {
    const currentUser = get().user;
    if (!currentUser) return;

    const now = new Date().toISOString();
    const updatedUser = { ...currentUser, last_activity_at: now };
    
    // Atualizar estado local
    set({ user: updatedUser });
    
    // Atualizar AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar AsyncStorage:', error);
    }
    
    // Opcional: sincronizar com servidor em background
    try {
      await ApiService.auth.updateLastActivity();
    } catch (error) {
      // Não exibir erro, é background sync
      console.log('Erro ao sincronizar última atividade:', error);
    }
  },

  // ========================================
  // GETTERS COMPUTADOS
  // ========================================

  /**
   * Verificar se usuário é premium (exemplo)
   */
  isPremium: () => {
    const user = get().user;
    return user?.subscription_type === 'premium' || false;
  },

  /**
   * Obter nome abreviado do usuário
   */
  getUserInitials: () => {
    const user = get().user;
    if (!user?.name) return 'U';
    
    return user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },

  /**
   * Verificar se perfil está completo
   */
  isProfileComplete: () => {
    const user = get().user;
    if (!user) return false;
    
    return !!(user.name && user.email && user.timezone);
  },

  /**
   * Obter configurações de tema
   */
  getThemeSettings: () => {
    const user = get().user;
    return user?.preferences || initialUserState.preferences;
  }
}));

export default useAuthStore;