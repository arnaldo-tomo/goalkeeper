import { StyleSheet } from "react-native";
import { theme } from "../../constants/theme";

export const CreateGoalScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pessoal',
    priority: 'medium',
    start_date: new Date(),
    end_date: null,
    generate_tasks: true,
    auto_create_tasks: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { createGoal } = useGoalsStore();

  const categories = [
    { value: 'trabalho', label: 'Trabalho', icon: 'briefcase', color: '#2196F3' },
    { value: 'saude', label: 'Saúde', icon: 'heart', color: '#4CAF50' },
    { value: 'pessoal', label: 'Pessoal', icon: 'person', color: '#FF9800' },
    { value: 'financeiro', label: 'Financeiro', icon: 'cash', color: '#9C27B0' },
    { value: 'educacao', label: 'Educação', icon: 'school', color: '#607D8B' },
    { value: 'outro', label: 'Outro', icon: 'ellipsis-horizontal', color: '#795548' }
  ];

  const priorities = [
    { value: 'low', label: 'Baixa', color: '#4CAF50' },
    { value: 'medium', label: 'Média', color: '#FF9800' },
    { value: 'high', label: 'Alta', color: '#F44336' }
  ];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'Por favor, digite o título da meta');
      return;
    }

    setIsLoading(true);

    const result = await createGoal({
      ...formData,
      start_date: formData.start_date?.toISOString().split('T')[0],
      end_date: formData.end_date?.toISOString().split('T')[0]
    });

    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        'Sucesso! 🎉', 
        'Meta criada com sucesso!',
        [
          {
            text: 'Ver Meta',
            onPress: () => {
              navigation.replace('GoalDetail', { goalId: result.data.id });
            }
          },
          {
            text: 'Criar Outra',
            onPress: () => {
              setFormData({
                title: '',
                description: '',
                category: 'pessoal',
                priority: 'medium',
                start_date: new Date(),
                end_date: null,
                generate_tasks: true,
                auto_create_tasks: false
              });
            }
          }
        ]
      );
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.form}>
        {/* Título */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Título da Meta *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Aprender React Native"
            value={formData.title}
            onChangeText={(value) => updateField('title', value)}
            maxLength={255}
          />
        </View>

        {/* Descrição */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Descrição</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Descreva sua meta em detalhes..."
            value={formData.description}
            onChangeText={(value) => updateField('description', value)}
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
        </View>

        {/* Categoria */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Categoria</Text>
          <View style={styles.categoryGrid}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryCard,
                  formData.category === category.value && {
                    backgroundColor: category.color + '20',
                    borderColor: category.color
                  }
                ]}
                onPress={() => updateField('category', category.value)}
              >
                <Ionicons 
                  name={category.icon} 
                  size={24} 
                  color={formData.category === category.value ? category.color : '#666'} 
                />
                <Text style={[
                  styles.categoryText,
                  formData.category === category.value && { color: category.color }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prioridade */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Prioridade</Text>
          <View style={styles.priorityContainer}>
            {priorities.map(priority => (
              <TouchableOpacity
                key={priority.value}
                style={[
                  styles.priorityChip,
                  formData.priority === priority.value && {
                    backgroundColor: priority.color,
                  }
                ]}
                onPress={() => updateField('priority', priority.value)}
              >
                <Text style={[
                  styles.priorityText,
                  formData.priority === priority.value && { color: 'white' }
                ]}>
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Datas */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Prazo (Opcional)</Text>
          <TouchableOpacity style={styles.dateButton}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.dateButtonText}>
              {formData.end_date 
                ? formData.end_date.toLocaleDateString('pt-BR')
                : 'Definir data de conclusão'
              }
            </Text>
          </TouchableOpacity>
        </View>

        {/* Opções de IA */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Assistente Inteligente</Text>
          
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => updateField('generate_tasks', !formData.generate_tasks)}
          >
            <Ionicons 
              name={formData.generate_tasks ? "checkbox" : "checkbox-outline"} 
              size={24} 
              color="#2196F3" 
            />
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxTitle}>Gerar sugestões de tarefas</Text>
              <Text style={styles.checkboxSubtitle}>IA sugere tarefas baseadas na sua meta</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => updateField('auto_create_tasks', !formData.auto_create_tasks)}
          >
            <Ionicons 
              name={formData.auto_create_tasks ? "checkbox" : "checkbox-outline"} 
              size={24} 
              color="#2196F3" 
            />
            <View style={styles.checkboxContent}>
              <Text style={styles.checkboxTitle}>Criar tarefas automaticamente</Text>
              <Text style={styles.checkboxSubtitle}>Criar tarefas básicas para começar</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Botão Submit */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="rocket" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Criar Meta</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

// Estilos comuns
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  
  // Auth Screens Styles
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: -60,
    left: 0,
    padding: 10,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  registerButton: {
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#666',
    fontSize: 16,
  },
  registerButtonTextBold: {
    fontWeight: 'bold',
    color: theme.colors.primary[500],
  },

  // Goals Screen Styles
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary[500],
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

  // Create Goal Screen Styles
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '30%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
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
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
