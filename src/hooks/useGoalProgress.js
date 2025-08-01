import { useState, useEffect } from 'react';

export const useGoalProgress = (goal) => {
  const [progress, setProgress] = useState({
    percentage: 0,
    completedTasks: 0,
    totalTasks: 0,
    daysRemaining: 0,
    isOverdue: false
  });

  useEffect(() => {
    if (!goal) return;

    const completedTasks = goal.tasks?.filter(task => task.status === 'completed').length || 0;
    const totalTasks = goal.tasks?.length || 0;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const endDate = goal.end_date ? new Date(goal.end_date) : null;
    const now = new Date();
    const daysRemaining = endDate ? Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))) : 0;
    const isOverdue = endDate ? endDate < now && goal.status !== 'completed' : false;

    setProgress({
      percentage,
      completedTasks,
      totalTasks,
      daysRemaining,
      isOverdue
    });
  }, [goal]);

  return progress;
};
