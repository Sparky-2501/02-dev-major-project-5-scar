import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X, Sparkles, ShoppingBag } from 'lucide-react';

export const promptLoginModal = (message) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('scar_prompt_login', {
        detail: { message },
      })
    );
  }
};

export const LoginNudgePopup = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  // 1. Timer: 18 seconds (between 15-20s) after mounting if user is not logged in
  useEffect(() => {
    if (user) {
      setIsOpen(false);
      return;
    }

    // Check if dismissed in this session
    const alreadyDismissed = sessionStorage.getItem('scar_login_nudge_dismissed');
    if (alreadyDismissed) return;

    const timer = setTimeout(() => {
      // Re-check if user is still logged out
      if (!user) {
        setIsOpen(true);
      }
    }, 18000); // 18 seconds

    return () => clearTimeout(timer);
  }, [user]);

  // 2. Custom Event Listener: triggered immediately when guest clicks Buy Now or Checkout
  useEffect(() => {
    const handleTrigger = (event) => {
      if (!user) {
        if (event.detail?.message) {
          setCustomMessage(event.detail.message);
        }
        setIsOpen(true);
      }
    };

    window.addEventListener('scar_prompt_login', handleTrigger);
    return () => window.removeEventListener('scar_prompt_login', handleTrigger);
  }, [user]);

  if (!isOpen || user) return null;

  const currentRedirect = encodeURIComponent(location.pathname + location.search);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('scar_login_nudge_dismissed', 'true');
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    navigate(`/login?redirect=${currentRedirect}`);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="nudge-title"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-96 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="relative rounded-2xl border border-gray-200/80 dark:border-scar-700 bg-white/95 dark:bg-scar-900/95 backdrop-blur-xl p-5 shadow-2xl transition-all">
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-scar-800 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Logo */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src="/29abd43a-8155-4c06-ba7b-d4524dfc2619.png"
            alt="SCAR Official Logo"
            className="w-10 h-10 object-contain rounded-full shadow-sm bg-gray-100 dark:bg-scar-800 p-0.5 shrink-0"
          />
          <div>
            <h4 id="nudge-title" className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>Namaste &bull; SCAR</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-brand-orange px-2 py-0.5 rounded-full">
                Welcome
              </span>
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Personalized Shopping &bull; Pan-India Delivery
            </p>
          </div>
        </div>

        {/* Pure Indian English Body */}
        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {customMessage ||
            'Kindly sign in to your SCAR account for a much better shopping experience, special festive discounts, and fast doorstep delivery across all Indian pincodes.'}
        </p>

        {/* Action Buttons: Rock-solid, non-moving login button */}
        <div className="space-y-2">
          {/* Note: User explicitly requested: 'login button on clicking it should be stable not moving' */}
          <button
            type="button"
            onClick={handleLoginClick}
            style={{ transform: 'none' }}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold transition-colors cursor-pointer text-center block shadow-sm"
          >
            Sign In to Your Account
          </button>

          <div className="flex items-center justify-between pt-1 px-1 text-[11px]">
            <Link
              to={`/register?redirect=${currentRedirect}`}
              onClick={() => setIsOpen(false)}
              className="font-bold text-brand-orange hover:underline"
            >
              New here? Register with mobile &rarr;
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
