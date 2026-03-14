// Server Component (default)
import { getChapterArticles, getChapters } from '@/lib/constitution';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { toRomanNumeral } from '@/lib/utils';
import ChapterContent from './ChapterContent';
import { Chapter, Article } from '@/types/constitution';

export async function generateStaticParams() {
  const chapters = await getChapters();
  return chapters.map((chapter: Chapter) => ({
    chapterNumber: chapter.number.toString(),
  }));
}

async function getChapter(chapterNum: number): Promise<Chapter> {
  const chapters = await getChapters();
  const chapter = chapters.find(
    (c: Chapter) => c.number === chapterNum
  );
  if (!chapter) {
    notFound();
  }
  return chapter;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapterNumber: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const chapterNum = parseInt(resolvedParams.chapterNumber, 10);
  const chapter = await getChapter(chapterNum);

  const chapterUrl = `/constitution/chapter/${chapterNum}`;

  const articles = await getChapterArticles(chapterNum);
  const articleList = articles.map((a) => `Section ${a.number}: ${a.title}`).slice(0, 8).join(', ');
  const description = `Part ${toRomanNumeral(chapterNum)} — ${chapter.title} of the Cayman Islands Constitution. Contains ${articles.length} sections including ${articleList}.`;

  return {
    title: `Part ${toRomanNumeral(chapterNum)} - ${chapter.title} | Cayman Islands Constitution`,
    description,
    alternates: {
      canonical: `https://constitution.ky${chapterUrl}`,
    },
    openGraph: {
      title: `Part ${toRomanNumeral(chapterNum)}: ${chapter.title} — Cayman Islands Constitution`,
      description,
      url: `https://constitution.ky${chapterUrl}`,
    },
    twitter: {
      card: 'summary',
      title: `Part ${toRomanNumeral(chapterNum)}: ${chapter.title}`,
      description,
    },
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ chapterNumber: string }> }) {
  const resolvedParams = await params;
  const chapterNum = parseInt(resolvedParams.chapterNumber, 10);
  const chapter = await getChapter(chapterNum);
  const articles = await getChapterArticles(chapterNum);

  const chapterUrl = `https://constitution.ky/constitution/chapter/${chapterNum}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Legislation',
        name: `Part ${toRomanNumeral(chapterNum)} - ${chapter.title}`,
        legislationType: 'Constitution',
        isPartOf: {
          '@type': 'Legislation',
          name: 'Constitution of the Cayman Islands Order 2009',
          legislationDate: '2009-06-10',
        },
        hasPart: articles.map((a) => ({
          '@type': 'Legislation',
          name: `Section ${a.number} - ${a.title}`,
          url: `${chapterUrl}/article/${a.number}`,
        })),
        url: chapterUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://constitution.ky' },
          { '@type': 'ListItem', position: 2, name: 'Constitution', item: 'https://constitution.ky/constitution' },
          { '@type': 'ListItem', position: 3, name: `Part ${toRomanNumeral(chapterNum)} - ${chapter.title}`, item: chapterUrl },
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
      <ChapterContent
        chapter={chapter}
        articles={articles as any[]}
        chapterNum={chapterNum}
      />
    </>
  );
}
