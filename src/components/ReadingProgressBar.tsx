'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-primary-DEFAULT dark:bg-primary-400 z-[60]"
      style={{ scaleX, transformOrigin: 'left' }}
    />
  );
}
