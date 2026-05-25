import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Headphones, ArrowLeft } from 'lucide-react';

export default function StaticPage({ type: propType }) {
  const { type: paramType } = useParams();
  const navigate = useNavigate();
  const pageType = propType || paramType;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageType]);

  const contentMap = {
    terms: {
      title: "Terms & Conditions",
      icon: FileText,
      content: [
        { h: "1. Introduction", p: "Welcome to Axansh Store. By accessing our app, you agree to be bound by these terms." },
        { h: "2. User Accounts", p: "You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account." },
        { h: "3. Orders & Pricing", p: "All orders are subject to availability. Prices may change without notice. We reserve the right to refuse any order." },
        { h: "4. Shipping & Delivery", p: "We offer shipping across India, Pakistan, Nepal, and Sri Lanka. Delivery times are estimates." },
        { h: "5. Returns & Refunds", p: "Please check our Return Policy for details on eligible items and timelines." }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      icon: ShieldCheck,
      content: [
        { h: "Data Collection", p: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support." },
        { h: "Use of Information", p: "We use your data to process orders, improve our app, and send promotional offers (if opted-in)." },
        { h: "Data Protection", p: "Your data is encrypted and stored securely. We do not sell your personal information to third parties." },
        { h: "Cookies", p: "We use cookies to enhance your browsing experience and analyze app traffic." }
      ]
    },
    support: {
      title: "Help & Support",
      icon: Headphones,
      content: [
        { h: "24/7 Customer Care", p: "We are here to help you around the clock." },
        { h: "Email Us", p: "support@axansh.com\nWe typically reply within 24 hours." },
        { h: "Call Us", p: "+91 1800-123-4567\n(Available Monday - Saturday, 9 AM to 6 PM)" },
        { h: "Mailing Address", p: "Axansh Store Headquarters\nNew Delhi, India 110001" }
      ]
    },
    returns: {
      title: "Return & Refund Policy",
      icon: ShieldCheck,
      content: [
        { h: "1. Axansh Exclusive Products (Own Products)", p: "For products sold directly by Axansh Store, we offer a hassle-free 7-day return policy. You can return the item for a full refund or exchange if it is defective, damaged, or not as described. Items must be in their original packaging with all tags intact." },
        { h: "2. Affiliate Products", p: "For affiliate products purchased through our partner websites (such as Amazon, Flipkart, or Myntra), the return and refund policies of the respective partner platform will apply. Axansh Store does not process returns or issue refunds for affiliate items directly. Please contact the partner platform for assistance with these orders." },
        { h: "3. Refund Processing", p: "For eligible Axansh Exclusive products, once a valid return is received and inspected, your refund will be processed and credited back to your original payment method (or bank account) within 5-7 business days." },
        { h: "4. Non-Returnable Items", p: "Digital goods, gift cards, and certain health & personal care items are strictly non-returnable unless delivered in a damaged condition." }
      ]
    }
  };

  const data = contentMap[pageType] || contentMap['terms'];
  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-white pb-24 pt-[60px]">
      {/* Custom Header for Static Pages (since main header is hidden or we want a custom back button) */}
      <div className="fixed top-0 left-0 right-0 max-w-[480px] mx-auto z-[999] bg-white h-[60px] flex items-center px-4 border-b border-gray-100 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-gray-700 hover:text-[#ff2d55] transition-colors rounded-full active:scale-95"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[15px] font-black tracking-wide ml-2 uppercase text-gray-800 flex-1 truncate">
          {data.title}
        </h1>
      </div>

      <div className="p-6">
        <div className="w-16 h-16 bg-[#03a685]/10 rounded-full flex items-center justify-center mb-6 border border-[#03a685]/20">
          <Icon size={32} className="text-[#03a685]" />
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mb-8">{data.title}</h2>
        
        <div className="space-y-6">
          {data.content.map((block, idx) => (
            <div key={idx} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-2">{block.h}</h3>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{block.p}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center border-t border-gray-100 pt-8">
          <p className="text-[10px] font-bold text-gray-400">Last updated: May 2026</p>
        </div>
      </div>
    </div>
  );
}
