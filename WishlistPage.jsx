import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from './ProductCard';
import SEO from './SEO';
import { LanguageContext } from '../context/LanguageContext';

export default function WishlistPage({ products = [], loading = false }) {
  const navigate = useNavigate();
  const { wishlist } = useContext(WishlistContext);
  const { t } = useContext(LanguageContext);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-[52px] pb-20 font-sans text-gray-800">
      <SEO 
        title="My Wishlist | Meesho Clone"
        description="View your saved products and favorite items on Meesho Clone."
      />

      <div className="max-w-[1000px] mx-auto px-3">


        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-150 h-64 animate-pulse p-3 flex flex-col justify-between">
                <div className="bg-gray-100 w-full h-36 rounded-lg" />
                <div className="space-y-2">
                  <div className="bg-gray-100 h-3 w-3/4 rounded" />
                  <div className="bg-gray-100 h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-150 p-6 space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-[#ff2d55] shadow-inner">
              <Heart size={30} />
            </div>
            <h2 className="text-sm font-bold text-gray-700">{t('wishlist_empty')}</h2>
            <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
              {t('wishlist_empty_desc')}
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-[#ff2d55] text-white px-8 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#d81b43] transition-colors shadow-md"
            >
              {t('discover_products_btn')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
