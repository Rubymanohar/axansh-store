/* eslint-disable react-refresh/only-export-components */
import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Truck, ShieldCheck, Award, Headphones } from 'lucide-react';
import SEO from './SEO';
import ProductCard from './ProductCard';
import { LanguageContext } from '../context/LanguageContext';

const PARENT_MAP = {
  // ELECTRONICS & GADGETS
  'electronics-gadgets': 'electronics-gadgets',
  'electronics': 'electronics-gadgets',
  'smartphones': 'electronics-gadgets',
  'smart-watches': 'electronics-gadgets',
  'earbuds': 'electronics-gadgets',
  'headphones': 'electronics-gadgets',
  'speakers': 'electronics-gadgets',
  'power-banks': 'electronics-gadgets',
  'chargers': 'electronics-gadgets',
  'laptop-accessories': 'electronics-gadgets',
  'cameras': 'electronics-gadgets',
  'gaming-accessories': 'electronics-gadgets',
  'mobile-accessories': 'electronics-gadgets',
  'mobile-covers': 'electronics-gadgets',
  'tempered-glass': 'electronics-gadgets',
  'phone-holder': 'electronics-gadgets',
  'phone-holders': 'electronics-gadgets',
  'computers-laptops': 'electronics-gadgets',
  'smart-home-iot': 'electronics-gadgets',
  'audio-video': 'electronics-gadgets',

  // FASHION & APPAREL
  'fashion-apparel': 'fashion-apparel',
  'fashion': 'fashion-apparel',
  'clothing': 'fashion-apparel',
  'saree': 'fashion-apparel',
  'sarees': 'fashion-apparel',
  'kurti': 'fashion-apparel',
  'kurtis': 'fashion-apparel',
  'lehenga': 'fashion-apparel',
  'salwar-suits': 'fashion-apparel',
  'dupatta': 'fashion-apparel',
  'blouses': 'fashion-apparel',
  'dresses': 'fashion-apparel',
  'tops': 'fashion-apparel',
  't-shirts': 'fashion-apparel',
  'shirts': 'fashion-apparel',
  'jeans': 'fashion-apparel',
  'trousers': 'fashion-apparel',
  'jackets': 'fashion-apparel',
  'hoodies': 'fashion-apparel',
  'kids-wear': 'fashion-apparel',
  'innerwear': 'fashion-apparel',
  'nightwear': 'fashion-apparel',
  'winter-wear': 'fashion-apparel',
  'couple-wear': 'fashion-apparel',
  'footwear': 'fashion-apparel',
  'shoes': 'fashion-apparel',
  'sneakers': 'fashion-apparel',
  'sandals': 'fashion-apparel',
  'heels': 'fashion-apparel',
  'slippers': 'fashion-apparel',
  'boots': 'fashion-apparel',
  'sports-shoes': 'fashion-apparel',
  'fashion-accessories': 'fashion-apparel',
  'jewelry': 'fashion-apparel',
  'jewelry-accessories': 'fashion-apparel',
  'earrings': 'fashion-apparel',
  'necklaces': 'fashion-apparel',
  'bangles': 'fashion-apparel',
  'rings': 'fashion-apparel',
  'watches': 'fashion-apparel',
  'sunglasses': 'fashion-apparel',
  'handbags': 'fashion-apparel',
  'wallets': 'fashion-apparel',
  'belts': 'fashion-apparel',

  // HOME, FURNITURE & DECOR
  'home-furniture-decor': 'home-furniture-decor',
  'kitchen': 'home-furniture-decor',
  'home-kitchen': 'home-furniture-decor',
  'cookware': 'home-furniture-decor',
  'dinner-sets': 'home-furniture-decor',
  'kitchen-tools': 'home-furniture-decor',
  'water-bottles': 'home-furniture-decor',
  'storage-boxes': 'home-furniture-decor',
  'gas-stove': 'home-furniture-decor',
  'mixer-grinder': 'home-furniture-decor',
  'kitchen-dining': 'home-furniture-decor',
  'home-decor': 'home-furniture-decor',
  'wall-decor': 'home-furniture-decor',
  'bedsheets': 'home-furniture-decor',
  'curtains': 'home-furniture-decor',
  'pillows': 'home-furniture-decor',
  'lighting': 'home-furniture-decor',
  'furniture': 'home-furniture-decor',
  'sofa': 'home-furniture-decor',
  'beds': 'home-furniture-decor',
  'dining-table': 'home-furniture-decor',
  'chairs': 'home-furniture-decor',
  'tv-units': 'home-furniture-decor',
  'office-tables': 'home-furniture-decor',
  'wardrobes': 'home-furniture-decor',
  'shoe-racks': 'home-furniture-decor',
  'modular-furniture': 'home-furniture-decor',

  // HEALTH, BEAUTY & WELLNESS
  'health-beauty-wellness': 'health-beauty-wellness',
  'beauty': 'health-beauty-wellness',
  'beauty-personal-care': 'health-beauty-wellness',
  'makeup': 'health-beauty-wellness',
  'lipstick': 'health-beauty-wellness',
  'foundation': 'health-beauty-wellness',
  'skincare': 'health-beauty-wellness',
  'skincare-makeup': 'health-beauty-wellness',
  'face-wash': 'health-beauty-wellness',
  'hair-oil': 'health-beauty-wellness',
  'shampoo': 'health-beauty-wellness',
  'perfumes': 'health-beauty-wellness',
  'trimmers': 'health-beauty-wellness',
  'grooming-kits': 'health-beauty-wellness',
  'haircare': 'health-beauty-wellness',
  'personal-care-vitamins': 'health-beauty-wellness',

  // SPORTS, OUTDOORS & HOBBIES
  'sports-outdoors-hobbies': 'sports-outdoors-hobbies',
  'fitness-equipment': 'sports-outdoors-hobbies',
  'outdoor-recreation': 'sports-outdoors-hobbies',
  'hobbies-creative-arts': 'sports-outdoors-hobbies',

  // GROCERIES & DAILY ESSENTIALS
  'groceries-daily-essentials': 'groceries-daily-essentials',
  'grocery': 'groceries-daily-essentials',
  'snacks': 'groceries-daily-essentials',
  'beverages': 'groceries-daily-essentials',
  'tea-coffee': 'groceries-daily-essentials',
  'organic-food': 'groceries-daily-essentials',
  'rice': 'groceries-daily-essentials',
  'pulses': 'groceries-daily-essentials',
  'spices': 'groceries-daily-essentials',
  'dry-fruits': 'groceries-daily-essentials',
  'dairy-products': 'groceries-daily-essentials',
  'fresh-produce': 'groceries-daily-essentials',
  'pantry-staples': 'groceries-daily-essentials',
  'household-essentials': 'groceries-daily-essentials',

  // PET SUPPLIES
  'pet-supplies': 'pet-supplies',
  'pet-food-treats': 'pet-supplies',
  'pet-toys-accessories': 'pet-supplies',

  // DIGITAL & SPECIALIZED
  'digital-specialized': 'digital-specialized',
  'software-digital-goods': 'digital-specialized',
  'gift-cards-vouchers': 'digital-specialized'
};

