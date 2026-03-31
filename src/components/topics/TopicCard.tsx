import Link from 'next/link';
import type { Topic } from '@/types';

interface TopicCardProps {
  topic: Topic;
  isRecommended?: boolean;
  isSubscribed?: boolean;
}

export default function TopicCard({ topic, isRecommended, isSubscribed }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.id}`} className="block">
      <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-indigo-100 hover:shadow-sm transition-all active:scale-[0.99] flex items-center gap-3">
        {/* Icon */}
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {topic.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-900 truncate">{topic.name}</span>
            {isRecommended && (
              <span className="bg-amber-100 text-amber-700 text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0">
                For you
              </span>
            )}
            {isSubscribed && (
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0">
                Joined
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{topic.description}</p>
          <p className="text-xs text-gray-400 mt-1">{topic.postCount} posts</p>
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
