import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Lock, Mail, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@scar.local');
  const [password, setPassword] = useState('AdminSecurePassword123!');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else if (res.user.role === 'manager') {
          navigate('/manager');
        } else {
          navigate('/catalog');
        }
      }
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  const loadManagerPreset = () => {
    setEmail('manager@scar.local');
    setPassword('ManagerSecurePassword123!');
  };

  const loadAdminPreset = () => {
    setEmail('admin@scar.local');
    setPassword('AdminSecurePassword123!');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="p-8 rounded-3xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md">
            S
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">SCAR Central Portal</h1>
          <p className="text-xs text-gray-500">Sign in to your customer, manager, or administrator account</p>
        </div>

        {/* Demo Credentials Quick-Select Helper */}
        <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-xs space-y-2">
          <div className="font-bold text-brand-orange flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick-Load Role Presets:</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadAdminPreset}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white dark:bg-scar-800 font-bold border border-orange-200 text-gray-800 dark:text-gray-200 hover:border-brand-orange text-[11px]"
            >
              Administrator
            </button>
            <button
              type="button"
              onClick={loadManagerPreset}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white dark:bg-scar-800 font-bold border border-orange-200 text-gray-800 dark:text-gray-200 hover:border-brand-orange text-[11px]"
            >
              Manager / Uploader
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 py-2.5 pl-9 pr-3 text-xs"
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-scar-700 bg-gray-50 dark:bg-scar-800 py-2.5 pl-9 pr-3 text-xs"
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full py-3 font-bold text-sm shadow-glow"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
