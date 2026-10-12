import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_PRODUCTS } from '../data/catalog';
import { formatCurrency } from '../utils/cn';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  ShieldCheck,
  AlertTriangle,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [inventoryList, setInventoryList] = useState(DEMO_PRODUCTS);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-xs text-gray-500">You must be logged in as an administrator to access this area.</p>
      </div>
    );
  }

  // Quick metrics calculations
  const totalGMV = 1845900;
  const totalOrders = 342;
  const lowStockCount = inventoryList.filter((p) =>
    p.variants.some((v) => v.stock <= 2 && v.stock > 0)
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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
            Real-time catalog inventory, concurrency status, and aggregated sales metrics
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-scar-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-white dark:bg-scar-900 shadow-sm text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'inventory' ? 'bg-white dark:bg-scar-900 shadow-sm text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Inventory Control
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'audit' ? 'bg-white dark:bg-scar-900 shadow-sm text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* METRICS TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
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

      {/* INVENTORY CONTROL TAB */}
      {activeTab === 'inventory' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-scar-800 text-gray-500">
                <th className="pb-3 font-bold">Product</th>
                <th className="pb-3 font-bold">Category</th>
                <th className="pb-3 font-bold">Price</th>
                <th className="pb-3 font-bold">SKU &amp; Variant Stock</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-scar-800">
              {inventoryList.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/50 dark:hover:bg-scar-800/30">
                  <td className="py-3 flex items-center gap-3">
                    <img src={prod.thumbnail} alt="" className="w-9 h-9 rounded object-cover" />
                    <span className="font-bold text-gray-900 dark:text-white truncate max-w-xs">{prod.title}</span>
                  </td>
                  <td className="py-3 capitalize text-gray-600 dark:text-gray-400">{prod.category}</td>
                  <td className="py-3 font-bold">{formatCurrency(prod.price)}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      {prod.variants.map((v) => (
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
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant={prod.variants.some((v) => v.stock > 0) ? 'success' : 'danger'} size="sm">
                      {prod.variants.some((v) => v.stock > 0) ? 'Live' : 'Out of Stock'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AUDIT LOG TAB */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 space-y-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-scar-800 flex justify-between items-center">
            <span>[2026-10-12T08:18:22Z] AUTH_LOGIN: admin@scar.local - 200 OK (MFA Verified)</span>
            <Badge variant="success" size="sm">AUDIT_SECURE</Badge>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-scar-800 flex justify-between items-center">
            <span>[2026-10-12T08:15:40Z] CONCURRENCY_CHECK: Atomic lock validated on SKU M1-BLK-XL</span>
            <Badge variant="brand" size="sm">STOCK_GUARD</Badge>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-scar-800 flex justify-between items-center">
            <span>[2026-10-12T08:12:05Z] RATE_LIMIT_RESET: Sliding window counter cleared</span>
            <Badge variant="default" size="sm">SECURITY</Badge>
          </div>
        </div>
      )}
    </div>
  );
};
