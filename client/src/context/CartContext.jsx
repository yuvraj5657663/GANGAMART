import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Cart Items State (LocalStorage Sync ke sath)
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
  );

  // 🔥 2. Nayi State: Shipping Address (LocalStorage Sync ke sath)
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}
  );

  // Cart items ko storage mein save rakhne ke liye
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // 🔥 3. Shipping Address ko storage mein save rakhne ke liye useEffect
  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  const addToCart = (product) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === product._id ? { ...existItem, qty: (existItem.qty || 1) + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  // Quantity badhane aur ghatane ke liye function
  const updateQty = (id, newQty) => {
    if (newQty < 1) return; // 1 se kam nahi hone dega
    setCartItems(
      cartItems.map((item) => (item._id === id ? { ...item, qty: newQty } : item))
    );
  };

  // 🔥 4. Function: Shipping address save karne ke liye jo component se call hoga
  const saveShippingAddress = (data) => {
    setShippingAddress(data);
  };

  // 🔥 5. Function: Order place hone ke baad Cart crash free clear karne ke liye
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        shippingAddress, 
        addToCart, 
        removeFromCart, 
        updateQty, 
        saveShippingAddress,
        clearCart // 🔥 clearCart ko yahan pass kar diya taaki Shipping.jsx ise use kar sake
      }}
    >
      {children}
    </CartContext.Provider>
  );
};