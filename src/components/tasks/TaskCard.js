import { StyleSheet } from "react-native";

const TaskCard = ({ task, onPress, onComplete, style }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      high: '#F44336',
      medium: '#FF9800',
      low: '#4CAF50'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'radio-button-off',
      in_progress: 'time',
      completed: 'checkmark-circle',
      cancelled: 'close-circle'
    };
    return icons[status] || icons.pending;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#999',
      in_progress: '#2196F3',
      completed: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[status] || colors.pending;
  };

  return (
    <TouchableOpacity 
      style={[styles.taskCard, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.taskCardContent}>
        <TouchableOpacity
          style={styles.taskCheckbox}
          onPress={() => onComplete && onComplete(task.id)}
        >
          <Ionicons 
            name={getStatusIcon(task.status)} 
            size={24} 
            color={getStatusColor(task.status)} 
          />
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          <Text 
            style={[
              styles.taskTitle,
              task.status === 'completed' && styles.taskTitleCompleted
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          
          {task.description && (
            <Text style={styles.taskDescription} numberOfLines={2}>
              {task.description}
            </Text>
          )}

          <View style={styles.taskMeta}>
            {task.due_date && (
              <View style={styles.taskMetaItem}>
                <Ionicons name="calendar-outline" size={12} color="#666" />
                <Text style={styles.taskMetaText}>
                  {new Date(task.due_date).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            )}
            
            {task.estimated_duration && (
              <View style={styles.taskMetaItem}>
                <Ionicons name="time-outline" size={12} color="#666" />
                <Text style={styles.taskMetaText}>
                  {task.estimated_duration}min
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.taskPriority}>
          <View 
            style={[
              styles.priorityIndicator, 
              { backgroundColor: getPriorityColor(task.priority) }
            ]} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Estilos para ProfileScreen e TaskCard
const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskCheckbox: {
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
  },
  taskMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  taskMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  taskPriority: {
    marginLeft: 12,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
});

