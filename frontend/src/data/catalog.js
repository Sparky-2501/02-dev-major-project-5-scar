export const DEMO_CATEGORIES = [
  { id: 'cat_men', name: 'Men', slug: 'men', description: 'Urban streetwear, tailored suits, and essentials.' },
  { id: 'cat_women', name: 'Women', slug: 'women', description: 'Contemporary elegance, dresses, and elevated style.' },
  { id: 'cat_kids', name: 'Kids', slug: 'kids', description: 'Durable, vibrant, and comfortable junior wear.' },
  { id: 'cat_footwear', name: 'Footwear', slug: 'footwear', description: 'Performance runners, lifestyle sneakers, and formal boots.' },
  { id: 'cat_electronics', name: 'Electronics', slug: 'electronics', description: 'Noise-canceling audio, smart home devices, and gadgets.' },
  { id: 'cat_accessories', name: 'Accessories', slug: 'accessories', description: 'Minimalist leather goods, chronographs, and sunglasses.' },
  { id: 'cat_home', name: 'Home', slug: 'home', description: 'Curated studio lighting, ceramics, and architectural decor.' },
];

export const DEMO_PRODUCTS = [
  // MEN
  {
    id: 'prod_m_1',
    title: 'SCAR Obsidian Merino Overcoat',
    slug: 'scar-obsidian-merino-overcoat',
    category: 'men',
    brand: 'SCAR Studio',
    price: 8999,
    originalPrice: 11999,
    rating: 4.8,
    reviewsCount: 142,
    description: 'Tailored from heavyweight Italian merino wool with a relaxed silhouette and notched lapels. Designed for modern metropolitan winters.',
    images: ['/images/products/men/marwood-cashmere-overcoat-1.jpg', '/images/products/men/men_2.svg'],
    thumbnail: '/images/products/men/marwood-cashmere-overcoat-1.jpg',
    tags: ['coat', 'wool', 'winter', 'luxury', 'men'],
    variants: [
      { sku: 'M1-BLK-M', size: 'M', color: 'Obsidian Black', stock: 12, price: 8999 },
      { sku: 'M1-BLK-L', size: 'L', color: 'Obsidian Black', stock: 4, price: 8999 },
      { sku: 'M1-BLK-XL', size: 'XL', color: 'Obsidian Black', stock: 1, price: 8999 }, // Single stock unit for race test!
    ]
  },
  {
    id: 'prod_m_2',
    title: 'Heavyweight Raw Cotton Hoodie',
    slug: 'heavyweight-raw-cotton-hoodie',
    category: 'men',
    brand: 'SCAR Basics',
    price: 3499,
    originalPrice: 4299,
    rating: 4.6,
    reviewsCount: 88,
    description: 'Custom 450 GSM organic loopback terry fabric with double-stitched kangaroo pocket and custom aglets.',
    images: ['/images/products/men/Y26025.webp'],
    thumbnail: '/images/products/men/Y26025.webp',
    tags: ['hoodie', 'casual', 'streetwear', 'men'],
    variants: [
      { sku: 'M2-GRY-M', size: 'M', color: 'Slate Grey', stock: 25, price: 3499 },
      { sku: 'M2-GRY-L', size: 'L', color: 'Slate Grey', stock: 18, price: 3499 },
    ]
  },
  {
    id: 'prod_m_3',
    title: 'Pleated Tapered Wool Trousers',
    slug: 'pleated-tapered-wool-trousers',
    category: 'men',
    brand: 'SCAR Atelier',
    price: 4999,
    originalPrice: 5999,
    rating: 4.7,
    reviewsCount: 52,
    description: 'Double front pleats with an adjustable side buckle and sharp crease line. Ideal for formal-casual crossover.',
    images: ['/images/products/men/-473Wx593H-700540721-grey-MODEL.jxl'],
    thumbnail: '/images/products/men/-473Wx593H-700540721-grey-MODEL.jxl',
    tags: ['trousers', 'formal', 'tailored', 'men'],
    variants: [
      { sku: 'M3-NVY-32', size: '32', color: 'Deep Navy', stock: 15, price: 4999 },
      { sku: 'M3-NVY-34', size: '34', color: 'Deep Navy', stock: 9, price: 4999 },
    ]
  },
  {
    id: 'prod_m_4',
    title: 'Architectural Poplin Overshirt',
    slug: 'architectural-poplin-overshirt',
    category: 'men',
    brand: 'SCAR Studio',
    price: 3899,
    originalPrice: 4499,
    rating: 4.5,
    reviewsCount: 37,
    description: 'Crisp woven poplin jacket shirt with concealed placket and dual gusset chest pockets.',
    images: ['/images/products/men/men_4.svg'],
    thumbnail: '/images/products/men/men_4.svg',
    tags: ['shirt', 'overshirt', 'layering', 'men'],
    variants: [
      { sku: 'M4-SND-M', size: 'M', color: 'Desert Sand', stock: 14, price: 3899 },
      { sku: 'M4-SND-L', size: 'L', color: 'Desert Sand', stock: 20, price: 3899 },
    ]
  },

  // WOMEN
  {
    id: 'prod_w_1',
    title: 'Sculpted Silk Satin Slip Gown',
    slug: 'sculpted-silk-satin-slip-gown',
    category: 'women',
    brand: 'SCAR Atelier',
    price: 7499,
    originalPrice: 9999,
    rating: 4.9,
    reviewsCount: 114,
    description: 'Pure 22-momme mulberry silk tailored on the bias for fluid movement and an elegant cowl neck.',
    images: ['/images/products/women/women_1.svg', '/images/products/women/women_2.svg'],
    thumbnail: '/images/products/women/women_1.svg',
    tags: ['dress', 'silk', 'evening', 'luxury', 'women'],
    variants: [
      { sku: 'W1-EMR-S', size: 'S', color: 'Emerald Green', stock: 8, price: 7499 },
      { sku: 'W1-EMR-M', size: 'M', color: 'Emerald Green', stock: 5, price: 7499 },
      { sku: 'W1-EMR-L', size: 'L', color: 'Emerald Green', stock: 1, price: 7499 }, // 1 unit stock!
    ]
  },
  {
    id: 'prod_w_2',
    title: 'Cashmere Knit Asymmetrical Cardigan',
    slug: 'cashmere-knit-asymmetrical-cardigan',
    category: 'women',
    brand: 'SCAR Studio',
    price: 5999,
    originalPrice: 7200,
    rating: 4.7,
    reviewsCount: 63,
    description: 'Ultra-soft Mongolian cashmere with rib-knit cuffs and horn buttons in an effortless draped silhouette.',
    images: ['/images/products/women/women_2.svg'],
    thumbnail: '/images/products/women/women_2.svg',
    tags: ['knitwear', 'cashmere', 'cardigan', 'women'],
    variants: [
      { sku: 'W2-OAT-S', size: 'S', color: 'Oatmeal', stock: 11, price: 5999 },
      { sku: 'W2-OAT-M', size: 'M', color: 'Oatmeal', stock: 16, price: 5999 },
    ]
  },
  {
    id: 'prod_w_3',
    title: 'High-Rise Tailored Wide Leg Pants',
    slug: 'high-rise-tailored-wide-leg-pants',
    category: 'women',
    brand: 'SCAR Studio',
    price: 4299,
    originalPrice: 5199,
    rating: 4.8,
    reviewsCount: 92,
    description: 'Flattering high-rise waist with fluid draping fabric and hidden pockets. Pairs effortlessly with heels or sneakers.',
    images: ['/images/products/women/women_3.svg'],
    thumbnail: '/images/products/women/women_3.svg',
    tags: ['pants', 'tailored', 'workwear', 'women'],
    variants: [
      { sku: 'W3-BLK-28', size: '28', color: 'Midnight Black', stock: 19, price: 4299 },
      { sku: 'W3-BLK-30', size: '30', color: 'Midnight Black', stock: 22, price: 4299 },
    ]
  },

  // FOOTWEAR
  {
    id: 'prod_f_1',
    title: 'AeroGlide Carbon Plate Runner',
    slug: 'aeroglide-carbon-plate-runner',
    category: 'footwear',
    brand: 'SCAR Athletics',
    price: 11999,
    originalPrice: 14999,
    rating: 4.9,
    reviewsCount: 206,
    description: 'Engineered with a full-length curved carbon fiber propulsion plate and nitrogen-infused supercritical foam midsole.',
    images: ['/images/products/footwear/footwear_1.svg', '/images/products/footwear/footwear_2.svg'],
    thumbnail: '/images/products/footwear/footwear_1.svg',
    tags: ['sneakers', 'running', 'carbon-plate', 'footwear', 'sports'],
    variants: [
      { sku: 'F1-ORA-UK8', size: 'UK 8', color: 'Hyper Orange', stock: 7, price: 11999 },
      { sku: 'F1-ORA-UK9', size: 'UK 9', color: 'Hyper Orange', stock: 10, price: 11999 },
      { sku: 'F1-ORA-UK10', size: 'UK 10', color: 'Hyper Orange', stock: 1, price: 11999 }, // Single stock test
    ]
  },
  {
    id: 'prod_f_2',
    title: 'Chelsea Commuter Goodyear Boot',
    slug: 'chelsea-commuter-goodyear-boot',
    category: 'footwear',
    brand: 'SCAR Heritage',
    price: 9499,
    originalPrice: 12000,
    rating: 4.8,
    reviewsCount: 78,
    description: 'Full-grain Horween leather with a storm welt Goodyear construction and Vibram lugged outsoles.',
    images: ['/images/products/footwear/footwear_2.svg'],
    thumbnail: '/images/products/footwear/footwear_2.svg',
    tags: ['boots', 'leather', 'chelsea', 'footwear'],
    variants: [
      { sku: 'F2-BRN-UK8', size: 'UK 8', color: 'Cognac Brown', stock: 9, price: 9499 },
      { sku: 'F2-BRN-UK9', size: 'UK 9', color: 'Cognac Brown', stock: 12, price: 9499 },
    ]
  },

  // ELECTRONICS
  {
    id: 'prod_e_1',
    title: 'SCAR Resonance Pro Wireless ANC Headphones',
    slug: 'scar-resonance-pro-wireless-anc',
    category: 'electronics',
    brand: 'SCAR Acoustics',
    price: 14999,
    originalPrice: 18999,
    rating: 4.9,
    reviewsCount: 310,
    description: 'Beryllium 40mm acoustic drivers, adaptive hybrid active noise cancellation, LDAC Hi-Res audio, and 45-hour battery.',
    images: ['/images/products/electronics/electronics_1.svg', '/images/products/electronics/electronics_2.svg'],
    thumbnail: '/images/products/electronics/electronics_1.svg',
    tags: ['headphones', 'audio', 'anc', 'electronics', 'wireless'],
    variants: [
      { sku: 'E1-MBLK', size: 'Standard', color: 'Matte Black', stock: 30, price: 14999 },
      { sku: 'E1-SLVR', size: 'Standard', color: 'Silver Chrome', stock: 15, price: 14999 },
    ]
  },
  {
    id: 'prod_e_2',
    title: 'Lumina Magnetic Studio Light Bar',
    slug: 'lumina-magnetic-studio-light-bar',
    category: 'electronics',
    brand: 'SCAR Studio',
    price: 2999,
    originalPrice: 3999,
    rating: 4.7,
    reviewsCount: 144,
    description: 'CRI 97+ true daylight color rendering with wireless touch dimmer dial and counterweighted aluminum monitor mount.',
    images: ['/images/products/electronics/electronics_2.svg'],
    thumbnail: '/images/products/electronics/electronics_2.svg',
    tags: ['light', 'desk', 'electronics', 'studio'],
    variants: [
      { sku: 'E2-ALUM', size: 'One Size', color: 'Anodized Grey', stock: 45, price: 2999 },
    ]
  },

  // ACCESSORIES
  {
    id: 'prod_a_1',
    title: 'Chronograph Minimalist Automatic Watch',
    slug: 'chronograph-minimalist-automatic-watch',
    category: 'accessories',
    brand: 'SCAR Chrono',
    price: 16999,
    originalPrice: 21999,
    rating: 4.9,
    reviewsCount: 95,
    description: 'Miyota 9015 mechanical movement with sapphire crystal exhibition caseback and surgical grade 316L stainless steel.',
    images: ['/images/products/accessories/accessories_1.svg'],
    thumbnail: '/images/products/accessories/accessories_1.svg',
    tags: ['watch', 'luxury', 'chronograph', 'accessories'],
    variants: [
      { sku: 'A1-STL-40', size: '40mm', color: 'Steel / Black Dial', stock: 8, price: 16999 },
      { sku: 'A1-ROSE-40', size: '40mm', color: 'Rose Gold / White', stock: 5, price: 17999 },
    ]
  },

  // KIDS
  {
    id: 'prod_k_1',
    title: 'Junior Explorer Waterproof Windbreaker',
    slug: 'junior-explorer-waterproof-windbreaker',
    category: 'kids',
    brand: 'SCAR Kids',
    price: 2499,
    originalPrice: 3299,
    rating: 4.6,
    reviewsCount: 42,
    description: 'Lightweight ripstop windbreaker with 10k waterproof rating, reflective safety accents, and breathable mesh lining.',
    images: ['/images/products/kids/kids_1.svg'],
    thumbnail: '/images/products/kids/kids_1.svg',
    tags: ['kids', 'jacket', 'waterproof', 'outdoor'],
    variants: [
      { sku: 'K1-BLU-6Y', size: '6Y', color: 'Electric Blue', stock: 20, price: 2499 },
      { sku: 'K1-BLU-8Y', size: '8Y', color: 'Electric Blue', stock: 14, price: 2499 },
    ]
  },

  // HOME
  {
    id: 'prod_h_1',
    title: 'Handcrafted Ceramic Pour-Over Dripper Set',
    slug: 'handcrafted-ceramic-pour-over-set',
    category: 'home',
    brand: 'SCAR Living',
    price: 2199,
    originalPrice: 2899,
    rating: 4.8,
    reviewsCount: 88,
    description: 'Artisanal stoneware ribbed dripper with walnut wooden collar and heat-resistant borosilicate glass carafe.',
    images: ['/images/products/home/home_1.svg'],
    thumbnail: '/images/products/home/home_1.svg',
    tags: ['coffee', 'ceramic', 'kitchen', 'home'],
    variants: [
      { sku: 'H1-MATTE-WHT', size: '500ml', color: 'Matte White', stock: 35, price: 2199 },
    ]
  }
];
