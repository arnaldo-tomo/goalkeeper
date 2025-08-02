// 👤 src/screens/ProfileScreen.js - Tela de Perfil do Usuário
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Stores e Utils
import useAuthStore from '../store/useAuthStore';
import { theme } from '../constants/theme'; // Adicionado import do tema
import { hapticFeedback } from '../utils/haptics';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateProfile } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Mock settings state - em produção viria do backend
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    weeklyReport: true,
    soundEffects: true,
    biometricAuth: false
  });

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    hapticFeedback.selection();
  };

  const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true, rightComponent }) => (
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
      
      {rightComponent || (showArrow && (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray[400]} />
      ))}
    </TouchableOpacity>
  );

  const SettingItem = ({ icon, title, subtitle, value, onToggle }) => (
    <MenuItem
      icon={icon}
      title={title}
      subtitle={subtitle}
      onPress={onToggle}
      showArrow={false}
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

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <StatusBar style="light" />
      <ScrollView style={styles.container}>
        {/* Header com gradiente */}
        <LinearGradient
          colors={[theme.colors.primary[500], theme.colors.primary[700]]}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {getInitials(user?.name)}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@exemplo.com'}</Text>
        </LinearGradient>

        {/* Cards de estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Metas Ativas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Taxa de Sucesso</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Dias Seguidos</Text>
          </View>
        </View>

        {/* Configurações Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações Rápidas</Text>
          <SettingItem
            icon="notifications-outline"
            title="Notificações"
            subtitle="Alertas e lembretes"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
          />
          <SettingItem
            icon="moon-outline"
            title="Modo Escuro"
            subtitle="Tema escuro"
            value={settings.darkMode}
            onToggle={() => toggleSetting('darkMode')}
          />
        </View>

        {/* Menu Principal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <MenuItem
            icon="person-outline"
            title="Editar Perfil"
            subtitle="Nome, email e informações"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <MenuItem
            icon="settings-outline"
            title="Configurações"
            subtitle="Preferências do app"
            onPress={() => navigation.navigate('Settings')}
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
            icon="information-circle-outline"
            title="Sobre"
            subtitle="Versão e informações"
            onPress={() => navigation.navigate('About')}
          />
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error[500]} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
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
    color: theme.colors.text.primary, // Corrigido de '#212121'
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary, // Corrigido de '#666'
  },
  profileHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    ...theme.shadows.md,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary[500],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary, // Corrigido de '#666'
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 16,
    borderRadius: 16,
    ...theme.shadows.md,
  },
  logoutText: {
    color: theme.colors.error[500],
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;
