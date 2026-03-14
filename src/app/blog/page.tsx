import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — Constitution.ky',
  description:
    'Insights and analysis on the Cayman Islands Constitution, constitutional law, and governance.',
  openGraph: {
    title: 'Blog — Constitution.ky',
    description:
      'Insights and analysis on the Cayman Islands Constitution, constitutional law, and governance.',
    url: 'https://constitution.ky/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://constitution.ky/blog',
  },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const allPosts = getAllPosts();

  const posts = tag
    ? allPosts.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      )
    : allPosts;

  // Collect all unique tags for the filter bar
  const allTags = Array.from(
    new Set(allPosts.flatMap((p) => p.tags))
  ).sort();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
          Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Insights and analysis on the Cayman Islands Constitution, constitutional
          law, and governance.
        </p>
      </header>

      {/* Active filter indicator — only shown when filtering by tag */}
      {tag && (
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged
          </span>
          <span className="text-xs font-medium bg-primary-DEFAULT text-white px-2.5 py-0.5 rounded-full">
            {tag}
          </span>
          <Link
            href="/blog"
            className="text-primary-DEFAULT dark:text-primary-400 hover:underline"
          >
            Clear
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {tag ? `No articles found with tag "${tag}".` : 'No articles published yet.'}
        </p>
      ) : (
        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-gray-200 dark:border-gray-700 pb-10 last:border-0">
              <article>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/blog?tag=${encodeURIComponent(t)}`}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
                        tag?.toLowerCase() === t.toLowerCase()
                          ? 'bg-primary-DEFAULT text-white'
                          : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/50'
                      }`}
                    >
                      {t}
                    </Link>
                  ))}
                </div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {post.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                  <span>{post.author}</span>
                  <span aria-hidden="true">&middot;</span>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
