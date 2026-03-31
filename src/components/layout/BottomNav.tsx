'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/feed',
    label: 'Home',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-indigo-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/topics',
    label: 'Topics',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-indigo-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
  },
  {
    href: '/compose',
    label: 'Post',
    icon: (_active: boolean) => (
      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? 'text-indigo-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2 : 1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 safe-b">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || (item.href !== '/feed' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl min-w-[60px]"
            >
              {item.icon(active)}
              {item.href !== '/compose' && (
                <span className={`text-[10px] font-medium ${active ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
