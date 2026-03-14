"use client";

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <motion.nav 
      aria-label="Breadcrumb" 
      className="py-2 sm:py-3 px-1 overflow-x-auto scrollbar-hide max-w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.15 }}
    >
      <ol className="flex flex-wrap items-center text-xs sm:text-sm">
        <motion.li 
          className="flex items-center flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Link 
            href="/" 
            className="text-gray-500 hover:text-primary-DEFAULT transition-colors duration-200 flex items-center py-1"
          >
            <HomeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden xs:inline">Home</span>
          </Link>
          <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-gray-400 flex-shrink-0" aria-hidden="true" />
        </motion.li>
        
        {items.map((item, index) => (
          <motion.li 
            key={index}
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + (index * 0.03) }}
          >
            {index !== items.length - 1 ? (
              <>
                <Link 
                  href={item.href} 
                  className="text-gray-500 hover:text-primary-DEFAULT transition-colors duration-200 py-1 block"
                  title={item.label}
                >
                  <span className="truncate max-w-[120px] sm:max-w-[200px] md:max-w-none block">
                    {item.label}
                  </span>
                </Link>
                <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 flex-shrink-0 text-gray-400" aria-hidden="true" />
              </>
            ) : (
              <span 
                className="text-primary-DEFAULT font-medium py-1 block" 
                aria-current="page"
                title={item.label}
              >
                <span className="truncate max-w-[150px] sm:max-w-[250px] md:max-w-none block">
                  {item.label}
                </span>
              </span>
            )}
          </motion.li>
        ))}
      </ol>
    </motion.nav>
  );
};

export default memo(Breadcrumbs);