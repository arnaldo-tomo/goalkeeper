import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressRing from './ProgressRing.js';
// 📊 ProgressRing.js - Anel de progresso estilo Apple Watch
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

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
      high: '#FF5722',
      medium: '#FF9800',
      low: '#4CAF50'
    };
    return colors[priority] || colors.medium;
  };

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
            progress={goal.completion_percentage || 0}
            size={60}
            strokeWidth={4}
            color="#2196F3"
          />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {goal.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.stats}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.statText}>
              {goal.tasks_completed || 0}/{goal.total_tasks || 0} tarefas
            </Text>
          </View>
          
          <View style={styles.stats}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.statText}>
              {goal.days_remaining || 0} dias restantes
            </Text>
          </View>
        </View>

        {goal.completion_percentage === 100 && (
          <View style={styles.completedOverlay}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.completedText}>Concluída!</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};


const ProgressRing = ({ 
  progress, 
  size = 80, 
  strokeWidth = 6, 
  color = '#2196F3',
  backgroundColor = '#E0E0E0',
  showPercentage = true 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        
        {/* Percentage text */}
        {showPercentage && (
          <SvgText
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dy="0.3em"
            fontSize="12"
            fontWeight="bold"
            fill={color}
          >
            {Math.round(progress)}%
          </SvgText>
        )}
      </Svg>
    </View>
  );
};

// 🔔 ReminderCard.js - Card para lembretes
const ReminderCard = ({ reminder, onPress, onToggle }) => {
  return (
    <View style={styles.reminderCard}>
      <TouchableOpacity onPress={onPress} style={styles.reminderContent}>
        <View style={styles.reminderIcon}>
          <Ionicons 
            name={reminder.type === 'location' ? 'location' : 'time'} 
            size={20} 
            color="#2196F3" 
          />
        </View>
        
        <View style={styles.reminderText}>
          <Text style={styles.reminderTitle}>{reminder.title}</Text>
          <Text style={styles.reminderTime}>
            {reminder.type === 'location' 
              ? reminder.location_name 
              : reminder.formatted_time
            }
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => onToggle(reminder.id)}
          style={styles.toggleButton}
        >
          <Ionicons 
            name={reminder.is_active ? 'toggle' : 'toggle-outline'} 
            size={24} 
            color={reminder.is_active ? '#4CAF50' : '#CCC'} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

// 🎨 FloatingActionButton.js - FAB para criação rápida
const FloatingActionButton = ({ onPress, icon = 'add', color = '#2196F3' }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View 
      style={[
        styles.fab,
        { backgroundColor: color },
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.fabTouchable}
      >
        <Ionicons name={icon} size={28} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// 📝 QuickNoteInput.js - Input rápido para notas
const QuickNoteInput = ({ onSave, placeholder = "Adicionar nota rápida..." }) => {
  const [text, setText] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
      setText('');
      setIsExpanded(false);
    }
  };

  return (
    <View style={styles.quickNoteContainer}>
      <TextInput
        style={[
          styles.quickNoteInput,
          isExpanded && styles.quickNoteInputExpanded
        ]}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        multiline={isExpanded}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => !text && setIsExpanded(false)}
      />
      
      {isExpanded && (
        <View style={styles.quickNoteActions}>
          <TouchableOpacity 
            onPress={() => {
              setText('');
              setIsExpanded(false);
            }}
            style={styles.quickNoteCancel}
          >
            <Text style={styles.quickNoteCancelText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleSave}
            style={styles.quickNoteSave}
          >
            <Text style={styles.quickNoteSaveText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // GoalCard styles
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  touchable: {
    padding: 16,
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
    color: '#212121',
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
    marginLeft: 4,
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  
  // ReminderCard styles
  reminderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderText: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  reminderTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  toggleButton: {
    padding: 8,
  },
  
  // FAB styles
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // QuickNote styles
  quickNoteContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickNoteInput: {
    padding: 16,
    fontSize: 16,
    color: '#212121',
    minHeight: 50,
  },
  quickNoteInputExpanded: {
    minHeight: 100,
  },
  quickNoteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: 0,
  },
  quickNoteCancel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  quickNoteCancelText: {
    color: '#666',
    fontSize: 14,
  },
  quickNoteSave: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  quickNoteSaveText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export { GoalCard, ProgressRing, ReminderCard, FloatingActionButton, QuickNoteInput };