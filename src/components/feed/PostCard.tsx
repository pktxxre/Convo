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
      <article className="bg-white border border-[#DBDBDB] rounded-xl overflow-hidden transition-all group-active:scale-[0.995]">

        {/* ── Author row ── */}
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
          <Avatar name={post.authorName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#1a1a1a] leading-none">{post.authorName}</p>
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              <span className="text-[11px] text-[#737373]">{post.authorMajor}</span>
              {showTopic && topic && (
                <>
                  <span className="text-[#DBDBDB] text-[10px]">·</span>
                  <span className="text-[11px] text-[#737373]">{topic.icon} {topic.name}</span>
                </>
              )}
            </div>
          </div>
          <span className="text-[11px] text-[#A8A8A8] flex-shrink-0">
            {formatRelativeTime(post.createdAt)}
          </span>
        </div>

        {/* ── Content ── */}
        <div className="px-4 pb-3">
          {post.title ? (
            /* Long / Prompt: prominent title (Substack-style) */
            <>
              <h3 className="text-[15px] font-bold text-[#1a1a1a] leading-snug mb-1.5">
                {post.title}
              </h3>
              <p className="text-[13.5px] text-[#404040] leading-[1.55] line-clamp-3">
                {post.body}
              </p>
            </>
          ) : (
            /* Short: body only, slightly larger */
            <p className="text-[14px] text-[#1a1a1a] leading-[1.6] line-clamp-4">
              {post.body}
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-2.5 border-t border-[#F0F0F0] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[12px] text-[#737373]">
            <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>
              {post.replyCount === 0 ? 'Reply' : `${post.replyCount} ${post.replyCount === 1 ? 'reply' : 'replies'}`}
            </span>
          </div>
          {typeLabel && (
            <span className="text-[10px] font-semibold tracking-wide uppercase text-[#A8A8A8]">
              {typeLabel}
            </span>
          )}
        </div>

      </article>
    </Link>
  );
}
