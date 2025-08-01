const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    weeklyReport: true,
    soundEffects: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    hapticFeedback.selection();
  };

  const MenuItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Ionicons name={icon} size={20} color={theme.colors.primary[500]} />
        </View>
        <View>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Ionicons name="chevron-forward" size={20} color="#CCC" />}
    </TouchableOpacity>
  );

  const SettingItem = ({ icon, title, subtitle, value, onToggle }) => (
    <MenuItem
      icon={icon}
      title={title}
      subtitle={subtitle}
      onPress={onToggle}
      rightComponent={
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E0E0E0', true: theme.colors.primary[300] }}
          thumbColor={value ? theme.colors.primary[500] : '#FFF'}
        />
      }
    />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <SettingItem
          icon="notifications-outline"
          title="Notificações Push"
          subtitle="Receber lembretes"
          value={settings.notifications}
          onToggle={() => toggleSetting('notifications')}
        />
        <SettingItem
          icon="mail-outline"
          title="Relatório Semanal"
          subtitle="Resumo por email"
          value={settings.weeklyReport}
          onToggle={() => toggleSetting('weeklyReport')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aparência</Text>
        <SettingItem
          icon="moon-outline"
          title="Modo Escuro"
          subtitle="Tema escuro"
          value={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
        />
        <SettingItem
          icon="volume-high-outline"
          title="Efeitos Sonoros"
          subtitle="Sons de interação"
          value={settings.soundEffects}
          onToggle={() => toggleSetting('soundEffects')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <MenuItem
          icon="person-outline"
          title="Editar Perfil"
          subtitle="Nome, email, foto"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <MenuItem
          icon="shield-checkmark-outline"
          title="Segurança"
          subtitle="Senha e autenticação"
          onPress={() => navigation.navigate('Security')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        <MenuItem
          icon="help-circle-outline"
          title="Central de Ajuda"
          subtitle="FAQ e tutoriais"
          onPress={() => navigation.navigate('Help')}
        />
        <MenuItem
          icon="mail-outline"
          title="Fale Conosco"
          subtitle="Suporte técnico"
          onPress={() => navigation.navigate('Contact')}
        />
      </View>
    </ScrollView>
  );
};
