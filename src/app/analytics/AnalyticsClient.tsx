'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  EyeIcon,
  DocumentTextIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface TopArticle {
  chapter: number;
  article: number;
  views: number;
}

interface TopSearch {
  term: string;
  count: number;
}

interface DailyView {
  day: string;
  views: number;
}

interface DashboardData {
  topArticles: TopArticle[];
  topSearches: TopSearch[];
  dailyViews: DailyView[];
  totalPageViews: number;
  uniqueVisitors: number;
  timeframe: string;
}

type Timeframe = '24h' | '7d' | '30d';

export default function AnalyticsClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<Timeframe>('7d');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/insights?mode=dashboard&timeframe=${timeframe}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error('Error fetching open data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const timeframeLabels: Record<Timeframe, string> = {
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
  };

  const maxViews = data?.dailyViews.length
    ? Math.max(...data.dailyViews.map((d) => d.views), 1)
    : 1;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-8 sm:mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <GlobeAltIcon className="w-8 h-8 text-primary-DEFAULT dark:text-primary-400" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100">
            Analytics
          </h1>
        </div>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Transparent civic engagement data. See what people are reading and searching for in the
          Constitution of the Cayman Islands.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          All data is anonymous and aggregated. No personal information is collected.
        </p>
      </motion.div>

      {/* Timeframe Selector */}
      <div className="flex justify-center gap-2 mb-8">
        {(['24h', '7d', '30d'] as Timeframe[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeframe === tf
                ? 'bg-primary-DEFAULT text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {timeframeLabels[tf]}
          </button>
        ))}
      </div>

      {loading && !data ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-48" />
          ))}
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <EyeIcon className="w-5 h-5 text-primary-DEFAULT dark:text-primary-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Page Views</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {(data?.totalPageViews ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <UserGroupIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Unique Visitors</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {(data?.uniqueVisitors ?? 0).toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Daily Views Chart */}
          {data?.dailyViews && data.dailyViews.length > 0 && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-primary-DEFAULT dark:text-primary-400" />
                Daily Readership
              </h2>
              <div className="flex items-end gap-1 h-32 sm:h-48">
                {data.dailyViews.map((d, i) => {
                  const height = Math.max((d.views / maxViews) * 100, 2);
                  const date = new Date(d.day);
                  const label = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-end group"
                    >
                      <div className="hidden group-hover:block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {d.views}
                      </div>
                      <div
                        className="w-full bg-primary-DEFAULT/70 dark:bg-primary-400/70 rounded-t hover:bg-primary-DEFAULT dark:hover:bg-primary-400 transition-colors"
                        style={{ height: `${height}%` }}
                        title={`${label}: ${d.views} views`}
                      />
                      {data.dailyViews.length <= 14 && (
                        <span className="text-[10px] text-gray-400 mt-1 hidden sm:block">
                          {label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Two Column: Top Searches + Top Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Searches */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                What People Are Searching
              </h2>
              {data?.topSearches && data.topSearches.length > 0 ? (
                <ol className="space-y-3">
                  {data.topSearches.map((search, i) => (
                    <li key={i}>
                      <Link
                        href={`/search?q=${encodeURIComponent(search.term)}`}
                        className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 py-2 -mx-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-5 flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                            &quot;{search.term}&quot;
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                          {search.count} {search.count === 1 ? 'search' : 'searches'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                  No search data yet. Be the first to{' '}
                  <Link href="/search" className="text-blue-600 dark:text-blue-400 hover:underline">
                    search the Constitution
                  </Link>
                  .
                </p>
              )}
            </motion.div>

            {/* Top Articles */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-primary-DEFAULT dark:text-primary-400" />
                Most Read Sections
              </h2>
              {data?.topArticles && data.topArticles.length > 0 ? (
                <ol className="space-y-3">
                  {data.topArticles.map((article, i) => (
                    <li key={i}>
                      <Link
                        href={`/constitution/chapter/${article.chapter}/article/${article.article}`}
                        className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 py-2 -mx-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-5 flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary-DEFAULT dark:group-hover:text-primary-400">
                            Section {article.article}
                          </span>
                          <span className="text-xs text-gray-400">Part {article.chapter}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                          {article.views} {article.views === 1 ? 'view' : 'views'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                  No reading data yet. Start by{' '}
                  <Link href="/constitution" className="text-primary-DEFAULT dark:text-primary-400 hover:underline">
                    exploring the Constitution
                  </Link>
                  .
                </p>
              )}
            </motion.div>
          </div>

          {/* Why Open Analytics */}
          <motion.div
            className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-6 sm:p-8 border border-primary-100 dark:border-primary-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Why Open Analytics?
            </h2>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4">
              The Constitution is a living document — not just text on a page, but the foundation of
              our democracy. By making engagement data public, we show that people from all walks of
              life are actively reading, searching, and referencing the rights and principles that
              govern the Cayman Islands.
            </p>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              This transparency demonstrates civic interest and helps everyone understand which
              constitutional topics matter most to the community.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
