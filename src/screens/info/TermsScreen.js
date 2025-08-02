import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../constants/theme'; // Adicionado import

const TermsScreen = () => {
  return (
    <>
      <StatusBar style="dark" />
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  content: {
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 14,
    color: theme.colors.text.secondary, // Corrigido: era theme.col
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: 16,
  },
});

export default TermsScreen;
