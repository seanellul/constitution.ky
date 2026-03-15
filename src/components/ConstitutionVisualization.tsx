'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useState, useCallback, useRef } from 'react';
import LiveInsightsWidget from '@/components/LiveInsightsWidget';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ConstitutionCard {
  part: string;
  title: string;
  color: string;
  darkColor: string;
  accentBg: string;
  darkAccentBg: string;
  href: string;
  sections: { num: string; text: string }[];
}

const cards: ConstitutionCard[] = [
  {
    part: 'Part I',
    title: 'Bill of Rights, Freedoms and Responsibilities',
    color: 'text-primary-DEFAULT dark:text-primary-400',
    darkColor: 'text-primary-400',
    accentBg: 'bg-primary-50 dark:bg-primary-900/20',
    darkAccentBg: 'dark:bg-primary-900/20',
    href: '/constitution/chapter/1',
    sections: [
      { num: '1', text: 'This Bill of Rights, Freedoms and Responsibilities is a cornerstone of democracy in the Cayman Islands.' },
      { num: '2', text: "Everyone\u2019s right to life shall be protected by law..." },
      { num: '3', text: 'No person shall be subjected to torture or inhuman or degrading treatment or punishment.' },
    ],
  },
  {
    part: 'Part III',
    title: 'The Executive',
    color: 'text-amber-600 dark:text-amber-400',
    darkColor: 'text-amber-400',
    accentBg: 'bg-amber-50 dark:bg-amber-900/20',
    darkAccentBg: 'dark:bg-amber-900/20',
    href: '/constitution/chapter/3',
    sections: [
      { num: '43', text: 'The executive authority of the Cayman Islands is vested in Her Majesty...' },
      { num: '44', text: 'There shall be a Cabinet for the Cayman Islands which shall consist of the Premier and Ministers...' },
    ],
  },
  {
    part: 'Part IV',
    title: 'The Legislature',
    color: 'text-blue-600 dark:text-blue-400',
    darkColor: 'text-blue-400',
    accentBg: 'bg-blue-50 dark:bg-blue-900/20',
    darkAccentBg: 'dark:bg-blue-900/20',
    href: '/constitution/chapter/4',
    sections: [
      { num: '59', text: 'There shall be a Legislature of the Cayman Islands which shall consist of Her Majesty and a Legislative Assembly.' },
      { num: '60', text: 'The Legislative Assembly shall comprise a Speaker, eighteen elected members...' },
    ],
  },
  {
    part: 'Part V',
    title: 'The Judicature',
    color: 'text-orange-600 dark:text-orange-400',
    darkColor: 'text-orange-400',
    accentBg: 'bg-orange-50 dark:bg-orange-900/20',
    darkAccentBg: 'dark:bg-orange-900/20',
    href: '/constitution/chapter/5',
    sections: [
      { num: '94', text: 'There shall be a Grand Court for the Cayman Islands which shall be a superior Court of Record...' },
      { num: '99', text: 'There shall be a Court of Appeal for the Cayman Islands...' },
    ],
  },
];

export default function ConstitutionVisualization() {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigate = useCallback((newIndex: number) => {
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  }, [activeIndex]);

  const next = useCallback(() => {
    navigate((activeIndex + 1) % cards.length);
  }, [activeIndex, navigate]);

  const prev = useCallback(() => {
    navigate((activeIndex - 1 + cards.length) % cards.length);
  }, [activeIndex, navigate]);

  // Swipe handling for mobile
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    touchStart.current = null;
  };

  // Keyboard navigation
  const containerRef = useRef<HTMLDivElement>(null);
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  }, [prev, next]);

  const slideVariants = prefersReducedMotion
    ? {
        enter: () => ({ opacity: 0 }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: () => ({ opacity: 0 }),
      }
    : {
        enter: (dir: number) => ({
          x: dir > 0 ? 300 : -300,
          opacity: 0,
          scale: 0.92,
        }),
        center: {
          x: 0,
          opacity: 1,
          scale: 1,
        },
        exit: (dir: number) => ({
          x: dir < 0 ? 300 : -300,
          opacity: 0,
          scale: 0.92,
        }),
      };

  const activeCard = cards[activeIndex];

  return (
    <section className="py-10 sm:py-14 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Left side: Interactive Card Carousel */}
          <div className="relative">
            {/* Card container */}
            <div
              ref={containerRef}
              className="relative overflow-hidden rounded-xl outline-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="region"
              aria-label="Constitution parts carousel"
              aria-roledescription="carousel"
            >
              {/* Background stack effect - decorative cards behind */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-2 left-2 right-2 bottom-0 bg-gray-100 dark:bg-gray-700/50 rounded-xl border border-gray-200/60 dark:border-gray-600/40 transform rotate-[1.5deg]" />
                <div className="absolute top-1 left-1 right-1 bottom-0 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-200/40 dark:border-gray-600/30 transform -rotate-[0.8deg]" />
              </div>

              {/* Active card */}
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 350, damping: 35 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.25 },
                  }}
                  className="relative"
                >
                  <Link
                    href={activeCard.href}
                    className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 sm:p-7 hover:shadow-xl transition-shadow duration-300 group"
                  >
                    {/* Card header */}
                    <div className="border-b border-gray-150 dark:border-gray-700 pb-3 sm:pb-4 mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-lg sm:text-xl font-serif font-bold ${activeCard.color}`}>
                          {activeCard.part}
                        </h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${activeCard.accentBg} ${activeCard.color}`}>
                          {activeCard.sections.length} sections
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                        {activeCard.title}
                      </h4>
                    </div>

                    {/* Sections */}
                    <div className="space-y-3">
                      {activeCard.sections.map((section, i) => (
                        <motion.p
                          key={section.num}
                          className="text-sm sm:text-base text-gray-700 dark:text-gray-300 py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                        >
                          <span className="font-bold text-gray-900 dark:text-gray-100 mr-2 tabular-nums">
                            {section.num}.
                          </span>
                          {section.text}
                        </motion.p>
                      ))}
                    </div>

                    {/* Read more footer */}
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-end">
                      <span className={`text-sm font-medium ${activeCard.color} flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200`}>
                        Continue reading
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-between mt-4 sm:mt-5">
              {/* Arrow buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 active:scale-95"
                  aria-label="Previous part"
                >
                  <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={next}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 active:scale-95"
                  aria-label="Next part"
                >
                  <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Dot indicators */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {cards.map((card, i) => (
                  <button
                    key={card.part}
                    onClick={() => navigate(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-primary-DEFAULT dark:bg-primary-400'
                        : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`Go to ${card.part}`}
                    aria-current={i === activeIndex ? 'true' : undefined}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 dark:text-gray-100 mb-5 sm:mb-6">
              Bringing the Cayman Islands Constitution{' '}
              <span className="text-primary-DEFAULT dark:text-primary-400">to Life</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
              More than just text, our interactive Constitution transforms legal language into an engaging, accessible experience for all Caymanians.
            </p>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              Discover the structure, principles and sections that form the foundation of the Cayman Islands&apos; democracy through a modern, user-friendly interface.
            </p>

            {/* Live Analytics Widget */}
            <div className="mb-6">
              <LiveInsightsWidget />
            </div>

            <Link
              href="/about"
              className="text-primary-DEFAULT dark:text-primary-400 font-medium hover:underline flex items-center gap-2 group"
            >
              <span>Learn more about this project</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
