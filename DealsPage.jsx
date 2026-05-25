import React, { useState, useRef, useContext, useEffect } from 'react';
import { ExternalLink, ChevronRight, Search, Gift, Bell, Star, X, Zap, TrendingUp, Shield, Clock } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import SEO from './SEO';

/* ══════════════════════════════════════════════════════════
   FEATURED TOP PICKS (Horizontal Carousel)
══════════════════════════════════════════════════════════ */
const FEATURED = [
  { id: 'f1', name: 'Amazon',     emoji: '🛒', color: '#FF9900', offer: 'Up to 80% OFF', sub: 'Great Indian Sale', url: 'https://www.amazon.in',      badge: 'SALE', cat: 'Shopping' },
  { id: 'f2', name: 'Zomato',     emoji: '🍕', color: '#E23744', offer: 'Flat 50% Off',  sub: 'On food order', url: 'https://www.zomato.com',    badge: 'FOOD', cat: 'Food' },
  { id: 'f3', name: 'Netflix',    emoji: '🎬', color: '#E50914', offer: '₹149 / Month',  sub: 'Mobile HD plan', url: 'https://www.netflix.com',   badge: 'OTT', cat: 'Entertainment' },
  { id: 'f4', name: 'Groww',      emoji: '📈', color: '#000000', offer: 'Free Demat',    sub: 'Invest from ₹100', url: 'https://groww.in',          badge: 'INVEST', cat: 'Investments' },
  { id: 'f5', name: 'Hostinger',  emoji: '🌐', color: '#673DE6', offer: '₹79 / Month',  sub: 'Hosting + domain', url: 'https://www.hostinger.in',  badge: 'HOSTING', cat: 'Hosting' },
  { id: 'f6', name: 'Dream11',    emoji: '🏏', color: '#1a73e8', offer: '100% Bonus',    sub: 'First deposit', url: 'https://www.dream11.com',   badge: 'GAMING', cat: 'Gaming' },
  { id: 'f7', name: 'KreditBee',  emoji: '💸', color: '#059669', offer: 'Loan ₹5L',      sub: '0% processing fee', url: 'https://kreditbee.in',      badge: 'LOAN', cat: 'Loans' },
  { id: 'f8', name: 'Uber',       emoji: '🚗', color: '#000000', offer: '50% Off Ride',  sub: 'First ride ₹150', url: 'https://www.uber.com/in/en',badge: 'RIDES', cat: 'Ride Booking' },
];

