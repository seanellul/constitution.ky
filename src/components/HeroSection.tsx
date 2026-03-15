'use client';

import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
        delayChildren: prefersReducedMotion ? 0 : 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeOut' as const },
    },
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.8, ease: 'easeOut' as const },
    },
  };

  return (
    <section className="min-h-[70vh] flex flex-col justify-center relative overflow-hidden">
      {/* Background with gradient and animated accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-secondary-light dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 z-0">
        {/* Radial gradient ring behind title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full"
            style={{
              background: 'radial-gradient(circle, transparent 40%, rgba(0,61,165,0.08) 60%, transparent 80%)',
            }}
            animate={
              prefersReducedMotion
                ? {}
                : { scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }
            }
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Subtle animated grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,61,165,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,61,165,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Blur circles using primary palette */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute w-full h-full"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          >
            <div className="absolute w-[500px] h-[500px] rounded-full bg-primary-100 dark:bg-primary-900/40 blur-3xl opacity-30 -top-48 -right-48" style={{ willChange: 'transform' }} />
            <div className="absolute w-[400px] h-[400px] rounded-full bg-primary-200 dark:bg-primary-900/30 blur-3xl opacity-20 top-1/2 -left-48" style={{ willChange: 'transform' }} />
          </motion.div>
        )}
      </div>

      {/* Hero content */}
      <div className="container mx-auto px-6 relative z-20 mb-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6"
            variants={heroTextVariants}
          >
            The <span className="text-primary-DEFAULT dark:text-primary-400">Constitution</span> of the Cayman Islands
            <br />
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">Interactive Edition</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            variants={itemVariants}
          >
            Explore the Cayman Islands Constitution through an intuitive, modern interface that brings legal text to life.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row justify-center gap-4 mt-8"
            variants={itemVariants}
          >
            <Link
              href="/constitution"
              className="btn-primary text-lg px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>Browse Parts</span>
            </Link>

            <Link
              href="/search"
              className="btn-secondary text-lg px-8 py-3 rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Search Sections</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Constitution preview teaser */}
      <div className="relative h-[100px] sm:h-[150px] mb-0 overflow-hidden mx-auto max-w-4xl">
        <motion.div
          className="absolute w-48 sm:w-64 md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-2 sm:p-3 rotate-3 left-[20%] z-30"
          initial={{ y: 100, opacity: 0, rotate: 3 }}
          animate={{ y: 0, opacity: 0.9, rotate: 3 }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.8, duration: prefersReducedMotion ? 0 : 0.7 }}
        >
          <div className="border-b border-gray-200 dark:border-gray-700 pb-1 sm:pb-2 mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-base font-serif font-bold text-primary-DEFAULT dark:text-primary-400">Part I</h3>
            <h4 className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Bill of Rights, Freedoms and Responsibilities</h4>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-800 dark:text-gray-300">
            <span className="font-bold">1.</span> This Bill of Rights, Freedoms and Responsibilities is a cornerstone of democracy...
          </p>
        </motion.div>

        <motion.div
          className="absolute w-48 sm:w-64 md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-2 sm:p-3 -rotate-2 right-[20%] z-20"
          initial={{ y: 100, opacity: 0, rotate: -2 }}
          animate={{ y: 0, opacity: 0.85, rotate: -2 }}
          transition={{ delay: prefersReducedMotion ? 0 : 1, duration: prefersReducedMotion ? 0 : 0.7 }}
        >
          <div className="border-b border-gray-200 dark:border-gray-700 pb-1 sm:pb-2 mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-base font-serif font-bold text-blue-600 dark:text-blue-400">Part III</h3>
            <h4 className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">The Executive</h4>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-800 dark:text-gray-300">
            <span className="font-bold">43.</span> The executive authority of the Cayman Islands is vested in Her Majesty.
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="mx-auto mt-0 mb-1"
        aria-hidden="true"
        initial={{ opacity: 0, y: -10 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0, 1, 0], y: [0, 10, 0] }}
        transition={prefersReducedMotion ? {} : { duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center">
          <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-1">Scroll to explore</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>
    </section>
  );
}

export default memo(HeroSection);
