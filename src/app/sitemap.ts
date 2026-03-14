import { MetadataRoute } from 'next';
import { getChapters } from '@/lib/constitution';
import { topics } from '@/data/topics';
import { glossary } from '@/data/glossary';

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
    { path: '/open-data', changeFrequency: 'daily' as const, priority: 0.6 },
    { path: '/topics', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/glossary', changeFrequency: 'monthly' as const, priority: 0.8 },
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

  // Topic pages
  for (const topic of topics) {
    entries.push({
      url: `${domain}/topics/${topic.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // Glossary pages
  for (const term of glossary) {
    entries.push({
      url: `${domain}/glossary/${term.slug}`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    });
  }

  return entries;
}