export function getProductParentCategory(product) {
  const cat = (product.category || '').toLowerCase().replace(/[^a-z0-9]/g, '-').trim();
  const subcat = (product.subcategory || '').toLowerCase().replace(/[^a-z0-9]/g, '-').trim();
  const title = (product.title || '').toLowerCase().trim();

  // Try subcategory map first
  if (subcat && PARENT_MAP[subcat]) return PARENT_MAP[subcat];
  // Try category map
  if (cat && PARENT_MAP[cat]) return PARENT_MAP[cat];

  // Try title keywords fallback
  if (title.includes('saree') || title.includes('kurti') || title.includes('lehenga') || title.includes('dress') || title.includes('fashion') || title.includes('fabric') || title.includes('printed') || title.includes('shoe') || title.includes('sandal') || title.includes('earring') || title.includes('necklace') || title.includes('handbag')) {
    return 'fashion-apparel';
  }
  if (title.includes('dinner set') || title.includes('cookware') || title.includes('bottle') || title.includes('kitchen') || title.includes('mixer') || title.includes('furniture') || title.includes('sofa') || title.includes('curtain') || title.includes('bedsheet')) {
    return 'home-furniture-decor';
  }
  if (title.includes('phone') || title.includes('watch') || title.includes('earbud') || title.includes('headphone') || title.includes('speaker') || title.includes('charger') || title.includes('cable') || title.includes('laptop') || title.includes('computer')) {
    return 'electronics-gadgets';
  }
  if (title.includes('makeup') || title.includes('skincare') || title.includes('shampoo') || title.includes('hair') || title.includes('lipstick') || title.includes('cream') || title.includes('serum')) {
    return 'health-beauty-wellness';
  }
  if (title.includes('gym') || title.includes('dumbbell') || title.includes('yoga') || title.includes('fitness') || title.includes('sport') || title.includes('cricket') || title.includes('football')) {
    return 'sports-outdoors-hobbies';
  }
  if (title.includes('rice') || title.includes('dal') || title.includes('spice') || title.includes('snack') || title.includes('biscuit') || title.includes('grocery') || title.includes('organic')) {
    return 'groceries-daily-essentials';
  }
  if (title.includes('pet') || title.includes('dog') || title.includes('cat food') || title.includes('dog food')) {
    return 'pet-supplies';
  }

  // Fallback for current CSV types
  if (cat === 'amazon') return 'fashion-apparel'; // current amazon products in CSV are sarees

  return 'fashion-apparel'; // Default fallback
}

