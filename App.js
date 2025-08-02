// 📱 App.js - GoalKeeper Main Application
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

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

// Goal Screens
import CreateGoalScreen from './src/screens/goals/CreateGoalScreen';
import GoalDetailScreen from './src/screens/goals/GoalDetailScreen';
import EditGoalScreen from './src/screens/goals/EditGoalScreen';

// Task Screens
import CreateTaskScreen from './src/screens/tasks/CreateTaskScreen';
import TaskDetailScreen from './src/screens/tasks/TaskDetailScreen';
import EditTaskScreen from './src/screens/tasks/EditTaskScreen';

// Note Screens
import CreateNoteScreen from './src/screens/notes/CreateNoteScreen';
import NoteDetailScreen from './src/screens/notes/NoteDetailScreen';
import EditNoteScreen from './src/screens/notes/EditNoteScreen';

// Reminder Screens
import CreateReminderScreen from './src/screens/reminders/CreateReminderScreen';
import RemindersScreen from './src/screens/reminders/RemindersScreen';

// Settings Screens
import SettingsScreen from './src/screens/SettingsScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import SecurityScreen from './src/screens/profile/SecurityScreen';
import NotificationSettingsScreen from './src/screens/settings/NotificationSettingsScreen';
import ThemeSettingsScreen from './src/screens/settings/ThemeSettingsScreen';

// Info Screens
import AboutScreen from './src/screens/info/AboutScreen';
import HelpScreen from './src/screens/info/HelpScreen';
import ContactScreen from './src/screens/info/ContactScreen';
import PrivacyScreen from './src/screens/info/PrivacyScreen';
import TermsScreen from './src/screens/info/TermsScreen';

// Utils
import { registerForPushNotificationsAsync } from './src/utils/notifications';
// Theme
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
      <Ionicons name="target" size={64} color="white" />
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
        iconName = focused ? 'target' : 'target-outline';
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
        iconName = 'help-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => 
          getTabBarIcon(route, focused, color, size),
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.gray[500],
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: theme.colors.gray[200],
          paddingBottom: 5,
          paddingTop: 5,
          height: 65,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Início',
          tabBarBadge: null, // Pode ser usado para notificações
        }}
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
        options={{ title: 'Relatórios' }}
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
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main App Stack Navigator
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
          elevation: 4,
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        headerTintColor: theme.colors.primary[500],
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Main Tabs */}
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ headerShown: false }}
      />

      {/* Goal Screens */}
      <Stack.Group>
        <Stack.Screen 
          name="CreateGoal" 
          component={CreateGoalScreen}
          options={{ 
            title: 'Nova Meta',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: theme.colors.primary[500],
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              color: 'white',
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="GoalDetail" 
          component={GoalDetailScreen}
          options={({ route }) => ({ 
            title: route.params?.goalTitle || 'Detalhes da Meta',
            headerRight: () => (
              <Ionicons 
                name="ellipsis-horizontal" 
                size={24} 
                color={theme.colors.primary[500]} 
              />
            ),
          })}
        />
        <Stack.Screen 
          name="EditGoal" 
          component={EditGoalScreen}
          options={{ 
            title: 'Editar Meta',
            presentation: 'modal',
          }}
        />
      </Stack.Group>

      {/* Task Screens */}
      <Stack.Group>
        <Stack.Screen 
          name="CreateTask" 
          component={CreateTaskScreen}
          options={{ 
            title: 'Nova Tarefa',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="TaskDetail" 
          component={TaskDetailScreen}
          options={{ title: 'Detalhes da Tarefa' }}
        />
        <Stack.Screen 
          name="EditTask" 
          component={EditTaskScreen}
          options={{ 
            title: 'Editar Tarefa',
            presentation: 'modal',
          }}
        />
      </Stack.Group>

      {/* Note Screens */}
      <Stack.Group>
        <Stack.Screen 
          name="CreateNote" 
          component={CreateNoteScreen}
          options={{ 
            title: 'Nova Nota',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: theme.colors.success[500],
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen 
          name="NoteDetail" 
          component={NoteDetailScreen}
          options={{ title: 'Nota' }}
        />
        <Stack.Screen 
          name="EditNote" 
          component={EditNoteScreen}
          options={{ 
            title: 'Editar Nota',
            presentation: 'modal',
          }}
        />
      </Stack.Group>

      {/* Reminder Screens */}
      <Stack.Group>
        <Stack.Screen 
          name="Reminders" 
          component={RemindersScreen}
          options={{ title: 'Lembretes' }}
        />
        <Stack.Screen 
          name="CreateReminder" 
          component={CreateReminderScreen}
          options={{ 
            title: 'Novo Lembrete',
            presentation: 'modal',
          }}
        />
      </Stack.Group>

      {/* Settings Screens */}
      <Stack.Group>
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Configurações' }}
        />
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfileScreen}
          options={{ title: 'Editar Perfil' }}
        />
        <Stack.Screen 
          name="Security" 
          component={SecurityScreen}
          options={{ title: 'Segurança' }}
        />
        <Stack.Screen 
          name="NotificationSettings" 
          component={NotificationSettingsScreen}
          options={{ title: 'Notificações' }}
        />
        <Stack.Screen 
          name="ThemeSettings" 
          component={ThemeSettingsScreen}
          options={{ title: 'Tema' }}
        />
      </Stack.Group>

      {/* Info Screens */}
      <Stack.Group>
        <Stack.Screen 
          name="About" 
          component={AboutScreen}
          options={{ title: 'Sobre o GoalKeeper' }}
        />
        <Stack.Screen 
          name="Help" 
          component={HelpScreen}
          options={{ title: 'Central de Ajuda' }}
        />
        <Stack.Screen 
          name="Contact" 
          component={ContactScreen}
          options={{ title: 'Fale Conosco' }}
        />
        <Stack.Screen 
          name="Privacy" 
          component={PrivacyScreen}
          options={{ title: 'Política de Privacidade' }}
        />
        <Stack.Screen 
          name="Terms" 
          component={TermsScreen}
          options={{ title: 'Termos de Uso' }}
        />
      </Stack.Group>
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

        // Load fonts (if needed)
        await Font.loadAsync({
          // Add custom fonts here if needed
          // 'CustomFont': require('./assets/fonts/CustomFont.ttf'),
        });

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
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8F9FA',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
// Error Boundary Component (opcional, mas recomendado)
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary:', error, errorInfo);
    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, Bugsnag, etc.
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={64} color={theme.colors.error[500]} />
          <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
          <Text style={styles.errorMessage}>
            Ocorreu um erro inesperado. Por favor, reinicie o aplicativo.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}



