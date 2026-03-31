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
    <header className="sticky top-0 z-20 bg-white border-b border-[#DBDBDB] px-4 flex items-center min-h-[52px]">
      {/* Left: back button or Convo wordmark */}
      {showBack ? (
        <button
          onClick={() => router.back()}
          className="-ml-1 p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="Go back"
        >
          <svg className="w-[20px] h-[20px] text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      ) : logoMode ? (
        /* Instagram-style: wordmark on the left */
        <span className="text-[22px] font-bold text-[#1a1a1a] tracking-tight select-none">
          Convo
        </span>
      ) : null}

      {/* Center/flex title */}
      {title && (
        <h1 className="flex-1 ml-1 text-[15px] font-semibold text-[#1a1a1a] truncate">{title}</h1>
      )}
      {!title && <div className="flex-1" />}

      {/* Right action */}
      {action && <div>{action}</div>}
    </header>
  );
}
