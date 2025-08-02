// 🎨 src/screens/settings/ThemeSettingsScreen.js - GoalKeeper Theme Settings
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Utils
import { theme } from '../../constants/theme'; // Adicionado import do theme
import { hapticFeedback } from '../../utils/haptics';

const ThemeSettingsScreen = ({ navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedColor, setSelectedColor] = useState('blue');

  const themes = [
    { id: 'light', name: 'Claro', icon: 'sunny' },
    { id: 'dark', name: 'Escuro', icon: 'moon' },
    { id: 'auto', name: 'Automático', icon: 'phone-portrait' }
  ];

  const colors = [
    { id: 'blue', name: 'Azul', color: '#2196F3' },
    { id: 'green', name: 'Verde', color: '#4CAF50' },
    { id: 'orange', name: 'Laranja', color: '#FF9800' },
    { id: 'purple', name: 'Roxo', color: '#9C27B0' }
  ];

  // Corrigido: mudado parâmetro de 'theme' para 'themeOption' para evitar conflito
  const ThemeOption = ({ themeOption, isSelected, onSelect }) => (
    <TouchableOpacity
      style={[styles.themeOption, isSelected && styles.themeOptionActive]}
      onPress={onSelect}
    >
      <Ionicons 
        name={themeOption.icon} 
        size={24} 
        color={isSelected ? theme.colors.primary[500] : '#666'} 
      />
      <Text style={[
        styles.themeOptionText,
        isSelected && styles.themeOptionTextActive
      ]}>
        {themeOption.name}
      </Text>
      {isSelected && (
        <Ionicons name="checkmark" size={20} color={theme.colors.primary[500]} />
      )}
    </TouchableOpacity>
  );

  const ColorOption = ({ color, isSelected, onSelect }) => (
    <TouchableOpacity
      style={[styles.colorOption, isSelected && styles.colorOptionActive]}
      onPress={onSelect}
    >
      <View style={[styles.colorCircle, { backgroundColor: color.color }]} />
      <Text style={styles.colorOptionText}>{color.name}</Text>
      {isSelected && (
        <Ionicons name="checkmark" size={20} color={color.color} />
      )}
    </TouchableOpacity>
  );

  const handleThemeChange = (themeId) => {
    hapticFeedback.light();
    setSelectedTheme(themeId);
    // Aqui você implementaria a lógica para salvar o tema
    console.log('Tema selecionado:', themeId);
  };

  const handleColorChange = (colorId) => {
    hapticFeedback.light();
    setSelectedColor(colorId);
    // Aqui você implementaria a lógica para salvar a cor
    console.log('Cor selecionada:', colorId);
  };

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tema</Text>
          {themes.map(themeItem => (
            <ThemeOption
              key={themeItem.id}
              themeOption={themeItem} // Corrigido: mudado de 'theme' para 'themeOption'
              isSelected={selectedTheme === themeItem.id}
              onSelect={() => handleThemeChange(themeItem.id)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cor Principal</Text>
          {colors.map(color => (
            <ColorOption
              key={color.id}
              color={color}
              isSelected={selectedColor === color.id}
              onSelect={() => handleColorChange(color.id)}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    padding: 20,
    paddingBottom: 0,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  themeOptionActive: {
    backgroundColor: theme.colors.primary[50],
  },
  themeOptionText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginLeft: 16,
    flex: 1,
  },
  themeOptionTextActive: {
    color: theme.colors.primary[500],
    fontWeight: '600',
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  colorOptionActive: {
    backgroundColor: theme.colors.gray[50],
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
  },
  colorOptionText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    flex: 1,
  },
});

export default ThemeSettingsScreen;