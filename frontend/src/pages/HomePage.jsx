import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/product/ProductCard';
import { DEMO_CATEGORIES } from '../data/catalog';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Plus,
  Trash2,
  Megaphone,
  ShoppingBag,
  Zap,
  Tag,
  CheckCircle2,
  X
} from 'lucide-react';

export const HomePage = () => {
  const {
    products,
    campaigns,
    archiveProduct,
    saveProduct,
    deleteCampaign,
    createCampaign,
    trackEvent
  } = useCampaigns();
  const { user, isAdmin } = useAuth();

  // Admin Quick Add Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);

  const [newProductForm, setNewProductForm] = useState({
    title: '',
    brand: 'SCAR Atelier',
    category: 'women',
    price: 3999,
    originalPrice: 5999,
    description: 'Artisanal high-luxury crafted for effortless elegance across India.',
    stock: 10,
    thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
  });

  const [newBannerForm, setNewBannerForm] = useState({
    name: 'Festive Flash Deal',
    headline: 'FLAT 25% OFF FOR INDIAN FESTIVE SEASON',
    description: 'Enjoy exclusive savings across all apparel and lifestyle electronics.',
    discountValue: 25,
    discountType: 'percentage',
    type: 'all',
  });

  // Active promotional campaigns
  const now = new Date().toISOString();
  const activeCampaigns = campaigns
    .filter((c) => c.status === 'active' && (!c.startDate || c.startDate <= now) && (!c.endDate || c.endDate >= now))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const marqueeCampaign = activeCampaigns.find((c) => c.marqueeEnabled);
  const heroCampaign = activeCampaigns[0];

  // 1. Shuffled / Randomized products for logged-out users
  // "when user is not logged in show him every product at ramdomly"
  const displayedProducts = useMemo(() => {
    if (!user) {
      // Deterministically or pseudo-randomly shuffle all products
      const shuffled = [...products];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (i * 7 + 3) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    // If logged in with female or male gender preference:
    if (user.gender === 'female') {
      const femaleItems = products.filter(
        (p) => p.category === 'women' || p.genderFocus === 'female' || p.category === 'accessories'
      );
      const otherItems = products.filter(
        (p) => !(p.category === 'women' || p.genderFocus === 'female' || p.category === 'accessories')
      );
      return [...femaleItems, ...otherItems];
    }
    if (user.gender === 'male') {
      const maleItems = products.filter(
        (p) => p.category === 'men' || p.genderFocus === 'male'
      );
      const otherItems = products.filter(
        (p) => !(p.category === 'men' || p.genderFocus === 'male')
      );
      return [...maleItems, ...otherItems];
    }
    return products;
  }, [products, user]);

  const handleBannerClick = (campaign) => {
    trackEvent({
      type: 'campaign_click',
      campaignId: campaign.id,
      campaignName: campaign.name,
    });
  };

  const handleAdminDeleteBanner = (campaignId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this promotional banner?')) {
      deleteCampaign(campaignId, user);
    }
  };

  const handleAdminAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.title.trim()) return;

    await saveProduct(
      {
        title: newProductForm.title,
        brand: newProductForm.brand,
        category: newProductForm.category,
        price: Number(newProductForm.price),
        originalPrice: Number(newProductForm.originalPrice),
        description: newProductForm.description,
        thumbnail: newProductForm.thumbnail,
        images: [newProductForm.thumbnail],
        rating: 4.9,
        reviewsCount: 1,
        variants: [
          {
            sku: `SCAR-${Date.now().toString().slice(-4)}`,
            size: 'Standard',
            price: Number(newProductForm.price),
            stock: Number(newProductForm.stock),
          },
        ],
      },
      user
    );

    setShowAddProductModal(false);
    setNewProductForm({
      title: '',
      brand: 'SCAR Atelier',
      category: 'women',
      price: 3999,
      originalPrice: 5999,
      description: 'Artisanal high-luxury crafted for effortless elegance across India.',
      stock: 10,
      thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    });
  };

  const handleAdminAddBanner = async (e) => {
    e.preventDefault();
    if (!newBannerForm.name.trim()) return;

    await createCampaign(
      {
        name: newBannerForm.name,
        headline: newBannerForm.headline,
        description: newBannerForm.description,
        discountType: newBannerForm.discountType,
        discountValue: Number(newBannerForm.discountValue),
        type: newBannerForm.type,
        status: 'active',
        priority: 10,
        ctaText: 'Explore Offer',
        ctaUrl: '/catalog',
      },
      user,
      true
    );

    setShowAddBannerModal(false);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden font-satoshi selection:bg-brand-orange selection:text-white">
      {/* 1. Marquee Announcement Bar */}
      {marqueeCampaign && (
        <div className="bg-gray-950 text-white py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-3 shadow-sm overflow-hidden w-full border-b border-white/10">
          <Megaphone className="w-4 h-4 shrink-0 text-brand-orange animate-bounce" />
          <Link
            to={marqueeCampaign.ctaUrl || '/catalog'}
            onClick={() => handleBannerClick(marqueeCampaign)}
            className="hover:underline flex items-center gap-2 tracking-wide font-satoshi"
          >
            <span>{marqueeCampaign.marqueeText}</span>
            <span className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors">
              {marqueeCampaign.ctaText || 'Shop Now'} &rarr;
            </span>
          </Link>
        </div>
      )}

      {/* 2. Full-Screen Edge-to-Edge Hero Section with Deep Blue Background */}
      <section
        style={{
          backgroundImage: "linear-gradient(rgba(8, 18, 46, 0.82), rgba(4, 9, 28, 0.94)), url('/blue-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center text-white overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-28 shadow-2xl"
      >
        {/* Subtle Ambient Light Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/25 via-brand-orange/15 to-transparent blur-3xl rounded-full"
        />

        <div className="relative mx-auto max-w-5xl flex flex-col items-center text-center z-10 space-y-6">
          {/* Welcome Badge in Pure Indian English */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/20 px-5 py-2 text-xs font-bold text-blue-200 backdrop-blur shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Namaste &bull; Welcome to SCAR Official Store</span>
          </div>

          {/* Main Introduction Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            India's Premier Destination for{' '}
            <span className="block mt-2 bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              Luxury Fashion &amp; Modern Lifestyle.
            </span>
          </h1>

          {/* Explanatory intro in Pure Indian English */}
          <p className="mt-4 text-base sm:text-lg lg:text-xl text-blue-100/90 max-w-3xl leading-relaxed font-medium">
            Discover 100% authentic curated designer collections, handcrafted mulberry silk gowns, Italian merino wool overcoats, automatic chronographs, and studio acoustics. Seamless checkout reservations with free express doorstep delivery across India.
          </p>

          {/* CTAs: Explore Products button */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#products-showcase"
              className="inline-flex items-center gap-2.5 rounded-xl bg-brand-orange px-9 py-4 text-sm font-bold text-white shadow-glow hover:bg-orange-600 transition-colors cursor-pointer select-none"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </a>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2.5 rounded-xl border border-white/25 bg-white/10 hover:bg-white/20 px-7 py-4 text-sm font-semibold text-white transition-colors backdrop-blur select-none"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-10 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm text-blue-200 font-medium">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              100% Genuine Guaranteed
            </span>
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-300 shrink-0" />
              Express Delivery Across India
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400 shrink-0" />
              All Prices Inclusive of GST
            </span>
          </div>
        </div>
      </section>

      {/* 3. On-Scroll Content Container with Light/White Background */}
      <div className="space-y-16 py-12 bg-white dark:bg-scar-950 transition-colors">
        {/* Promotional Discount Banners */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-brand-orange" />
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Current Offers &amp; Festive Specials
            </h2>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddBannerModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Promo Banner</span>
            </button>
          )}
        </div>

        {activeCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="relative rounded-2xl bg-gradient-to-r from-orange-600 via-brand-orange to-amber-600 p-6 text-white shadow-md flex flex-col justify-between transition-all"
              >
                {isAdmin && (
                  <button
                    onClick={(e) => handleAdminDeleteBanner(camp.id, e)}
                    className="absolute top-3 right-3 p-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                    title="Admin: Delete Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Banner</span>
                  </button>
                )}

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    SPECIAL OFFER &bull; {camp.discountValue}% OFF
                  </span>
                  <h3 className="text-lg sm:text-xl font-black">{camp.name}</h3>
                  <p className="text-xs text-orange-100 mt-1 max-w-md">{camp.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-100">{camp.headline}</span>
                  <Link
                    to={camp.ctaUrl || '/catalog'}
                    onClick={() => handleBannerClick(camp)}
                    className="bg-white text-orange-600 hover:bg-orange-50 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    {camp.ctaText || 'Shop Offer'} &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 text-center text-xs text-gray-500">
            No active promotional banners right now. All standard products available with complimentary pan-India shipping.
          </div>
        )}
      </section>

      {/* 4. Category Circles Rail */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            Shop by Category
          </h2>
          <Link to="/catalog" className="text-xs font-bold text-brand-orange hover:underline">
            View All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {DEMO_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className="p-4 rounded-2xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-900 text-center hover:border-brand-orange hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-scar-800 flex items-center justify-center text-brand-orange group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-base">{cat.name.charAt(0)}</span>
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-orange transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Main Products Showcase (Randomized for Guests, Editable for Admin) */}
      <section id="products-showcase" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-scar-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {user ? `Curated Showcase for ${user.name}` : 'Explore All Products'}
              </h2>
              <span className="text-xs bg-gray-100 dark:bg-scar-800 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full font-bold">
                {displayedProducts.length} Items Available
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {!user
                ? 'Showing every product randomly across our fashion, footwear, and audio collections.'
                : 'Tailored specifically for you based on your registered preferences.'}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Product</span>
            </button>
          )}
        </div>

        {/* Auto-Aligning CSS Grid: Automatically realigns smoothly when items are deleted/added */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300">
          {displayedProducts.map((product) => (
            <div key={product.id || product.slug} className="transition-all duration-300">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
      </div>

      {/* Admin Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-scar-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-scar-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-scar-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Admin: Add New Product</h3>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminAddProduct} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Banarasi Silk Evening Gown"
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm({ ...newProductForm, brand: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                  >
                    <option value="women">Women's Collection</option>
                    <option value="men">Men's Apparel</option>
                    <option value="footwear">Footwear</option>
                    <option value="accessories">Accessories & Watches</option>
                    <option value="electronics">Acoustics & Tech</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={newProductForm.originalPrice}
                    onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProductForm.thumbnail}
                  onChange={(e) => setNewProductForm({ ...newProductForm, thumbnail: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Product Description</label>
                <textarea
                  rows="2"
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-scar-800">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-scar-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Add Product to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Add Banner Modal */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-scar-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-scar-700">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-scar-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Admin: Add Discount Banner</h3>
              </div>
              <button
                onClick={() => setShowAddBannerModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminAddBanner} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  value={newBannerForm.name}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Headline Text</label>
                <input
                  type="text"
                  required
                  value={newBannerForm.headline}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, headline: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={newBannerForm.discountValue}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, discountValue: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Category Scope</label>
                  <select
                    value={newBannerForm.type}
                    onChange={(e) => setNewBannerForm({ ...newBannerForm, type: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                  >
                    <option value="all">All Products</option>
                    <option value="category">Category-specific</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                <textarea
                  rows="2"
                  value={newBannerForm.description}
                  onChange={(e) => setNewBannerForm({ ...newBannerForm, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-scar-800">
                <button
                  type="button"
                  onClick={() => setShowAddBannerModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-scar-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
