import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ApiService from '../../services/api';
import { theme } from '../../constants/theme';



const CreateNoteScreen = ({ route, navigation }) => {
  const { goalId } = route.params || {};
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    goal_id: goalId,
    tags: [],
    is_favorite: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleSave = async () => {
    if (!formData.content.trim()) {
      Alert.alert('Erro', 'Por favor, escreva o conteúdo da nota');
      return;
    }

    setIsLoading(true);

    try {
      const response = await ApiService.notes.create(formData);
      
      if (response.success) {
        Alert.alert('Sucesso! ✅', 'Nota criada com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      } else {
        Alert.alert('Erro', response.message || 'Erro ao criar nota');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a nota');
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancelar</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Nova Nota</Text>
        
        <TouchableOpacity 
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}>
            Salvar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título */}
        <TextInput
          style={styles.titleInput}
          placeholder="Título da nota (opcional)"
          value={formData.title}
          onChangeText={(value) => updateField('title', value)}
          maxLength={255}
        />

        {/* Conteúdo */}
        <TextInput
          style={styles.contentInput}
          placeholder="Escreva sua nota aqui..."
          value={formData.content}
          onChangeText={(value) => updateField('content', value)}
          multiline
          textAlignVertical="top"
          autoFocus
        />

        {/* Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Tags</Text>
          
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Adicionar tag"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={addTag} style={styles.addTagButton}>
              <Ionicons name="add" size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)}>
                  <Ionicons name="close" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Favorito */}
        <TouchableOpacity 
          style={styles.favoriteContainer}
          onPress={() => updateField('is_favorite', !formData.is_favorite)}
        >
          <Ionicons 
            name={formData.is_favorite ? "heart" : "heart-outline"} 
            size={24} 
            color={formData.is_favorite ? "#F44336" : "#666"} 
          />
          <Text style={styles.favoriteText}>Marcar como favorita</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
    borderBottomColor: theme.colors.gray[200],
  },
  cancelButton: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  saveButton: {
    color: theme.colors.success[500],
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: theme.colors.gray[400],
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  tagsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[100],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: theme.colors.gray[50],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  addTagButton: {
    padding: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[50],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.primary[600],
    fontWeight: '500',
    marginRight: 6,
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[100],
  },
  favoriteText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: 12,
  },
});

export default CreateNoteScreen;