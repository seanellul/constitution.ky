'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'constitution-ky-text-size';
const SIZES = [
  { label: 'A-', value: 'small', class: 'text-sm sm:text-base' },
  { label: 'A', value: 'default', class: 'text-base sm:text-lg' },
  { label: 'A+', value: 'large', class: 'text-lg sm:text-xl' },
  { label: 'A++', value: 'xlarge', class: 'text-xl sm:text-2xl' },
];

export function useTextSize() {
  const [sizeIndex, setSizeIndex] = useState(1); // default

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const idx = SIZES.findIndex((s) => s.value === saved);
        if (idx !== -1) setSizeIndex(idx);
      }
    } catch {}
  }, []);

  const setSize = (index: number) => {
    const clamped = Math.max(0, Math.min(index, SIZES.length - 1));
    setSizeIndex(clamped);
    try {
      localStorage.setItem(STORAGE_KEY, SIZES[clamped].value);
    } catch {}
  };

  return { sizeIndex, setSize, sizeClass: SIZES[sizeIndex].class, sizes: SIZES };
}

export default function TextSizeControls({
  sizeIndex,
  setSize,
}: {
  sizeIndex: number;
  setSize: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Text size">
      {SIZES.map((size, i) => (
        <button
          key={size.value}
          onClick={() => setSize(i)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            i === sizeIndex
              ? 'bg-primary-DEFAULT text-white'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          title={`Text size: ${size.label}`}
          aria-pressed={i === sizeIndex}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
}
