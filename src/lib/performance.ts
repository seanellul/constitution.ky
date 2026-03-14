/**
 * Performance Monitoring for Constitution.mt
 * 
 * This module provides comprehensive performance tracking including:
 * - Web Vitals (CLS, FID, FCP, LCP, TTFB)
 * - Custom performance metrics
 * - Error tracking
 * - User engagement metrics
 */

import { isBrowser } from './utils';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  timestamp: number;
  sessionId?: string;
  userAgent?: string;
  context?: Record<string, any>;
}

interface EngagementMetric {
  type: 'page_view' | 'time_on_page' | 'scroll_depth' | 'interaction' | 'reading_progress';
  value: number;
  articleId?: string;
  chapterNumber?: number;
  timestamp: number;
  sessionId?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorReport[] = [];
  private engagementMetrics: EngagementMetric[] = [];
  private sessionId: string;
  private isInitialized = false;
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    
    if (isBrowser()) {
      this.init();
    }
  }

  private generateSessionId(): string {
    return 'perf_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  private init() {
    if (this.isInitialized || !isBrowser()) return;
    
    this.isInitialized = true;
    
    // Set up Web Vitals monitoring
    this.initWebVitals();
    
    // Set up error monitoring
    this.initErrorTracking();
    
    // Set up navigation monitoring
    this.initNavigationTracking();
    
    // Set up user engagement tracking
    this.initEngagementTracking();
    
    console.log('[PerformanceMonitor] Initialized');
  }

  private async initWebVitals() {
    try {
      // Dynamic import to avoid SSR issues
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');
      
      const reportWebVital = (metric: any) => {
        this.recordMetric({
          name: metric.name,
          value: metric.value,
          timestamp: Date.now(),
          sessionId: this.sessionId,
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            id: metric.id,
            delta: metric.delta,
            rating: metric.rating
          }
        });
      };

      onCLS(reportWebVital);
      onINP(reportWebVital);
      onFCP(reportWebVital);
      onLCP(reportWebVital);
      onTTFB(reportWebVital);
      
    } catch (error) {
      console.warn('[PerformanceMonitor] Web Vitals not available:', error);
    }
  }

  private initErrorTracking() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.recordError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userAgent: navigator.userAgent
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        context: { type: 'unhandledrejection' }
      });
    });
  }

  private initNavigationTracking() {
    // Track page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.recordMetric({
          name: 'page_load_time',
          value: navigation.loadEventEnd - navigation.fetchStart,
          timestamp: Date.now(),
          sessionId: this.sessionId,
          url: window.location.href,
          metadata: {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstByte: navigation.responseStart - navigation.fetchStart,
            domInteractive: navigation.domInteractive - navigation.fetchStart
          }
        });
      }
    });

    // Track resource loading performance
    this.trackResourcePerformance();
  }

  private trackResourcePerformance() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          
          // Track slow resources (> 1 second)
          if (resource.duration > 1000) {
            this.recordMetric({
              name: 'slow_resource',
              value: resource.duration,
              timestamp: Date.now(),
              sessionId: this.sessionId,
              metadata: {
                url: resource.name,
                type: this.getResourceType(resource.name),
                size: resource.transferSize || 0
              }
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.includes('.json')) return 'json';
    return 'other';
  }

  private initEngagementTracking() {
    const pageStartTime = Date.now();
    let maxScrollDepth = 0;
    
    // Track scroll depth
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          this.recordEngagement({
            type: 'scroll_depth',
            value: scrollPercent,
            timestamp: Date.now(),
            sessionId: this.sessionId
          });
        }
      }
    };

    // Track time on page
    const trackTimeOnPage = () => {
      const timeOnPage = Date.now() - pageStartTime;
      this.recordEngagement({
        type: 'time_on_page',
        value: timeOnPage,
        timestamp: Date.now(),
        sessionId: this.sessionId
      });
    };

    // Event listeners
    window.addEventListener('scroll', this.throttle(trackScrollDepth, 100));
    window.addEventListener('beforeunload', trackTimeOnPage);
    
    // Track interactions
    ['click', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.recordEngagement({
          type: 'interaction',
          value: 1,
          timestamp: Date.now(),
          sessionId: this.sessionId
        });
      }, { once: true }); // Only track first interaction
    });
  }

  public recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    this.scheduleFlush();
    
    // Log important metrics
    if (['LCP', 'FID', 'CLS'].includes(metric.name)) {
      console.log(`[PerformanceMonitor] ${metric.name}:`, metric.value);
    }
  }

  public recordError(error: ErrorReport) {
    this.errors.push(error);
    this.scheduleFlush();
    
    console.error('[PerformanceMonitor] Error recorded:', error.message);
  }

  public recordEngagement(engagement: EngagementMetric) {
    this.engagementMetrics.push(engagement);
    this.scheduleFlush();
  }

  public captureException(error: Error, context?: Record<string, any>) {
    this.recordError({
      message: error.message,
      stack: error.stack,
      url: isBrowser() ? window.location.href : 'unknown',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: isBrowser() ? navigator.userAgent : 'unknown',
      context
    });
  }

  public startTimer(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric({
        name: `timer_${name}`,
        value: duration,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        url: isBrowser() ? window.location.href : undefined
      });
    };
  }

  public trackReadingProgress(articleId: string, chapterNumber: number, progressPercent: number) {
    this.recordEngagement({
      type: 'reading_progress',
      value: progressPercent,
      articleId,
      chapterNumber,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });
  }

  private scheduleFlush() {
    if (this.batchTimeout) return;

    this.batchTimeout = setTimeout(() => {
      this.flush();
      this.batchTimeout = null;
    }, 10000);
  }

  private flush() {
    // Metrics are tracked via PostHog — just clear the arrays to free memory
    const count = this.metrics.length + this.errors.length + this.engagementMetrics.length;
    this.metrics = [];
    this.errors = [];
    this.engagementMetrics = [];

    if (count > 0 && process.env.NODE_ENV === 'development') {
      console.debug(`[PerformanceMonitor] Flushed ${count} entries`);
    }
  }

  private throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

// Export individual functions for convenience
export const recordMetric = (metric: Omit<PerformanceMetric, 'sessionId'>) => {
  performanceMonitor.recordMetric({ ...metric, sessionId: performanceMonitor.getSessionId() });
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  performanceMonitor.captureException(error, context);
};

export const startTimer = (name: string) => {
  return performanceMonitor.startTimer(name);
};

export const trackReadingProgress = (articleId: string, chapterNumber: number, progressPercent: number) => {
  performanceMonitor.trackReadingProgress(articleId, chapterNumber, progressPercent);
};

// Initialize performance monitoring when module is imported
if (isBrowser()) {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    console.log('[Performance] Monitoring initialized');
  }, 100);
}