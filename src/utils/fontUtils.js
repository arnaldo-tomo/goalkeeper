// src/utils/fontUtils.js - Utility para gerenciar fontes com fallbacks

import { Platform } from 'react-native';

/**
 * Utilitário para obter fonte com fallback
 * @param {string} fontFamily - Nome da fonte desejada
 * @returns {string} - Nome da fonte ou fallback
 */
export const getFontFamily = (fontFamily) => {
  // Lista de fontes Poppins disponíveis
  const poppinsFonts = [
    'Poppins-Thin',
    'Poppins-ExtraLight',
    'Poppins-Light',
    'Poppins-Regular',
    'Poppins-Medium',
    'Poppins-SemiBold',
    'Poppins-Bold',
    'Poppins-ExtraBold',
    'Poppins-Black'
  ];

  // Se é uma fonte Poppins, retorna ela (assumindo que foi carregada)
  if (poppinsFonts.includes(fontFamily)) {
    return fontFamily;
  }

  // Fallbacks para diferentes pesos
  const fallbacks = {
    thin: Platform.select({
      ios: 'System',
      android: 'sans-serif-thin',
      default: 'System'
    }),
    light: Platform.select({
      ios: 'System',
      android: 'sans-serif-light',
      default: 'System'
    }),
    regular: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'System'
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'System'
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'sans-serif-bold',
      default: 'System'
    }),
    heavy: Platform.select({
      ios: 'System',
      android: 'sans-serif-black',
      default: 'System'
    })
  };

  return fallbacks[fontFamily] || fallbacks.regular;
};

/**
 * Objeto de fontes com fallbacks seguros
 */
export const safeFonts = {
  thin: getFontFamily('Poppins-Thin'),
  extraLight: getFontFamily('Poppins-ExtraLight'),
  light: getFontFamily('Poppins-Light'),
  regular: getFontFamily('Poppins-Regular'),
  medium: getFontFamily('Poppins-Medium'),
  semiBold: getFontFamily('Poppins-SemiBold'),
  bold: getFontFamily('Poppins-Bold'),
  extraBold: getFontFamily('Poppins-ExtraBold'),
  black: getFontFamily('Poppins-Black'),
  heavy: getFontFamily('Poppins-ExtraBold'), // Para React Navigation
};