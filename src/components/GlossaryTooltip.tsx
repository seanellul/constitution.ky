'use client';

import { useState, useRef, useEffect } from 'react';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

export default function GlossaryTooltip({ term, definition, children }: GlossaryTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [above, setAbove] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (visible && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      // Show below if near top of viewport
      setAbove(rect.top > 160);
    }
  }, [visible]);

  return (
    <span
      ref={ref}
      className="relative inline group"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible((v) => !v)}
    >
      <span className="border-b border-dotted border-gray-400 dark:border-gray-500 cursor-help">
        {children}
      </span>
      {visible && (
        <span
          className={`absolute z-50 left-1/2 -translate-x-1/2 w-72 max-w-[90vw] px-3 py-2 rounded-lg shadow-lg text-sm bg-gray-900 dark:bg-gray-100 text-gray-100 dark:text-gray-900 ${
            above ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          role="tooltip"
        >
          <span className="font-semibold">{term}:</span> {definition}
        </span>
      )}
    </span>
  );
}
