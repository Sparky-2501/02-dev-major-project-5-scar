/**
 * API Client & Endpoint Configuration
 * Powered by BACKEND_RENDER_URL from ../config/backendConfig.js
 */

import { BACKEND_RENDER_URL } from '../config/backendConfig';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? BACKEND_RENDER_URL : (BACKEND_RENDER_URL || ''));

/**
 * Returns full API endpoint URL
 * @param {string} path e.g. '/api/v1/auth/login'
 * @returns {string}
 */
export function getApiUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) return cleanPath;
  return `${API_BASE_URL.replace(/\/$/, '')}${cleanPath}`;
}

/**
 * Wake-Up Ping for Render Free Tier:
 * Sends an immediate lightweight health ping to wake the backend container
 * as soon as a visitor loads the frontend.
 */
let hasPinged = false;
let backendStatus = 'unknown'; // 'unknown' | 'waking' | 'online' | 'error'
const statusListeners = new Set();

function notifyStatus(status) {
  backendStatus = status;
  statusListeners.forEach((fn) => fn(status));
}

export function subscribeBackendStatus(callback) {
  statusListeners.add(callback);
  callback(backendStatus);
  return () => statusListeners.delete(callback);
}

export function pingBackendWakeup() {
  if (hasPinged) return;
  hasPinged = true;

  const targetHost = API_BASE_URL || BACKEND_RENDER_URL || '';
  if (!targetHost && !import.meta.env.PROD) {
    // In local dev without host, assume local proxy is ready
    notifyStatus('online');
    return;
  }

  const pingUrl = targetHost ? `${targetHost.replace(/\/$/, '')}/api/v1/health` : '/api/v1/health';

  notifyStatus('waking');
  console.info(`🔄 Pinging SCAR backend at ${pingUrl} to ensure container is awake...`);

  // Retry loop for Render cold start
  let attempts = 0;
  const maxAttempts = 5;

  const doPing = () => {
    attempts += 1;
    fetch(pingUrl, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    })
      .then((res) => {
        if (res.ok) {
          notifyStatus('online');
          console.info('⚡ SCAR Maison backend is awake, active, and synchronized.');
        } else if (attempts < maxAttempts) {
          setTimeout(doPing, 4000);
        }
      })
      .catch(() => {
        if (attempts < maxAttempts) {
          setTimeout(doPing, 4000);
        } else {
          notifyStatus('error');
        }
      });
  };

  doPing();
}
