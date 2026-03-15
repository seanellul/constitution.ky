import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;

// ── In-memory cache with TTL ────────────────────────────────
const CACHE_TTL_MS = 60_000; // 60 seconds

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ── PostHog query helper ────────────────────────────────────
async function queryPostHog(query: string) {
  if (!POSTHOG_API_KEY || !POSTHOG_PROJECT_ID) return null;

  const res = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${POSTHOG_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.results || [];
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('mode');

  // Full dashboard mode for the Analytics page
  if (mode === 'dashboard') {
    const timeframe = request.nextUrl.searchParams.get('timeframe') || '7d';
    const interval = timeframe === '24h' ? '1 day' : timeframe === '7d' ? '7 day' : '30 day';

    const cacheKey = `dashboard:${timeframe}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    const [topArticles, topSearches, dailyViews, totalViews, uniqueVisitors] = await Promise.all([
      queryPostHog(`
        SELECT properties.chapter as chapter, properties.article as article, count() as views
        FROM events
        WHERE event = 'article_view'
          AND timestamp > now() - interval ${interval}
          AND properties.$host = 'constitution.ky'
        GROUP BY chapter, article
        ORDER BY views DESC
        LIMIT 10
      `),
      queryPostHog(`
        SELECT properties.term as term, count() as searches
        FROM events
        WHERE event = 'search'
          AND timestamp > now() - interval ${interval}
          AND properties.$host = 'constitution.ky'
        GROUP BY term
        ORDER BY searches DESC
        LIMIT 10
      `),
      queryPostHog(`
        SELECT toDate(timestamp) as day, count() as views
        FROM events
        WHERE event = '$pageview'
          AND timestamp > now() - interval ${interval}
          AND properties.$host = 'constitution.ky'
        GROUP BY day
        ORDER BY day ASC
      `),
      queryPostHog(`
        SELECT count() as total
        FROM events
        WHERE event = '$pageview'
          AND timestamp > now() - interval ${interval}
          AND properties.$host = 'constitution.ky'
      `),
      queryPostHog(`
        SELECT count(DISTINCT distinct_id) as visitors
        FROM events
        WHERE event = '$pageview'
          AND timestamp > now() - interval ${interval}
          AND properties.$host = 'constitution.ky'
      `),
    ]);

    const result = {
      topArticles: (topArticles || []).map(([chapter, article, views]: [string, string, number]) => ({
        chapter: Number(chapter),
        article: Number(article),
        views: Number(views),
      })),
      topSearches: (topSearches || []).map(([term, count]: [string, number]) => ({
        term,
        count: Number(count),
      })),
      dailyViews: (dailyViews || []).map(([day, views]: [string, number]) => ({
        day,
        views: Number(views),
      })),
      totalPageViews: totalViews?.[0]?.[0] ? Number(totalViews[0][0]) : 0,
      uniqueVisitors: uniqueVisitors?.[0]?.[0] ? Number(uniqueVisitors[0][0]) : 0,
      timeframe,
    };

    setCache(cacheKey, result);

    return NextResponse.json(result, {
      headers: { 'X-Cache': 'MISS' },
    });
  }

  // Simple mode for the LiveInsightsWidget
  if (!POSTHOG_API_KEY || !POSTHOG_PROJECT_ID) {
    return NextResponse.json({ topArticle: null, topSearch: null, activeUsers: 0 });
  }

  const simpleCacheKey = 'simple';
  const simpleCached = getCached(simpleCacheKey);
  if (simpleCached) {
    return NextResponse.json(simpleCached, {
      headers: { 'X-Cache': 'HIT' },
    });
  }

  const [topArticles, topSearches] = await Promise.all([
    queryPostHog(`
      SELECT properties.chapter as chapter, properties.article as article, count() as views
      FROM events
      WHERE event = 'article_view'
        AND timestamp > now() - interval 1 day
        AND properties.$host = 'constitution.ky'
      GROUP BY chapter, article
      ORDER BY views DESC
      LIMIT 1
    `),
    queryPostHog(`
      SELECT properties.term as term, count() as searches
      FROM events
      WHERE event = 'search'
        AND timestamp > now() - interval 1 day
        AND properties.$host = 'constitution.ky'
      GROUP BY term
      ORDER BY searches DESC
      LIMIT 1
    `),
  ]);

  let topArticle = null;
  let topSearch = null;

  if (topArticles && topArticles.length > 0) {
    const [chapter, article, views] = topArticles[0];
    topArticle = { chapter: Number(chapter), article: Number(article), views: Number(views) };
  }

  if (topSearches && topSearches.length > 0) {
    const [term, count] = topSearches[0];
    topSearch = { term, count: Number(count) };
  }

  const simpleResult = { topArticle, topSearch, activeUsers: 0 };
  setCache(simpleCacheKey, simpleResult);

  return NextResponse.json(simpleResult, {
    headers: { 'X-Cache': 'MISS' },
  });
}
