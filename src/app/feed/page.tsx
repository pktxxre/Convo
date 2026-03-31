'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import PostCard from '@/components/feed/PostCard';
import { useSession } from '@/context/SessionContext';
import { SAMPLE_POSTS, getCampusById } from '@/lib/filler';

type SortMode = 'latest' | 'popular';

export default function FeedPage() {
  const { user } = useSession();
  const [sort, setSort] = useState<SortMode>('latest');

  const campus = user ? getCampusById(user.campusId) : undefined;

  const posts = [...SAMPLE_POSTS].sort((a, b) => {
    if (sort === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.replyCount - a.replyCount;
  });

  const campusLabel = campus?.shortName ?? 'Campus';

  return (
    <AppShell logoMode>
      {/* Campus header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{campusLabel} Feed</h2>
            <p className="text-xs text-gray-500">{posts.length} posts today</p>
          </div>
        </div>

        {/* Sort tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {(['latest', 'popular'] as SortMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              className={[
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                sort === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500',
              ].join(' ')}
            >
              {mode === 'latest' ? 'Latest' : 'Popular'}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 pt-2 space-y-3 pb-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} showTopic />
        ))}
      </div>
    </AppShell>
  );
}
