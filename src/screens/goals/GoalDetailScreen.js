import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import useGoalsStore from '../../store/useGoalsStore';
import { ProgressRing, TaskCard } from '../../components';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ApiService from '../../services/api';

const GoalDetailScreen = ({ route, navigation }) => {
  const { goalId } = route.params;
  const [goal, setGoal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const { updateGoal, deleteGoal, completeGoal } = useGoalsStore();

  useEffect(() => {
    loadGoalDetails();
  }, [goalId]);

  const loadGoalDetails = async () => {
    try {
      setIsLoading(true);
      const [goalResponse, tasksResponse] = await Promise.all([
        ApiService.goals.getById(goalId),
        ApiService.tasks.getAll({ goal_id: goalId })
      ]);

      if (goalResponse.success) {
        setGoal(goalResponse.data);
        navigation.setOptions({ title: goalResponse.data.title });
      }

      if (tasksResponse.success) {
        setTasks(tasksResponse.data.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes da meta:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da meta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGoalDetails();
    setRefreshing(false);
  };

  const handleCompleteGoal = async () => {
    Alert.alert(
      'Completar Meta',
      'Tem certeza que deseja marcar esta meta como concluída?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Completar',
          style: 'default',
          onPress: async () => {
            const result = await completeGoal(goalId);
            if (result.success) {
              setGoal(result.data);
              Alert.alert('Parabéns! 🎉', 'Meta concluída com sucesso!');
            } else {
              Alert.alert('Erro', result.message);
            }
          }
        }
      ]
    );
  };

  const handleDeleteGoal = async () => {
    Alert.alert(
      'Excluir Meta',
      'Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteGoal(goalId);
            if (result.success) {
              navigation.goBack();
            } else {
              Alert.alert('Erro', result.message);
            }
          }
        }
      ]
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      trabalho: '#2196F3',
      saude: '#4CAF50',
      pessoal: '#FF9800',
      financeiro: '#9C27B0',
      educacao: '#607D8B',
      outro: '#795548'
    };
    return colors[category] || colors.outro;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#F44336',
      medium: '#FF9800',
      low: '#4CAF50'
    };
    return colors[priority] || colors.medium;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!goal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Meta não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <LinearGradient
          colors={[getCategoryColor(goal.category), getCategoryColor(goal.category) + '80']}
          style={styles.headerCard}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.headerInfo}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </View>
              
              <ProgressRing
                progress={goal.completion_percentage}
                size={80}
                strokeWidth={6}
                color="white"
                backgroundColor="rgba(255,255,255,0.3)"
              />
            </View>

            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statText}>
                  {goal.days_remaining > 0 
                    ? `${goal.days_remaining} dias restantes`
                    : goal.status === 'completed' 
                      ? 'Concluída'
                      : 'Prazo vencido'
                  }
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.statText}>
                  {goal.tasks_completed}/{goal.total_tasks} tarefas
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => navigation.navigate('CreateTask', { goalId })}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.actionButtonText}>Nova Tarefa</Text>
          </TouchableOpacity>

          {goal.status !== 'completed' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.successButton]}
              onPress={handleCompleteGoal}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.actionButtonText}>Completar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => setShowOptionsModal(true)}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tarefas ({tasks.length})</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Filtrar</Text>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyTasks}>
              <Ionicons name="list-outline" size={48} color="#CCC" />
              <Text style={styles.emptyTasksTitle}>Nenhuma tarefa ainda</Text>
              <Text style={styles.emptyTasksSubtitle}>
                Adicione tarefas para organizar sua meta
              </Text>
            </View>
          ) : (
            tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              />
            ))
          )}
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notas Relacionadas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CreateNote', { goalId })}>
              <Text style={styles.seeAllText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.comingSoon}>Em breve...</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Opções da Meta</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => {
                setShowOptionsModal(false);
                navigation.navigate('EditGoal', { goalId });
              }}
            >
              <Ionicons name="create-outline" size={24} color="#2196F3" />
              <Text style={styles.modalOptionText}>Editar Meta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption}>
              <Ionicons name="share-outline" size={24} color="#4CAF50" />
              <Text style={styles.modalOptionText}>Compartilhar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption}>
              <Ionicons name="archive-outline" size={24} color="#FF9800" />
              <Text style={styles.modalOptionText}>Arquivar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalOption, styles.dangerOption]}
              onPress={() => {
                setShowOptionsModal(false);
                handleDeleteGoal();
              }}
            >
              <Ionicons name="trash-outline" size={24} color="#F44336" />
              <Text style={[styles.modalOptionText, styles.dangerText]}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 📝 src/screens/NotesScreen.js
const NotesScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all'); // all, favorites, recent

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.notes.getAll({
        search: searchText,
        favorites_only: filter === 'favorites'
      });
      
      if (response.success) {
        setNotes(response.data.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    // Implementar debounce search
  };

  const toggleFavorite = async (noteId) => {
    try {
      await ApiService.notes.toggleFavorite(noteId);
      // Atualizar estado local
      setNotes(prev => 
        prev.map(note => 
          note.id === noteId 
            ? { ...note, is_favorite: !note.is_favorite }
            : note
        )
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar favorito');
    }
  };

  const renderNote = ({ item }) => (
    <TouchableOpacity 
      style={styles.noteCard}
      onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title || 'Sem título'}
        </Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Ionicons 
            name={item.is_favorite ? "heart" : "heart-outline"} 
            size={20} 
            color={item.is_favorite ? "#F44336" : "#666"} 
          />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.content}
      </Text>
      
      <View style={styles.noteFooter}>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.noteTags}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.noteTag}>
                <Text style={styles.noteTagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        <Text style={styles.noteDate}>
          {new Date(item.created_at).toLocaleDateString('pt-BR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && notes.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Notas</Text>
        <Text style={styles.headerSubtitle}>{notes.length} notas</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar notas..."
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'favorites' && styles.filterTabActive]}
          onPress={() => setFilter('favorites')}
        >
          <Text style={[styles.filterTabText, filter === 'favorites' && styles.filterTabTextActive]}>
            Favoritas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'recent' && styles.filterTabActive]}
          onPress={() => setFilter('recent')}
        >
          <Text style={[styles.filterTabText, filter === 'recent' && styles.filterTabTextActive]}>
            Recentes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      {notes.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="Nenhuma nota ainda"
          subtitle="Comece criando sua primeira nota!"
        />
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FloatingActionButton 
        onPress={() => navigation.navigate('CreateNote')}
        icon="create"
      />
    </View>
  );
};

// 📊 src/screens/AnalyticsScreen.js  
const AnalyticsScreen = ({ navigation }) => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.analytics.getDashboard(period);
      
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Relatórios</Text>
        <Text style={styles.headerSubtitle}>Acompanhe seu progresso</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {[7, 30, 90].map(days => (
          <TouchableOpacity
            key={days}
            style={[
              styles.periodButton,
              period === days && styles.periodButtonActive
            ]}
            onPress={() => setPeriod(days)}
          >
            <Text style={[
              styles.periodButtonText,
              period === days && styles.periodButtonTextActive
            ]}>
              {days} dias
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {analytics && (
        <>
          {/* Overview Cards */}
          <View style={styles.overviewCards}>
            <View style={styles.overviewCard}>
              <Text style={styles.overviewNumber}>{analytics.overview.completed_goals}</Text>
              <Text style={styles.overviewLabel}>Metas Concluídas</Text>
            </View>
            
            <View style={styles.overviewCard}>
              <Text style={styles.overviewNumber}>{analytics.overview.completed_tasks}</Text>
              <Text style={styles.overviewLabel}>Tarefas Feitas</Text>
            </View>
            
            <View style={styles.overviewCard}>
              <Text style={styles.overviewNumber}>{analytics.overview.streak_days}</Text>
              <Text style={styles.overviewLabel}>Dias Seguidos</Text>
            </View>
          </View>

          {/* Progress Chart Placeholder */}
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Progresso ao Longo do Tempo</Text>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="bar-chart-outline" size={48} color="#CCC" />
              <Text style={styles.chartPlaceholderText}>Gráfico em desenvolvimento</Text>
            </View>
          </View>

          {/* Categories Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progresso por Categoria</Text>
            {analytics.categories_breakdown.map((category, index) => (
              <View key={index} style={styles.categoryProgress}>
                <Text style={styles.categoryName}>{category.category}</Text>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${category.completion_rate}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressPercent}>{category.completion_rate}%</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// Adicionar estilos específicos para as novas telas
const additionalStyles = StyleSheet.create({
  // Goal Detail Styles
  headerCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerContent: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    marginRight: 16,
  },
  goalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
  emptyTasks: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTasksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyTasksSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  comingSoon: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 40,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 16,
  },
  dangerOption: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  dangerText: {
    color: '#F44336',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },

  // Notes Screen Styles
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteTags: {
    flexDirection: 'row',
    flex: 1,
  },
  noteTag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  noteTagText: {
    fontSize: 10,
    color: '#2196F3',
    fontWeight: '500',
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: '#2196F3',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: 'white',
  },

  // Analytics Screen Styles
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  periodButtonActive: {
    backgroundColor: '#2196F3',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  overviewCards: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  categoryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryName: {
    fontSize: 14,
    color: '#666',
    width: 80,
    textTransform: 'capitalize',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    color: '#666',
    width: 40,
    textAlign: 'right',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
});

// Combinar todos os estilos
Object.assign(styles, additionalStyles);

export { 
  LoginScreen, 
  RegisterScreen, 
  GoalsScreen, 
  CreateGoalScreen, 
  GoalDetailScreen, 
  NotesScreen, 
  AnalyticsScreen 
};