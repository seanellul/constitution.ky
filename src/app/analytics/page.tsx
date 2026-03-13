'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ChartBarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import AnalyticsHealthStatus from '@/components/AnalyticsHealthStatus';

// Types for our analytics data
interface TopArticle {
  chapter: number;
  article: number;
  views: number;
  title: string;
}

interface TopChapter {
  chapter: number;
  views: number;
}

interface TopSearch {
  term: string;
  count: number;
}

interface AnalyticsStats {
  totalArticleViews: number;
  totalChapterViews: number;
  totalPageViews: number;
  totalSearches: number;
  activeUserCount: number;
  uniqueVisitors: number;
}

interface DashboardData {
  topArticles: TopArticle[];
  topChapters: TopChapter[];
  topSearches: TopSearch[];
  stats: AnalyticsStats;
  timeframe: string;
}

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState<string>('day');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/dashboard-data?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  // Initial data fetch and when timeframe changes
  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Format the timeframe for display
  const formatTimeframe = (tf: string): string => {
    switch (tf) {
      case 'day': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      case 'all': return 'All Time';
      default: return 'Today';
    }
  };

  // Format the last updated time
  const formatLastUpdated = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-2">
          Constitution Analytics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Real-time insights into how the Constitution of the Cayman Islands is being accessed and used.
        </p>
      </motion.div>

      {/* Controls and Info */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:text-gray-200"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          
          <button 
            onClick={fetchDashboardData}
            className="flex items-center space-x-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm transition-colors dark:text-gray-300"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>Last updated at {formatLastUpdated(lastUpdated)}</span>
        </div>
      </motion.div>

      {/* Analytics Health Status */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <AnalyticsHealthStatus />
      </motion.div>

      {loading && !dashboardData ? (
        // Loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <DocumentTextIcon className="w-5 h-5 text-primary-DEFAULT dark:text-primary-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Article Views</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{dashboardData?.stats.totalArticleViews.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimeframe(timeframe)}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Chapter Views</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{dashboardData?.stats.totalChapterViews.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimeframe(timeframe)}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Searches</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{dashboardData?.stats.totalSearches.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimeframe(timeframe)}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <UserGroupIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Visitors</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{dashboardData?.stats.uniqueVisitors.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimeframe(timeframe)}</p>
            </div>
          </motion.div>

          {/* Data Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Articles */}
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 text-primary-DEFAULT dark:text-primary-400 mr-2" />
                Most Viewed Articles
              </h2>
              
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Article</th>
                      <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.topArticles.map((article, i) => (
                      <motion.tr 
                        key={`${article.chapter}-${article.article}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (i * 0.05) }}
                      >
                        <td className="py-2 whitespace-nowrap">
                          <Link 
                            href={`/constitution/chapter/${article.chapter}/article/${article.article}`}
                            className="text-primary-DEFAULT dark:text-primary-400 hover:underline"
                          >
                            Article {article.article}
                          </Link>
                        </td>
                        <td className="py-2 text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                          <Link 
                            href={`/constitution/chapter/${article.chapter}/article/${article.article}`}
                            className="hover:underline"
                            title={article.title || ''}
                          >
                            {article.title || ''}
                          </Link>
                        </td>
                        <td className="py-2 text-right font-medium dark:text-gray-300">{article.views}</td>
                      </motion.tr>
                    ))}
                    
                    {(!dashboardData?.topArticles || dashboardData.topArticles.length === 0) && (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-gray-500">No data available yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Top Searches */}
            <motion.div 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <MagnifyingGlassIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                Most Popular Searches
              </h2>
              
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Term</th>
                      <th className="py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Searches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.topSearches.map((search, i) => (
                      <motion.tr 
                        key={search.term}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (i * 0.05) }}
                      >
                        <td className="py-2">
                          <Link 
                            href={`/search?q=${encodeURIComponent(search.term)}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {search.term}
                          </Link>
                        </td>
                        <td className="py-2 text-right font-medium dark:text-gray-300">{search.count}</td>
                      </motion.tr>
                    ))}
                    
                    {(!dashboardData?.topSearches || dashboardData.topSearches.length === 0) && (
                      <tr>
                        <td colSpan={2} className="py-4 text-center text-gray-500">No data available yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Top Chapters */}
          <motion.div 
            className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              Chapter Popularity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {dashboardData?.topChapters.map((chapter, i) => (
                <motion.div 
                  key={chapter.chapter}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + (i * 0.1) }}
                >
                  <Link 
                    href={`/constitution/chapter/${chapter.chapter}`}
                    className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-primary-DEFAULT dark:hover:text-primary-400"
                  >
                    Chapter {chapter.chapter}
                  </Link>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (chapter.views / (dashboardData?.topChapters[0]?.views || 1)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">{chapter.views}</span>
                  </div>
                </motion.div>
              ))}
              
              {(!dashboardData?.topChapters || dashboardData.topChapters.length === 0) && (
                <div className="col-span-5 py-4 text-center text-gray-500">No data available yet</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
} 