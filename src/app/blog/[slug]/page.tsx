import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPostSlugs, getPostBySlug, getAdjacentPosts, getRelatedPosts } from '@/lib/blog';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import BlogArticleClient from './BlogArticleClient';

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

/** Extract ## and ### headings from markdown for table of contents */
function extractHeadings(markdown: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+?)(?:\s*\{#([\w-]+)\})?$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].replace(/\{#[\w-]+\}/, '').trim();
      // Strip markdown formatting from text
      const text = rawText.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`(.+?)`/g, '$1');
      // Use explicit id or generate from text
      const id = match[3] || text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      headings.push({ id, text, level });
    }
  }

  return headings;
}

/** Add id attributes to headings in rendered HTML */
function addHeadingIds(html: string, headings: { id: string; text: string; level: number }[]): string {
  let result = html;
  for (const heading of headings) {
    const tag = `h${heading.level}`;
    // Match the heading tag and add id if not present
    const regex = new RegExp(`<${tag}>([^<]*${heading.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^<]*)</${tag}>`, 'i');
    result = result.replace(regex, `<${tag} id="${heading.id}">$1</${tag}>`);
  }
  return result;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const rawHtml = await markdownToHtml(post.content);
  const headings = extractHeadings(post.content);
  const contentHtml = addHeadingIds(rawHtml, headings);
  const { prev, next } = getAdjacentPosts(slug);
  const related = getRelatedPosts(slug, 3);
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
    wordCount: post.content.trim().split(/\s+/).length,
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
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400 border-t border-b border-gray-200 dark:border-gray-700 py-4">
              <span className="font-medium text-gray-700 dark:text-gray-300">{post.author}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </header>

          {/* Table of Contents */}
          {headings.length > 2 && (
            <nav
              className="mb-10 p-5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700"
              aria-label="Table of contents"
            >
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
                Contents
              </h2>
              <ul className="space-y-1.5">
                {headings.map((h) => (
                  <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
                    <a
                      href={`#${h.id}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors leading-relaxed"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-dark max-w-none
              prose-headings:font-serif prose-headings:scroll-mt-20
              prose-a:text-primary-DEFAULT dark:prose-a:text-primary-400
              prose-blockquote:border-primary-DEFAULT dark:prose-blockquote:border-primary-400
              prose-img:rounded-xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Share + Copy Link */}
          <BlogArticleClient url={url} title={post.title} />
        </article>

        {/* Prev / Next Navigation */}
        {(prev || next) && (
          <nav
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4"
            aria-label="Post navigation"
          >
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group flex flex-col p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 group-hover:text-primary-DEFAULT dark:group-hover:text-primary-400">
                  &larr; Older
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-DEFAULT dark:group-hover:text-primary-400">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex flex-col items-end text-right p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 group-hover:text-primary-DEFAULT dark:group-hover:text-primary-400">
                  Newer &rarr;
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-DEFAULT dark:group-hover:text-primary-400">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex flex-wrap gap-1 mb-2">
                    {r.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-DEFAULT dark:group-hover:text-primary-400 transition-colors mb-1">
                    {r.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {r.readingTime} min read
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
