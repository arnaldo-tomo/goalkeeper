import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../constants/theme'; // Adicionado import

const AboutScreen = () => {
  const features = [
    'Criação e gerenciamento de metas',
    'Organização de tarefas',
    'Notas e lembretes',
    'Acompanhamento de progresso',
    'Análises e relatórios',
  ];

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <View style={styles.logoSection}>
          <Ionicons name="target" size={64} color={theme.colors.primary[500]} />
          <Text style={styles.appName}>GoalKeeper</Text>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            O GoalKeeper é seu companheiro para alcançar metas e aumentar a produtividade. 
            Organize suas tarefas, acompanhe seu progresso e transforme seus sonhos em realidade.
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Principais Funcionalidades</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.feature}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success[500]} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.teamSection}>
          <Text style={styles.teamTitle}>Desenvolvido com ❤️ por</Text>
          <Text style={styles.teamCredit}>Arnaldo Tomo</Text>
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary, // Corrigido: era theme.color
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
    marginHorizontal: 16,
    marginBottom: 20,
    ...theme.shadows.md,
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
    marginHorizontal: 16,
    marginBottom: 20,
    ...theme.shadows.md,
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
    marginBottom: 40,
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
});

export default AboutScreen;