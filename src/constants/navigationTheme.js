// src/constants/navigationTheme.js
import { theme } from './theme';

export const navigationTheme = {
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

// Configurações específicas para headers
export const headerConfig = {
  headerStyle: {
    backgroundColor: theme.colors.primary[500],
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitleAlign: 'center',
};// src/constants/navigationTheme.js
import { theme } from './theme';

export const navigationTheme = {
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

// Configurações específicas para headers
export const headerConfig = {
  headerStyle: {
    backgroundColor: theme.colors.primary[500],
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitleAlign: 'center',
};