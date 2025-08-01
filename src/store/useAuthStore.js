// 🔐 src/store/useAuthStore.js - GoalKeeper Auth Store
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import ApiService from '../services/api';

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

      // Carregar dados em paralelo
      const [
        token,
        userData,
        rememberMe,
        loginAttempts
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME),
        AsyncStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS)
      ]);

      // Se tem token e dados do usuário
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        
        // Verificar se o token ainda é válido
        try {
          const response = await ApiService.auth.getUser();
          if (response.success) {
            set({
              token,
              user: response.data,
              isAuthenticated: true,
              rememberMe: rememberMe === 'true',
              loginAttempts: parseInt(loginAttempts) || 0,
              isInitialized: true,
              isLoading: false
            });
            return;
          }
        } catch (error) {
          // Token inválido, limpar dados
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

      // Fazer requisição de login
      const response = await ApiService.auth.login({ email, password });
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Salvar dados no AsyncStorage
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
          AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
          AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString()),
          AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString()),
          AsyncStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS) // Reset attempts
        ]);

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
        throw new Error(response.message || 'Credenciais inválidas');
      }

    } catch (error) {
      const newAttempts = get().loginAttempts + 1;
      
      // Salvar tentativas de login
      await AsyncStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, newAttempts.toString());
      
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

      const response = await ApiService.auth.register(userData);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Salvar dados no AsyncStorage
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
          AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
          AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString())
        ]);

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
        throw new Error(response.message || 'Erro ao criar conta');
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
      await ApiService.auth.logout();
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
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
  // AÇÕES DE PERFIL
  // ========================================

  /**
   * Atualizar perfil do usuário
   */
  updateProfile: async (profileData) => {
    try {
      set({ isLoading: true });

      const response = await ApiService.auth.updateProfile(profileData);
      
      if (response.success) {
        const updatedUser = response.data;
        
        // Atualizar AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
        
        // Atualizar estado
        set({ 
          user: updatedUser,
          isLoading: false 
        });

        return { 
          success: true, 
          message: 'Perfil atualizado com sucesso!' 
        };
      } else {
        throw new Error(response.message || 'Erro ao atualizar perfil');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao atualizar perfil';
      
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
   * Atualizar configurações do usuário
   */
  updateSettings: async (settings) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return { success: false, message: 'Usuário não autenticado' };

      const updatedUser = {
        ...currentUser,
        preferences: { ...currentUser.preferences, ...settings.preferences },
        ai_settings: { ...currentUser.ai_settings, ...settings.ai_settings }
      };

      // Salvar no servidor
      const response = await ApiService.auth.updateProfile(updatedUser);
      
      if (response.success) {
        // Atualizar AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
        
        // Atualizar estado
        set({ user: updatedUser });

        return { success: true, message: 'Configurações salvas!' };
      } else {
        throw new Error(response.message);
      }

    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao salvar configurações'
      };
    }
  },

  /**
   * Alterar senha
   */
  changePassword: async (passwordData) => {
    try {
      set({ isLoading: true });

      const response = await ApiService.auth.changePassword(passwordData);
      
      if (response.success) {
        set({ isLoading: false });
        return { success: true, message: 'Senha alterada com sucesso!' };
      } else {
        throw new Error(response.message || 'Erro ao alterar senha');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao alterar senha';
      
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

  // ========================================
  // AÇÕES DE RECUPERAÇÃO
  // ========================================

  /**
   * Solicitar recuperação de senha
   */
  forgotPassword: async (email) => {
    try {
      set({ isLoading: true });

      const response = await ApiService.auth.forgotPassword({ email });
      
      if (response.success) {
        set({ isLoading: false });
        return { 
          success: true, 
          message: 'Instruções enviadas para seu e-mail!' 
        };
      } else {
        throw new Error(response.message || 'Erro ao enviar recuperação');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao solicitar recuperação';
      
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
   * Resetar senha com token
   */
  resetPassword: async (resetData) => {
    try {
      set({ isLoading: true });

      const response = await ApiService.auth.resetPassword(resetData);
      
      if (response.success) {
        set({ isLoading: false });
        return { 
          success: true, 
          message: 'Senha redefinida com sucesso!' 
        };
      } else {
        throw new Error(response.message || 'Erro ao redefinir senha');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao redefinir senha';
      
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

  // ========================================
  // AÇÕES UTILITÁRIAS
  // ========================================

  /**
   * Limpar dados de autenticação
   */
  clearAuthData: async () => {
    try {
      await Promise.all([
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
    await AsyncStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    set({ loginAttempts: 0 });
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
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    
    // Opcional: sincronizar com servidor em background
    try {
      await ApiService.auth.updateLastActivity();
    } catch (error) {
      // Não exibir erro, é background sync
      console.log('Erro ao sincronizar última atividade:', error);
    }
  },

  /**
   * Verificar se usuário está logado há muito tempo
   */
  checkAuthExpiry: async () => {
    const lastLogin = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
    if (!lastLogin) return false;

    const daysSinceLogin = (Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24);
    
    // Se passou mais de 30 dias e não marcou "lembrar-me"
    if (daysSinceLogin > 30 && !get().rememberMe) {
      await get().performLogout();
      return true;
    }

    return false;
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