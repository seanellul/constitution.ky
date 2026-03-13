// SEO utility functions for constitutional content

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
}

export function generateConstitutionalSEO({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/opengraph-image',
}: Partial<SEOData> & { title: string; description: string }): SEOData {
  const defaultKeywords = [
    'Cayman Islands Constitution',
    'Cayman Constitution',
    'Constitution of the Cayman Islands',
    'Cayman Islands constitutional law',
    'Cayman Islands legal framework',
    'Cayman Islands democracy',
  ];

  return {
    title: `${title} | Constitution.ky - Constitution of the Cayman Islands`,
    description,
    keywords: [...defaultKeywords, ...keywords],
    canonicalUrl: canonicalUrl || 'https://constitution.ky',
    ogImage,
  };
}

export function ConstitutionalArticleStructuredData(
  articleNumber: number,
  title: string,
  content: string,
  chapterName: string,
  chapterNumber: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalDocument",
    "name": `Section ${articleNumber}: ${title}`,
    "description": content.substring(0, 200) + "...",
    "legislationType": "Constitutional Section",
    "legislationJurisdiction": {
      "@type": "Country",
      "name": "Cayman Islands"
    },
    "isPartOf": {
      "@type": "LegalDocument",
      "name": `${chapterName} - Constitution of the Cayman Islands`,
      "legislationType": "Constitutional Part"
    },
    "legislationDate": "2009-06-10",
    "inLanguage": "en",
    "url": `https://constitution.ky/constitution/chapter/${chapterNumber}/article/${articleNumber}`
  };
}

export function ConstitutionalChapterStructuredData(
  chapterNumber: string,
  title: string,
  description: string,
  articles: Array<{number: number, title: string}>
) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalDocument",
    "name": `Part ${chapterNumber}: ${title}`,
    "description": description,
    "legislationType": "Constitutional Part",
    "legislationJurisdiction": {
      "@type": "Country",
      "name": "Cayman Islands"
    },
    "isPartOf": {
      "@type": "LegalDocument",
      "name": "Constitution of the Cayman Islands",
      "legislationType": "Constitution"
    },
    "hasPart": articles.map(article => ({
      "@type": "LegalDocument",
      "name": `Section ${article.number}: ${article.title}`,
      "legislationType": "Constitutional Section",
      "url": `https://constitution.ky/constitution/chapter/${chapterNumber}/article/${article.number}`
    })),
    "legislationDate": "2009-06-10",
    "inLanguage": "en",
    "url": `https://constitution.ky/constitution/chapter/${chapterNumber}`
  };
}
