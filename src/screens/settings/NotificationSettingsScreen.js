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