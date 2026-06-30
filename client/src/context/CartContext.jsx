import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Agar pehle se cart mein items hain toh localStorage se utha lo
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
  );

  // Jab bhi cartItems badle, use localStorage mein save kar do
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Cart mein item add karne ka function
  const addToCart = (product) => {
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      // Agar item pehle se hai, toh quantity badha do
      setCartItems(
        cartItems.map((x) =>
          x._id === product._id ? { ...existItem, qty: existItem.qty + 1 } : x
        )
      );
    } else {
      // Agar naya item hai, toh quantity 1 set karke add karo
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
    alert(`${product.name} added to cart! 🛒`);
  };

  // Cart se item remove karne ka function
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};