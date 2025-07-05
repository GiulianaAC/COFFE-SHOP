import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext'; // OJO: Solo usamos el hook

export default function DetailScreen({ route, navigation }) {
  const [size, setSize] = useState('M');

  const { coffee } = route.params;

  // Usamos el hook personalizado
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const isFav = isFavorite(coffee.id);

  const price =
    coffee.price[size] ||
    Object.values(coffee.price)[0]; // Si no hay tallas, toma el primero

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavorite(coffee.id);
    } else {
      addFavorite(coffee);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header fijo arriba */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? '#c67c4e' : '#333'}
          />
        </TouchableOpacity>
      </View>

      {/* Contenido scrolleable */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image source={coffee.image} style={styles.image} resizeMode="cover" />
          </View>
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          <Text style={styles.title}>{coffee.name}</Text>
          <Text style={styles.subtitle}>{coffee.type}</Text>

          {/* Iconos de características */}
          <View style={styles.tags}>
            {coffee.icons?.includes('delivery') && (
              <View style={styles.tagIcon}>
                <Ionicons name="car-outline" size={18} color="#c67c4e" />
              </View>
            )}
            {coffee.icons?.includes('milk') && (
              <View style={styles.tagIcon}>
                <Ionicons name="cafe-outline" size={18} color="#c67c4e" />
              </View>
            )}
            {coffee.icons?.includes('coffee') && (
              <View style={styles.tagIcon}>
                <Ionicons name="leaf-outline" size={18} color="#c67c4e" />
              </View>
            )}
          </View>

          <Text style={styles.rating}>⭐ {coffee.rating || '4.8'} ({coffee.reviews || '230'})</Text>

          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.desc}>
            {coffee.description ||
              'Delicious coffee made with the best ingredients. Perfect for any time of the day.'}
          </Text>

          {coffee.price.L && (
            <>
              <Text style={styles.descTitle}>Size</Text>
              <View style={styles.sizeSelector}>
                {['S', 'M', 'L'].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.sizeButton,
                      size === s && styles.sizeSelected,
                    ]}
                    onPress={() => setSize(s)}
                  >
                    <Text
                      style={
                        size === s ? styles.sizeTextSelected : styles.sizeText
                      }
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.price}>${price.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => navigation.navigate('Order')}
            >
              <Text style={styles.buyText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: {
    marginTop: 100, // Esto baja la imagen
  },
  imageWrapper: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 220,
  },
  headerRow: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10, // Esto garantiza que sea tocable
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  iconButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
  },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#888', marginVertical: 4 },
  rating: { color: '#444', marginBottom: 12 },
  descTitle: { fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  desc: { color: '#555', fontSize: 15, lineHeight: 22 },
  tags: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  tagIcon: {
    backgroundColor: '#f2f2f2',
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  sizeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  sizeSelected: {
    backgroundColor: '#c67c4e',
    borderColor: '#c67c4e',
  },
  sizeText: { color: '#555', fontWeight: '500' },
  sizeTextSelected: { color: '#fff', fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { fontSize: 20, fontWeight: 'bold' },
  buyButton: {
    backgroundColor: '#c67c4e',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buyText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
