import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/cn';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

export const CheckoutPage = () => {
  const { items, subtotal, shipping, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
  });

  // Sync user data if user logs in or profile loads
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address?.street || '',
        city: prev.city || user.address?.city || '',
        state: prev.state || user.address?.state || '',
        postalCode: prev.postalCode || user.address?.postalCode || '',
      }));
    }
  }, [user]);

  const [paymentMode, setPaymentMode] = useState('simulated'); // 'simulated' or 'razorpay_test'
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // In live or demo environment, create idempotent checkout reservation
      const orderPayload = {
        orderId: `SCAR-ORD-${Date.now().toString().slice(-6)}`,
        items,
        total: grandTotal,
        shippingAddress: formData,
        paymentMode,
        timestamp: new Date().toISOString(),
      };

      // Simulate network reservation hold
      await new Promise((res) => setTimeout(res, 1200));

      setOrderComplete(orderPayload);
      clearCart();
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Order Confirmed!</h1>
        <p className="text-xs text-gray-500">
          Order reference: <code className="font-mono font-bold text-gray-800 dark:text-gray-200">{orderComplete.orderId}</code>
        </p>

        <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 text-left space-y-4">
          <div className="flex justify-between text-xs pb-3 border-b border-gray-100 dark:border-scar-800">
            <span className="text-gray-500">Payment Status</span>
            <span className="font-bold text-emerald-600 uppercase">Simulated Sandbox Verified</span>
          </div>
          <div className="flex justify-between text-xs pb-3 border-b border-gray-100 dark:border-scar-800">
            <span className="text-gray-500">Total Paid</span>
            <span className="font-extrabold text-gray-900 dark:text-white">{formatCurrency(orderComplete.total)}</span>
          </div>
          <div className="text-xs text-gray-500">
            Delivery to: <span className="font-medium text-gray-800 dark:text-gray-200">{orderComplete.shippingAddress.address}, {orderComplete.shippingAddress.city}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link to="/catalog">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
        <p className="text-xs text-gray-500">Add products before navigating to checkout.</p>
        <Link to="/catalog">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-8">
        Secure Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Shipping & Payment forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center font-bold">1</span>
              Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center font-bold">2</span>
              Payment Selection
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-brand-orange bg-orange-50/40 dark:bg-orange-950/20 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMode === 'simulated'}
                  onChange={() => setPaymentMode('simulated')}
                  className="mt-1 accent-brand-orange"
                />
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>Simulated Demo Payment (Zero Financial Transfer)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Recommended</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Instant sandbox authorization with zero risk. No real bank credentials, card PINs, or OTPs required.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-scar-800 cursor-pointer opacity-75">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMode === 'razorpay_test'}
                  onChange={() => setPaymentMode('razorpay_test')}
                  className="mt-1 accent-brand-orange"
                />
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    Razorpay / Stripe Test Sandbox
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Uses configured test gateway keys when active in environment variables.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Order Summary</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.sku} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <img
                      src={item.image}
                      alt=""
                      className="w-8 h-8 rounded object-cover shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=100&q=80';
                      }}
                    />
                    <span className="truncate">{item.title} &times; {item.quantity}</span>
                  </div>
                  <span className="font-bold shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-scar-800 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-scar-800">
                <span>Total Amount</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              className="w-full py-3.5 text-sm font-bold shadow-glow"
              icon={Lock}
            >
              Authorize &amp; Complete Order
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