/* ══════════════════════════════════════════════════════════
   25 CATEGORIES
══════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id: 'shopping',       label: 'Shopping',        emoji: '🛒', color: '#FF9900' },
  { id: 'travel',         label: 'Travel',           emoji: '🧳', color: '#E03D37' },
  { id: 'food',           label: 'Food',             emoji: '🍔', color: '#FC8019' },
  { id: 'finance',        label: 'Finance',          emoji: '💰', color: '#15803d' },
  { id: 'recharge',       label: 'Recharge',         emoji: '📱', color: '#5F259F' },
  { id: 'entertainment',  label: 'Entertainment',    emoji: '🎬', color: '#E50914' },
  { id: 'fashion',        label: 'Fashion',          emoji: '👗', color: '#FF3F6C' },
  { id: 'electronics',    label: 'Electronics',      emoji: '💻', color: '#0284c7' },
  { id: 'hotels',         label: 'Hotels',           emoji: '🏨', color: '#003580' },
  { id: 'flights',        label: 'Flights',          emoji: '✈️', color: '#090CAC' },
  { id: 'insurance',      label: 'Insurance',        emoji: '🛡️', color: '#d97706' },
  { id: 'loans',          label: 'Loans',            emoji: '💵', color: '#059669' },
  { id: 'credit-cards',   label: 'Credit Cards',     emoji: '💳', color: '#7c3aed' },
  { id: 'investments',    label: 'Investments',      emoji: '📈', color: '#000000' },
  { id: 'hosting',        label: 'Hosting',          emoji: '🌐', color: '#673DE6' },
  { id: 'ai-tools',       label: 'AI Tools',         emoji: '🤖', color: '#10b981' },
  { id: 'education',      label: 'Education',        emoji: '📚', color: '#0f766e' },
  { id: 'medicine',       label: 'Medicine',         emoji: '💊', color: '#0891b2' },
  { id: 'groceries',      label: 'Groceries',        emoji: '🥦', color: '#16a34a' },
  { id: 'ride-booking',   label: 'Ride Booking',     emoji: '🚗', color: '#000000' },
  { id: 'bills-payments', label: 'Bills & Payments', emoji: '🧾', color: '#4285F4' },
  { id: 'beauty',         label: 'Beauty',           emoji: '💄', color: '#FC2779' },
  { id: 'gaming',         label: 'Gaming',           emoji: '🎮', color: '#7c3aed' },
  { id: 'home-services',  label: 'Home Services',    emoji: '🏠', color: '#0369a1' },
  { id: 'offers-deals',   label: 'Offers & Deals',   emoji: '🎁', color: '#f59e0b' },
];

/* ══════════════════════════════════════════════════════════
   PLATFORMS (4 per category, with badge)
══════════════════════════════════════════════════════════ */
const PLATFORMS = {
  shopping: [
    { id: 'amazon',    name: 'Amazon',    emoji: '🛒', color: '#FF9900', url: 'https://www.amazon.in?&linkCode=ll2&tag=axanshmart-21&linkId=8fb2124caa6fa73100f2f1ea46fc9a9f&ref_=as_li_ss_tl',        badge: 'HOT',     offers: ['Great Indian Sale — Up to 80% off', 'Prime exclusive extra 10% off', 'Lightning deals every hour'] },
    { id: 'flipkart',  name: 'Flipkart',  emoji: '🏬', color: '#2874F0', url: 'https://www.flipkart.com',     badge: 'SALE',    offers: ['Big Billion Days — Up to 90% off', '0% No-cost EMI on top brands', 'SuperCoin rewards every order'] },
    { id: 'snapdeal',  name: 'Snapdeal',  emoji: '🏷️', color: '#E40000', url: 'https://www.snapdeal.com',     badge: 'BUDGET',  offers: ['Unbox Zindagi Sale — 90% off', 'Products under ₹199 / ₹499 / ₹999', '3 lakh+ verified sellers'] },
    { id: 'meesho',    name: 'Meesho',    emoji: '🛍️', color: '#9b59b6', url: 'https://meesho.com',           badge: 'FREE SHIP',offers: ['Everything from ₹99 onwards', 'Free shipping on every order', 'Resell & earn — 0% commission'] },
  ],
  travel: [
    { id: 'mmt',       name: 'MakeMyTrip',emoji: '✈️', color: '#E03D37', url: 'https://www.makemytrip.com',   badge: 'HOT',     offers: ['Up to 20% off with MMTBLACK', 'Holiday packages from ₹4,999/person', 'Flights + Hotel combo save ₹5000'] },
    { id: 'goibibo',   name: 'Goibibo',   emoji: '🗺️', color: '#00BC44', url: 'https://www.goibibo.com',      badge: 'REWARDS', offers: ['GoCash rewards on every booking', 'Bus, Train & Flights in one app', 'Flash hotel sales up to 60% off'] },
    { id: 'emt',       name: 'EaseMyTrip',emoji: '🛫', color: '#090CAC', url: 'https://www.easemytrip.com',   badge: 'NO FEE',  offers: ['Zero convenience fee always', 'International flights cheap fares', 'Flat ₹350 off — first booking'] },
    { id: 'cleartrip', name: 'Cleartrip', emoji: '🌍', color: '#0066FF', url: 'https://www.cleartrip.com',    badge: 'LOCK',    offers: ['Fare Lock — hold price 48 hrs', 'Cancel anytime flexible tickets', 'Trip Money cashback rewards'] },
  ],
  food: [
    { id: 'zomato',    name: 'Zomato',    emoji: '🍕', color: '#E23744', url: 'https://www.zomato.com',       badge: '50% OFF', offers: ['Flat 50% off up to ₹100', 'Zomato Gold — free delivery always', 'Everyday home-style meals ₹89'] },
    { id: 'swiggy',    name: 'Swiggy',    emoji: '🍔', color: '#FC8019', url: 'https://www.swiggy.com',       badge: 'FAST',    offers: ['60% off on first 3 orders', 'Swiggy One unlimited free delivery', '10-min Instamart grocery'] },
    { id: 'eatsure',   name: 'EatSure',   emoji: '🍱', color: '#e67e22', url: 'https://eatsure.com',          badge: 'FRESH',   offers: ['Cloud kitchen meals from ₹89', 'Single restaurant, no mix-orders', 'Up to 30% off always'] },
    { id: 'magicpin',  name: 'Magicpin',  emoji: '📍', color: '#e91e8c', url: 'https://magicpin.in',          badge: 'LOCAL',   offers: ['30% cashback at local eateries', 'Discover hidden local restaurants', 'Earn points at 200k+ stores'] },
  ],
  finance: [
    { id: 'groww',     name: 'Groww',     emoji: '📈', color: '#000000', url: 'https://groww.in',             badge: 'START',   offers: ['Start SIP from just ₹100', 'Zero commission direct mutual funds', '₹0 stock trading account opening'] },
    { id: 'upstox',    name: 'Upstox',    emoji: '📊', color: '#6840D1', url: 'https://upstox.com',           badge: '₹200',    offers: ['Free demat account in 5 mins', '₹200 signup bonus on first trade', 'Flat ₹20 per order brokerage'] },
    { id: 'bankbazaar',name: 'BankBazaar',emoji: '🏦', color: '#F05A28', url: 'https://www.bankbazaar.com',   badge: 'COMPARE', offers: ['50+ lenders — best loan rate', 'Free CIBIL score check instantly', 'Best cashback credit card finder'] },
    { id: 'gromo',     name: 'GroMo',     emoji: '🤝', color: '#00C853', url: 'https://gromo.in',             badge: 'EARN',    offers: ['Earn up to ₹1 Lakh/month', 'Free POSP license + certification', 'Commission payout within 48 hrs'] },
  ],
  recharge: [
    { id: 'paytm',     name: 'Paytm',     emoji: '💙', color: '#00BAF2', url: 'https://paytm.com',            badge: 'CASHBACK',offers: ['5% cashback on mobile recharge', 'DTH & broadband recharge too', 'Electricity & gas bill payments'] },
    { id: 'phonepe',   name: 'PhonePe',   emoji: '💜', color: '#5F259F', url: 'https://phonepe.com',          badge: 'WIN',     offers: ['Scratch card on every recharge', 'All operators — Airtel, Vi, Jio', 'Insurance & investments in-app'] },
    { id: 'airtel',    name: 'Airtel',    emoji: '⭕', color: '#e30000', url: 'https://airtel.in/recharge',    badge: 'DATA',    offers: ['Double data on select plans', 'Airtel Thanks rewards program', 'Wi-Fi calling included'] },
    { id: 'freecharge',name: 'Freecharge',emoji: '🟡', color: '#F7B731', url: 'https://freecharge.in',         badge: 'OFFER',   offers: ['Instant recharge all operators', 'Up to ₹30 off on ₹99+ recharge', 'FreeCharge Pay for shopping too'] },
  ],
  entertainment: [
    { id: 'netflix',   name: 'Netflix',   emoji: '🎬', color: '#E50914', url: 'https://www.netflix.com',      badge: 'ORIGINALS',offers: ['Mobile plan just ₹149/month', 'New originals every week', 'Download & watch offline anytime'] },
    { id: 'prime',     name: 'Prime Video',emoji:'🔵', color: '#00A8E0', url: 'https://www.amazon.in/prime',   badge: 'BUNDLE',  offers: ['Prime Video + shopping benefits', '₹299 for 3 months — best deal', 'Exclusive Indian originals'] },
    { id: 'hotstar',   name: 'Hotstar',   emoji: '⭐', color: '#1f80e0', url: 'https://www.hotstar.com',      badge: 'SPORTS',  offers: ['IPL live + Disney + Star', 'Mobile plan ₹299/year only', 'All ICC cricket matches live'] },
    { id: 'sonyliv',   name: 'Sony LIV',  emoji: '📺', color: '#0a407a', url: 'https://www.sonyliv.com',      badge: 'WWE',     offers: ['WWE, UEFA, Bollywood all here', 'LIV Sports — cricket & football', 'Yearly plan ₹999 only'] },
  ],
  fashion: [
    { id: 'myntra',    name: 'Myntra',    emoji: '👗', color: '#FF3F6C', url: 'https://www.myntra.com',        badge: 'TRENDING',offers: ['End of Reason Sale — 80% off', 'Insider early access + extra 10%', '30-day free returns always'] },
    { id: 'ajio',      name: 'AJIO',      emoji: '🎽', color: '#E94A35', url: 'https://www.ajio.com',          badge: 'BOLD',    offers: ['Big Bold Sale — 85% off 2L styles', 'Puma, H&M, Levis & 1000+ brands', 'Free delivery on ₹599+'] },
    { id: 'nykfashion',name: 'Nykaa Fashion',emoji:'💋',color:'#FC2779', url:'https://www.nykaafashion.com',   badge: 'LUXURY',  offers: ['Luxury fashion at discount', 'International brands delivered India', 'Flat 40% off new arrivals'] },
    { id: 'limeroad',  name: 'LimeRoad',  emoji: '🟢', color: '#4CAF50', url: 'https://www.limeroad.com',      badge: 'INDIE',   offers: ['Indie & local designers 70% off', 'Styled by real users', 'Free delivery above ₹599'] },
  ],
  electronics: [
    { id: 'amzelec',   name: 'Amazon Electronics',emoji:'🛒',color:'#FF9900',url:'https://www.amazon.in/electronics',badge:'FLASH', offers:['Up to 60% off on laptops & phones','Prime deal extra 10% off devices','No-cost EMI on ₹5000+'] },
    { id: 'fkelec',    name: 'Flipkart Electronics',emoji:'🏬',color:'#2874F0',url:'https://www.flipkart.com/electronics',badge:'MOBILES',offers:['Mobiles Sale — top brands 40% off','SmartTVs from ₹7,999 with exchange','Extra ₹2000 off with Axis card'] },
    { id: 'croma',     name: 'Croma',     emoji: '⚡', color: '#4CAF50', url: 'https://www.croma.com',          badge: 'GENUINE', offers: ['Tata-owned — 100% genuine', 'Exchange old devices for max value', 'Extended warranty on all products'] },
    { id: 'vijaysales',name: 'Vijay Sales',emoji:'🔌',color: '#c0392b', url: 'https://www.vijaysales.com',      badge: 'HOME',    offers: ['Best price on ACs & refrigerators', 'Free home installation service', 'Price match guarantee'] },
  ],
  hotels: [
    { id: 'booking',   name: 'Booking.com',emoji:'🏨',color: '#003580', url: 'https://www.booking.com',        badge: 'GENIUS',  offers: ['Genius loyalty — 20% off always', 'Free cancellation on most stays', 'Last-minute tonight deals'] },
    { id: 'agoda',     name: 'Agoda',     emoji: '🌏', color: '#CC0000', url: 'https://www.agoda.com',          badge: 'SECRET',  offers: ['Best hotel rates across Asia', 'Agoda Cash earned every booking', 'Members-only 60% off secret deals'] },
    { id: 'oyo',       name: 'OYO',       emoji: '🔴', color: '#EE2222', url: 'https://www.oyorooms.com',       badge: 'BUDGET',  offers: ['Budget to premium PAN India', 'Flat 50% off on OYO app always', 'OYO Life for long-term stay'] },
    { id: 'treebo',    name: 'Treebo',    emoji: '🌲', color: '#0da862', url: 'https://treebo.com',             badge: 'ASSURED', offers: ['Clean & safe premium budget', 'Flat 20% off every stay always', '100% verified clean rooms'] },
  ],
  flights: [
    { id: 'emt2',      name: 'EaseMyTrip',emoji: '🛫', color: '#090CAC', url: 'https://www.easemytrip.com',    badge: 'NO FEE',  offers: ['Zero convenience fee flights', 'Domestic & international both', 'Flat ₹350 off first booking'] },
    { id: 'mmt2',      name: 'MakeMyTrip',emoji: '✈️', color: '#E03D37', url: 'https://www.makemytrip.com/flights',badge:'HOT',  offers: ['MMTBLACK up to 20% off fares', 'Fare calendar — cheapest day finder', 'Flexible date ticket options'] },
    { id: 'goibibo2',  name: 'Goibibo',   emoji: '🗺️', color: '#00BC44', url: 'https://www.goibibo.com/flights',badge:'COINS',   offers: ['GoCash coins on every flight', 'Price alert — notify when fares drop', 'Seat & meal selection in-app'] },
    { id: 'ixigo',     name: 'ixigo',     emoji: '🧭', color: '#FF6600', url: 'https://www.ixigo.com/flights',  badge: 'AI FARE', offers: ['AI-powered cheapest fare finder', 'Predict fare: buy now or wait?', 'Extra 10% off on ixigo app'] },
  ],
  insurance: [
    { id: 'policybazaar',name:'Policybazaar',emoji:'🛡️',color:'#d97706',url:'https://www.policybazaar.com',    badge: '#1',      offers: ['₹1Cr term plan at ₹674/month', 'Family health from ₹6,000/year', 'Car insurance save up to 85%'] },
    { id: 'acko',      name: 'Acko',      emoji: '🟣', color: '#7B2D8B', url: 'https://www.acko.com',           badge: 'INSTANT', offers: ['Zero commission — direct insurer', 'Instant claims no paperwork', 'Car & bike insurance online'] },
    { id: 'digit',     name: 'Digit',     emoji: '🟢', color: '#0CAF60', url: 'https://www.godigit.com',        badge: 'HEALTH',  offers: ['Health covers OPD + COVID', 'Travel insurance all trips', 'Easy digital claim in minutes'] },
    { id: 'nivabupa',  name: 'Niva Bupa', emoji: '❤️', color: '#e91e63', url: 'https://www.nivabupa.com',       badge: 'FAMILY',  offers: ['No room rent limit ever', 'Family floater cover all ages', 'Cashless at 10,000+ hospitals'] },
  ],
  loans: [
    { id: 'kreditbee', name: 'KreditBee', emoji: '🐝', color: '#059669', url: 'https://kreditbee.in',           badge: 'INSTANT', offers: ['Instant loan up to ₹5 Lakh', '100% online — no branch visit', '0% processing fee for new users'] },
    { id: 'moneyview', name: 'MoneyView', emoji: '💵', color: '#00897B', url: 'https://moneyview.in',            badge: 'LOW RATE',offers: ['Loan in 24 hours to account', 'Rate from 1.33% per month', 'Flexible 3–60 month tenure'] },
    { id: 'navi',      name: 'Navi',      emoji: '🚀', color: '#7c3aed', url: 'https://navi.com',                badge: 'HOT',     offers: ['Zero collateral personal loan', 'Up to ₹20 Lakh instant disbursal', 'Low interest rate from 9.9%'] },
    { id: 'indialends',name: 'IndiaLends',emoji: '🏦', color: '#1565C0', url: 'https://indialends.com',          badge: 'COMPARE', offers: ['Compare 50+ lenders instantly', 'Home, car & personal loans', 'Rate from 10.49% per annum'] },
  ],
  'credit-cards': [
    { id: 'bbcard',    name: 'BankBazaar',emoji: '🏦', color: '#F05A28', url: 'https://www.bankbazaar.com/credit-card.html',badge:'BONUS',offers:['Compare 100+ credit cards free','Up to ₹5000 welcome gift bonus','Instant approval in 2 minutes'] },
    { id: 'onecard',   name: 'OneCard',   emoji: '⚫', color: '#000000', url: 'https://getonecard.app',           badge: 'METAL',   offers: ['Metal card — zero joining fee', '5X rewards on top 2 categories', 'Full app control — freeze anytime'] },
    { id: 'axisace',   name: 'Axis ACE',  emoji: '🔴', color: '#d32f2f', url: 'https://www.axisbank.com',         badge: 'LIFETIME',offers: ['2% flat cashback on all spends', 'Lifetime free card always', '5% off via Google Pay'] },
    { id: 'hdfcmil',   name: 'HDFC Millennia',emoji:'🔵',color:'#005BAA',url:'https://www.hdfcbank.com',          badge: 'PREMIUM', offers: ['5% cashback Amazon + Flipkart', 'CashPoints redeemable anytime', 'Lounge access 4x per year'] },
  ],
  investments: [
    { id: 'groww2',    name: 'Groww',     emoji: '📈', color: '#000000', url: 'https://groww.in',                badge: 'SIP ₹100', offers: ['SIP from ₹100 — any mutual fund', 'Zero commission direct MF plans', 'US stocks available on Groww'] },
    { id: 'zerodha',   name: 'Zerodha',   emoji: '⚡', color: '#387ED1', url: 'https://zerodha.com',              badge: '#1 BROKER',offers: ['India\'s #1 stockbroker', '₹0 brokerage on delivery trades', 'Kite app — best trading platform'] },
    { id: 'etmoney',   name: 'ET Money',  emoji: '📊', color: '#FF6B00', url: 'https://www.etmoney.com',          badge: 'TAX SAVE', offers: ['Smart deposit — best FD rates', 'Tax-saving ELSS mutual funds', 'NPS for extra 80CCD deduction'] },
    { id: 'kuvera',    name: 'Kuvera',    emoji: '💡', color: '#00BFA5', url: 'https://kuvera.in',                badge: 'FREE',    offers: ['100% free direct fund investing', 'Goal-based investment planning', 'Family & NRI accounts supported'] },
  ],
  hosting: [
    { id: 'hostinger', name: 'Hostinger', emoji: '🌐', color: '#673DE6', url: 'https://www.hostinger.in',        badge: '₹79/MO',  offers: ['Hosting from ₹79/mo + free domain', 'Free SSL on every plan', '99.9% uptime LiteSpeed servers'] },
    { id: 'godaddy',   name: 'GoDaddy',   emoji: '🟢', color: '#1bdbdb', url: 'https://www.godaddy.com',         badge: 'POPULAR',  offers: ['Domain + hosting bundle deal', '30% off on first-year purchase', '24/7 expert support in Hindi'] },
    { id: 'bluehost',  name: 'Bluehost',  emoji: '🔵', color: '#2075BC', url: 'https://www.bluehost.in',         badge: 'WP BEST',  offers: ['WordPress officially recommended', 'Unlimited sites from ₹179/mo', 'Free domain + SSL included'] },
    { id: 'bigrock',   name: 'BigRock',   emoji: '🪨', color: '#f57c00', url: 'https://www.bigrock.in',          badge: 'INDIA',   offers: ['Domain ₹99 + free SSL cert', 'Indian support team 24/7', 'Email hosting from ₹99/yr'] },
  ],
  'ai-tools': [
    { id: 'chatgpt',   name: 'ChatGPT Plus',emoji:'🤖',color:'#10a37f',url:'https://chat.openai.com',           badge: 'GPT-4o',  offers: ['GPT-4o + DALL-E image gen', 'Advanced data analysis mode', 'Priority access to new features'] },
    { id: 'claude',    name: 'Claude Pro', emoji: '🧠', color: '#cc785c', url: 'https://claude.ai',              badge: '200K CTX', offers: ['Longest context window — 200k', 'Best for coding & writing tasks', 'Projects & memory workspace'] },
    { id: 'gemini',    name: 'Gemini Advanced',emoji:'🌟',color:'#4285F4',url:'https://gemini.google.com',      badge: 'GOOGLE',  offers: ['Google\'s most capable AI', '1 TB Drive + Google One included', 'Multimodal — text, image, code'] },
    { id: 'perplexity',name: 'Perplexity', emoji: '🔍', color: '#000000', url: 'https://perplexity.ai',          badge: 'AI SEARCH',offers: ['AI search with cited sources', 'Real-time web + academic search', 'Pro plan unlimited searches'] },
  ],
  education: [
    { id: 'unacademy', name: 'Unacademy', emoji: '📖', color: '#0a0a0a', url: 'https://unacademy.com',           badge: '#1 PREP',  offers: ['UPSC, JEE, NEET, SSC & more', '50% off subscription plans', 'Live classes + recorded sessions'] },
    { id: 'udemy',     name: 'Udemy',     emoji: '🎓', color: '#a435f0', url: 'https://www.udemy.com',           badge: 'GLOBAL',  offers: ['200,000+ courses in 75 languages', 'Top courses from ₹449 only', 'Lifetime access on all purchases'] },
    { id: 'coursera',  name: 'Coursera',  emoji: '🏛️', color: '#0056D2', url: 'https://www.coursera.org',       badge: 'DEGREE',  offers: ['Degrees from top universities', '7-day free trial on all courses', 'Certificates from Google, Meta, IBM'] },
    { id: 'pw',        name: 'Physics Wallah',emoji:'⚡',color:'#FF6B00',url:'https://pw.live',                  badge: 'BUDGET',  offers: ['JEE & NEET batches from ₹999', 'Most affordable coaching', 'Free YouTube content + PW app'] },
  ],
  medicine: [
    { id: 'onemg',     name: '1mg',       emoji: '❤️', color: '#e02020', url: 'https://www.1mg.com',             badge: 'VERIFIED', offers: ['Flat 20% off + free delivery ₹199+', 'Tata-backed — 100% genuine', 'Online doctor consultation ₹199'] },
    { id: 'pharmeasy', name: 'PharmEasy', emoji: '💊', color: '#7c3aed', url: 'https://pharmeasy.in',            badge: 'FAST',    offers: ['Flat 25% off all medicines', 'Lab tests at home booking', 'Fastest delivery — same day'] },
    { id: 'netmeds',   name: 'Netmeds',   emoji: '🟢', color: '#2e7d32', url: 'https://www.netmeds.com',         badge: 'GENERIC', offers: ['Flat 20% off generic medicines', 'Reliance-backed pharmacy', '24/7 pharmacist helpline'] },
    { id: 'apollo',    name: 'Apollo',    emoji: '🔵', color: '#0277BD', url: 'https://apollopharmacy.in',        badge: 'TRUSTED', offers: ['15% off + Circle Points earned', 'Apollo 24|7 doctor video call', 'Chain pharmacy — 5000+ stores'] },
  ],
  groceries: [
    { id: 'blinkit',   name: 'Blinkit',   emoji: '⚡', color: '#f8c700', url: 'https://blinkit.com',             badge: '10 MIN',  offers: ['Grocery in 10 minutes flat', 'Free delivery on first order', 'Fresh fruits & veggies daily'] },
    { id: 'bigbasket', name: 'BigBasket', emoji: '🧺', color: '#84C225', url: 'https://www.bigbasket.com',       badge: 'SCHEDULE',offers: ['Scheduled delivery any time slot', 'BB Royal premium quality', 'Flat 20% off first order'] },
    { id: 'zepto',     name: 'Zepto',     emoji: '🚀', color: '#9333ea', url: 'https://www.zeptonow.com',         badge: 'FREE 3X', offers: ['10-minute grocery delivery', 'Free delivery first 3 orders', '7,500+ products in-stock always'] },
    { id: 'instamart', name: 'Instamart', emoji: '🍅', color: '#FC8019', url: 'https://www.swiggy.com/instamart',badge: 'SWIGGY',  offers: ['Instant grocery from dark stores', 'Reorder favourites in 2 taps', 'Exclusive member pricing'] },
  ],
  'ride-booking': [
    { id: 'uber',      name: 'Uber',      emoji: '🚗', color: '#000000', url: 'https://www.uber.com/in/en',      badge: '50% OFF', offers: ['50% off first ride up to ₹150', 'Uber Auto — zero surge pricing', 'Intercity rides transparent price'] },
    { id: 'ola',       name: 'Ola',       emoji: '🟡', color: '#FFC220', url: 'https://www.olacabs.com',         badge: 'CASHBACK',offers: ['Ola Money cashback on rides', 'Ola Auto & Bikes available', 'Outstation cabs with driver'] },
    { id: 'rapido',    name: 'Rapido',    emoji: '🛵', color: '#F7971E', url: 'https://rapido.bike',             badge: 'CHEAPEST',offers: ['Cheapest bike taxi in India', 'Auto & cab rides also available', 'No surge — fixed zone pricing'] },
    { id: 'blusmart',  name: 'BluSmart',  emoji: '🔋', color: '#00ACC1', url: 'https://blu-smart.com',           badge: 'ELECTRIC',offers: ['100% electric cab rides', 'Zero surge, always fixed price', 'Luxe EV fleet — clean & quiet'] },
  ],
  'bills-payments': [
    { id: 'paytm2',    name: 'Paytm',     emoji: '💙', color: '#00BAF2', url: 'https://paytm.com',               badge: '5% BACK', offers: ['All bills in one place', 'Cashback up to 5% on payments', 'Credit card bill payment too'] },
    { id: 'phonepe2',  name: 'PhonePe',   emoji: '💜', color: '#5F259F', url: 'https://phonepe.com',             badge: 'WIN',     offers: ['Scratch card every bill paid', 'UPI + credit card payments', 'Electricity, gas, water, LPG'] },
    { id: 'googlepay', name: 'Google Pay', emoji: '🟡', color: '#4285F4', url: 'https://pay.google.com/intl/en_in/about',badge:'STAMPS',offers:['Stamps → cashback rewards','Zero fee on all UPI payments','NFC tap & pay at retail stores'] },
    { id: 'cred',      name: 'CRED',      emoji: '💎', color: '#000000', url: 'https://cred.club',               badge: 'MEMBERS', offers: ['Pay credit cards earn CRED coins', 'Exclusive brand offers for members', 'Rent pay & travel booking too'] },
  ],
  beauty: [
    { id: 'nykaa',     name: 'Nykaa',     emoji: '💄', color: '#FC2779', url: 'https://www.nykaa.com',           badge: 'PINK SALE',offers: ['Pink Sale — 50% off 2000+ brands', 'Free gift on orders ₹999+', 'MAC, Estee Lauder, Clinique'] },
    { id: 'purplle',   name: 'Purplle',   emoji: '🟣', color: '#7B1FA2', url: 'https://www.purplle.com',         badge: 'TRY ON',  offers: ['Free virtual try-on AI feature', 'Up to 60% off skincare brands', 'Flat ₹300 off first order'] },
    { id: 'mamaearth', name: 'Mamaearth', emoji: '🌿', color: '#4CAF50', url: 'https://mamaearth.in',            badge: 'NATURAL', offers: ['100% toxin-free natural range', 'Free tree planted with every order', '25% off combo sets always'] },
    { id: 'dotandkey', name: 'Dot & Key', emoji: '🔑', color: '#e91e63', url: 'https://www.dotandkey.com',       badge: 'DERMAT',  offers: ['Dermat-tested skincare routines', 'Retinol & Niacinamide serums', 'Flat 30% off starter kits'] },
  ],
  gaming: [
    { id: 'dream11',   name: 'Dream11',   emoji: '🏏', color: '#1a73e8', url: 'https://www.dream11.com',         badge: 'WIN ₹50L', offers: ['100% bonus on first deposit', 'Fantasy cricket, football & kabaddi', 'Win up to ₹50 Lakh daily'] },
    { id: 'mpl',       name: 'MPL',       emoji: '🎯', color: '#FF3E3E', url: 'https://www.mpl.live',            badge: '₹75 FREE', offers: ['₹75 signup bonus credited', '60+ skill games — chess to carrom', 'Daily tournaments ₹1 entry fee'] },
    { id: 'winzo',     name: 'WinZO',     emoji: '🏆', color: '#FF6B00', url: 'https://www.winzogames.com',      badge: 'CASH',    offers: ['100+ games win real cash', '₹50 signup bonus instantly', 'Safe & certified RNG gaming'] },
    { id: 'loco',      name: 'Loco',      emoji: '🎙️', color: '#8B5CF6', url: 'https://loco.gg',               badge: 'LIVE',    offers: ['Watch gaming streams & win', 'Daily trivia — win real prizes', 'Esports tournaments live'] },
  ],
  'home-services': [
    { id: 'urbancompany',name:'Urban Company',emoji:'🔧',color:'#000000',url:'https://www.urbancompany.com',    badge: 'VERIFIED', offers: ['AC service, cleaning & more', 'Background-verified professionals', 'Price visible before you book'] },
    { id: 'nobroker',  name: 'NoBroker',  emoji: '🏠', color: '#e65c00', url: 'https://www.nobroker.in',        badge: 'NO BROKERAGE',offers:['Rent/buy property zero brokerage','Packers & movers best price','Home painting & renovation'] },
    { id: 'housejoy',  name: 'Housejoy',  emoji: '🛠️', color: '#0288D1', url: 'https://www.housejoy.in',       badge: 'ON DEMAND',offers: ['Electrician & plumber on demand', 'Appliance repair at home', 'Flat 20% off first service'] },
    { id: 'sulekha',   name: 'Sulekha',   emoji: '📞', color: '#e91e63', url: 'https://www.sulekha.com',        badge: 'COMPARE', offers: ['Compare 3+ local service pros', 'Tuition, events & movers too', 'Free quotes — no commitment'] },
  ],
  'offers-deals': [
    { id: 'cashkaro',  name: 'CashKaro',  emoji: '💸', color: '#E91E63', url: 'https://cashkaro.com',           badge: 'CASHBACK',offers: ['Extra cashback on 1500+ stores', 'Stack on top of store discounts', 'Withdraw to bank instantly'] },
    { id: 'gopaisa',   name: 'GoPaisa',   emoji: '🪙', color: '#FF6F00', url: 'https://gopaisa.com',            badge: 'COINS',   offers: ['Cashback on every online purchase', 'Compare coupons & best deals', 'Refer & earn up to ₹10,000'] },
    { id: 'earnkaro',  name: 'EarnKaro',  emoji: '🤑', color: '#00897B', url: 'https://earnkaro.com',           badge: 'SHARE',   offers: ['Share deals earn commission', 'Work from home income source', 'Meesho + Flipkart + Amazon deals'] },
    { id: 'coupondunia',name:'CouponDunia',emoji:'🎫',color:'#FF5722',  url:'https://coupondunia.in',            badge: 'COUPONS', offers: ['Latest coupons from 2000+ brands', 'Restaurant & food discounts', 'Today\'s best credit card offers'] },
  ],
};

