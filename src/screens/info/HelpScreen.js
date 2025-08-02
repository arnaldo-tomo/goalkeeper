import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../constants/theme'; // Adicionado import

const HelpScreen = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: 'Como criar uma nova meta?',
      answer: 'Vá para a tela de Metas e toque no botão "+" para criar uma nova meta. Preencha os detalhes e defina prazos.',
    },
    {
      question: 'Como acompanhar meu progresso?',
      answer: 'Na tela Analytics você pode ver gráficos detalhados do seu progresso e estatísticas das suas metas.',
    },
    {
      question: 'Posso definir lembretes?',
      answer: 'Sim! Você pode criar lembretes para suas metas e tarefas na seção de Lembretes.',
    },
    {
      question: 'Como exportar meus dados?',
      answer: 'Atualmente esta funcionalidade está em desenvolvimento. Será disponibilizada em breve.',
    },
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Central de Ajuda</Text>
          <Text style={styles.pageSubtitle}>
            Encontre respostas para as perguntas mais frequentes
          </Text>

          <View style={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(index)}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Ionicons 
                    name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color={theme.colors.gray[500]} 
                  />
                </TouchableOpacity>
                {expandedFAQ === index && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Ainda precisa de ajuda?</Text>
            <Text style={styles.contactText}>
              Entre em contato conosco através da seção de Contato no menu de Configurações.
            </Text>
          </View>
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
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary, // Corrigido: era theme.c
    marginBottom: 8,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  faqContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    ...theme.shadows.md,
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
    ...theme.shadows.md,
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
});

export default HelpScreen;