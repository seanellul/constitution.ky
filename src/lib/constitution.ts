import fs from 'fs';
import path from 'path';
import { Article, Chapter, Constitution } from '@/types/constitution';
import { cache } from './cache';

const articlesDirectory = path.join(process.cwd(), 'articles');

/**
 * Get all chapters of the constitution
 */
export async function getConstitutionStructure(): Promise<Constitution> {
  // Try to get from cache first
  const cached = await cache.getConstitutionStructure();
  if (cached) {
    return cached;
  }

  const schemaPath = path.join(articlesDirectory, 'constitution_toc.json');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const schema = JSON.parse(schemaContent);
  
  const constitution: Constitution = {
    title: "Constitution of the Cayman Islands",
    chapters: []
  };

  // Extract chapter information from the schema
  // Support both the old format and the new format
  const parts = schema.parts || schema["Constitution of the Cayman Islands"];
  if (Array.isArray(parts)) {
    // New format: parts array
    for (const part of parts) {
      constitution.chapters.push({
        number: part.number,
        title: part.title,
        articles: []
      });
    }
  } else if (parts && typeof parts === 'object') {
    // Old format: object with chapter titles as keys
    Object.entries(parts).forEach(([chapterTitle, articles]: [string, any]) => {
      const chapterNumberMatch = chapterTitle.match(/(?:Chapter|Part) ([IVXLCDM]+) - (.+)/);
      if (chapterNumberMatch) {
        const romanNumber = chapterNumberMatch[1];
        const title = chapterNumberMatch[2];
        const chapterNumber = romanToArabic(romanNumber);
        constitution.chapters.push({
          number: chapterNumber,
          title,
          articles: []
        });
      }
    });
  }
  
  // Cache the result
  cache.setConstitutionStructure(constitution);
  
  return constitution;
}

/**
 * Get all articles from a specific chapter
 */
export async function getChapterArticles(chapterNumber: number): Promise<Article[]> {
  // Try to get from cache first
  const cached = await cache.getChapterArticles(chapterNumber);
  if (cached) {
    return cached;
  }

  const chapterDir = path.join(articlesDirectory, `chapter_${chapterNumber}`);
  
  if (!fs.existsSync(chapterDir)) {
    return [];
  }
  
  const articleFiles = fs.readdirSync(chapterDir);
  const articles: Article[] = [];
  
  for (const file of articleFiles) {
    if (file.endsWith('.json')) {
      const filePath = path.join(chapterDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      try {
        const article = JSON.parse(fileContent) as Article;
        articles.push(article);
      } catch (error: any) {
        console.error(`Error parsing JSON in file: ${filePath}`);
        console.error(`Error details: ${error.message}`);
        // Throw a more informative error
        throw new Error(`Failed to parse JSON in file ${filePath}: ${error.message}`);
      }
    }
  }
  
  // Sort articles by number
  articles.sort((a, b) => a.number - b.number);
  
  // Cache the result
  cache.setChapterArticles(chapterNumber, articles);
  
  return articles;
}

/**
 * Get a specific article by chapter and article number
 */
export async function getArticle(chapterNumber: number, articleNumber: number): Promise<Article | null> {
  const chapterDir = path.join(articlesDirectory, `chapter_${chapterNumber}`);
  
  if (!fs.existsSync(chapterDir)) {
    return null;
  }
  
  const articlePath = path.join(chapterDir, `article_${articleNumber}.json`);
  
  if (!fs.existsSync(articlePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(articlePath, 'utf8');
  const article = JSON.parse(fileContent) as Article;
  
  return article;
}

/**
 * Search articles by query
 */
export async function searchArticles(query: string): Promise<Article[]> {
  const results: Article[] = [];
  const chapters = await getChapters();
  
  for (const chapter of chapters) {
    const articles = await getChapterArticles(chapter.number);
    
    const matchedArticles = articles.filter(article => {
      // Search in title
      if (article.title.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
      
      // Search in content
      if (article.content) {
        if (Array.isArray(article.content)) {
          for (const paragraph of article.content) {
            if (typeof paragraph === 'string' && paragraph.toLowerCase().includes(query.toLowerCase())) {
              return true;
            } else if (typeof paragraph === 'object' && paragraph.text && paragraph.text.toLowerCase().includes(query.toLowerCase())) {
              return true;
            }
          }
        }
      }
      
      // Search in sections
      if (article.sections) {
        for (const section of article.sections) {
          for (const content of section.content) {
            if (content.toLowerCase().includes(query.toLowerCase())) {
              return true;
            }
          }
          
          for (const subsection of section.subsections) {
            for (const content of subsection.content) {
              if (content.toLowerCase().includes(query.toLowerCase())) {
                return true;
              }
            }
          }
        }
      }
      
      return false;
    });
    
    results.push(...matchedArticles);
  }
  
  return results;
}

/**
 * Get all chapters
 */
export async function getChapters(): Promise<Chapter[]> {
  const constitution = await getConstitutionStructure();
  const chapters = constitution.chapters;
  
  // Populate article counts for each chapter
  for (const chapter of chapters) {
    const articles = await getChapterArticles(chapter.number);
    chapter.articles = articles;
  }
  
  return chapters;
}

/**
 * Convert Roman numerals to Arabic numbers
 */
function romanToArabic(roman: string): number {
  const romanNumerals: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
  };
  
  let result = 0;
  
  for (let i = 0; i < roman.length; i++) {
    const current = romanNumerals[roman[i]];
    const next = romanNumerals[roman[i + 1]];
    
    if (next && current < next) {
      result += next - current;
      i++;
    } else {
      result += current;
    }
  }
  
  return result;
} 