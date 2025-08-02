import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Surface} from 'react-native-paper';
import {LineChart, BarChart, PieChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#4CAF50',
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: '#E0E0E0',
  },
};

export const ProgressChart = ({
  type,
  data,
  title,
  height = 220,
  showLegend = false,
}) => {
  const renderChart = () => {
    const chartWidth = screenWidth - 48; // accounting for padding

    switch (type) {
      case 'line':
        return (
          <LineChart
            data={data}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            withDots={true}
            withShadow={false}
            withScrollableDot={false}
          />
        );

      case 'bar':
        return (
          <BarChart
            data={data}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            withHorizontalLabels={true}
            withVerticalLabels={true}
          />
        );

      case 'pie':
        return (
          <PieChart
            data={data}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
            center={[10, 0]}
          />
        );

      default:
        return (
          <View style={[styles.errorContainer, {height}]}>
            <Text style={styles.errorText}>Tipo de gráfico não suportado</Text>
          </View>
        );
    }
  };

  // Sample data if none provided
  const getSampleData = () => {
    if (type === 'pie') {
      return [
        {
          name: 'Completas',
          population: 15,
          color: '#4CAF50',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
        {
          name: 'Em Progresso',
          population: 10,
          color: '#FF9800',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
        {
          name: 'Pendentes',
          population: 5,
          color: '#F44336',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
      ];
    }

    return {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43, 60],
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const chartData = data || getSampleData();

  return (
    <Surface style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartContainer}>
        {renderChart()}
      </View>
      {showLegend && type === 'pie' && (
        <View style={styles.legendContainer}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: item.color}]}
              />
              <Text style={styles.legendText}>{item.name}</Text>
            </View>
          ))}
        </View>
      )}
    </Surface>
  );
};

// Componente específico para progresso de metas
export const GoalsProgressChart = ({goals, period = 'week'}) => {
  const getGoalsData = () => {
    if (!goals || goals.length === 0) {
      return {
        labels: ['Sem dados'],
        datasets: [{data: [0]}],
      };
    }

    // Dados para gráfico de linha - progresso ao longo do tempo
    const labels = period === 'week' 
      ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
      : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

    // Simular dados de progresso (em um app real, viria do histórico)
    const progressData = labels.map(() => 
      Math.floor(Math.random() * 100)
    );

    return {
      labels,
      datasets: [
        {
          data: progressData,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  return (
    <ProgressChart
      type="line"
      data={getGoalsData()}
      title={`Progresso ${period === 'week' ? 'Semanal' : 'Mensal'}`}
      height={200}
    />
  );
};

// Componente para estatísticas de categorias
export const CategoryStatsChart = ({categoryStats}) => {
  const getCategoryData = () => {
    if (!categoryStats || categoryStats.length === 0) {
      return [
        {
          name: 'Sem dados',
          population: 1,
          color: '#E0E0E0',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
      ];
    }

    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];
    
    return categoryStats.map((cat, index) => ({
      name: cat.category,
      population: cat.total,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  };

  return (
    <ProgressChart
      type="pie"
      data={getCategoryData()}
      title="Metas por Categoria"
      height={200}
      showLegend={true}
    />
  );
};

// Componente para gráfico de barras de conclusão
export const CompletionChart = ({completionData, period = 'week'}) => {
  const getCompletionData = () => {
    if (!completionData) {
      const labels = period === 'week' 
        ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
        : ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];

      return {
        labels,
        datasets: [
          {
            data: labels.map(() => Math.floor(Math.random() * 10)),
          },
        ],
      };
    }

    return completionData;
  };

  return (
    <ProgressChart
      type="bar"
      data={getCompletionData()}
      title={`Metas Concluídas ${period === 'week' ? 'por Dia' : 'por Semana'}`}
      height={200}
    />
  );
};

// Componente para mini gráfico de progresso
export const MiniProgressChart = ({data, color = '#4CAF50', width = 100, height = 40}) => {
  const miniConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    color: (opacity = 1) => color,
    strokeWidth: 2,
    withDots: false,
    withInnerLines: false,
    withOuterLines: false,
    withHorizontalLabels: false,
    withVerticalLabels: false,
  };

  const miniData = data || {
    datasets: [{
      data: [10, 20, 15, 30, 25, 40, 35],
    }],
  };

  return (
    <LineChart
      data={miniData}
      width={width}
      height={height}
      chartConfig={miniConfig}
      bezier
      withDots={false}
      withShadow={false}
    />
  );
};

// Hook para gerar dados de gráfico a partir das metas
export const useChartData = (goals) => {
  const getProgressOverTime = () => {
    // Em um app real, isso viria do histórico de progresso
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('pt-BR', {weekday: 'short'});
    });

    const progressData = last7Days.map(() => {
      const completed = goals?.filter(g => g.isCompleted).length || 0;
      return completed + Math.floor(Math.random() * 5);
    });

    return {
      labels: last7Days,
      datasets: [{
        data: progressData,
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      }],
    };
  };

  const getCategoryDistribution = () => {
    if (!goals || goals.length === 0) return [];

    const categoryCount = {};
    goals.forEach(goal => {
      categoryCount[goal.category] = (categoryCount[goal.category] || 0) + 1;
    });

    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];
    
    return Object.entries(categoryCount).map(([category, count], index) => ({
      name: category,
      population: count,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  };

  const getCompletionRate = () => {
    if (!goals || goals.length === 0) return [];

    const priorities = ['low', 'medium', 'high'];
    const data = priorities.map(priority => {
      const priorityGoals = goals.filter(g => g.priority === priority);
      const completed = priorityGoals.filter(g => g.isCompleted).length;
      return priorityGoals.length > 0 ? Math.round((completed / priorityGoals.length) * 100) : 0;
    });

    return {
      labels: ['Baixa', 'Média', 'Alta'],
      datasets: [{data}],
    };
  };

  return {
    progressOverTime: getProgressOverTime(),
    categoryDistribution: getCategoryDistribution(),
    completionRate: getCompletionRate(),
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  errorText: {
    color: '#666666',
    fontSize: 14,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666666',
  },
});

export default ProgressChart;