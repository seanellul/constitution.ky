import './globals.css';
import { DM_Sans, Literata, Merriweather } from 'next/font/google';
import React from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MobileBottomNav from '@/components/MobileBottomNav';
import Toast from '@/components/Toast';
import LayoutClient from './LayoutClient';
import { Analytics } from '@vercel/analytics/react';
import { metadata as siteMetadata } from './metadata';

export { siteMetadata as metadata };

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const literata = Literata({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-literata',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://constitution.ky/#website",
      "url": "https://constitution.ky/",
      "name": "Constitution.ky - Interactive Constitution of the Cayman Islands",
      "description": "Interactive digital platform for exploring and understanding the Constitution of the Cayman Islands with advanced search and navigation features.",
      "publisher": {
        "@id": "https://constitution.ky/#organization"
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://constitution.ky/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "inLanguage": ["en"]
    },
    {
      "@type": "Organization",
      "@id": "https://constitution.ky/#organization",
      "name": "Constitution of the Cayman Islands",
      "url": "https://constitution.ky/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://constitution.ky/logo.png",
        "width": 600,
        "height": 200
      }
    },
    {
      "@type": "GovernmentService",
      "name": "Constitution of the Cayman Islands Interactive Reader",
      "serviceType": "Legal Information Service",
      "description": "Digital access to the Cayman Islands Constitution with interactive navigation and search capabilities",
      "provider": {
        "@id": "https://constitution.ky/#organization"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Cayman Islands"
      },
      "availableLanguage": ["English"]
    },
    {
      "@type": "LegalDocument",
      "name": "Constitution of the Cayman Islands",
      "description": "The Cayman Islands Constitution Order 2009, establishing the framework of government and fundamental rights",
      "legislationDate": "2009-06-10",
      "legislationJurisdiction": {
        "@type": "Country",
        "name": "Cayman Islands"
      },
      "legislationType": "Constitution"
    }
  ]
};

const currentYear = new Date().getFullYear();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${dmSans.variable} ${literata.variable} ${merriweather.variable}`}>
      <head>
        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* PWA Configuration */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#003DA5" />
        <meta name="application-name" content="Constitution.ky" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Constitution.ky" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#003DA5" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Icons — add files to public/ when available */}

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Performance hints */}
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
        <link rel="dns-prefetch" href="//vercel-analytics.com" />
      </head>
      <body className="bg-secondary-light dark:bg-gray-900 min-h-screen flex flex-col text-gray-900 dark:text-gray-100">
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:z-[100] focus:p-4 focus:bg-primary-DEFAULT focus:text-white focus:rounded-md focus:shadow-lg focus:top-4 focus:left-4">
          Skip to main content
        </a>

        <header role="banner">
          <Navigation />
        </header>

        <main id="main-content" role="main" className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-grow max-w-full overflow-x-hidden pb-16 md:pb-0">
          {children}
        </main>

        <footer role="contentinfo" className="bg-gray-100 dark:bg-gray-800 py-4 sm:py-6 mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center space-y-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                &copy; {currentYear} Constitution.ky | An interactive reader for the Constitution of the Cayman Islands
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Educational use only. For official legal reference, consult the{' '}
                <a
                  href="https://www.legislation.gov.uk/uksi/2009/1379/schedule/2/made"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-DEFAULT hover:underline"
                >
                  official Cayman Islands Constitution Order 2009
                </a>
              </p>
              <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-DEFAULT">About</Link>
                <Link href="/constitution" className="text-gray-600 dark:text-gray-400 hover:text-primary-DEFAULT">Constitution</Link>
                <Link href="/topics" className="text-gray-600 dark:text-gray-400 hover:text-primary-DEFAULT">Topics</Link>
                <Link href="/glossary" className="text-gray-600 dark:text-gray-400 hover:text-primary-DEFAULT">Glossary</Link>
                <Link href="/search" className="text-gray-600 dark:text-gray-400 hover:text-primary-DEFAULT">Search</Link>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary-DEFAULT">Blog</Link>
                <a href="https://github.com/seanellul/constitution.ky" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary-DEFAULT">GitHub</a>
              </nav>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
                Built by{" "}
                <a href="https://seanellul.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-primary-DEFAULT transition-colors">
                  Sean Ellul
                </a>
                {" · "}
                <a href="https://careers.ky" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-primary-DEFAULT transition-colors">
                  Careers.ky
                </a>
                {" | "}
                <a href="https://legislation.ky" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-primary-DEFAULT transition-colors">
                  Legislation.ky
                </a>
                {" | "}
                <a href="https://cheap.ky" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-primary-DEFAULT transition-colors">
                  Cheap.ky
                </a>
                {" | "}
                <a href="https://caybooks.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-primary-DEFAULT transition-colors">
                  CayBooks
                </a>
              </p>
            </div>
          </div>
        </footer>

        <MobileBottomNav />
        <Toast />

        {/* Client-side components */}
        <LayoutClient />
        <Analytics />
      </body>
    </html>
  );
}
