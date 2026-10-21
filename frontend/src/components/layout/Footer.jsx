import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-scar-900 text-gray-300 border-t border-scar-800 font-satoshi">
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-1 sm:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <img
              src="/29abd43a-8155-4c06-ba7b-d4524dfc2619.png"
              alt="SCAR Official Logo"
              className="w-9 h-9 object-contain rounded-full shadow-sm bg-white dark:bg-scar-800 p-0.5"
            />
            <span className="text-2xl font-black tracking-tighter text-white">
              SCAR<span className="text-brand-orange">.</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-md mb-4">
            SCAR is a high-concurrency modern retail platform combining luxury craftsmanship, intelligent personalization, and rock-solid transactional engineering.
          </p>
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
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Creator & Legal</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                Privacy Policy & Disclaimer
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/creator" className="text-gray-300 hover:text-white transition-colors">
                About the Creator
              </Link>
            </li>
            <li>
              <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
                User Profile Management
              </Link>
            </li>
            <li>
              <a
                href="mailto:prathamesh.shelke@example.com?subject=Custom%20Web%20Design%20Inquiry"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contact for Custom Design
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Left 'Made with love by Prathamesh Shelke' & Right '© 2026 SCAR Retail Technologies Inc.' */}
      <div className="border-t border-scar-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 order-2 sm:order-1">
            <span>Made with love by</span>
            <Link to="/creator" className="font-bold text-white hover:text-brand-orange underline underline-offset-2 transition-colors">
              Prathamesh Shelke
            </Link>
          </div>
          <div className="order-1 sm:order-2 text-right">
            <p>&copy; 2026 SCAR Retail Technologies Inc. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
