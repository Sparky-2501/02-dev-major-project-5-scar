/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        scar: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        brand: {
          orange: '#ff5a1f',
          red: '#e02424',
          amber: '#f59e0b',
          dark: '#111827',
          surface: '#1f2937',
          accent: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 25px -5px rgba(255, 90, 31, 0.4)',
      }
    },
  },
  plugins: [],
}
