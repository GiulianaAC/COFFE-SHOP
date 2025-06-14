import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function DeliveryScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [nearestCoffeeShop, setNearestCoffeeShop] = useState(null);
  const mapRef = useRef(null);
  
  // Datos de muestra para cafeterías (reemplazarías esto con datos de la API de Google Places)
  const coffeeShops = [
    { 
      id: 1, 
      name: "Coffee Shop Surco", 
      address: "Av. Principal 123, Surco", 
      location: { latitude: -12.1358, longitude: -76.9825 }
    },
    { 
      id: 2, 
      name: "Coffee Shop Miraflores", 
      address: "Calle Las Flores 456, Miraflores", 
      location: { latitude: -12.1219, longitude: -77.0299 }
    },
    { 
      id: 3, 
      name: "Coffee Shop Barranco", 
      address: "Jr. Unión 789, Barranco", 
      location: { latitude: -12.1491, longitude: -77.0209 }
    }
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        setErrorMsg('Error obteniendo la ubicación actual');
      }
    })();
  }, []);

  const searchAddress = async () => {
    if (!address.trim()) {
      Alert.alert("Error", "Por favor ingresa una dirección");
      return;
    }

    setIsSearching(true);
    try {
      // Geocodificación de la dirección (convertir texto a coordenadas)
      const geocodeResult = await Location.geocodeAsync(address);
      
      if (geocodeResult.length > 0) {
        const { latitude, longitude } = geocodeResult[0];
        
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setLocation(newRegion);
        mapRef.current?.animateToRegion(newRegion);
        
        // Encuentra la cafetería más cercana (implementación simple)
        const nearest = findNearestCoffeeShop(latitude, longitude);
        setNearestCoffeeShop(nearest);
      } else {
        Alert.alert("Error", "No se encontró la dirección ingresada");
      }
    } catch (error) {
      Alert.alert("Error", "Error al buscar la dirección");
    } finally {
      setIsSearching(false);
    }
  };

  // Función para calcular la cafetería más cercana
  const findNearestCoffeeShop = (latitude, longitude) => {
    if (coffeeShops.length === 0) return null;
    
    // Calcula la distancia entre dos puntos usando la fórmula de Haversine
    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radio de la tierra en km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const distance = R * c; // Distancia en km
      return distance;
    };
    
    const deg2rad = (deg) => {
      return deg * (Math.PI/180);
    };
    
    let nearestShop = coffeeShops[0];
    let shortestDistance = getDistance(
      latitude, longitude, 
      nearestShop.location.latitude, nearestShop.location.longitude
    );
    
    for (let i = 1; i < coffeeShops.length; i++) {
      const shop = coffeeShops[i];
      const distance = getDistance(
        latitude, longitude, 
        shop.location.latitude, shop.location.longitude
      );
      
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestShop = shop;
      }
    }
    
    return { ...nearestShop, distance: shortestDistance };
  };

  let content;
  if (errorMsg) {
    content = <Text style={styles.errorText}>{errorMsg}</Text>;
  } else if (!location) {
    content = <ActivityIndicator size="large" color="#c67c4e" />;
  } else {
    content = (
      <MapView
        ref={mapRef}
        style={styles.map}
        //provider={MapView.PROVIDER_DEFAULT} //provider={PROVIDER_GOOGLE}
        initialRegion={location}
        apiKey="AIzaSyDbXCk2WOE-GGWQx16Ba1E_Bm7FgElNU4Q"
      >
        {/* Marcador para la ubicación actual/buscada */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude
          }}
          title="Tu ubicación"
          pinColor="#3498db"
        />

        {/* Marcadores para las cafeterías */}
        {coffeeShops.map(shop => (
          <Marker
            key={shop.id}
            coordinate={shop.location}
            title={shop.name}
            pinColor="#c67c4e"
            description={shop.address}
          />
        ))}
      </MapView>
    );
  }

  return (
    <View style={styles.container}>
      {content}
      
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu dirección"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={searchAddress}
          disabled={isSearching}
        >
          {isSearching ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="search" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      
      {nearestCoffeeShop && (
        <View style={styles.overlay}>
          <Text style={styles.title}>{nearestCoffeeShop.name}</Text>
          <Text style={styles.address}>{nearestCoffeeShop.address}</Text>
          <Text style={styles.eta}>Distancia: {nearestCoffeeShop.distance.toFixed(2)} km</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Ordenar en esta tienda</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {!nearestCoffeeShop && (
        <View style={styles.infoOverlay}>
          <Text style={styles.infoText}>Ingresa tu dirección para encontrar la cafetería más cercana</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#c67c4e',
    padding: 12,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 5,
  },
  eta: {
    fontSize: 16,
    color: '#c67c4e',
    marginBottom: 20,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#c67c4e',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 100,
    padding: 20,
  },
});
