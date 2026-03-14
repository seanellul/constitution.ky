'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Article } from '@/types/constitution';
import {
  ChevronRightIcon,
  TagIcon,
  DocumentTextIcon,
  FunnelIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface SearchResult extends Article {
  relevanceScore: number;
  matchType: 'title' | 'content' | 'tag' | 'cross-reference';
  matchedText?: string;
}

interface EnhancedSearchResultsProps {
  results: SearchResult[];
  query: string;
  total: number;
  loading?: boolean;
  facets?: {
    chapters: { number: number; title: string; count: number }[];
    tags: { tag: string; count: number }[];
  };
  onFilterChange?: (filters: any) => void;
}

export default function EnhancedSearchResults({
  results,
  query,
  total,
  loading = false,
  facets,
  onFilterChange
}: EnhancedSearchResultsProps) {
  const [sortBy, setSortBy] = useState<'relevance' | 'article' | 'chapter'>('relevance');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Sort results based on selected criteria
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return b.relevanceScore - a.relevanceScore;
      case 'article':
        return a.number - b.number;
      case 'chapter':
        return a.chapterNumber - b.chapterNumber || a.number - b.number;
      default:
        return 0;
    }
  });

  // Filter results based on selected filters
  const filteredResults = sortedResults.filter(result => {
    if (selectedChapter && result.chapterNumber !== selectedChapter) return false;
    if (selectedTag && (!result.tags || !result.tags.includes(selectedTag))) return false;
    return true;
  });

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getMatchTypeIcon = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'title':
        return <DocumentTextIcon className="w-4 h-4 text-blue-500" />;
      case 'tag':
        return <TagIcon className="w-4 h-4 text-green-500" />;
      case 'cross-reference':
        return <ChevronRightIcon className="w-4 h-4 text-purple-500" />;
      default:
        return <DocumentTextIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMatchTypeLabel = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'title':
        return 'Title match';
      case 'tag':
        return 'Tag match';
      case 'cross-reference':
        return 'Cross-reference';
      default:
        return 'Content match';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded mb-2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-3 w-full rounded mb-1"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-3 w-2/3 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Search Results
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredResults.length === 0 && query ? (
              'No results found'
            ) : (
              `Found ${filteredResults.length} result${filteredResults.length === 1 ? '' : 's'} for "${query}"`
            )}
            {total > results.length && (
              <span className="text-sm text-gray-500">
                {' '}(showing first {results.length} of {total})
              </span>
            )}
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-gray-600 dark:text-gray-400">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="article">Article Number</option>
            <option value="chapter">Chapter</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        {facets && (
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FunnelIcon className="w-4 h-4" />
                Filters
              </h3>

              {/* Chapter Filter */}
              {facets.chapters && facets.chapters.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chapters
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedChapter(null)}
                      className={`block w-full text-left text-sm px-2 py-1 rounded ${
                        selectedChapter === null
                          ? 'bg-primary-DEFAULT text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      All Chapters ({total})
                    </button>
                    {facets.chapters.slice(0, 5).map(chapter => (
                      <button
                        key={chapter.number}
                        onClick={() => setSelectedChapter(chapter.number)}
                        className={`block w-full text-left text-sm px-2 py-1 rounded ${
                          selectedChapter === chapter.number
                            ? 'bg-primary-DEFAULT text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="truncate">
                          Chapter {chapter.number} ({chapter.count})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Filter */}
              {facets.tags && facets.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Topics
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`block w-full text-left text-sm px-2 py-1 rounded ${
                        selectedTag === null
                          ? 'bg-primary-DEFAULT text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      All Topics
                    </button>
                    {facets.tags.slice(0, 8).map(tag => (
                      <button
                        key={tag.tag}
                        onClick={() => setSelectedTag(tag.tag)}
                        className={`block w-full text-left text-sm px-2 py-1 rounded ${
                          selectedTag === tag.tag
                            ? 'bg-primary-DEFAULT text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="truncate">
                          {tag.tag} ({tag.count})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className={`${facets ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search terms or filters
              </p>
              <Link
                href="/constitution"
                className="btn-primary inline-flex items-center gap-2"
              >
                <DocumentTextIcon className="w-4 h-4" />
                Browse All Chapters
              </Link>
            </div>
          ) : (
            <div className="space-y-4" role="list" aria-label="Search results">
              <AnimatePresence mode="popLayout">
              {filteredResults.map((result, index) => (
                <motion.article
                  key={`${result.chapterNumber}-${result.number}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                  role="listitem"
                >
                  {/* Article Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-primary-DEFAULT dark:text-primary-400">
                          Article {result.number}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Chapter {result.chapterNumber}: {result.chapterTitle}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        <Link
                          href={`/constitution/chapter/${result.chapterNumber}/article/${result.number}`}
                          className="hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors"
                        >
                          {highlightText(result.title, query)}
                        </Link>
                      </h3>
                    </div>

                    {/* Match Type and Relevance */}
                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        {getMatchTypeIcon(result.matchType)}
                        <span>{getMatchTypeLabel(result.matchType)}</span>
                      </div>
                      {result.relevanceScore > 50 && (
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>

                  {/* Content Preview */}
                  {result.matchedText && (
                    <div className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {highlightText(result.matchedText, query)}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          <TagIcon className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {result.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{result.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Links */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/constitution/chapter/${result.chapterNumber}/article/${result.number}`}
                      className="text-primary-DEFAULT dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1 group"
                    >
                      Read Full Article
                      <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Relevance: {Math.round(result.relevanceScore)}%
                    </div>
                  </div>
                </motion.article>
              ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}