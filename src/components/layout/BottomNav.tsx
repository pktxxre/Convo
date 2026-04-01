'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  const active = (href: string) =>
    href === '/feed' ? pathname === '/feed' : pathname.startsWith(href);

  function go(href: string) {
    setSheetOpen(false);
    router.push(href);
  }

  return (
    <>
      {/* Backdrop */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* Bottom sheet — anchored at bottom:0 so translate-y-full goes fully off-screen */}
      <div
        className={[
          'fixed left-0 right-0 z-40 bg-white dark:bg-[#1C1C1E] rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-w-lg mx-auto',
          sheetOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full pointer-events-none',
        ].join(' ')}
        style={{ bottom: 0 }}
      >
        {/* pb-[68px] clears the 52px nav bar so content floats above it */}
        <div className="px-4 pt-3 pb-[68px]">
          {/* Handle */}
          <div className="w-9 h-1 rounded-full bg-[#DBDBDB] dark:bg-[#38383A] mx-auto mb-4" />

          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#A8A8A8] dark:text-[#636366] mb-3 px-1">
            New Post
          </p>

          <div className="flex flex-col gap-2">
            {/* Convo Camera */}
            <button
              onClick={() => go('/camera')}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-[#F5F5F5] dark:bg-[#2C2C2E] active:scale-[.98] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">Convo Camera</p>
                <p className="text-[12px] text-[#737373] dark:text-[#ABABAB]">Dual-photo moment with your campus</p>
              </div>
            </button>

            {/* Spin the Wheel */}
            <button
              onClick={() => go('/spin')}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-[#F5F5F5] dark:bg-[#2C2C2E] active:scale-[.98] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4B2E83] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="3"  x2="12" y2="7"  />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <line x1="3"  y1="12" x2="7"  y2="12" />
                  <line x1="17" y1="12" x2="21" y2="12" />
                  <line x1="5.6"  y1="5.6"  x2="8.5"  y2="8.5"  />
                  <line x1="15.5" y1="15.5" x2="18.4" y2="18.4" />
                  <line x1="18.4" y1="5.6"  x2="15.5" y2="8.5"  />
                  <line x1="8.5"  y1="15.5" x2="5.6"  y2="18.4" />
                  <circle cx="12" cy="12" r="2" fill="white" stroke="none" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">Spin the Wheel</p>
                <p className="text-[12px] text-[#737373] dark:text-[#ABABAB]">Start a convo with a random major</p>
              </div>
            </button>

            {/* Write a Post */}
            <button
              onClick={() => go('/compose')}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-[#F5F5F5] dark:bg-[#2C2C2E] active:scale-[.98] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">Write a Post</p>
                <p className="text-[12px] text-[#737373] dark:text-[#ABABAB]">Share a thought, question, or discussion</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-[#1C1C1E] border-t border-[#DBDBDB] dark:border-[#38383A]">
        <div className="max-w-lg mx-auto flex items-center justify-around h-[52px] px-2">

          {/* Home */}
          <Link href="/feed" aria-label="Home" className="flex items-center justify-center w-12 h-12">
            <svg
              className={`w-[26px] h-[26px] transition-colors ${active('/feed') ? 'text-[#1a1a1a] dark:text-[#F5F5F5]' : 'text-[#C7C7C7] dark:text-[#48484A]'}`}
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
              className={`w-[24px] h-[24px] transition-colors ${active('/topics') ? 'text-[#1a1a1a] dark:text-[#F5F5F5]' : 'text-[#C7C7C7] dark:text-[#48484A]'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={active('/topics') ? 2.2 : 1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </Link>

          {/* [+] Post umbrella */}
          <button
            onClick={() => setSheetOpen(prev => !prev)}
            aria-label="New post"
            className="flex items-center justify-center w-12 h-12"
          >
            <div className={[
              'w-[42px] h-[42px] rounded-[12px] border-2 flex items-center justify-center transition-colors',
              sheetOpen
                ? 'border-[#1a1a1a] dark:border-[#F5F5F5] bg-[#1a1a1a] dark:bg-[#F5F5F5]'
                : 'border-[#C7C7C7] dark:border-[#48484A]',
            ].join(' ')}>
              <svg
                className={`w-[20px] h-[20px] transition-colors ${sheetOpen ? 'text-white dark:text-black' : 'text-[#C7C7C7] dark:text-[#48484A]'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </button>

          {/* Major Rooms */}
          <Link href="/majors" aria-label="Major Rooms" className="flex items-center justify-center w-12 h-12">
            <svg
              className={`w-[24px] h-[24px] transition-colors ${active('/majors') ? 'text-[#1a1a1a] dark:text-[#F5F5F5]' : 'text-[#C7C7C7] dark:text-[#48484A]'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={active('/majors') ? 2.2 : 1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </Link>

          {/* Profile */}
          <Link href="/profile" aria-label="Profile" className="flex items-center justify-center w-12 h-12">
            <svg
              className={`w-[26px] h-[26px] transition-colors ${active('/profile') ? 'text-[#1a1a1a] dark:text-[#F5F5F5]' : 'text-[#C7C7C7] dark:text-[#48484A]'}`}
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
    </>
  );
}
