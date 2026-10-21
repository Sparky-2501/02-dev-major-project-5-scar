import React, { useState, useEffect } from 'react';
import { subscribeBackendStatus } from '../../utils/api';
import { Loader2, CheckCircle, Wifi, CloudLightning } from 'lucide-react';

export const BackendStatusBanner = () => {
  const [status, setStatus] = useState('unknown');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeBackendStatus((newStatus) => {
      setStatus(newStatus);
      if (newStatus === 'waking') {
        setVisible(true);
      } else if (newStatus === 'online') {
        setVisible(true);
        // Auto-dismiss 4 seconds after becoming online
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
      } else if (newStatus === 'error') {
        setVisible(true);
      }
    });

    return unsubscribe;
  }, []);

  if (!visible || status === 'unknown') return null;

  return (
    <aside
      aria-label="Server status alert"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-500 ease-out text-xs font-satoshi font-semibold animate-slide-up"
      style={{
        backgroundColor:
          status === 'online'
            ? 'rgba(16, 185, 129, 0.95)'
            : status === 'waking'
            ? 'rgba(15, 23, 42, 0.92)'
            : 'rgba(239, 68, 68, 0.92)',
        borderColor:
          status === 'online'
            ? 'rgba(52, 211, 153, 0.4)'
            : status === 'waking'
            ? 'rgba(255, 90, 31, 0.4)'
            : 'rgba(248, 113, 113, 0.4)',
        color: '#ffffff',
      }}
    >
      {status === 'waking' && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-orange-400 shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold flex items-center gap-1.5">
              <CloudLightning className="w-3.5 h-3.5 text-orange-400" />
              Maison SCAR Cloud Container Waking Up
            </span>
            <span className="text-[10px] text-gray-300 font-normal">
              Render free tier container is spinning up. Stand by...
            </span>
          </div>
        </>
      )}

      {status === 'online' && (
        <>
          <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0 animate-bounce" />
          <div className="flex flex-col">
            <span className="font-bold flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-200" />
              Backend Connected &amp; Synchronized
            </span>
            <span className="text-[10px] text-emerald-100 font-normal">
              Atelier database &amp; live concurrency safeguards active
            </span>
          </div>
        </>
      )}

      {status === 'error' && (
        <>
          <CloudLightning className="w-4 h-4 text-red-200 shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold">Operating in Resilient Standalone Mode</span>
            <span className="text-[10px] text-red-100 font-normal">
              All catalogue browsing and orders functional via local store
            </span>
          </div>
        </>
      )}
    </aside>
  );
};
