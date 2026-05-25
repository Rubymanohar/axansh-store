
// ─── CONFIGURATION ───────────────────────────────────────
const USERS_KEY = 'axansh_users';
const ORDERS_KEY = 'axansh_orders';

// 🔗 Google Apps Script Deployment URL
// Replace with your actual Deployed Web App URL from Apps Script
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzy2Gq7pXJ2OTornhwIs9MJ9BLeGqIpg78_zBlNYHIrQQqlOm_F1o3myd3srHWmV6o/exec";

class DataService {
  constructor() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify([
        { name: 'Demo User', email: 'demo@axansh.com', password: btoa('password123') }
      ]));
    }
  }

  // ─── AUTH API ───────────────────────────────────────────
  async getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  async signup(userData) {
    const users = await this.getUsers();
    if (users.find(u => u.email === userData.email)) throw new Error("Email registered");
    const newUser = { id: Date.now(), name: userData.name, email: userData.email, password: btoa(userData.password) };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { status: 'success', ...newUser };
  }

  async login(email, password) {
    const users = await this.getUsers();
    const user = users.find(u => u.email === email);
    if (user && (user.password === btoa(password) || user.password === password)) return user;
    throw new Error("Invalid credentials");
  }

  // ─── ORDERS API (HYBRID: GAS + LOCAL) ───────────────────

  async getOrders() {
    try {
      const response = await fetch(GAS_API_URL);
      if (!response.ok) throw new Error("GAS Fetch Error");
      const json = await response.json();

      // Handle new format: {status:"success", data:[...]}
      // Also handle old format: plain array
      const data = Array.isArray(json) ? json : (json.data || []);

      // Cache locally for offline access
      if (Array.isArray(data) && data.length >= 0) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(data));
        return data;
      }
      throw new Error("Invalid data format");
    } catch (err) {
      console.warn("[DataService] Cloud Sync Failed, using local fallback:", err);
      return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    }
  }

  async placeOrder(orderData) {
    const finalOrder = {
      ...orderData,
      orderId: orderData.orderId || `AX-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Placed',
      date: orderData.date || new Date().toISOString()
    };

    // 1. Save Locally (fallback)
    try {
      const localOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      localOrders.push(finalOrder);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(localOrders));
    } catch {
      // Ignore local storage error
    }

    // 2. Fire GAS POST directly — no chain, no await
    this.syncToSheet(finalOrder);

    return { status: 'success', order: finalOrder };
  }

  syncToSheet(order) {
    // Direct fire-and-forget POST to Google Sheets
    const payload = JSON.stringify({
      action: "create",
      orderId: order.orderId || '',
      name: order.name || '',
      phone: order.phone || '',
      email: order.email || '',
      address: order.address || '',
      paymentId: order.paymentId || '',
      amount: order.amount || 0,
      product: order.product || 'Axansh Product',
      productImage: order.productImage || '',
      quantity: order.quantity || 1,
      variant: order.variant || '',
      paymentMethod: order.paymentMethod || 'COD',
      status: 'Placed',
      trackingId: '',
      courier: '',
      date: order.date || new Date().toISOString(),
      estimatedDelivery: '',
      pincode: order.pincode || ''
    });

    try {
      fetch(GAS_API_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: payload 
      });
    } catch(e) {
      console.warn("[DataService] Cloud Sync Failed", e);
    }
  }

  async updateOrder(orderId, updateData) {
    // 1. Update Locally
    const localOrders = await this.getOrders();
    const index = localOrders.findIndex(o => o.orderId === orderId || o.id === orderId);
    if (index !== -1) {
      localOrders[index] = { ...localOrders[index], ...updateData };
      localStorage.setItem(ORDERS_KEY, JSON.stringify(localOrders));
    }

    // 2. Sync Update to Cloud
    try {
      fetch(GAS_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ 
          action: "update",
          orderId, 
          ...updateData 
        })
      });
    } catch (err) {
       console.error("[DataService] Cloud Update Failure:", err);
    }

    return { status: 'success', message: 'Nodes synchronized' };
  }

  async getOrder(id) {
    try {
      console.log(`[DataService] Searching for value: "${id}"`);
      const searchUrl = `${GAS_API_URL}?search=${encodeURIComponent(String(id).trim())}`;
      console.log(`[DataService] Fetching URL: ${searchUrl}`);
      
      const response = await fetch(searchUrl);
      console.log(`[DataService] API Response Status: ${response.status}`);
      
      if (!response.ok) throw new Error(`API Fetch Error: ${response.statusText}`);
      
      const json = await response.json();
      console.log(`[DataService] Parsed JSON Response:`, json);
      
      if (json.success && json.data && json.data.length > 0) {
        console.log(`[DataService] Matched Rows Found: ${json.data.length}`);
        return json.data;
      }
      
      console.log(`[DataService] No matches returned from Cloud.`);
      throw new Error(json.error || "No orders found for this ID/Phone.");
    } catch (err) {
      console.warn("[DataService] Cloud Search Failed, checking local fallback:", err.message);
      
      // Fallback to local storage
      const orders = await this.getOrders();
      const localMatches = orders.filter(o => 
        String(o.orderId).trim().toLowerCase() === String(id).trim().toLowerCase() || 
        String(o.phone).trim() === String(id).trim()
      );
      
      if (localMatches.length > 0) {
        console.log(`[DataService] Found ${localMatches.length} matches in local cache.`);
        return localMatches;
      }
      
      throw new Error("Order not found. Please check your details and try again.");
    }
  }

  // ─── PRODUCTS API (GOOGLE SHEETS CSV) ───────────────────

  async getProducts() {
    const CACHE_KEY = 'axansh_products_cache';
    const MOCK_PRODUCTS = [
      {
        id: 101,
        title: "MIRCHI FASHION Women's Chiffon Saree",
        name: "MIRCHI FASHION Women's Chiffon Saree",
        category: "Fashion",
        subcategory: "Sarees",
        price: 449,
        discountPrice: 399,
        rating: 4.2,
        reviewCount: 120,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Elegant chiffon printed saree with beautiful borders, perfect for casual and festive occasions."
      },
      {
        id: 102,
        title: "Floral Cotton Straight Kurti",
        name: "Floral Cotton Straight Kurti",
        category: "Fashion",
        subcategory: "Kurtis",
        price: 599,
        discountPrice: 499,
        rating: 4.5,
        reviewCount: 88,
        image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Comfortable daily wear 100% cotton straight kurti with premium block print detailing."
      },
      {
        id: 103,
        title: "Axansh Classic Jogging Shoes",
        name: "Axansh Classic Jogging Shoes",
        category: "Footwear",
        subcategory: "Shoes",
        price: 1299,
        discountPrice: 899,
        rating: 4.3,
        reviewCount: 230,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Lightweight running and sports shoes with breathable mesh and responsive foam sole."
      },
      {
        id: 104,
        title: "Urban Streetwear Sneakers",
        name: "Urban Streetwear Sneakers",
        category: "Footwear",
        subcategory: "Sneakers",
        price: 1999,
        discountPrice: 1499,
        rating: 4.6,
        reviewCount: 95,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Premium synthetic leather casual sneakers for daily outfit styling."
      },
      {
        id: 105,
        title: "Matte Liquid Lipstick Trio",
        name: "Matte Liquid Lipstick Trio",
        category: "Beauty",
        subcategory: "Lipstick",
        price: 499,
        discountPrice: 299,
        rating: 4.1,
        reviewCount: 142,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Long-lasting, smudge-proof matte liquid lipstick combo pack of 3 trending shades."
      },
      {
        id: 106,
        title: "Traditional Kundan Earrings",
        name: "Traditional Kundan Earrings",
        category: "Jewelry",
        subcategory: "Earrings",
        price: 399,
        discountPrice: 199,
        rating: 4.4,
        reviewCount: 75,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Gold plated Kundan drop earrings with pearl drops, ideal for wedding and traditional wear."
      },
      {
        id: 107,
        title: "True Wireless Earbuds Pro",
        name: "True Wireless Earbuds Pro",
        category: "Electronics",
        subcategory: "Earbuds",
        price: 1499,
        discountPrice: 999,
        rating: 4.2,
        reviewCount: 310,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Active noise cancellation wireless earbuds with ultra-bass and 30-hour playback case."
      },
      {
        id: 108,
        title: "Fitness Smart Watch Series 5",
        name: "Fitness Smart Watch Series 5",
        category: "Electronics",
        subcategory: "Smart Watches",
        price: 2999,
        discountPrice: 1999,
        rating: 4.5,
        reviewCount: 180,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Bluetooth calling smartwatch with SpO2 tracker, heart rate monitor, and 1.8-inch display."
      },
      {
        id: 109,
        title: "Non-Stick Cookware Set (3 Pcs)",
        name: "Non-Stick Cookware Set (3 Pcs)",
        category: "Kitchen",
        subcategory: "Cookware",
        price: 1599,
        discountPrice: 1199,
        rating: 4.3,
        reviewCount: 50,
        image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Three-piece non-stick induction compatible cookware set: kadhai, tawa, and fry pan."
      },
      {
        id: 110,
        title: "Modern Canvas Wall Painting Set",
        name: "Modern Canvas Wall Painting Set",
        category: "Home Decor",
        subcategory: "Wall Decor",
        price: 899,
        discountPrice: 499,
        rating: 4.4,
        reviewCount: 64,
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Set of 3 gorgeous modern abstract canvases to elevate your home decoration."
      },
      {
        id: 111,
        title: "Ergonomic Mesh Office Chair",
        name: "Ergonomic Mesh Office Chair",
        category: "Furniture",
        subcategory: "Chairs",
        price: 4999,
        discountPrice: 3499,
        rating: 4.5,
        reviewCount: 42,
        image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80&fit=crop"],
        productType: "own",
        description: "High-back mesh chair with adjustable lumbar support and height for comfortable WFH."
      },
      {
        id: 112,
        title: "Premium Roasted Cashews (500g)",
        name: "Premium Roasted Cashews (500g)",
        category: "Grocery",
        subcategory: "Dry Fruits",
        price: 599,
        discountPrice: 449,
        rating: 4.6,
        reviewCount: 112,
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Lightly salted, freshly roasted giant cashews, packed with proteins and healthy fats."
      },
      {
        id: 113,
        title: "Matte Silicone Phone Cover",
        name: "Matte Silicone Phone Cover",
        category: "Mobile Accessories",
        subcategory: "Mobile Covers",
        price: 299,
        discountPrice: 149,
        rating: 4.3,
        reviewCount: 98,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80&fit=crop"],
        productType: "own",
        description: "Anti-scratch liquid silicone cover with microfiber lining for premium phone protection."
      },
      {
        id: 114,
        title: "SWARON Banarasi Silk Saree",
        name: "SWARON Banarasi Silk Saree",
        category: "Fashion",
        subcategory: "Sarees",
        price: 1299,
        discountPrice: 999,
        rating: 4.4,
        reviewCount: 220,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80&fit=crop"],
        productType: "affiliate",
        affiliateLink: "https://amazon.in",
        description: "Traditional Banarasi jacquard silk saree with matching blouse piece. Handcrafted deal."
      },
      {
        id: 115,
        title: "Over-Ear Wireless Headphones",
        name: "Over-Ear Wireless Headphones",
        category: "Electronics",
        subcategory: "Headphones",
        price: 2499,
        discountPrice: 1999,
        rating: 4.3,
        reviewCount: 450,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&fit=crop",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&fit=crop"],
        productType: "affiliate",
        affiliateLink: "https://amazon.in",
        description: "Premium over-ear stereo headphones with active voice control assistant integration."
      }
    ];

    try {
      const sheetId = "1vCccE0Cjsk-7HbWJ443S8h2cvbUfpXdCNGMEnqs9CpM";
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
      
      const response = await fetch(csvUrl);
      if (!response.ok) throw new Error("CSV Fetch Failed");
      
      const csvText = await response.text();
      const rows = csvText.split('\n').filter(row => {
        const trimmed = row.trim();
        return trimmed.length > 0 && trimmed.replace(/,/g, '').length > 0;
      });
      const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      
      const products = [];
      for (let i = 1; i < rows.length; i++) {
        const rowString = rows[i];
        const values = [];
        let inQuotes = false, currentValue = '';
        for (let j = 0; j < rowString.length; j++) {
          const char = rowString[j];
          if (char === '"' && rowString[j+1] !== '"') inQuotes = !inQuotes;
          else if (char === ',' && !inQuotes) { values.push(currentValue); currentValue = ''; }
          else currentValue += char;
        }
        values.push(currentValue);
        
        // Skip repeated header rows
        if (values[0] && values[0].trim().replace(/^"|"$/g, '') === 'id' && values[1] && values[1].trim().replace(/^"|"$/g, '') === 'name') {
          continue;
        }
        
        const obj = {};
        headers.forEach((header, index) => {
          let val = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
          if (header === 'tags' || header === 'images') val = val ? val.split(';').map(v => v.trim()) : [];
          else if (['id', 'price', 'discountPrice', 'rating', 'reviewCount'].includes(header)) val = Number(val) || 0;
          obj[header] = val;
        });
        
        // Skip empty rows
        if (!obj.title && !obj.name) {
          continue;
        }

        if (!obj.id) obj.id = i; // Fallback to unique row index if ID is missing or 0
        if (!obj.title && obj.name) obj.title = obj.name;
        if (!obj.image && obj.image1) obj.image = obj.image1;
        
        // Group image1...image5 into an images array
        const imagesList = [];
        for (let idx = 1; idx <= 5; idx++) {
          const imgKey = `image${idx}`;
          if (obj[imgKey]) {
            imagesList.push(obj[imgKey]);
          }
        }
        obj.images = imagesList.length > 0 ? imagesList : (obj.image ? [obj.image] : []);

        products.push(obj);
      }

      // If we parsed valid products, store them in the cache and return
      if (products.length > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(products));
        return products;
      }
      throw new Error("No products parsed from sheet");
    } catch (err) {
      console.warn("[DataService] Cloud fetch failed, attempting to read from cache:", err);
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log("[DataService] Successfully loaded products from cache.");
            return parsed;
          }
        }
      } catch (cacheErr) {
        console.warn("[DataService] LocalStorage read failed:", cacheErr);
      }
      
      console.log("[DataService] Cache is empty, returning empty list (Google Sheet Data Only).");
      return [];
    }
  }
}

export default new DataService();
