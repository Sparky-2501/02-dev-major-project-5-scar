import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, MapPin, ArrowLeft, KeyRound, ShieldAlert } from 'lucide-react';

export const AccessRestricted = ({
  title = "Lost in the Warehouses?",
  message = "Looks like your journey took a funny detour! You've arrived at an administrative restricted zone without clearance.",
  requiredRole = "administrator"
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-[#F7F7F7] text-center font-satoshi relative overflow-hidden">
      {/* Playful Floating Background Shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-10 w-64 h-64 rounded-full bg-[#6C5CE7]/10 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-10 w-72 h-72 rounded-full bg-[#FF8C42]/10 blur-3xl animate-float"
      />

      <div className="relative z-10 max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 flex flex-col items-center">
        {/* Animated Vector Illustration: Lost Travelers & Delivery Truck taking a wrong turn */}
        <div className="relative w-72 h-56 mb-6 flex items-center justify-center">
          <svg
            viewBox="0 0 320 240"
            className="w-full h-full drop-shadow-md overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground Plane */}
            <ellipse cx="160" cy="210" rx="130" ry="16" fill="#F0F2F5" />
            <ellipse cx="160" cy="210" rx="90" ry="10" fill="#E2E8F0" />

            {/* Road / Wayward Path */}
            <path
              d="M60 210 Q 160 170 260 210"
              stroke="#CBD5E1"
              strokeWidth="6"
              strokeDasharray="8 8"
            />

            {/* Lost Delivery Truck (Bouncing & Wobbling) */}
            <g className="animate-float">
              {/* Truck Body */}
              <rect x="100" y="110" width="105" height="65" rx="14" fill="#6C5CE7" />
              {/* Truck Front Cab */}
              <path
                d="M205 130 H235 C242 130 248 136 248 144 V175 H205 V130 Z"
                fill="#2D3436"
              />
              {/* Cab Window */}
              <path
                d="M210 135 H232 C236 135 240 139 240 144 V152 H210 V135 Z"
                fill="#E0F2FE"
              />
              {/* Truck Logo Pill */}
              <rect x="120" y="125" width="65" height="22" rx="11" fill="#FFFFFF" />
              <text
                x="152"
                y="140"
                textAnchor="middle"
                fontSize="11"
                fontWeight="900"
                fill="#6C5CE7"
                fontFamily="sans-serif"
              >
                SCAR
              </text>
              {/* Express Stripe */}
              <rect x="100" y="155" width="105" height="6" fill="#FF8C42" />

              {/* Headlight beam */}
              <path
                d="M248 155 L285 145 L285 175 Z"
                fill="#FFD93D"
                opacity="0.3"
              />

              {/* Wheels */}
              <circle cx="130" cy="178" r="14" fill="#2D3436" />
              <circle cx="130" cy="178" r="6" fill="#CBD5E1" />
              <circle cx="225" cy="178" r="14" fill="#2D3436" />
              <circle cx="225" cy="178" r="6" fill="#CBD5E1" />

              {/* Exclamation / Question Mark from Truck Driver */}
              <g transform="translate(230, 95)" className="animate-bounce">
                <circle cx="10" cy="10" r="12" fill="#FF8C42" />
                <text
                  x="10"
                  y="15"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#FFFFFF"
                >
                  ?
                </text>
              </g>
            </g>

            {/* Lost Road Sign / Barrier (Left) */}
            <g transform="translate(45, 120)">
              <rect x="18" y="30" width="6" height="50" rx="3" fill="#64748B" />
              <rect
                x="0"
                y="10"
                width="42"
                height="22"
                rx="6"
                fill="#FF4757"
                transform="rotate(-8 21 21)"
              />
              <text
                x="21"
                y="24"
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#FFFFFF"
                transform="rotate(-8 21 21)"
              >
                NO ENTRY
              </text>
            </g>

            {/* Suitcases & Map Pin (Right) - Inspired by traveler luggage */}
            <g transform="translate(245, 145)">
              {/* Large Orange Suitcase */}
              <rect x="0" y="20" width="36" height="42" rx="6" fill="#FF8C42" />
              <rect x="10" y="12" width="16" height="8" rx="2" fill="#2D3436" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="18" y1="20" x2="18" y2="62" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />

              {/* Small Purple Backpack */}
              <ellipse cx="38" cy="40" rx="10" ry="18" fill="#6C5CE7" />
              <rect x="34" y="34" width="8" height="12" rx="2" fill="#FFD93D" />
            </g>

            {/* Floating Navigation Pin & Compass */}
            <g className="animate-float-slow">
              <circle cx="160" cy="50" r="20" fill="#FFFFFF" stroke="#6C5CE7" strokeWidth="3" />
              <polygon
                points="160,37 165,50 160,47 155,50"
                fill="#FF4757"
              />
              <polygon
                points="160,63 165,50 160,53 155,50"
                fill="#6C5CE7"
              />
              <circle cx="160" cy="50" r="2" fill="#2D3436" />
            </g>
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-bold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>403 &bull; Clearance Required</span>
        </div>

        {/* Title & Description */}
        <h2 className="font-general font-bold text-2xl sm:text-3xl text-[#2D3436] tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 max-w-sm">
          {message}
        </p>

        {/* Role Notice */}
        <div className="w-full p-3.5 rounded-2xl bg-[#F7F7F7] border border-gray-200 text-xs text-gray-600 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#FF8C42]" />
            <span>Target Role:</span>
          </div>
          <span className="font-bold text-[#2D3436] capitalize bg-white px-2 py-0.5 rounded-lg border border-gray-200">
            {requiredRole}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => navigate('/login')}
            className="flex-1 py-3 px-4 rounded-xl bg-[#2D3436] text-white font-bold text-xs sm:text-sm hover:-translate-y-0.5 transition-transform shadow-md flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In with Credentials</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 px-4 rounded-xl bg-white border border-[#E5E7EB] text-[#2D3436] font-bold text-xs sm:text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};
