import Breadcrumbs from '@/components/Breadcrumbs';
import EnhancedSearch from '@/components/EnhancedSearch';
import EnhancedSearchResults from '@/components/EnhancedSearchResults';

export const metadata = {
  title: 'Search the Constitution of the Cayman Islands',
  description: 'Search for sections and content within the Constitution of the Cayman Islands',
};

interface SearchPageProps {
  searchParams: Promise<{ 
    q?: string; 
    chapter?: string;
    type?: string;
    metadata?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const chapter = resolvedSearchParams.chapter;
  const includeMetadata = resolvedSearchParams.metadata === 'true';
  
  // Fetch enhanced search results if there's a query
  let searchResults = null;
  if (query) {
    try {
      const searchUrl = new URL('/api/search', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
      searchUrl.searchParams.set('q', query);
      if (chapter) searchUrl.searchParams.set('chapter', chapter);
      searchUrl.searchParams.set('metadata', 'true'); // Always include metadata for better UX
      
      const response = await fetch(searchUrl.toString());
      if (response.ok) {
        searchResults = await response.json();
      } else {
        console.error('Search API error:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch search results:', error);
    }
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Search',
            href: '/search',
            active: true,
          },
        ]}
      />

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-primary-DEFAULT dark:text-primary-400 mb-4">
            Search the Constitution
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Find specific sections, rights, principles, and legal concepts within the Cayman Islands Constitution.
          </p>
          
          {/* Enhanced Search Component */}
          <EnhancedSearch 
            initialQuery={query}
            showFilters={true}
          />
        </div>

        {/* Search Results */}
        {query && searchResults && (
          <EnhancedSearchResults
            results={searchResults.results || []}
            query={query}
            total={searchResults.total || 0}
            facets={searchResults.facets}
          />
        )}

        {/* Help Section - shown when no search has been performed */}
        {!query && (
          <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Search Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  What you can search for:
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• Article titles and content</li>
                  <li>• Constitutional rights and freedoms</li>
                  <li>• Government institutions and powers</li>
                  <li>• Legal terms and concepts</li>
                  <li>• Amendment history</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Search examples:
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• "fundamental rights"</li>
                  <li>• "president powers"</li>
                  <li>• "parliament elections"</li>
                  <li>• "constitutional court"</li>
                  <li>• "freedom of expression"</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 