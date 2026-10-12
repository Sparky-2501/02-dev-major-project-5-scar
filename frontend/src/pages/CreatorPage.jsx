import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  ExternalLink,
  Mail,
  Github,
  Linkedin,
  ArrowLeft,
  Terminal,
  Layers,
  Sparkles,
  MapPin,
  GraduationCap
} from 'lucide-react';

/**
 * =========================================================================
 * FILE PATH: frontend/src/pages/CreatorPage.jsx
 * =========================================================================
 * 💡 EDIT PROJECTS & LINKS:
 * You can update your project links, descriptions, and contacts here anytime.
 * =========================================================================
 */

// Your portrait photo (saved to /prathamesh.jpg in frontend/public)
const CREATOR_PHOTO_URL = '/prathamesh.jpg';

// Other projects portfolio
const PROJECTS = [
  {
    id: 'scar',
    title: 'SCAR — Scalable E-Commerce Architecture',
    category: 'Full-Stack Platform',
    status: 'Live Demonstration',
    description:
      'High-concurrency modern retail platform combining luxury aesthetic, AI style curation, manager studio with Cloudinary media gallery, sales campaign engines, and atomic stock holds.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'TailwindCSS'],
    link: '/',
    isInternal: true,
  },
  {
    id: 'wanderlust',
    title: 'Wanderlust',
    category: 'Travel & Exploration Platform',
    status: 'Active Build',
    description:
      'A travel platform crafted for globetrotters to discover scenic destinations, explore curated travel itineraries, and browse user adventure stories.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Mapbox'],
    // 💡 REPLACE THIS URL WITH YOUR ACTUAL WANDERLUST PROJECT LINK:
    link: 'https://github.com/prathamesh-shelke/wanderlust',
    isInternal: false,
  },
  {
    id: 'yorsa-wilson',
    title: 'Yorsa Wilson',
    category: 'Creative Design & Visual Portfolio',
    status: 'Showcase',
    description:
      'A bespoke visual showcase presenting high-craft editorial design, fluid animations, typography layouts, and interactive digital branding.',
    stack: ['React', 'TailwindCSS', 'Framer Motion', 'Vite'],
    // 💡 REPLACE THIS URL WITH YOUR ACTUAL YORSA WILSON PROJECT LINK:
    link: 'https://github.com/prathamesh-shelke/yorsa-wilson',
    isInternal: false,
  },
];

const SKILLS = [
  'JavaScript (ES6+)',
  'TypeScript',
  'React.js',
  'Node.js',
  'Express.js',
  'MongoDB & Mongoose',
  'TailwindCSS',
  'System Design',
  'REST APIs',
  'Git & GitHub'
];

export const CreatorPage = () => {
  return (
    <div className="min-h-screen bg-[#0F1117] text-gray-200 font-sans selection:bg-orange-500 selection:text-white relative w-full max-w-full">
      {/* Fixed "Back to Storefront" Floating Navigation Bar */}
      <div className="fixed top-5 left-5 z-50">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900/90 hover:bg-gray-800 text-gray-200 hover:text-white text-xs font-semibold backdrop-blur-md border border-gray-700/80 shadow-xl transition-all hover:scale-105 active:scale-95 group"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Storefront</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20 sm:py-24 space-y-16">
        {/* Profile Header Card */}
        <div className="pt-6 flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10 border-b border-gray-800 pb-14">
          {/* Portrait Photo */}
          <div className="relative shrink-0">
            <div className="w-40 h-52 sm:w-48 sm:h-64 rounded-2xl overflow-hidden border border-gray-700 bg-gray-900 shadow-2xl relative group">
              <img
                src={CREATOR_PHOTO_URL}
                alt="Prathamesh Shelke"
                className="w-full h-full object-cover object-top filter grayscale contrast-110 group-hover:filter-none transition-all duration-500"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://ui-avatars.com/api/?name=Prathamesh+Shelke&background=1f2937&color=fff&size=512';
                }}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>
            {/* Status Indicator */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gray-900 border border-gray-700 text-[11px] font-medium text-emerald-400 flex items-center gap-1.5 shadow-lg whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for projects</span>
            </div>
          </div>

          {/* Bio & Information */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Prathamesh Shelke
              </h1>
              <p className="text-sm font-medium text-orange-400">
                Software Engineering Student &amp; Full-Stack Builder
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-gray-500" />
                Computer Science Undergrad
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-500" />
                India
              </span>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
              I am a student developer passionate about designing and shipping real-world software applications. I love taking an idea from concept all the way through backend system architecture, clean UI engineering, and production deployment.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
              SCAR is one of my core projects, created to explore high-concurrency retail workflows, role-based managerial dashboards, and intuitive user experiences.
            </p>

            {/* Social / Contact Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="mailto:prathamesh.shelke@example.com?subject=Project%20Inquiry%20from%20Portfolio"
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Get in touch</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium border border-gray-700 transition-all flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium border border-gray-700 transition-all flex items-center gap-1.5"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-400" />
              <span>Projects &amp; Creations</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROJECTS.map((project) => {
              const CardInner = (
                <div className="h-full bg-gray-900/80 hover:bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all flex flex-col justify-between group shadow-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                        {project.category}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-gray-800/80 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );

              return project.isInternal ? (
                <Link key={project.id} to={project.link}>
                  {CardInner}
                </Link>
              ) : (
                <a
                  key={project.id}
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {CardInner}
                </a>
              );
            })}
          </div>
        </div>

        {/* Technical Toolkit */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span>Technical Toolkit</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs font-medium text-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Minimal Clean Footer on Creator Page */}
        <div className="pt-8 border-t border-gray-800/80 text-center text-xs text-gray-500">
          <p>
            Designed &amp; Developed by <span className="text-gray-300 font-semibold">Prathamesh Shelke</span> &bull; 2026
          </p>
        </div>
      </div>
    </div>
  );
};
