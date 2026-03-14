import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { glossary } from '@/data/glossary';
import { getArticle } from '@/lib/constitution';
import { toRomanNumeral } from '@/lib/utils';

export async function generateStaticParams() {
  return glossary.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = glossary.find((t) => t.slug === slug);
  if (!term) return { title: 'Term Not Found' };

  return {
    title: `${term.term} — Cayman Islands Constitutional Term | Constitution.ky`,
    description: term.definition,
    alternates: { canonical: `https://constitution.ky/glossary/${slug}` },
    openGraph: {
      title: `${term.term} — Cayman Islands Constitution Glossary`,
      description: term.definition,
      url: `https://constitution.ky/glossary/${slug}`,
    },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = glossary.find((t) => t.slug === slug);
  if (!term) notFound();

  // Load referenced articles
  const articleData = await Promise.all(
    term.articleRefs.map(async (ref) => {
      const article = await getArticle(ref.chapterNumber, ref.articleNumber);
      return article ? { ...ref, title: article.title } : null;
    })
  );
  const articles = articleData.filter(Boolean);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.definition,
    url: `https://constitution.ky/glossary/${slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Cayman Islands Constitutional Glossary',
      url: 'https://constitution.ky/glossary',
    },
  };

  // Find related terms (share at least one article reference)
  const relatedTerms = glossary
    .filter((t) => t.slug !== slug)
    .filter((t) =>
      t.articleRefs.some((a) =>
        term.articleRefs.some(
          (b) => a.chapterNumber === b.chapterNumber && a.articleNumber === b.articleNumber
        )
      )
    )
    .slice(0, 8);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/glossary" className="hover:text-primary-DEFAULT">Glossary</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">{term.term}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
          {term.term}
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {term.definition}
          </p>
        </div>

        {articles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Referenced In
            </h2>
            <div className="space-y-2">
              {articles.map((article) => (
                <Link
                  key={`${article!.chapterNumber}-${article!.articleNumber}`}
                  href={`/constitution/chapter/${article!.chapterNumber}/article/${article!.articleNumber}`}
                  className="group flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 hover:border-primary-DEFAULT/50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary-DEFAULT dark:group-hover:text-primary-400 transition-colors">
                    Section {article!.articleNumber}: {article!.title}
                  </span>
                  <span className="text-xs text-gray-400">Part {toRomanNumeral(article!.chapterNumber)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {relatedTerms.length > 0 && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Related Terms</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTerms.map((t) => (
                <Link
                  key={t.slug}
                  href={`/glossary/${t.slug}`}
                  className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-DEFAULT/10 hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors"
                >
                  {t.term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
