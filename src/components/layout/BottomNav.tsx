'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const active = (href: string) =>
    href === '/feed' ? pathname === '/feed' : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-[#DBDBDB]">
      <div className="max-w-lg mx-auto flex items-center justify-around h-[52px] px-2">

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

        {/* Spin Wheel — centre hero button */}
        <Link href="/spin" aria-label="Spin the wheel" className="flex items-center justify-center">
          <div
            className={[
              'w-[46px] h-[46px] rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90',
              active('/spin')
                ? 'bg-indigo-700 shadow-indigo-300'
                : 'bg-indigo-600',
            ].join(' ')}
          >
            {/* Wheel / spin icon */}
            <svg className="w-[22px] h-[22px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              {/* Outer circle */}
              <circle cx="12" cy="12" r="9" />
              {/* Spokes */}
              <line x1="12" y1="3"  x2="12" y2="7"  />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="3"  y1="12" x2="7"  y2="12" />
              <line x1="17" y1="12" x2="21" y2="12" />
              <line x1="5.6"  y1="5.6"  x2="8.5"  y2="8.5"  />
              <line x1="15.5" y1="15.5" x2="18.4" y2="18.4" />
              <line x1="18.4" y1="5.6"  x2="15.5" y2="8.5"  />
              <line x1="8.5"  y1="15.5" x2="5.6"  y2="18.4" />
              {/* Hub dot */}
              <circle cx="12" cy="12" r="2" fill="white" stroke="none" />
            </svg>
          </div>
        </Link>

        {/* Compose */}
        <Link href="/compose" aria-label="New post" className="flex items-center justify-center w-12 h-12">
          <svg
            className={`w-[24px] h-[24px] transition-colors ${active('/compose') ? 'text-[#1a1a1a]' : 'text-[#C7C7C7]'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={active('/compose') ? 2.2 : 1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
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
