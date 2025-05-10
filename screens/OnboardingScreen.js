import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/coffee-bg.jpg')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Enamórate del café con un deleite dichoso!</Text>
        <Text style={styles.subtitle}>
          Bienbenido a nuestro acogedor rincón de café, donde cada tasa es una delicia.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainTabs')}

        >
          <Text style={styles.buttonText}>Empecemos</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#c67c4e',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
