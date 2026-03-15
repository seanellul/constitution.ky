'use client';

import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { DocumentTextIcon, MagnifyingGlassIcon, BookOpenIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
}

function FeaturesSection() {
  const prefersReducedMotion = useReducedMotion();
  const features: Feature[] = [
    {
      title: "Interactive Navigation",
      description: "Easily browse through parts and sections with an intuitive interface.",
      icon: <DocumentTextIcon className="w-8 h-8 text-primary-DEFAULT dark:text-primary-400" />,
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30"
    },
    {
      title: "Advanced Search",
      description: "Find exactly what you're looking for with our powerful search functionality.",
      icon: <MagnifyingGlassIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30"
    },
    {
      title: "Legal Cross-References",
      description: "Understand connections between different sections and legal concepts.",
      icon: <BookOpenIcon className="w-8 h-8 text-green-600 dark:text-green-400" />,
      color: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30"
    },
    {
      title: "Visual Data Insights",
      description: "Visualize constitutional elements through interactive charts and graphs.",
      icon: <ChartBarIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30"
    }
  ];

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-4">
            Explore the Constitution in New Ways
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our platform offers unique tools and features to help you understand and navigate the Cayman Islands&apos; founding document.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`p-6 rounded-lg border ${feature.color} hover:shadow-lg transition-all duration-300 group`}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
              viewport={{ once: true }}
              whileHover={prefersReducedMotion ? {} : { y: -5 }}
            >
              <div className="flex flex-col items-start">
                <div className="mb-4 p-3 rounded-lg bg-white dark:bg-gray-900/50 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to start exploring the Cayman Islands Constitution?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/constitution"
              className="btn-primary flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>Browse All Parts</span>
            </Link>
            <Link
              href="/search"
              className="btn-secondary flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Search Constitution</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(FeaturesSection);
