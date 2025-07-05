import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FavoritesProvider, useFavorites } from '../screens/FavoritesContext';
import { View, Text, TouchableOpacity } from 'react-native';

// Componente de prueba que usa el contexto de favoritos
const TestComponent = () => {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  const testItem1 = { id: 1, name: 'Café Americano', price: 5.00 };
  const testItem2 = { id: 2, name: 'Café Latte', price: 6.50 };
  
  return (
    <View>
      <Text testID="favorites-count">{favorites.length}</Text>
      <Text testID="favorites-items">{JSON.stringify(favorites)}</Text>
      <Text testID="is-favorite-1">{isFavorite(1) ? 'true' : 'false'}</Text>
      <Text testID="is-favorite-2">{isFavorite(2) ? 'true' : 'false'}</Text>
      
      <TouchableOpacity 
        testID="add-favorite-1"
        onPress={() => addFavorite(testItem1)}
      >
        <Text>Agregar Favorito 1</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        testID="add-favorite-2"
        onPress={() => addFavorite(testItem2)}
      >
        <Text>Agregar Favorito 2</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        testID="remove-favorite-1"
        onPress={() => removeFavorite(1)}
      >
        <Text>Eliminar Favorito 1</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        testID="remove-favorite-2"
        onPress={() => removeFavorite(2)}
      >
        <Text>Eliminar Favorito 2</Text>
      </TouchableOpacity>
    </View>
  );
};

const renderWithProvider = (component) => {
  return render(
    <FavoritesProvider>
      {component}
    </FavoritesProvider>
  );
};

describe('FavoritesContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe inicializar con una lista de favoritos vacía', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    expect(getByTestId('favorites-count')).toHaveTextContent('0');
    expect(getByTestId('favorites-items')).toHaveTextContent('[]');
    expect(getByTestId('is-favorite-1')).toHaveTextContent('false');
    expect(getByTestId('is-favorite-2')).toHaveTextContent('false');
  });

  test('debe agregar un item a favoritos', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    fireEvent.press(getByTestId('add-favorite-1'));

    expect(getByTestId('favorites-count')).toHaveTextContent('1');
    expect(getByTestId('is-favorite-1')).toHaveTextContent('true');
    expect(getByTestId('is-favorite-2')).toHaveTextContent('false');
    
    const favoritesItems = JSON.parse(getByTestId('favorites-items').props.children);
    expect(favoritesItems).toHaveLength(1);
    expect(favoritesItems[0]).toMatchObject({
      id: 1,
      name: 'Café Americano',
      price: 5.00
    });
  });

  test('debe agregar múltiples items diferentes a favoritos', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    fireEvent.press(getByTestId('add-favorite-1'));
    fireEvent.press(getByTestId('add-favorite-2'));

    expect(getByTestId('favorites-count')).toHaveTextContent('2');
    expect(getByTestId('is-favorite-1')).toHaveTextContent('true');
    expect(getByTestId('is-favorite-2')).toHaveTextContent('true');
    
    const favoritesItems = JSON.parse(getByTestId('favorites-items').props.children);
    expect(favoritesItems).toHaveLength(2);
    expect(favoritesItems[0].id).toBe(1);
    expect(favoritesItems[1].id).toBe(2);
  });

  test('no debe agregar el mismo item dos veces a favoritos', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    // Agregar el mismo item dos veces
    fireEvent.press(getByTestId('add-favorite-1'));
    fireEvent.press(getByTestId('add-favorite-1'));

    // Debe seguir teniendo solo 1 item
    expect(getByTestId('favorites-count')).toHaveTextContent('1');
    expect(getByTestId('is-favorite-1')).toHaveTextContent('true');
    
    const favoritesItems = JSON.parse(getByTestId('favorites-items').props.children);
    expect(favoritesItems).toHaveLength(1);
  });

  test('debe eliminar un item de favoritos', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    // Primero agregar el item
    fireEvent.press(getByTestId('add-favorite-1'));
    expect(getByTestId('favorites-count')).toHaveTextContent('1');
    expect(getByTestId('is-favorite-1')).toHaveTextContent('true');
    
    // Luego eliminarlo
    fireEvent.press(getByTestId('remove-favorite-1'));
    expect(getByTestId('favorites-count')).toHaveTextContent('0');
    expect(getByTestId('is-favorite-1')).toHaveTextContent('false');
    expect(getByTestId('favorites-items')).toHaveTextContent('[]');
  });

  test('debe eliminar solo el item específico de favoritos', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    // Agregar ambos items
    fireEvent.press(getByTestId('add-favorite-1'));
    fireEvent.press(getByTestId('add-favorite-2'));
    expect(getByTestId('favorites-count')).toHaveTextContent('2');
    
    // Eliminar solo el item 1
    fireEvent.press(getByTestId('remove-favorite-1'));
    
    expect(getByTestId('favorites-count')).toHaveTextContent('1');
    expect(getByTestId('is-favorite-1')).toHaveTextContent('false');
    expect(getByTestId('is-favorite-2')).toHaveTextContent('true');
    
    const favoritesItems = JSON.parse(getByTestId('favorites-items').props.children);
    expect(favoritesItems).toHaveLength(1);
    expect(favoritesItems[0].id).toBe(2);
  });

  test('no debe fallar al eliminar un item que no existe en favoritos', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    // Intentar eliminar un item que no está en favoritos
    fireEvent.press(getByTestId('remove-favorite-1'));
    
    expect(getByTestId('favorites-count')).toHaveTextContent('0');
    expect(getByTestId('is-favorite-1')).toHaveTextContent('false');
    expect(getByTestId('favorites-items')).toHaveTextContent('[]');
  });

  test('isFavorite debe retornar false para items no existentes', () => {
    const TestNonExistentItem = () => {
      const { isFavorite } = useFavorites();
      
      return (
        <View>
          <Text testID="is-favorite-999">{isFavorite(999) ? 'true' : 'false'}</Text>
        </View>
      );
    };

    const { getByTestId } = renderWithProvider(<TestNonExistentItem />);
    
    expect(getByTestId('is-favorite-999')).toHaveTextContent('false');
  });

  test('debe manejar correctamente items con diferentes estructuras', () => {
    const TestDifferentItems = () => {
      const { favorites, addFavorite, isFavorite } = useFavorites();
      
      const complexItem = { 
        id: 3, 
        name: 'Café Especial', 
        price: 8.50, 
        description: 'Un café muy especial',
        category: 'Premium'
      };
      
      return (
        <View>
          <Text testID="favorites-count">{favorites.length}</Text>
          <Text testID="is-favorite-3">{isFavorite(3) ? 'true' : 'false'}</Text>
          <TouchableOpacity 
            testID="add-complex-item"
            onPress={() => addFavorite(complexItem)}
          >
            <Text>Agregar Item Complejo</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const { getByTestId } = renderWithProvider(<TestDifferentItems />);
    
    fireEvent.press(getByTestId('add-complex-item'));
    
    expect(getByTestId('favorites-count')).toHaveTextContent('1');
    expect(getByTestId('is-favorite-3')).toHaveTextContent('true');
  });

  test('debe mantener el orden de inserción de favoritos', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    // Agregar items en orden específico
    fireEvent.press(getByTestId('add-favorite-2')); // ID 2 primero
    fireEvent.press(getByTestId('add-favorite-1')); // ID 1 segundo
    
    const favoritesItems = JSON.parse(getByTestId('favorites-items').props.children);
    expect(favoritesItems).toHaveLength(2);
    expect(favoritesItems[0].id).toBe(2); // El primero que se agregó
    expect(favoritesItems[1].id).toBe(1); // El segundo que se agregó
  });
});