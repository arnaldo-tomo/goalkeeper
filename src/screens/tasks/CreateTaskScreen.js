// 📋 src/screens/tasks/CreateTaskScreen.js - GoalKeeper Create Task Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';

// Services e Utils
import ApiService from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { hapticFeedback } from '../../utils/haptics';
import { theme } from '../../constants/theme';
import { priorities } from '../../constants/priorities';

const CreateTaskScreen = ({ route, navigation }) => {
  const { goalId, goalTitle } = route.params;
  
  // ========================================
  // ESTADO
  // ========================================
  const [formData, setFormData] = useState({
    goal_id: goalId,
    title: '',
    description: '',
    priority: 'medium',
    due_date: null,
    estimated_duration: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const durations = [15, 30, 45, 60, 90, 120, 180, 240];

  // ========================================
  // EFFECTS
  // ========================================
  
  useEffect(() => {
    navigation.setOptions({
      title: 'Nova Tarefa',
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading || !formData.title.trim()}
          style={[
            styles.headerButton,
            (!formData.title.trim() || isLoading) && styles.headerButtonDisabled
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.primary[500]} />
          ) : (
            <Text style={[
              styles.headerButtonText,
              (!formData.title.trim() || isLoading) && styles.headerButtonTextDisabled
            ]}>
              Criar
            </Text>
          )}
        </TouchableOpacity>
      )
    });
  }, [formData.title, isLoading]);

  // ========================================
  // HANDLERS
  // ========================================

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    hapticFeedback.selection();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      hapticFeedback.medium();

      const taskData = {
        ...formData,
        due_date: formData.due_date?.toISOString().split('T')[0]
      };

      const response = await ApiService.tasks.create(taskData);
      
      if (response.success) {
        hapticFeedback.success();
        Alert.alert(
          'Sucesso! ✅', 
          'Tarefa criada com sucesso!',
          [
            {
              text: 'Ver Tarefa',
              onPress: () => {
                navigation.replace('TaskDetail', { taskId: response.data.id });
              }
            },
            {
              text: 'Criar Outra',
              onPress: () => {
                setFormData({
                  goal_id: goalId,
                  title: '',
                  description: '',
                  priority: 'medium',
                  due_date: null,
                  estimated_duration: null
                });
              }
            }
          ]
        );
      } else {
        throw new Error(response.message);
      }

    } catch (error) {
      hapticFeedback.error();
      Alert.alert('Erro', error.message || 'Não foi possível criar a tarefa');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'O título da tarefa é obrigatório');
      return false;
    }

    if (formData.title.trim().length < 3) {
      Alert.alert('Erro', 'O título deve ter pelo menos 3 caracteres');
      return false;
    }

    return true;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateField('due_date', selectedDate);
    }
  };

  const clearDate = () => {
    updateField('due_date', null);
  };

  // ========================================
  // COMPONENTES
  // ========================================

  const FormSection = ({ title, children }) => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const PrioritySelector = () => (
    <View style={styles.priorityContainer}>
      {priorities.map(priority => (
        <TouchableOpacity
          key={priority.id}
          style={[
            styles.priorityChip,
            formData.priority === priority.id && {
              backgroundColor: priority.color,
              borderColor: priority.color
            }
          ]}
          onPress={() => updateField('priority', priority.id)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.priorityText,
            formData.priority === priority.id && { color: 'white' }
          ]}>
            {priority.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const DurationSelector = () => (
    <View style={styles.durationContainer}>
      {durations.map(duration => (
        <TouchableOpacity
          key={duration}
          style={[
            styles.durationChip,
            formData.estimated_duration === duration && styles.durationChipActive
          ]}
          onPress={() => updateField('estimated_duration', duration)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.durationText,
            formData.estimated_duration === duration && styles.durationTextActive
          ]}>
            {duration}min
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      {/* Header com Meta */}
      <LinearGradient
        colors={[theme.colors.primary[500], theme.colors.primary[600]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Nova Tarefa</Text>
          <Text style={styles.headerSubtitle}>Para: {goalTitle}</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Informações Básicas */}
        <FormSection title="📝 Informações Básicas">
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Título da Tarefa *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ex: Estudar React Native por 1 hora"
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
              maxLength={255}
              autoFocus
            />
            <Text style={styles.characterCount}>
              {formData.title.length}/255
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descrição (Opcional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Descreva os detalhes da tarefa..."
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.characterCount}>
              {formData.description.length}/500
            </Text>
          </View>
        </FormSection>

        {/* Prioridade */}
        <FormSection title="⚡ Prioridade">
          <PrioritySelector />
        </FormSection>

        {/* Prazo */}
        <FormSection title="📅 Prazo">
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={theme.colors.gray[500]} />
            <Text style={styles.dateButtonText}>
              {formData.due_date 
                ? formatDate(formData.due_date, 'dd/MM/yyyy')
                : 'Definir data de vencimento (opcional)'
              }
            </Text>
            {formData.due_date && (
              <TouchableOpacity onPress={clearDate} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={theme.colors.gray[400]} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </FormSection>

        {/* Duração Estimada */}
        <FormSection title="⏱️ Duração Estimada">
          <DurationSelector />
          
          {formData.estimated_duration && (
            <View style={styles.durationInfo}>
              <Ionicons name="time-outline" size={16} color={theme.colors.primary[500]} />
              <Text style={styles.durationInfoText}>
                Tempo estimado: {formData.estimated_duration} minutos
              </Text>
            </View>
          )}
        </FormSection>

        {/* Dicas */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Dicas para Tarefas Eficazes</Text>
          <View style={styles.tip}>
            <Text style={styles.tipText}>• Use verbos de ação no título (Estudar, Revisar, Criar)</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipText}>• Seja específico sobre o que deve ser feito</Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipText}>• Defina um tempo realista para conclusão</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.due_date || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
};