import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ShieldCheck, CheckCircle2, Truck, CreditCard, ShoppingBag, MapPin } from 'lucide-react';
import DataService from '../services/DataService';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const cartTotal = getCartTotal();

  const [address, setAddress] = useState({ name: '', phone: '', pincode: '', street: '', city: '', state: '' });
  const [addressSaved, setAddressSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [payId, setPayId] = useState('');
  const [step, setStep] = useState('checkout'); // 'checkout', 'success'

  useEffect(() => {
    try {
      const saved = localStorage.getItem('axansh_latest_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.phone) {
          setAddress(parsed);
          setAddressSaved(true);
        }
      }
    } catch (err) {
      console.warn("Failed to parse address", err);
    }
  }, []);

  if (cartItems.length === 0 && step !== 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center bg-[#f0f2f2]">
        <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="mt-6 px-8 py-3 bg-[#ff2d55] hover:bg-[#e02048] text-white rounded-lg font-bold shadow-sm transition-colors">
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleSaveAddress = () => {
    if (!address.name || !address.phone || !address.pincode || !address.street || !address.city || !address.state) {
      alert("Please fill in all address fields");
      return;
    }
    setAddressSaved(true);
    localStorage.setItem('axansh_latest_order', JSON.stringify(address));
  };

  const handlePlaceOrder = async () => {
    if (!addressSaved) {
      alert("Please save your delivery address first.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Razorpay failed to load. Please check your internet connection.');
      setSubmitting(false);
      return;
    }

    const mainProduct = cartItems[0];
    const options = {
      key: 'rzp_live_SYh1UmrGUxrYyb',
      amount: cartTotal * 100,
      currency: 'INR',
      name: 'Axansh Store',
      description: `Payment for ${mainProduct?.title || 'Order'}`,
      handler: async function (response) {
        const paymentId = response.razorpay_payment_id;
        const generatedOrderId = `AX-${Math.floor(10000 + Math.random() * 90000)}`;
        
        const orderData = {
          orderId: generatedOrderId,
          name: address.name,
          phone: address.phone,
          email: 'customer@axansh.com',
          address: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
          pincode: address.pincode,
          paymentId: paymentId,
          amount: cartTotal,
          product: mainProduct ? mainProduct.title : 'Products',
          productImage: mainProduct ? mainProduct.image : '',
          quantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
          variant: mainProduct ? mainProduct.size : 'Free Size',
          paymentMethod: 'ONLINE',
          date: new Date().toISOString(),
        };

        try {
          await DataService.placeOrder(orderData);
          setPayId(paymentId);
          setStep('success');
          clearCart();
        } catch (err) {
          console.error(err);
          alert('Order log failed. Save your Payment ID: ' + paymentId);
        } finally {
          setSubmitting(false);
        }
      },
      prefill: {
        name: address.name,
        contact: address.phone
      },
      theme: { color: '#ff2d55' },
      modal: {
        ondismiss: function() {
          setSubmitting(false);
        }
      }
    };
    
    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response){
      alert('Payment failed: ' + response.error.description);
      setSubmitting(false);
    });
    paymentObject.open();
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#f0f2f2] p-4 pt-10 font-sans">
        <div className="bg-white rounded-lg p-6 text-center shadow-sm max-w-md mx-auto">
          <CheckCircle2 size={56} className="text-[#03a685] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for shopping with us.</p>
          <div className="bg-gray-50 p-4 rounded text-left text-sm text-gray-800 space-y-3 mb-8 border border-gray-100">
            <p><span className="font-bold text-gray-500 block text-xs uppercase mb-1">Payment ID</span> {payId}</p>
            <p><span className="font-bold text-gray-500 block text-xs uppercase mb-1">Delivering to</span> {address.name}, {address.city}</p>
          </div>
          <button onClick={() => navigate('/')} className="w-full py-3.5 bg-[#ff2d55] hover:bg-[#e02048] text-white rounded-lg font-bold shadow-sm transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f0f2f2] min-h-screen pb-32 font-sans">
      <div className="bg-white border-b border-gray-200 p-4 flex justify-center shadow-sm">
        <h1 className="text-xl font-medium text-gray-900">Checkout</h1>
      </div>

      <div className="p-3 space-y-3 max-w-[480px] mx-auto mt-2">
        
        {/* Step 1: Address */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><MapPin size={16} className="text-gray-500"/> 1. Delivery Address</h2>
            {addressSaved && (
              <button onClick={() => setAddressSaved(false)} className="text-sm text-blue-600 font-semibold">Edit</button>
            )}
          </div>
          
          {!addressSaved ? (
            <div className="p-4 space-y-4">
              <div><label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label><input type="text" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#ff2d55] focus:shadow-[0_0_3px_2px_rgba(255,45,85,0.2)]" /></div>
              <div><label className="text-xs font-bold text-gray-700 block mb-1">Mobile Number</label><input type="tel" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value.replace(/\D/g, '')})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#ff2d55] focus:shadow-[0_0_3px_2px_rgba(255,45,85,0.2)]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold text-gray-700 block mb-1">Pincode</label><input type="text" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value.replace(/\D/g, '')})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#ff2d55] focus:shadow-[0_0_3px_2px_rgba(255,45,85,0.2)]" /></div>
                <div><label className="text-xs font-bold text-gray-700 block mb-1">Town/City</label><input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#ff2d55] focus:shadow-[0_0_3px_2px_rgba(255,45,85,0.2)]" /></div>
              </div>
              <div><label className="text-xs font-bold text-gray-700 block mb-1">Flat, House no., Area</label><input type="text" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#ff2d55] focus:shadow-[0_0_3px_2px_rgba(255,45,85,0.2)]" /></div>
              <div><label className="text-xs font-bold text-gray-700 block mb-1">State</label><input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full border border-gray-300 rounded p-2.5 text-sm outline-none focus:border-[#ff2d55] focus:shadow-[0_0_3px_2px_rgba(255,45,85,0.2)]" /></div>
              <button onClick={handleSaveAddress} className="w-full py-3 mt-2 bg-[#ff2d55] hover:bg-[#e02048] text-white rounded-lg font-bold shadow-sm transition-colors">Use this address</button>
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-800 leading-relaxed">
              <p className="font-bold text-base">{address.name}</p>
              <p>{address.street}, {address.city}</p>
              <p>{address.state} {address.pincode}</p>
              <p className="mt-1">Phone: {address.phone}</p>
            </div>
          )}
        </div>

        {/* Step 2: Items */}
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-opacity ${!addressSaved ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Truck size={16} className="text-gray-500"/> 2. Order Items</h2>
          </div>
          <div className="p-4 divide-y divide-gray-100">
            {cartItems.map((item, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex gap-4">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-contain rounded border border-gray-100 p-1 bg-gray-50" />
                <div>
                  <p className="text-sm font-bold text-gray-800 line-clamp-2">{item.title}</p>
                  <p className="text-[#ff2d55] font-bold text-sm mt-1">₹{item.discountPrice || item.price}</p>
                  <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Payment */}
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-opacity ${!addressSaved ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><CreditCard size={16} className="text-gray-500"/> 3. Payment Method</h2>
          </div>
          <div className="p-4 bg-white">
            <label className="flex items-start gap-3 p-3 bg-[#fff0f3] border border-[#ff2d55] rounded-lg cursor-pointer shadow-sm">
              <input type="radio" checked readOnly className="accent-[#ff2d55] w-4 h-4 mt-0.5" />
              <div>
                <span className="text-sm font-bold text-gray-900 block">Pay with Razorpay</span>
                <span className="text-xs text-gray-600 block mt-0.5">UPI, Cards, NetBanking, Wallets</span>
              </div>
            </label>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-500 px-1">
              <ShieldCheck size={14} className="text-[#03a685]" /> 100% Safe and Secure Payments
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 flex justify-between items-center max-w-[480px] mx-auto shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-0.5">Order Total:</p>
          <p className="text-xl font-bold text-[#ff2d55]">₹{cartTotal}</p>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className={`px-8 py-3.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
            !addressSaved 
              ? 'bg-gray-100 text-gray-400 border border-gray-200' 
              : 'bg-[#ff2d55] hover:bg-[#e02048] text-white border border-[#ff2d55]'
          }`}
        >
          {submitting ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
