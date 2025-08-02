import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  useEffect,
} from 'react-native-reanimated';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  style?: any;
  iconColor?: string;
  animated?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox-outline',
  title,
  description,
  actionText,
  onAction,
  style,
  iconColor = '#CCCCCC',
  animated = true,
}) => {
  const translateY = useSharedValue(animated ? 50 : 0);
  const opacity = useSharedValue(animated ? 0 : 1);
  const scale = useSharedValue(animated ? 0.8 : 1);

  useEffect(() => {
    if (animated) {
      opacity.value = withTiming(1, {duration: 600});
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      });
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {translateY: translateY.value},
      {scale: scale.value},
    ],
  }));

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={64} color={iconColor} />
        </View>
        
        <Text style={styles.title}>{title}</Text>
        
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
        
        {actionText && onAction && (
          <Button
            mode="contained"
            onPress={onAction}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}>
            {actionText}
          </Button>
        )}
      </View>
    </Animated.View>
  );
};

// Variações pré-definidas para casos comuns
export const NoGoalsState: React.FC<{onCreateGoal?: () => void}> = ({
  onCreateGoal,
}) => (
  <EmptyState
    icon="target"
    title="Nenhuma meta encontrada"
    description="Crie sua primeira meta e comece a acompanhar seu progresso!"
    actionText="Criar Meta"
    onAction={onCreateGoal}
    iconColor="#4CAF50"
  />
);

export const NoRemindersState: React.FC<{onCreateReminder?: () => void}> = ({
  onCreateReminder,
}) => (
  <EmptyState
    icon="bell-outline"
    title="Nenhum lembrete configurado"
    description="Configure lembretes para não esquecer das suas tarefas importantes."
    actionText="Criar Lembrete"
    onAction={onCreateReminder}
    iconColor="#FF9800"
  />
);

export const NoNotesState: React.FC<{onCreateNote?: () => void}> = ({
  onCreateNote,
}) => (
  <EmptyState
    icon="note-outline"
    title="Nenhuma nota salva"
    description="Anote suas ideias e pensamentos importantes aqui."
    actionText="Criar Nota"
    onAction={onCreateNote}
    iconColor="#2196F3"
  />
);

export const NoDataState: React.FC = () => (
  <EmptyState
    icon="chart-line-variant"
    title="Dados insuficientes"
    description="Continue usando o app para gerar relatórios e gráficos detalhados."
    iconColor="#9C27B0"
  />
);

export const OfflineState: React.FC<{onRetry?: () => void}> = ({onRetry}) => (
  <EmptyState
    icon="wifi-off"
    title="Sem conexão"
    description="Verifique sua conexão com a internet e tente novamente."
    actionText="Tentar Novamente"
    onAction={onRetry}
    iconColor="#F44336"
  />
);

export const ErrorState: React.FC<{onRetry?: () => void; message?: string}> = ({
  onRetry,
  message,
}) => (
  <EmptyState
    icon="alert-circle-outline"
    title="Algo deu errado"
    description={message || "Ocorreu um erro inesperado. Tente novamente."}
    actionText="Tentar Novamente"
    onAction={onRetry}
    iconColor="#F44336"
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actionButton: {
    marginTop: 8,
    borderRadius: 24,
  },
  actionButtonContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});

export default EmptyState;