import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.title} | Constitution.ky Blog`,
    description: post.description,
    alternates: { canonical: `https://constitution.ky/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://constitution.ky/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://constitution.ky',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Constitution.ky',
      url: 'https://constitution.ky',
    },
    url: `https://constitution.ky/blog/${slug}`,
    keywords: post.tags.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://constitution.ky/blog/${slug}`,
    },
  };

  const formattedDate = new Date(post.date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/blog" className="hover:text-primary-DEFAULT">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">{post.title}</span>
        </nav>

        <article>
          {/* Header */}
          <header className="mb-8">
            <time className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</time>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mt-2 mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">{post.description}</p>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Table of Contents */}
          {post.headings.length > 2 && (
            <nav className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                Table of Contents
              </h2>
              <ul className="space-y-1.5">
                {post.headings.map((heading) => (
                  <li
                    key={heading.id}
                    className={heading.level === 3 ? 'ml-4' : ''}
                  >
                    <a
                      href={`#${heading.id}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-headings:scroll-mt-20 prose-a:text-primary-DEFAULT dark:prose-a:text-primary-400 prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Back to blog */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/blog"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors"
          >
            &larr; Back to all articles
          </Link>
        </div>
      </div>
    </>
  );
}
