// 📱 App.js - GoalKeeper Main Application (Sem fontes customizadas)
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';

// Stores
import useAuthStore from './src/store/useAuthStore';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from './src/screens/HomeScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import NotesScreen from './src/screens/NotesScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Utils e Constants
import { registerForPushNotificationsAsync } from './src/utils/notifications';
import { theme } from './src/constants/theme';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Loading Screen Component
const LoadingScreen = () => (
  <LinearGradient
    colors={[theme.colors.primary[500], theme.colors.primary[700]]}
    style={styles.loadingContainer}
  >
    <View style={styles.loadingContent}>
      <Ionicons name="radio-button-on" size={64} color="white" />
      <Text style={styles.loadingTitle}>GoalKeeper</Text>
      <Text style={styles.loadingSubtitle}>Carregando...</Text>
      <ActivityIndicator 
        size="large" 
        color="white" 
        style={styles.loadingSpinner} 
      />
    </View>
  </LinearGradient>
);

// Tab Navigator Component
function MainTabs() {
  const getTabBarIcon = (route, focused, color, size) => {
    let iconName;

    switch (route.name) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Goals':
        iconName = focused ? 'radio-button-on' : 'radio-button-off';
        break;
      case 'Notes':
        iconName = focused ? 'document-text' : 'document-text-outline';
        break;
      case 'Analytics':
        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      default:
        iconName = 'circle';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => 
          getTabBarIcon(route, focused, color, size),
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: theme.colors.gray[200],
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalsScreen}
        options={{ title: 'Metas' }}
      />
      <Tab.Screen 
        name="Notes" 
        component={NotesScreen}
        options={{ title: 'Notas' }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ title: 'Análises' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary[500],
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Criar Conta' }}
      />
    </Stack.Navigator>
  );
}

// App Stack Navigator (quando autenticado)
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary[500],
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Main App Component
export default function App() {
  const { isAuthenticated, initialize, user } = useAuthStore();
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load splash screen
        SplashScreen.preventAutoHideAsync();

        // Initialize auth store
        await initialize();

        // Register for push notifications
        if (isAuthenticated) {
          await registerForPushNotificationsAsync();
        }

        // Set initial route
        setInitialRouteName(isAuthenticated ? 'MainTabs' : 'Login');

        // Small delay to ensure smooth transition
        await new Promise(resolve => setTimeout(resolve, 1500));

      } catch (error) {
        console.warn('Error loading app resources:', error);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    if (isLoadingComplete) {
      setInitialRouteName(isAuthenticated ? 'MainTabs' : 'Login');
    }
  }, [isAuthenticated, isLoadingComplete]);

  // Show loading screen while initializing
  if (!isLoadingComplete) {
    return <LoadingScreen />;
  }

  // Navigation Theme
  const navigationTheme = {
    dark: false,
    colors: {
      primary: theme.colors.primary[500],
      background: theme.colors.background.default,
      card: theme.colors.background.paper,
      text: theme.colors.text.primary,
      border: theme.colors.gray[200],
      notification: theme.colors.error[500],
    },
  };

  return (
    <>
      <StatusBar style="auto" backgroundColor={theme.colors.primary[500]} />
      <NavigationContainer theme={navigationTheme}>
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 40,
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 30,
  },
  loadingSpinner: {
    marginTop: 20,
  },
});