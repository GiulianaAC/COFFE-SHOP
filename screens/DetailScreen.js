import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function DetailScreen({ navigation }) {
  const [size, setSize] = useState('M');

  const coffee = {
    name: 'Caffe Mocha',
    type: 'Ice/Hot',
    description: 'A cappuccino is an approximately 150 ml (5 oz) beverage, with 25 ml of espresso coffee and 85 ml of fresh milk.',
    rating: 4.8,
    reviews: 230,
    price: 4.53,
    image: require('../assets/mocha.jpg'),
  };

  return (
    <View style={styles.container}>
      <Image source={coffee.image} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title}>{coffee.name}</Text>
        <Text style={styles.subtitle}>{coffee.type}</Text>
        <Text style={styles.rating}>⭐ {coffee.rating} ({coffee.reviews})</Text>
        <Text style={styles.desc}>{coffee.description}</Text>

        <View style={styles.sizeSelector}>
          {['S', 'M', 'L'].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.sizeButton, size === s && styles.sizeSelected]}
              onPress={() => setSize(s)}
            >
              <Text style={size === s ? styles.sizeTextSelected : styles.sizeText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>${coffee.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => navigation.navigate('Order')}
          >
            <Text style={styles.buyText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 280 },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#888', marginVertical: 4 },
  rating: { color: '#444', marginBottom: 12 },
  desc: { color: '#555', fontSize: 15, lineHeight: 22 },
  sizeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
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
