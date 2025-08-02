import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useEffect,
} from 'react-native-reanimated';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: any;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#4CAF50',
  text,
  overlay = false,
  style,
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {duration: 800}),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const Container = overlay ? OverlayContainer : NormalContainer;

  return (
    <Container style={style}>
      <View style={styles.content}>
        <ActivityIndicator
          size={size}
          color={color}
          style={styles.spinner}
        />
        {text && (
          <Animated.Text style={[styles.text, animatedStyle, {color}]}>
            {text}
          </Animated.Text>
        )}
      </View>
    </Container>
  );
};

const NormalContainer: React.FC<{children: React.ReactNode; style?: any}> = ({
  children,
  style,
}) => <View style={[styles.container, style]}>{children}</View>;

const OverlayContainer: React.FC<{children: React.ReactNode; style?: any}> = ({
  children,
  style,
}) => (
  <View style={[styles.overlay, style]}>
    <View style={styles.overlayContent}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  overlayContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoadingSpinner;