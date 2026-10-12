import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from './analytics';

const ROUTE_META = {
  '/': {
    title: 'SCAR — Luxury Retail & High-Performance E-Commerce',
    description: 'Discover premium apparel, footwear, acoustics, and lifestyle goods with AI-powered personalized curation on SCAR.',
  },
  '/catalog': {
    title: 'Curated Catalog & Departments | SCAR',
    description: 'Explore verified luxury outerwear, dresses, knitwear, performance footwear, and studio tech on SCAR.',
  },
  '/checkout': {
    title: 'Express Checkout & Security | SCAR',
    description: 'Instant secure checkout with sandbox payments, address management, and zero overselling guarantees.',
  },
  '/login': {
    title: 'Customer & Merchant Portal | SCAR',
    description: 'Sign in to access your account, orders, favorites, and managerial tools on SCAR.',
  },
  '/profile': {
    title: 'User Profile & Settings | SCAR',
    description: 'Manage personal details, default delivery addresses, and account security credentials on SCAR.',
  },
  '/privacy': {
    title: 'Privacy Policy & Experimental Disclaimer | SCAR',
    description: 'Official experimental notice and privacy policy for SCAR by Prathamesh Shelke.',
  },
  '/terms': {
    title: 'Terms & Conditions | SCAR',
    description: 'Platform usage agreement, experimental simulation disclaimers, and intellectual property notices.',
  },
  '/creator': {
    title: 'About the Creator — Prathamesh Shelke | SCAR',
    description: 'Meet Prathamesh Shelke, student developer behind SCAR, Wanderlust, and Yorsa Wilson.',
  },
  '/admin': {
    title: 'Executive Admin Deck | SCAR',
    description: 'Real-time GMV telemetry, inventory monitor, atomic locks, and managerial audit trail.',
  },
  '/manager': {
    title: 'Merchant Studio & Promotional Campaigns | SCAR',
    description: 'Product catalog creation, multi-image Cloudinary media gallery, sales campaigns, and real analytics.',
  },
};

export const usePageMetadata = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const path = location.pathname;
    let meta = ROUTE_META[path];

    if (!meta) {
      if (path.startsWith('/product/')) {
        meta = {
          title: 'Product Details | SCAR',
          description: 'View full product specifications, customer reviews, stock status, and promotional pricing on SCAR.',
        };
      } else {
        meta = {
          title: '404 Page Not Found | SCAR',
          description: 'The requested page or collection was not found in our catalog.',
        };
      }
    }

    document.title = meta.title;

    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.name = 'description';
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', meta.description);

    analytics.trackPageView(path);
  }, [location.pathname]);
};
