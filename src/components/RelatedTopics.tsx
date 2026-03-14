'use client';

import Link from 'next/link';
import { TagIcon } from '@heroicons/react/24/outline';

interface Topic {
  slug: string;
  title: string;
}

interface RelatedTopicsProps {
  topics: Topic[];
}

export default function RelatedTopics({ topics }: RelatedTopicsProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2">
      <TagIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      {topics.map((topic) => (
        <Link
          key={topic.slug}
          href={`/topics/${topic.slug}`}
          className="text-xs px-2.5 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-DEFAULT/20 hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors border border-gray-300 dark:border-gray-600"
        >
          {topic.title}
        </Link>
      ))}
    </div>
  );
}
