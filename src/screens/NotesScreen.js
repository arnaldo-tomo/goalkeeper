import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

// Utils e Services
import ApiService from '../services/api';
import { formatRelativeDate, debounce } from '../utils/helpers';
import { hapticFeedback } from '../utils/haptics';
import { theme } from '../constants/theme';

// Components
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const { width: screenWidth } = Dimensions.get('window');

const NotesScreen = ({ navigation }) => {
  // ========================================
  // ESTADO
  // ========================================
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const filters = [
    { id: 'all', label: 'Todas', icon: 'document-text-outline' },
    { id: 'favorites', label: 'Favoritas', icon: 'heart' },
    { id: 'recent', label: 'Recentes', icon: 'time-outline' },
    { id: 'tagged', label: 'Com Tags', icon: 'pricetag-outline' }
  ];

  // ========================================
  // EFFECTS
  // ========================================

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  useEffect(() => {
    applyFilters();
  }, [notes, activeFilter, searchText]);

  // ========================================
  // FUNÇÕES DE CARREGAMENTO
  // ========================================

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.notes.getAll();
      
      if (response.success) {
        setNotes(response.data.data || []);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as notas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    hapticFeedback.light();
    await loadNotes();
    setRefreshing(false);
  };

  // ========================================
  // FILTROS E BUSCA
  // ========================================

  const applyFilters = () => {
    let filtered = [...notes];

    // Aplicar filtro de categoria
    switch (activeFilter) {
      case 'favorites':
        filtered = filtered.filter(note => note.is_favorite);
        break;
      case 'recent':
        filtered = filtered.filter(note => {
          const daysDiff = (Date.now() - new Date(note.created_at).getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        });
        break;
      case 'tagged':
        filtered = filtered.filter(note => note.tags && note.tags.length > 0);
        break;
      default:
        break;
    }

    // Aplicar busca por texto
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(note => 
        note.title?.toLowerCase().includes(search) ||
        note.content?.toLowerCase().includes(search) ||
        note.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Ordenar por data (mais recentes primeiro)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredNotes(filtered);
  };

  const debouncedSearch = useCallback(
    debounce((text) => {
      setSearchText(text);
      setIsSearching(false);
    }, 300),
    []
  );

  const handleSearchChange = (text) => {
    setIsSearching(true);
    debouncedSearch(text);
  };

  const clearSearch = () => {
    setSearchText('');
    setIsSearching(false);
  };

  // ========================================
  // HANDLERS DE AÇÕES
  // ========================================

  const handleNotePress = (note) => {
    hapticFeedback.light();
    navigation.navigate('NoteDetail', { noteId: note.id });
  };

  const handleCreateNote = () => {
    hapticFeedback.medium();
    navigation.navigate('CreateNote');
  };

  const toggleFavorite = async (noteId) => {
    try {
      hapticFeedback.selection();
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

  const handleFilterPress = (filterId) => {
    hapticFeedback.selection();
    setActiveFilter(filterId);
  };

  // ========================================
  // COMPONENTES
  // ========================================

  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search-outline" size={20} color={theme.colors.gray[500]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar notas, tags..."
          value={searchText}
          onChangeText={handleSearchChange}
          placeholderTextColor={theme.colors.gray[500]}
          returnKeyType="search"
        />
        {(searchText || isSearching) && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons 
              name={isSearching ? "hourglass-outline" : "close-circle"} 
              size={20} 
              color={theme.colors.gray[500]} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const FilterTabs = () => (
    <View style={styles.filterContainer}>
      <FlatList
        data={filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === item.id && styles.filterTabActive
            ]}
            onPress={() => handleFilterPress(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={item.icon} 
              size={16} 
              color={activeFilter === item.id ? 'white' : theme.colors.gray[600]} 
            />
            <Text style={[
              styles.filterTabText,
              activeFilter === item.id && styles.filterTabTextActive
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const NoteCard = ({ note }) => {
    const hasGoal = note.goal_id && note.goal;
    
    return (
      <TouchableOpacity
        style={styles.noteCard}
        onPress={() => handleNotePress(note)}
        activeOpacity={0.8}
      >
        <View style={styles.noteCardHeader}>
          <View style={styles.noteCardInfo}>
            <Text style={styles.noteCardTitle} numberOfLines={1}>
              {note.title || 'Sem título'}
            </Text>
            {hasGoal && (
              <Text style={styles.noteCardGoal} numberOfLines={1}>
                📌 {note.goal.title}
              </Text>
            )}
          </View>
          
          <TouchableOpacity 
            onPress={() => toggleFavorite(note.id)}
            style={styles.favoriteButton}
          >
            <Ionicons 
              name={note.is_favorite ? "heart" : "heart-outline"} 
              size={20} 
              color={note.is_favorite ? theme.colors.error[500] : theme.colors.gray[400]} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.noteCardContent} numberOfLines={3}>
          {note.content}
        </Text>
        
        <View style={styles.noteCardFooter}>
          <View style={styles.noteCardTags}>
            {note.tags && note.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.noteTag}>
                <Text style={styles.noteTagText}>#{tag}</Text>
              </View>
            ))}
            {note.tags && note.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{note.tags.length - 3}</Text>
            )}
          </View>
          
          <Text style={styles.noteCardDate}>
            {formatRelativeDate(note.created_at)}
          </Text>
        </View>
        
        {note.updated_at !== note.created_at && (
          <View style={styles.editedIndicator}>
            <Ionicons name="create-outline" size={12} color={theme.colors.gray[400]} />
            <Text style={styles.editedText}>Editada</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const StatsHeader = () => (
    <View style={styles.statsHeader}>
      <Text style={styles.statsTitle}>Minhas Notas</Text>
      <Text style={styles.statsSubtitle}>
        {filteredNotes.length} de {notes.length} notas
      </Text>
    </View>
  );

  // ========================================
  // RENDER
  // ========================================

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.success[400], theme.colors.success[600]]}
        style={styles.header}
      >
        <StatsHeader />
        <SearchBar />
      </LinearGradient>

      {/* Filters */}
      <FilterTabs />

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={searchText ? "search-outline" : "document-text-outline"}
          title={searchText ? "Nenhuma nota encontrada" : "Nenhuma nota ainda"}
          subtitle={searchText ? "Tente outros termos de busca" : "Comece criando sua primeira nota!"}
          style={styles.emptyState}
        />
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <NoteCard note={item} />}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor={theme.colors.success[500]}
            />
          }
          contentContainerStyle={styles.notesList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCreateNote}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[theme.colors.success[500], theme.colors.success[600]]}
          style={styles.fabGradient}
        >
          <Ionicons name="create" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};