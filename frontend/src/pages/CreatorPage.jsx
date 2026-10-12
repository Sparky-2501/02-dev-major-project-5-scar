import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ExternalLink, Globe, Sparkles, Mail, Github, Linkedin, ArrowLeft, Heart, Compass, Briefcase } from 'lucide-react';

/**
 * =========================================================================
 * FILE PATH: frontend/src/pages/CreatorPage.jsx
 * =========================================================================
 * 💡 NOTE FOR PRATHAMESH:
 * You can easily update your photo URL, project links (Wanderlust, Yorsa Wilson),
 * and social profiles in the constants below.
 * =========================================================================
 */

// 💡 1. YOUR PHOTO / AVATAR URL:
// Replace this with your actual photo URL or local asset import (e.g. '/my-photo.jpg')
const CREATOR_PHOTO_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

// 💡 2. YOUR OTHER PROJECT LINKS:
// Replace these URLs and descriptions with your actual deployment / GitHub URLs:
const OTHER_PROJECTS = [
  {
    id: 'scar',
    title: 'SCAR Retail Platform',
    badge: 'Current Project',
    description:
      'High-concurrency full-stack e-commerce system featuring managerial studio, Cloudinary multi-image uploads, sales campaign engines, and RBAC.',
    tech: ['React', 'TailwindCSS', 'Node.js', 'Express', 'MongoDB'],
    link: '/',
    isInternal: true,
    highlightColor: '#6C5CE7',
  },
  {
    id: 'wanderlust',
    title: 'Wanderlust',
    badge: 'Travel Platform',
    description:
      'A travel & adventure exploration platform built to discover scenic destinations, curated itineraries, and unforgettable globetrotting experiences.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Mapbox'],
    // 💡 REPLACE THIS URL WITH YOUR ACTUAL WANDERLUST PROJECT LINK:
    link: 'https://github.com/prathamesh-shelke/wanderlust',
    isInternal: false,
    highlightColor: '#FF8C42',
  },
  {
    id: 'yorsa-wilson',
    title: 'Yorsa Wilson',
    badge: 'Design Portfolio',
    description:
      'A bespoke visual portfolio and creative showcase featuring high-craft typography, fluid interactions, and editorial layouts.',
    tech: ['React', 'Framer Motion', 'TailwindCSS', 'Vite'],
    // 💡 REPLACE THIS URL WITH YOUR ACTUAL YORSA WILSON PROJECT LINK:
    link: 'https://github.com/prathamesh-shelke/yorsa-wilson',
    isInternal: false,
    highlightColor: '#FFD93D',
  },
];

export const CreatorPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F7F7] py-12 px-4 sm:px-6 lg:px-8 font-satoshi selection:bg-[#6C5CE7] selection:text-white relative overflow-hidden">
      {/* Decorative Floating Background Shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#6C5CE7]/10 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-[#FF8C42]/10 blur-3xl animate-float"
      />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        {/* Navigation Back */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#2D3436] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </Link>
        </div>

        {/* Creator Hero Profile Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          {/* Photo Frame */}
          <div className="relative shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-tr from-[#6C5CE7] to-[#FF8C42] p-1 animate-float">
              <img
                src={CREATOR_PHOTO_URL}
                alt="Prathamesh Shelke"
                className="w-full h-full object-cover rounded-[22px]"
                onError={(e) => {
                  // Fallback avatar if external image fails to load
                  e.currentTarget.src =
                    'https://ui-avatars.com/api/?name=Prathamesh+Shelke&background=6C5CE7&color=fff&size=256&bold=true';
                }}
              />
            </div>
            {/* Playful Floating Badge */}
            <div className="absolute -bottom-2 -right-2 bg-[#2D3436] text-white p-2 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FFD93D]" />
            </div>
          </div>

          {/* Bio Details */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-bold">
              <Code2 className="w-3.5 h-3.5" />
              <span>Creator & Software Engineer</span>
            </div>

            <h1 className="font-general font-bold text-3xl sm:text-4xl text-[#2D3436] tracking-tight">
              Prathamesh Shelke
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              I am a student who loves to build software projects from the ground up! I enjoy turning complex challenges into clean, elegant, and high-performance digital experiences. SCAR is one of my signature creations, demonstrating production-ready architecture, playful aesthetics, and deep full-stack engineering.
            </p>

            {/* Social / Contact Links */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="mailto:prathamesh.shelke@example.com?subject=Hello%20Prathamesh!"
                className="px-4 py-2 rounded-xl bg-[#2D3436] text-white text-xs font-bold hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 shadow-md"
              >
                <Mail className="w-3.5 h-3.5 text-[#FF8C42]" />
                <span>Get in Touch</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-[#2D3436] text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-[#2D3436] text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Featured Projects Showcase */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-general font-bold text-2xl sm:text-3xl text-[#2D3436] tracking-tight">
                Featured Projects
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Explore other creations built with care and passion
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OTHER_PROJECTS.map((proj) => {
              const CardContent = (
                <div className="h-full bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                        style={{
                          backgroundColor: `${proj.highlightColor}18`,
                          color: proj.highlightColor === '#FFD93D' ? '#B45309' : proj.highlightColor,
                        }}
                      >
                        {proj.badge}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#2D3436] transition-colors" />
                    </div>

                    <h3 className="font-general font-bold text-xl text-[#2D3436]">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-gray-100 flex flex-wrap gap-1.5">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );

              return proj.isInternal ? (
                <Link key={proj.id} to={proj.link}>
                  {CardContent}
                </Link>
              ) : (
                <a
                  key={proj.id}
                  href={proj.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {CardContent}
                </a>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-6 text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-[#FF8C42] fill-current" />
          <span>by Prathamesh Shelke</span>
        </div>
      </div>
    </div>
  );
};
