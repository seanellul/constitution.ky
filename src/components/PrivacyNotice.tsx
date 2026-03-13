'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isAnalyticsEnabled, setAnalyticsOptOut } from '@/lib/analytics';

export default function PrivacyNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the notice
    const hasSeenNotice = localStorage.getItem('privacy_notice_seen') === 'true';
    
    if (!hasSeenNotice) {
      // Show the notice after a short delay
      const timer = setTimeout(() => {
        setVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacy_notice_seen', 'true');
    setVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem('privacy_notice_seen', 'true');
    setVisible(false);
  };

  // If the notice has been seen, just show a small indicator
  if (!visible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button 
          onClick={() => setVisible(true)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-md flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" 
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="fixed bottom-0 inset-x-0 px-4 pb-4 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900">Privacy Notice</h3>
            <button 
              onClick={() => setVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
          
          <div className="mt-4 text-sm">
            <p className="text-gray-600 mb-3">
              Constitution.ky collects anonymized usage data to improve your experience. We track:
            </p>
            <ul className="list-disc pl-5 mb-3 text-gray-600 space-y-1">
              <li>Pages you visit (no personal information)</li>
              <li>Articles and chapters you read</li>
              <li>Search terms (to improve search results)</li>
              <li>Number of active users (for our public counter)</li>
            </ul>
            <p className="text-gray-600 mb-3">
              We use randomly generated session IDs that change every 24 hours. All data is automatically deleted after 365 days.
            </p>
            <p className="text-gray-600 mb-3">
              We do <span className="font-semibold">not</span> collect your IP address, name, email, or any personally identifiable information.
            </p>
          </div>
          
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleAccept}
              className="bg-primary-DEFAULT hover:bg-primary-700 text-white px-6 py-2 rounded text-sm font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 