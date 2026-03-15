'use client';

import { useReducedMotion } from 'framer-motion';

/**
 * Returns true if animations should run (user has NOT enabled reduced-motion).
 */
export function useMotionSafe(): boolean {
  const prefersReducedMotion = useReducedMotion();
  return !prefersReducedMotion;
}
