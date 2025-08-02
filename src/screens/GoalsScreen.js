import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import useGoalsStore from '../store/useGoalsStore';
import { GoalCard, FloatingActionButton } from '../components';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export const GoalsScreen = ({ navigation }) => {
  const { 
    goals, 
    isLoading, 
    filters, 
    loadGoals, 
    setFilters, 
    getFilteredGoals 
  } = useGoalsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredGoals = getFilteredGoals();

  useFocusEffect(
    React.useCallback(() => {
      loadGoals();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setFilters({ search: text });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ [filterType]: value });
  };

  const handleGoalPress = (goal) => {
    navigation.navigate('GoalDetail', { goalId: goal.id });
  };

  const renderGoal = ({ item }) => (
    <GoalCard
      goal={item}
      onPress={() => handleGoalPress(item)}
    />
  );

  const StatusFilter = ({ status, label, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.filterChip, isActive && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && goals.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Metas</Text>
        <View style={styles.headerStats}>
          <Text style={styles.headerStatsText}>
            {filteredGoals.length} de {goals.length} metas
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar metas..."
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filters */}
      <View style={styles.filtersContainer}>
        <StatusFilter
          status={null}
          label="Todas"
          isActive={filters.status === null}
          onPress={() => handleFilterChange('status', null)}
        />
        <StatusFilter
          status="active"
          label="Ativas"
          isActive={filters.status === 'active'}
          onPress={() => handleFilterChange('status', 'active')}
        />
        <StatusFilter
          status="completed"
          label="Concluídas"
          isActive={filters.status === 'completed'}
          onPress={() => handleFilterChange('status', 'completed')}
        />
        <StatusFilter
          status="paused"
          label="Pausadas"
          isActive={filters.status === 'paused'}
          onPress={() => handleFilterChange('status', 'paused')}
        />
      </View>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon="target-outline"
          title={searchText ? "Nenhuma meta encontrada" : "Nenhuma meta ainda"}
          subtitle={searchText ? "Tente buscar por outros termos" : "Comece criando sua primeira meta!"}
        />
      ) : (
        <FlatList
          data={filteredGoals}
          renderItem={renderGoal}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FloatingActionButton 
        onPress={() => navigation.navigate('CreateGoal')}
        icon="add"
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  headerStatsText: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: '#2196F3',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: 'white',
  },
  listContent: {
    paddingBottom: 100,
  },
});

