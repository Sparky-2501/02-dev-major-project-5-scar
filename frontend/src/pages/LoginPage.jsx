import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';

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
        } else {
          navigate('/catalog');
        }
      }
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="p-8 rounded-3xl bg-white dark:bg-scar-900 border border-gray-200 dark:border-scar-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md">
            S
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Welcome to SCAR</h1>
          <p className="text-xs text-gray-500">Sign in to your account or admin dashboard</p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-xs space-y-1">
          <div className="font-bold text-brand-orange flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>One-Click Demo Credentials Loaded:</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-gray-300">
            Admin: <code className="font-mono font-bold">admin@scar.local</code> / <code className="font-mono font-bold">AdminSecurePassword123!</code>
          </p>
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
