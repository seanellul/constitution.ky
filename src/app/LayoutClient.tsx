'use client';

import { useEffect } from 'react';
import { performanceMonitor } from '@/lib/performance';
import { initServiceWorker } from '@/lib/sw-registration';
import ScrollToTop from '@/components/ScrollToTop';
import SearchShortcut from '@/components/SearchShortcut';

export default function LayoutClient() {
  useEffect(() => {
    // Initialize PostHog
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      import('posthog-js').then(({ default: posthog }) => {
        if (!posthog.__loaded) {
          posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
            person_profiles: 'identified_only',
            capture_pageview: true,
            capture_pageleave: true,
          });
        }
      });
    }

    console.log('[Layout] Performance monitoring active:', performanceMonitor.getSessionId());
    initServiceWorker();

    const logInitialPerformance = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          console.log('[Performance] Page Load Metrics:', {
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            totalPageLoad: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            ttfb: Math.round(navigation.responseStart - navigation.requestStart)
          });
        }
      }
    };

    if (document.readyState === 'complete') {
      logInitialPerformance();
    } else {
      window.addEventListener('load', logInitialPerformance);
    }

    return () => {
      window.removeEventListener('load', logInitialPerformance);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <SearchShortcut />
    </>
  );
}
