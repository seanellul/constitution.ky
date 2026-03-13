"use client";

import Link from 'next/link';
import { Article } from '@/types/constitution';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link 
      href={`/constitution/chapter/${article.chapterNumber}/article/${article.number}`}
      className="article-card group block"
    >
      <div className="flex flex-col h-full">
        <h3 className="text-lg sm:text-xl font-bold text-primary-DEFAULT dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors mb-2 sm:mb-3">
          Article {article.number}{article.title ? `: ${article.title}` : ''}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed flex-grow mb-3">
          {article.notes || 'Part of the Constitution of the Cayman Islands'}
        </p>
        
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 py-1">
                +{article.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-end mt-auto">
          <span className="text-primary-DEFAULT dark:text-primary-400 text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
            Read article
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-1">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard; 