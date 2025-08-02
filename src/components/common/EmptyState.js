import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const EmptyState = ({ 
  icon = 'folder-outline', 
  title = 'Nenhum item encontrado',
  subtitle = 'Adicione novos itens para começar',
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons 
        name={icon} 
        size={64} 
        color={theme.colors.gray[400]} 
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: theme.colors.background.default,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;