import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const QuickActions = ({ onCreateGoal, onCreateTask, onCreateNote }) => {
  const actions = [
    {
      id: 'goal',
      title: 'Nova Meta',
      icon: 'target',
      color: theme.colors.primary[500],
      onPress: onCreateGoal,
    },
    {
      id: 'task',
      title: 'Nova Tarefa',
      icon: 'checkmark-circle',
      color: theme.colors.success[500],
      onPress: onCreateTask,
    },
    {
      id: 'note',
      title: 'Nova Nota',
      icon: 'document-text',
      color: theme.colors.warning[500],
      onPress: onCreateNote,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ações Rápidas</Text>
      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, { backgroundColor: action.color }]}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <Ionicons name={action.icon} size={24} color="white" />
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...theme.shadows.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default QuickActions;
