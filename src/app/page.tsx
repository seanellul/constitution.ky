"use client";

import { Suspense } from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ConstitutionVisualization from '@/components/ConstitutionVisualization';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpenIcon } from '@heroicons/react/24/outline';

function HeroSectionSkeleton() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-pulse text-center">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto"></div>
      </div>
    </div>
  );
}

function FeaturesSectionSkeleton() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualizationSkeleton() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-6">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<VisualizationSkeleton />}>
        <ConstitutionVisualization />
      </Suspense>

      <Suspense fallback={<FeaturesSectionSkeleton />}>
        <FeaturesSection />
      </Suspense>

      {/* SEO Content Section - Cayman Islands Constitution Information */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6">
                Understanding the Cayman Islands Constitution
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                The Cayman Islands Constitution Order 2009 establishes the framework for democratic governance, fundamental rights and freedoms, and the structure of government in the Cayman Islands.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Bill of Rights */}
              <motion.div
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                  Bill of Rights & Freedoms
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4 text-sm">
                  Part I of the Constitution guarantees essential human rights including the right to life, fair trial, freedom of expression, and protection from discrimination.
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>- Right to Life (Section 2)</li>
                  <li>- Fair Trial (Section 7)</li>
                  <li>- Freedom of Expression (Section 11)</li>
                  <li>- Non-discrimination (Section 16)</li>
                </ul>
                <Link href="/constitution/chapter/1" className="inline-block mt-4 text-blue-600 hover:underline font-medium text-sm">
                  Read Part I &rarr;
                </Link>
              </motion.div>

              {/* Government Structure */}
              <motion.div
                className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-4">
                  Government Structure
                </h3>
                <p className="text-indigo-800 dark:text-indigo-200 mb-4 text-sm">
                  The Constitution establishes the structure of governance including the Governor, Cabinet, Premier, Legislative Assembly, and the judicial system.
                </p>
                <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                  <li>- The Governor (Part II)</li>
                  <li>- The Executive & Cabinet (Part III)</li>
                  <li>- The Legislature (Part IV)</li>
                  <li>- The Judicature (Part V)</li>
                </ul>
                <Link href="/constitution/chapter/3" className="inline-block mt-4 text-indigo-600 hover:underline font-medium text-sm">
                  Explore the Executive &rarr;
                </Link>
              </motion.div>

              {/* Democratic Institutions */}
              <motion.div
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4">
                  Democratic Institutions
                </h3>
                <p className="text-green-800 dark:text-green-200 mb-4 text-sm">
                  The Constitution establishes key institutions to support democracy, transparency and accountability in the Cayman Islands.
                </p>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>- Human Rights Commission (Section 116)</li>
                  <li>- Commission for Standards in Public Life (Section 117)</li>
                  <li>- Freedom of Information (Section 122)</li>
                  <li>- Auditor General (Section 114)</li>
                </ul>
                <Link href="/constitution/chapter/8" className="inline-block mt-4 text-green-600 hover:underline font-medium text-sm">
                  Read Part VIII &rarr;
                </Link>
              </motion.div>
            </div>

            {/* Key Facts Section */}
            <motion.div
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Cayman Islands Constitution: Key Facts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary-DEFAULT mb-2">2009</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Constitution Established</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-DEFAULT mb-2">9</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Main Parts</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-DEFAULT mb-2">125</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Constitutional Sections</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-DEFAULT mb-2">1</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Official Language</div>
                </div>
              </div>
              <p className="mt-6 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Access <strong>constitution.ky</strong> for comprehensive constitutional information about the Cayman Islands&apos; legal framework.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-primary-600/80 to-primary-800/90 dark:from-primary-800/70 dark:to-primary-900/80 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-3 sm:mb-4">Begin Exploring the Constitution Now</h2>
            <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-white/90">
              Discover the rights, principles, and framework that guide the Cayman Islands&apos; democracy.
            </p>
            <Link
                href="/constitution"
                className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform w-full sm:w-auto max-w-sm mx-auto"
              >
                <BookOpenIcon className="w-5 h-5" />
                <span>Start Reading</span>
              </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
