import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-scar-900 text-gray-300 border-t border-scar-800">
      {/* Service Highlights */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-b border-scar-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-xl bg-scar-800 text-brand-orange">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Express Delivery</h4>
              <p className="text-xs text-gray-400">Complimentary above ₹1,999</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-xl bg-scar-800 text-brand-orange">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Guaranteed Authentic</h4>
              <p className="text-xs text-gray-400">100% verified luxury & studio goods</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-xl bg-scar-800 text-brand-orange">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hassle-Free Returns</h4>
              <p className="text-xs text-gray-400">14-day doorstep reverse logistics</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-xl bg-scar-800 text-brand-orange">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated Concierge</h4>
              <p className="text-xs text-gray-400">24/7 priority customer support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-brand-orange flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              SCAR<span className="text-brand-orange">.</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-4">
            SCAR is a high-concurrency modern retail platform combining luxury craftsmanship, intelligent personalization, and rock-solid transactional engineering.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-scar-800 text-[11px] font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Production Demo Environment
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Departments</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/catalog?category=men" className="hover:text-white transition-colors">Men's Apparel</Link></li>
            <li><Link to="/catalog?category=women" className="hover:text-white transition-colors">Women's Collection</Link></li>
            <li><Link to="/catalog?category=footwear" className="hover:text-white transition-colors">Performance Footwear</Link></li>
            <li><Link to="/catalog?category=electronics" className="hover:text-white transition-colors">Acoustics & Tech</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Architecture</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            <li><a href="/api/v1/health" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">API Health Check</a></li>
            <li><span className="text-gray-400">Atomic Stock Locks</span></li>
            <li><span className="text-gray-400">NGINX Multi-Instance</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Security & Trust</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li>Argon2id Salted Hashing</li>
            <li>Zero Overselling Guarantee</li>
            <li>Idempotency Keys</li>
            <li>Safe Sandbox Payments</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-scar-800 py-6 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} SCAR Retail Technologies Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};
