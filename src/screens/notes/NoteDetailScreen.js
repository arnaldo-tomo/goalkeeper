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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  noteContent: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
    lineHeight: 32,
  },
  noteText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: theme.colors.primary[50],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.primary[600],
    fontWeight: '500',
  },
  noteMetadata: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[100],
    paddingTop: 16,
    marginTop: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[500],
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 16,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
  },
});

export default NoteDetailScreen;
