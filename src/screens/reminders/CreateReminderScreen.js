const CreateReminderScreen = ({ route, navigation }) => {
  const { goalId, taskId } = route.params || {};
  const [formData, setFormData] = useState({
    goal_id: goalId,
    task_id: taskId,
    title: '',
    description: '',
    type: 'time',
    reminder_time: new Date(),
    location_data: null,
    is_recurring: false,
    recurrence_pattern: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'Por favor, digite o título do lembrete');
      return;
    }

    setIsLoading(true);
    try {
      const response = await ApiService.reminders.create(formData);
      if (response.success) {
        Alert.alert('Sucesso!', 'Lembrete criado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o lembrete');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Título do Lembrete *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Revisar progresso da meta"
            value={formData.title}
            onChangeText={(value) => setFormData(prev => ({ ...prev, title: value }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Descrição</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Detalhes do lembrete..."
            value={formData.description}
            onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
            multiline
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Criar Lembrete</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};