import React from 'react';
import Link from 'next/link';
import {
  UsersIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

export const metadata = {
  title: 'About Constitution.ky | Cayman Islands Constitution Guide',
  description: 'Learn about Constitution.ky — the free, open-source interactive guide to the Cayman Islands Constitution Order 2009. Explore all 125 sections across 9 parts.',
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Constitution of the Cayman Islands?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Cayman Islands Constitution Order 2009 is the supreme law of the Cayman Islands, a British Overseas Territory. It establishes the framework for democratic governance, protects fundamental rights and freedoms, and defines the structure of government including the Governor, Cabinet, Legislative Assembly, and judiciary.',
      },
    },
    {
      '@type': 'Question',
      name: 'When was the Cayman Islands Constitution established?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The current Constitution was established by the Cayman Islands Constitution Order 2009, which came into force on 6 November 2009. It replaced the previous 1972 constitution and has been amended by the Constitution (Amendment) Order 2016 (SI 2016/780) and the Constitution (Amendment) Order 2020 (SI 2020/1283).',
      },
    },
    {
      '@type': 'Question',
      name: 'How many parts does the Cayman Islands Constitution have?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Constitution has 9 parts: Part I (Bill of Rights), Part II (The Governor), Part III (The Executive), Part IV (The Legislature), Part V (The Judicature), Part VI (The Public Service), Part VII (Finance), Part VIII (Institutions Supporting Democracy), and Part IX (Miscellaneous). Together they contain 125 sections.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the Cayman Islands Constitution protect human rights?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Part I of the Constitution is the Bill of Rights, Freedoms and Responsibilities. It guarantees rights including the right to life, protection from torture, personal liberty, fair trial, freedom of expression, freedom of assembly, freedom of movement, protection from discrimination, and protection of property.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does the Constitution refer to "Her Majesty"?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Constitution was enacted in 2009 during the reign of Queen Elizabeth II. Following the accession of King Charles III in 2022, references to "Her Majesty" now apply to "His Majesty" by operation of the UK Interpretation Act 1978, without requiring a constitutional amendment.',
      },
    },
  ],
};

export default function About() {
  const values = [
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: 'Accessibility',
      description: 'Making constitutional knowledge available to every Caymanian, regardless of their legal background.'
    },
    {
      icon: <AcademicCapIcon className="h-8 w-8" />,
      title: 'Education',
      description: 'Empowering citizens with knowledge about their rights and the structure of government.'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: 'Transparency',
      description: 'Ensuring open access to the fundamental law that governs our democracy.'
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8" />,
      title: 'Innovation',
      description: 'Using modern technology to bring constitutional documents into the digital age.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About Constitution.ky
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We&apos;re dedicated to making the Cayman Islands Constitution accessible, searchable, and understandable
            for every Caymanian through innovative digital technology.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            The Cayman Islands Constitution Order 2009 is the supreme law of the Cayman Islands, establishing the
            framework for government and protecting the fundamental rights of all people in the territory. However,
            constitutional documents can be complex and difficult to navigate for the average person.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Constitution.ky bridges this gap by providing an intuitive, modern interface that makes constitutional
            knowledge accessible to everyone. Whether you&apos;re a student, researcher, legal professional, or simply
            a curious citizen, our platform empowers you to explore and understand your constitutional rights and
            the structure of the Cayman Islands&apos; government.
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Note */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-4">
            A Note on &ldquo;Her Majesty&rdquo;
          </h2>
          <p className="text-base text-amber-800 dark:text-amber-200 leading-relaxed mb-4">
            The Constitution of the Cayman Islands was enacted in 2009 during the reign of Queen Elizabeth II,
            and the official text refers to &ldquo;Her Majesty&rdquo; throughout. Following the accession of
            King Charles III in September 2022, these references now apply to &ldquo;His Majesty&rdquo; by
            operation of the{' '}
            <a
              href="https://www.legislation.gov.uk/ukpga/1978/30/section/6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 dark:text-amber-300 underline hover:text-amber-900 dark:hover:text-amber-100"
            >
              Interpretation Act 1978
            </a>
            , which provides that references to the sovereign adapt automatically without requiring a
            constitutional amendment.
          </p>
          <p className="text-base text-amber-800 dark:text-amber-200 leading-relaxed">
            Constitution.ky presents the original enacted text faithfully. No formal amendment has been
            made to update the gendered language, but the legal effect is the same.
          </p>
        </div>

        {/* Technology Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Built with Modern Technology
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg leading-relaxed mb-4">
                Constitution.ky is built using cutting-edge web technologies to ensure fast, reliable,
                and accessible performance across all devices.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Advanced search with relevance scoring
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Mobile-responsive design
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Accessibility-first approach
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Performance optimized
                </li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Technical Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Search Response Time</span>
                  <span className="font-mono">&lt; 100ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Page Load Speed</span>
                  <span className="font-mono">&lt; 1.5s</span>
                </div>
                <div className="flex justify-between">
                  <span>Accessibility Score</span>
                  <span className="font-mono">AAA</span>
                </div>
                <div className="flex justify-between">
                  <span>Mobile Performance</span>
                  <span className="font-mono">98/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Open Source Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mt-16">
          <div className="flex items-center gap-3 mb-6">
            <CodeBracketIcon className="w-8 h-8 text-gray-900 dark:text-white" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Open Source
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            Constitution.ky is fully open source. The entire codebase &mdash; every component, every API route,
            every line of constitutional data &mdash; is publicly available on GitHub. We believe that a tool
            built to make public law accessible should itself be transparent and open to contribution.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            Whether you want to report an issue, suggest an improvement, or fork the project to build
            something similar for your own jurisdiction, you&apos;re welcome to dive in.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://github.com/seanellul/constitution.ky"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/seanellul/constitution.ky/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Report an Issue
            </a>
          </div>
        </div>

        {/* Built By Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mt-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            <div className="flex-1">
              <p className="text-sm font-medium text-primary-DEFAULT dark:text-primary-400 uppercase tracking-wider mb-2">
                Built by
              </p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Sean Ellul
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Problem solver first, domain expert second. Sean is a cross-sector builder who works at the
                intersection of technology, institutional design, and public-sector reform. He builds tools
                that make complex systems more accessible &mdash; whether that&apos;s scaling a 30,000 DAU
                application, reimagining how citizens interact with their constitution, or advising on
                public-sector technology strategy.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Constitution.ky is part of a broader effort to use modern technology to bridge the gap
                between governments and the people they serve. Sean has previously built{' '}
                <a
                  href="https://constitution.mt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-DEFAULT dark:text-primary-400 hover:underline"
                >
                  Constitution.mt
                </a>
                {' '}&mdash; the same concept for Malta &mdash; and continues to explore how digital tools
                can strengthen civic engagement across jurisdictions.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://seanellul.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-DEFAULT text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  seanellul.com
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/seanellul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/seanellul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="mailto:sean@seanellul.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  sean@seanellul.com
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
