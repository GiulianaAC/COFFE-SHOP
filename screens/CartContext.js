import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (item, size = 'M') => {
    setCart((prev) => [...prev, { ...item, selectedSize: size }]);
  };

  const decreaseFromCart = (item, size = 'M') => {
    const index = cart.findIndex(
      (i) => i.id === item.id && i.selectedSize === size
    );
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const removeAllFromCart = (item, size = 'M') => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.id === item.id && i.selectedSize === size)
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseFromCart,
        removeAllFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
