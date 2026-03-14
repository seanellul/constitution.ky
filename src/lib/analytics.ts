/**
 * Analytics Utilities (no-op stubs)
 *
 * Database analytics are disabled. These functions are kept as no-ops
 * so existing component imports continue to work.
 */

export function isAnalyticsEnabled(): boolean {
  return false;
}

export function setAnalyticsOptOut(_optOut: boolean): void {}

export function trackPageView(_path: string) {}

export function trackArticleView(_chapter: number, _article: number) {}

export function trackChapterView(_chapter: number) {}

export function trackSearch(_term: string) {}

export function getOrCreateSessionId(): string {
  return '';
}

export function trackActiveUser() {}
