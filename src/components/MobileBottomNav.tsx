'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  HomeIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  TagIcon,
  EllipsisHorizontalIcon,
  BookOpenIcon,
  NewspaperIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  TagIcon as TagIconSolid,
} from '@heroicons/react/24/solid';

const primaryTabs = [
  { href: '/', label: 'Home', Icon: HomeIcon, IconActive: HomeIconSolid },
  { href: '/constitution', label: 'Constitution', Icon: DocumentTextIcon, IconActive: DocumentTextIconSolid },
  { href: '/search', label: 'Search', Icon: MagnifyingGlassIcon, IconActive: MagnifyingGlassIconSolid },
  { href: '/topics', label: 'Topics', Icon: TagIcon, IconActive: TagIconSolid },
];

const moreTabs = [
  { href: '/glossary', label: 'Glossary', Icon: BookOpenIcon },
  { href: '/blog', label: 'Blog', Icon: NewspaperIcon },
  { href: '/analytics', label: 'Analytics', Icon: ChartBarIcon },
  { href: '/about', label: 'About', Icon: InformationCircleIcon },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  const moreIsActive = moreTabs.some((t) => isActive(t.href));

  return (
    <>
      {/* "More" overlay */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* "More" menu */}
      {moreOpen && (
        <div className="fixed bottom-16 right-2 z-50 md:hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-1 min-w-[160px] pb-[env(safe-area-inset-bottom)]">
          {moreTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => setMoreOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive(tab.href)
                  ? 'text-primary-DEFAULT dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.Icon className="w-5 h-5" />
              {tab.label}
            </Link>
          ))}
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14">
          {primaryTabs.map((tab) => {
            const active = isActive(tab.href);
            const TabIcon = active ? tab.IconActive : tab.Icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-colors ${
                  active
                    ? 'text-primary-DEFAULT dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <TabIcon className="w-5 h-5 mb-0.5" />
                {tab.label}
              </Link>
            );
          })}
          {/* More button */}
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-colors ${
              moreIsActive || moreOpen
                ? 'text-primary-DEFAULT dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <EllipsisHorizontalIcon className="w-5 h-5 mb-0.5" />
            More
          </button>
        </div>
      </nav>
    </>
  );
}
