'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import PostCard from '@/components/feed/PostCard';
import { getTopicById, getPostsByTopic } from '@/lib/filler';

type SortMode = 'recent' | 'active';

export default function TopicDetailPage() {
  const params = useParams<{ id: string }>();
  const topicId = params.id;
  const [sort, setSort] = useState<SortMode>('recent');

  const topic = getTopicById(topicId);
  const posts = [...getPostsByTopic(topicId)].sort((a, b) => {
    if (sort === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.replyCount - a.replyCount;
  });

  if (!topic) {
    return (
      <AppShell title="Topic" showBack>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-600 font-medium">Topic not found</p>
          <Link href="/topics" className="text-indigo-600 text-sm mt-3 hover:underline">
            Browse all topics
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={topic.name} showBack>
      {/* Topic hero */}
      <div className="px-4 pt-4 pb-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
            {topic.icon}
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{topic.name}</h2>
            <p className="text-xs text-gray-500">{topic.postCount} posts</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">{topic.description}</p>

        {/* Sort */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mt-3">
          {(['recent', 'active'] as SortMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              className={[
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                sort === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500',
              ].join(' ')}
            >
              {mode === 'recent' ? 'Recent' : 'Active'}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 pt-3 space-y-3 pb-4">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-3xl mb-2">{topic.icon}</p>
            <p className="text-sm">No posts yet in this topic.</p>
            <Link
              href="/compose"
              className="inline-block mt-3 text-sm text-indigo-600 font-medium hover:underline"
            >
              Be the first to post
            </Link>
          </div>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} showTopic={false} />)
        )}
      </div>
    </AppShell>
  );
}
