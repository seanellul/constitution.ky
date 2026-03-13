import { MetadataRoute } from 'next';
import { getChapters } from '@/lib/constitution';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const chapters = await getChapters();
  const now = new Date().toISOString();
  const domain = 'https://constitution.ky';

  const entries: MetadataRoute.Sitemap = [];

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
