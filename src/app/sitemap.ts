import { MetadataRoute } from 'next';
import { getChapters } from '@/lib/constitution';
import { getAllPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const chapters = await getChapters();
  const now = new Date().toISOString();
  const domain = 'https://constitution.ky';

  const entries: MetadataRoute.Sitemap = [];

  // Blog posts
  const blogPosts = getAllPosts();
  entries.push({
    url: `${domain}/blog`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  });
  for (const post of blogPosts) {
    entries.push({
      url: `${domain}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date).toISOString() : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Static pages
  const staticPages = [
    { path: '/', changeFrequency: 'monthly' as const, priority: 1.0 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/search', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/constitution', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/analytics', changeFrequency: 'daily' as const, priority: 0.5 },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${domain}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // Chapter and article pages
  for (const chapter of chapters) {
    entries.push({
      url: `${domain}/constitution/chapter/${chapter.number}`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.8,
    });

    if (chapter.articles) {
      for (const article of chapter.articles) {
        entries.push({
          url: `${domain}/constitution/chapter/${chapter.number}/article/${article.number}`,
          lastModified: now,
          changeFrequency: 'yearly',
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}
