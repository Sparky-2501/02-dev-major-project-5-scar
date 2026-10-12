import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Tag } from 'lucide-react';
import { formatCurrency } from '../../utils/cn';
import { Badge } from '../common/Badge';
import { useCart } from '../../context/CartContext';
import { useCampaigns } from '../../context/CampaignContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { getProductDiscount } = useCampaigns();
  
  const discountInfo = getProductDiscount(product);
  const primaryVariant = product.variants?.[0];
  const isLowStock = primaryVariant && primaryVariant.stock <= 2 && primaryVariant.stock > 0;
  const isOutOfStock = primaryVariant && primaryVariant.stock === 0;

  // Active authoritative price
  const displayPrice = discountInfo ? discountInfo.finalPrice : product.price;
  const originalPrice = discountInfo ? discountInfo.originalPrice : product.originalPrice;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      // Pass authoritative price to cart
      addToCart({ ...product, price: displayPrice }, primaryVariant, 1);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-900 overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300">
      {/* Image & Badges */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-scar-800">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {discountInfo && (
            <Badge variant="brand" size="sm" className="bg-brand-orange text-white shadow-sm flex items-center gap-1">
              <Tag className="w-3 h-3" />
              PROMO: {discountInfo.discountPercent}% OFF
            </Badge>
          )}
          {!discountInfo && originalPrice && (
            <Badge variant="brand" size="sm">
              SAVE {Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
            </Badge>
          )}
          {isLowStock && (
            <Badge variant="danger" size="sm">
              Only {primaryVariant.stock} left
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="default" size="sm">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick Add overlay button */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white text-gray-900 shadow-lg hover:bg-brand-orange hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 disabled:opacity-0"
          title="Quick add to cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-brand-orange transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Variant details */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-scar-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(displayPrice)}
            </span>
            {originalPrice && originalPrice > displayPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-gray-500">
            {product.variants?.length > 1 ? `${product.variants.length} options` : 'Standard'}
          </span>
        </div>
      </div>
    </div>
  );
};
