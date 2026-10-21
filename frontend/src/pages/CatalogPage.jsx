import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEMO_CATEGORIES } from '../data/catalog';
import { ProductCard } from '../components/product/ProductCard';
import { useCampaigns } from '../context/CampaignContext';
import { SlidersHorizontal, ArrowUpDown, X, Check, Filter } from 'lucide-react';
import { Button } from '../components/common/Button';

export const CatalogPage = () => {
  const { products } = useCampaigns();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState(25000);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category state when URL changes (e.g. user clicks Men or Women in Header)
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Extract unique brands
  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand)));
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search keyword filter
      if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesTag = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesBrand && !matchesTag) return false;
      }

      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand && product.brand !== selectedBrand) {
        return false;
      }

      // Max price filter
      if (product.price > priceRange) {
        return false;
      }

      // Stock filter
      if (inStockOnly) {
        const hasStock = product.variants.some((v) => v.stock > 0);
        if (!hasStock) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });
  }, [searchParam, selectedCategory, selectedBrand, priceRange, inStockOnly, sortBy]);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange(25000);
    setInStockOnly(false);
    setSearchParams({});
    setMobileFilterOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full max-w-full overflow-x-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-scar-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white capitalize">
            {selectedCategory ? `${selectedCategory} Department` : 'All Products'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing {filteredProducts.length} curated items
            {searchParam && <span> for &ldquo;{searchParam}&rdquo;</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-scar-700 bg-white dark:bg-scar-900 text-xs font-bold text-gray-800 dark:text-gray-200 shadow-sm hover:border-brand-orange"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-orange" />
            <span>Filters</span>
            {(selectedCategory || selectedBrand || inStockOnly) && (
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
            )}
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-300 dark:border-scar-700 bg-white dark:bg-scar-900 py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-orange"
            >
              <option value="featured">Featured / Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Category Rail for Quick Switching (Mobile & Desktop) */}
      <div className="py-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <button
          onClick={() => handleCategorySelect('')}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            selectedCategory === ''
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
              : 'bg-gray-100 text-gray-600 dark:bg-scar-800 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {DEMO_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.slug)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat.slug
                ? 'bg-brand-orange text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 dark:bg-scar-800 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-scar-800">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Filter By
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-brand-orange hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Department Filter */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-3">Department</h4>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('')}
                className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-xl font-medium transition-colors ${
                  selectedCategory === '' ? 'bg-orange-100 text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-scar-800'
                }`}
              >
                All Departments
              </button>
              {DEMO_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-xl font-medium transition-colors ${
                    selectedCategory === cat.slug ? 'bg-orange-100 text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-scar-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-3">Brand</h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBrand('')}
                className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-xl font-medium transition-colors ${
                  selectedBrand === '' ? 'bg-orange-100 text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-scar-800'
                }`}
              >
                All Brands
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-xl font-medium transition-colors ${
                    selectedBrand === brand ? 'bg-orange-100 text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-scar-800'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
              <span>Max Price</span>
              <span className="text-brand-orange">₹{priceRange.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-brand-orange cursor-pointer"
            />
          </div>

          {/* Availability checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-brand-orange w-4 h-4 cursor-pointer"
              />
              In Stock Only
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-scar-900 rounded-3xl border border-gray-200 dark:border-scar-800 p-8 space-y-4 shadow-sm">
              <p className="text-base font-bold text-gray-800 dark:text-gray-200">No products matched your criteria</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try loosening your filters or resetting the price range to explore more studio items.
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Slide-out Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-white dark:bg-scar-950 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-scar-800">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-brand-orange" />
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Filter Products</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-gray-500 hover:text-black dark:text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Department */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Department</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-lg ${
                      selectedCategory === '' ? 'bg-orange-100 text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    All Departments
                  </button>
                  {DEMO_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-lg ${
                        selectedCategory === cat.slug ? 'bg-orange-100 text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Brand</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedBrand('')}
                    className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-lg ${
                      selectedBrand === '' ? 'bg-orange-100 text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-lg ${
                        selectedBrand === b ? 'bg-orange-100 text-brand-orange font-bold' : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <span>Max Price</span>
                  <span className="text-brand-orange">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-brand-orange"
                />
              </div>

              {/* Availability */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded accent-brand-orange w-4 h-4"
                  />
                  In Stock Only
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-scar-800 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-orange text-white font-bold text-xs shadow-md"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="w-full py-2 px-4 rounded-xl border border-gray-300 dark:border-scar-700 text-gray-700 dark:text-gray-300 font-semibold text-xs"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
