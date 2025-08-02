// 🔔 src/utils/notifications.js - GoalKeeper Notifications Utility
import { Platform } from 'react-native'; // ✅ ADICIONADO: Import do Platform
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configurar como as notificações devem ser tratadas quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2196F3',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Permissão de notificação negada!');
      return;
    }
    
    try {
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;
    } catch (error) {
      console.warn('Erro ao obter token de notificação:', error);
    }
  } else {
    console.warn('Deve usar um dispositivo físico para receber push notifications');
  }

  return token;
};

export const scheduleLocalNotification = async (title, body, trigger) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger,
    });
  } catch (error) {
    console.warn('Erro ao agendar notificação:', error);
  }
};

export const scheduleGoalReminder = async (goal, reminderTime) => {
  await scheduleLocalNotification(
    `🎯 Lembrete: ${goal.title}`,
    `Não esqueça de trabalhar na sua meta!`,
    { date: new Date(reminderTime) }
  );
};

export const scheduleTaskReminder = async (task, reminderTime) => {
  await scheduleLocalNotification(
    `✅ Tarefa: ${task.title}`,
    task.description || `Hora de trabalhar nesta tarefa!`,
    { date: new Date(reminderTime) }
  );
};

export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('Erro ao cancelar notificações:', error);
  }
};