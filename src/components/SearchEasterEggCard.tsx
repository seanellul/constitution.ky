'use client';

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { matchEasterEgg } from '@/lib/search-easter-eggs';

export default function SearchEasterEggCard({ query }: { query: string }) {
  const egg = matchEasterEgg(query);
  if (!egg) return null;

  return (
    <div className="rounded-lg border border-primary-DEFAULT/20 bg-primary-50 dark:bg-primary-900/20 px-5 py-4">
      <p className="text-sm text-gray-800 dark:text-gray-200">{egg.message}</p>
      {egg.linkTo && egg.linkLabel && (
        <Link
          href={egg.linkTo}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary-DEFAULT hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {egg.linkLabel}
          <ChevronRightIcon className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
