import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

export default function OrderScreen({ navigation }) {
  const [deliveryType, setDeliveryType] = useState('Deliver');

  const coffee = {
    name: 'Caffe Mocha',
    type: 'Deep Foam',
    price: 4.53,
    deliveryFee: 1.00,
    image: require('../assets/mocha.jpg'),
  };

  return (
    <View style={styles.container}>
      {/* Selector de entrega */}
      <View style={styles.toggle}>
        {['Deliver', 'Pick Up'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setDeliveryType(type)}
            style={[styles.toggleButton, deliveryType === type && styles.activeToggle]}
          >
            <Text style={deliveryType === type ? styles.activeText : styles.inactiveText}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dirección */}
      <View style={styles.section}>
        <Text style={styles.label}>Delivery Address</Text>
        <Text style={styles.address}>Jl. Kpg Sutoyo, Bilzen, Tanjungbalai</Text>
        <View style={styles.editRow}>
          <Text style={styles.edit}>Edit Address</Text>
          <Text style={styles.edit}>Add Note</Text>
        </View>
      </View>

      {/* Producto */}
      <View style={styles.section}>
        <View style={styles.productRow}>
          <Image source={coffee.image} style={styles.productImage} />
          <View>
            <Text style={styles.productName}>{coffee.name}</Text>
            <Text style={styles.productType}>{coffee.type}</Text>
          </View>
          <Text style={styles.quantity}>x1</Text>
        </View>
      </View>

      {/* Pago */}
      <View style={styles.section}>
        <Text style={styles.label}>Payment Summary</Text>
        <View style={styles.priceRow}>
          <Text>Price</Text>
          <Text>${coffee.price.toFixed(2)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Delivery Fee</Text>
          <Text>${coffee.deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>${(coffee.price + coffee.deliveryFee).toFixed(2)}</Text>
        </View>
      </View>

      {/* Método de pago */}
      <View style={styles.section}>
        <Text style={styles.label}>Cash/Wallet</Text>
        <Text style={styles.total}>$5.53</Text>
      </View>

      {/* Botón ordenar */}
      <TouchableOpacity style={styles.orderButton} onPress={() => navigation.navigate('Delivery')}>
        <Text style={styles.orderText}>Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  toggle: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: '#c67c4e',
    borderColor: '#c67c4e',
  },
  activeText: { color: '#fff', fontWeight: 'bold' },
  inactiveText: { color: '#555' },
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  address: { color: '#444', marginBottom: 4 },
  editRow: { flexDirection: 'row', justifyContent: 'space-between' },
  edit: { color: '#c67c4e', fontWeight: '500' },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  productImage: { width: 50, height: 50, borderRadius: 10 },
  productName: { fontWeight: 'bold' },
  productType: { color: '#888' },
  quantity: { marginLeft: 'auto', fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  total: { fontWeight: 'bold', fontSize: 16 },
  totalLabel: { fontWeight: 'bold' },
  orderButton: {
    backgroundColor: '#c67c4e',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
