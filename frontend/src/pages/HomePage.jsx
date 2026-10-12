import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCampaigns } from '../context/CampaignContext';
import { DEMO_CATEGORIES } from '../data/catalog';
import { ProductCard } from '../components/product/ProductCard';
import { Reveal } from '../components/common/Reveal';
import { ArrowRight, Sparkles, TrendingUp, Zap, Tag, Megaphone, ShieldCheck } from 'lucide-react';

export const HomePage = () => {
  const { products, campaigns, trackEvent } = useCampaigns();
  const heroContainerRef = useRef(null);

  // Scroll animations for Apple-style floating curved island
  const { scrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end start'],
  });

  // Scale down slightly from 1 to 0.94 as user scrolls
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.94]);
  // Border radius curves from 0px (edge-to-edge full bleed) to 40px (luxurious curved card)
  const borderRadius = useTransform(scrollYProgress, [0, 0.8], ['0px', '40px']);
  // Inset padding expands from 0px on sides to 32px on sides
  const paddingX = useTransform(scrollYProgress, [0, 0.8], ['0px', '24px']);
  // Y-axis parallax offset for the inner headline and content
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.85]);

  // Find active hero campaign with marquee and highest priority
  const now = new Date().toISOString();
  const activeCampaigns = campaigns
    .filter((c) => c.status === 'active' && c.startDate <= now && c.endDate >= now)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const heroCampaign = activeCampaigns[0];
  const marqueeCampaign = activeCampaigns.find((c) => c.marqueeEnabled);

  const featuredProducts = products.slice(0, 4);
  const trendingProducts = products.slice(4, 8);

  const handleBannerClick = (campaign) => {
    trackEvent({
      type: 'campaign_click',
      campaignId: campaign.id,
      campaignName: campaign.name,
    });
  };

  return (
    <div className="space-y-16 pb-20 w-full max-w-full overflow-x-hidden">
      {/* 1. Dynamic Marquee Announcement Bar */}
      {marqueeCampaign && (
        <div className="bg-gradient-to-r from-orange-600 via-brand-orange to-amber-600 text-white py-2 px-4 text-xs font-bold flex items-center justify-center gap-3 shadow-sm overflow-hidden w-full">
          <Megaphone className="w-4 h-4 shrink-0 animate-bounce" />
          <Link
            to={marqueeCampaign.ctaUrl || '/catalog'}
            onClick={() => handleBannerClick(marqueeCampaign)}
            className="hover:underline flex items-center gap-2 tracking-wide"
          >
            <span>{marqueeCampaign.marqueeText}</span>
            <span className="bg-black/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">
              {marqueeCampaign.ctaText || 'Shop Now'} &rarr;
            </span>
          </Link>
        </div>
      )}

      {/* 2. Apple-Style Full-Bleed Morphing Hero Island */}
      <div ref={heroContainerRef} className="relative w-full overflow-hidden pt-0">
        <motion.div
          style={{
            paddingLeft: paddingX,
            paddingRight: paddingX,
          }}
          className="w-full transition-all duration-100 ease-out"
        >
          <motion.div
            style={{
              scale,
              borderRadius,
            }}
            className="relative w-full overflow-hidden bg-[#0A0D14] text-white shadow-2xl transition-all duration-200 border border-transparent dark:border-scar-800"
          >
            {/* Subtle Radiant Background Gradient & Mesh */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0A0D14] to-[#020617] pointer-events-none" />
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ff5a1f_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            
            {/* Atmospheric Ambient Glows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-orange-500/20 via-purple-600/10 to-transparent blur-3xl rounded-full"
            />

            <motion.div
              style={{
                y: contentY,
                opacity: contentOpacity,
              }}
              className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 flex flex-col items-center text-center z-10"
            >
              {heroCampaign ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/15 px-4 py-1.5 text-xs font-semibold text-orange-400 mb-6 backdrop-blur">
                  <Tag className="w-4 h-4" />
                  <span>{heroCampaign.headline}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400 mb-6 backdrop-blur shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Curated Collection &bull; Autumn / Winter 2026</span>
                </div>
              )}

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl leading-tight">
                Elevated Retail Architecture.{' '}
                <span className="block mt-1 bg-gradient-to-r from-brand-orange via-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Engineered For The Exceptional.
                </span>
              </h1>

              <p className="mt-6 text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Experience next-generation e-commerce with atomic concurrency safeguards, personalized AI style matching, and zero-compromise luxury design.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={heroCampaign ? heroCampaign.ctaUrl : '/catalog'}
                  onClick={() => heroCampaign && handleBannerClick(heroCampaign)}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-7 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{heroCampaign?.ctaText || 'Explore Full Collection'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/catalog?category=electronics"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-700/80 bg-gray-900/80 hover:bg-gray-800 px-6 py-3.5 text-sm font-semibold text-gray-200 hover:text-white transition-all backdrop-blur cursor-pointer"
                >
                  <span>Discover Acoustics</span>
                </Link>
              </div>

              {/* Verified Trust Strip */}
              <div className="mt-12 pt-8 border-t border-gray-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Zero Overselling Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-orange-400" />
                  Atomic Stock Decrements
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Cloudinary 4K Media Processing
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* 3. Category Rails with progressive scroll reveals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal direction="left">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Shop by Department</h2>
              <p className="text-xs text-gray-500">Explore curated categories tailored for modern living</p>
            </div>
            <Link to="/catalog" className="text-xs font-bold text-brand-orange flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Reveal>

        <Reveal direction="right">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {DEMO_CATEGORIES.map((cat) => (
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
        </Reveal>
      </section>

      {/* 4. Featured Products with scroll reveal */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal direction="left">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-brand-orange" />
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Curated Essentials</h2>
                <p className="text-xs text-gray-500">Top-rated items eligible for promotional campaign pricing</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, idx) => (
            <Reveal key={product.id} direction={idx % 2 === 0 ? 'left' : 'right'} delay={idx * 0.1}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Mid-Page Active Promotional Banner from Campaign Engine */}
      {heroCampaign && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal direction="up">
            <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-brand-orange to-amber-600 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl space-y-3">
                <span className="text-xs uppercase tracking-widest font-black bg-black/20 px-3 py-1 rounded-full">
                  OFFICIAL PROMOTION
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">{heroCampaign.name}</h3>
                <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
                  {heroCampaign.description} Applied automatically at checkout on eligible items.
                </p>
              </div>
              <Link
                to={heroCampaign.ctaUrl}
                onClick={() => handleBannerClick(heroCampaign)}
                className="rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-bold text-orange-600 hover:bg-gray-100 transition-colors shrink-0 shadow cursor-pointer"
              >
                {heroCampaign.ctaText || 'Shop Campaign'}
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      {/* 6. Trending Section with progressive reveals */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal direction="right">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Trending Innovations</h2>
              <p className="text-xs text-gray-500">High-performance footwear & acoustics receiving critical acclaim</p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product, idx) => (
            <Reveal key={product.id} direction={idx % 2 === 0 ? 'left' : 'right'} delay={idx * 0.1}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
};
