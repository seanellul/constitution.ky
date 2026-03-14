import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { topics } from '@/data/topics';
import { getArticle } from '@/lib/constitution';
import { toRomanNumeral } from '@/lib/utils';

export async function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) return { title: 'Topic Not Found' };

  return {
    title: `${topic.title} | Cayman Islands Constitution`,
    description: topic.description,
    alternates: { canonical: `https://constitution.ky/topics/${slug}` },
    openGraph: {
      title: `${topic.title} — Cayman Islands Constitution`,
      description: topic.description,
      url: `https://constitution.ky/topics/${slug}`,
    },
    keywords: topic.keywords,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) notFound();

  // Load article data
  const articleData = await Promise.all(
    topic.articles.map(async (ref) => {
      const article = await getArticle(ref.chapterNumber, ref.articleNumber);
      if (!article) return null;
      let preview = '';
      if (article.content && Array.isArray(article.content) && article.content.length > 0) {
        const first = article.content[0];
        const text = typeof first === 'string' ? first : first.text;
        preview = text.substring(0, 150);
        if (text.length > 150) preview += '...';
      }
      return { ...ref, title: article.title, preview };
    })
  );

  const articles = articleData.filter(Boolean);

  // Related topics (share at least one article)
  const relatedTopics = topics
    .filter((t) => t.slug !== slug)
    .filter((t) =>
      t.articles.some((a) =>
        topic.articles.some(
          (b) => a.chapterNumber === b.chapterNumber && a.articleNumber === b.articleNumber
        )
      )
    )
    .slice(0, 5);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: topic.title,
    description: topic.description,
    url: `https://constitution.ky/topics/${slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Constitution.ky',
      url: 'https://constitution.ky',
    },
    hasPart: articles.map((a) => ({
      '@type': 'Legislation',
      name: `Section ${a!.articleNumber} - ${a!.title}`,
      url: `https://constitution.ky/constitution/chapter/${a!.chapterNumber}/article/${a!.articleNumber}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/topics" className="hover:text-primary-DEFAULT">Topics</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">{topic.title}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
          {topic.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {topic.description}
        </p>

        <div className="space-y-3">
          {articles.map((article) => (
            <Link
              key={`${article!.chapterNumber}-${article!.articleNumber}`}
              href={`/constitution/chapter/${article!.chapterNumber}/article/${article!.articleNumber}`}
              className="group block bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-primary-DEFAULT/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-DEFAULT dark:group-hover:text-primary-400 transition-colors">
                    Section {article!.articleNumber}: {article!.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {article!.preview}
                  </p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1">
                  Part {toRomanNumeral(article!.chapterNumber)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {relatedTopics.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Related Topics</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTopics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/topics/${t.slug}`}
                  className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-DEFAULT/10 hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors"
                >
                  {t.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
