'use client';

import Link from 'next/link';
import type { Post } from '@/types';
import { getTopicById } from '@/lib/filler';
import { formatCardDate } from '@/lib/utils';
import { useVotes } from '@/context/VoteContext';
import Avatar from '@/components/ui/Avatar';

// Typography scale
// heading:  32px — post titles
// body:     18px — post body text
// caption:  14px — author row, footer meta

// Spacing scale (multiples of 8px)
// xs:  8px  → space-2
// sm:  16px → space-4
// md:  24px → space-6
// lg:  32px → space-8
// xl:  48px → space-12

const TYPE_LABEL: Record<Post['type'], string> = {
  short: '',
  long: 'Article',
  prompt: 'Discussion',
};

interface PostCardProps {
  post: Post;
  showTopic?: boolean;
}

export default function PostCard({ post, showTopic = true }: PostCardProps) {
  const topic = getTopicById(post.topicId);
  const typeLabel = TYPE_LABEL[post.type];
  const { getVote, vote, getUpvotes, getDownvotes } = useVotes();
  const userVote = getVote(post.id);
  const upvotes = getUpvotes(post);
  const downvotes = getDownvotes(post);
  const score = upvotes - downvotes;

  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <article className="bg-white dark:bg-[#1C1C1E] border border-[#DBDBDB] dark:border-[#38383A] rounded-xl overflow-hidden transition-all group-active:scale-[0.995]">

        {/* ── Author row — caption 14px, sm (16px) padding ── */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <Avatar name={post.authorName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] leading-none truncate">
              {post.authorName}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[14px] text-[#737373] dark:text-[#ABABAB]">{post.authorMajor}</span>
              {showTopic && topic && (
                <>
                  <span className="text-[#DBDBDB] dark:text-[#48484A]">·</span>
                  <span className="text-[14px] text-[#737373] dark:text-[#ABABAB]">{topic.icon} {topic.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Content — heading 32px, body 18px, sm (16px) padding ── */}
        <div className="px-4 pb-4">
          {post.title && (
            <h3 className="text-[32px] font-bold text-[#1a1a1a] dark:text-[#F5F5F5] leading-tight mb-2">
              {post.title}
            </h3>
          )}
          <p className={`text-[18px] leading-[1.55] line-clamp-3 ${
            post.title
              ? 'text-[#404040] dark:text-[#ABABAB]'
              : 'text-[#1a1a1a] dark:text-[#E5E5E5] line-clamp-4'
          }`}>
            {post.body}
          </p>
        </div>

        {/* ── Caption footer — 14px, xs (8px) vertical padding ── */}
        <div className="px-4 py-2 border-t border-[#F0F0F0] dark:border-[#2C2C2E] flex items-center justify-between gap-4">

          {/* Left: votes + replies + type */}
          <div className="flex items-center gap-4">

            {/* Vote cluster */}
            <div className="flex items-center gap-2" onClick={e => e.preventDefault()}>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); vote(post.id, 'up'); }}
                aria-label="Upvote"
                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition-colors text-[14px] font-semibold leading-none ${
                  userVote === 'up'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'text-[#A8A8A8] dark:text-[#636366] hover:text-indigo-500 dark:hover:text-indigo-400'
                }`}
              >
                <svg className="w-[14px] h-[14px]" fill={userVote === 'up' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                {upvotes}
              </button>

              <span className={`text-[14px] font-bold tabular-nums w-8 text-center ${
                score > 0 ? 'text-indigo-600 dark:text-indigo-400'
                : score < 0 ? 'text-red-500 dark:text-red-400'
                : 'text-[#A8A8A8] dark:text-[#636366]'
              }`}>
                {score > 0 ? `+${score}` : score}
              </span>

              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); vote(post.id, 'down'); }}
                aria-label="Downvote"
                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition-colors text-[14px] font-semibold leading-none ${
                  userVote === 'down'
                    ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
                    : 'text-[#A8A8A8] dark:text-[#636366] hover:text-red-400 dark:hover:text-red-400'
                }`}
              >
                <svg className="w-[14px] h-[14px]" fill={userVote === 'down' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {downvotes}
              </button>
            </div>

            {/* Reply count */}
            <div className="flex items-center gap-1 text-[14px] text-[#737373] dark:text-[#ABABAB]">
              <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.replyCount === 0 ? 'Reply' : post.replyCount}</span>
            </div>

            {/* Post type label */}
            {typeLabel && (
              <span className="text-[14px] font-semibold text-[#A8A8A8] dark:text-[#636366]">
                {typeLabel}
              </span>
            )}
          </div>

          {/* Right: publish date */}
          <span className="text-[14px] text-[#A8A8A8] dark:text-[#636366] flex-shrink-0 tabular-nums">
            {formatCardDate(post.createdAt)}
          </span>

        </div>
      </article>
    </Link>
  );
}
