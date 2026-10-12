import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/cn';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, subtotal, shipping, grandTotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-scar-900 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-scar-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-orange" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Shopping Cart</h3>
            <span className="text-xs bg-gray-100 dark:bg-scar-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full font-semibold">
              {items.length} items
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-scar-800 flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your cart is empty</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Discover pieces from our Autumn/Winter studio collection and curated tech.
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
                Explore Catalog
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.sku}
                className="flex gap-4 p-3 rounded-xl border border-gray-100 dark:border-scar-800 bg-gray-50/50 dark:bg-scar-800/40"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-200 dark:bg-scar-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.sku)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Variant: {item.variantName}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-300 dark:border-scar-700 rounded-lg overflow-hidden bg-white dark:bg-scar-900">
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        className="px-2 py-0.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-scar-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="px-2 py-0.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-scar-800 disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-scar-800 p-6 bg-gray-50 dark:bg-scar-950 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Standard Delivery</span>
                <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-scar-800">
                <span>Estimated Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-orange py-3 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition-colors"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
