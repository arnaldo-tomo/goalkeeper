const ThemeSettingsScreen = () => {
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

  const ThemeOption = ({ theme, isSelected, onSelect }) => (
    <TouchableOpacity
      style={[styles.themeOption, isSelected && styles.themeOptionActive]}
      onPress={onSelect}
    >
      <Ionicons 
        name={theme.icon} 
        size={24} 
        color={isSelected ? theme.colors.primary[500] : '#666'} 
      />
      <Text style={[
        styles.themeOptionText,
        isSelected && styles.themeOptionTextActive
      ]}>
        {theme.name}
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tema</Text>
        {themes.map(theme => (
          <ThemeOption
            key={theme.id}
            theme={theme}
            isSelected={selectedTheme === theme.id}
            onSelect={() => setSelectedTheme(theme.id)}
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
            onSelect={() => setSelectedColor(color.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};
