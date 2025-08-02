import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryBar } from 'victory-native';

// Services e Utils
import ApiService from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { formatDate } from '../utils/helpers';
import { theme } from '../constants/theme';

// Components
import LoadingSpinner from '../components/common/LoadingSpinner';

const { width: screenWidth } = Dimensions.get('window');

export const AnalyticsScreen = ({ navigation }) => {
  // ========================================
  // ESTADO
  // ========================================
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState('overview');

  const periods = [
    { value: 7, label: '7 dias' },
    { value: 30, label: '30 dias' },
    { value: 90, label: '90 dias' }
  ];

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: 'analytics-outline' },
    { id: 'goals', label: 'Metas', icon: 'target-outline' },
    { id: 'productivity', label: 'Produtividade', icon: 'trending-up-outline' },
    { id: 'habits', label: 'Hábitos', icon: 'refresh-outline' }
  ];

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  // ========================================
  // FUNÇÕES DE CARREGAMENTO
  // ========================================

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      const [analyticsResponse, productivityResponse] = await Promise.all([
        ApiService.analytics.getDashboard(selectedPeriod),
        ApiService.analytics.getProductivity(selectedPeriod)
      ]);
      
      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data);
      }
      
      if (productivityResponse.success) {
        setProductivity(productivityResponse.data);
      }
      
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  // ========================================
  // HANDLERS
  // ========================================

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // ========================================
  // COMPONENTES
  // ========================================

  const PeriodSelector = () => (
    <View style={styles.periodSelector}>
      {periods.map(period => (
        <TouchableOpacity
          key={period.value}
          style={[
            styles.periodButton,
            selectedPeriod === period.value && styles.periodButtonActive
          ]}
          onPress={() => handlePeriodChange(period.value)}
        >
          <Text style={[
            styles.periodButtonText,
            selectedPeriod === period.value && styles.periodButtonTextActive
          ]}>
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const TabBar = () => (
    <View style={styles.tabBar}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarContent}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive
            ]}
            onPress={() => handleTabChange(tab.id)}
          >
            <Ionicons 
              name={tab.icon} 
              size={18} 
              color={activeTab === tab.id ? theme.colors.primary[500] : theme.colors.gray[500]} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const MetricCard = ({ title, value, subtitle, icon, color, trend }) => (
    <View style={[styles.metricCard, { borderTopColor: color }]}>
      <View style={styles.metricCardHeader}>
        <View style={styles.metricCardTitle}>
          <Ionicons name={icon} size={20} color={color} />
          <Text style={styles.metricCardTitleText}>{title}</Text>
        </View>
        {trend && (
          <View style={[styles.trendIndicator, { backgroundColor: trend > 0 ? theme.colors.success[100] : theme.colors.error[100] }]}>
            <Ionicons 
              name={trend > 0 ? "trending-up" : "trending-down"} 
              size={14} 
              color={trend > 0 ? theme.colors.success[600] : theme.colors.error[600]} 
            />
            <Text style={[
              styles.trendText,
              { color: trend > 0 ? theme.colors.success[600] : theme.colors.error[600] }
            ]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );

  const OverviewTab = () => {
    if (!analytics) return null;

    return (
      <View style={styles.tabContent}>
        {/* Métricas Principais */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Metas Concluídas"
            value={analytics.overview.completed_goals}
            subtitle={`de ${analytics.overview.total_goals} metas`}
            icon="trophy-outline"
            color={theme.colors.success[500]}
            trend={5}
          />
          
          <MetricCard
            title="Tarefas Finalizadas"
            value={analytics.overview.completed_tasks}
            subtitle="neste período"
            icon="checkmark-circle-outline"
            color={theme.colors.primary[500]}
            trend={12}
          />
          
          <MetricCard
            title="Sequência Atual"
            value={`${analytics.overview.streak_days} dias`}
            subtitle="consecutivos ativos"
            icon="flame-outline"
            color={theme.colors.warning[500]}
            trend={0}
          />
          
          <MetricCard
            title="Notas Criadas"
            value={analytics.overview.notes_count}
            subtitle="total de notas"
            icon="document-text-outline"
            color={theme.colors.success[600]}
            trend={8}
          />
        </View>

        {/* Gráfico de Progresso */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Atividade dos Últimos {selectedPeriod} Dias</Text>
          <View style={styles.chart}>
            {analytics.progress_chart && analytics.progress_chart.length > 0 ? (
              <VictoryChart
                height={200}
                width={screenWidth - 40}
                padding={{ left: 50, top: 20, right: 20, bottom: 50 }}
                domainPadding={{ x: 20 }}
              >
                <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
                <VictoryAxis />
                <VictoryArea
                  data={analytics.progress_chart}
                  x="date"
                  y="tasks_completed"
                  style={{
                    data: { fill: theme.colors.primary[200], fillOpacity: 0.6, stroke: theme.colors.primary[500], strokeWidth: 2 }
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 500 }
                  }}
                />
              </VictoryChart>
            ) : (
              <View style={styles.chartPlaceholder}>
                <Ionicons name="bar-chart-outline" size={48} color={theme.colors.gray[300]} />
                <Text style={styles.chartPlaceholderText}>Dados insuficientes</Text>
              </View>
            )}
          </View>
        </View>

        {/* Categorias */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Progresso por Categoria</Text>
          {analytics.categories_breakdown && analytics.categories_breakdown.map((category, index) => (
            <View key={index} style={styles.categoryProgress}>
              <Text style={styles.categoryName}>{category.category}</Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${category.completion_rate}%`,
                      backgroundColor: theme.colors.primary[500]
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressPercent}>{category.completion_rate}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const ProductivityTab = () => {
    if (!productivity) return null;

    return (
      <View style={styles.tabContent}>
        {/* Score Geral */}
        <View style={styles.productivityHeader}>
          <LinearGradient
            colors={[theme.colors.primary[400], theme.colors.primary[600]]}
            style={styles.productivityScoreCard}
          >
            <Text style={styles.productivityScoreLabel}>Score de Produtividade</Text>
            <Text style={styles.productivityScoreValue}>{productivity.overall_score}%</Text>
            <View style={styles.productivityTrend}>
              <Ionicons 
                name={productivity.trend >= 0 ? "trending-up" : "trending-down"} 
                size={16} 
                color="white" 
              />
              <Text style={styles.productivityTrendText}>
                {productivity.trend >= 0 ? '+' : ''}{productivity.trend}% vs período anterior
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Métricas Detalhadas */}
        <View style={styles.productivityMetrics}>
          <View style={styles.productivityMetric}>
            <Text style={styles.productivityMetricLabel}>Taxa de Conclusão de Metas</Text>
            <Text style={styles.productivityMetricValue}>{productivity.goal_completion_rate}%</Text>
          </View>
          
          <View style={styles.productivityMetric}>
            <Text style={styles.productivityMetricLabel}>Taxa de Conclusão de Tarefas</Text>
            <Text style={styles.productivityMetricValue}>{productivity.task_completion_rate}%</Text>
          </View>
          
          <View style={styles.productivityMetric}>
            <Text style={styles.productivityMetricLabel}>Sequência Ativa</Text>
            <Text style={styles.productivityMetricValue}>{productivity.active_streak} dias</Text>
          </View>
        </View>

        {/* Dicas de Melhoria */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>💡 Dicas para Melhorar</Text>
          <View style={styles.tip}>
            <Ionicons name="bulb-outline" size={20} color={theme.colors.warning[500]} />
            <Text style={styles.tipText}>
              Mantenha metas com prazos realistas para aumentar sua taxa de conclusão
            </Text>
          </View>
          <View style={styles.tip}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary[500]} />
            <Text style={styles.tipText}>
              Divida metas grandes em tarefas menores para facilitar o progresso
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'productivity':
        return <ProductivityTab />;
      case 'goals':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>📊 Análise de Metas em breve...</Text>
          </View>
        );
      case 'habits':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>🔄 Análise de Hábitos em breve...</Text>
          </View>
        );
      default:
        return null;
    }
  };

  // ========================================
  // RENDER PRINCIPAL
  // ========================================

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary[500], theme.colors.primary[700]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Relatórios</Text>
          <Text style={styles.headerSubtitle}>
            Acompanhe seu progresso e produtividade
          </Text>
        </View>
        <PeriodSelector />
      </LinearGradient>

      {/* Tab Bar */}
      <TabBar />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary[500]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  
  // Header Styles
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },

  // Notes Screen Styles
  statsHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: 12,
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[100],
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary[500],
  },
  filterTabText: {
    fontSize: 14,
    color: theme.colors.gray[600],
    marginLeft: 6,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: 'white',
  },
  notesList: {
    paddingVertical: 16,
  },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    ...theme.shadows.md,
  },
  noteCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noteCardInfo: {
    flex: 1,
    marginRight: 12,
  },
  noteCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  noteCardGoal: {
    fontSize: 12,
    color: theme.colors.primary[600],
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 4,
  },
  noteCardContent: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  noteCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteCardTags: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteTag: {
    backgroundColor: theme.colors.primary[100],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  noteTagText: {
    fontSize: 10,
    color: theme.colors.primary[600],
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 10,
    color: theme.colors.gray[500],
    fontStyle: 'italic',
  },
  noteCardDate: {
    fontSize: 12,
    color: theme.colors.gray[500],
  },
  editedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  editedText: {
    fontSize: 10,
    color: theme.colors.gray[500],
    marginLeft: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  // Analytics Screen Styles
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 6,
  },
  periodButtonActive: {
    backgroundColor: 'white',
  },
  periodButtonText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: theme.colors.primary[500],
    fontWeight: 'bold',
  },
  tabBar: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },
  tabBarContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[100],
    marginRight: 12,
  },
  tabActive: {
    backgroundColor: theme.colors.primary[100],
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.gray[600],
    marginLeft: 6,
    fontWeight: '500',
  },
  tabTextActive: {
    color: theme.colors.primary[600],
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  
  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderTopWidth: 4,
    ...theme.shadows.md,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricCardTitleText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },

  // Chart Styles
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...theme.shadows.md,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    alignItems: 'center',
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: theme.colors.gray[500],
    marginTop: 12,
  },

  // Categories
  categoriesContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...theme.shadows.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  categoryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    width: 80,
    textTransform: 'capitalize',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    width: 40,
    textAlign: 'right',
    fontWeight: '600',
  },

  // Productivity Styles
  productivityHeader: {
    marginBottom: 24,
  },
  productivityScoreCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  productivityScoreLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  productivityScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  productivityTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productivityTrendText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 4,
  },
  productivityMetrics: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...theme.shadows.md,
  },
  productivityMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  productivityMetricLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  productivityMetricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary[500],
  },

  // Tips
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    ...theme.shadows.md,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },

  // Coming Soon
  comingSoon: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    paddingVertical: 60,
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

