// Goals Components
export { ProgressRing } from './goals/ProgressRing';

// Widgets Components
export { QuickActions } from './widgets/QuickActions';

// Charts Components
export { ProgressChart } from './charts/ProgressChart';

// Common Components
export { default as LoadingSpinner } from './common/LoadingSpinner';
export { 
  default as EmptyState,
  NoGoalsState,
  NoRemindersState,
  NoNotesState,
  NoDataState,
  OfflineState,
  ErrorState 
} from './common/EmptyState';

// Types for components
export interface Goal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  target: number;
  deadline?: Date;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dateTime: Date;
  repeat?: 'daily' | 'weekly' | 'monthly';
  isCompleted: boolean;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}