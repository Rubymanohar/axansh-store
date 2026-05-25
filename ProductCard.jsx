import React, { memo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { LanguageContext } from '../context/LanguageContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { t } = useContext(LanguageContext);

  const sellPrice = product.discountPrice || product.price;
  const originalPrice = product.price;
  const discountPercent = originalPrice > sellPrice 
    ? Math.round(((originalPrice - sellPrice) / originalPrice) * 100) 
    : 0;

  const isLiked = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="group flex flex-col h-full bg-white rounded-xl overflow-hidden cursor-pointer shadow-meesho hover:shadow-meesho-hover transition-all duration-200 border border-gray-100 relative"
    >
      {/* Wishlist Button Overlay */}
      <button
        type="button"
        onClick={handleWishlistClick}
        className="absolute top-2 right-2 z-10 w-7.5 h-7.5 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-gray-400 hover:text-[#ff2d55] hover:bg-white active:scale-90 transition-all border border-gray-100"
        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart 
          size={14} 
          className={isLiked ? "fill-[#ff2d55] text-[#ff2d55]" : "text-gray-400"} 
        />
      </button>

      {/* Product Image */}
      <div className="relative aspect-[4/5] bg-[#fafafc] p-0 flex items-center justify-center overflow-hidden shrink-0 border-b border-gray-50">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-250"
        />
        
        {/* M-Trusted Tag */}
        {product.isTrusted && (
          <div className="absolute bottom-2 left-2 bg-[#03a685] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
            M-Trusted
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-3 flex flex-col flex-grow justify-between gap-1">
        <div>
          {/* Brand/Supplier name */}
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 truncate">
            {product.brand || 'Supplier Shop'}
          </div>

          {/* Title */}
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-xs font-semibold text-gray-600 line-clamp-2 leading-snug min-h-[32px] group-hover:text-[#ff2d55] transition-colors flex-grow">
              {product.title}
            </h3>
          </div>
          
          {/* Pricing Row */}
          <div className="flex items-baseline flex-wrap gap-x-1.5 gap-y-0.5 mt-1.5">
            <span className="text-sm font-black text-gray-900">
              ₹{sellPrice.toLocaleString()}
            </span>
            {originalPrice > sellPrice && (
              <>
                <span className="text-[10px] text-gray-400 line-through font-bold">
                  ₹{originalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#03a685] font-black">
                  {t('off_percent', { percent: discountPercent })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Badges / Ratings */}
        <div className="pt-1.5 border-t border-gray-50 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-[#03a685] text-white px-1 py-0.5 rounded text-[9px] font-black">
              <span>{product.rating || '4.0'}</span>
              <Star size={7} className="fill-white text-white" />
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">
              {t('reviews', { count: product.reviewCount || '10' })}
            </span>
          </div>

          {/* Delivery & Assurance Tags */}
          <div className="flex items-center justify-between mt-1">
            <span className="text-[9px] text-[#03a685] font-black bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase">
              {t('assurance_delivery_title')}
            </span>
            {product.lowestPrice && (
              <span className="text-[9px] text-[#ff2d55] font-black uppercase tracking-wider animate-pulse">
                {t('assurance_price_title')}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default memo(ProductCard);
