export const theme = {
  colors: {
    primary: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3',
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
    success: {
      50: '#E8F5E8',
      500: '#4CAF50',
      900: '#1B5E20',
    },
    warning: {
      50: '#FFF3E0',
      500: '#FF9800',
      900: '#E65100',
    },
    error: {
      50: '#FFEBEE',
      500: '#F44336',
      900: '#B71C1C',
    },
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#666666',
      disabled: '#9E9E9E',
    }
  },
  
  // 🔤 Fontes Poppins atualizadas
  fonts: {
    thin: 'Poppins-Thin',
    extraLight: 'Poppins-ExtraLight',
    light: 'Poppins-Light',
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
    extraBold: 'Poppins-ExtraBold',
    black: 'Poppins-Black',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    }
  },
  
  // 🎨 Helper para usar as fontes facilmente
  typography: {
    heading1: {
      fontFamily: 'Poppins-Bold',
      fontSize: 32,
      lineHeight: 40,
    },
    heading2: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 24,
      lineHeight: 32,
    },
    heading3: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 20,
      lineHeight: 28,
    },
    heading4: {
      fontFamily: 'Poppins-Medium',
      fontSize: 18,
      lineHeight: 24,
    },
    body1: {
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    body2: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      lineHeight: 20,
    },
    caption: {
      fontFamily: 'Poppins-Regular',
      fontSize: 12,
      lineHeight: 16,
    },
    button: {
      fontFamily: 'Poppins-Medium',
      fontSize: 16,
      lineHeight: 20,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    }
  }
};