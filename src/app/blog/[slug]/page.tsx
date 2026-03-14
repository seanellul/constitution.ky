import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `https://constitution.ky/blog/${post.slug}`;
  return {
    title: `${post.title} — Constitution.ky`,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(markdown);
  return result.toString();
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const contentHtml = await markdownToHtml(post.content);
  const url = `https://constitution.ky/blog/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Constitution.ky',
      url: 'https://constitution.ky',
    },
    datePublished: post.date,
    dateModified: post.date,
    url,
    keywords: post.tags.join(', '),
    inLanguage: 'en',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary-DEFAULT dark:hover:text-primary-400">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-primary-DEFAULT dark:hover:text-primary-400">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-700 dark:text-gray-300 truncate max-w-xs">{post.title}</li>
          </ol>
        </nav>

        <article>
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {post.description}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-500 border-t border-b border-gray-200 dark:border-gray-700 py-4">
              <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-dark max-w-none
              prose-headings:font-serif
              prose-a:text-primary-DEFAULT dark:prose-a:text-primary-400
              prose-blockquote:border-primary-DEFAULT dark:prose-blockquote:border-primary-400"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-DEFAULT dark:text-primary-400 hover:underline font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    </>
  );
}
