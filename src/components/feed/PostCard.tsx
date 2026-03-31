import Link from 'next/link';
import type { Post } from '@/types';
import { getTopicById } from '@/lib/filler';
import { formatRelativeTime } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

const POST_TYPE_BADGE = {
  short: { label: 'Short', variant: 'green' as const },
  long: { label: 'Long', variant: 'blue' as const },
  prompt: { label: 'Prompt', variant: 'orange' as const },
};

interface PostCardProps {
  post: Post;
  showTopic?: boolean;
}

export default function PostCard({ post, showTopic = true }: PostCardProps) {
  const topic = getTopicById(post.topicId);
  const badge = POST_TYPE_BADGE[post.type];

  return (
    <Link href={`/posts/${post.id}`} className="block">
      <article className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-indigo-100 hover:shadow-sm transition-all active:scale-[0.99]">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <Avatar name={post.authorName} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold text-gray-900 truncate">{post.authorName}</span>
              <span className="text-xs text-gray-400">{post.authorMajor}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">{formatRelativeTime(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
              {showTopic && topic && (
                <span className="text-xs text-gray-400">{topic.icon} {topic.name}</span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3">
          {post.title && (
            <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">{post.title}</h3>
          )}
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{post.body}</p>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}</span>
        </div>
      </article>
    </Link>
  );
}
