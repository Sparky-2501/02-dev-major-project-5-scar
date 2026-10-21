import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCampaigns } from '../context/CampaignContext';
import {
  Mail,
  Lock,
  Phone,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Truck,
  Zap,
  Gem,
  Check
} from 'lucide-react';
import { telemetry } from '../utils/telemetry';

export const LoginPage = ({ initialMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const { setGenderPreference } = useCampaigns();

  // Mode: 'login' or 'register'
  const isRegisterRoute = initialMode === 'register' || location.pathname === '/register';
  const [mode, setMode] = useState(isRegisterRoute ? 'register' : 'login');

  // 1-second blank transition state when switching panels
  const [isBlanking, setIsBlanking] = useState(false);

  // Logo pop-up-side flip animation & screen transition state
  const [isFlippingLogo, setIsFlippingLogo] = useState(false);
  const [isNextState, setIsNextState] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // Form Fields - Login
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form Fields - Register
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGender, setRegGender] = useState('female');
  const [regAge, setRegAge] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Error & Success Feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Destination redirect
  const queryParams = new URLSearchParams(location.search);
  const redirectTarget = queryParams.get('redirect') || location.state?.from || '/';

  // Keep route in sync if user toggles
  useEffect(() => {
    if (location.pathname === '/register' && mode !== 'register' && !isBlanking) {
      setMode('register');
    } else if (location.pathname === '/login' && mode !== 'login' && !isBlanking) {
      setMode('login');
    }
  }, [location.pathname]);

  // Handle switching between Login and Register with 1-second blank + position swap
  const handleToggleMode = (targetMode) => {
    if (isBlanking || targetMode === mode) return;
    setError('');
    setSuccessMsg('');

    // 1. Form goes blank for 1 second
    setIsBlanking(true);

    // 2. Switch panel positions
    setMode(targetMode);

    // Update URL quietly without hard reload
    const currentRedirect = queryParams.get('redirect');
    const targetUrl = targetMode === 'register'
      ? `/register${currentRedirect ? `?redirect=${encodeURIComponent(currentRedirect)}` : ''}`
      : `/login${currentRedirect ? `?redirect=${encodeURIComponent(currentRedirect)}` : ''}`;
    window.history.replaceState(null, '', targetUrl);

    // 3. After 1 second, reveal the new form in its swapped position
    setTimeout(() => {
      setIsBlanking(false);
    }, 1000);
  };

  // Demo account filler (Customer ONLY, as requested: "keep demo of user only not manager and admin")
  const fillCustomerDemo = () => {
    setLoginIdentifier('user@gmail.com');
    setLoginPassword('user');
    setError('');
    setSuccessMsg('Populated customer credentials (user@gmail.com). Click Sign In below.');
  };

  // Login Submit Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!loginIdentifier.trim()) {
      setError('Kindly enter your registered email address or 10-digit mobile number.');
      return;
    }
    if (!loginPassword) {
      setError('Kindly enter your account password.');
      return;
    }

    try {
      const res = await login(loginIdentifier.trim(), loginPassword);
      if (res.success) {
        telemetry.trackEvent('auth_login_success', { role: res.user.role });
        setAuthenticatedUser(res.user);

        // TRIGGER POP UPSIDE FLIP LOGO & NEXT STATE TRANSITION
        setIsFlippingLogo(true);
        setIsNextState(true);

        setTimeout(() => {
          if (res.user.role === 'admin') {
            navigate('/admin');
          } else if (res.user.role === 'manager') {
            navigate('/manager');
          } else {
            navigate(redirectTarget);
          }
        }, 1100);
      }
    } catch (err) {
      telemetry.trackEvent('auth_login_failed', { identifier: loginIdentifier.trim() });
      setError(err.message || 'Incorrect login details. Kindly check your email/mobile and password.');
    }
  };

  // Register Submit Handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regName.trim() || regName.trim().length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }

    const cleanPhone = regPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    const numAge = parseInt(regAge, 10);
    if (!numAge || numAge < 12 || numAge > 120) {
      setError('Please enter a valid age between 12 and 120 years.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      setError('Please provide a valid email address (e.g. yourname@gmail.com).');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Confirm password does not match. Kindly check again.');
      return;
    }

    try {
      const res = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: cleanPhone,
        gender: regGender,
        age: numAge,
        password: regPassword,
      });

      if (res.success) {
        setGenderPreference(regGender);
        telemetry.trackEvent('auth_register_success', { gender: regGender, age: numAge });
        setAuthenticatedUser(res.user);

        // TRIGGER POP UPSIDE FLIP LOGO & NEXT STATE TRANSITION
        setIsFlippingLogo(true);
        setIsNextState(true);

        setTimeout(() => {
          navigate(redirectTarget);
        }, 1100);
      }
    } catch (err) {
      telemetry.trackEvent('auth_register_failed', { error: err.message });
      setError(err.message || 'Registration failed. Kindly try again with a different email or number.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-scar-950 px-4 sm:px-6 lg:px-8 py-10 font-satoshi w-full max-w-full overflow-hidden relative">
      {/* SUCCESS OVERLAY (NEXT STATE WHEN USER LOGS IN / REGISTERS) */}
      <AnimatePresence>
        {isNextState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050B1B]/95 backdrop-blur-2xl text-white px-4 text-center"
          >
            {/* Pop upside flip logo in full celebration glory */}
            <motion.div
              initial={{ scale: 0.8, y: 0, rotateY: 0 }}
              animate={{
                scale: [1, 1.45, 1.25],
                y: [-10, -50, -25],
                rotateY: [0, 180, 360],
                rotateX: [0, -15, 0],
              }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-brand-orange to-amber-400 p-1 shadow-2xl flex items-center justify-center mb-6"
            >
              <div className="absolute inset-0 rounded-3xl bg-brand-orange/40 blur-2xl animate-pulse" />
              <div className="relative w-full h-full rounded-[22px] bg-scar-950 flex items-center justify-center p-3">
                <img
                  src="/29abd43a-8155-4c06-ba7b-d4524dfc2619.png"
                  alt="SCAR Official Emblem"
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="space-y-3 max-w-md"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-1 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Session Verified &amp; Authenticated</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Welcome to SCAR, {authenticatedUser?.name || 'Valued Patron'}!
              </h2>
              <p className="text-sm text-blue-200">
                Opening your personalized luxury experience and restoring your session...
              </p>
              <div className="pt-2 flex justify-center">
                <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN 2-SECTION SPLIT CONTAINER */}
      <div className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-scar-900 shadow-2xl border border-gray-200/80 dark:border-scar-800 overflow-hidden min-h-[640px] flex flex-col lg:flex-row">
        
        {/* =========================================================================
            PANEL A: THE SHOWCASE / LOGO PANEL
            Position: LEFT during Login (order-1), RIGHT during Register (order-2)
            ========================================================================= */}
        <motion.div
          layout
          transition={{ type: 'spring', damping: 26, stiffness: 140 }}
          className={`w-full lg:w-1/2 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden select-none ${
            mode === 'login' ? 'order-1 lg:order-1' : 'order-2 lg:order-2'
          }`}
          style={{
            backgroundImage: "linear-gradient(rgba(6, 14, 38, 0.92), rgba(3, 7, 20, 0.96)), url('/blue-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Ambient Background Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 bg-blue-500/25 blur-3xl rounded-full"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 bg-brand-orange/20 blur-3xl rounded-full"
          />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] font-bold text-blue-200 backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Official SCAR Atelier &bull; India</span>
            </div>
          </div>

          {/* Center: The Logo with Pop Upside Flip Animation */}
          <div className="relative z-10 py-10 sm:py-14 flex flex-col items-center text-center">
            {/* Pedestal with Flip Animation */}
            <motion.div
              animate={
                isFlippingLogo
                  ? {
                      y: [-10, -50, -25],
                      scale: [1, 1.4, 1.2],
                      rotateY: [0, 180, 360],
                    }
                  : {
                      y: [0, -6, 0],
                    }
              }
              transition={
                isFlippingLogo
                  ? { duration: 0.85, ease: 'easeOut' }
                  : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/25 p-3.5 shadow-2xl flex items-center justify-center mb-6 group cursor-pointer"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand-orange/25 to-blue-500/20 opacity-80 blur-xl" />
              <img
                src="/29abd43a-8155-4c06-ba7b-d4524dfc2619.png"
                alt="SCAR Official Logo"
                className="relative w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              SCAR<span className="text-brand-orange">.</span> Retail Technologies
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-blue-100/85 max-w-sm leading-relaxed">
              India's premier retail platform combining artisanal couture, Italian merino wool overcoats, automatic horology, and high-concurrency checkout.
            </p>
          </div>

          {/* Bottom Trust Highlights in Pure Indian English */}
          <div className="relative z-10 pt-6 border-t border-white/15 grid grid-cols-2 gap-3 text-[11px] text-blue-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Genuine Luxury</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Pan-India Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Atomic Concurrency Hold</span>
            </div>
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-pink-300 shrink-0" />
              <span>All Taxes Inclusive (GST)</span>
            </div>
          </div>
        </motion.div>

        {/* =========================================================================
            PANEL B: THE FORM PANEL
            Position: RIGHT during Login (order-2), LEFT during Register (order-1)
            When switching, form goes BLANK for 1 second, then reveals target form
            ========================================================================= */}
        <motion.div
          layout
          transition={{ type: 'spring', damping: 26, stiffness: 140 }}
          className={`w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white dark:bg-scar-900 transition-colors ${
            mode === 'login' ? 'order-2 lg:order-2' : 'order-1 lg:order-1'
          }`}
        >
          {/* 1-SECOND BLANK STATE (As requested: 'the form go blank for 1 second then the 2 things will switch itsplaces') */}
          {isBlanking ? (
            <div className="h-[460px] flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full border-3 border-brand-orange border-t-transparent animate-spin" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {mode === 'register' ? 'Opening SCAR Registration Form...' : 'Opening SCAR Sign In Form...'}
              </p>
            </div>
          ) : mode === 'login' ? (
            /* =====================================================================
               SIGN IN FORM (CUSTOMER ONLY DEMO, NO MANAGER/ADMIN, STABLE BUTTON)
               ===================================================================== */
            <div className="animate-in fade-in duration-300">
              {/* Heading */}
              <div className="mb-6">
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-orange">
                  Patron Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
                  Sign In to SCAR
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your credentials to access your bag, saved wishlist, and exclusive discounts.
                </p>
              </div>

              {/* DEMO STRIP: Customer ONLY (Manager & Admin removed as requested) */}
              <div className="mb-5 p-3 rounded-2xl bg-orange-50/80 dark:bg-scar-800/60 border border-orange-200/80 dark:border-scar-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-orange shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Quick Demo Account
                    </span>
                    <span className="text-[11px] text-gray-500">
                      user@gmail.com &bull; pass: user
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={fillCustomerDemo}
                  className="px-3 py-1.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer shrink-0"
                >
                  Auto-Fill Demo
                </button>
              </div>

              {/* Error & Success Alerts */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                    Email Address or Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="name@gmail.com or 10-digit mobile"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-950 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-950 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Stable Sign In Button: transform none */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ transform: 'none' }}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to SCAR</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Toggle Link: Switches Form to Register with 1-second blank transition */}
              <div className="mt-6 pt-5 border-t border-gray-200 dark:border-scar-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="text-gray-500">Don't have an account yet?</span>
                <button
                  type="button"
                  onClick={() => handleToggleMode('register')}
                  className="font-black text-brand-orange hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Register New Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* =====================================================================
               REGISTER FORM (FULL INDIAN VALIDATORS: NAME, PHONE, GENDER, AGE, EMAIL, PASS)
               ===================================================================== */
            <div className="animate-in fade-in duration-300">
              {/* Heading */}
              <div className="mb-4">
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-orange">
                  Member Onboarding
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
                  Create SCAR Account
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Join India's premier fashion atelier for personalized curations and express doorstep delivery.
                </p>
              </div>

              {/* Error & Success Alerts */}
              {error && (
                <div className="mb-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                {/* Name */}
                <div>
                  <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Diya Sharma"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-950 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Phone & Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      10-Digit Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-950 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Age (12-120 yrs)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="12"
                        max="120"
                        required
                        placeholder="24"
                        value={regAge}
                        onChange={(e) => setRegAge(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-950 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Gender Selector */}
                <div>
                  <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                    Gender Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['female', 'male', 'other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setRegGender(g)}
                        className={`py-1.5 px-3 rounded-xl border text-center font-bold capitalize transition-colors cursor-pointer ${
                          regGender === g
                            ? 'border-brand-orange bg-orange-50 dark:bg-orange-950/40 text-brand-orange shadow-sm'
                            : 'border-gray-200 dark:border-scar-800 bg-gray-50 dark:bg-scar-950 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {g === 'female' ? 'Female' : g === 'male' ? 'Male' : 'Other'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-950 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-950 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 dark:text-gray-200 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-950 py-2 pl-9 pr-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Stable Register Button: transform none */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ transform: 'none' }}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create SCAR Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Toggle Link: Switches Form back to Login with 1-second blank transition */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-scar-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="text-gray-500">Already have an account?</span>
                <button
                  type="button"
                  onClick={() => handleToggleMode('login')}
                  className="font-black text-brand-orange hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Sign In Here</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
