'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface SidebarArticle {
  number: number;
  title: string;
  isRead: boolean;
}

interface ChapterSidebarProps {
  chapterNumber: number;
  chapterTitle: string;
  articles: SidebarArticle[];
  currentArticleNumber: number;
}

export default function ChapterSidebar({
  chapterNumber,
  chapterTitle,
  articles,
  currentArticleNumber,
}: ChapterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const readCount = articles.filter((a) => a.isRead).length;

  return (
    <>
      {/* Toggle button — fixed on the left edge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-lg p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden lg:flex items-center"
        title={isOpen ? 'Hide chapter contents' : 'Show chapter contents'}
        aria-label="Toggle chapter sidebar"
      >
        {isOpen ? (
          <ChevronLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ListBulletIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Sidebar panel */}
      <div
        className={`fixed left-0 top-0 h-full z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-transform duration-300 w-72 pt-20 pb-6 overflow-y-auto hidden lg:block ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 mb-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
            Part {chapterNumber}: {chapterTitle}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${articles.length > 0 ? (readCount / articles.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              {readCount}/{articles.length}
            </span>
          </div>
        </div>

        <nav className="px-2">
          <ul className="space-y-0.5">
            {articles.map((article) => {
              const isCurrent = article.number === currentArticleNumber;
              return (
                <li key={article.number}>
                  <Link
                    href={`/constitution/chapter/${chapterNumber}/article/${article.number}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      isCurrent
                        ? 'bg-primary-DEFAULT/10 text-primary-DEFAULT dark:text-primary-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {article.isRead ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        isCurrent
                          ? 'border-primary-DEFAULT dark:border-primary-400'
                          : 'border-gray-300 dark:border-gray-600'
                      }`} />
                    )}
                    <span className="truncate">
                      <span className="font-mono text-xs mr-1">{article.number}.</span>
                      {article.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile toggle — bottom of screen */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-40 lg:hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-3 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title="Chapter contents"
      >
        <ListBulletIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg pt-20 pb-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                Part {chapterNumber}: {chapterTitle}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${articles.length > 0 ? (readCount / articles.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {readCount}/{articles.length}
                </span>
              </div>
            </div>
            <nav className="px-2">
              <ul className="space-y-0.5">
                {articles.map((article) => {
                  const isCurrent = article.number === currentArticleNumber;
                  return (
                    <li key={article.number}>
                      <Link
                        href={`/constitution/chapter/${chapterNumber}/article/${article.number}`}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          isCurrent
                            ? 'bg-primary-DEFAULT/10 text-primary-DEFAULT dark:text-primary-400 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {article.isRead ? (
                          <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                            isCurrent
                              ? 'border-primary-DEFAULT dark:border-primary-400'
                              : 'border-gray-300 dark:border-gray-600'
                          }`} />
                        )}
                        <span className="truncate">
                          <span className="font-mono text-xs mr-1">{article.number}.</span>
                          {article.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
