import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { useCart } from '../context/CartContext';
import { DEMO_PRODUCTS } from '../data/catalog';
import { formatCurrency } from '../utils/cn';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Check, Zap, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { products, getProductDiscount } = useCampaigns();
  const product = products.find((p) => p.slug === slug || p.id === slug) || DEMO_PRODUCTS.find((p) => p.slug === slug || p.id === slug) || DEMO_PRODUCTS[0];
  const { addToCart } = useCart();
  const discountInfo = getProductDiscount(product);

  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || product.thumbnail);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const isOutOfStock = selectedVariant && selectedVariant.stock === 0;
  const isLowStock = selectedVariant && selectedVariant.stock <= 2 && selectedVariant.stock > 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, selectedVariant, quantity);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-black dark:hover:text-white">Home</Link>
        <span>/</span>
        <Link to={`/catalog?category=${product.category}`} className="capitalize hover:text-black dark:hover:text-white">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-200 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-900 shadow-sm">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {isLowStock && (
              <div className="absolute top-4 left-4">
                <Badge variant="danger" size="md">
                  Critical Stock: Only {selectedVariant.stock} left!
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-brand-orange shadow-md scale-95'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-brand-orange">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {product.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                {formatCurrency(selectedVariant?.price || product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="brand" size="sm">
                  {Math.round(((product.originalPrice - (selectedVariant?.price || product.price)) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-scar-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900 dark:text-white">Select Variant / Size</span>
                <span className="text-gray-500">
                  SKU: <code className="font-mono text-gray-800 dark:text-gray-200">{selectedVariant?.sku}</code>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.sku === v.sku;
                  return (
                    <button
                      key={v.sku}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-brand-orange bg-orange-50/50 dark:bg-orange-950/20 ring-1 ring-brand-orange'
                          : 'border-gray-200 dark:border-scar-800 hover:border-gray-400 dark:hover:border-scar-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-900 dark:text-white">{v.size || v.color}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {v.stock > 0 ? (
                          <span className={v.stock <= 2 ? 'text-red-500 font-semibold' : 'text-emerald-600'}>
                            {v.stock <= 2 ? `Only ${v.stock} left` : 'In Stock'}
                          </span>
                        ) : (
                          <span className="text-gray-400">Out of Stock</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-6 border-t border-gray-200 dark:border-scar-800 space-y-3">
            <div className="flex gap-4">
              <Button
                variant="primary"
                size="lg"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 py-4 text-base font-extrabold shadow-glow"
                icon={ShoppingBag}
              >
                {isOutOfStock ? 'Sold Out' : addedNotice ? 'Added to Cart!' : 'Add to Bag'}
              </Button>
            </div>

            {/* Atomic Protection Guarantee Banner */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-scar-800/50 border border-gray-200 dark:border-scar-700/60 flex items-start gap-3">
              <Zap className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">Atomic Concurrency Guard:</span> Stocks are decremented atomically with 10-minute checkout reservation holds to prevent overselling.
              </div>
            </div>
          </div>

          {/* Description & Value props */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-scar-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Product Overview
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-scar-900 border border-gray-100 dark:border-scar-800">
                <Truck className="w-4 h-4 mx-auto text-brand-orange mb-1" />
                <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 block">Fast Transit</span>
                <span className="text-[10px] text-gray-500">2-3 Business Days</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-scar-900 border border-gray-100 dark:border-scar-800">
                <ShieldCheck className="w-4 h-4 mx-auto text-brand-orange mb-1" />
                <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 block">Authentic</span>
                <span className="text-[10px] text-gray-500">Direct From Studio</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-scar-900 border border-gray-100 dark:border-scar-800">
                <RefreshCw className="w-4 h-4 mx-auto text-brand-orange mb-1" />
                <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 block">14-Day Returns</span>
                <span className="text-[10px] text-gray-500">Doorstep Pickup</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
