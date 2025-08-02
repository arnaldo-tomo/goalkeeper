// 🎯 src/components/goals/GoalCard.js - Componente de Card de Meta
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressRing from './ProgressRing'; // Corrigido: removido .js e importação default
import { theme } from '../../constants/theme';

const GoalCard = ({ 
  goal, 
  onPress, 
  onComplete, 
  style 
}) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: theme.colors.error[500],
      medium: theme.colors.warning[500],
      low: theme.colors.success[500]
    };
    return colors[priority] || colors.medium;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return theme.colors.success[500];
    if (progress >= 50) return theme.colors.warning[500];
    return theme.colors.primary[500];
  };

  const progress = goal.completion_percentage || 0;

  return (
    <Animated.View 
      style={[
        styles.container, 
        style,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
        activeOpacity={0.9}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {goal.title}
            </Text>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(goal.priority) }
            ]}>
              <Text style={styles.priorityText}>
                {goal.priority?.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <ProgressRing
            progress={progress}
            size={60}
            strokeWidth={4}
            color={getProgressColor(progress)}
            showPercentage={true}
          />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {goal.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.stats}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.gray[600]} />
            <Text style={styles.statText}>
              {goal.tasks_completed || 0}/{goal.total_tasks || 0} tarefas
            </Text>
          </View>
          
          <View style={styles.stats}>
            <Ionicons name="time-outline" size={16} color={theme.colors.gray[600]} />
            <Text style={styles.statText}>
              {goal.days_remaining || 0} dias restantes
            </Text>
          </View>
        </View>

        {goal.completion_percentage === 100 && (
          <View style={styles.completedOverlay}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success[500]} />
            <Text style={styles.completedText}>Concluída!</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    ...theme.shadows.md,
  },
  touchable: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: theme.colors.gray[600],
    marginLeft: 4,
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.success[500],
    marginLeft: 8,
  },
});

export default GoalCard;