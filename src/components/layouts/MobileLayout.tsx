import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface MobileLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  headerTitle?: string;
  onBack?: () => void;
}

export default function MobileLayout({
  children,
  showHeader = true,
  showFooter = true,
  headerTitle,
  onBack
}: MobileLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
          <div className="h-16 px-4 flex items-center justify-between">
            {onBack ? (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            ) : null}
            <h1 className="text-lg font-semibold text-gray-900">
              {headerTitle || 'ThePassApp'}
            </h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </header>
      )}

      {/* Main Content with page transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`flex-1 ${showHeader ? 'pt-16' : ''} ${
            showFooter ? 'pb-16' : ''
          }`}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Footer Navigation */}
      {showFooter && (
        <footer className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200">
          <nav className="h-16">
            <ul className="h-full flex items-center justify-around px-4">
              <li>
                <a
                  href="/educator"
                  className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="text-xs mt-1">Home</span>
                </a>
              </li>
              <li>
                <a
                  href="/educator/swipe"
                  className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-xs mt-1">Search</span>
                </a>
              </li>
              <li>
                <a
                  href="/educator/interviews"
                  className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs mt-1">Interviews</span>
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-xs mt-1">Profile</span>
                </a>
              </li>
            </ul>
          </nav>
        </footer>
      )}

      {/* Pull to refresh indicator (can be implemented with react-pull-to-refresh) */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div className="h-1 bg-blue-600 transform scale-x-0" />
      </div>
    </div>
  );
}
