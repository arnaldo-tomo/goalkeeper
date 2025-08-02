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

import useAuthStore from '../store/useAuthStore';

export const ProfileScreen = ({ navigation }) => {
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
  };

  const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true, rightComponent }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Ionicons name={icon} size={20} color="#2196F3" />
        </View>
        <View>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      {rightComponent || (showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
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
          trackColor={{ false: '#E0E0E0', true: '#2196F380' }}
          thumbColor={value ? '#2196F3' : '#FFF'}
        />
      }
    />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.profileHeader}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@exemplo.com'}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={16} color="#2196F3" />
          <Text style={styles.editProfileText}>Editar Perfil</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user?.streak_days || 0}</Text>
          <Text style={styles.statLabel}>Dias Seguidos</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Metas Concluídas</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>85%</Text>
          <Text style={styles.statLabel}>Taxa de Sucesso</Text>
        </View>
      </View>

      {/* Menu Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minha Conta</Text>
        
        <MenuItem
          icon="person-outline"
          title="Informações Pessoais"
          subtitle="Nome, email, timezone"
          onPress={() => navigation.navigate('EditProfile')}
        />
        
        <MenuItem
          icon="shield-checkmark-outline"
          title="Privacidade e Segurança"
          subtitle="Senha, autenticação"
          onPress={() => navigation.navigate('Security')}
        />
        
        <MenuItem
          icon="card-outline"
          title="Plano e Cobrança"
          subtitle="Gerenciar assinatura"
          onPress={() => navigation.navigate('Billing')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        
        <SettingItem
          icon="notifications-outline"
          title="Notificações"
          subtitle="Lembretes e alertas"
          value={settings.notifications}
          onToggle={() => toggleSetting('notifications')}
        />
        
        <SettingItem
          icon="moon-outline"
          title="Modo Escuro"
          subtitle="Tema escuro da interface"
          value={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
        />
        
        <SettingItem
          icon="mail-outline"
          title="Relatório Semanal"
          subtitle="Receber por email"
          value={settings.weeklyReport}
          onToggle={() => toggleSetting('weeklyReport')}
        />
        
        <SettingItem
          icon="volume-high-outline"
          title="Efeitos Sonoros"
          subtitle="Sons de celebração"
          value={settings.soundEffects}
          onToggle={() => toggleSetting('soundEffects')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados e Backup</Text>
        
        <MenuItem
          icon="cloud-download-outline"
          title="Exportar Dados"
          subtitle="Baixar suas informações"
          onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}
        />
        
        <MenuItem
          icon="sync-outline"
          title="Sincronização"
          subtitle="Backup automático"
          onPress={() => navigation.navigate('Sync')}
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
          icon="chatbubble-ellipses-outline"
          title="Fale Conosco"
          subtitle="Suporte técnico"
          onPress={() => navigation.navigate('Contact')}
        />
        
        <MenuItem
          icon="star-outline"
          title="Avaliar App"
          subtitle="Deixe sua avaliação"
          onPress={() => Alert.alert('Obrigado!', 'Redirecionando para a loja...')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        
        <MenuItem
          icon="information-circle-outline"
          title="Sobre o GoalKeeper"
          subtitle="Versão 1.0.0"
          onPress={() => navigation.navigate('About')}
        />
        
        <MenuItem
          icon="document-text-outline"
          title="Termos de Uso"
          onPress={() => navigation.navigate('Terms')}
        />
        
        <MenuItem
          icon="lock-closed-outline"
          title="Política de Privacidade"
          onPress={() => navigation.navigate('Privacy')}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#F44336" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Desenvolvido com ❤️ em Moçambique
        </Text>
        <Text style={styles.versionText}>GoalKeeper v1.0.0</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};



// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cancelButton: {
    color: '#666',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  saveButton: {
    color: theme.colors.success[500],
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: '#CCC',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 200,
  },
  tagsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
  },
  addTagButton: {
    padding: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success[100],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.success[600],
    marginRight: 4,
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  favoriteText: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 12,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#666',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary[500],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    marginBottom: 20,
  },
  logoutText: {
    color: theme.colors.error[500],
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

