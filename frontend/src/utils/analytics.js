/**
 * Privacy-friendly lightweight analytics engine for SCAR
 */
class AnalyticsService {
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
      const buffer = JSON.parse(sessionStorage.getItem('scar_analytics_buffer') || '[]');
      buffer.push(event);
      // Keep up to 100 recent session events
      if (buffer.length > 100) buffer.shift();
      sessionStorage.setItem('scar_analytics_buffer', JSON.stringify(buffer));

      // Attempt non-blocking beacon or fetch to backend analytics if available
      if (navigator.sendBeacon) {
        const payload = new Blob([JSON.stringify(event)], { type: 'application/json' });
        navigator.sendBeacon('/api/v1/analytics/events', payload);
      }
    } catch (err) {
      // Graceful silence for privacy / test mode
    }
  }

  getEvents() {
    try {
      return JSON.parse(sessionStorage.getItem('scar_analytics_buffer') || '[]');
    } catch {
      return [];
    }
  }
}

export const analytics = new AnalyticsService();
