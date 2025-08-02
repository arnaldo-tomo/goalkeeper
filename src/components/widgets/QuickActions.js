import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Surface, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  title?: string;
  horizontal?: boolean;
}

const defaultActions: QuickAction[] = [
  {
    id: '1',
    title: 'Nova Meta',
    icon: 'target',
    color: '#4CAF50',
    onPress: () => console.log('Nova Meta'),
  },
  {
    id: '2',
    title: 'Lembrete',
    icon: 'bell-plus',
    color: '#FF9800',
    onPress: () => console.log('Novo Lembrete'),
  },
  {
    id: '3',
    title: 'Nota Rápida',
    icon: 'note-plus',
    color: '#2196F3',
    onPress: () => console.log('Nova Nota'),
  },
  {
    id: '4',
    title: 'Progresso',
    icon: 'chart-line',
    color: '#9C27B0',
    onPress: () => console.log('Ver Progresso'),
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions = defaultActions,
  title = 'Ações Rápidas',
  horizontal = true,
}) => {
  const theme = useTheme();

  const ActionItem: React.FC<{action: QuickAction}> = ({action}) => (
    <TouchableOpacity
      style={styles.actionItem}
      onPress={action.onPress}
      activeOpacity={0.7}>
      <Surface style={[styles.actionSurface, {backgroundColor: action.color + '15'}]}>
        <Icon
          name={action.icon}
          size={24}
          color={action.color}
        />
      </Surface>
      <Text style={styles.actionTitle} numberOfLines={2}>
        {action.title}
      </Text>
    </TouchableOpacity>
  );

  if (horizontal) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}>
          {actions.map((action) => (
            <ActionItem key={action.id} action={action} />
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.gridContainer}>
        {actions.map((action) => (
          <ActionItem key={action.id} action={action} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  horizontalContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionItem: {
    alignItems: 'center',
    width: 80,
  },
  actionSurface: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 14,
  },
});