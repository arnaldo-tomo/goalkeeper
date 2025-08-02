import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store para gerenciar metas usando Zustand
const useGoalsStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      goals: [],
      categories: ['Pessoal', 'Profissional', 'Saúde', 'Educação', 'Financeiro'],
      loading: false,
      error: null,

      // Ações para metas
      addGoal: (goalData) => {
        const newGoal = {
          id: Date.now().toString(),
          title: goalData.title,
          description: goalData.description || '',
          progress: 0,
          target: goalData.target || 100,
          deadline: goalData.deadline || null,
          category: goalData.category || 'Pessoal',
          priority: goalData.priority || 'medium', // low, medium, high
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          milestones: goalData.milestones || [],
          notes: [],
        };

        set((state) => ({
          goals: [...state.goals, newGoal],
          error: null,
        }));

        return newGoal;
      },

      updateGoal: (goalId, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                  isCompleted: updates.progress >= goal.target,
                }
              : goal
          ),
          error: null,
        }));
      },

      updateGoalProgress: (goalId, newProgress) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  progress: Math.min(newProgress, goal.target),
                  updatedAt: new Date().toISOString(),
                  isCompleted: newProgress >= goal.target,
                }
              : goal
          ),
        }));
      },

      deleteGoal: (goalId) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== goalId),
          error: null,
        }));
      },

      toggleGoalCompletion: (goalId) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  isCompleted: !goal.isCompleted,
                  progress: !goal.isCompleted ? goal.target : 0,
                  updatedAt: new Date().toISOString(),
                }
              : goal
          ),
        }));
      },

      addGoalNote: (goalId, note) => {
        const newNote = {
          id: Date.now().toString(),
          text: note,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  notes: [...goal.notes, newNote],
                  updatedAt: new Date().toISOString(),
                }
              : goal
          ),
        }));
      },

      addMilestone: (goalId, milestone) => {
        const newMilestone = {
          id: Date.now().toString(),
          title: milestone.title,
          value: milestone.value,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  milestones: [...goal.milestones, newMilestone],
                  updatedAt: new Date().toISOString(),
                }
              : goal
          ),
        }));
      },

      toggleMilestone: (goalId, milestoneId) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  milestones: goal.milestones.map((milestone) =>
                    milestone.id === milestoneId
                      ? {...milestone, isCompleted: !milestone.isCompleted}
                      : milestone
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : goal
          ),
        }));
      },

      addCategory: (categoryName) => {
        set((state) => ({
          categories: [...state.categories, categoryName],
        }));
      },

      // Ações de carregamento
      setLoading: (loading) => set({loading}),
      setError: (error) => set({error}),

      // Seletores (getters)
      getGoalById: (goalId) => {
        return get().goals.find((goal) => goal.id === goalId);
      },

      getGoalsByCategory: (category) => {
        return get().goals.filter((goal) => goal.category === category);
      },

      getActiveGoals: () => {
        return get().goals.filter((goal) => !goal.isCompleted);
      },

      getCompletedGoals: () => {
        return get().goals.filter((goal) => goal.isCompleted);
      },

      getGoalsByPriority: (priority) => {
        return get().goals.filter((goal) => goal.priority === priority);
      },

      getOverdueGoals: () => {
        const now = new Date();
        return get().goals.filter((goal) => {
          if (!goal.deadline || goal.isCompleted) return false;
          return new Date(goal.deadline) < now;
        });
      },

      getGoalsProgress: () => {
        const goals = get().goals;
        if (goals.length === 0) return 0;

        const totalProgress = goals.reduce((sum, goal) => {
          return sum + (goal.progress / goal.target) * 100;
        }, 0);

        return Math.round(totalProgress / goals.length);
      },

      getGoalsStats: () => {
        const goals = get().goals;
        const total = goals.length;
        const completed = goals.filter((goal) => goal.isCompleted).length;
        const inProgress = goals.filter(
          (goal) => !goal.isCompleted && goal.progress > 0
        ).length;
        const notStarted = goals.filter(
          (goal) => !goal.isCompleted && goal.progress === 0
        ).length;

        return {
          total,
          completed,
          inProgress,
          notStarted,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      },

      getCategoryStats: () => {
        const goals = get().goals;
        const categories = get().categories;

        return categories.map((category) => {
          const categoryGoals = goals.filter((goal) => goal.category === category);
          const completed = categoryGoals.filter((goal) => goal.isCompleted).length;

          return {
            category,
            total: categoryGoals.length,
            completed,
            completionRate:
              categoryGoals.length > 0
                ? Math.round((completed / categoryGoals.length) * 100)
                : 0,
          };
        });
      },

      // Ações de busca e filtro
      searchGoals: (query) => {
        const goals = get().goals;
        const lowercaseQuery = query.toLowerCase();

        return goals.filter(
          (goal) =>
            goal.title.toLowerCase().includes(lowercaseQuery) ||
            goal.description.toLowerCase().includes(lowercaseQuery) ||
            goal.category.toLowerCase().includes(lowercaseQuery)
        );
      },

      filterGoals: (filters) => {
        let filteredGoals = get().goals;

        if (filters.category && filters.category !== 'all') {
          filteredGoals = filteredGoals.filter(
            (goal) => goal.category === filters.category
          );
        }

        if (filters.status && filters.status !== 'all') {
          if (filters.status === 'completed') {
            filteredGoals = filteredGoals.filter((goal) => goal.isCompleted);
          } else if (filters.status === 'active') {
            filteredGoals = filteredGoals.filter((goal) => !goal.isCompleted);
          } else if (filters.status === 'overdue') {
            const now = new Date();
            filteredGoals = filteredGoals.filter(
              (goal) =>
                !goal.isCompleted &&
                goal.deadline &&
                new Date(goal.deadline) < now
            );
          }
        }

        if (filters.priority && filters.priority !== 'all') {
          filteredGoals = filteredGoals.filter(
            (goal) => goal.priority === filters.priority
          );
        }

        return filteredGoals;
      },

      // Ações de limpeza
      clearCompleted: () => {
        set((state) => ({
          goals: state.goals.filter((goal) => !goal.isCompleted),
        }));
      },

      clearAll: () => {
        set({
          goals: [],
          error: null,
        });
      },

      // Ações de importação/exportação
      exportGoals: () => {
        const goals = get().goals;
        return JSON.stringify(goals, null, 2);
      },

      importGoals: (goalsData) => {
        try {
          const importedGoals = JSON.parse(goalsData);
          if (Array.isArray(importedGoals)) {
            set((state) => ({
              goals: [...state.goals, ...importedGoals],
              error: null,
            }));
            return true;
          }
          return false;
        } catch (error) {
          set({error: 'Erro ao importar metas: formato inválido'});
          return false;
        }
      },

      // Dados de exemplo para demonstração
      loadSampleGoals: () => {
        const sampleGoals = [
          {
            id: '1',
            title: 'Aprender React Native',
            description: 'Dominar desenvolvimento mobile com React Native',
            progress: 75,
            target: 100,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'Educação',
            priority: 'high',
            isCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            milestones: [
              {
                id: '1-1',
                title: 'Concluir curso básico',
                value: 25,
                isCompleted: true,
                createdAt: new Date().toISOString(),
              },
              {
                id: '1-2',
                title: 'Criar primeiro app',
                value: 50,
                isCompleted: true,
                createdAt: new Date().toISOString(),
              },
              {
                id: '1-3',
                title: 'Publicar na Play Store',
                value: 100,
                isCompleted: false,
                createdAt: new Date().toISOString(),
              },
            ],
            notes: [],
          },
          {
            id: '2',
            title: 'Exercitar-se regularmente',
            description: 'Fazer exercícios 5 vezes por semana',
            progress: 60,
            target: 100,
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'Saúde',
            priority: 'medium',
            isCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            milestones: [],
            notes: [],
          },
          {
            id: '3',
            title: 'Ler 12 livros este ano',
            description: 'Meta de leitura anual',
            progress: 8,
            target: 12,
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'Pessoal',
            priority: 'low',
            isCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            milestones: [],
            notes: [],
          },
        ];

        set({goals: sampleGoals});
      },
    }),
    {
      name: 'goalkeeper-goals-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        goals: state.goals,
        categories: state.categories,
      }),
    }
  )
);

export default useGoalsStore;