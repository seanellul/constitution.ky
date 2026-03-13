import { cache } from '../cache';
import { Article } from '@/types/constitution';

// Mock article data for testing
const mockArticle: Article = {
  number: 1,
  title: 'Test Article',
  chapterNumber: 1,
  chapterTitle: 'Test Chapter',
  content: ['Test content'],
  amendmentHistory: null,
};

const mockArticles: Article[] = [mockArticle];

describe('Cache System', () => {
  beforeEach(() => {
    // Clear cache before each test
    cache.clearAll();
  });

  afterEach(() => {
    // Clean up after each test
    cache.clearAll();
  });

  describe('Article caching', () => {
    it('should cache and retrieve an article', async () => {
      // Cache an article
      cache.setArticle(1, 1, mockArticle);

      // Retrieve from cache
      const cached = await cache.getArticle(1, 1);

      expect(cached).toEqual(mockArticle);
    });

    it('should return null for non-existent article', async () => {
      const cached = await cache.getArticle(999, 999);
      expect(cached).toBeNull();
    });

    it('should invalidate article cache', async () => {
      // Cache an article
      cache.setArticle(1, 1, mockArticle);

      // Verify it's cached
      let cached = await cache.getArticle(1, 1);
      expect(cached).toEqual(mockArticle);

      // Invalidate
      cache.invalidateArticle(1, 1);

      // Should no longer be cached
      cached = await cache.getArticle(1, 1);
      expect(cached).toBeNull();
    });
  });

  describe('Chapter articles caching', () => {
    it('should cache and retrieve chapter articles', async () => {
      // Cache articles
      cache.setChapterArticles(1, mockArticles);

      // Retrieve from cache
      const cached = await cache.getChapterArticles(1);

      expect(cached).toEqual(mockArticles);
    });

    it('should return null for non-existent chapter', async () => {
      const cached = await cache.getChapterArticles(999);
      expect(cached).toBeNull();
    });

    it('should invalidate chapter cache', async () => {
      // Cache articles
      cache.setChapterArticles(1, mockArticles);

      // Verify it's cached
      let cached = await cache.getChapterArticles(1);
      expect(cached).toEqual(mockArticles);

      // Invalidate
      cache.invalidateChapter(1);

      // Should no longer be cached
      cached = await cache.getChapterArticles(1);
      expect(cached).toBeNull();
    });
  });

  describe('Search results caching', () => {
    it('should cache and retrieve search results', async () => {
      const query = 'test query';
      const results = { results: mockArticles, total: 1 };

      // Cache search results
      cache.setSearchResults(query, results);

      // Retrieve from cache
      const cached = await cache.getSearchResults(query);

      expect(cached).toEqual(results);
    });

    it('should handle different search options', async () => {
      const query = 'test query';
      const options1 = { chapter: 1 };
      const options2 = { chapter: 2 };
      const results1 = { results: mockArticles, total: 1 };
      const results2 = { results: [], total: 0 };

      // Cache different search results
      cache.setSearchResults(query, results1, options1);
      cache.setSearchResults(query, results2, options2);

      // Retrieve from cache
      const cached1 = await cache.getSearchResults(query, options1);
      const cached2 = await cache.getSearchResults(query, options2);

      expect(cached1).toEqual(results1);
      expect(cached2).toEqual(results2);
    });
  });

  describe('Constitution structure caching', () => {
    it('should cache and retrieve constitution structure', async () => {
      const structure = {
        title: 'Constitution of the Cayman Islands',
        chapters: []
      };

      // Cache structure
      cache.setConstitutionStructure(structure);

      // Retrieve from cache
      const cached = await cache.getConstitutionStructure();

      expect(cached).toEqual(structure);
    });
  });

  describe('Cache statistics', () => {
    it('should provide cache statistics', () => {
      // Add some items to cache
      cache.setArticle(1, 1, mockArticle);
      cache.setChapterArticles(1, mockArticles);

      const stats = cache.getStats();

      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('maxSize');
      expect(stats.size).toBeGreaterThan(0);
    });
  });

  describe('Cache clearing', () => {
    it('should clear all cache', async () => {
      // Add items to cache
      cache.setArticle(1, 1, mockArticle);
      cache.setChapterArticles(1, mockArticles);

      // Verify items are cached
      let cachedArticle = await cache.getArticle(1, 1);
      let cachedArticles = await cache.getChapterArticles(1);

      expect(cachedArticle).toEqual(mockArticle);
      expect(cachedArticles).toEqual(mockArticles);

      // Clear all
      cache.clearAll();

      // Verify cache is empty
      cachedArticle = await cache.getArticle(1, 1);
      cachedArticles = await cache.getChapterArticles(1);

      expect(cachedArticle).toBeNull();
      expect(cachedArticles).toBeNull();
    });
  });
});