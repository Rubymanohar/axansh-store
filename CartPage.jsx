import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, Lock, Truck } from 'lucide-react';
import SEO from './SEO';
import { LanguageContext } from '../context/LanguageContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const cart = cartItems || [];

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-[52px] pb-28 md:pb-16 font-sans text-gray-800">
      <SEO 
        title="Shopping Cart | Meesho Clone"
        description="Review items in your shopping bag and proceed to secure checkout."
      />

      <div className="max-w-[600px] mx-auto px-3">

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-150 p-6 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-[#ff2d55]">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-sm font-bold text-gray-700">{t('cart_empty_header')}</h2>
            <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
              {t('cart_empty_desc')}
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-[#ff2d55] text-white px-8 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#d81b43] transition-colors shadow-md"
            >
              {t('browse_products_btn')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Free Delivery Banner */}
            <div className="flex flex-col gap-2">
              <div className="bg-[#e6f6f2] border border-[#a3e2cf] rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#03a685] shrink-0">
                  <Truck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#03a685] leading-none">{t('assurance_delivery_title')}</h4>
                  <p className="text-[10px] text-gray-500 font-semibold mt-1">{t('cart_free_delivery_banner')}</p>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-150 p-3.5 rounded-xl flex gap-3.5 shadow-sm relative"
                >
                  {/* Product Image */}
                  <div 
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 p-1 cursor-pointer"
                  >
                    <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" alt={item.title} />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="text-xs font-bold text-gray-700 line-clamp-1 cursor-pointer hover:text-[#ff2d55]"
                      >
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        {t('size_label')} {item.size || 'Free Size'} • {t('supplier_label')} {item.brand || 'Supplier'}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-xs font-black text-gray-900">
                        ₹{(item.discountPrice || item.price) * item.quantity}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {/* Remove */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-md transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>

                        {/* Quantity controls */}
                        <div className="flex items-center border border-gray-250 rounded-lg overflow-hidden h-7 bg-gray-50">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            className="w-6.5 h-full flex items-center justify-center hover:bg-gray-150 text-gray-750 font-bold"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="px-2 font-bold text-xs text-gray-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="w-6.5 h-full flex items-center justify-center hover:bg-gray-150 text-gray-750 font-bold"
                            aria-label="Increase quantity"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Details */}
            <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-sm space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-1.5">{t('price_details_header')}</h3>
              
              <div className="space-y-2 text-xs font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>{t('product_total_label')}</span>
                  <span className="text-gray-900">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('delivery_charges_label')}</span>
                  <span className="text-[#03a685] font-black uppercase tracking-wider">FREE</span>
                </div>
                <div className="border-t border-dashed border-gray-250 pt-2.5 flex justify-between text-sm font-black text-gray-900">
                  <span>{t('total_amount_label')}</span>
                  <span className="text-gray-900">₹{getCartTotal()}</span>
                </div>
              </div>
            </div>

            {/* Desktop Checkout button */}
            <div className="hidden md:block pt-2">
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#ff2d55] hover:bg-[#d81b43] text-white h-11 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-[#ff2d55]/15"
              >
                <Lock size={14} /> {t('proceed_checkout_btn')} (₹{getCartTotal()})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Action Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-3 py-2.5 shadow-2xl md:hidden flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t('total_text')}</span>
            <span className="text-sm font-black text-gray-900">₹{getCartTotal()}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="flex-1 bg-[#ff2d55] hover:bg-[#d81b43] text-white h-11 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Lock size={13} /> {t('proceed_checkout_btn')}
          </button>
        </div>
      )}
    </div>
  );
}
