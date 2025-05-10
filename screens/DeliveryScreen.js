import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function DeliveryScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/map.png')} // Asegúrate de tener una imagen de mapa en assets
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Delivery is on the way</Text>
        <Text style={styles.eta}>Est. Arrival: 10 mins</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '100%',
    padding: 30,
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  eta: { fontSize: 16, color: '#ccc', marginBottom: 20 },
  button: {
    backgroundColor: '#c67c4e',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
