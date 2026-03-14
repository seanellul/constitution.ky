import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  author: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  headings: { id: string; text: string; level: number }[];
}

function extractHeadings(htmlContent: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi;
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    headings.push({ id, text, level: parseInt(match[1], 10) });
  }
  return headings;
}

function addHeadingIds(htmlContent: string): string {
  return htmlContent.replace(/<h([2-3])([^>]*)>(.*?)<\/h([2-3])>/gi, (_match, level, attrs, text, _closeLevel) => {
    const plainText = text.replace(/<[^>]*>/g, '').trim();
    const id = plainText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
  });
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  if (!fs.existsSync(blogDirectory)) return [];

  const files = fs.readdirSync(blogDirectory).filter((f) => f.endsWith('.md') && f !== 'template.md');
  const posts: BlogPostMeta[] = [];

  for (const file of files) {
    const filePath = path.join(blogDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

    if (!data.title || !data.slug || !data.date) continue;

    posts.push({
      title: data.title,
      description: data.description || '',
      date: data.date,
      tags: data.tags || [],
      slug: data.slug,
      author: data.author || 'Constitution.ky',
    });
  }

  // Sort by date, newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!fs.existsSync(blogDirectory)) return null;

  const files = fs.readdirSync(blogDirectory).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(blogDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    if (data.slug !== slug) continue;

    const result = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);
    let htmlContent = result.toString();
    const headings = extractHeadings(htmlContent);
    htmlContent = addHeadingIds(htmlContent);

    return {
      title: data.title,
      description: data.description || '',
      date: data.date,
      tags: data.tags || [],
      slug: data.slug,
      author: data.author || 'Constitution.ky',
      content: htmlContent,
      headings,
    };
  }

  return null;
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
