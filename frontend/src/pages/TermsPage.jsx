import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldAlert, ArrowLeft, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const TermsPage = () => {
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

        {/* Top Banner */}
        <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>Legal & Platform Agreement</span>
            </div>
            <h1 className="font-general font-bold text-3xl sm:text-4xl text-[#2D3436] tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs text-gray-500">
              Effective Date: October 2026 &bull; Architect: Prathamesh Shelke
            </p>
          </div>
          <Link
            to="/privacy"
            className="px-5 py-2.5 rounded-xl bg-[#F7F7F7] hover:bg-gray-100 text-[#2D3436] font-bold text-xs border border-gray-200 transition-colors"
          >
            View Privacy Policy
          </Link>
        </div>

        {/* Terms Content Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 space-y-8 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">Non-Commercial Experimental Environment</span>
              SCAR (Scalable Architecture Retail) is an interactive portfolio project created by Prathamesh Shelke for technical demonstration, architectural experimentation, and educational showcase. No physical shipments, commercial contracts, or monetary billing take place.
            </div>
          </div>

          <div>
            <h2 className="font-general font-bold text-lg text-[#2D3436] mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the SCAR retail web application (including catalog exploration, simulated checkout, and account creation), you acknowledge and agree to comply with these Terms and Conditions. If you do not agree with any portion of these provisions, you should refrain from using the platform.
            </p>
          </div>

          <div>
            <h2 className="font-general font-bold text-lg text-[#2D3436] mb-2">
              2. Simulated E-Commerce Operations
            </h2>
            <p>
              All products, pricing, discounts, and inventory counts represented on this platform are simulated assets intended to exhibit high-concurrency transactional engineering. Placing an order through the checkout portal creates a simulated database ledger entry and emits mock notifications; it does not constitute a real purchase or an obligation to deliver physical goods.
            </p>
          </div>

          <div>
            <h2 className="font-general font-bold text-lg text-[#2D3436] mb-2">
              3. User Accounts & Access Controls
            </h2>
            <p>
              Visitors may test user registration or sign in using the provided demo customer credentials (<code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">user@gmail.com / user</code>). Managerial and administrative suites are restricted to authorized credentials. You agree not to attempt unauthorized penetration testing, denial of service attacks, or malicious data injection against the hosted server.
            </p>
          </div>

          <div>
            <h2 className="font-general font-bold text-lg text-[#2D3436] mb-2">
              4. Intellectual Property & Code Rights
            </h2>
            <p>
              The source code, custom design system, playful minimalist branding, and algorithmic implementations are the original creative intellectual work of <strong>Prathamesh Shelke</strong>. Third-party brand marks, imagery placeholders, or icons used within demo products remain the property of their respective holders and are presented under educational fair-use principles.
            </p>
          </div>

          <div>
            <h2 className="font-general font-bold text-lg text-[#2D3436] mb-2">
              5. Disclaimer of Warranties & Limitation of Liability
            </h2>
            <p>
              The platform is provided strictly on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied. Under no circumstances shall Prathamesh Shelke or SCAR Retail Technologies Inc. be liable for any direct, indirect, incidental, or consequential damages resulting from your use of this demo platform.
            </p>
          </div>

          <div>
            <h2 className="font-general font-bold text-lg text-[#2D3436] mb-2">
              6. Custom Design & Engineering Inquiries
            </h2>
            <p>
              If you wish to discuss custom software development, licensing of this platform architecture, or UI/UX design collaboration, please contact Prathamesh Shelke directly at{' '}
              <a
                href="mailto:prathamesh.shelke@example.com?subject=Custom%20Design%20Inquiry"
                className="font-bold text-[#6C5CE7] hover:underline"
              >
                prathamesh.shelke@example.com
              </a>.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <span>&copy; 2026 SCAR Retail Technologies Inc. All rights reserved.</span>
            <span>Crafted with pride by Prathamesh Shelke</span>
          </div>
        </div>
      </div>
    </div>
  );
};
