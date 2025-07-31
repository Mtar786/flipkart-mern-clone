import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const stored = localStorage.getItem('shippingAddress');
    return stored ? JSON.parse(stored) : {};
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const stored = localStorage.getItem('paymentMethod');
    return stored ? stored : 'PayPal';
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem('paymentMethod', paymentMethod);
  }, [paymentMethod]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const exist = prevItems.find((x) => x.product === item.product);
      if (exist) {
        return prevItems.map((x) => (x.product === exist.product ? item : x));
      } else {
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, shippingAddress, setShippingAddress, paymentMethod, setPaymentMethod, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};