const totalPlatforms = Object.values(PLATFORMS).flat().length;

/* ══════════════════════════════════════════════════════════
   FEATURED CARD (Full Width Banner Slide)
══════════════════════════════════════════════════════════ */
function FeaturedCard({ item }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      id={`featured-${item.id}`}
      className="block w-full flex flex-col active:scale-[0.98] transition-transform duration-200"
    >
      <p className="text-[11px] font-semibold text-[#007AFF] uppercase tracking-wider mb-1 px-1">{item.badge}</p>
      <h3 className="text-[22px] font-medium leading-tight text-gray-900 px-1">{item.offer}</h3>
      <p className="text-[14px] text-gray-500 mb-3 px-1">{item.sub}</p>
      
      <div className="rounded-[20px] h-[180px] overflow-hidden relative shadow-sm w-full" style={{ backgroundColor: item.color }}>
        {/* Soft lighting/gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-black/30 mix-blend-overlay"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[80px] drop-shadow-md" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>{item.emoji}</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-white font-semibold text-[16px] drop-shadow-md">{item.name}</span>
            <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-1 shadow-sm">
                <span className="text-[#007AFF] text-[12px] font-bold">GET</span>
            </div>
        </div>
      </div>
    </a>
  );
}

/* ══════════════════════════════════════════════════════════
   PLATFORM CARD (Apple App Store List Style)
══════════════════════════════════════════════════════════ */
function PlatformCard({ p, index }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      id={`platform-${p.id}`}
      className="flex flex-col bg-white active:bg-gray-50 transition-colors duration-150 py-3"
    >
        <div className="flex items-center gap-3.5">
            {/* App Icon */}
            <div className="w-[60px] h-[60px] rounded-[14px] flex items-center justify-center text-[28px] shrink-0 border border-gray-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.06)] relative overflow-hidden" style={{ backgroundColor: '#f9f9fb' }}>
               <div className="absolute inset-0 opacity-10" style={{ backgroundColor: p.color }}></div>
               <span className="relative z-10">{p.emoji}</span>
            </div>
            
            {/* App Info */}
            <div className="flex-grow min-w-0 flex flex-col justify-center">
                <h4 className="text-[15px] font-medium text-gray-900 truncate leading-tight mb-0.5">{p.name}</h4>
                <p className="text-[12px] text-gray-500 truncate leading-tight mb-1">{p.offers[0]}</p>
                <div className="flex items-center gap-1">
                    <div className="flex text-[#FF9500]">
                       <Star size={10} fill="currentColor" />
                       <Star size={10} fill="currentColor" />
                       <Star size={10} fill="currentColor" />
                       <Star size={10} fill="currentColor" />
                       <Star size={10} fill="currentColor" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium ml-1">{p.badge}</span>
                </div>
            </div>

            {/* GET Button */}
            <div className="shrink-0 flex flex-col items-center justify-center pl-2">
                <div className="bg-[#f1f2f6] text-[#007AFF] rounded-full px-4 py-1.5 text-[13px] font-bold active:bg-[#e4e5e9] transition-colors">
                    GET
                </div>
                <span className="text-[8px] text-gray-400 mt-1 font-medium">In-App Deals</span>
            </div>
        </div>
        
        {/* Subtle separator */}
        <div className="ml-[74px] mt-3 h-[0.5px] bg-gray-100"></div>
    </a>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function DealsPage() {
  const { t } = useContext(LanguageContext);
  const [activeCat, setActiveCat] = useState(null);
  const [search, setSearch] = useState('');
  const detailRef = useRef(null);
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollContainerRef = useRef(null);

  // Auto-slide effect
  useEffect(() => {
    if (search || activeCat) return; // Pause slider when searching or filtered
    const timer = setInterval(() => {
      setCurrentSlide(prev => {
        const nextSlide = (prev + 1) % FEATURED.length;
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const slideWidth = container.offsetWidth;
          // Calculate precise scroll position
          container.scrollTo({ left: slideWidth * nextSlide, behavior: 'smooth' });
        }
        return nextSlide;
      });
    }, 3500); // 3.5 seconds per slide
    return () => clearInterval(timer);
  }, [search, activeCat]);

  // Sync dots when user manually swipes
  const handleScroll = (e) => {
    const slideWidth = e.target.offsetWidth;
    const scrollPos = e.target.scrollLeft;
    const index = Math.round(scrollPos / slideWidth);
    setCurrentSlide(index);
  };

  const handleCategoryTap = (cat) => {
    const next = activeCat?.id === cat.id ? null : cat;
    setActiveCat(next);
    setSearch('');
    if (next) setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const platformsToShow = activeCat ? (PLATFORMS[activeCat.id] || []) : Object.values(PLATFORMS).flat();
  const filtered = search ? platformsToShow.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : platformsToShow;

  return (
    <div className="min-h-screen bg-white pb-24 font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
      <SEO title="Deals & Offers | Axansh Store" description="Best affiliate deals — shopping, travel, food, finance & 25 categories." />

      {/* ════════════════════════
          HEADER (Apple Style Large Title)
      ════════════════════════ */}
      <div className="px-5 pt-[68px] pb-2 bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100/50">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-[34px] font-bold tracking-tight text-black leading-none">Deals</h1>
            <div className="w-[36px] h-[36px] bg-gray-100 rounded-full flex items-center justify-center">
                <Bell size={18} className="text-[#007AFF]" />
            </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[#f1f2f6] rounded-[10px] px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
                type="text"
                placeholder="Games, Apps, Platforms, Deals"
                value={search}
                onChange={e => { setSearch(e.target.value); if (e.target.value) setActiveCat(null); }}
                className="flex-grow bg-transparent text-[15px] outline-none text-gray-900 placeholder-gray-500"
            />
            {search && <button onClick={() => setSearch('')}><X size={14} className="text-gray-400" /></button>}
        </div>
      </div>

      {/* ════════════════════════
          FEATURED BANNER SLIDER (Auto-playing App Store Banner)
      ════════════════════════ */}
      {!search && !activeCat && (
        <div className="mt-6 border-b border-gray-100 pb-6">
            <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                {FEATURED.map((item) => (
                    <div key={item.id} className="w-full flex-shrink-0 snap-center px-5">
                        <FeaturedCard item={item} />
                    </div>
                ))}
            </div>
            
            {/* Pagination Dots */}
            <div className="flex justify-center gap-1.5 mt-5">
                {FEATURED.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-[5px] rounded-full transition-all duration-300 ${
                            i === currentSlide ? 'w-[18px] bg-[#007AFF]' : 'w-[5px] bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        </div>
      )}

      {/* ════════════════════════
          CATEGORIES (PhonePe Grid Style merged with Apple UI)
      ════════════════════════ */}
      <div className="mt-6 px-5 border-b border-gray-100 pb-6">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-[22px] font-bold tracking-tight text-black">Browse Categories</h2>
              {activeCat && (
                  <button onClick={() => setActiveCat(null)} className="text-[#007AFF] text-[15px] font-medium">
                      Clear Filter
                  </button>
              )}
          </div>
          
          <div className="grid grid-cols-5 gap-y-5 gap-x-2">
              {CATEGORIES.map(cat => {
                  const isActive = activeCat?.id === cat.id;
                  return (
                      <button 
                          key={cat.id} 
                          onClick={() => handleCategoryTap(cat)}
                          className={`flex flex-col items-center gap-1.5 transition-transform active:scale-90`}
                      >
                          <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-[24px] shadow-sm transition-colors border ${
                              isActive 
                                  ? 'bg-[#007AFF] text-white border-[#007AFF]' 
                                  : 'bg-[#f1f2f6] border-transparent text-gray-800'
                          }`}>
                              {cat.emoji}
                          </div>
                          <span className={`text-[9.5px] font-medium text-center leading-tight tracking-tight ${
                              isActive ? 'text-[#007AFF]' : 'text-gray-600'
                          }`}>
                              {cat.label}
                          </span>
                      </button>
                  );
              })}
          </div>
      </div>

      {/* ════════════════════════
          PLATFORM LIST (App Store List View)
      ════════════════════════ */}
      <div className="px-5 mt-6" ref={detailRef}>
        {search ? (
          <>
            <h2 className="text-[22px] font-bold tracking-tight text-black mb-4">Search Results</h2>
            {filtered.length > 0
              ? <div className="flex flex-col">{filtered.map((p, i) => <PlatformCard key={p.id} p={p} index={i} />)}</div>
              : <div className="py-12 text-center">
                  <p className="text-[17px] font-medium text-gray-900">No results found.</p>
                  <p className="text-[15px] text-gray-500 mt-1">Check the spelling or try a new search.</p>
                </div>
            }
          </>
        ) : activeCat ? (
          <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] font-bold tracking-tight text-black">{activeCat.label} Apps</h2>
            </div>
            <div className="flex flex-col">
                {(PLATFORMS[activeCat.id] || []).map((p, i) => <PlatformCard key={p.id} p={p} index={i} />)}
            </div>
          </>
        ) : (
          CATEGORIES.slice(0, 10).map(cat => {
            const platforms = PLATFORMS[cat.id] || [];
            if (!platforms.length) return null;
            return (
              <div key={cat.id} className="mb-8">
                <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                  <h2 className="text-[20px] font-bold tracking-tight text-black flex items-center gap-2">
                      {cat.label}
                  </h2>
                  <button onClick={() => handleCategoryTap(cat)} className="text-[#007AFF] text-[15px] font-medium">
                    See All
                  </button>
                </div>
                <div className="flex flex-col">
                  {platforms.slice(0, 3).map((p, i) => <PlatformCard key={p.id} p={p} index={i} />)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ════════════════════════
          DISCLOSURE
      ════════════════════════ */}
      <div className="mx-5 mt-8 mb-4">
          <p className="text-[11px] text-gray-400 text-center leading-relaxed font-medium">
              These are affiliate links. We may earn a commission when you download or purchase through these links at no extra cost to you.
          </p>
      </div>
    </div>
  );
}
