import React, { useMemo, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from './SEO';
import { LanguageContext } from '../context/LanguageContext';

const ALL_CATEGORIES = [
  {
    id: 'electronics-gadgets',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&fit=crop',
    subcategories: [
      { name: 'Mobiles', tag: 'mobile-accessories', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80&fit=crop' },
      { name: 'Laptops', tag: 'computers-laptops', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&q=80&fit=crop' },
      { name: 'Smart Home', tag: 'smart-home-iot', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=300&q=80&fit=crop' },
      { name: 'Audio', tag: 'audio-video', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&q=80&fit=crop' }
    ]
  },
  {
    id: 'fashion-apparel',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80&fit=crop',
    subcategories: [
      { name: "Clothing", tag: 'clothing', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80&fit=crop' },
      { name: 'Footwear', tag: 'footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80&fit=crop' },
      { name: 'Accessories', tag: 'fashion-accessories', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80&fit=crop' }
    ]
  },
  {
    id: 'home-furniture-decor',
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80&fit=crop',
    subcategories: [
      { name: 'Furniture', tag: 'furniture', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&q=80&fit=crop' },
      { name: 'Decor', tag: 'home-decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&q=80&fit=crop' },
      { name: 'Kitchen', tag: 'kitchen-dining', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&q=80&fit=crop' }
    ]
  },
  {
    id: 'health-beauty-wellness',
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&fit=crop',
    subcategories: [
      { name: 'Skincare', tag: 'skincare-makeup', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80&fit=crop' },
      { name: 'Haircare', tag: 'haircare', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&q=80&fit=crop' },
      { name: 'Personal Care', tag: 'personal-care-vitamins', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80&fit=crop' }
    ]
  },
  {
    id: 'sports-outdoors-hobbies',
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80&fit=crop',
    subcategories: [
      { name: 'Fitness', tag: 'fitness-equipment', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&q=80&fit=crop' },
      { name: 'Outdoor', tag: 'outdoor-recreation', image: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=300&q=80&fit=crop' },
      { name: 'Hobbies', tag: 'hobbies-creative-arts', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&q=80&fit=crop' }
    ]
  },
  {
    id: 'groceries-daily-essentials',
    name: 'Groceries',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80&fit=crop',
    subcategories: [
      { name: 'Fresh', tag: 'fresh-produce', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80&fit=crop' },
      { name: 'Staples', tag: 'pantry-staples', image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&q=80&fit=crop' },
      { name: 'Beverages', tag: 'beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&q=80&fit=crop' },
      { name: 'Household', tag: 'household-essentials', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&q=80&fit=crop' }
    ]
  },
  {
    id: 'pet-supplies',
    name: 'Pets',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=80&fit=crop',
    subcategories: [
      { name: 'Pet Food', tag: 'pet-food-treats', image: 'https://images.unsplash.com/photo-1589722244358-f0ec20de739e?w=300&q=80&fit=crop' },
      { name: 'Toys', tag: 'pet-toys-accessories', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&q=80&fit=crop' }
    ]
  },
  {
    id: 'digital-specialized',
    name: 'Digital',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80&fit=crop',
    subcategories: [
      { name: 'Software', tag: 'software-digital-goods', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&q=80&fit=crop' },
      { name: 'Gift Cards', tag: 'gift-cards-vouchers', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=80&fit=crop' }
    ]
  }
];

export default function Categories({ products = [] }) {
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);
  const [activeCatId, setActiveCatId] = useState(ALL_CATEGORIES[0].id);

  const categories = useMemo(() => {
    return ALL_CATEGORIES.map(parentCat => {
      const updatedSubcategories = parentCat.subcategories.map(sub => {
        const match = products.find(p => {
          const pSub = (p.subcategory || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
          const pCat = (p.category || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
          const pTitle = (p.title || '').toLowerCase();
          const subTag = sub.tag.toLowerCase();
          const subName = sub.name.toLowerCase();
          return pSub === subTag || pCat === subTag || pTitle.includes(subName);
        });
        return { ...sub, image: match?.image || sub.image };
      });
      return { ...parentCat, subcategories: updatedSubcategories };
    });
  }, [products]);

  const activeCategory = categories.find(c => c.id === activeCatId) || categories[0];

  const handleSubcategoryClick = (subTag) => {
    navigate(`/?search=${subTag}`);
  };

  return (
    <div className="bg-white min-h-screen pt-[60px] pb-[70px] font-sans flex flex-col">
      <SEO 
        title="Amazon Style Categories"
        description="Browse through standard e-commerce product categories."
      />

      {/* ── HEADER (Amazon Style) ── */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 sticky top-[60px] z-40 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <h1 className="text-[16px] font-bold text-[#0f1111]">All Categories</h1>
      </div>

      {/* ── DUAL PANE LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-105px)]">
          
          {/* ══ LEFT SIDEBAR ══ */}
          <div className="w-[85px] overflow-y-auto no-scrollbar bg-[#f0f2f2] border-r border-gray-200 flex flex-col">
              {categories.map(cat => {
                  const isActive = activeCatId === cat.id;
                  const translatedCatName = t('cat_' + cat.id.replace(/-/g, '_')) || cat.name;
                  
                  return (
                      <button 
                          key={cat.id}
                          onClick={() => setActiveCatId(cat.id)}
                          className={`w-full flex flex-col items-center py-3 px-1 border-b border-gray-200/50 transition-colors ${
                              isActive 
                                ? 'bg-white border-l-[3px] border-l-[#008296]' 
                                : 'bg-[#f0f2f2] border-l-[3px] border-l-transparent'
                          }`}
                      >
                          {/* Circular Category Icon with thin border */}
                          <div className={`w-[45px] h-[45px] rounded-full overflow-hidden mb-1.5 ${isActive ? 'border-[1.5px] border-[#008296]' : 'border border-gray-300'}`}>
                              <img 
                                  src={cat.image} 
                                  alt={translatedCatName} 
                                  className="w-full h-full object-cover mix-blend-multiply" 
                                  loading="lazy"
                              />
                          </div>
                          
                          {/* Category Name */}
                          <span className={`text-[10px] text-center leading-[1.2] px-0.5 ${
                              isActive ? 'font-bold text-[#0f1111]' : 'font-medium text-[#0f1111]'
                          }`}>
                              {translatedCatName}
                          </span>
                      </button>
                  )
              })}
          </div>

          {/* ══ RIGHT CONTENT AREA ══ */}
          <div className="flex-1 overflow-y-auto no-scrollbar bg-white p-3">
              
              {/* Category Hero Banner */}
              <div className="w-full h-[100px] rounded-[4px] overflow-hidden mb-3 relative bg-gray-100">
                  <img src={activeCategory.image} alt={activeCategory.name} className="w-full h-full object-cover" />
                  {/* Subtle dark gradient just for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-3">
                      <h2 className="text-white font-bold text-[18px] leading-tight">
                          {t('cat_' + activeCategory.id.replace(/-/g, '_')) || activeCategory.name}
                      </h2>
                  </div>
              </div>

              {/* Subcategories Section Title */}
              <h3 className="text-[13px] font-bold text-[#0f1111] mb-3 px-1">
                  Shop by Category
              </h3>

              {/* Subcategories Grid (3-columns, simple circles) */}
              <div className="grid grid-cols-3 gap-y-5 gap-x-2 pb-8">
                  {activeCategory.subcategories.map(sub => {
                      const translatedSubName = t('subcat_' + sub.tag.replace(/-/g, '_')) || sub.name;
                      return (
                          <div 
                              key={sub.tag}
                              onClick={() => handleSubcategoryClick(sub.tag)}
                              className="flex flex-col items-center gap-1.5 cursor-pointer"
                          >
                              {/* Simple Circular Image */}
                              <div className="w-[68px] h-[68px] rounded-full overflow-hidden bg-[#f7f7f7] border border-gray-200">
                                  <img 
                                      src={sub.image} 
                                      alt={translatedSubName} 
                                      className="w-full h-full object-cover" 
                                      loading="lazy"
                                  />
                              </div>
                              
                              {/* Simple Plain Text */}
                              <span className="text-[11px] font-medium text-[#0f1111] text-center leading-tight line-clamp-2 px-1">
                                  {translatedSubName}
                              </span>
                          </div>
                      )
                  })}
              </div>
          </div>
      </div>
    </div>
  );
}
