'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Chapter } from '@/types/constitution';
import { toRomanNumeral } from '@/lib/utils';
import {
  getTotalReadCount,
  getReadCountForChapter,
  getRecentlyRead,
  getNextUnread,
} from '@/lib/readingProgress';

interface ConstitutionContentProps {
  chapters: Chapter[];
}

export default function ConstitutionContent({ chapters }: ConstitutionContentProps) {
  const [totalRead, setTotalRead] = useState(0);
  const [chapterReadCounts, setChapterReadCounts] = useState<Record<number, number>>({});
  const [recentlyRead, setRecentlyRead] = useState<{ chapterNumber: number; articleNumber: number }[]>([]);
  const [nextUnread, setNextUnread] = useState<{ chapterNumber: number; articleNumber: number } | null>(null);

  const totalArticles = chapters.reduce((sum, ch) => sum + (ch.articles?.length || 0), 0);

  useEffect(() => {
    setTotalRead(getTotalReadCount());
    const counts: Record<number, number> = {};
    for (const ch of chapters) {
      counts[ch.number] = getReadCountForChapter(ch.number);
    }
    setChapterReadCounts(counts);
    setRecentlyRead(getRecentlyRead(3));
    setNextUnread(
      getNextUnread(
        chapters.map((ch) => ({
          number: ch.number,
          articles: (ch.articles || []).map((a) => ({ number: a.number })),
        }))
      )
    );
  }, [chapters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const progressPct = totalArticles > 0 ? (totalRead / totalArticles) * 100 : 0;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Progress dashboard */}
      <motion.div
        className="mb-8 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              You&apos;ve read {totalRead} of {totalArticles} sections
            </p>
            <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-DEFAULT dark:bg-primary-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
          {nextUnread && (
            <Link
              href={`/constitution/chapter/${nextUnread.chapterNumber}/article/${nextUnread.articleNumber}`}
              className="btn-primary text-sm whitespace-nowrap"
            >
              Continue reading →
            </Link>
          )}
        </div>

        {recentlyRead.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Recently read</p>
            <div className="flex flex-wrap gap-2">
              {recentlyRead.map((r) => (
                <Link
                  key={`${r.chapterNumber}-${r.articleNumber}`}
                  href={`/constitution/chapter/${r.chapterNumber}/article/${r.articleNumber}`}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors"
                >
                  Section {r.articleNumber}
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Chapter grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chapters.map((chapter: Chapter, index) => {
          const chapterArticleCount = chapter.articles?.length || 0;
          const readCount = chapterReadCounts[chapter.number] || 0;
          const chapterPct = chapterArticleCount > 0 ? (readCount / chapterArticleCount) * 100 : 0;

          return (
            <motion.div
              key={chapter.number}
              variants={itemVariants}
              transition={{ delay: index * 0.05 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <Link
                href={`/constitution/chapter/${chapter.number}`}
                className="chapter-card group block"
              >
                <h2 className="text-2xl font-bold font-serif text-primary-DEFAULT group-hover:text-primary-dark transition-colors">
                  Chapter {toRomanNumeral(chapter.number)}
                </h2>
                <h3 className="text-xl text-gray-700 dark:text-gray-300 mb-4">{chapter.title}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {chapterArticleCount} Articles
                  </span>
                  <span className="text-primary-DEFAULT group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
                {/* Per-chapter progress */}
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${chapterPct}%` }}
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
