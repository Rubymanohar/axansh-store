import React, { useState, useContext, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle2, AlertCircle, Loader2, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import DataService from '../services/DataService';
import SEO from './SEO';

export default function TrackOrder() {
  const { t } = useContext(LanguageContext);
  const [searchId, setSearchId] = useState('');
  const [ordersList, setOrdersList] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle URL params for tracking links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setSearchId(id);
      handleTrack(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrack = async (idToTrack = searchId) => {
    if (!idToTrack.trim()) return;
    
    setLoading(true);
    setError('');
    setOrdersList(null);
    setSelectedOrder(null);
    
    try {
      // DataService.getOrder returns an array of matching orders (by phone or ID)
      const results = await DataService.getOrder(idToTrack);
      if (results && results.length > 0) {
        // Sort by newest first
        const sorted = [...results].sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrdersList(sorted);
        
        // If only 1 order exists, open details directly
        if (sorted.length === 1) {
          setSelectedOrder(sorted[0]);
        }
      } else {
        setError(t('order_not_found') || 'No orders found for this number or ID.');
      }
    } catch (err) {
      setError(err.message || t('order_not_found') || 'No orders found for this number or ID.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => {
    const s = String(status || 'Placed').toLowerCase();
    if (s.includes('delivered')) return 3;
    if (s.includes('out') || s.includes('shipped')) return 2;
    if (s.includes('pack') || s.includes('process')) return 1;
    return 0; // Placed / Default
  };

  const getStatusBadge = (status) => {
    const s = String(status || 'Placed').toLowerCase();
    if (s.includes('delivered')) return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Delivered</span>;
    if (s.includes('out') || s.includes('shipped')) return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Shipped</span>;
    if (s.includes('pack') || s.includes('process')) return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Processing</span>;
    return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Placed</span>;
  };

  const statusSteps = [
    { title: t('status_placed') || 'Order Placed', icon: Package },
    { title: t('status_processing') || 'Processing', icon: Loader2 },
    { title: t('status_shipped') || 'Shipped', icon: Truck },
    { title: t('status_delivered') || 'Delivered', icon: CheckCircle2 }
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-[64px] pb-24 font-sans text-gray-800">
      <SEO 
        title="Track Order | Axansh Store"
        description="Track your Axansh Store order status."
      />

      <div className="max-w-[600px] mx-auto px-4">
        
        {/* Only show search header if no order is specifically selected, OR keep it small */}
        {!selectedOrder && (
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm mb-6 text-center space-y-3">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <MapPin size={24} />
            </div>
            <h1 className="text-xl font-black text-gray-900 leading-tight">{t('track_order_title') || 'Track Your Order'}</h1>
            <p className="text-xs text-gray-500 font-semibold">{t('enter_tracking_id') || 'Enter your Mobile Number or Order ID'}</p>
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleTrack(); }}
              className="mt-4 flex flex-col gap-3"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Ex: 9876543210 or AX-12345"
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors placeholder:font-semibold placeholder:text-gray-400"
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !searchId.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex justify-center items-center h-[46px]"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : (t('track_button') || 'Track Now')}
              </button>
            </form>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 mb-6 animate-fade-in">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div className="text-sm font-bold text-red-700">{error}</div>
          </div>
        )}

        {/* List View: Multiple Orders */}
        {ordersList && ordersList.length > 1 && !selectedOrder && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2 pl-2">All Orders ({ordersList.length})</h2>
            
            <div className="flex flex-col gap-3">
              {ordersList.map((order, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</h3>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{order.orderId}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0">
                      <img 
                        src={order.productImage || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&q=80&fit=crop"} 
                        alt="Product" 
                        className="w-full h-full object-contain mix-blend-multiply" 
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 truncate">{order.product}</h4>
                      <p className="text-[10px] text-gray-500 font-semibold mt-1 flex items-center gap-1">
                        <Calendar size={10} /> {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-black text-gray-900 mt-1">₹{order.amount}</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail View: Single Selected Order */}
        {selectedOrder && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Back Button (Only if multiple orders exist) */}
            {ordersList && ordersList.length > 1 && (
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mb-2"
              >
                <ChevronLeft size={18} /> Back to all orders
              </button>
            )}

            {/* Order Info Card */}
            <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</h3>
                  <p className="text-base font-black text-gray-900 mt-0.5">{selectedOrder.orderId}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Date</h3>
                  <p className="text-xs font-bold text-gray-700 mt-1 flex items-center gap-1 justify-end">
                    <Calendar size={12} /> {new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-xl p-1.5 border border-gray-100 shrink-0">
                  <img 
                    src={selectedOrder.productImage || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&q=80&fit=crop"} 
                    alt="Product" 
                    className="w-full h-full object-contain mix-blend-multiply" 
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-gray-800 line-clamp-2">{selectedOrder.product}</h4>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Qty: {selectedOrder.quantity || 1} • {selectedOrder.variant || 'Standard'}</p>
                  <p className="text-sm font-black text-gray-900 mt-1">₹{selectedOrder.amount}</p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-800">Delivery Status</h3>
                {getStatusBadge(selectedOrder.status)}
              </div>
              
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100 z-0"></div>
                
                {/* Steps */}
                <div className="space-y-6 relative z-10">
                  {statusSteps.map((step, index) => {
                    const currentIdx = getStatusIndex(selectedOrder.status);
                    const isCompleted = index <= currentIdx;
                    const isActive = index === currentIdx;
                    const StepIcon = step.icon;
                    
                    return (
                      <div key={index} className={`flex items-center gap-4 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 ${
                          isActive 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30' 
                            : isCompleted 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'bg-white border-gray-200 text-gray-400'
                        }`}>
                          <StepIcon size={14} strokeWidth={3} className={isActive && step.title === 'Processing' ? 'animate-spin' : ''} />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isActive ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.title}
                          </p>
                          {isActive && index === 2 && selectedOrder.trackingId && (
                            <p className="text-[10px] font-semibold text-gray-500 mt-1 uppercase tracking-wider">
                              Tracking ID: <span className="font-black text-gray-800">{selectedOrder.trackingId}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedOrder.trackingId && (
                <div className="mt-8 pt-4 border-t border-gray-100">
                  <a 
                    href={`https://www.indiapost.gov.in/vas/pages/trackConsignment.aspx?barcode=${selectedOrder.trackingId}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-gray-800 transition-colors"
                  >
                    <Truck size={14} /> Track on India Post
                  </a>
                </div>
              )}
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Shipping To</h3>
              <p className="text-sm font-bold text-gray-900">{selectedOrder.name}</p>
              <p className="text-xs text-gray-600 font-semibold leading-relaxed">{selectedOrder.address}</p>
              <p className="text-xs text-gray-600 font-semibold pt-1">Phone: +91 {selectedOrder.phone}</p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
