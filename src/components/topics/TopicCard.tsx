import Link from 'next/link';
import type { Topic } from '@/types';

interface TopicCardProps {
  topic: Topic;
  isRecommended?: boolean;
  isSubscribed?: boolean;
}

export default function TopicCard({ topic, isRecommended, isSubscribed }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.id}`} className="block group">
      <div className="bg-white border border-[#DBDBDB] rounded-xl p-4 flex items-center gap-3.5 transition-all group-active:scale-[0.99]">

        {/* Emoji icon */}
        <div className="w-11 h-11 bg-[#F5F5F5] rounded-xl flex items-center justify-center text-[22px] flex-shrink-0">
          {topic.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[14px] font-semibold text-[#1a1a1a] truncate">{topic.name}</span>
            {isRecommended && (
              <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 border border-amber-200">
                For you
              </span>
            )}
            {isSubscribed && (
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 border border-indigo-100">
                Joined
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#737373] mt-0.5 line-clamp-1">{topic.description}</p>
          <p className="text-[11px] text-[#A8A8A8] mt-1 font-medium">{topic.postCount} posts</p>
        </div>

        {/* Chevron */}
        <svg className="w-4 h-4 text-[#C7C7C7] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>

      </div>
    </Link>
  );
}
