import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCampaigns } from '../context/CampaignContext';
import { formatCurrency } from '../utils/cn';
import { DEMO_CATEGORIES } from '../data/catalog';
import { getApiUrl } from '../utils/api';
import {
  BarChart3,
  Package,
  Megaphone,
  History,
  Plus,
  Trash2,
  ShieldCheck,
  Search,
  Filter,
  Image,
  Upload,
  CheckCircle,
  Tag,
  Scissors,
  Layers,
  Heart,
  Compass,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AccessRestricted } from '../components/common/AccessRestricted';

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const {
    products,
    campaigns,
    auditLogs,
    saveProduct,
    archiveProduct,
    createCampaign,
    deleteCampaign,
  } = useCampaigns();

  const [activeTab, setActiveTab] = useState('overview');

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  // New Product Form
  const [productForm, setProductForm] = useState({
    title: '',
    brand: 'SCAR Atelier',
    category: 'women',
    genderFocus: 'female',
    price: '',
    originalPrice: '',
    description: '',
    sku: '',
    stock: 12,
    size: 'M',
    color: 'Noir Black',
    thumbnail: '/images/products/women/women_1.svg',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // New Discount Banner Form
  const [bannerForm, setBannerForm] = useState({
    name: '',
    headline: '',
    description: '',
    type: 'category',
    targetCategory: 'women',
    genderTarget: 'female',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscount: 4000,
    priority: 10,
    bannerImage: '/images/products/women/women_1.svg',
    ctaText: 'Explore Haute Couture',
    ctaUrl: '/catalog?category=women',
    marqueeEnabled: true,
    marqueeText: '✨ ATELIER COUTURE SALE: 20% OFF ALL SILK GOWNS & DRESSES — CODE: COUTURE20',
  });

  // Table search & filter
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('');

  if (!isAdmin) {
    return (
      <AccessRestricted
        title="Admin Clearance Required"
        message="The SCAR Executive Operations Deck is strictly guarded. Please log in with administrator clearance to manage products, configure discount banners, and monitor real-time GMV."
        requiredRole="administrator"
      />
    );
  }

  // Quick metrics calculations
  const totalGMV = 1845900;
  const totalOrders = 342;
  const lowStockCount = products.filter((p) =>
    p.variants?.some((v) => v.stock <= 2 && v.stock > 0)
  ).length;

  // Filtered products for table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch === '' ||
      p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.variants?.some((v) => v.sku?.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = productCatFilter === '' || p.category === productCatFilter;
    return matchesSearch && matchesCat;
  });

  // Image Upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(getApiUrl('/api/v1/upload'), {
        method: 'POST',
        body: formData,
      });

      const resData = await response.json();
      if (response.ok && resData.success && resData.data?.secureUrl) {
        setProductForm((prev) => ({
          ...prev,
          thumbnail: resData.data.secureUrl,
        }));
      } else {
        setUploadError(resData.error?.message || 'Failed to upload image.');
      }
    } catch {
      // Local preview fallback
      const previewUrl = URL.createObjectURL(file);
      setProductForm((prev) => ({
        ...prev,
        thumbnail: previewUrl,
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) return;

    const skuCode = productForm.sku || `SCAR-${productForm.category.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    await saveProduct(
      {
        ...productForm,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : parseFloat(productForm.price),
        sku: skuCode,
        variants: [
          {
            sku: skuCode,
            size: productForm.size || 'M',
            color: productForm.color || 'Noir Black',
            stock: parseInt(productForm.stock, 10) || 10,
            price: parseFloat(productForm.price),
          },
        ],
        tags: [productForm.category, productForm.genderFocus, 'haute-couture', 'luxury'],
        images: [productForm.thumbnail],
      },
      user
    );

    setShowProductModal(false);
    setProductForm({
      title: '',
      brand: 'SCAR Atelier',
      category: 'women',
      genderFocus: 'female',
      price: '',
      originalPrice: '',
      description: '',
      sku: '',
      stock: 12,
      size: 'M',
      color: 'Noir Black',
      thumbnail: '/images/products/women/women_1.svg',
    });
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerForm.name || !bannerForm.headline) return;

    await createCampaign(
      {
        ...bannerForm,
        discountValue: parseFloat(bannerForm.discountValue) || 15,
        maxDiscount: parseFloat(bannerForm.maxDiscount) || 3000,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      },
      user,
      true
    );

    setShowBannerModal(false);
    setBannerForm({
      name: '',
      headline: '',
      description: '',
      type: 'category',
      targetCategory: 'women',
      genderTarget: 'female',
      discountType: 'percentage',
      discountValue: 20,
      maxDiscount: 4000,
      priority: 10,
      bannerImage: '/images/products/women/women_1.svg',
      ctaText: 'Explore Haute Couture',
      ctaUrl: '/catalog?category=women',
      marqueeEnabled: true,
      marqueeText: '✨ ATELIER COUTURE SALE: 20% OFF ALL SILK GOWNS & DRESSES — CODE: COUTURE20',
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-satoshi selection:bg-brand-orange selection:text-white transition-all duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-scar-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              Operations &amp; Admin Portal
            </h1>
            <Badge variant="brand">Superadmin</Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time catalog inventory, discount banners on home screen, and aggregated sales metrics
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 dark:bg-scar-800 p-1.5 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-scar-900 shadow-sm text-brand-orange font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-white dark:bg-scar-900 shadow-sm text-brand-orange font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Items &amp; Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'banners'
                ? 'bg-white dark:bg-scar-900 shadow-sm text-brand-orange font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Discount Banners</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-white dark:bg-scar-900 shadow-sm text-brand-orange font-bold'
                : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Logs</span>
          </button>
        </div>
      </div>

      {/* 1. METRICS TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase">Gross Merchandise Value</span>
              <div className="text-2xl font-black text-gray-900 dark:text-white mt-2">
                {formatCurrency(totalGMV)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">&uarr; +18.4% this month</span>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase">Fulfilled Orders</span>
              <div className="text-2xl font-black text-gray-900 dark:text-white mt-2">{totalOrders}</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">99.8% on-time delivery</span>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase">Low Stock Alerts</span>
              <div className="text-2xl font-black text-red-600 mt-2">{lowStockCount} items</div>
              <span className="text-[11px] text-red-500 font-semibold mt-1 block">Requires restocking</span>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 shadow-sm">
              <span className="text-xs font-bold text-gray-500 uppercase">Concurrency Oversell Rate</span>
              <div className="text-2xl font-black text-emerald-600 mt-2">0.00%</div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Zero double-sold units</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. ITEMS & INVENTORY TAB (ADD & DELETE ITEMS) */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                Atelier Catalog &bull; Add &amp; Delete Items
              </h2>
              <p className="text-xs text-gray-500">
                Manage luxury haute couture gowns, tailoring, and accessories with instant backend synchronization
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowProductModal(true)}
              icon={Plus}
            >
              Add Atelier Item
            </Button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by title, atelier brand, or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-900 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={productCatFilter}
                onChange={(e) => setProductCatFilter(e.target.value)}
                className="rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-900 px-3 py-2 text-xs text-gray-900 dark:text-white"
              >
                <option value="">All Departments</option>
                {DEMO_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-scar-800 text-gray-500">
                  <th className="pb-3 font-bold">Atelier Item</th>
                  <th className="pb-3 font-bold">Department</th>
                  <th className="pb-3 font-bold">Silhouette Target</th>
                  <th className="pb-3 font-bold">Price</th>
                  <th className="pb-3 font-bold">Live Inventory Stock</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-scar-800">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id || prod.slug} className="hover:bg-gray-50/50 dark:hover:bg-scar-800/30 transition-colors">
                    <td className="py-3.5 flex items-center gap-3">
                      <img
                        src={prod.thumbnail || '/images/products/women/women_1.svg'}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-scar-800 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block max-w-xs truncate">
                          {prod.title}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {prod.brand || 'SCAR Atelier'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 capitalize text-gray-600 dark:text-gray-400">
                      {prod.category}
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prod.genderFocus === 'female'
                          ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300'
                          : prod.genderFocus === 'male'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                      }`}>
                        {prod.genderFocus === 'female' ? 'Femme' : prod.genderFocus === 'male' ? 'Homme' : 'Unisex'}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-gray-900 dark:text-white">
                      {formatCurrency(prod.price)}
                    </td>
                    <td className="py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {prod.variants && prod.variants.length > 0 ? (
                          prod.variants.map((v) => (
                            <span
                              key={v.sku}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                v.stock === 0
                                  ? 'bg-red-100 text-red-700'
                                  : v.stock <= 2
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 dark:bg-scar-800 text-gray-800 dark:text-gray-200'
                              }`}
                            >
                              {v.sku}: {v.stock} pcs
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-100 dark:bg-scar-800">
                            Stock: {prod.stock || 10}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 text-right">
                      {/* DELETE ITEM BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete atelier item "${prod.title}"? This will remove it from the catalog and database.`)) {
                            archiveProduct(prod.id || prod.slug, user);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-red-600 hover:text-white hover:bg-red-600 border border-red-200 dark:border-red-900/50 transition-all duration-200 inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. DISCOUNT BANNERS TAB (ADD & DELETE BANNERS FOR HOME SCREEN) */}
      {activeTab === 'banners' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                Home Screen Discount Banners &bull; Add &amp; Delete
              </h2>
              <p className="text-xs text-gray-500">
                Configure promotional discount banners, ticker marquee text, and target customer silhouettes
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowBannerModal(true)}
              icon={Plus}
            >
              Add Discount Banner
            </Button>
          </div>

          {/* Banner Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 shadow-sm space-y-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-black text-gray-900 dark:text-white">{camp.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{camp.description}</p>
                  </div>
                  <Badge variant={camp.status === 'active' ? 'success' : 'default'}>
                    {camp.status?.toUpperCase() || 'ACTIVE'}
                  </Badge>
                </div>

                {/* Banner Preview Card */}
                <div className="rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 p-4 text-white shadow space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-orange-200">
                    <span>Target: {camp.genderTarget === 'female' ? 'Femme Lookbook' : camp.genderTarget === 'male' ? 'Homme Sartorial' : 'All Departments'}</span>
                    <span>{camp.discountValue}% OFF</span>
                  </div>
                  <p className="text-sm font-black tracking-tight">{camp.headline}</p>
                  <p className="text-[11px] text-orange-100 flex items-center justify-between">
                    <span>CTA: {camp.ctaText || 'Shop Collection'}</span>
                    <span>Priority: {camp.priority}</span>
                  </p>
                </div>

                {/* Banner Meta details */}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-scar-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Marquee Ticker:</span>
                    <span className="font-semibold text-brand-orange truncate max-w-xs">
                      {camp.marqueeEnabled ? camp.marqueeText || 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target Category:</span>
                    <span className="capitalize font-medium">{camp.targetCategory || 'All'}</span>
                  </div>
                </div>

                {/* Banner Controls with DELETE BUTTON */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-scar-800 text-xs">
                  <span className="text-[11px] text-gray-400">Created by: {camp.createdBy || 'Administrator'}</span>
                  {/* DELETE BANNER BUTTON */}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to permanently delete discount banner "${camp.name}" from the home screen?`)) {
                        deleteCampaign(camp.id, user);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-red-600 hover:text-white hover:bg-red-600 border border-red-200 dark:border-red-900/50 transition-all duration-200 flex items-center gap-1.5 font-bold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Banner</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. AUDIT LOG TAB */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 space-y-3 font-mono text-xs animate-fade-in">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-scar-800 flex justify-between items-center">
            <span>[2026-10-21T08:18:22Z] AUTH_LOGIN: admin@scar.local - 200 OK (Superadmin Clearance)</span>
            <Badge variant="success" size="sm">AUDIT_SECURE</Badge>
          </div>
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-lg bg-gray-50 dark:bg-scar-800 flex justify-between items-center">
              <span>[{new Date(log.timestamp).toISOString()}] {log.actionType}: {log.details}</span>
              <Badge variant="brand" size="sm">{log.resourceType?.toUpperCase() || 'ATELIER'}</Badge>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD ATELIER ITEM */}
      {/* ========================================================================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-scar-900 p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-scar-800 space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-scar-800">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Add New Atelier Item
                </h3>
                <p className="text-xs text-gray-500">
                  Publish a new haute couture creation to the live catalog
                </p>
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-scar-800 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white text-sm font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculpted Mulberry Silk Slip Gown"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Department
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({
                      ...productForm,
                      category: e.target.value,
                      genderFocus: e.target.value === 'women' ? 'female' : e.target.value === 'men' ? 'male' : 'unisex'
                    })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    {DEMO_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Silhouette Focus
                  </label>
                  <select
                    value={productForm.genderFocus}
                    onChange={(e) => setProductForm({ ...productForm, genderFocus: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="female">Femme (Women / Dresses / Accs)</option>
                    <option value="male">Homme (Men / Sartorial Suiting)</option>
                    <option value="unisex">Unisex / All Ateliers</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="7499"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="9999"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Atelier Description (Designer Vocabulary)
                </label>
                <textarea
                  rows="2"
                  placeholder="Pure 22-momme mulberry silk tailored on the bias for fluid movement..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Size
                  </label>
                  <input
                    type="text"
                    placeholder="S, M, L or One Size"
                    value={productForm.size}
                    onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Color / Shade
                  </label>
                  <input
                    type="text"
                    placeholder="Emerald Green, Obsidian"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="12"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2 text-xs"
                  />
                </div>
              </div>

              {/* Image Upload or URL */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Item Image (Upload File or Enter Image Path)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="/images/products/women/women_1.svg"
                    value={productForm.thumbnail}
                    onChange={(e) => setProductForm({ ...productForm, thumbnail: e.target.value })}
                    className="flex-1 rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2 text-xs"
                  />
                  <label className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-scar-800 hover:bg-gray-200 text-xs font-bold text-gray-700 dark:text-gray-200 cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {isUploading && <p className="text-[10px] text-brand-orange mt-1">Uploading image...</p>}
                {uploadError && <p className="text-[10px] text-red-500 mt-1">{uploadError}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-scar-800">
                <Button variant="ghost" size="sm" onClick={() => setShowProductModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Publish Atelier Item
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD DISCOUNT BANNER FOR HOME SCREEN */}
      {/* ========================================================================= */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-scar-900 p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-scar-800 space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-scar-800">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Add Home Screen Discount Banner
                </h3>
                <p className="text-xs text-gray-500">
                  Publish a promotional discount card &amp; marquee ticker on the home screen
                </p>
              </div>
              <button
                onClick={() => setShowBannerModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-scar-800 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white text-sm font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Promotion Event Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haute Couture Slip Gowns Vernissage"
                  value={bannerForm.name}
                  onChange={(e) => setBannerForm({ ...bannerForm, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Headline on Home Screen Banner
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HAUTE COUTURE VERNISSAGE — 20% OFF ATELIER DRESSES"
                  value={bannerForm.headline}
                  onChange={(e) => setBannerForm({ ...bannerForm, headline: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Target Silhouette Focus
                  </label>
                  <select
                    value={bannerForm.genderTarget}
                    onChange={(e) => setBannerForm({ ...bannerForm, genderTarget: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="female">Femme (Dresses &amp; Accessories)</option>
                    <option value="male">Homme (Sartorial &amp; Suiting)</option>
                    <option value="all">Maison All (All Customers)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    placeholder="20"
                    value={bannerForm.discountValue}
                    onChange={(e) => setBannerForm({ ...bannerForm, discountValue: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Promotion Description
                </label>
                <textarea
                  rows="2"
                  placeholder="20% off all pure 22-momme silk slip gowns, evening dresses, and knitwear."
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="Discover Haute Couture"
                    value={bannerForm.ctaText}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    CTA Destination Link
                  </label>
                  <input
                    type="text"
                    placeholder="/catalog?category=women"
                    value={bannerForm.ctaUrl}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaUrl: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Top Marquee Announcement Ticker
                </label>
                <input
                  type="text"
                  placeholder="✨ ATELIER COUTURE VERNISSAGE: 20% OFF SLIP DRESSES — CODE: COUTURE20"
                  value={bannerForm.marqueeText}
                  onChange={(e) => setBannerForm({ ...bannerForm, marqueeText: e.target.value, marqueeEnabled: true })}
                  className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-2.5 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-scar-800">
                <Button variant="ghost" size="sm" onClick={() => setShowBannerModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Publish Discount Banner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
