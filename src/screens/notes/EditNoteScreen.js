import { Platform } from "react-native";
import { theme } from "../../constants/theme";

const EditNoteScreen = ({ route, navigation }) => {
  const { noteId } = route.params;
  const [note, setNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    is_favorite: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadNoteData();
  }, [noteId]);

  const loadNoteData = async () => {
    try {
      const response = await ApiService.notes.getById(noteId);
      if (response.success) {
        const noteData = response.data;
        setNote(noteData);
        setFormData({
          title: noteData.title || '',
          content: noteData.content || '',
          tags: noteData.tags || [],
          is_favorite: noteData.is_favorite || false
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a nota');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await ApiService.notes.update(noteId, formData);
      if (response.success) {
        Alert.alert('Sucesso!', 'Nota atualizada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Nota</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color={theme.colors.primary[500]} />
          ) : (
            <Text style={styles.saveButton}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.titleInput}
          placeholder="Título da nota"
          value={formData.title}
          onChangeText={(value) => setFormData(prev => ({ ...prev, title: value }))}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Conteúdo da nota"
          value={formData.content}
          onChangeText={(value) => setFormData(prev => ({ ...prev, content: value }))}
          multiline
          textAlignVertical="top"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};