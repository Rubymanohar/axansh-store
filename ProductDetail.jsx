import React, { useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, MapPin, Truck, ChevronRight, ShieldCheck, ShoppingCart, CreditCard } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { LanguageContext } from '../context/LanguageContext';

export default function ProductDetail({ products }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { t } = useContext(LanguageContext);

  const product = products.find(p => String(p.id) === String(id));
  const isAffiliate = product?.productType?.toLowerCase() === 'affiliate';
  const rawLink = product?.affiliateLink || product?.affiliatelink || 'https://amazon.in';
  const affiliateUrl = rawLink.startsWith('http') ? rawLink : `https://${rawLink}`;
  
  let partnerName = 'Partner';
  if (product) {
    if (affiliateUrl.toLowerCase().includes('amazon')) {
      partnerName = 'Amazon';
    } else if (affiliateUrl.toLowerCase().includes('flipkart')) {
      partnerName = 'Flipkart';
    } else if (affiliateUrl.toLowerCase().includes('meesho')) {
      partnerName = 'Meesho';
    }
  }
  const affiliateBtnText = `Buy Now on ${partnerName}`;

  const [selectedSize] = useState(product && product.sizes ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  const mainImageRef = useRef(null);
  const allImages = product && product.images && product.images.length > 0 ? product.images : (product && product.image ? [product.image] : []);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleMainImageScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      if (index !== activeImageIndex && index >= 0 && index < allImages.length) {
        setActiveImageIndex(index);
      }
    }
  };

  const handleThumbnailClick = (idx) => {
    setActiveImageIndex(idx);
    if (mainImageRef.current) {
      const width = mainImageRef.current.offsetWidth;
      mainImageRef.current.scrollTo({
        left: idx * width,
        behavior: 'smooth'
      });
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#ff2d55] border-t-transparent" />
        <p className="text-sm font-semibold text-gray-500">{t('title_product_detail')}...</p>
      </div>
    );
  }

  const sellPrice = product.discountPrice || product.price;
  const originalPrice = product.price;
  const discountPercent = originalPrice > sellPrice 
    ? Math.round(((originalPrice - sellPrice) / originalPrice) * 100) 
    : 0;



  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    showToast(t('added_to_cart_toast'));
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    navigate('/checkout');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const isLiked = isInWishlist(product.id);

  return (
    <div className="w-full px-3 pt-[52px] pb-20 font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[2000] bg-gray-900 text-white px-5 py-3 rounded-lg text-xs font-bold shadow-2xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#03a685] animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* Grid wrapper */}
      <div className="flex flex-col gap-4">
        
        {/* Left Side: Product Images Stack */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] w-full">
            {/* Scroll snap container */}
            <div 
              ref={mainImageRef}
              onScroll={handleMainImageScroll}
              className="w-full h-full bg-[#fafafc] border-b border-gray-100 overflow-x-auto snap-x snap-mandatory flex no-scrollbar"
              style={{ scrollBehavior: 'smooth' }}
            >
              {allImages.map((img, i) => (
                <div key={i} className="w-full h-full shrink-0 snap-center p-0 flex items-center justify-center">
                  <img
                    src={img}
                    alt={`${product.title} view ${i + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-2.5 bg-white shadow-md border border-gray-100 rounded-full text-gray-400 hover:text-[#ff2d55] z-10"
              aria-label="Wishlist"
            >
              <Heart size={20} className={isLiked ? "fill-[#ff2d55] text-[#ff2d55]" : "text-gray-400"} />
            </button>

            {/* Slide Index Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-gray-900/60 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider z-10">
                {activeImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
          
          {/* Thumbnails grid */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => handleThumbnailClick(i)}
                className={`w-16 h-16 bg-[#fafafc] rounded-lg p-1.5 cursor-pointer shadow-sm transition-all border-2 shrink-0 ${
                  activeImageIndex === i
                    ? 'border-[#ff2d55]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={img} alt={`product thumbnail ${i + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Details Column */}
        <div className="space-y-4">
          
          {/* Product Header Card */}
          <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-grow">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.brand || 'Supplier Store'}</p>
                <h1 className="text-base md:text-lg font-semibold text-gray-700 mt-1 leading-snug">{product.title}</h1>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline flex-wrap gap-2 pt-1">
              <span className="text-2xl font-black text-gray-900">₹{sellPrice}</span>
              {originalPrice > sellPrice && (
                <>
                  <span className="text-xs text-gray-400 line-through font-bold">₹{originalPrice}</span>
                  <span className="text-xs text-[#03a685] font-black">{t('off_percent', { percent: discountPercent })}</span>
                </>
              )}
            </div>

            {/* Ratings & Review summary */}
            <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
              <div className="flex items-center gap-0.5 bg-[#03a685] text-white px-1.5 py-0.5 rounded text-[10px] font-black">
                <span>{product.rating || '4.1'}</span>
                <Star size={9} className="fill-white text-white" />
              </div>
              <span className="text-xs text-gray-400 font-bold">
                {t('ratings_reviews_summary', { rating: product.rating || '4.1', reviews: product.reviewCount || '45' })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-[#f8f9fa] p-2.5 rounded-lg border border-gray-100">
              <span className="bg-[#03a685]/10 text-[#03a685] text-[9px] font-black px-1.5 py-0.5 rounded uppercase">FREE</span>
              <span>Fast & Free Delivery</span>
            </div>

          </div>

          {/* Quantity Selector Card */}
          {!isAffiliate && (
            <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-sm flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">{t('select_qty')}</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-9 h-full bg-gray-50 text-gray-700 hover:bg-gray-100 font-bold flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-10 text-center text-xs font-bold text-gray-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  className="w-9 h-full bg-gray-50 text-gray-700 hover:bg-gray-100 font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          )}



          {/* Supplier Info Card */}
          <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#ff2d55] text-sm font-bold border border-gray-200 shadow-inner">
                {product.brand?.charAt(0) || 'S'}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-800">{product.brand || 'Premium Reseller'}</h3>
                <p className="text-[10px] text-[#03a685] font-bold mt-0.5 flex items-center gap-0.5">
                  {t('supplier_rating_label', { rating: product.rating || '4.0' })}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={`px-4 py-1.5 border border-[#ff2d55] rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${
                isFollowing 
                  ? 'bg-[#ff2d55] text-white hover:bg-[#d81b43]' 
                  : 'text-[#ff2d55] hover:bg-[#ff2d55]/5'
              }`}
            >
              {isFollowing ? t('following_btn', { defaultValue: 'Following' }) : t('follow_shop_btn')}
            </button>
          </div>

        </div>

      </div>

      {/* Product Details Explainer */}
      <div className="mt-8 bg-white border border-gray-150 rounded-xl p-4 shadow-sm space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">{t('product_desc_header')}</h2>
        <div className="text-xs text-gray-600 space-y-2 font-medium leading-relaxed">
          <p><strong>{t('product_desc_name')}</strong> {product.title}</p>
          <p><strong>{t('product_desc_brand')}</strong> {product.brand || 'Axansh'}</p>
          <p><strong>{t('product_desc_fabric')}</strong> Cotton Blend / Premium Threadwork</p>
          <p><strong>{t('product_desc_color')}</strong> Multi Color</p>
          <p><strong>{t('product_desc_origin')}</strong> {t('product_desc_origin_val')}</p>
          <p className="pt-2 text-gray-400 leading-normal">
            {product.description || "Top-rated catalog item. Resell and earn margin easily on this high quality Meesho product selection. Delivered with 100% safe packaging and direct supplier dispatch channels."}
          </p>
        </div>
      </div>

      {/* Safety Strip */}
      <div className="mt-4 bg-[#e6f6f2] border border-[#a3e2cf] rounded-xl p-3 flex items-center gap-3 justify-center shadow-sm text-center">
        <ShieldCheck size={20} className="text-[#03a685] shrink-0" />
        <span className="text-[11px] font-bold text-[#03a685] leading-snug">
          {isAffiliate 
            ? t('safety_guarantee_text')
            : "100% Safe Payments • Direct Refunds • Easy Returns & Exchanges"}
        </span>
      </div>

      {/* Review Ratings List */}
      <div className="mt-8 bg-white border border-gray-150 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">{t('product_reviews_header')}</h2>
          <span className="text-xs text-[#ff2d55] font-bold cursor-pointer hover:underline">{t('write_review_btn')}</span>
        </div>
        <div className="divide-y divide-gray-100">
          {(() => {
            const genericReviews = [
              { name: 'Ramesh Kumar', initial: 'R', rating: '5.0', text: 'Excellent quality and exactly as described. Value for money. Will definitely buy again.' },
              { name: 'Pooja Sharma', initial: 'P', rating: '4.0', text: 'Same as shown in picture. Color is very bright and material is soft.' },
              { name: 'Amit Singh', initial: 'A', rating: '5.0', text: 'Absolutely love it! The quality is top notch and it looks premium.' },
              { name: 'Sneha Patel', initial: 'S', rating: '4.5', text: 'Good product. Packaging was safe and delivery was fast. Highly recommended.' },
              { name: 'Vikram Reddy', initial: 'V', rating: '5.0', text: 'Five stars! Exceeded my expectations in every way.' },
              { name: 'Neha Gupta', initial: 'N', rating: '4.0', text: 'It is decent for the price. Very useful and looks exactly like the photos.' },
              { name: 'Rahul Desai', initial: 'R', rating: '4.5', text: 'Satisfied with the purchase. Matches the description well.' },
              { name: 'Anjali Verma', initial: 'A', rating: '5.0', text: 'Beautiful! I got so many compliments after buying this.' }
            ];
            const pId = String(product.id).charCodeAt(0) + (String(product.id).charCodeAt(1) || 0);
            const numReviews = (pId % 3) + 2; 
            const productReviews = [];
            for (let i = 0; i < numReviews; i++) {
              productReviews.push(genericReviews[(pId + i * 3) % genericReviews.length]);
            }
            return productReviews.map((rev, idx) => (
              <div key={idx} className="py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-[9px] font-bold">{rev.initial}</span>
                    <span className="text-xs font-bold text-gray-800">{rev.name}</span>
                  </div>
                  <div className="flex items-center gap-0.5 bg-[#03a685] text-white px-1 py-0.5 rounded text-[8px] font-bold">
                    <span>{rev.rating}</span>
                    <Star size={7} className="fill-white text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-semibold leading-snug">{rev.text}</p>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Mobile Sticky Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 z-[990] grid grid-cols-2 gap-3 shadow-2xl max-w-[480px] mx-auto">
        {isAffiliate ? (
          <button
            onClick={() => window.open(affiliateUrl, '_blank', 'noopener,noreferrer')}
            className="col-span-2 py-3 bg-[#ff2d55] hover:bg-[#d81b43] text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md"
          >
            <CreditCard size={14} /> {affiliateBtnText}
          </button>
        ) : (
          <>
            <button
              onClick={handleAddToCart}
              className="py-3 border border-[#ff2d55] text-[#ff2d55] rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
            >
              <ShoppingCart size={14} /> {t('add_to_cart_btn')}
            </button>
            <button
              onClick={handleBuyNow}
              className="py-3 bg-[#ff2d55] text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
            >
              <CreditCard size={14} /> {t('buy_now_btn')}
            </button>
          </>
        )}
      </div>

    </div>
  );
}
