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

  return {
    title: `Part ${toRomanNumeral(chapterNum)} - ${chapter.title} | Constitution of the Cayman Islands`,
    description: `Browse sections in Part ${toRomanNumeral(chapterNum)} - ${chapter.title} of the Constitution of the Cayman Islands`,
    alternates: {
      canonical: `https://constitution.ky${chapterUrl}`,
    },
    openGraph: {
      title: `Part ${toRomanNumeral(chapterNum)} - ${chapter.title} | Constitution of the Cayman Islands`,
      description: `Browse sections in Part ${toRomanNumeral(chapterNum)} - ${chapter.title} of the Constitution of the Cayman Islands`,
      url: `https://constitution.ky${chapterUrl}`,
    },
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ chapterNumber: string }> }) {
  const resolvedParams = await params;
  const chapterNum = parseInt(resolvedParams.chapterNumber, 10);
  const chapter = await getChapter(chapterNum);
  const articles = await getChapterArticles(chapterNum);

  return <ChapterContent
    chapter={chapter}
    articles={articles as any[]}
    chapterNum={chapterNum}
  />;
}
