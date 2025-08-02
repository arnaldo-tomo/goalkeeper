import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useEffect,
} from 'react-native-reanimated';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  title?: string;
  subtitle?: string;
  showPercentage?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#4CAF50',
  backgroundColor = '#E0E0E0',
  title,
  subtitle,
  showPercentage = true,
}) => {
  const animatedProgress = useSharedValue(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    animatedProgress.value = withTiming(progress, {duration: 1000});
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (animatedProgress.value / 100) * circumference;
    return {
      strokeDashoffset,
    };
  });

  return (
    <Surface style={[styles.container, {width: size + 20, height: size + 60}]}>
      <View style={styles.svgContainer}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            animatedProps={animatedProps}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        {/* Center Content */}
        <View style={styles.centerContent}>
          {showPercentage && (
            <Text style={[styles.percentage, {color}]}>
              {Math.round(progress)}%
            </Text>
          )}
        </View>
      </View>
      
      {/* Title and Subtitle */}
      {title && (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  svgContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
    textAlign: 'center',
  },
});