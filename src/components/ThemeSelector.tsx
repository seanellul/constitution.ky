'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { isBrowser } from '@/lib/utils';

export interface Theme {
  id: string;
  name: string;
  swatch: string; // tailwind bg color for the circle swatch
  isDark: boolean;
  vars: Record<string, string>;
}

const themes: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
    swatch: 'bg-gray-800',
    isDark: true,
    vars: {},
  },
  {
    id: 'light',
    name: 'Light',
    swatch: 'bg-white border border-gray-300',
    isDark: false,
    vars: {},
  },
  {
    id: 'sepia',
    name: 'Sepia',
    swatch: 'bg-[#f4ecd8]',
    isDark: false,
    vars: {
      '--theme-bg': '#f4ecd8',
      '--theme-text': '#433422',
      '--theme-card': '#efe6d0',
      '--theme-border': '#d4c9a8',
      '--theme-muted': '#8a7b65',
    },
  },
  {
    id: 'night',
    name: 'Night',
    swatch: 'bg-[#0d1117]',
    isDark: true,
    vars: {
      '--theme-bg': '#0d1117',
      '--theme-text': '#c9d1d9',
      '--theme-card': '#161b22',
      '--theme-border': '#30363d',
      '--theme-muted': '#8b949e',
    },
  },
];

const STORAGE_KEY = 'constitution-ky-theme';

export function useTheme() {
  const [themeId, setThemeId] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isBrowser()) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && themes.find((t) => t.id === saved)) {
      setThemeId(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const theme = themes.find((t) => t.id === themeId) || themes[0];

    // Dark mode class
    if (theme.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Custom CSS variables for special themes
    const root = document.documentElement;
    // Reset all custom vars
    root.style.removeProperty('--theme-bg');
    root.style.removeProperty('--theme-text');
    root.style.removeProperty('--theme-card');
    root.style.removeProperty('--theme-border');
    root.style.removeProperty('--theme-muted');
    root.removeAttribute('data-theme');

    if (Object.keys(theme.vars).length > 0) {
      root.setAttribute('data-theme', theme.id);
      for (const [key, value] of Object.entries(theme.vars)) {
        root.style.setProperty(key, value);
      }
    }

    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEY, themeId);
      // Also sync the old darkMode key for components that still read it
      localStorage.setItem('darkMode', theme.isDark.toString());
    }
  }, [themeId, mounted]);

  return { themeId, setThemeId, mounted, themes };
}

export default function ThemeSelector() {
  const { themeId, setThemeId, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!mounted) return null;

  const currentTheme = themes.find((t) => t.id === themeId) || themes[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        title={`Theme: ${currentTheme.name}`}
        aria-label="Change theme"
      >
        <span className={`block w-4 h-4 rounded-full ${currentTheme.swatch}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1.5 min-w-[140px]"
          >
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setThemeId(theme.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  themeId === theme.id
                    ? 'bg-primary-DEFAULT/10 text-primary-DEFAULT dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className={`block w-4 h-4 rounded-full flex-shrink-0 ${theme.swatch}`} />
                <span className="flex-1 text-left">{theme.name}</span>
                {themeId === theme.id && (
                  <CheckIcon className="w-4 h-4 text-primary-DEFAULT dark:text-primary-400" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
