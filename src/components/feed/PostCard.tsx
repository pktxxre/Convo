import Link from 'next/link';
import type { Post } from '@/types';
import { getTopicById } from '@/lib/filler';
import { formatRelativeTime } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';

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

  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <article className="bg-white dark:bg-[#1C1C1E] border border-[#DBDBDB] dark:border-[#38383A] rounded-xl overflow-hidden transition-all group-active:scale-[0.995]">

        {/* Author row */}
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
          <Avatar name={post.authorName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] leading-none">{post.authorName}</p>
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              <span className="text-[11px] text-[#737373] dark:text-[#ABABAB]">{post.authorMajor}</span>
              {showTopic && topic && (
                <>
                  <span className="text-[#DBDBDB] dark:text-[#48484A] text-[10px]">·</span>
                  <span className="text-[11px] text-[#737373] dark:text-[#ABABAB]">{topic.icon} {topic.name}</span>
                </>
              )}
            </div>
          </div>
          <span className="text-[11px] text-[#A8A8A8] dark:text-[#636366] flex-shrink-0">
            {formatRelativeTime(post.createdAt)}
          </span>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          {post.title ? (
            <>
              <h3 className="text-[15px] font-bold text-[#1a1a1a] dark:text-[#F5F5F5] leading-snug mb-1.5">
                {post.title}
              </h3>
              <p className="text-[13.5px] text-[#404040] dark:text-[#ABABAB] leading-[1.55] line-clamp-3">
                {post.body}
              </p>
            </>
          ) : (
            <p className="text-[14px] text-[#1a1a1a] dark:text-[#E5E5E5] leading-[1.6] line-clamp-4">
              {post.body}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#F0F0F0] dark:border-[#2C2C2E] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[12px] text-[#737373] dark:text-[#ABABAB]">
            <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>
              {post.replyCount === 0 ? 'Reply' : `${post.replyCount} ${post.replyCount === 1 ? 'reply' : 'replies'}`}
            </span>
          </div>
          {typeLabel && (
            <span className="text-[10px] font-semibold tracking-wide uppercase text-[#A8A8A8] dark:text-[#636366]">
              {typeLabel}
            </span>
          )}
        </div>

      </article>
    </Link>
  );
}
