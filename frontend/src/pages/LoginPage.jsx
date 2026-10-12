import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Sparkles, ShieldAlert, CheckCircle2, ShieldCheck } from 'lucide-react';
import { telemetry } from '../utils/telemetry';

export const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Anti-Bot / Spam Protections
  const [honeypot, setHoneypot] = useState('');
  const [mountTime] = useState(Date.now());

  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    // 1. Spam / Bot Honeypot Check
    if (honeypot) {
      // Bot filled the invisible honeypot field
      return 'Automated submission detected. Request denied.';
    }

    // 2. Bot Timing Check (must take at least 500ms for a real human to type)
    if (Date.now() - mountTime < 500) {
      return 'Submission was unusually rapid. Please try again.';
    }

    // 3. Email format regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address (e.g., user@example.com).';
    }

    if (isSignUp) {
      if (!name.trim() || name.trim().length < 2) {
        return 'Please enter your full name (minimum 2 characters).';
      }
      if (password.length < 4) {
        return 'Password must be at least 4 characters long.';
      }
      if (password !== confirmPassword) {
        return 'Password confirmation does not match.';
      }
    } else {
      if (!password) {
        return 'Please enter your account password.';
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (isSignUp) {
      try {
        const res = await register({ name: name.trim(), email: email.trim(), password });
        if (res.success) {
          telemetry.trackEvent('auth_register_success', { email: email.trim() });
          setSuccessMsg('Account created successfully! Welcome to SCAR.');
          setTimeout(() => {
            navigate('/catalog');
          }, 800);
        }
      } catch (err) {
        telemetry.trackEvent('auth_register_failed', { error: err.message });
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } else {
      try {
        const res = await login(email.trim(), password);
        if (res.success) {
          telemetry.trackEvent('auth_login_success', { role: res.user.role });
          setSuccessMsg(`Signed in successfully as ${res.user.name}!`);
          setTimeout(() => {
            if (res.user.role === 'admin') {
              navigate('/admin');
            } else if (res.user.role === 'manager') {
              navigate('/manager');
            } else {
              navigate('/catalog');
            }
          }, 500);
        }
      } catch (err) {
        telemetry.trackEvent('auth_login_failed', { email: email.trim() });
        setError('Invalid email or password. Please verify your credentials.');
      }
    }
  };

  const fillDemoCustomer = () => {
    setIsSignUp(false);
    setEmail('user@gmail.com');
    setPassword('user');
    setError('');
    setSuccessMsg('Demo customer credentials populated.');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F7F7] px-4 py-12 overflow-hidden font-satoshi selection:bg-[#6C5CE7] selection:text-white w-full max-w-full">
      {/* Decorative Blurs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 w-64 h-64 rounded-full bg-[#6C5CE7]/10 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#FF8C42]/15 blur-3xl animate-float"
      />

      {/* Floating Accent Badges (Hidden on small mobile to avoid overflow) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-[12%] hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-xl border border-gray-100 animate-float"
      >
        <div className="w-3 h-3 rounded-full bg-[#6C5CE7]" />
        <span className="text-xs font-semibold text-[#2D3436]">Modern Retail</span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 left-[10%] hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white shadow-xl border border-gray-100 animate-float-fast"
      >
        <div className="w-3 h-3 rounded-full bg-[#FF8C42]" />
        <span className="text-xs font-semibold text-[#2D3436]">Instant Checkout</span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-28 right-[12%] hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-xl border border-gray-100 animate-float-slow"
      >
        <div className="w-3 h-3 rounded-full bg-[#FFD93D]" />
        <span className="text-xs font-semibold text-[#2D3436]">Curated Drops</span>
      </div>

      {/* Main Container Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E5E7EB] z-10">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#6C5CE7] text-white font-general font-bold text-2xl shadow-lg hover:scale-105 transition-transform">
            S
          </div>
          <h1 className="font-general font-bold text-3xl sm:text-4xl text-[#2D3436] tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            {isSignUp
              ? 'Join SCAR to experience personalized luxury retail'
              : 'Sign in to access your account, orders, and favorites'}
          </p>
        </div>

        {/* Auth Mode Switcher */}
        <div className="flex bg-[#F7F7F7] p-1 rounded-2xl mb-6 border border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              !isSignUp
                ? 'bg-white text-[#2D3436] shadow-md'
                : 'text-gray-600 hover:text-[#2D3436]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isSignUp
                ? 'bg-white text-[#2D3436] shadow-md'
                : 'text-gray-600 hover:text-[#2D3436]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Demo User Quick Button - Only for user@gmail.com */}
        {!isSignUp && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#F7F7F7] border border-[#E5E7EB] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#6C5CE7] animate-twinkle" />
              <div className="text-left">
                <p className="text-xs font-bold text-[#2D3436]">Demo Customer Account</p>
                <p className="text-[11px] text-gray-600 font-medium">user@gmail.com &bull; pass: user</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-bold text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill</span>
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Form with Honeypot Bot Trap */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot hidden input */}
          <input
            type="text"
            name="hp_contact_check"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
          />

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                />
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#2D3436] text-white font-bold text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Free Account' : 'Sign In to SCAR'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer helper note */}
        <div className="mt-6 pt-5 border-t border-[#E5E7EB] text-center flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected with Honeypot anti-spam & bcrypt encryption</span>
        </div>
      </div>
    </div>
  );
};