export default function HomePage({ products = [], searchQuery = '', setSearchQuery, loading = false, activeCategory = 'all', setActiveCategory }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get('search');
  const { t } = useContext(LanguageContext);
  
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);

  const bannerContainerRef = useRef(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);



  const banners = [
    {
      id: 1,
      image: "/banners/banner1.png", 
      titleKey: "banner_1_title",
      targetCategory: "fashion-apparel"
    },
    {
      id: 2,
      image: "/banners/banner2.png", 
      titleKey: "banner_2_title",
      targetCategory: "electronics-gadgets"
    },
    {
      id: 3,
      image: "/banners/banner3.png", 
      titleKey: "banner_3_title",
      targetCategory: "health-beauty-wellness"
    },
    {
      id: 4,
      image: "/banners/banner4.png", 
      titleKey: "banner_4_title",
      targetCategory: "home-furniture-decor"
    },
    {
      id: 5,
      image: "/banners/banner5.png", 
      titleKey: "banner_5_title",
      targetCategory: "all"
    }
  ];

  // Auto-play banners
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => {
        const next = (prev + 1) % banners.length;
        if (bannerContainerRef.current) {
          const width = bannerContainerRef.current.offsetWidth;
          bannerContainerRef.current.scrollTo({
            left: next * width,
            behavior: 'smooth'
          });
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleBannerScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      if (index !== activeBannerIndex && index >= 0 && index < banners.length) {
        setActiveBannerIndex(index);
      }
    }
  };

  const handleDotClick = (idx) => {
    setActiveBannerIndex(idx);
    if (bannerContainerRef.current) {
      const width = bannerContainerRef.current.offsetWidth;
      bannerContainerRef.current.scrollTo({
        left: idx * width,
        behavior: 'smooth'
      });
    }
  };

  // Categories parsing (static premium categories list)
  const tabs = useMemo(() => {
    return [
      { id: 'all', name: 'All Products' },
      { id: 'electronics-gadgets', name: 'Electronics & Gadgets' },
      { id: 'fashion-apparel', name: 'Fashion & Apparel' },
      { id: 'home-furniture-decor', name: 'Home, Furniture & Decor' },
      { id: 'health-beauty-wellness', name: 'Health, Beauty & Wellness' },
      { id: 'sports-outdoors-hobbies', name: 'Sports, Outdoors & Hobbies' },
      { id: 'groceries-daily-essentials', name: 'Groceries & Daily Essentials' },
      { id: 'pet-supplies', name: 'Pet Supplies' },
      { id: 'digital-specialized', name: 'Digital & Specialized' },
      { id: 'affiliate', name: 'Affiliate Deals' },
      { id: 'own', name: 'Axansh Exclusive' }
    ];
  }, []);

  // Sync state during render to avoid cascading renders in useEffect
  if (searchParam !== prevSearchParam) {
    setPrevSearchParam(searchParam);
    if (searchParam) {
      const cleanParam = searchParam.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const matchedTab = tabs.find(t => t.id === cleanParam);
      setActiveCategory(matchedTab ? matchedTab.id : 'all');
    }
  }

  // Filter products based on search query, search parameter, or active category
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Filter by search parameter (category shortcut)
    if (searchParam) {
      const q = searchParam.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const NEW_CATS = ['electronics-gadgets', 'fashion-apparel', 'home-furniture-decor', 'health-beauty-wellness', 'sports-outdoors-hobbies', 'groceries-daily-essentials', 'pet-supplies', 'digital-specialized'];
      if (NEW_CATS.includes(q)) {
        result = result.filter(p => getProductParentCategory(p) === q);
      } else if (q === 'affiliate') {
        result = result.filter(p => p.productType?.toLowerCase() === 'affiliate');
      } else if (q === 'own') {
        result = result.filter(p => p.productType?.toLowerCase() === 'own');
      } else {
        result = result.filter(p => 
          (p.category && p.category.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(q)) ||
          (p.subcategory && p.subcategory.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(q)) ||
          (p.productType && p.productType.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(q)) ||
          p.title.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
        );
      }
      return result; // Skip category filters if explicit search parameter is active
    }

    // Filter by active category selection
    if (activeCategory !== 'all') {
      const NEW_CATS = ['electronics-gadgets', 'fashion-apparel', 'home-furniture-decor', 'health-beauty-wellness', 'sports-outdoors-hobbies', 'groceries-daily-essentials', 'pet-supplies', 'digital-specialized'];
      if (NEW_CATS.includes(activeCategory)) {
        result = result.filter(p => getProductParentCategory(p) === activeCategory);
      } else if (activeCategory === 'affiliate') {
        result = result.filter(p => p.productType?.toLowerCase() === 'affiliate');
      } else if (activeCategory === 'own') {
        result = result.filter(p => p.productType?.toLowerCase() === 'own');
      } else {
        result = result.filter(p => 
          (p.subcategory && p.subcategory.toLowerCase().replace(/[^a-z0-9]/g, '-') === activeCategory) ||
          (p.category && p.category.toLowerCase().replace(/[^a-z0-9]/g, '-') === activeCategory) ||
          (p.productType && p.productType.toLowerCase().replace(/[^a-z0-9]/g, '-') === activeCategory) ||
          p.title.toLowerCase().includes(activeCategory) ||
          (p.tags && p.tags.some(t => t.toLowerCase().replace(/[^a-z0-9]/g, '-') === activeCategory))
        );
      }
    }

    return result;
  }, [products, searchQuery, searchParam, activeCategory]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] antialiased font-sans pb-20 pt-[134px]">
      <SEO 
        title="Axansh Store - Lowest Prices on Fashion, Beauty & Home"
        description="Shop India's popular reselling app. Lowest prices on sarees, kurtis, accessories, home decor, electronics."
      />

      {/* South Asia Shipping Announcement */}
      <div className="w-full bg-[#ff2d55] text-white text-[10px] font-bold tracking-wider uppercase py-1.5 overflow-hidden mb-3 shadow-sm flex items-center">
        <div className="animate-[marquee_15s_linear_infinite] whitespace-nowrap">
          🚀 Free Premium Delivery Across India 🇮🇳 • Pakistan 🇵🇰 • Nepal 🇳🇵 • Sri Lanka 🇱🇰 🚀
        </div>
      </div>

      {/* Auto-playing Promotional Banner Carousel */}
      <div className="w-full px-3 mb-3 relative group">
        <div 
          ref={bannerContainerRef}
          onScroll={handleBannerScroll}
          className="w-full rounded-2xl flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ scrollBehavior: 'smooth' }}
        >
          {banners.map((banner) => (
            <div 
              key={banner.id}
              onClick={() => {
                if (banner.targetCategory) {
                  setActiveCategory(banner.targetCategory);
                  navigate('/');
                }
              }}
              className="w-full shrink-0 snap-center relative overflow-hidden aspect-[21/9] cursor-pointer hover:scale-[0.99] transition-transform duration-200 rounded-2xl"
            >
              <img 
                src={banner.image} 
                alt={t(banner.titleKey)} 
                className="w-full h-full object-fill rounded-2xl" 
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeBannerIndex === i 
                  ? 'bg-[#ff2d55] w-4' 
                  : 'bg-[#ff2d55]/30 hover:bg-[#ff2d55]/55'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Premium Image-Based Deals Grid */}
      <div className="w-full px-3 mb-4 grid grid-cols-2 gap-3">
        {[
          { 
            titleKey: "deal_mega_title", 
            descKey: "deal_mega_desc", 
            bgImage: "/mega_sale_banner.png",
            target: "all"
          },
          { 
            titleKey: "deal_budget_title", 
            descKey: "deal_budget_desc", 
            bgImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&fit=crop",
            target: "own"
          },
          { 
            titleKey: "deal_tech_title", 
            descKey: "deal_tech_desc", 
            bgImage: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80&fit=crop",
            target: "electronics"
          },
          { 
            titleKey: "deal_halfprice_title", 
            descKey: "deal_halfprice_desc", 
            bgImage: "/beauty_banner.png",
            target: "affiliate"
          }
        ].map((deal, idx) => (
          <div 
            key={idx}
            onClick={() => {
              setActiveCategory(deal.target);
              navigate('/');
            }}
            className="relative rounded-2xl flex flex-col justify-end p-3 h-[90px] sm:h-28 cursor-pointer shadow-sm hover:shadow-md transition-transform active:scale-[0.98] overflow-hidden group"
          >
            <img 
              src={deal.bgImage} 
              alt={t(deal.titleKey)}
              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-110 transition-transform duration-500"
            />
            {/* Dark Gradient for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none"></div>
            
            <div className="relative z-20 flex flex-col pointer-events-none">
              <span className="text-[#ffeaa7] text-[10px] font-black tracking-wider uppercase leading-none drop-shadow-md">{t(deal.titleKey)}</span>
              <span className="text-white text-[12px] font-black mt-1.5 leading-tight drop-shadow-lg">{t(deal.descKey)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="w-full px-3 space-y-4">
        
        {/* Heading / Search Status */}
        <div className="flex justify-between items-center px-1">
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">
            {searchQuery 
              ? t('search_results_for', { query: searchQuery }) 
              : searchParam 
                ? t('catalog_param', { param: t('cat_' + searchParam.replace(/-/g, '_')) || searchParam }) 
                : t('cat_' + activeCategory.replace(/-/g, '_'))
            }
          </h2>
          <span className="text-xs font-bold text-gray-400">
            {t('items_found', { count: filteredProducts.length })}
          </span>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-150 h-64 animate-pulse p-3 flex flex-col justify-between">
                <div className="bg-gray-100 w-full h-36 rounded-lg" />
                <div className="space-y-2">
                  <div className="bg-gray-100 h-3 w-3/4 rounded" />
                  <div className="bg-gray-100 h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center space-y-3">
            <span className="text-3xl block">📦</span>
            <h3 className="text-sm font-bold text-gray-800">{t('no_products_avail')}</h3>
            <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
              {t('no_products_desc')}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                if (setSearchQuery) setSearchQuery('');
                navigate('/', { replace: true });
              }}
              className="px-5 py-2 border border-[#ff2d55] text-[#ff2d55] rounded-lg text-xs font-bold hover:bg-[#ff2d55]/5 transition-colors"
            >
              {t('view_all_products')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>

      {/* Meesho Assurance Strip */}
      <div className="w-full px-3 mt-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-1.5 rounded-xl">
            <div className="w-8 h-8 bg-[#e6f6f2] rounded-full flex items-center justify-center text-[#03a685] shrink-0 border border-[#a3e2cf]">
              <Truck size={14} />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-900 leading-tight">{t('assurance_delivery_title')}</h4>
              <p className="text-[8px] text-[#03a685] font-black uppercase tracking-wider">{t('assurance_delivery_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-1.5 rounded-xl">
            <div className="w-8 h-8 bg-[#e6f6f2] rounded-full flex items-center justify-center text-[#03a685] shrink-0 border border-[#a3e2cf]">
              <Award size={14} />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-900 leading-tight">{t('assurance_price_title')}</h4>
              <p className="text-[8px] text-[#03a685] font-black uppercase tracking-wider">{t('assurance_price_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-1.5 rounded-xl">
            <div className="w-8 h-8 bg-[#e6f6f2] rounded-full flex items-center justify-center text-[#03a685] shrink-0 border border-[#a3e2cf]">
              <Headphones size={14} />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-gray-900 leading-tight">{t('assurance_return_title')}</h4>
              <p className="text-[8px] text-[#03a685] font-black uppercase tracking-wider">{t('assurance_return_desc')}</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}