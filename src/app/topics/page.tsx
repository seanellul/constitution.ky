import Link from 'next/link';
import { Metadata } from 'next';
import { topics } from '@/data/topics';
import PageEntrance from '@/components/PageEntrance';

export const metadata: Metadata = {
  title: 'Constitutional Topics | Cayman Islands Constitution',
  description: 'Explore the Cayman Islands Constitution by topic. Browse human rights, government structure, judiciary, elections, public finance, and more.',
  alternates: { canonical: 'https://constitution.ky/topics' },
};

export default function TopicsIndex() {
  return (
    <PageEntrance>
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
        Constitutional Topics
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Explore the Cayman Islands Constitution organized by topic. Each topic brings together
        the most relevant sections from across the Constitution.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="group block bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-primary-DEFAULT dark:hover:border-primary-400 hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-DEFAULT dark:group-hover:text-primary-400 transition-colors mb-2">
              {topic.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {topic.description}
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
              {topic.articles.length} sections
            </span>
          </Link>
        ))}
      </div>
    </div>
    </PageEntrance>
  );
}
