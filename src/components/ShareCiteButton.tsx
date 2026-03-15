'use client';

import { useState } from 'react';
import { ShareIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useToastStore } from '@/lib/toastStore';

interface ShareCiteButtonProps {
  articleNumber: number;
  chapterNumber: number;
  title: string;
}

export default function ShareCiteButton({ articleNumber, chapterNumber, title }: ShareCiteButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const url = `https://constitution.ky/constitution/chapter/${chapterNumber}/article/${articleNumber}`;
  const citation = `Section ${articleNumber}${title ? `, "${title}"` : ''}, Constitution of the Cayman Islands Order 2009, Part ${chapterNumber}`;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    addToast(`${label} copied to clipboard`);
    setShowMenu(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Section ${articleNumber} - ${title}`,
          text: citation,
          url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-DEFAULT dark:hover:text-primary-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Share or cite this section"
      >
        <ShareIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 w-64">
            <button
              onClick={() => copyToClipboard(url, 'Link')}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <ClipboardDocumentIcon className="w-4 h-4" />
              Copy link
            </button>
            <button
              onClick={() => copyToClipboard(citation, 'Citation')}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <ClipboardDocumentIcon className="w-4 h-4" />
              Copy citation
            </button>
          </div>
        </>
      )}
    </div>
  );
}
