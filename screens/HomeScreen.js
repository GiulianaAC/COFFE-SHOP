import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



const allCoffees = [
  {
  id: '1',
  name: 'Caffe Mocha',
  type: 'Macchiato',
  image: require('../assets/mocha.jpg'),
  description: 'A delicious blend of espresso, chocolate, and milk.',
  tags: ['Caliente', 'Café'],
  hasSize: true,
  icons: ['delivery', 'milk', 'coffee'],
  price: {
    S: 3.50,
    M: 4.50,
    L: 5.20
  }
},

  {
    id: '2',
    name: 'Flat White',
    type: 'Latte',
    image: require('../assets/flatwhite.jpg'),
    description: 'Smooth Flat White made with rich espresso and velvety milk.',
    tags: ['Caliente', 'Café'],
    hasSize: true,
  icons: ['delivery', 'milk', 'coffee'],
  price: {
    S: 3.53,
    M: 4.60,
    L: 5.30
  }
  },
  {
    id: '3',
    name: 'Matcha Latte',
    type: 'Americano',
    image: require('../assets/matcha.jpg'),
    description: 'Refreshing Matcha Latte with premium green tea and milk.',
    tags: ['Frío', 'Mate'],
    hasSize: true,
  icons: ['delivery', 'milk', 'coffee'],
  price: {
    S: 4.00,
    M: 5.45,
    L: 6.50
  }
  },
   {
  id: '4',
  name: 'Brownie',
  type: 'Postre',
  price: {
  M: 2.50
},
  image: require('../assets/brownie.jpg'),
  description: 'Delicious chocolate brownie perfect for your coffee break.',
  tags: ['Postres'],
  hasSize: false,
  icons: ['delivery'],
},
    
];

const sedes = ['Surco, Lima', 'Miraflores, Lima', 'Barranco, Lima'];
const filtrosDisponibles = ['Frío', 'Caliente', 'Café', 'Mate', 'Postres'];
const categorias = ['All Coffee', 'Macchiato', 'Latte', 'Americano'];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sede, setSede] = useState(sedes[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [sedeModalVisible, setSedeModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Coffee');


  
  const toggleFilter = (tag) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredCoffees = allCoffees.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());
    const matchTags =
      selectedFilters.length === 0 ||
      selectedFilters.every((filter) => item.tags.includes(filter));
    const matchCategory =
      activeCategory === 'All Coffee' || item.type === activeCategory;
    return matchSearch && matchTags && matchCategory;
  });

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSedeModalVisible(true)}>
          <Text style={styles.label}>Sede</Text>
          <Text style={styles.location}>{sede}</Text>
        </TouchableOpacity>

        <View style={styles.searchRow}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Buscar café"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
            <Ionicons name="options" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner */}
      <ImageBackground
        source={require('../assets/promo.png')}
        style={styles.banner}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerPromo}>Promo</Text>
          <Text style={styles.bannerText}>Por tu compra{'\n'}un café GRATIS</Text>
        </View>
      </ImageBackground>

      {/* Filtros de categoría */} 
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.filterRow}
  contentContainerStyle={{ paddingVertical: 0 }}
>
  {categorias.map((cat) => (
    <TouchableOpacity
      key={cat}
      onPress={() => setActiveCategory(cat)}
      style={[
        styles.filterPill,
        activeCategory === cat && styles.filterPillActive,
      ]}
    >
      <Text
        style={[
          styles.filterPillText,
          activeCategory === cat && styles.filterPillTextActive,
        ]}
      >
        {cat}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>


      {/* Lista de productos */}
      <FlatList
  data={filteredCoffees}
  keyExtractor={(item) => item.id}
  numColumns={2}
  columnWrapperStyle={{
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  }}
  style={{
    flex: 1,
    marginTop: 0,
  }}
  contentContainerStyle={{
    paddingTop: 0,
    paddingBottom: 20,
  }}
  ListHeaderComponent={() => null}
  ListEmptyComponent={
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#aaa' }}>No hay productos disponibles</Text>
    </View>
  }
  ListFooterComponent={<View style={{ height: 100 }} />}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('Detail', { coffee: item });
        }}
      >
        <Image source={item.image} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.type}</Text>
      </TouchableOpacity>

      <View style={styles.cardFooter}>
        <Text style={styles.price}>
          $
          {typeof item.price === 'number'
            ? item.price.toFixed(2)
            : (item.price.M ?? 0).toFixed(2)}
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('Detail', { coffee: item });
          }}
        >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
/>



      {/* Modal de filtros */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por:</Text>
            {filtrosDisponibles.map((tag) => (
              <TouchableOpacity key={tag} onPress={() => toggleFilter(tag)}>
                <Text style={[styles.filterOption, selectedFilters.includes(tag) && styles.filterActive]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={{ color: '#fff' }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal de sede */}
      <Modal visible={sedeModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una sede:</Text>
            {sedes.map((loc) => (
              <TouchableOpacity key={loc} onPress={() => { setSede(loc); setSedeModalVisible(false); }}>
                <Text style={styles.filterOption}>{loc}</Text>
              </TouchableOpacity>
            ))}
            <Pressable onPress={() => setSedeModalVisible(false)} style={styles.closeButton}>
              <Text style={{ color: '#fff' }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#1e1e1e',
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  label: { fontSize: 14, color: '#aaa' },
  location: { fontSize: 18, fontWeight: '600', color: '#fff', marginBottom: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: { flex: 1, color: '#fff' },
  filterButton: {
    backgroundColor: '#c67c4e',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  banner: {
    marginTop: 16,
    marginHorizontal: 16,
    height: 140,
    justifyContent: 'center',
    borderRadius: 16,
  },
  bannerOverlay: { paddingHorizontal: 20 },
  bannerPromo: {
    backgroundColor: 'red',
    color: '#fff',
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterRow: {
  marginTop: 16,
  marginBottom: 0,
  paddingHorizontal: 16,
  paddingVertical: 0,
},

  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#eee',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90, // fuerza un ancho uniforme
    height: 40,   // altura fija para que no se deforme
  },
  filterPillActive: {
    backgroundColor: '#c67c4e',
  },
  filterPillText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  filterPillTextActive: {
    color: '#fff',
  },
  
  card: {
    width: '47%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  cardImage: { width: '100%', height: 100, borderRadius: 10 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 8 },
  cardSubtitle: { color: '#777' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: { fontWeight: 'bold', fontSize: 16 },
  addButton: {
    backgroundColor: '#c67c4e',
    borderRadius: 8,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: { color: '#fff', fontSize: 20 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  filterOption: { fontSize: 16, paddingVertical: 6 },
  filterActive: { color: '#c67c4e', fontWeight: 'bold' },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#c67c4e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
