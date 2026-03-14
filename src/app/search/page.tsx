import Breadcrumbs from '@/components/Breadcrumbs';
import EnhancedSearch from '@/components/EnhancedSearch';
import EnhancedSearchResults from '@/components/EnhancedSearchResults';
import { searchArticles } from '@/lib/constitution';
import { shouldFilterFromAnalytics } from '@/lib/content-filters';
import { Article } from '@/types/constitution';

export const metadata = {
  title: 'Search the Constitution of the Cayman Islands',
  description: 'Search for sections and content within the Constitution of the Cayman Islands',
};

interface SearchResult extends Article {
  relevanceScore: number;
  matchType: 'title' | 'content' | 'tag' | 'cross-reference';
  matchedText?: string;
}

function calculateRelevanceScore(
  article: Article,
  query: string
): { score: number; matchType: SearchResult['matchType']; matchedText?: string } {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);

  let score = 0;
  let matchType: SearchResult['matchType'] = 'content';
  let matchedText: string | undefined;

  // Title matches (highest weight)
  if (article.title.toLowerCase().includes(queryLower)) {
    score += 100;
    matchType = 'title';
    matchedText = article.title;
  }

  if (article.title.toLowerCase() === queryLower) {
    score += 50;
  }

  queryWords.forEach(word => {
    if (article.title.toLowerCase().includes(word)) {
      score += 20;
    }
  });

  if (article.tags) {
    article.tags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        score += 30;
        matchType = 'tag';
        matchedText = tag;
      }
    });
  }

  if (article.content) {
    const contentString = Array.isArray(article.content)
      ? article.content.map(p => typeof p === 'string' ? p : (p as any).text || '').join(' ')
      : '';

    const contentLower = contentString.toLowerCase();

    if (contentLower.includes(queryLower)) {
      score += 15;
      const index = contentLower.indexOf(queryLower);
      const start = Math.max(0, index - 50);
      const end = Math.min(contentString.length, index + query.length + 100);
      matchedText = (start > 0 ? '...' : '') + contentString.substring(start, end) + (end < contentString.length ? '...' : '');
    }

    queryWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = contentString.match(regex);
      if (matches) {
        score += matches.length * 5;
      }
    });
  }

  if (article.crossReferences) {
    article.crossReferences.forEach(ref => {
      if (ref.description.toLowerCase().includes(queryLower)) {
        score += 5;
        matchType = 'cross-reference';
      }
    });
  }

  if (queryLower === article.number.toString()) {
    score += 200;
  }

  return { score: Math.max(score, 1), matchType, matchedText };
}

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
  const chapter = resolvedSearchParams.chapter ? parseInt(resolvedSearchParams.chapter) : undefined;

  let searchResults: { results: SearchResult[]; total: number; facets?: any } | null = null;

  if (query && !shouldFilterFromAnalytics(query)) {
    const basicResults = await searchArticles(query);

    const filtered = chapter
      ? basicResults.filter(a => a.chapterNumber === chapter)
      : basicResults;

    const scored: SearchResult[] = filtered.map(article => {
      const { score, matchType, matchedText } = calculateRelevanceScore(article, query);
      return { ...article, relevanceScore: score, matchType, matchedText };
    });

    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Build facets
    const chapterCounts = new Map<number, { title: string; count: number }>();
    scored.forEach(r => {
      const c = chapterCounts.get(r.chapterNumber) || { title: r.chapterTitle, count: 0 };
      c.count++;
      chapterCounts.set(r.chapterNumber, c);
    });

    searchResults = {
      results: scored.slice(0, 20),
      total: scored.length,
      facets: {
        chapters: Array.from(chapterCounts.entries())
          .map(([number, data]) => ({ number, title: data.title, count: data.count }))
          .sort((a, b) => b.count - a.count),
      },
    };
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

        {/* No results message */}
        {query && searchResults && searchResults.total === 0 && (
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">No results found for &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Try different keywords or browse the constitution directly.</p>
          </div>
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
                  <li>- Section titles and content</li>
                  <li>- Constitutional rights and freedoms</li>
                  <li>- Government institutions and powers</li>
                  <li>- Legal terms and concepts</li>
                  <li>- Section numbers (e.g. &ldquo;7&rdquo;)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Search examples:
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>- &ldquo;freedom of expression&rdquo;</li>
                  <li>- &ldquo;Governor powers&rdquo;</li>
                  <li>- &ldquo;fair trial&rdquo;</li>
                  <li>- &ldquo;Grand Court&rdquo;</li>
                  <li>- &ldquo;Cabinet&rdquo;</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
