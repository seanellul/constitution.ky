import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://constitution.ky'),
  title: {
    default: 'Constitution.ky - Interactive Constitution of the Cayman Islands',
    template: '%s | Constitution.ky - Constitution of the Cayman Islands'
  },
  description: 'Explore the Constitution of the Cayman Islands through an interactive, user-friendly interface. Access all parts, sections, and provisions of the Cayman Islands Constitution Order 2009 with advanced search and navigation features.',
  keywords: [
    // Primary keywords
    'Cayman Islands Constitution', 'Cayman Constitution', 'Constitution of the Cayman Islands',
    'Cayman Islands constitutional law', 'Cayman Islands legal framework', 'Cayman Islands democracy',
    'Cayman Islands government structure', 'Cayman Islands fundamental rights',
    'Cayman Islands legislature', 'Cayman Islands judiciary',

    // Long-tail keywords
    'Cayman Islands Constitution sections', 'Cayman Islands Constitution parts',
    'Cayman Islands Bill of Rights', 'Cayman Islands legislative assembly',
    'Cayman Islands judicial system', 'Cayman Islands citizenship laws',
    'Cayman Islands constitutional history', 'Cayman Islands Constitution Order 2009',

    // Legal and government terms
    'Cayman Islands civil rights', 'Cayman Islands human rights', 'Cayman Islands legal system',
    'Cayman Islands government', 'Cayman Islands political system', 'Cayman Islands Governor',
    'Cayman Islands Premier', 'Cayman Islands Cabinet', 'Grand Court Cayman Islands',

    // Interactive and educational
    'constitutional law education', 'Cayman Islands legal education', 'interactive constitution',
    'constitutional navigation', 'legal document search', 'Cayman Islands civics education',

    // Domain
    'constitution.ky', 'Cayman Islands constitution website',
  ],
  authors: [{ name: 'Constitution.ky Team' }],
  creator: 'Constitution.ky Team',
  publisher: 'Constitution.ky',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_KY',
    url: 'https://constitution.ky',
    siteName: 'Constitution of the Cayman Islands',
    title: 'Interactive Constitution of the Cayman Islands - Constitution.ky',
    description: 'Explore the Cayman Islands Constitution through an interactive digital platform. Access all constitutional sections, search legal provisions, and understand the Cayman Islands\' democratic framework.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Constitution of the Cayman Islands',
    description: 'Explore the Cayman Islands Constitution through an interactive digital platform with advanced search and navigation.',
  },
  alternates: {
    canonical: 'https://constitution.ky',
  },
  category: 'legal',
  classification: 'Legal Education, Government, Constitutional Law',
};
