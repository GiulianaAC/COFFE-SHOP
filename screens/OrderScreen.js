import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './CartContext';

const sedes = ['Surco, Lima', 'Miraflores, Lima', 'Barranco, Lima'];

export default function OrderScreen() {
  const { cart, addToCart, decreaseFromCart, removeAllFromCart } = useCart();
  const [sede, setSede] = useState(sedes[0]);
  const [sedeModalVisible, setSedeModalVisible] = useState(false);

  // Agrupa por producto y tamaño
  const groupedItems = cart.reduce((acc, item) => {
    const key = `${item.id}_${item.selectedSize}`;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 1 };
    } else {
      acc[key].quantity += 1;
    }
    return acc;
  }, {});

  const items = Object.values(groupedItems);

  const getTotal = () => {
    const total = items.reduce((sum, item) => {
      const price = item.price[item.selectedSize] || Object.values(item.price)[0];
      return sum + price * item.quantity;
    }, 0);
    return total;
  };

  const increaseQuantity = (item) => {
  addToCart(item, item.selectedSize);
};

const decreaseQuantity = (item) => {
  decreaseFromCart(item, item.selectedSize);
};

const deleteItem = (item) => {
  removeAllFromCart(item, item.selectedSize);
};


  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Deliver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabInactive}>
          <Text style={styles.tabTextInactive}>Pick Up</Text>
        </TouchableOpacity>
      </View>

      {/* Sede */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sede de despacho</Text>
        <Text style={styles.sectionSubtitle}>{sede}</Text>
        <View style={styles.sedeActions}>
          <TouchableOpacity onPress={() => setSedeModalVisible(true)}>
            <Text style={styles.link}>Cambiar sede</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.id}_${item.selectedSize}`}
        renderItem={({ item }) => {
          const price = item.price[item.selectedSize] || Object.values(item.price)[0];
          return (
            <View style={styles.itemRow}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemType}>{item.type} • {item.selectedSize}</Text>
              </View>
              <View style={styles.quantityControls}>
                <TouchableOpacity onPress={() => decreaseQuantity(item)}>
                  <Ionicons name="remove-circle-outline" size={24} color="#c67c4e" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(item)}>
                  <Ionicons name="add-circle-outline" size={24} color="#c67c4e" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => deleteItem(item)} style={styles.deleteButton}>
                <Ionicons name="close" size={18} color="#999" />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Resumen */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text>Price</Text>
          <Text>${getTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Delivery Fee</Text>
          <Text>$1.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={{ fontWeight: 'bold' }}>Total</Text>
          <Text style={{ fontWeight: 'bold' }}>${(getTotal() + 1).toFixed(2)}</Text>
        </View>
      </View>

      {/* Pagar */}
      <TouchableOpacity style={styles.orderButton}>
        <Text style={styles.orderText}>Order</Text>
      </TouchableOpacity>

      {/* Modal de sede */}
      <Modal visible={sedeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una sede:</Text>
            {sedes.map((loc) => (
              <TouchableOpacity
                key={loc}
                onPress={() => {
                  setSede(loc);
                  setSedeModalVisible(false);
                }}
              >
                <Text style={styles.sedeOption}>{loc}</Text>
              </TouchableOpacity>
            ))}
            <Pressable
              style={styles.closeButton}
              onPress={() => setSedeModalVisible(false)}
            >
              <Text style={{ color: '#fff' }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  tabs: { flexDirection: 'row', marginBottom: 16 },
  tabActive: {
    flex: 1,
    backgroundColor: '#c67c4e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabInactive: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  tabTextActive: { color: '#fff', fontWeight: 'bold' },
  tabTextInactive: { color: '#999' },
  section: { marginBottom: 16 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16 },
  sectionSubtitle: { color: '#555', marginVertical: 4 },
  sedeActions: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { color: '#c67c4e', fontWeight: '500' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  itemName: { fontWeight: 'bold' },
  itemType: { color: '#777' },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: { marginHorizontal: 8, fontWeight: '500' },
  deleteButton: { marginLeft: 8 },
  summary: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12, marginTop: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  orderButton: {
    backgroundColor: '#c67c4e',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  orderText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  sedeOption: { fontSize: 16, paddingVertical: 6 },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#c67c4e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
