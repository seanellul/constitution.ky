'use client';

import { motion } from 'framer-motion';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function ActiveUsersCounter() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 px-2 py-1 rounded-full"
      title="Site is online"
    >
      <UserGroupIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
    </motion.div>
  );
}
