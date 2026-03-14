/**
 * Analytics Utilities — powered by PostHog
 *
 * Uses dynamic import to avoid pulling posthog-js into server bundles.
 */

async function getPostHog() {
  if (typeof window === 'undefined') return null;
  const { default: posthog } = await import('posthog-js');
  return posthog.__loaded ? posthog : null;
}

export function isAnalyticsEnabled(): boolean {
  return typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_POSTHOG_KEY;
}

export function setAnalyticsOptOut(optOut: boolean): void {
  getPostHog().then((ph) => {
    if (!ph) return;
    if (optOut) ph.opt_out_capturing();
    else ph.opt_in_capturing();
  });
}

export function trackPageView(path: string) {
  getPostHog().then((ph) => ph?.capture('$pageview', { path }));
}

export function trackArticleView(chapter: number, article: number) {
  getPostHog().then((ph) => ph?.capture('article_view', { chapter, article }));
}

export function trackChapterView(chapter: number) {
  getPostHog().then((ph) => ph?.capture('chapter_view', { chapter }));
}

export function trackSearch(term: string) {
  getPostHog().then((ph) => ph?.capture('search', { term }));
}

export function getOrCreateSessionId(): string {
  return '';
}

export function trackActiveUser() {
  // PostHog handles active user tracking natively
}
