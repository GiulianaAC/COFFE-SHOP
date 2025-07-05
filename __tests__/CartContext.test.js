import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CartProvider, useCart } from '../screens/CartContext';
import { View, Text, TouchableOpacity } from 'react-native';

// Componente de prueba que usa el contexto del carrito
const TestComponent = () => {
  const { cart, addToCart, decreaseFromCart, removeAllFromCart } = useCart();
  
  return (
    <View>
      <Text testID="cart-count">{cart.length}</Text>
      <Text testID="cart-items">{JSON.stringify(cart)}</Text>
      <TouchableOpacity 
        testID="add-button"
        onPress={() => addToCart({ id: 1, name: 'Café Americano', price: 5.00 }, 'M')}
      >
        <Text>Agregar</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        testID="decrease-button"
        onPress={() => decreaseFromCart({ id: 1, name: 'Café Americano', price: 5.00 }, 'M')}
      >
        <Text>Disminuir</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        testID="remove-all-button"
        onPress={() => removeAllFromCart({ id: 1, name: 'Café Americano', price: 5.00 }, 'M')}
      >
        <Text>Eliminar Todo</Text>
      </TouchableOpacity>
    </View>
  );
};

const renderWithProvider = (component) => {
  return render(
    <CartProvider>
      {component}
    </CartProvider>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe inicializar con un carrito vacío', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    expect(getByTestId('cart-count')).toHaveTextContent('0');
    expect(getByTestId('cart-items')).toHaveTextContent('[]');
  });

  test('debe agregar un item al carrito', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    fireEvent.press(getByTestId('add-button'));

    expect(getByTestId('cart-count')).toHaveTextContent('1');
    
    const cartItems = JSON.parse(getByTestId('cart-items').props.children);
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0]).toMatchObject({
      id: 1,
      name: 'Café Americano',
      price: 5.00,
      selectedSize: 'M'
    });
  });

  test('debe agregar múltiples items del mismo producto', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    fireEvent.press(getByTestId('add-button'));
    fireEvent.press(getByTestId('add-button'));

    expect(getByTestId('cart-count')).toHaveTextContent('2');
  });

  test('debe disminuir un item específico del carrito', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    // Agregar dos items
    fireEvent.press(getByTestId('add-button'));
    fireEvent.press(getByTestId('add-button'));
    
    expect(getByTestId('cart-count')).toHaveTextContent('2');
    
    // Disminuir uno
    fireEvent.press(getByTestId('decrease-button'));
    
    expect(getByTestId('cart-count')).toHaveTextContent('1');
  });

  test('debe eliminar todos los items de un tipo específico', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    // Agregar tres items del mismo tipo
    fireEvent.press(getByTestId('add-button'));
    fireEvent.press(getByTestId('add-button'));
    fireEvent.press(getByTestId('add-button'));
    
    expect(getByTestId('cart-count')).toHaveTextContent('3');
    
    // Eliminar todos
    fireEvent.press(getByTestId('remove-all-button'));
    
    expect(getByTestId('cart-count')).toHaveTextContent('0');
  });

  test('no debe fallar al disminuir items de un carrito vacío', () => {
    const { getByTestId } = renderWithProvider(<TestComponent />);
    
    fireEvent.press(getByTestId('decrease-button'));
    
    expect(getByTestId('cart-count')).toHaveTextContent('0');
  });

  test('debe manejar diferentes tamaños correctamente', () => {
    const TestSizes = () => {
      const { cart, addToCart, decreaseFromCart } = useCart();
      
      return (
        <View>
          <Text testID="cart-count">{cart.length}</Text>
          <Text testID="cart-items">{JSON.stringify(cart)}</Text>
          <TouchableOpacity 
            testID="add-small"
            onPress={() => addToCart({ id: 1, name: 'Café', price: 4.00 }, 'S')}
          >
            <Text>Agregar S</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            testID="add-medium"
            onPress={() => addToCart({ id: 1, name: 'Café', price: 5.00 }, 'M')}
          >
            <Text>Agregar M</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            testID="decrease-small"
            onPress={() => decreaseFromCart({ id: 1, name: 'Café', price: 4.00 }, 'S')}
          >
            <Text>Disminuir S</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const { getByTestId } = renderWithProvider(<TestSizes />);
    
    // Agregar items de diferentes tamaños
    fireEvent.press(getByTestId('add-small'));
    fireEvent.press(getByTestId('add-medium'));
    fireEvent.press(getByTestId('add-medium'));
    
    expect(getByTestId('cart-count')).toHaveTextContent('3');
    
    // Disminuir solo el pequeño
    fireEvent.press(getByTestId('decrease-small'));
    
    expect(getByTestId('cart-count')).toHaveTextContent('2');
    
    // Verificar que solo quedan los medianos
    const cartItems = JSON.parse(getByTestId('cart-items').props.children);
    expect(cartItems.every(item => item.selectedSize === 'M')).toBe(true);
  });

  test('debe usar el tamaño por defecto "M" cuando no se especifica', () => {
    const TestDefaultSize = () => {
      const { cart, addToCart } = useCart();
      
      return (
        <View>
          <Text testID="cart-items">{JSON.stringify(cart)}</Text>
          <TouchableOpacity 
            testID="add-without-size"
            onPress={() => addToCart({ id: 1, name: 'Café', price: 5.00 })}
          >
            <Text>Agregar sin tamaño</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const { getByTestId } = renderWithProvider(<TestDefaultSize />);
    
    fireEvent.press(getByTestId('add-without-size'));
    
    const cartItems = JSON.parse(getByTestId('cart-items').props.children);
    expect(cartItems[0].selectedSize).toBe('M');
  });
});
