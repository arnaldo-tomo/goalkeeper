export const HelpScreen = () => {
  const [expandedItem, setExpandedItem] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: 'Como criar uma nova meta?',
      answer: 'Toque no botão "+" na tela inicial ou vá para a aba Metas e toque em "Nova Meta". Preencha as informações e defina prazos realistas.'
    },
    {
      id: 2,
      question: 'Como funcionam os lembretes inteligentes?',
      answer: 'O GoalKeeper aprende seus padrões de uso e sugere os melhores horários para lembretes, evitando sobrecarga e maximizando sua produtividade.'
    },
    {
      id: 3,
      question: 'Posso usar o app offline?',
      answer: 'Sim! O GoalKeeper funciona offline e sincroniza automaticamente quando você se conecta à internet.'
    },
    {
      id: 4,
      question: 'Como interpretar as análises de produtividade?',
      answer: 'As análises mostram seu progresso ao longo do tempo, taxa de conclusão de metas e sugestões personalizadas para melhorar sua produtividade.'
    },
    {
      id: 5,
      question: 'Meus dados estão seguros?',
      answer: 'Sim, todos os dados são criptografados e armazenados com segurança. Você tem controle total sobre suas informações.'
    }
  ];

  const FAQItem = ({ item }) => (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
      >
        <Text style={styles.faqQuestionText}>{item.question}</Text>
        <Ionicons 
          name={expandedItem === item.id ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
      
      {expandedItem === item.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Central de Ajuda</Text>
        <Text style={styles.pageSubtitle}>
          Encontre respostas para as perguntas mais frequentes
        </Text>

        <View style={styles.faqContainer}>
          {faqItems.map(item => (
            <FAQItem key={item.id} item={item} />
          ))}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Precisa de mais ajuda?</Text>
          <Text style={styles.contactText}>
            Entre em contato conosco através do email: suporte@goalkeeper.app
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    padding: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
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
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: theme.colors.success[500],
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
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
    padding: 20,
    paddingBottom: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  settingItemLeft: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  settingItemSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  themeOptionActive: {
    backgroundColor: theme.colors.primary[50],
  },
  themeOptionText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: 16,
    flex: 1,
  },
  themeOptionTextActive: {
    color: theme.colors.primary[500],
    fontWeight: '600',
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  colorOptionActive: {
    backgroundColor: theme.colors.gray[50],
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
  },
  colorOptionText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  descriptionSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginLeft: 12,
  },
  teamSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  teamTitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  teamCredit: {
    fontSize: 14,
    color: theme.colors.primary[500],
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  lastUpdated: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  faqContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});

