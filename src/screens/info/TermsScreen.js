export const TermsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Termos de Uso</Text>
        <Text style={styles.lastUpdated}>Última atualização: Janeiro 2025</Text>

        <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
        <Text style={styles.sectionText}>
          Ao usar o GoalKeeper, você concorda com estes termos de uso e nossa 
          política de privacidade.
        </Text>

        <Text style={styles.sectionTitle}>2. Uso do Serviço</Text>
        <Text style={styles.sectionText}>
          O GoalKeeper é destinado ao uso pessoal para gestão de metas e produtividade. 
          Você se compromete a usar o serviço de forma responsável e legal.
        </Text>

        <Text style={styles.sectionTitle}>3. Conta do Usuário</Text>
        <Text style={styles.sectionText}>
          Você é responsável por manter a segurança de sua conta e por todas as 
          atividades que ocorrem sob sua conta.
        </Text>

        <Text style={styles.sectionTitle}>4. Propriedade Intelectual</Text>
        <Text style={styles.sectionText}>
          O GoalKeeper e todo seu conteúdo são propriedade dos desenvolvedores e 
          protegidos por leis de direitos autorais.
        </Text>

        <Text style={styles.sectionTitle}>5. Limitação de Responsabilidade</Text>
        <Text style={styles.sectionText}>
          O GoalKeeper é fornecido "como está" e não garantimos que estará sempre 
          disponível ou livre de erros.
        </Text>

        <Text style={styles.sectionTitle}>6. Modificações</Text>
        <Text style={styles.sectionText}>
          Reservamos o direito de modificar estes termos a qualquer momento. 
          Mudanças significativas serão comunicadas aos usuários.
        </Text>
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

