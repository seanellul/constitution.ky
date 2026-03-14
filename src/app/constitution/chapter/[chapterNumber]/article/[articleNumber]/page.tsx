// Server Component (default)
import { getArticle, getChapterArticles, getChapters } from '@/lib/constitution';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';
import { toRomanNumeral } from '@/lib/utils';
import { Article } from '@/types/constitution';
import { topics } from '@/data/topics';

export async function generateStaticParams() {
  const chapters = await getChapters();
  const params = [];

  for (const chapter of chapters) {
    const articles = await getChapterArticles(chapter.number);
    for (const article of articles) {
      params.push({
        chapterNumber: chapter.number.toString(),
        articleNumber: article.number.toString(),
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapterNumber: string; articleNumber: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const chapterNum = parseInt(resolvedParams.chapterNumber, 10);
  const articleNum = parseInt(resolvedParams.articleNumber, 10);
  const article = await getArticle(chapterNum, articleNum);

  if (!article) {
    return {
      title: 'Section Not Found | Constitution of the Cayman Islands',
      description: 'The requested section could not be found in the Constitution of the Cayman Islands',
    };
  }

  const articleUrl = `/constitution/chapter/${chapterNum}/article/${articleNum}`;

  // Build a rich description from article content
  let contentPreview = '';
  if (article.content && Array.isArray(article.content) && article.content.length > 0) {
    const firstParagraph = article.content[0];
    const text = typeof firstParagraph === 'string' ? firstParagraph : firstParagraph.text;
    contentPreview = text.substring(0, 155).replace(/\s+/g, ' ').trim();
    if (text.length > 155) contentPreview += '...';
  }

  const description = contentPreview
    ? `Section ${articleNum} of the Cayman Islands Constitution: ${contentPreview}`
    : `Read Section ${articleNum} - ${article.title} from Part ${toRomanNumeral(chapterNum)} (${article.chapterTitle}) of the Constitution of the Cayman Islands Order 2009.`;

  return {
    title: `Section ${articleNum} - ${article.title} | Cayman Islands Constitution`,
    description,
    alternates: {
      canonical: `https://constitution.ky${articleUrl}`,
    },
    openGraph: {
      title: `Section ${articleNum}: ${article.title} — Cayman Islands Constitution`,
      description,
      url: `https://constitution.ky${articleUrl}`,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `Section ${articleNum}: ${article.title}`,
      description,
    },
  };
}

export interface ArticleNavLink {
  chapterNumber: number;
  articleNumber: number;
  title: string;
}

export default async function ArticlePage({ params }: { params: Promise<{ chapterNumber: string; articleNumber: string }> }) {
  const resolvedParams = await params;
  const chapterNum = parseInt(resolvedParams.chapterNumber, 10);
  const articleNum = parseInt(resolvedParams.articleNumber, 10);
  const article = await getArticle(chapterNum, articleNum);

  if (!article) {
    notFound();
  }

  // Compute prev/next article navigation
  const chapters = await getChapters();
  const currentChapterArticles = await getChapterArticles(chapterNum);
  const currentIndex = currentChapterArticles.findIndex(a => a.number === articleNum);

  let prevArticle: ArticleNavLink | null = null;
  let nextArticle: ArticleNavLink | null = null;

  if (currentIndex > 0) {
    // Previous article is in the same chapter
    const prev = currentChapterArticles[currentIndex - 1];
    prevArticle = { chapterNumber: chapterNum, articleNumber: prev.number, title: prev.title };
  } else {
    // Previous article is the last article of the previous chapter
    const prevChapterNum = chapterNum - 1;
    if (prevChapterNum >= 1) {
      const prevChapterArticles = await getChapterArticles(prevChapterNum);
      if (prevChapterArticles.length > 0) {
        const prev = prevChapterArticles[prevChapterArticles.length - 1];
        prevArticle = { chapterNumber: prevChapterNum, articleNumber: prev.number, title: prev.title };
      }
    }
  }

  if (currentIndex < currentChapterArticles.length - 1) {
    // Next article is in the same chapter
    const next = currentChapterArticles[currentIndex + 1];
    nextArticle = { chapterNumber: chapterNum, articleNumber: next.number, title: next.title };
  } else {
    // Next article is the first article of the next chapter
    const nextChapterNum = chapterNum + 1;
    const maxChapter = Math.max(...chapters.map(c => c.number));
    if (nextChapterNum <= maxChapter) {
      const nextChapterArticles = await getChapterArticles(nextChapterNum);
      if (nextChapterArticles.length > 0) {
        const next = nextChapterArticles[0];
        nextArticle = { chapterNumber: nextChapterNum, articleNumber: next.number, title: next.title };
      }
    }
  }

  // Build chapter article list for sidebar
  const chapterArticleList = currentChapterArticles.map((a) => ({
    number: a.number,
    title: a.title,
  }));

  // Find related topics for this article
  const relatedTopics = topics
    .filter((t) =>
      t.articles.some(
        (a) => a.chapterNumber === chapterNum && a.articleNumber === articleNum
      )
    )
    .map((t) => ({ slug: t.slug, title: t.title }));

  // Structured data: Legislation + BreadcrumbList
  const articleUrl = `https://constitution.ky/constitution/chapter/${chapterNum}/article/${articleNum}`;
  let articleText = '';
  if (article.content && Array.isArray(article.content)) {
    articleText = article.content
      .map((p) => (typeof p === 'string' ? p : p.text))
      .join(' ')
      .substring(0, 500);
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Legislation',
        '@id': articleUrl,
        name: `Section ${articleNum} - ${article.title}`,
        description: articleText,
        legislationIdentifier: `Section ${articleNum}`,
        legislationType: 'Constitution',
        inLanguage: 'en',
        isPartOf: {
          '@type': 'Legislation',
          name: 'Constitution of the Cayman Islands Order 2009',
          legislationDate: '2009-06-10',
          legislationJurisdiction: {
            '@type': 'Country',
            name: 'Cayman Islands',
          },
        },
        url: articleUrl,
        ...(article.amendmentHistory?.date && {
          legislationChanges: {
            '@type': 'Legislation',
            name: article.amendmentHistory.description,
            legislationDate: article.amendmentHistory.date,
            legislationIdentifier: article.amendmentHistory.legalReference,
          },
        }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://constitution.ky',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Constitution',
            item: 'https://constitution.ky/constitution',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `Part ${toRomanNumeral(chapterNum)} - ${article.chapterTitle}`,
            item: `https://constitution.ky/constitution/chapter/${chapterNum}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: `Section ${articleNum} - ${article.title}`,
            item: articleUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ArticleContent
        article={article}
        chapterNum={chapterNum}
        articleNum={articleNum}
        prevArticle={prevArticle}
        nextArticle={nextArticle}
        chapterArticles={chapterArticleList}
        chapterTitle={article.chapterTitle}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
