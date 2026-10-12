import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Shield, Check, X } from 'lucide-react';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('scar_cookie_consent');
    if (!consent) {
      // Short delay for smooth appearance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (level) => {
    localStorage.setItem('scar_cookie_consent', level);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 font-satoshi transition-all">
      <div className="bg-white dark:bg-scar-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-200 dark:border-scar-800 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-brand-orange shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <h4 className="font-general font-bold text-sm text-[#2D3436] dark:text-white">
              Cookie & Session Preferences
            </h4>
          </div>
          <button
            onClick={() => handleConsent('essential')}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          We use strictly essential cookies and local session caching to ensure smooth cart synchronization, secure authentication, and simulated retail analytics. No third-party ad profiling is performed.
        </p>

        <div className="flex items-center justify-between pt-1">
          <Link
            to="/privacy"
            className="text-[11px] font-bold text-[#6C5CE7] hover:underline"
          >
            Privacy Policy
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleConsent('essential')}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-scar-700 text-[11px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-scar-800 transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={() => handleConsent('all')}
              className="px-4 py-1.5 rounded-xl bg-[#2D3436] dark:bg-white text-white dark:text-[#2D3436] text-[11px] font-bold hover:-translate-y-0.5 transition-transform shadow-md"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
