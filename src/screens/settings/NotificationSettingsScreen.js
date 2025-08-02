import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch
} from 'react-native';
import { theme } from '../../constants/theme';
import { hapticFeedback } from '../../utils/haptics';

const NotificationSettingsScreen = () => {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    dailyReminder: true,
    weeklyReport: false,
    goalDeadlines: true,
    taskReminders: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    hapticFeedback.selection();
  };

  const SettingItem = ({ title, subtitle, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Text style={styles.settingItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingItemSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E0E0E0', true: theme.colors.primary[300] }}
        thumbColor={value ? theme.colors.primary[500] : '#FFF'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações Push</Text>
        <SettingItem
          title="Notificações Gerais"
          subtitle="Ativar todas as notificações"
          value={settings.pushNotifications}
          onToggle={() => toggleSetting('pushNotifications')}
        />
        <SettingItem
          title="Lembretes de Tarefas"
          subtitle="Quando uma tarefa estiver próxima"
          value={settings.taskReminders}
          onToggle={() => toggleSetting('taskReminders')}
        />
        <SettingItem
          title="Prazos de Metas"
          subtitle="Alertas sobre deadlines"
          value={settings.goalDeadlines}
          onToggle={() => toggleSetting('goalDeadlines')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>E-mail</Text>
        <SettingItem
          title="Notificações por E-mail"
          subtitle="Receber emails informativos"
          value={settings.emailNotifications}
          onToggle={() => toggleSetting('emailNotifications')}
        />
        <SettingItem
          title="Lembrete Diário"
          subtitle="Resumo diário das atividades"
          value={settings.dailyReminder}
          onToggle={() => toggleSetting('dailyReminder')}
        />
        <SettingItem
          title="Relatório Semanal"
          subtitle="Resumo semanal de progresso"
          value={settings.weeklyReport}
          onToggle={() => toggleSetting('weeklyReport')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  settingItemLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  settingItemSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});

export default NotificationSettingsScreen;
