import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  author: string;
  readingTime: number; // minutes
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(blogsDirectory)) return [];
  return fs
    .readdirSync(blogsDirectory)
    .filter((name) => name.endsWith('.md') && name !== 'template.md')
    .map((name) => name.replace(/\.md$/, ''));
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 230));
}

export function getAllPosts(): BlogPostMeta[] {
  const slugs = getAllPostSlugs();
  const posts = slugs.map((slug) => {
    const fullPath = path.join(blogsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug: (data.slug as string) || slug,
      title: (data.title as string) || slug,
      description: (data.description as string) || '',
      date: (data.date as string) || '',
      tags: (data.tags as string[]) || [],
      author: (data.author as string) || 'Constitution.ky Team',
      readingTime: estimateReadingTime(content),
    };
  });
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getRelatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const allPosts = getAllPosts();
  const current = allPosts.find((p) => p.slug === slug);
  if (!current) return [];

  return allPosts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      ...p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getAdjacentPosts(slug: string): { prev: BlogPostMeta | null; next: BlogPostMeta | null } {
  const posts = getAllPosts(); // sorted newest first
  const idx = posts.findIndex((p) => p.slug === slug);
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null, // older post
    next: idx > 0 ? posts[idx - 1] : null, // newer post
  };
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug: (data.slug as string) || slug,
      title: (data.title as string) || slug,
      description: (data.description as string) || '',
      date: (data.date as string) || '',
      tags: (data.tags as string[]) || [],
      author: (data.author as string) || 'Constitution.ky Team',
      readingTime: estimateReadingTime(content),
      content,
    };
  } catch {
    return null;
  }
}
