import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | Constitution.ky',
  description: 'Articles and insights about the Cayman Islands Constitution, civic education, constitutional history, and governance.',
  alternates: { canonical: 'https://constitution.ky/blog' },
  openGraph: {
    title: 'Blog — Constitution.ky',
    description: 'Articles about the Cayman Islands Constitution, civic education, and governance.',
    url: 'https://constitution.ky/blog',
  },
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
        Blog
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Articles and insights about the Cayman Islands Constitution, civic education, and governance.
      </p>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">No articles yet. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-DEFAULT/50 hover:shadow-md transition-all"
              >
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-DEFAULT dark:group-hover:text-primary-400 transition-colors mt-1 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {post.description}
                </p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
