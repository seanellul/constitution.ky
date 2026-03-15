'use client';

import { useEffect, useState } from 'react';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import { Article } from '@/types/constitution';
import { useRouter } from 'next/navigation';
import { isInappropriateSearchTerm } from '@/lib/content-filters';
import InappropriateSearchNotice from '@/components/InappropriateSearchNotice';

interface SearchClientProps {
  query: string;
  results: Article[];
}

export default function SearchClient({ query, results }: SearchClientProps) {
  const router = useRouter();
  const [showInappropriateNotice, setShowInappropriateNotice] = useState(false);

  useEffect(() => {
    if (query && isInappropriateSearchTerm(query)) {
      setShowInappropriateNotice(true);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('q') as string;
    
    // Check during form submission too in case terms are input directly
    if (searchQuery && isInappropriateSearchTerm(searchQuery)) {
      setShowInappropriateNotice(true);
      // Still allow the search to go through - we'll show results but also the notice
    }
    
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {/* Inappropriate Search Notice */}
      <InappropriateSearchNotice 
        isVisible={showInappropriateNotice} 
        onClose={() => setShowInappropriateNotice(false)} 
      />

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for articles, rights, principles..."
            className="search-input flex-grow"
            aria-label="Search query"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </div>
      </form>

      {query && (
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            {results.length === 0
              ? 'No results found'
              : `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((article) => (
            <ArticleCard key={article.number} article={article} />
          ))
        ) : query ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No articles found matching your search.</p>
            <p className="text-gray-500 dark:text-gray-500 mb-6">Try using different keywords or browse all chapters.</p>
            <Link href="/constitution" className="btn-primary">
              Browse All Chapters
            </Link>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Enter a search term to find sections in the Constitution of the Cayman Islands.</p>
            <p className="text-gray-500 dark:text-gray-400 mb-6">You can search by article title, content, or keywords.</p>
            <Link href="/constitution" className="btn-primary">
              Browse All Chapters
            </Link>
          </div>
        )}
      </div>
    </>
  );
} 