import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F7F7] py-12 px-4 sm:px-6 lg:px-8 font-satoshi selection:bg-[#6C5CE7] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#2D3436] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </Link>
        </div>

        {/* Top Contact Banner / Callout */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6C5CE7] to-[#8072f5] p-8 sm:p-10 text-white shadow-xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/10 blur-2xl"
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD93D]" />
                <span>Bespoke Engineering & Design</span>
              </div>
              <h2 className="font-general font-bold text-2xl sm:text-3xl tracking-tight">
                Like this design & platform?
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                If you appreciate the attention to detail, sleek playful minimalism, and scalable full-stack architecture, let's build something remarkable together! Reach out to collaborate on your own bespoke web application or custom digital product design.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:prathamesh.shelke@example.com?subject=Custom%20Design%20%26%20Development%20Inquiry"
                className="px-6 py-3.5 rounded-xl bg-[#2D3436] hover:bg-[#1E2324] text-white font-bold text-xs sm:text-sm shadow-md hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#FF8C42]" />
                <span>Contact for Custom Design</span>
              </a>
              <Link
                to="/creator"
                className="px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all text-center"
              >
                About Creator
              </Link>
            </div>
          </div>
        </div>

        {/* Privacy Policy & Experimental Disclaimer Document */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 space-y-8">
          <div className="border-b border-gray-100 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6C5CE7]">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Policy & Experimental Disclaimer</span>
            </div>
            <h1 className="font-general font-bold text-3xl sm:text-4xl text-[#2D3436] tracking-tight">
              Privacy Policy & Project Notice
            </h1>
            <p className="text-xs text-gray-400">
              Last updated: October 2026 &bull; Published by Prathamesh Shelke
            </p>
          </div>

          {/* Statement Body (300-400 words) */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-gray-600 leading-relaxed space-y-6">
            <p className="text-sm font-semibold text-[#2D3436] bg-[#F7F7F7] p-4 rounded-2xl border border-gray-200/80">
              Notice: This web application (SCAR Retail Technologies) is designed and engineered by Prathamesh Shelke exclusively for educational, experimental, and portfolio evaluation purposes.
            </p>

            <div>
              <h3 className="font-general font-bold text-lg text-[#2D3436] mb-2">
                1. Experimental & Educational Purpose
              </h3>
              <p>
                SCAR was created as an advanced engineering demonstration to research high-concurrency retail workflows, state-of-the-art UI/UX patterns, role-based authorization hierarchies, real-time inventory management, promotional sales engines, and cloud asset processing. All catalog items, brand descriptions, currency pricing, and order confirmations displayed across this website are entirely simulated and intended solely for non-commercial laboratory demonstration.
              </p>
            </div>

            <div>
              <h3 className="font-general font-bold text-lg text-[#2D3436] mb-2">
                2. Data Collection & Privacy Safeguards
              </h3>
              <p>
                Because this platform operates as an experimental laboratory, we do not monetize, harvest, sell, or disclose personal data to third-party commercial marketing networks. Any authentication credentials, user profiles, or mock shipping information entered during your interactive session are stored securely within local memory or sandboxed database instances strictly to enable interactive platform capabilities such as cart checkout simulations, profile edits, and role switching.
              </p>
            </div>

            <div>
              <h3 className="font-general font-bold text-lg text-[#2D3436] mb-2">
                3. Zero Real Financial Transactions
              </h3>
              <p>
                No real payments, credit card processing, or monetary transactions occur on SCAR. All checkout flows and payment authorizations utilize simulated test sandboxes and synthetic tokens. Visitors must not submit genuine credit card numbers, banking PINs, or sensitive confidential records anywhere on this site.
              </p>
            </div>

            <div>
              <h3 className="font-general font-bold text-lg text-[#2D3436] mb-2">
                4. Intellectual Property & Contact
              </h3>
              <p>
                The software architecture, user interface styles, and programmatic implementations represent the original creative engineering work of Prathamesh Shelke. If you are interested in licensing, adopting similar bespoke architectures, or hiring for custom software engineering and interface design projects, please reach out directly through the contact options provided on this page.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Author: Prathamesh Shelke</span>
            <span>Educational Portfolio Demonstration</span>
          </div>
        </div>
      </div>
    </div>
  );
};
