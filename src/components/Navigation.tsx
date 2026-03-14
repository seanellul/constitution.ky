"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ActiveUsersCounter from './ActiveUsersCounter';
import DarkModeToggle from './DarkModeToggle';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/constitution', label: 'Constitution' },
    { href: '/search', label: 'Search' },
    { href: '/blog', label: 'Blog' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 py-2 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="group flex items-center">
              <span className="text-primary-DEFAULT dark:text-primary-400 font-serif font-bold text-xl group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200">
                Constitution.ky
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-DEFAULT dark:hover:text-primary-400 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-6 md:space-x-10 mr-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    (link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href))
                      ? 'text-primary-DEFAULT dark:text-primary-400 border-b-2 border-primary-DEFAULT dark:border-primary-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-DEFAULT dark:hover:text-primary-400 hover:border-b-2 hover:border-primary-200 dark:hover:border-primary-600'
                  } pb-1 font-medium transition-all duration-200`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center border-l border-gray-200 dark:border-gray-700 pl-4 py-1 ml-2 space-x-3">
              <div className="bg-gray-50 dark:bg-gray-800 shadow-sm rounded-full">
                <ActiveUsersCounter />
              </div>
              <div>
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'max-h-96 opacity-100 mt-2'
              : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 rounded-md shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  (link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href))
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-DEFAULT dark:text-primary-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2 mt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-gray-50 dark:bg-gray-800 shadow-sm rounded-full">
                <ActiveUsersCounter />
              </div>
              <div>
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
