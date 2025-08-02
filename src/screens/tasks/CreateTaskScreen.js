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

export const CreateTaskScreen = ({ route, navigation }) => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityChip: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityChipActive: {
    backgroundColor: '#2196F3',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  priorityTextActive: {
    color: 'white',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  durationChip: {
    width: '22%',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  durationChipActive: {
    backgroundColor: '#2196F3',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  durationTextActive: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCC',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});