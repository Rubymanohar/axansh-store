import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'framer-motion';

// Shell & Layout
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import SEO from './components/SEO';

// View Imports
import HomePage from './components/HomePage';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import TrackOrder from './components/TrackOrder';

import Categories from './components/Categories';
import AccountPage from './components/AccountPage';
import StaticPage from './components/StaticPage';
import DealsPage from './components/DealsPage';

// Services
import DataService from './services/DataService';

// Dynamic Google Sheets Products


const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.99, 
    transition: { duration: 0.2 } 
  }
};

function AnimatedRoutes({ products, searchQuery, setSearchQuery, loading, activeCategory, setActiveCategory }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage products={products} searchQuery={searchQuery} setSearchQuery={setSearchQuery} loading={loading} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/wishlist" element={<WishlistPage products={products} />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/categories" element={<Categories products={products} />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/policy/:type" element={<StaticPage />} />
          <Route path="/support" element={<StaticPage type="support" />} />
        </Routes>
      </Motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const location = useLocation();

  useEffect(() => {
    let active = true;
    DataService.getProducts()
      .then((data) => {
        if (active) {
          setProducts(data);
          setLoadingProducts(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        if (active) {
          setLoadingProducts(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const minimalChrome = ['/checkout', '/success'].includes(location.pathname);
  const isProductPage = location.pathname.startsWith('/product/');
  const hideHeader = minimalChrome;
  const hideBottomNav = minimalChrome || isProductPage;

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans antialiased max-w-[480px] mx-auto shadow-2xl relative border-x border-gray-200/50 flex flex-col">
      <SEO />
      
      {!hideHeader && (
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          products={products}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}

      <main className="w-full flex-grow">
        <AnimatedRoutes
          products={products}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loading={loadingProducts}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </main>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
