import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ShieldCheck, Heart, LayoutDashboard } from 'lucide-react';
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
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-scar-800 dark:bg-scar-950/90 transition-colors">
      {/* Top Banner */}
      <div className="bg-gray-900 px-4 py-1.5 text-center text-xs font-medium text-white flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>SCAR Autumn/Winter Edit &mdash; Free Express Shipping Over ₹1,999</span>
        {isAdmin && (
          <Link to="/admin" className="ml-2 bg-orange-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-orange-500">
            Admin Suite
          </Link>
        )}
        {isManager && !isAdmin && (
          <Link to="/manager" className="ml-2 bg-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500">
            Manager Suite
          </Link>
        )}
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-gray-700 hover:text-black dark:text-gray-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">
              SCAR<span className="text-brand-orange">.</span>
            </span>
          </Link>

          {/* Desktop Categories */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700 dark:text-gray-300">
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
        <div className="flex items-center gap-4">
          {/* Desktop Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative items-center">
            <input
              type="text"
              placeholder="Search products, brands, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 md:w-72 rounded-full border border-gray-300 bg-gray-50 py-1.5 pl-9 pr-4 text-xs focus:border-brand-orange focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange dark:border-scar-700 dark:bg-scar-900 dark:text-white"
            />
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          </form>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="sm:hidden p-2 text-gray-600 dark:text-gray-300"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account Menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-orange p-1.5"
                title="Account Profile"
              >
                <User className="w-4 h-4 text-brand-orange" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="text-[11px] font-medium text-gray-500 hover:text-red-500 hidden sm:inline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-orange p-1.5"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Cart Icon & Counter */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-gray-800 dark:text-gray-200 hover:text-brand-orange transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="w-6 h-6" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white shadow">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Input dropdown */}
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-950 p-4 space-y-2">
          {DEMO_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-brand-orange"
            >
              {cat.name}
            </Link>
          ))}
          {user && (
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-brand-orange"
            >
              My Profile
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-brand-orange"
            >
              Admin Dashboard
            </Link>
          )}
          {isManager && !isAdmin && (
            <Link
              to="/manager"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-blue-600"
            >
              Manager Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
