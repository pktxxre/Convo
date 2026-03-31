'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ReplyCard from '@/components/post/ReplyCard';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { getPostById, getRepliesByPost, getTopicById } from '@/lib/filler';
import { formatRelativeTime } from '@/lib/utils';
import { useSession } from '@/context/SessionContext';

const POST_TYPE_BADGE = {
  short: { label: 'Short', variant: 'green' as const },
  long: { label: 'Long', variant: 'blue' as const },
  prompt: { label: 'Prompt', variant: 'orange' as const },
};

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;
  const { user } = useSession();

  const post = getPostById(postId);
  const replies = getRepliesByPost(postId);
  const topic = post ? getTopicById(post.topicId) : undefined;

  const [replyText, setReplyText] = useState('');
  const [replyState, setReplyState] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [reportState, setReportState] = useState<'idle' | 'reported'>('idle');
  const [localReplies, setLocalReplies] = useState(replies);

  if (!post) {
    return (
      <AppShell title="Thread" showBack>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-600 font-medium">Post not found</p>
          <Link href="/feed" className="text-indigo-600 text-sm mt-3 hover:underline">
            Back to feed
          </Link>
        </div>
      </AppShell>
    );
  }

  const badge = POST_TYPE_BADGE[post.type];

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || !user || !post) return;
    setReplyState('submitting');
    await new Promise(r => setTimeout(r, 700));
    setLocalReplies(prev => [
      ...prev,
      {
        id: `r_${Date.now()}`,
        postId: post.id,
        authorId: user.id,
        authorName: user.name,
        authorMajor: user.major,
        body: replyText.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setReplyText('');
    setReplyState('done');
    setTimeout(() => setReplyState('idle'), 2000);
  }

  function handleReport() {
    setReportState('reported');
    setTimeout(() => setReportState('idle'), 3000);
  }

  return (
    <AppShell title="Thread" showBack>
      <div className="px-4 pt-4">
        {/* Topic breadcrumb */}
        {topic && (
          <Link
            href={`/topics/${topic.id}`}
            className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium mb-3 hover:underline"
          >
            <span>{topic.icon}</span>
            <span>{topic.name}</span>
          </Link>
        )}

        {/* Full post */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
          {/* Author row */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar name={post.authorName} size="md" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.authorName}</p>
              <p className="text-xs text-gray-500">{post.authorMajor} · {formatRelativeTime(post.createdAt)}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant={badge.variant}>{badge.label}</Badge>
              <button
                onClick={handleReport}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="Report post"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </button>
            </div>
          </div>

          {post.title && (
            <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug">{post.title}</h2>
          )}
          <p className="text-sm text-gray-800 leading-relaxed">{post.body}</p>

          {reportState === 'reported' && (
            <p className="text-xs text-orange-600 mt-3 bg-orange-50 px-3 py-2 rounded-lg">
              Thanks — this post has been reported for review.
            </p>
          )}
        </div>

        {/* Reply composer */}
        {user && (
          <form onSubmit={handleReply} className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <Avatar name={user.name} size="sm" />
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Add a reply…"
                  rows={2}
                  className="w-full text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none"
                  disabled={replyState === 'submitting'}
                />
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  {replyState === 'done' ? (
                    <span className="text-xs text-emerald-600 font-medium">Reply posted ✓</span>
                  ) : (
                    <span className="text-xs text-gray-400">{replyText.length}/280</span>
                  )}
                  <button
                    type="submit"
                    disabled={!replyText.trim() || replyState === 'submitting' || replyText.length > 280}
                    className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                  >
                    {replyState === 'submitting' && (
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Replies */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-1">
            {localReplies.length} {localReplies.length === 1 ? 'reply' : 'replies'}
          </p>
          {localReplies.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">
              No replies yet. Be the first!
            </p>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl px-4 divide-y divide-gray-50">
              {localReplies.map(reply => (
                <ReplyCard key={reply.id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
