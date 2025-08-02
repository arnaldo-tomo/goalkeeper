// Completando o EditTaskScreen que foi cortado anteriormente

import { Platform, StyleSheet } from "react-native";
import { theme } from "../../constants/theme";

// ✏️ src/screens/tasks/EditTaskScreen.js - Continuação
const EditTaskScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: null,
    estimated_duration: null
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const durations = [15, 30, 45, 60, 90, 120, 180, 240];

  const statusOptions = [
    { id: 'pending', name: 'Pendente', color: theme.colors.gray[500] },
    { id: 'in_progress', name: 'Em Progresso', color: theme.colors.primary[500] },
    { id: 'completed', name: 'Concluída', color: theme.colors.success[500] },
    { id: 'cancelled', name: 'Cancelada', color: theme.colors.error[500] }
  ];

  useEffect(() => {
    loadTaskData();
  }, [taskId]);

  useEffect(() => {
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

  const loadTaskData = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.tasks.getById(taskId);
      
      if (response.success) {
        const taskData = response.data;
        setTask(taskData);
        
        setFormData({
          title: taskData.title || '',
          description: taskData.description || '',
          priority: taskData.priority || 'medium',
          status: taskData.status || 'pending',
          due_date: taskData.due_date ? new Date(taskData.due_date) : null,
          estimated_duration: taskData.estimated_duration || null
        });
        
        navigation.setOptions({ title: `Editar: ${taskData.title}` });
      } else {
        throw new Error(response.message || 'Tarefa não encontrada');
      }
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da tarefa', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Verificar se houve mudanças
      const originalData = {
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'medium',
        status: task?.status || 'pending',
        due_date: task?.due_date ? new Date(task.due_date) : null,
        estimated_duration: task?.estimated_duration || null
      };
      
      const hasChanges = Object.keys(newData).some(key => {
        if (key === 'due_date' && newData[key] && originalData[key]) {
          return newData[key].getTime() !== originalData[key].getTime();
        }
        return newData[key] !== originalData[key];
      });
      
      setHasChanges(hasChanges);
      return newData;
    });
    
    hapticFeedback.selection();
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      hapticFeedback.medium();

      const updateData = {
        ...formData,
        due_date: formData.due_date?.toISOString().split('T')[0]
      };

      const response = await ApiService.tasks.update(taskId, updateData);

      if (response.success) {
        hapticFeedback.success();
        Alert.alert(
          'Sucesso! ✅',
          'Tarefa atualizada com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
        setHasChanges(false);
      } else {
        throw new Error(response.message);
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

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.id === status);
    return option?.color || theme.colors.gray[500];
  };

  // Componentes
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
        numberOfLines={multiline ? 3 : 1}
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

  const DurationSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Duração Estimada</Text>
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
      
      {formData.estimated_duration && (
        <TouchableOpacity 
          onPress={() => updateField('estimated_duration', null)}
          style={styles.clearDurationButton}
        >
          <Text style={styles.clearDurationText}>Limpar seleção</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={64} color={theme.colors.error[500]} />
        <Text style={styles.errorText}>Tarefa não encontrada</Text>
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
              {statusOptions.find(opt => opt.id === formData.status)?.name || 'Pendente'}
            </Text>
          </View>
        </LinearGradient>

        {/* Informações Básicas */}
        <FormSection title="📝 Informações Básicas">
          <InputField
            label="Título da Tarefa *"
            value={formData.title}
            onChangeText={(value) => updateField('title', value)}
            placeholder="Ex: Estudar React Native"
            maxLength={255}
          />

          <InputField
            label="Descrição"
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            placeholder="Descreva os detalhes da tarefa..."
            multiline
            maxLength={500}
          />
        </FormSection>

        {/* Configurações */}
        <FormSection title="⚙️ Configurações">
          <SelectField
            label="Prioridade"
            options={priorities}
            selectedValue={formData.priority}
            onSelect={(value) => updateField('priority', value)}
            keyExtractor={(pri) => pri.id}
            labelExtractor={(pri) => pri.name}
            colorExtractor={(pri) => pri.color}
          />

          <SelectField
            label="Status"
            options={statusOptions}
            selectedValue={formData.status}
            onSelect={(value) => updateField('status', value)}
            keyExtractor={(status) => status.id}
            labelExtractor={(status) => status.name}
            colorExtractor={(status) => status.color}
          />
        </FormSection>

        {/* Cronograma */}
        <FormSection title="📅 Cronograma">
          <DateField
            label="Data de Vencimento"
            date={formData.due_date}
            onPress={() => setShowDatePicker(true)}
            onClear={clearDate}
            showClear={true}
          />

          <DurationSelector />
        </FormSection>

        {/* Espaço extra no final */}
        <View style={{ height: 100 }} />
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

// Estilos para EditTaskScreen
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    height: 80,
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

  // Duration Styles
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationChip: {
    backgroundColor: theme.colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: theme.colors.gray[200],
  },
  durationChipActive: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  durationText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  durationTextActive: {
    color: 'white',
  },
  clearDurationButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  clearDurationText: {
    fontSize: 12,
    color: theme.colors.primary[500],
    textDecorationLine: 'underline',
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

export default EditTaskScreen;