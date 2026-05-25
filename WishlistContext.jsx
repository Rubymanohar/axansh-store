/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('axansh_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('axansh_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isInWishlist,
      getWishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
