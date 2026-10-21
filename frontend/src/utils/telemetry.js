import { getApiUrl } from './api';

/**
 * Ad-blocker friendly internal telemetry engine for SCAR
 */
class TelemetryService {
  constructor() {
    this.sessionId = `ses_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  }

  trackPageView(pathname) {
    const event = {
      type: 'page_view',
      sessionId: this.sessionId,
      pathname: pathname || window.location.pathname,
      title: document.title,
      timestamp: new Date().toISOString(),
    };

    this.persistEvent(event);
  }

  trackEvent(eventName, metadata = {}) {
    const event = {
      type: 'custom_event',
      eventName,
      sessionId: this.sessionId,
      metadata,
      pathname: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    this.persistEvent(event);
  }

  persistEvent(event) {
    try {
      // Safe local session buffer (never blocked by ad-blockers)
      const buffer = JSON.parse(sessionStorage.getItem('scar_telemetry_buffer') || '[]');
      buffer.push(event);
      if (buffer.length > 100) buffer.shift();
      sessionStorage.setItem('scar_telemetry_buffer', JSON.stringify(buffer));

      // Use ad-block neutral route '/api/v1/telemetry/metrics'
      if (typeof window !== 'undefined' && navigator.sendBeacon) {
        const payload = new Blob([JSON.stringify(event)], { type: 'application/json' });
        navigator.sendBeacon(getApiUrl('/api/v1/telemetry/metrics'), payload);
      }
    } catch {
      // Graceful fallback - zero console noise
    }
  }

  getEvents() {
    try {
      return JSON.parse(sessionStorage.getItem('scar_telemetry_buffer') || '[]');
    } catch {
      return [];
    }
  }
}

export const telemetry = new TelemetryService();
export const analytics = telemetry; // Backward compatibility alias
