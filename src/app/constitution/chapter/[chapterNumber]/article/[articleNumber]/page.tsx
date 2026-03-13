// Server Component (default)
import { getArticle, getChapterArticles, getChapters } from '@/lib/constitution';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';
import { toRomanNumeral } from '@/lib/utils';
import { Article } from '@/types/constitution';

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

  return {
    title: `Section ${articleNum} - ${article.title} | Constitution of the Cayman Islands`,
    description: `Read Section ${articleNum} from Part ${toRomanNumeral(chapterNum)} of the Constitution of the Cayman Islands`,
    alternates: {
      canonical: `https://constitution.ky${articleUrl}`,
    },
    openGraph: {
      title: `Section ${articleNum} - ${article.title} | Constitution of the Cayman Islands`,
      description: `Read Section ${articleNum} from Part ${toRomanNumeral(chapterNum)} of the Constitution of the Cayman Islands`,
      url: `https://constitution.ky${articleUrl}`,
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ chapterNumber: string; articleNumber: string }> }) {
  const resolvedParams = await params;
  const chapterNum = parseInt(resolvedParams.chapterNumber, 10);
  const articleNum = parseInt(resolvedParams.articleNumber, 10);
  const article = await getArticle(chapterNum, articleNum);

  if (!article) {
    notFound();
  }

  return (
    <ArticleContent article={article} chapterNum={chapterNum} articleNum={articleNum} />
  );
}
