import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, logout, isAdmin, isManager, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setStreet(user.address?.street || '');
      setCity(user.address?.city || '');
      setState(user.address?.state || '');
      setPostalCode(user.address?.postalCode || '');
      setCountry(user.address?.country || 'India');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-[#F7F7F7] font-satoshi text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-general font-bold text-2xl text-[#2D3436]">
            Sign In Required
          </h2>
          <p className="text-xs text-gray-500">
            Please log in to your account to view and manage your profile and shipping addresses.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 px-4 rounded-xl bg-[#2D3436] text-white font-bold text-xs hover:-translate-y-0.5 transition-transform shadow-md"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await updateProfile({
        name,
        phone,
        address: {
          street,
          city,
          state,
          postalCode,
          country,
        },
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error saving changes.' });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = () => {
    if (isAdmin) {
      return { label: 'Administrator', bg: 'bg-[#FF8C42]/15 text-[#D9531E]' };
    }
    if (isManager) {
      return { label: 'Catalog Manager', bg: 'bg-[#6C5CE7]/15 text-[#6C5CE7]' };
    }
    return { label: 'Customer', bg: 'bg-emerald-50 text-emerald-700' };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-12 px-4 sm:px-6 lg:px-8 font-satoshi selection:bg-[#6C5CE7] selection:text-white relative">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-orange-500/30 bg-gray-900 text-white font-general font-bold text-3xl flex items-center justify-center shadow-lg shrink-0">
              {isAdmin || user.email === 'admin@scar.local' || user.name?.toLowerCase().includes('prathamesh') ? (
                <img
                  src="/prathamesh.jpg"
                  alt={user.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="font-general font-bold text-2xl sm:text-3xl text-[#2D3436]">
                  {user.name}
                </h1>
                <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg ${roleBadge.bg}`}>
                  {roleBadge.label}
                </span>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-xl bg-[#2D3436] text-white text-xs font-bold hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#FF8C42]" />
                <span>Admin Suite</span>
              </Link>
            )}
            {isManager && !isAdmin && (
              <Link
                to="/manager"
                className="px-4 py-2 rounded-xl bg-[#6C5CE7] text-white text-xs font-bold hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Manager Studio</span>
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {message.text && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 border ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Profile Edit Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Section 1: Basic Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-[#6C5CE7]" />
                <h2 className="font-general font-bold text-lg text-[#2D3436]">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 px-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-gray-100 py-2.5 px-3 text-xs sm:text-sm text-gray-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Account email cannot be modified directly.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                    />
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                    Account Privilege Level
                  </label>
                  <div className="py-2.5 px-3 rounded-xl bg-gray-50 border border-[#E5E7EB] text-xs font-semibold text-gray-700 flex items-center justify-between">
                    <span className="capitalize">{user.role}</span>
                    <Shield className="w-4 h-4 text-[#6C5CE7]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Delivery & Shipping Address */}
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#FF8C42]" />
                <h2 className="font-general font-bold text-lg text-[#2D3436]">
                  Default Delivery Address
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                    Street Address / Flat / Floor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 402, Skyline Residency, Ring Road"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 px-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 px-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                      State / Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 px-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                      Postal / PIN Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 400001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 px-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 px-3 text-xs sm:text-sm text-[#2D3436] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Changes will be synced across future checkout sessions.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2D3436] text-white font-bold text-xs sm:text-sm hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Shopping Discovery Section */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#6C5CE7]/10 text-[#6C5CE7]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-general font-bold text-base text-[#2D3436]">
                Ready to explore new seasonal drops?
              </h3>
              <p className="text-xs text-gray-500">
                Browse our curated catalog with real-time stock and AI suggestions.
              </p>
            </div>
          </div>
          <Link
            to="/catalog"
            className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] text-white font-bold text-xs hover:-translate-y-0.5 transition-transform shadow-md flex items-center gap-1.5"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
