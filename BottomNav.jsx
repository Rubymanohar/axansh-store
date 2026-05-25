import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Tag } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { LanguageContext } from '../context/LanguageContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getWishlistCount } = useContext(WishlistContext);
  const { t } = useContext(LanguageContext);

  const navItems = [
    { id: 'home', icon: Home, labelKey: 'nav_home', path: '/' },
    { id: 'categories', icon: LayoutGrid, labelKey: 'nav_categories', path: '/categories' },
    { id: 'deals', icon: Tag, labelKey: 'nav_deals', path: '/deals' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[1001] bg-white border-t border-gray-200 pb-safe shadow-lg max-w-[480px] mx-auto"
      aria-label="Main bottom navigation"
    >
      <div className="h-14 w-full flex items-stretch justify-around">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          let count = 0;
          if (item.badge === 'wishlist') count = getWishlistCount();

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[56px] transition-colors ${
                active ? 'text-[#ff2d55]' : 'text-gray-400'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              
              {count > 0 && (
                <span className="absolute top-1 right-[calc(50%-18px)] bg-[#ff2d55] text-white text-[8px] font-black min-w-[14px] h-3.5 flex items-center justify-center rounded-full px-1 border border-white">
                  {count}
                </span>
              )}
              
              <span className="text-[10px] font-bold tracking-tight">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
