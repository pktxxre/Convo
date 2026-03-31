'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const active = (href: string) =>
    href === '/feed' ? pathname === '/feed' : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-[#DBDBDB]">
      <div className="max-w-lg mx-auto flex items-center justify-around h-[52px] px-4">

        {/* Home */}
        <Link href="/feed" aria-label="Home" className="flex items-center justify-center w-12 h-12">
          <svg
            className={`w-[26px] h-[26px] transition-colors ${active('/feed') ? 'text-[#1a1a1a]' : 'text-[#C7C7C7]'}`}
            fill={active('/feed') ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={active('/feed') ? 0 : 1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>

        {/* Topics */}
        <Link href="/topics" aria-label="Topics" className="flex items-center justify-center w-12 h-12">
          <svg
            className={`w-[24px] h-[24px] transition-colors ${active('/topics') ? 'text-[#1a1a1a]' : 'text-[#C7C7C7]'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={active('/topics') ? 2.2 : 1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </Link>

        {/* Compose */}
        <Link href="/compose" aria-label="New post" className="flex items-center justify-center">
          <div className="w-[42px] h-[42px] bg-indigo-600 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform">
            <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </Link>

        {/* Profile */}
        <Link href="/profile" aria-label="Profile" className="flex items-center justify-center w-12 h-12">
          <svg
            className={`w-[26px] h-[26px] transition-colors ${active('/profile') ? 'text-[#1a1a1a]' : 'text-[#C7C7C7]'}`}
            fill={active('/profile') ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={active('/profile') ? 0 : 1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>

      </div>
    </nav>
  );
}
