import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, HelpCircle, FileText, Shield, ChevronRight, MapPin, Package, Heart, LogIn } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export default function AccountPage() {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const menuSections = [
    {
      title: "My Account",
      items: [
        { icon: Package, label: t('profile_my_orders'), desc: t('profile_my_orders_desc'), path: '/track' },
        { icon: Heart, label: t('profile_wishlist'), desc: t('profile_wishlist_desc'), path: '/wishlist' },
      ]
    },
    {
      title: "Help & Policies",
      items: [
        { icon: HelpCircle, label: t('profile_help'), desc: t('profile_help_desc'), path: '/support' },
        { icon: FileText, label: t('profile_terms'), desc: "Read our rules", path: '/policy/terms' },
        { icon: Shield, label: t('profile_privacy'), desc: "How we protect your data", path: '/policy/privacy' },
        { icon: Shield, label: t('profile_returns'), desc: "Affiliate & Own products", path: '/policy/returns' },
      ]
    },
    {
      title: "App Settings",
      items: [
        { icon: Settings, label: t('profile_settings'), desc: t('profile_settings_desc'), action: 'open_lang_modal' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 pt-[80px]">
      
      {/* Header Profile Area */}
      <div className="bg-white px-5 py-6 mb-3 border-b border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
            <LogIn size={24} className="text-gray-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-800">{t('guest_user')}</h2>
            <p className="text-[11px] text-[#ff2d55] font-bold mt-0.5">{t('profile_guest_label')}</p>
          </div>
        </div>
        <button className="bg-[#ff2d55] text-white px-4 py-2 rounded-lg text-xs font-bold active:scale-95 transition-transform shadow-md">
          {t('profile_signin_btn')}
        </button>
      </div>

      {/* Menu Sections */}
      <div className="space-y-3">
        {menuSections.map((section, idx) => (
          <div key={idx} className="bg-white border-y border-gray-100 shadow-sm">
            <div className="px-5 py-3 text-[11px] font-black text-gray-400 uppercase tracking-wider bg-gray-50/50">
              {section.title}
            </div>
            <div className="flex flex-col divide-y divide-gray-50">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    } else if (item.action === 'open_lang_modal') {
                      // We can just scroll to top to show language selector, or alert
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      alert("Please use the language selector in the top right corner of the header.");
                    }
                  }}
                  className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-100">
                      <item.icon size={18} className="text-[#03a685]" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-gray-700">{item.label}</h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* App Version Info */}
      <div className="p-6 text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Axansh Store App v1.0.0</p>
      </div>

    </div>
  );
}
