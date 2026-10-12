import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Home, Search, Sparkles } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 bg-[#F7F7F7] font-satoshi text-center relative overflow-hidden selection:bg-[#6C5CE7] selection:text-white">
      {/* Decorative Blurs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 w-72 h-72 rounded-full bg-[#6C5CE7]/10 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#FF8C42]/10 blur-3xl animate-float"
      />

      <div className="relative z-10 max-w-lg w-full bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100 flex flex-col items-center">
        {/* Animated 404 Vector Illustration */}
        <div className="relative w-64 h-44 mb-4 flex items-center justify-center">
          <svg
            viewBox="0 0 280 180"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground */}
            <ellipse cx="140" cy="155" rx="100" ry="12" fill="#F1F5F9" />

            {/* Floating 4 - 0 - 4 numerals */}
            <g className="animate-float">
              {/* Digit 4 */}
              <text
                x="60"
                y="110"
                fontFamily="sans-serif"
                fontSize="72"
                fontWeight="900"
                fill="#2D3436"
              >
                4
              </text>

              {/* Digit 0 as an empty shopping bag */}
              <g transform="translate(110, 45)">
                <rect x="0" y="20" width="60" height="65" rx="12" fill="#6C5CE7" />
                {/* Bag handles */}
                <path
                  d="M15 20 V8 C15 2 45 2 45 8 V20"
                  stroke="#FFD93D"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Shopping bag smile */}
                <path
                  d="M20 55 Q 30 65 40 55"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Star icon */}
                <circle cx="30" cy="40" r="3" fill="#FF8C42" />
              </g>

              {/* Digit 4 */}
              <text
                x="185"
                y="110"
                fontFamily="sans-serif"
                fontSize="72"
                fontWeight="900"
                fill="#2D3436"
              >
                4
              </text>
            </g>

            {/* Floating sparkle tags */}
            <g className="animate-twinkle">
              <circle cx="45" cy="40" r="6" fill="#FF8C42" />
              <circle cx="235" cy="50" r="8" fill="#FFD93D" />
            </g>
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Page Not Found</span>
        </div>

        {/* Title */}
        <h1 className="font-general font-bold text-2xl sm:text-3xl text-[#2D3436] tracking-tight mb-2">
          Out of Stock & Lost in Aisle 404
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm mb-6">
          The destination or product collection you are looking for has moved, expired, or was never stocked in our warehouse.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            to="/"
            className="flex-1 py-3 px-4 rounded-xl bg-[#2D3436] text-white font-bold text-xs sm:text-sm hover:-translate-y-0.5 transition-transform shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            to="/catalog"
            className="flex-1 py-3 px-4 rounded-xl bg-white border border-[#E5E7EB] text-[#2D3436] font-bold text-xs sm:text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#FF8C42]" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
