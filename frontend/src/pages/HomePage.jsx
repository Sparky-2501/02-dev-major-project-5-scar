import React from 'react';
import { Link } from 'react-router-dom';
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from '../data/catalog';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export const HomePage = () => {
  const featuredProducts = DEMO_PRODUCTS.slice(0, 4);
  const trendingProducts = DEMO_PRODUCTS.slice(4, 8);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-scar-950 via-scar-900 to-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ff5a1f_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400 mb-6 backdrop-blur">
            <Sparkles className="w-4 h-4" />
            <span>AI-Curated Collection &bull; Autumn / Winter 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl leading-tight">
            Elevated Retail Architecture. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-orange via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Engineered For The Exceptional.
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
            Experience next-generation e-commerce with atomic concurrency safeguards, personalized AI style matching, and zero-compromise luxury design.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-glow hover:bg-orange-600 transition-all hover:scale-105"
            >
              Explore Full Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/catalog?category=electronics"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-scar-900/80 px-6 py-3 text-sm font-semibold text-gray-200 hover:bg-scar-800 transition-colors"
            >
              Discover Acoustics
            </Link>
          </div>
        </div>
      </section>

      {/* Category Rails */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Shop by Department</h2>
            <p className="text-xs text-gray-500">Explore curated categories tailored for modern living</p>
          </div>
          <Link to="/catalog" className="text-xs font-bold text-brand-orange flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {DEMO_CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className="group p-4 rounded-2xl border border-gray-200 dark:border-scar-800 bg-white dark:bg-scar-900 text-center hover:border-brand-orange hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-scar-800 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                <span className="font-extrabold text-base">{cat.name.charAt(0)}</span>
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-orange">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Rail */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-orange" />
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Curated Essentials</h2>
              <p className="text-xs text-gray-500">Top-rated items hand-selected by our editorial desk</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Mid-Page Promotion Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-orange-600 to-amber-600 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <span className="text-xs uppercase tracking-widest font-black bg-black/20 px-3 py-1 rounded-full">
              Engineered Resilience
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">Zero Overselling Guarantee</h3>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
              Every checkout locks inventory at the variant level with atomic MongoDB operations and a 10-minute hold. No phantom purchases, no inventory conflicts.
            </p>
          </div>
          <Link
            to="/catalog"
            className="rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-bold text-orange-600 hover:bg-gray-100 transition-colors shrink-0 shadow"
          >
            Shop Protected Inventory
          </Link>
        </div>
      </section>

      {/* Trending Rail */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Trending Innovations</h2>
            <p className="text-xs text-gray-500">High-performance footwear & acoustics receiving critical acclaim</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
