import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChartBarIcon, MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface TopArticle {
  chapter: number;
  article: number;
  views: number;
  title?: string;
}

interface TopSearch {
  term: string;
  count: number;
}

interface InsightsData {
  topArticle: TopArticle | null;
  topSearch: TopSearch | null;
  activeUsers: number;
}

const LiveInsightsWidget = memo(function LiveInsightsWidget({ className = '' }: { className?: string }) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/analytics/insights');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
    const interval = setInterval(fetchInsights, 120 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  if (loading && !data) {
    return (
      <div className={`bg-gray-50/80 dark:bg-gray-800/50 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
        <h3 className="text-base sm:text-lg font-serif font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
          <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-DEFAULT dark:text-primary-400" />
          Live Insights
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const topArticle = data?.topArticle;
  const topSearch = data?.topSearch;
  const activeUsers = data?.activeUsers ?? 0;

  return (
    <motion.div
      className={`bg-gray-50/80 dark:bg-gray-800/50 rounded-lg p-4 sm:p-5 border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-base sm:text-lg font-serif font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
        <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-DEFAULT dark:text-primary-400" />
        Live Insights
      </h3>

      <div className="space-y-3">
        {topArticle && (
          <motion.div
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 dark:border-gray-700 gap-2 sm:gap-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center flex-shrink-0">
              <ChartBarIcon className="w-4 h-4 mr-2 text-primary-DEFAULT/70 dark:text-primary-400/70" />
              Most Read Today:
            </span>
            <div className="flex flex-col sm:items-end">
              <Link
                href={`/constitution/chapter/${topArticle.chapter}/article/${topArticle.article}`}
                className="text-sm font-medium text-primary-DEFAULT dark:text-primary-400 hover:underline"
              >
                Section {topArticle.article}
              </Link>
              <div className="text-xs text-gray-500 dark:text-gray-400 sm:max-w-[200px] md:max-w-[250px] truncate" title={topArticle.title || ''}>
                {topArticle.title || ''} <span>({topArticle.views} views)</span>
              </div>
            </div>
          </motion.div>
        )}

        {topSearch && (
          <motion.div
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 dark:border-gray-700 gap-2 sm:gap-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center flex-shrink-0">
              <MagnifyingGlassIcon className="w-4 h-4 mr-2 text-blue-500/70 dark:text-blue-400/70" />
              Top Search:
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/search?q=${encodeURIComponent(topSearch.term)}`}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] sm:max-w-none"
                title={`"${topSearch.term}"`}
              >
                &quot;{topSearch.term}&quot;
              </Link>
              <span className="text-xs text-gray-500 dark:text-gray-400">({topSearch.count} searches)</span>
            </div>
          </motion.div>
        )}

        <motion.div
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2 sm:gap-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center flex-shrink-0">
            <UserGroupIcon className="w-4 h-4 mr-2 text-green-500/70 dark:text-green-400/70" />
            Status:
          </span>
          <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Online
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
});

export default LiveInsightsWidget;
