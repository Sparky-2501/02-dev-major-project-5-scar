import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('scar_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('scar_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product, selectedVariant, quantity = 1) => {
    setItems((prev) => {
      const variantSku = selectedVariant?.sku || product.variants?.[0]?.sku || 'default';
      const existingIndex = prev.findIndex((item) => item.productId === product.id && item.sku === variantSku);
      
      const itemData = {
        productId: product.id,
        title: product.title,
        price: selectedVariant?.price || product.price,
        image: product.thumbnail || product.images?.[0] || '/images/products/men/men_1.png',
        sku: variantSku,
        variantName: selectedVariant ? `${selectedVariant.color || ''} ${selectedVariant.size || ''}`.trim() : 'Standard',
        maxStock: selectedVariant?.stock ?? 10,
      };

      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(next[existingIndex].quantity + quantity, itemData.maxStock);
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      } else {
        return [...prev, { ...itemData, quantity: Math.min(quantity, itemData.maxStock) }];
      }
    });
    setIsOpen(true);
  };

  const updateQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.sku === sku ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item
      )
    );
  };

  const removeFromCart = (sku) => {
    setItems((prev) => prev.filter((item) => item.sku !== sku));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1999 || items.length === 0 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalQuantity,
        subtotal,
        shipping,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
