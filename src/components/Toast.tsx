'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '@/lib/toastStore';

export default function Toast() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[70] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-sm font-medium cursor-pointer ${
              toast.type === 'error'
                ? 'bg-red-600 text-white'
                : toast.type === 'info'
                ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                : 'bg-green-600 text-white'
            }`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
