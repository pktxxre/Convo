'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import PostCard from '@/components/feed/PostCard';
import { useSession } from '@/context/SessionContext';
import { useVotes } from '@/context/VoteContext';
import { SAMPLE_POSTS, getCampusById } from '@/lib/filler';

type FeedTab = 'recent' | 'hot';

function BellIcon() {
  return (
    <svg className="w-[22px] h-[22px] text-[#1a1a1a] dark:text-[#F5F5F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

export default function FeedPage() {
  const { user } = useSession();
  const { getScore } = useVotes();
  const campus = user ? getCampusById(user.campusId) : undefined;
  const [tab, setTab] = useState<FeedTab>('recent');

  const posts = tab === 'recent'
    ? [...SAMPLE_POSTS].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [...SAMPLE_POSTS].sort((a, b) => getScore(b) - getScore(a));

  return (
    <AppShell
      logoMode
      topBarAction={
        <button aria-label="Notifications" className="p-1.5 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#2C2C2E] active:bg-gray-200 dark:active:bg-[#3A3A3C] transition-colors">
          <BellIcon />
        </button>
      }
    >
      {campus && (
        <div className="px-4 pt-4 pb-1">
          <p className="text-[12px] font-medium text-[#737373] dark:text-[#ABABAB] uppercase tracking-widest">
            {campus.name}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex px-4 pt-3 pb-1 gap-1">
        {(['recent', 'hot'] as FeedTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors',
              tab === t
                ? 'bg-[#1a1a1a] dark:bg-[#F5F5F5] text-white dark:text-black'
                : 'text-[#737373] dark:text-[#ABABAB] hover:bg-[#F0F0F0] dark:hover:bg-[#2C2C2E]',
            ].join(' ')}
          >
            {t === 'recent' ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill={tab === 'hot' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
                Hot
              </>
            )}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4 pt-2 space-y-2">
        {posts.map(post => (
          <PostCard key={post.id} post={post} showTopic />
        ))}
      </div>
    </AppShell>
  );
}
