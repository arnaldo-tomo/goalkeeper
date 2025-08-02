// 🏠 src/screens/HomeScreen.js - GoalKeeper Home Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

// Stores
import useAuthStore from '../store/useAuthStore';
import useGoalsStore from '../store/useGoalsStore';

// Components
import { ProgressRing } from '../components/goals/ProgressRing';
import { QuickActions } from '../components/widgets/QuickActions.js';
import { ProgressChart } from '../components/charts/ProgressChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

// Utils
import { formatRelativeDate, generateMotivationalMessage } from '../utils/helpers';
import { hapticFeedback } from '../utils/haptics';
import { theme } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  // ========================================
  // ESTADO E STORES
  // ========================================
  const { user, updateLastActivity } = useAuthStore();
  const { 
    goals, 
    isLoading, 
    loadGoals, 
    getFilteredGoals,
    completeGoal 
  } = useGoalsStore();

  const [refreshing, setRefreshing] = useState(false);
  const [todayStats, setTodayStats] = useState({
    completedTasks: 0,
    totalTasks: 0,
    completedGoals: 0,
    totalGoals: 0
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  // ========================================
  // EFEITOS E CARREGAMENTO
  // ========================================
  
  // Carregar dados quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
      updateLastActivity();
    }, [])
  );

  // Atualizar estatísticas quando goals mudarem
  useEffect(() => {
    if (goals.length > 0) {
      calculateTodayStats();
      findUpcomingDeadlines();
      generateMessage();
    }
  }, [goals]);

  // ========================================
  // FUNÇÕES DE CARREGAMENTO
  // ========================================

  const loadInitialData = async () => {
    try {
      await loadGoals({ status: 'active', limit: 20 });
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    hapticFeedback.light();
    
    try {
      await Promise.all([
        loadGoals({ status: 'active', limit: 20 }),
        // Aqui você pode adicionar outras chamadas de API
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados');
    } finally {
      setRefreshing(false);
    }
  };

  // ========================================
  // CÁLCULOS E ESTATÍSTICAS
  // ========================================

  const calculateTodayStats = () => {
    const activeGoals = getFilteredGoals().filter(goal => goal.status === 'active');
    const completedGoals = goals.filter(goal => goal.status === 'completed');
    
    let totalTasks = 0;
    let completedTasks = 0;

    activeGoals.forEach(goal => {
      if (goal.tasks) {
        totalTasks += goal.tasks.length;
        completedTasks += goal.tasks.filter(task => task.status === 'completed').length;
      }
    });

    setTodayStats({
      completedTasks,
      totalTasks,
      completedGoals: completedGoals.length,
      totalGoals: goals.length
    });
  };

  const findUpcomingDeadlines = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcoming = goals
      .filter(goal => {
        if (!goal.end_date || goal.status === 'completed') return false;
        const endDate = new Date(goal.end_date);
        return endDate >= now && endDate <= sevenDaysFromNow;
      })
      .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
      .slice(0, 3);

    setUpcomingDeadlines(upcoming);
  };

  const generateMessage = () => {
    const progress = todayStats.totalGoals > 0 
      ? Math.round((todayStats.completedGoals / todayStats.totalGoals) * 100)
      : 0;
    
    setMotivationalMessage(generateMotivationalMessage(progress));
  };

  // ========================================
  // HANDLERS DE AÇÕES
  // ========================================

  const handleGoalPress = (goal) => {
    hapticFeedback.light();
    navigation.navigate('GoalDetail', { 
      goalId: goal.id,
      goalTitle: goal.title 
    });
  };

  const handleCompleteGoal = async (goalId) => {
    hapticFeedback.success();
    
    const result = await completeGoal(goalId);
    if (result.success) {
      Alert.alert('Parabéns! 🎉', 'Meta concluída com sucesso!');
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  const handleCreateGoal = () => {
    hapticFeedback.medium();
    navigation.navigate('CreateGoal');
  };

  const handleViewAllGoals = () => {
    hapticFeedback.light();
    navigation.navigate('Goals');
  };

  const handleViewAnalytics = () => {
    hapticFeedback.light();
    navigation.navigate('Analytics');
  };

  // ========================================
  // FUNÇÕES UTILITÁRIAS
  // ========================================

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.name?.split(' ')[0] || 'Usuário';
    
    if (hour < 12) return `Bom dia, ${firstName}! ☀️`;
    if (hour < 18) return `Boa tarde, ${firstName}! 🌤️`;
    return `Boa noite, ${firstName}! 🌙`;
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return theme.colors.success[500];
    if (percentage >= 50) return theme.colors.warning[500];
    return theme.colors.primary[500];
  };

  // ========================================
  // COMPONENTES
  // ========================================

  const StatCard = ({ title, value, subtitle, icon, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statCardHeader}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  const GoalPreviewCard = ({ goal }) => {
    const progress = goal.completion_percentage || 0;
    const isOverdue = goal.is_overdue;
    
    return (
      <TouchableOpacity
        style={[styles.goalPreviewCard, isOverdue && styles.overdueCard]}
        onPress={() => handleGoalPress(goal)}
        activeOpacity={0.8}
      >
        <View style={styles.goalPreviewHeader}>
          <View style={styles.goalPreviewInfo}>
            <Text style={styles.goalPreviewTitle} numberOfLines={1}>
              {goal.title}
            </Text>
            <Text style={styles.goalPreviewCategory}>
              {goal.category} • {goal.priority}
            </Text>
          </View>
          <ProgressRing
            progress={progress}
            size={40}
            strokeWidth={3}
            color={getProgressColor(progress)}
            showPercentage={false}
          />
        </View>
        
        <View style={styles.goalPreviewFooter}>
          <Text style={styles.goalPreviewTasks}>
            {goal.tasks_completed}/{goal.total_tasks} tarefas
          </Text>
          {goal.end_date && (
            <Text style={[
              styles.goalPreviewDate,
              isOverdue && styles.overdueText
            ]}>
              {formatRelativeDate(goal.end_date)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const UpcomingDeadlineCard = ({ goal }) => (
    <TouchableOpacity
      style={styles.deadlineCard}
      onPress={() => handleGoalPress(goal)}
      activeOpacity={0.7}
    >
      <View style={styles.deadlineCardContent}>
        <Ionicons name="alarm-outline" size={16} color={theme.colors.warning[500]} />
        <Text style={styles.deadlineCardTitle} numberOfLines={1}>
          {goal.title}
        </Text>
      </View>
      <Text style={styles.deadlineCardDate}>
        {formatRelativeDate(goal.end_date)}
      </Text>
    </TouchableOpacity>
  );

  // ========================================
  // LOADING E EMPTY STATES
  // ========================================

  if (isLoading && goals.length === 0) {
    return <LoadingSpinner />;
  }

  const activeGoals = getFilteredGoals().filter(goal => goal.status === 'active');

  // ========================================
  // RENDER PRINCIPAL
  // ========================================

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary[500]}
            colors={[theme.colors.primary[500]]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header com Gradiente */}
        <LinearGradient
          colors={[theme.colors.primary[500], theme.colors.primary[700]]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.motivationalMessage}>
                  {motivationalMessage}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <StatCard
                title="Metas Ativas"
                value={activeGoals.length}
                subtitle={`${todayStats.completedGoals} concluídas`}
                icon="target"
                color={theme.colors.primary[500]}
                onPress={handleViewAllGoals}
              />
              
              <StatCard
                title="Tarefas"
                value={`${todayStats.completedTasks}/${todayStats.totalTasks}`}
                subtitle="Hoje"
                icon="checkmark-circle"
                color={theme.colors.success[500]}
                onPress={handleViewAllGoals}
              />
              
              <StatCard
                title="Sequência"
                value={user?.streak_days || 0}
                subtitle="dias"
                icon="flame"
                color={theme.colors.warning[500]}
                onPress={handleViewAnalytics}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <QuickActions navigation={navigation} />

        {/* Metas Ativas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Metas Ativas</Text>
            <TouchableOpacity onPress={handleViewAllGoals}>
              <Text style={styles.seeAllText}>Ver todas ({activeGoals.length})</Text>
            </TouchableOpacity>
          </View>

          {activeGoals.length === 0 ? (
            <EmptyState
              icon="target-outline"
              title="Nenhuma meta ativa"
              subtitle="Comece criando sua primeira meta!"
              style={styles.emptyState}
            />
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.goalsScrollContainer}
            >
              {activeGoals.slice(0, 5).map(goal => (
                <GoalPreviewCard key={goal.id} goal={goal} />
              ))}
              
              {/* Card para criar nova meta */}
              <TouchableOpacity
                style={styles.createGoalCard}
                onPress={handleCreateGoal}
                activeOpacity={0.7}
              >
                <View style={styles.createGoalIcon}>
                  <Ionicons name="add" size={24} color={theme.colors.primary[500]} />
                </View>
                <Text style={styles.createGoalText}>Nova Meta</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>

        {/* Prazos Próximos */}
        {upcomingDeadlines.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Prazos Próximos</Text>
              <Ionicons name="warning-outline" size={20} color={theme.colors.warning[500]} />
            </View>

            <View style={styles.deadlinesContainer}>
              {upcomingDeadlines.map(goal => (
                <UpcomingDeadlineCard key={goal.id} goal={goal} />
              ))}
            </View>
          </View>
        )}

        {/* Gráfico de Progresso */}
        <ProgressChart data={goals} period={7} />

        {/* Espaço extra no final */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCreateGoal}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.colors.primary[500], theme.colors.primary[600]]}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  motivationalMessage: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    ...theme.shadows.md,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statCardSubtitle: {
    fontSize: 10,
    color: theme.colors.text.secondary,
  },

  // Section Styles
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: theme.colors.primary[500],
    fontWeight: '600',
  },

  // Goals Preview
  goalsScrollContainer: {
    paddingHorizontal: 16,
  },
  goalPreviewCard: {
    width: screenWidth * 0.7,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    ...theme.shadows.md,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error[500],
  },
  goalPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalPreviewInfo: {
    flex: 1,
    marginRight: 12,
  },
  goalPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  goalPreviewCategory: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textTransform: 'capitalize',
  },
  goalPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalPreviewTasks: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  goalPreviewDate: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  overdueText: {
    color: theme.colors.error[500],
    fontWeight: '600',
  },

  // Create Goal Card
  createGoalCard: {
    width: screenWidth * 0.4,
    backgroundColor: theme.colors.background.paper,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary[200],
    borderStyle: 'dashed',
    minHeight: 120,
  },
  createGoalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  createGoalText: {
    fontSize: 14,
    color: theme.colors.primary[500],
    fontWeight: '600',
  },

  // Deadlines
  deadlinesContainer: {
    paddingHorizontal: 20,
  },
  deadlineCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning[500],
    ...theme.shadows.sm,
  },
  deadlineCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deadlineCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  deadlineCardDate: {
    fontSize: 12,
    color: theme.colors.warning[600],
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    ...theme.shadows.lg,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;