'use client';

import { useRouter } from 'next/navigation';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  logoMode?: boolean;
  action?: React.ReactNode;
}

export default function TopBar({ title, showBack, logoMode, action }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 min-h-[56px]">
      {showBack ? (
        <button
          onClick={() => router.back()}
          className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="Go back"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      ) : logoMode ? (
        <span className="text-xl font-bold text-indigo-600 tracking-tight">Convo</span>
      ) : null}

      {title && (
        <h1 className="flex-1 text-base font-semibold text-gray-900 truncate">{title}</h1>
      )}
      {!title && <div className="flex-1" />}

      {action && <div className="ml-auto">{action}</div>}
    </header>
  );
}
