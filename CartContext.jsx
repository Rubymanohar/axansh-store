/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('axansh_cart_meesho');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('axansh_cart_meesho', JSON.stringify(cartItems));
  }, [cartItems]);

  // Adds product to cart, taking size into account
  const addToCart = (product, quantity = 1, size = 'Free Size') => {
    if (product.productType?.toLowerCase() === 'affiliate') {
      console.warn("Affiliate products cannot be added to cart.");
      return;
    }
    setCartItems((prevItems) => {
      // Find item with same ID AND same size
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity, size }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === productId && (!size || item.size === size)))
    );
  };

  const updateQuantity = (productId, size, change) => {
    let actualSize = size;
    let actualChange = change;
    if (typeof size === 'number') {
      actualChange = size;
      actualSize = undefined;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId && (!actualSize || item.size === actualSize)) {
          const newQty = Math.max(1, item.quantity + actualChange);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
