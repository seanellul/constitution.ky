'use client';

import { useEffect, useState } from 'react';
import { trackChapterView } from '@/lib/analytics';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import { toRomanNumeral } from '@/lib/utils';
import { Paragraph } from '@/types/constitution';
import { motion } from 'framer-motion';
import { isArticleRead, getReadCountForChapter } from '@/lib/readingProgress';
import { estimateReadingTime } from '@/lib/readingTime';
import { Article } from '@/types/constitution';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ArticlePreview {
  number: number;
  title: string;
  content: string | string[] | Paragraph[];
}

interface Chapter {
  number: number;
  title: string;
  subtitle?: string;
}

interface ChapterContentProps {
  chapter: Chapter;
  articles: ArticlePreview[];
  chapterNum: number;
}

export default function ChapterContent({ chapter, articles, chapterNum }: ChapterContentProps) {
  const [readStatuses, setReadStatuses] = useState<Record<number, boolean>>({});
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    if (chapterNum) {
      trackChapterView(chapterNum);
    }
    // Load reading progress
    const statuses: Record<number, boolean> = {};
    for (const a of articles) {
      statuses[a.number] = isArticleRead(chapterNum, a.number);
    }
    setReadStatuses(statuses);
    setReadCount(getReadCountForChapter(chapterNum));
  }, [chapterNum, articles]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper function to extract preview text from article content
  const getContentPreview = (content: string | string[] | Paragraph[]): string => {
    if (!content) return "No content available";
    
    // If content is a string, use it directly
    if (typeof content === 'string') {
      return content.substring(0, 150) + (content.length > 150 ? "..." : "");
    }
    
    // If content is an array
    if (Array.isArray(content) && content.length > 0) {
      const firstItem = content[0];
      
      // If the first item is a string
      if (typeof firstItem === 'string') {
        return firstItem.substring(0, 150) + (firstItem.length > 150 ? "..." : "");
      }
      
      // If the first item is a Paragraph object
      if (firstItem && typeof firstItem === 'object' && 'text' in firstItem) {
        return firstItem.text.substring(0, 150) + (firstItem.text.length > 150 ? "..." : "");
      }
    }
    
    return "No content available";
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/constitution", label: "Constitution" },
          { href: "", label: `Chapter ${toRomanNumeral(chapterNum)} - ${chapter.title}`, active: true },
        ]}
      />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-3xl font-bold font-serif mt-6 mb-2 text-primary-DEFAULT"
          variants={itemVariants}
        >
          Chapter {toRomanNumeral(chapterNum)} - {chapter.title}
        </motion.h1>

        {chapter.subtitle && (
          <motion.p
            className="text-xl text-gray-600 mb-4"
            variants={itemVariants}
          >
            {chapter.subtitle}
          </motion.p>
        )}

        {/* Reading progress */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          variants={itemVariants}
        >
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-xs">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${articles.length > 0 ? (readCount / articles.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {readCount}/{articles.length} read
          </span>
        </motion.div>

        <motion.div 
          className="mt-10 grid grid-cols-1 gap-4"
          variants={itemVariants}
        >
          {articles.map((article, index) => (
            <motion.div
              key={article.number}
              variants={itemVariants}
              transition={{
                delay: index * 0.05
              }}
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
            >
              <Link
                href={`/constitution/chapter/${chapterNum}/article/${article.number}`}
                className="article-card group block"
              >
                <h2 className="text-xl font-semibold font-serif mb-2 group-hover:text-primary-DEFAULT transition-colors flex items-center gap-2">
                  {readStatuses[article.number] && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                  <span>
                    Article {article.number}{" "}
                    {article.title && <span>- {article.title}</span>}
                  </span>
                </h2>
                <p className="text-gray-600">
                  {getContentPreview(article.content)}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ~{estimateReadingTime({ number: article.number, title: article.title, chapterNumber: chapterNum, chapterTitle: '', content: article.content as any, amendmentHistory: null } as Article)} min read
                  </span>
                  <span className="text-primary-DEFAULT text-sm group-hover:translate-x-1 transition-transform">
                    Read article →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
} 