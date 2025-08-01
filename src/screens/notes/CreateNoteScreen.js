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