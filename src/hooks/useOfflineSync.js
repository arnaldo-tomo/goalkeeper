import { useState, useEffect } from 'react';
import NetInfo from '@react-native-netinfo/netinfo';
import { storage } from '../utils/storage';
import ApiService from '../services/api';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Monitorar conectividade
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      
      if (state.isConnected && pendingActions.length > 0) {
        syncPendingActions();
      }
    });

    // Carregar ações pendentes
    loadPendingActions();

    return unsubscribe;
  }, []);

  const loadPendingActions = async () => {
    const actions = await storage.getItem('pending_actions') || [];
    setPendingActions(actions);
  };

  const addPendingAction = async (action) => {
    const newAction = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...action
    };
    
    const updatedActions = [...pendingActions, newAction];
    setPendingActions(updatedActions);
    await storage.setItem('pending_actions', updatedActions);
  };

  const syncPendingActions = async () => {
    if (!isOnline || isSyncing || pendingActions.length === 0) return;

    setIsSyncing(true);

    try {
      const successfulActions = [];
      
      for (const action of pendingActions) {
        try {
          await executeAction(action);
          successfulActions.push(action.id);
        } catch (error) {
          console.error('Erro ao sincronizar ação:', error);
        }
      }

      // Remover ações bem-sucedidas
      const remainingActions = pendingActions.filter(
        action => !successfulActions.includes(action.id)
      );
      
      setPendingActions(remainingActions);
      await storage.setItem('pending_actions', remainingActions);
      
    } catch (error) {
      console.error('Erro na sincronização:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const executeAction = async (action) => {
    switch (action.type) {
      case 'CREATE_GOAL':
        return await ApiService.goals.create(action.data);
      case 'UPDATE_GOAL':
        return await ApiService.goals.update(action.id, action.data);
      case 'DELETE_GOAL':
        return await ApiService.goals.delete(action.id);
      case 'CREATE_TASK':
        return await ApiService.tasks.create(action.data);
      case 'UPDATE_TASK':
        return await ApiService.tasks.update(action.id, action.data);
      case 'CREATE_NOTE':
        return await ApiService.notes.create(action.data);
      default:
        throw new Error(`Tipo de ação desconhecido: ${action.type}`);
    }
  };

  return {
    isOnline,
    pendingActions,
    isSyncing,
    addPendingAction,
    syncPendingActions
  };
};