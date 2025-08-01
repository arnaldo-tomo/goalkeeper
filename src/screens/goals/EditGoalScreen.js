// ✏️ src/screens/goals/EditGoalScreen.js - GoalKeeper Edit Goal Screen
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

// Store e Services
import useGoalsStore from '../../store/useGoalsStore';
import ApiService from '../../services/api';

// Utils e Constants
import { formatDate } from '../../utils/helpers';
import { hapticFeedback } from '../../utils/haptics';
import { theme } from '../../constants/theme';
import { categories } from '../../constants/categories';
import { priorities } from '../../constants/priorities';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditGoalScreen = ({ route, navigation }) => {
  const { goalId } = route.params;
  const { updateGoal } = useGoalsStore();

  // ========================================
  // ESTADO
  // ========================================
  const [goal, setGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pessoal',
    priority: 'medium',
    status: 'active',
    start_date: new Date(),
    end_date: null,
    completion_percentage: 0
  });

  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    loadGoalData();
  }, [goalId]);

  useEffect(() => {
    // Configurar header com botão de salvar
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          disabled={!hasChanges || isSaving}
          style={[
            styles.headerButton,
            (!hasChanges || isSaving) && styles.headerButtonDisabled
          ]}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={theme.colors.primary[500]} />
          ) : (
            <Text style={[
              styles.headerButtonText,
              (!hasChanges || isSaving) && styles.headerButtonTextDisabled
            ]}>
              Salvar
            </Text>
          )}
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      )
    });
  }, [hasChanges, isSaving]);

  // ========================================
  // FUNÇÕES DE CARREGAMENTO
  // ========================================

  const loadGoalData = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.goals.getById(goalId);
      
      if (response.success) {
        const goalData = response.data;
        setGoal(goalData);
        
        // Inicializar form com dados da meta
        setFormData({
          title: goalData.title || '',
          description: goalData.description || '',
          category: goalData.category || 'pessoal',
          priority: goalData.priority || 'medium',
          status: goalData.status || 'active',
          start_date: goalData.start_date ? new Date(goalData.start_date) : new Date(),
          end_date: goalData.end_date ? new Date(goalData.end_date) : null,
          completion_percentage: goalData.completion_percentage || 0
        });
        
        // Atualizar título da tela
        navigation.setOptions({ title: `Editar: ${goalData.title}` });
      } else {
        throw new Error(response.message || 'Meta não encontrada');
      }
    } catch (error) {
      console.error('Erro ao carregar meta:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da meta', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // HANDLERS DE FORMULÁRIO
  // ========================================

  const updateField = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Verificar se houve mudanças
      const originalData = {
        title: goal?.title || '',
        description: goal?.description || '',
        category: goal?.category || 'pessoal',
        priority: goal?.priority || 'medium',
        status: goal?.status || 'active',
        start_date: goal?.start_date ? new Date(goal.start_date) : new Date(),
        end_date: goal?.end_date ? new Date(goal.end_date) : null,
        completion_percentage: goal?.completion_percentage || 0
      };
      
      const hasChanges = Object.keys(newData).some(key => {
        if (key.includes('date') && newData[key] && originalData[key]) {
          return newData[key].getTime() !== originalData[key].getTime();
        }
        return newData[key] !== originalData[key];
      });
      
      setHasChanges(hasChanges);
      return newData;
    });
    
    hapticFeedback.selection();
  };

  // ========================================
  // HANDLERS DE AÇÕES
  // ========================================

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      hapticFeedback.medium();

      const updateData = {
        ...formData,
        start_date: formData.start_date?.toISOString().split('T')[0],
        end_date: formData.end_date?.toISOString().split('T')[0]
      };

      const result = await updateGoal(goalId, updateData);

      if (result.success) {
        hapticFeedback.success();
        Alert.alert(
          'Sucesso! ✅',
          'Meta atualizada com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
        setHasChanges(false);
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      hapticFeedback.error();
      Alert.alert('Erro', error.message || 'Não foi possível salvar as alterações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Descartar Alterações?',
        'Você tem alterações não salvas. Deseja descartá-las?',
        [
          { text: 'Continuar Editando', style: 'cancel' },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'O título da meta é obrigatório');
      return false;
    }

    if (formData.title.trim().length < 3) {
      Alert.alert('Erro', 'O título deve ter pelo menos 3 caracteres');
      return false;
    }

    if (formData.end_date && formData.start_date && formData.end_date <= formData.start_date) {
      Alert.alert('Erro', 'A data de término deve ser posterior à data de início');
      return false;
    }

    return true;
  };

  // ========================================
  // HANDLERS DE DATA
  // ========================================

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateField('start_date', selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateField('end_date', selectedDate);
    }
  };

  const clearEndDate = () => {
    updateField('end_date', null);
  };

  // ========================================
  // FUNÇÕES UTILITÁRIAS
  // ========================================

  const getCategoryData = (categoryId) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const getPriorityData = (priorityId) => {
    return priorities.find(pri => pri.id === priorityId) || priorities[1];
  };

  const getStatusColor = (status) => {
    const colors = {
      active: theme.colors.primary[500],
      paused: theme.colors.warning[500],
      completed: theme.colors.success[500],
      cancelled: theme.colors.error[500]
    };
    return colors[status] || colors.active;
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Ativa',
      paused: 'Pausada',
      completed: 'Concluída',
      cancelled: 'Cancelada'
    };
    return labels[status] || 'Ativa';
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

  const InputField = ({ label, value, onChangeText, placeholder, multiline = false, maxLength }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray[400]}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        maxLength={maxLength}
      />
      {maxLength && (
        <Text style={styles.characterCount}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );

  const SelectField = ({ label, options, selectedValue, onSelect, keyExtractor, labelExtractor, colorExtractor }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.selectContainer}>
        {options.map(option => {
          const key = keyExtractor(option);
          const label = labelExtractor(option);
          const color = colorExtractor ? colorExtractor(option) : theme.colors.primary[500];
          const isSelected = selectedValue === key;
          
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.selectOption,
                isSelected && { backgroundColor: color, borderColor: color }
              ]}
              onPress={() => onSelect(key)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.selectOptionText,
                isSelected && { color: 'white' }
              ]}>
                {label}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const DateField = ({ label, date, onPress, onClear, showClear = false }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity style={styles.dateButton} onPress={onPress}>
        <Ionicons name="calendar-outline" size={20} color={theme.colors.gray[500]} />
        <Text style={styles.dateButtonText}>
          {date ? formatDate(date, 'dd/MM/yyyy') : 'Selecionar data'}
        </Text>
        {showClear && date && (
          <TouchableOpacity onPress={onClear} style={styles.clearDateButton}>
            <Ionicons name="close-circle" size={20} color={theme.colors.gray[400]} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );

  const ProgressSection = () => (
    <View style={styles.progressSection}>
      <Text style={styles.progressLabel}>Progresso Atual</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill,
              { width: `${formData.completion_percentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{formData.completion_percentage}%</Text>
      </View>
      <Text style={styles.progressNote}>
        * O progresso é calculado automaticamente baseado nas tarefas concluídas
      </Text>
    </View>
  );

  // ========================================
  // RENDER PRINCIPAL
  // ========================================

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!goal) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={64} color={theme.colors.error[500]} />
        <Text style={styles.errorText}>Meta não encontrada</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header com Status */}
        <LinearGradient
          colors={[getStatusColor(formData.status) + '20', getStatusColor(formData.status) + '10']}
          style={styles.statusHeader}
        >
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(formData.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(formData.status) }]}>
              {getStatusLabel(formData.status)}
            </Text>
          </View>
        </LinearGradient>

        {/* Informações Básicas */}
        <FormSection title="📝 Informações Básicas">
          <InputField
            label="Título da Meta *"
            value={formData.title}
            onChangeText={(value) => updateField('title', value)}
            placeholder="Ex: Aprender React Native"
            maxLength={255}
          />

          <InputField
            label="Descrição"
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            placeholder="Descreva sua meta em detalhes..."
            multiline
            maxLength={1000}
          />
        </FormSection>

        {/* Categorização */}
        <FormSection title="🏷️ Categorização">
          <SelectField
            label="Categoria"
            options={categories}
            selectedValue={formData.category}
            onSelect={(value) => updateField('category', value)}
            keyExtractor={(cat) => cat.id}
            labelExtractor={(cat) => cat.name}
            colorExtractor={(cat) => cat.color}
          />

          <SelectField
            label="Prioridade"
            options={priorities}
            selectedValue={formData.priority}
            onSelect={(value) => updateField('priority', value)}
            keyExtractor={(pri) => pri.id}
            labelExtractor={(pri) => pri.name}
            colorExtractor={(pri) => pri.color}
          />
        </FormSection>

        {/* Status */}
        <FormSection title="📊 Status">
          <SelectField
            label="Status da Meta"
            options={[
              { id: 'active', name: 'Ativa', color: theme.colors.primary[500] },
              { id: 'paused', name: 'Pausada', color: theme.colors.warning[500] },
              { id: 'completed', name: 'Concluída', color: theme.colors.success[500] },
              { id: 'cancelled', name: 'Cancelada', color: theme.colors.error[500] }
            ]}
            selectedValue={formData.status}
            onSelect={(value) => updateField('status', value)}
            keyExtractor={(status) => status.id}
            labelExtractor={(status) => status.name}
            colorExtractor={(status) => status.color}
          />

          <ProgressSection />
        </FormSection>

        {/* Cronograma */}
        <FormSection title="📅 Cronograma">
          <DateField
            label="Data de Início"
            date={formData.start_date}
            onPress={() => setShowStartDatePicker(true)}
          />

          <DateField
            label="Data de Término (Opcional)"
            date={formData.end_date}
            onPress={() => setShowEndDatePicker(true)}
            onClear={clearEndDate}
            showClear={true}
          />

          {formData.end_date && formData.start_date && (
            <View style={styles.durationInfo}>
              <Ionicons name="time-outline" size={16} color={theme.colors.primary[500]} />
              <Text style={styles.durationText}>
                Duração: {Math.ceil((formData.end_date - formData.start_date) / (1000 * 60 * 60 * 24))} dias
              </Text>
            </View>
          )}
        </FormSection>

        {/* Espaço extra no final */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={formData.start_date || new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
          minimumDate={new Date()}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={formData.end_date || new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
          minimumDate={formData.start_date || new Date()}
        />
      )}
    </KeyboardAvoidingView>
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
  scrollContent: {
    paddingBottom: 40,
  },

  // Header Styles
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary[500],
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerButtonTextDisabled: {
    color: theme.colors.gray[400],
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.error[500],
  },

  // Status Header
  statusHeader: {
    padding: 20,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    ...theme.shadows.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Form Styles
  formSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    ...theme.shadows.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: theme.colors.gray[500],
    textAlign: 'right',
    marginTop: 4,
  },

  // Select Styles
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[100],
    borderWidth: 2,
    borderColor: theme.colors.gray[200],
  },
  selectOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginRight: 4,
  },

  // Date Styles
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  dateButtonText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: 12,
    flex: 1,
  },
  clearDateButton: {
    padding: 4,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  durationText: {
    fontSize: 12,
    color: theme.colors.primary[600],
    marginLeft: 6,
    fontWeight: '500',
  },

  // Progress Styles
  progressSection: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.success[500],
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.success[600],
    minWidth: 40,
    textAlign: 'right',
  },
  progressNote: {
    fontSize: 11,
    color: theme.colors.gray[500],
    fontStyle: 'italic',
  },

  // Error Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error[500],
    textAlign: 'center',
    marginTop: 16,
  },
});

export default EditGoalScreen;