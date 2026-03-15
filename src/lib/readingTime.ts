import { Article, Paragraph } from '@/types/constitution';

const WORDS_PER_MINUTE = 200; // legal text reading speed

export function estimateReadingTime(article: Article): number {
  let wordCount = 0;

  if (article.content && Array.isArray(article.content)) {
    for (const item of article.content) {
      const text = typeof item === 'string' ? item : (item as Paragraph).text;
      wordCount += text.split(/\s+/).filter(Boolean).length;
    }
  }

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
