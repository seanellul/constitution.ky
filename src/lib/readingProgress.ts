/**
 * Reading progress tracker using localStorage.
 * Tracks which articles have been read by the user.
 */

const STORAGE_KEY = 'constitution-ky-read-articles';

export interface ReadArticle {
  chapterNumber: number;
  articleNumber: number;
  readAt: number; // timestamp
}

function getReadArticles(): ReadArticle[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveReadArticles(articles: ReadArticle[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {
    // localStorage full or unavailable
  }
}

export function markAsRead(chapterNumber: number, articleNumber: number) {
  const articles = getReadArticles();
  const exists = articles.some(
    (a) => a.chapterNumber === chapterNumber && a.articleNumber === articleNumber
  );
  if (!exists) {
    articles.push({ chapterNumber, articleNumber, readAt: Date.now() });
    saveReadArticles(articles);
  }
}

export function isArticleRead(chapterNumber: number, articleNumber: number): boolean {
  return getReadArticles().some(
    (a) => a.chapterNumber === chapterNumber && a.articleNumber === articleNumber
  );
}

export function getChapterProgress(chapterNumber: number, totalArticles: number): number {
  if (totalArticles === 0) return 0;
  const readCount = getReadArticles().filter(
    (a) => a.chapterNumber === chapterNumber
  ).length;
  return Math.min(readCount / totalArticles, 1);
}

export function getReadCountForChapter(chapterNumber: number): number {
  return getReadArticles().filter((a) => a.chapterNumber === chapterNumber).length;
}

export function getTotalReadCount(): number {
  return getReadArticles().length;
}
