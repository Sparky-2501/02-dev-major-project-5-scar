import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  Shield,
  FileText,
  Heart,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CATEGORIES } from '../../data/catalog';

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQuantity, setIsOpen } = useCart();
  const { user, isAdmin, isManager, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-scar-800 dark:bg-scar-950/95 transition-colors overflow-x-hidden">
      {/* Top Banner (Responsive & Wrap-Friendly to prevent mobile horizontal scroll) */}
      <div className="bg-gray-900 px-3 py-1.5 text-center text-[11px] sm:text-xs font-medium text-white flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
        <span className="truncate max-w-[280px] sm:max-w-none">
          SCAR Autumn/Winter Edit &mdash; Complimentary Express Shipping Above ₹1,999
        </span>
        {isAdmin && (
          <Link
            to="/admin"
            className="ml-1 sm:ml-2 bg-orange-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-orange-500 shrink-0"
          >
            Admin Suite
          </Link>
        )}
        {isManager && !isAdmin && (
          <Link
            to="/manager"
            className="ml-1 sm:ml-2 bg-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500 shrink-0"
          >
            Manager Suite
          </Link>
        )}
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 -ml-1 text-gray-700 hover:text-black dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-scar-900"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-brand-orange flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
              SCAR<span className="text-brand-orange">.</span>
            </span>
          </Link>

          {/* Desktop Categories */}
          <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-semibold text-gray-700 dark:text-gray-300">
            {DEMO_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.slug}`}
                className="hover:text-brand-orange transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
            <input
              type="text"
              placeholder="Search products, brands, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-52 md:w-64 lg:w-72 rounded-full border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-4 text-xs focus:border-brand-orange focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange dark:border-scar-700 dark:bg-scar-900 dark:text-white"
            />
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          </form>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden p-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-scar-900"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account Profile Link */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-brand-orange p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-scar-900 transition-colors"
                title="Account Profile"
              >
                <div className="w-6 h-6 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center font-bold text-[11px]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline">{user.name ? user.name.split(' ')[0] : 'Profile'}</span>
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 text-xs font-bold text-gray-800 dark:text-gray-200 hover:text-brand-orange p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-scar-900"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Shopping Bag Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-gray-800 dark:text-gray-200 hover:text-brand-orange transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-scar-900"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-black text-white shadow-sm">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown Bar */}
      {isSearchOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-scar-800 p-3 bg-white dark:bg-scar-950">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search SCAR catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-xs focus:outline-none dark:border-scar-700 dark:bg-scar-900"
              autoFocus
            />
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          </form>
        </div>
      )}

      {/* Full-Featured Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-scar-950 h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
            <div className="p-5 space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-scar-800">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-orange flex items-center justify-center text-white font-black text-sm">
                    S
                  </div>
                  <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                    SCAR<span className="text-brand-orange">.</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-gray-500 hover:text-black dark:text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Drawer Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-scar-800 bg-gray-50 dark:bg-scar-900 py-2 pl-9 pr-3 text-xs"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </form>

              {/* Department Links */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Shop Departments
                </p>
                <div className="space-y-1">
                  <Link
                    to="/catalog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-2.5 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-orange-50 hover:text-brand-orange dark:hover:bg-scar-900"
                  >
                    <span>All Products</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  {DEMO_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/catalog?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2 px-2.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-orange-50 hover:text-brand-orange dark:hover:bg-scar-900"
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Account / Suites */}
              <div className="pt-2 border-t border-gray-100 dark:border-scar-800">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Account & Portals
                </p>
                <div className="space-y-1">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 px-2.5 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-scar-900"
                      >
                        <User className="w-4 h-4 text-brand-orange" />
                        <span>My Profile ({user.name})</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-2 px-2.5 rounded-xl text-xs font-bold text-orange-600 hover:bg-orange-50 dark:hover:bg-scar-900"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Suite</span>
                        </Link>
                      )}
                      {isManager && (
                        <Link
                          to="/manager"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-2 px-2.5 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-scar-900"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Manager Studio</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 py-2 px-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold shadow-md"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In / Register</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer Links */}
            <div className="p-5 border-t border-gray-100 dark:border-scar-800 bg-gray-50/70 dark:bg-scar-900/50 space-y-2 text-[11px] text-gray-500">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <Link
                  to="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-black dark:hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-black dark:hover:text-white"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="/creator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-black dark:hover:text-white font-medium"
                >
                  About Creator
                </Link>
              </div>
              <p className="text-[10px] text-gray-400">
                &copy; 2026 SCAR Retail Technologies Inc.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
