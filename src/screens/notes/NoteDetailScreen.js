import { ScrollView, Text, View } from "react-native";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export const NoteDetailScreen = ({ route, navigation }) => {
  const { noteId } = route.params;
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNoteDetail();
  }, [noteId]);

  const loadNoteDetail = async () => {
    try {
      const response = await ApiService.notes.getById(noteId);
      if (response.success) {
        setNote(response.data);
        navigation.setOptions({ title: response.data.title || 'Nota' });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a nota');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.noteContent}>
        <Text style={styles.noteTitle}>{note?.title || 'Sem título'}</Text>
        <Text style={styles.noteText}>{note?.content}</Text>
        
        {note?.tags && note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
