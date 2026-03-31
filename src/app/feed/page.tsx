'use client';

import AppShell from '@/components/layout/AppShell';
import PostCard from '@/components/feed/PostCard';
import { useSession } from '@/context/SessionContext';
import { SAMPLE_POSTS, getCampusById } from '@/lib/filler';

const posts = [...SAMPLE_POSTS].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);

function BellIcon() {
  return (
    <svg className="w-[22px] h-[22px] text-[#1a1a1a] dark:text-[#F5F5F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

export default function FeedPage() {
  const { user } = useSession();
  const campus = user ? getCampusById(user.campusId) : undefined;

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
        <div className="px-4 pt-4 pb-2">
          <p className="text-[12px] font-medium text-[#737373] dark:text-[#ABABAB] uppercase tracking-widest">
            {campus.name}
          </p>
        </div>
      )}

      <div className="px-4 pb-4 space-y-2">
        {posts.map(post => (
          <PostCard key={post.id} post={post} showTopic />
        ))}
      </div>
    </AppShell>
  );
}
