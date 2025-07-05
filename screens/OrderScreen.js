import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Modal, Pressable, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const sedes = ['Surco, Lima', 'Miraflores, Lima', 'Barranco, Lima'];

export default function OrderScreen() {
  const { cart, addToCart, decreaseFromCart, removeAllFromCart } = useCart();
  const [sede, setSede] = useState(sedes[0]);
  const [sedeModalVisible, setSedeModalVisible] = useState(false);
  
  // Estados para tabs de entrega
  const [selectedTab, setSelectedTab] = useState('Deliver'); // NUEVO: Estado para manejar tab seleccionado
  
  // Estados para el modal de pago
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

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

  // NUEVO: Función para generar número de orden aleatorio
  const generateOrderNumber = () => {
    return Math.floor(1000 + Math.random() * 9000); // Genera número entre 1000-9999
  };

  // Función para formatear número de tarjeta
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  // Función para formatear fecha de expiración
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // MODIFICADO: Función para confirmar pago con diferentes mensajes según el tipo
  const handleConfirmPayment = () => {
    if (selectedTab === 'Pick Up') {
      // Para Pick Up: mostrar número de orden
      const orderNumber = generateOrderNumber();
      Alert.alert(
        '✅ Pago Efectuado',
        `Su pedido se encuentra confirmado!\n\n🏪 Número de orden para recojo: ${orderNumber}\n\nPuede recoger su pedido en la sede seleccionada.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpiar campos
              setCardNumber('');
              setExpiryDate('');
              setCvv('');
              setCardholderName('');
              // Cerrar modal
              setPaymentModalVisible(false);
            },
          },
        ]
      );
    } else {
      // Para Delivery: mensaje normal
      Alert.alert(
        '✅ Pago Efectuado',
        'Su pedido se encuentra confirmado!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpiar campos
              setCardNumber('');
              setExpiryDate('');
              setCvv('');
              setCardholderName('');
              // Cerrar modal
              setPaymentModalVisible(false);
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* MODIFICADO: Tabs con estado dinámico */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={selectedTab === 'Deliver' ? styles.tabActive : styles.tabInactive}
          onPress={() => setSelectedTab('Deliver')}
        >
          <Text style={selectedTab === 'Deliver' ? styles.tabTextActive : styles.tabTextInactive}>
            Deliver
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={selectedTab === 'Pick Up' ? styles.tabActive : styles.tabInactive}
          onPress={() => setSelectedTab('Pick Up')}
        >
          <Text style={selectedTab === 'Pick Up' ? styles.tabTextActive : styles.tabTextInactive}>
            Pick Up
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODIFICADO: Sede con texto dinámico según el tipo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedTab === 'Pick Up' ? 'Sede de recojo' : 'Sede de despacho'}
        </Text>
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

      {/* MODIFICADO: Resumen con costo de delivery condicional */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text>Price</Text>
          <Text>${getTotal().toFixed(2)}</Text>
        </View>
        {selectedTab === 'Deliver' && (
          <View style={styles.summaryRow}>
            <Text>Delivery Fee</Text>
            <Text>$1.00</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={{ fontWeight: 'bold' }}>Total</Text>
          <Text style={{ fontWeight: 'bold' }}>
            ${selectedTab === 'Deliver' ? (getTotal() + 1).toFixed(2) : getTotal().toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Botón de pagar */}
      <TouchableOpacity 
        style={styles.orderButton}
        onPress={() => setPaymentModalVisible(true)}
      >
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

      {/* Modal de pago */}
      <Modal visible={paymentModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💳 Datos de Pago</Text>
            
            {/* NUEVO: Indicador del tipo de servicio */}
            <View style={styles.serviceIndicator}>
              <Text style={styles.serviceText}>
                {selectedTab === 'Pick Up' ? '🏪 Recojo en tienda' : '🚚 Entrega a domicilio'}
              </Text>
            </View>
            
            {/* Número de tarjeta */}
            <Text style={styles.inputLabel}>Número de Tarjeta</Text>
            <TextInput
              style={styles.paymentInput}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#aaa"
              value={cardNumber}
              onChangeText={(text) => {
                const formatted = formatCardNumber(text);
                if (formatted.replace(/\s/g, '').length <= 16) {
                  setCardNumber(formatted);
                }
              }}
              keyboardType="numeric"
              maxLength={19}
            />

            {/* Nombre del titular */}
            <Text style={styles.inputLabel}>Nombre del Titular</Text>
            <TextInput
              style={styles.paymentInput}
              placeholder="Juan Pérez García"
              placeholderTextColor="#aaa"
              value={cardholderName}
              onChangeText={setCardholderName}
              autoCapitalize="words"
            />

            {/* Fecha de expiración y CVV en la misma fila */}
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Fecha</Text>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="MM/YY"
                  placeholderTextColor="#aaa"
                  value={expiryDate}
                  onChangeText={(text) => {
                    const formatted = formatExpiryDate(text);
                    if (formatted.length <= 5) {
                      setExpiryDate(formatted);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="123"
                  placeholderTextColor="#aaa"
                  value={cvv}
                  onChangeText={(text) => {
                    if (text.length <= 3) {
                      setCvv(text);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry={true}
                />
              </View>
            </View>

            {/* Información de seguridad */}
            <Text style={styles.securityText}>
              🔒 Tus datos están protegidos
            </Text>

            {/* Botones */}
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setPaymentModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.confirmButton}
                onPress={handleConfirmPayment}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  tabs: { flexDirection: 'row', marginBottom: 16, marginTop: 25 }, 
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
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 20 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 20,
    maxHeight: '80%'
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center'
  },
  sedeOption: { fontSize: 16, paddingVertical: 6 },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#c67c4e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  // Nuevos estilos para el modal de pago
  serviceIndicator: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5a2d',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  paymentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#c67c4e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
