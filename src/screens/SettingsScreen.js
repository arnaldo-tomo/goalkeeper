import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Utils
import { theme } from '../constants/theme'; // Adicionado import do tema
import { hapticFeedback } from '../utils/haptics';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    weeklyReport: true,
    soundEffects: true,
    biometricAuth: false,
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
      {rightComponent || <Ionicons name="chevron-forward" size={20} color={theme.colors.gray[400]} />}
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
          trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary[300] }}
          thumbColor={value ? theme.colors.primary[500] : '#FFF'}
        />
      }
    />
  );

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        {/* Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <SettingItem
            icon="notifications-outline"
            title="Notificações Push"
            subtitle="Receber lembretes e alertas"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
          />
          <SettingItem
            icon="mail-outline"
            title="Relatório Semanal"
            subtitle="Resumo semanal por email"
            value={settings.weeklyReport}
            onToggle={() => toggleSetting('weeklyReport')}
          />
        </View>

        {/* Aparência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <MenuItem
            icon="color-palette-outline"
            title="Tema"
            subtitle="Cores e aparência"
            onPress={() => navigation.navigate('ThemeSettings')}
          />
          <SettingItem
            icon="volume-high-outline"
            title="Efeitos Sonoros"
            subtitle="Sons de interação"
            value={settings.soundEffects}
            onToggle={() => toggleSetting('soundEffects')}
          />
        </View>

        {/* Segurança */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>
          <MenuItem
            icon="shield-checkmark-outline"
            title="Segurança"
            subtitle="Senha e autenticação"
            onPress={() => navigation.navigate('Security')}
          />
          <SettingItem
            icon="finger-print-outline"
            title="Autenticação Biométrica"
            subtitle="Touch ID / Face ID"
            value={settings.biometricAuth}
            onToggle={() => toggleSetting('biometricAuth')}
          />
        </View>

        {/* Configurações Avançadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avançado</Text>
          <MenuItem
            icon="notifications-outline"
            title="Configurações de Notificação"
            subtitle="Personalizar alertas"
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          <MenuItem
            icon="download-outline"
            title="Exportar Dados"
            subtitle="Backup das suas informações"
            onPress={() => {
              // Implementar exportação de dados
              hapticFeedback.light();
            }}
          />
        </View>

        {/* Suporte */}
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
          <MenuItem
            icon="information-circle-outline"
            title="Sobre"
            subtitle="Versão e informações do app"
            onPress={() => navigation.navigate('About')}
          />
          <MenuItem
            icon="document-text-outline"
            title="Termos de Uso"
            subtitle="Política de privacidade"
            onPress={() => navigation.navigate('Terms')}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    ...theme.shadows.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    padding: 20,
    paddingBottom: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
});

export default SettingsScreen;