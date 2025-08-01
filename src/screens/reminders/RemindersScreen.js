const RemindersScreen = ({ navigation }) => {
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const response = await ApiService.reminders.getAll();
      if (response.success) {
        setReminders(response.data.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lembretes</Text>
      </View>

      {reminders.length === 0 ? (
        <EmptyState
          icon="alarm-outline"
          title="Nenhum lembrete"
          subtitle="Crie lembretes para não esquecer suas metas!"
        />
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ReminderCard reminder={item} />
          )}
        />
      )}

      <FloatingActionButton 
        onPress={() => navigation.navigate('CreateReminder')}
        icon="alarm"
      />
    </View>
  );
};