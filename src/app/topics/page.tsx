'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import TopicCard from '@/components/topics/TopicCard';
import { useSession } from '@/context/SessionContext';
import { TOPICS } from '@/lib/filler';

type FilterMode = 'all' | 'major' | 'joined';

export default function TopicsPage() {
  const { user } = useSession();
  const [filter, setFilter] = useState<FilterMode>('all');

  const filteredTopics = TOPICS.filter(topic => {
    if (filter === 'major') return user?.major && topic.relatedMajors.includes(user.major);
    if (filter === 'joined') return user?.topicIds.includes(topic.id);
    return true;
  });

  const filterOptions: { value: FilterMode; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'major', label: 'For your major' },
    { value: 'joined', label: 'Joined' },
  ];

  return (
    <AppShell title="Topics">
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={[
                'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 border',
                filter === opt.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-[#1C1C1E] text-[#1a1a1a] dark:text-[#E5E5E5] border-[#DBDBDB] dark:border-[#38383A] hover:border-[#ABABAB] dark:hover:border-[#636366]',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="space-y-2 pb-4">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 text-[#A8A8A8] dark:text-[#636366]">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm">No topics match this filter.</p>
            </div>
          ) : (
            filteredTopics.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isRecommended={!!user?.major && topic.relatedMajors.includes(user.major)}
                isSubscribed={user?.topicIds.includes(topic.id)}
              />
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
