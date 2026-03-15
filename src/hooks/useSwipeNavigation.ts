'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SwipeTarget {
  chapterNumber: number;
  articleNumber: number;
}

export function useSwipeNavigation(
  prevArticle: SwipeTarget | null,
  nextArticle: SwipeTarget | null
) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;

      touchStartX.current = null;
      touchStartY.current = null;

      // Only trigger on horizontal swipe > 80px that exceeds vertical distance
      if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy)) return;

      if (dx > 0 && prevArticle) {
        router.push(
          `/constitution/chapter/${prevArticle.chapterNumber}/article/${prevArticle.articleNumber}`
        );
      } else if (dx < 0 && nextArticle) {
        router.push(
          `/constitution/chapter/${nextArticle.chapterNumber}/article/${nextArticle.articleNumber}`
        );
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [prevArticle, nextArticle, router]);
}
