'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="min-h-[70vh] flex flex-col justify-center relative overflow-hidden">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-secondary-light dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 z-0">
        <motion.div
          className="absolute w-full h-full"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="absolute w-[600px] h-[600px] rounded-full bg-primary-100 dark:bg-primary-900/30 blur-3xl opacity-20 -top-64 -right-64"></div>
          <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-100 dark:bg-blue-900/30 blur-3xl opacity-20 top-1/2 -left-64"></div>
          <div className="absolute w-[700px] h-[700px] rounded-full bg-secondary-200 dark:bg-gray-800 blur-3xl opacity-10 -bottom-96 right-1/3"></div>
        </motion.div>
      </div>

      {/* Flying paper elements */}
      <motion.div
        className="absolute w-40 h-60 bg-white dark:bg-gray-800 rounded shadow-md opacity-10 z-10"
        initial={{ x: -100, y: -200, rotate: 10 }}
        animate={{
          x: [-100, 50, -70, 20],
          y: [-200, -250, -150, -180],
          rotate: [10, -5, 8, -3],
        }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div
        className="absolute w-32 h-48 bg-white dark:bg-gray-800 rounded shadow-md opacity-10 z-10 right-20 top-40"
        initial={{ x: 100, y: 0, rotate: -5 }}
        animate={{
          x: [100, 20, 70, 30],
          y: [0, 30, -20, 10],
          rotate: [-5, 8, -10, 4],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div
        className="absolute w-28 h-40 bg-white dark:bg-gray-800 rounded shadow-md opacity-10 z-10 left-20 bottom-40"
        initial={{ x: -50, y: 50, rotate: 8 }}
        animate={{
          x: [-50, 20, -30, 10],
          y: [50, 20, 60, 30],
          rotate: [8, -3, 12, 2],
        }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* Hero content */}
      <div className="container mx-auto px-6 relative z-20 mb-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-6"
            variants={heroTextVariants}
          >
            The <span className="text-primary-DEFAULT dark:text-primary-400">Constitution</span> of the Cayman Islands
            <br />
            <span className="text-3xl md:text-4xl">Interactive Edition</span>
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
          transition={{ delay: 0.8, duration: 0.7 }}
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
          transition={{ delay: 1, duration: 0.7 }}
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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
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
