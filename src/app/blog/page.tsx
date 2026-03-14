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

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
          Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Insights and analysis on the Cayman Islands Constitution, constitutional
          law, and governance.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No articles published yet.</p>
      ) : (
        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-gray-200 dark:border-gray-700 pb-10 last:border-0">
              <article>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
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
                  <span aria-hidden="true">·</span>
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
