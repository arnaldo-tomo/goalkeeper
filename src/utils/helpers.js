import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatString, { locale: ptBR });
};

export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) return 'Hoje';
  if (isTomorrow(dateObj)) return 'Amanhã';
  if (isYesterday(dateObj)) return 'Ontem';
  
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: ptBR 
  });
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0min';
  
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

export const getCategoryIcon = (category) => {
  const icons = {
    trabalho: 'briefcase',
    saude: 'heart',
    pessoal: 'person',
    financeiro: 'cash',
    educacao: 'school',
    outro: 'ellipsis-horizontal'
  };
  return icons[category] || icons.outro;
};

export const getCategoryColor = (category) => {
  const colors = {
    trabalho: '#2196F3',
    saude: '#4CAF50',
    pessoal: '#FF9800',
    financeiro: '#9C27B0',
    educacao: '#607D8B',
    outro: '#795548'
  };
  return colors[category] || colors.outro;
};

export const getPriorityColor = (priority) => {
  const colors = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336'
  };
  return colors[priority] || colors.medium;
};

export const getStatusColor = (status) => {
  const colors = {
    active: '#2196F3',
    paused: '#FF9800',
    completed: '#4CAF50',
    cancelled: '#F44336'
  };
  return colors[status] || colors.active;
};

export const calculateProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const generateMotivationalMessage = (progress) => {
  const messages = {
    0: ["Vamos começar! 🚀", "O primeiro passo é sempre o mais importante"],
    25: ["Bom começo! 👍", "Você já está no caminho certo"],
    50: ["Na metade! 💪", "Continue assim, você consegue!"],
    75: ["Quase lá! 🔥", "Falta pouco para a conquista"],
    100: ["Parabéns! 🎉", "Meta concluída com sucesso!"]
  };
  
  let closestKey = 0;
  Object.keys(messages).forEach(key => {
    if (progress >= parseInt(key)) {
      closestKey = parseInt(key);
    }
  });
  
  const messageArray = messages[closestKey];
  return messageArray[Math.floor(Math.random() * messageArray.length)];
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};