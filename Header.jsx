import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, ArrowLeft, Heart, Camera, X, Sparkles, ChevronDown, Globe, User, Mic } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { LanguageContext } from '../context/LanguageContext';

export default function Header({ searchQuery, setSearchQuery, products = [], activeCategory = 'all', setActiveCategory }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { currentLanguage, setLanguage, t, languagesList } = useContext(LanguageContext);

  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const scrollRef = useRef(null);
  const activeTabRef = useRef(null);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Pro Search Features: Recent Searches
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('axansh_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem('axansh_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSearch = (query) => {
    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== query);
      localStorage.setItem('axansh_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('axansh_recent_searches');
  };

  // Pro Search Features: Placeholder Cycling
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fadePlaceholder, setFadePlaceholder] = useState(false);
  const placeholderKeys = ['subcat_mobile_accessories', 'subcat_skincare_makeup', 'subcat_fitness_equipment', 'subcat_kitchen_dining', 'subcat_mobile_covers'];

  useEffect(() => {
    const interval = setInterval(() => {
      setFadePlaceholder(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderKeys.length);
        setFadePlaceholder(false);
      }, 250);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholderKeys.length]);

  // Pro Search Features: Match Query Highlighting
  const highlightMatchText = (text, query) => {
    if (!query || !query.trim()) return <span>{text}</span>;
    // eslint-disable-next-line no-useless-escape
    const cleanQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const parts = text.split(new RegExp(`(${cleanQuery})`, 'gi'));
    return (
      <span>
        {parts.map((part, idx) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={idx} className="font-extrabold text-[#ff2d55]">
              {part}
            </span>
          ) : (
            <span key={idx}>{part}</span>
          )
        )}
      </span>
    );
  };

  // Pro Search Features: Voice Search
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery(transcript);
          saveSearch(transcript);
          if (location.pathname !== '/') {
            navigate('/');
          }
        }
        setIsListening(false);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [location.pathname, navigate, setSearchQuery]);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert("Voice search is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      const langMap = {
        hi: 'hi-IN',
        en: 'en-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        kn: 'kn-IN',
        gu: 'gu-IN'
      };
      recognitionRef.current.lang = langMap[currentLanguage] || 'en-IN';
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Auto-center the active category tab when it changes
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeCategory]);

  // Mouse Drag-to-Scroll Event Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // multiplier for faster scroll
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const getWishlistCount = () => {
    return wishlist ? wishlist.length : 0;
  };

  // Determine current page state
  const isHome = location.pathname === '/';
  const isCategoriesPage = location.pathname === '/categories';
  const showSearch = isHome || isCategoriesPage;
  const showCategoriesRow = isHome;

  // Header Titles for sub-pages
  const getPageTitle = () => {
    if (location.pathname.startsWith('/product/')) return t('title_product_detail');
    if (location.pathname === '/cart') return t('title_cart');
    if (location.pathname === '/wishlist') return t('title_wishlist');
    if (location.pathname === '/profile') return t('title_profile');
    if (location.pathname === '/orders') return t('title_orders');
    return t('title_store_name');
  };

  // Categories parsing for top scroll row
  const tabs = useMemo(() => {
    return [
      { id: 'all', image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=80&q=80&fit=crop' },
      { id: 'electronics-gadgets', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80&fit=crop' },
      { id: 'fashion-apparel', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=80&q=80&fit=crop' },
      { id: 'home-furniture-decor', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=80&q=80&fit=crop' },
      { id: 'health-beauty-wellness', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&q=80&fit=crop' },
      { id: 'sports-outdoors-hobbies', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=80&q=80&fit=crop' },
      { id: 'groceries-daily-essentials', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&q=80&fit=crop' },
      { id: 'pet-supplies', image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=80&q=80&fit=crop' },
      { id: 'digital-specialized', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=80&q=80&fit=crop' },
      { id: 'affiliate', image: 'https://images.unsplash.com/photo-1546074177-3b9b40f5a578?w=80&q=80&fit=crop' },
      { id: 'own', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=80&q=80&fit=crop' }
    ];
  }, []);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const popularSearches = [
    { key: 'subcat_mobile_accessories', term: 'Mobile Phones & Accessories', isHot: true },
    { key: 'subcat_skincare_makeup', term: 'Skincare & Makeup', isHot: true },
    { key: 'subcat_fitness_equipment', term: 'Fitness Equipment', isTrending: true },
    { key: 'subcat_kitchen_dining', term: 'Kitchen & Dining', isTrending: true },
    { key: 'subcat_mobile_covers', term: 'Mobile Covers', isHot: false }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 max-w-[480px] mx-auto z-[999] bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm transition-all duration-300">
      
      {/* ROW 1: TOP BAR (Logo / Back + Icons) */}
      <div className="flex items-center justify-between px-3 h-12">
        <div className="flex items-center gap-2">
          {!isHome ? (
            <button 
              onClick={handleBack} 
              className="p-1.5 -ml-1 text-gray-700 hover:text-[#ff2d55] transition-all rounded-full hover:bg-gray-100 active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft size={20} className="stroke-[2.5]" />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/track')}
              className="w-8 h-8 bg-gradient-to-tr from-pink-50 to-indigo-50/30 rounded-full flex items-center justify-center text-gray-700 border border-gray-250/80 hover:border-[#ff2d55]/40 hover:scale-105 active:scale-95 transition-all shadow-sm hover:shadow-[0_4px_10px_rgba(255,45,85,0.08)] group"
              aria-label="Orders"
            >
              <User size={14} className="text-[#ff2d55] group-hover:scale-110 transition-transform duration-200" />
            </button>
          )}

          {/* LEFT ALIGNED LOGO */}
          {isHome ? (
            <div 
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="flex items-center cursor-pointer select-none group h-[36px] ml-1"
            >
              {/* Overlapping Bag and Text Logo */}
              <div className="flex items-center">
                {/* Abstract Bag Icon */}
                <div className="w-[42px] h-[42px] relative z-0 group-hover:scale-105 transition-transform duration-300 -mr-[16px]">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_4px_rgba(16,185,129,0.25)]">
                    <defs>
                      <linearGradient id="bagBrandGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#10b981" />
                        <stop offset="1" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <g transform="rotate(-15 45 45)">
                      {/* Bag Handle */}
                      <path d="M 32 38 C 32 15, 62 15, 62 38" stroke="url(#bagBrandGrad)" strokeWidth="2.5" strokeLinecap="round" />
                      
                      {/* Handle Rings */}
                      <circle cx="32" cy="38" r="2.5" stroke="url(#bagBrandGrad)" strokeWidth="2" fill="white" />
                      <circle cx="62" cy="38" r="2.5" stroke="url(#bagBrandGrad)" strokeWidth="2" fill="white" />
                      <circle cx="32" cy="38" r="1.5" fill="#10b981" />
                      <circle cx="62" cy="38" r="1.5" fill="#10b981" />
                      
                      {/* Top Line */}
                      <path d="M 18 38 L 76 38" stroke="url(#bagBrandGrad)" strokeWidth="2.5" strokeLinecap="round" />
                      
                      {/* Right Tapering Line */}
                      <path d="M 76 38 L 72 65" stroke="url(#bagBrandGrad)" strokeWidth="2.5" strokeLinecap="round" />
                      
                      {/* Left Curved Line */}
                      <path d="M 18 38 Q 22 75, 28 85" stroke="url(#bagBrandGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </g>
                  </svg>
                </div>
                
                {/* Overlapping Text */}
                <div className="flex flex-col items-center justify-center leading-none z-10 pt-[4px]">
                  <span className="text-[20px] sm:text-[22px] font-[900] tracking-tight text-[#ff2d55] uppercase drop-shadow-[0_2px_2px_rgba(255,255,255,0.95)] transition-colors" style={{fontFamily: "'Inter', 'SF Pro Display', sans-serif"}}>
                    AXANSH
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-[800] tracking-[0.3em] text-[#10b981] uppercase mt-[1px]" style={{fontFamily: "'Inter', sans-serif"}}>
                    STORE
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-sm font-black uppercase tracking-wider text-gray-850 ml-1">
              {getPageTitle()}
            </h1>
          )}
        </div>

        {/* Right action icons */}
        <div className="flex items-center gap-2.5 text-gray-700">
          {/* Language Selector Dropdown */}
          <div className="relative shrink-0 flex items-center" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-750 transition-all hover:border-gray-300 hover:bg-gray-100/50 active:scale-95 shadow-sm"
              aria-label="Change Language"
            >
              <Globe size={11} className="text-gray-400 shrink-0" />
              <span>{languagesList.find(l => l.code === currentLanguage)?.nativeName || 'English'}</span>
              <ChevronDown size={10} className={`text-gray-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 top-[100%] mt-2 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] z-[9999] overflow-hidden w-32 py-1.5 divide-y divide-gray-50/50 animate-in fade-in slide-in-from-top-2 duration-200">
                {languagesList.map((lang) => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-[11px] font-bold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-50/80 to-rose-50/30 text-[#ff2d55]'
                          : 'text-gray-700 hover:bg-gray-50/80'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d55]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/wishlist')} 
            className="relative p-1.5 hover:text-red-500 transition-colors rounded-full hover:bg-gray-55 group"
            aria-label="View Wishlist"
          >
            <Heart size={19} className="group-hover:scale-105 transition-transform" />
            {getWishlistCount() > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm animate-pulse">
                {getWishlistCount()}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => navigate('/cart')} 
            className="relative p-1.5 hover:text-[#ff2d55] transition-colors rounded-full hover:bg-gray-55 group"
            aria-label="View Cart"
          >
            <ShoppingBag size={19} className="group-hover:scale-105 transition-transform" />
            {getCartCount() > 0 && (
              <span className="absolute top-0 right-0 bg-[#ff2d55] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm animate-pulse">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ROW 2: SEARCH ROW */}
      {showSearch && (
        <div className="px-3 pb-2.5 relative">
          <div className="flex items-center gap-2">
            <div className={`relative flex items-center h-10 bg-gray-50 border border-gray-200/85 rounded-full px-3.5 transition-all duration-300 flex-grow ${
              isFocused 
                ? 'bg-white border-[#ff2d55]/60 ring-4 ring-[#ff2d55]/5 shadow-[0_0_15px_rgba(255,45,85,0.12)]' 
                : 'hover:border-gray-300 hover:shadow-sm'
            }`}>
              <Search size={14} className={`shrink-0 mr-2 transition-colors duration-205 ${isFocused ? 'text-[#ff2d55]' : 'text-gray-400'}`} />
              <div className="relative flex-grow h-full flex items-center min-w-0">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveSearch(searchQuery);
                      setIsFocused(false);
                      searchInputRef.current?.blur();
                    }
                  }}
                  className="w-full bg-transparent text-[11px] text-gray-850 outline-none font-semibold relative z-10"
                />
                {!searchQuery && (
                  <div className={`absolute left-0 pointer-events-none text-[11px] font-semibold transition-all duration-250 transform select-none ${
                    isListening ? 'text-[#ff2d55] animate-pulse opacity-100 translate-y-0' : 'text-gray-400'
                  } ${
                    !isListening && fadePlaceholder ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
                  }`}>
                    {isListening ? t('search_listening') : t('search_for_item', { item: t(placeholderKeys[placeholderIndex]) })}
                  </div>
                )}
              </div>
              {searchQuery && (
                <button 
                  onClick={handleClearSearch}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 mr-1 transition-colors relative z-20"
                >
                  <X size={12} />
                </button>
              )}
              <button className="p-1 hover:text-[#ff2d55] text-gray-400 transition-colors ml-0.5 relative z-20" aria-label="Camera Search">
                <Camera size={13} className="hover:scale-105 transition-transform" />
              </button>
              <button 
                onClick={toggleVoiceSearch}
                className={`p-1.5 transition-all ml-1 relative z-20 rounded-full flex items-center justify-center ${
                  isListening 
                    ? 'text-white bg-[#ff2d55] animate-bounce shadow-md shadow-[#ff2d55]/30 scale-110' 
                    : 'text-gray-400 hover:text-[#ff2d55] hover:bg-gray-100'
                }`}
                aria-label="Voice Search"
              >
                <Mic size={13} className={`${isListening ? 'animate-pulse scale-110' : 'hover:scale-110'} transition-transform duration-200`} />
              </button>
            </div>

            {/* Cancel Button (iOS slide-in transition style) */}
            <button
              onClick={() => {
                setIsFocused(false);
                setSearchQuery('');
                searchInputRef.current?.blur();
              }}
              className={`text-xs font-black text-gray-500 hover:text-[#ff2d55] shrink-0 transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isFocused ? 'max-w-[70px] opacity-100 pl-1 pr-1' : 'max-w-0 opacity-0 pointer-events-none'
              }`}
            >
              {currentLanguage === 'hi' ? 'रद्द करें' : 
               currentLanguage === 'ta' ? 'ரத்து' : 
               currentLanguage === 'te' ? 'రద్దు' : 
               currentLanguage === 'mr' ? 'रद्द करा' : 
               currentLanguage === 'bn' ? 'বাতিল' : 
               currentLanguage === 'kn' ? 'ರದ್ದು' : 
               currentLanguage === 'gu' ? 'રદ કરો' : 'Cancel'}
            </button>
          </div>

          {/* Autocomplete Suggestions Box */}
          {isFocused && (
            <div 
              ref={dropdownRef}
              className="absolute top-[100%] left-3 right-3 mt-2 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            >
              {searchQuery.trim() === '' ? (
                <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <span>🕒</span> {t('search_recent')}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearAllSearches();
                          }}
                          className="text-[9px] font-extrabold text-[#ff2d55] hover:underline"
                        >
                          {t('search_clear_all')}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((term, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center bg-gray-50 border border-gray-200/70 rounded-full px-3 py-1.5 text-[11px] font-bold text-gray-700 hover:border-pink-200 hover:text-[#ff2d55] transition-all cursor-pointer"
                            onClick={() => {
                              setSearchQuery(term);
                              saveSearch(term);
                              setIsFocused(false);
                              navigate('/');
                            }}
                          >
                            <span>{term}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSearch(term);
                              }}
                              className="ml-1.5 p-0.5 hover:bg-gray-200/50 rounded-full text-gray-400 hover:text-[#ff2d55] transition-colors"
                            >
                              <X size={10} className="stroke-[3]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1">
                      <span>⚡</span> {t('popular_searches')}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSearches.map((item) => (
                        <button
                          key={item.term}
                          onClick={() => {
                            setSearchQuery(item.term);
                            saveSearch(item.term);
                            setIsFocused(false);
                            navigate('/');
                          }}
                          className="inline-flex items-center px-3 py-1.5 bg-gray-50 hover:bg-pink-50 hover:text-[#ff2d55] hover:border-pink-200 border border-gray-200/65 rounded-full text-[11px] font-bold text-gray-700 transition-all active:scale-95"
                        >
                          <span>{t(item.key)}</span>
                          {item.isHot && (
                            <span className="ml-1 text-[7px] font-black tracking-wider text-white bg-gradient-to-r from-red-500 to-orange-500 px-1 py-0.5 rounded-md uppercase shrink-0">
                              {t('badge_hot')}
                            </span>
                          )}
                          {item.isTrending && (
                            <span className="ml-1 text-[7px] font-black tracking-wider text-white bg-gradient-to-r from-blue-500 to-indigo-500 px-1 py-0.5 rounded-md uppercase shrink-0">
                              NEW
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Trending Categories list */}
                  <div>
                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1">
                      <span>🔥</span> {t('trending_categories')}
                    </h4>
                    <div className="divide-y divide-gray-100">
                      {tabs.slice(1, 5).map((tab) => (
                        <div
                          key={tab.id}
                          onClick={() => {
                            setActiveCategory(tab.id);
                            setSearchQuery('');
                            setIsFocused(false);
                            navigate('/');
                          }}
                          className="flex items-center justify-between py-2.5 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={tab.image} alt={t('cat_' + tab.id.replace(/-/g, '_'))} className="w-5 h-5 rounded-full object-cover border border-gray-150 shrink-0 shadow-sm" />
                            <span className="text-[11px] font-bold text-gray-750 group-hover:text-[#ff2d55] transition-colors">{t('cat_' + tab.id.replace(/-/g, '_'))}</span>
                          </div>
                          <span className="text-[8px] text-[#ff2d55] font-black uppercase tracking-wider bg-pink-50 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">{t('shop_now')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-h-[280px] overflow-y-auto divide-y divide-gray-50/80">
                  {/* Category matches */}
                  {tabs.filter(tab => tab.id !== 'all' && t(`cat_${tab.id.replace(/-/g, '_')}`).toLowerCase().includes(searchQuery.toLowerCase())).map(tab => (
                    <div
                      key={tab.id}
                      onClick={() => {
                        setActiveCategory(tab.id);
                        setSearchQuery('');
                        setIsFocused(false);
                        navigate('/');
                      }}
                      className="flex items-center gap-2.5 px-4 py-3 hover:bg-pink-50/30 cursor-pointer transition-colors"
                    >
                      <Search size={12} className="text-[#ff2d55]" />
                      <span className="text-[11px] font-bold text-gray-700">
                        {highlightMatchText(t('search_in', { cat: t('cat_' + tab.id.replace(/-/g, '_')) }), searchQuery)}
                      </span>
                    </div>
                  ))}

                  {/* Product exact matches */}
                  {products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 5).map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        if (searchQuery.trim()) {
                          saveSearch(searchQuery.trim());
                        }
                        navigate(`/product/${prod.id}`);
                        setIsFocused(false);
                      }}
                      className="flex items-center gap-3 p-2.5 hover:bg-gray-50/80 cursor-pointer transition-colors"
                    >
                      <img src={prod.image} alt="" className="w-8.5 h-8.5 rounded-lg object-cover border border-gray-150 bg-gray-55 shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="text-[11px] font-bold text-gray-800 truncate leading-snug">
                          {highlightMatchText(prod.title, searchQuery)}
                        </p>
                        <p className="text-[8px] text-gray-450 font-black uppercase tracking-widest mt-0.5">{prod.subcategory || prod.category}</p>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <span className="text-[11px] font-black text-[#ff2d55]">₹{prod.discountPrice || prod.price}</span>
                      </div>
                    </div>
                  ))}

                  {/* Zero state */}
                  {products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && 
                   tabs.filter(tab => tab.id !== 'all' && t('cat_' + tab.id.replace(/-/g, '_')).toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="p-6 text-center text-gray-400 space-y-1.5">
                      <span className="text-lg">🔍</span>
                      <p className="text-[11px] font-bold text-gray-700">{t('no_results')}</p>
                      <p className="text-[9px] text-gray-450 leading-relaxed max-w-[200px] mx-auto font-semibold">{t('no_results_desc')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ROW 3: CATEGORY HORIZONTAL SCROLL BAR (Only on Home) */}
      {showCategoriesRow && (
        <div className="relative border-t border-gray-100 bg-white">
          {/* Scroll Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 animate-fade-in duration-300" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 animate-fade-in duration-300" />

          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`py-2 flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth px-4 ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            {tabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setSearchQuery(''); // Clear search on category selection
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200 border active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#ff2d55] to-rose-500 text-white border-transparent shadow-[0_4px_12px_rgba(255,45,85,0.25)]'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100/80 hover:border-gray-300'
                  }`}
                >
                  <img src={tab.image} alt={t('cat_' + tab.id.replace(/-/g, '_'))} className="w-5 h-5 rounded-full object-cover border border-white/20 shrink-0" />
                  <span>{t('cat_' + tab.id.replace(/-/g, '_'))}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

