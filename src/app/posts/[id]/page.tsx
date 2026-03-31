'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import ReplyCard from '@/components/post/ReplyCard';
import Avatar from '@/components/ui/Avatar';
import { getPostById, getRepliesByPost, getTopicById } from '@/lib/filler';
import { formatRelativeTime } from '@/lib/utils';
import { useSession } from '@/context/SessionContext';

const TYPE_COLOR: Record<string, string> = {
  short: 'text-emerald-600 bg-emerald-50',
  long: 'text-sky-700 bg-sky-50',
  prompt: 'text-orange-600 bg-orange-50',
};

function FlagIcon() {
  return (
    <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  );
}

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
          <p className="text-[#1a1a1a] font-medium">Post not found</p>
          <Link href="/feed" className="text-indigo-600 text-sm mt-3 hover:underline">
            Back to feed
          </Link>
        </div>
      </AppShell>
    );
  }

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

  const typeColors = TYPE_COLOR[post.type];

  return (
    <AppShell showBack>
      <div className="pb-8">

        {/* ── Full post (Substack reading mode) ── */}
        <div className="bg-white border-b border-[#DBDBDB] px-5 pt-5 pb-6">

          {/* Topic + type row */}
          <div className="flex items-center gap-2 mb-4">
            {topic && (
              <Link
                href={`/topics/${topic.id}`}
                className="text-[12px] text-[#737373] hover:text-indigo-600 transition-colors"
              >
                {topic.icon} {topic.name}
              </Link>
            )}
            <span className="text-[#DBDBDB]">·</span>
            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${typeColors}`}>
              {post.type}
            </span>
          </div>

          {/* Title (Substack-style: large, bold) */}
          {post.title && (
            <h1 className="text-[20px] font-bold text-[#1a1a1a] leading-snug mb-4">
              {post.title}
            </h1>
          )}

          {/* Author byline */}
          <div className="flex items-center gap-2.5 mb-5">
            <Avatar name={post.authorName} size="sm" />
            <div>
              <p className="text-[13px] font-semibold text-[#1a1a1a]">{post.authorName}</p>
              <p className="text-[11px] text-[#737373]">
                {post.authorMajor} · {formatRelativeTime(post.createdAt)}
              </p>
            </div>
            <button
              onClick={handleReport}
              className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 text-[#A8A8A8] hover:text-[#737373] transition-colors"
              title="Report post"
            >
              <FlagIcon />
            </button>
          </div>

          {/* Body (Substack reading typography) */}
          <p className="text-[15px] text-[#1a1a1a] leading-[1.75]">{post.body}</p>

          {reportState === 'reported' && (
            <p className="text-[12px] text-orange-600 mt-4 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
              Thanks — this post has been flagged for review.
            </p>
          )}
        </div>

        {/* ── Reply count ── */}
        <div className="px-5 py-3 border-b border-[#F0F0F0] bg-white">
          <p className="text-[12px] font-semibold text-[#737373] uppercase tracking-wide">
            {localReplies.length} {localReplies.length === 1 ? 'reply' : 'replies'}
          </p>
        </div>

        {/* ── Replies ── */}
        {localReplies.length > 0 && (
          <div className="bg-white divide-y divide-[#F5F5F5]">
            {localReplies.map(reply => (
              <div key={reply.id} className="px-5">
                <ReplyCard reply={reply} />
              </div>
            ))}
          </div>
        )}

        {localReplies.length === 0 && (
          <p className="text-[13px] text-[#A8A8A8] py-10 text-center bg-white">
            No replies yet. Start the conversation.
          </p>
        )}

        {/* ── Reply composer (Instagram-style, attached at bottom of replies) ── */}
        {user && (
          <form
            onSubmit={handleReply}
            className="bg-white border-t border-[#DBDBDB] px-4 py-3 flex items-start gap-3"
          >
            <Avatar name={user.name} size="sm" />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Reply as ${user.name.split(' ')[0]}…`}
                rows={replyText.length > 60 ? 3 : 1}
                className="w-full text-[14px] text-[#1a1a1a] placeholder:text-[#A8A8A8] resize-none focus:outline-none leading-[1.5] mt-1"
                disabled={replyState === 'submitting'}
              />
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              {replyState === 'done' && (
                <span className="text-[11px] text-emerald-600 font-medium">✓ Posted</span>
              )}
              <button
                type="submit"
                disabled={!replyText.trim() || replyState === 'submitting' || replyText.length > 280}
                className="text-[13px] font-semibold text-indigo-600 disabled:text-[#A8A8A8] disabled:cursor-not-allowed hover:text-indigo-700 transition-colors"
              >
                {replyState === 'submitting' ? (
                  <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin inline-block" />
                ) : 'Post'}
              </button>
            </div>
          </form>
        )}

      </div>
    </AppShell>
  );
}
