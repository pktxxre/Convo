'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { useSession } from '@/context/SessionContext';
import { TOPICS } from '@/lib/filler';
import type { PostType } from '@/types';

const POST_TYPES: { value: PostType; label: string; description: string; maxChars?: number }[] = [
  { value: 'short', label: 'Short', description: 'Quick take or question', maxChars: 280 },
  { value: 'long', label: 'Long', description: 'In-depth post with a title' },
  { value: 'prompt', label: 'Prompt', description: 'Open question for discussion' },
];

const MAX_POSTS_PER_DAY = 5;

export default function ComposePage() {
  const { user, bumpPostsToday } = useSession();
  const router = useRouter();

  const [postType, setPostType] = useState<PostType>('short');
  const [topicId, setTopicId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const postsLeft = MAX_POSTS_PER_DAY - (user?.postsToday ?? 0);
  const atLimit = postsLeft <= 0;
  const maxChars = postType === 'short' ? 280 : undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (atLimit) { setError("You've reached your 5 posts/day limit. Come back tomorrow!"); return; }
    if (!topicId) { setError('Please select a topic.'); return; }
    if (!body.trim()) { setError('Post body cannot be empty.'); return; }
    if (maxChars && body.length > maxChars) { setError(`Short posts are limited to ${maxChars} characters.`); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    bumpPostsToday();
    router.replace('/feed');
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[#DBDBDB] dark:border-[#38383A] bg-white dark:bg-[#2C2C2E] text-[#1a1a1a] dark:text-[#F5F5F5] text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-[#A8A8A8] dark:placeholder:text-[#636366]";

  return (
    <AppShell title="New Post" showBack hideNav>
      <form onSubmit={handleSubmit} className="px-4 pt-4 pb-8 space-y-5">

        {/* Daily limit */}
        <div className={[
          'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium',
          atLimit
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            : postsLeft <= 2
              ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
              : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
        ].join(' ')}>
          <span>{atLimit ? '🚫' : '✏️'}</span>
          <span>
            {atLimit
              ? "You've used all 5 posts today."
              : `${postsLeft} of ${MAX_POSTS_PER_DAY} posts remaining today`}
          </span>
        </div>

        {/* Post type */}
        <div>
          <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] mb-2">Post type</p>
          <div className="grid grid-cols-3 gap-2">
            {POST_TYPES.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => { setPostType(type.value); setTitle(''); setBody(''); }}
                className={[
                  'p-3 rounded-xl border-2 text-left transition-all',
                  postType === type.value
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-[#DBDBDB] dark:border-[#38383A] hover:border-[#ABABAB] dark:hover:border-[#636366]',
                ].join(' ')}
              >
                <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">{type.label}</p>
                <p className="text-xs text-[#737373] dark:text-[#ABABAB] mt-0.5 leading-tight">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] mb-1.5">
            Topic <span className="text-red-400">*</span>
          </label>
          <select
            value={topicId}
            onChange={e => setTopicId(e.target.value)}
            className={inputClass}
          >
            <option value="">Choose a topic…</option>
            {TOPICS.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.icon} {topic.name}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        {(postType === 'long' || postType === 'prompt') && (
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={postType === 'prompt' ? "What's your question?" : "Give your post a title"}
              maxLength={120}
              className={inputClass}
            />
          </div>
        )}

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5] mb-1.5">
            {postType === 'prompt' ? 'Context (optional)' : 'Body'}{' '}
            {postType !== 'prompt' && <span className="text-red-400">*</span>}
          </label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={
              postType === 'short' ? "What's on your mind? (280 chars)"
              : postType === 'prompt' ? "Add more context…"
              : "Write your post…"
            }
            rows={postType === 'long' ? 8 : 4}
            className={`${inputClass} resize-none`}
          />
          {maxChars && (
            <div className="flex justify-end mt-1">
              <span className={`text-xs ${body.length > maxChars ? 'text-red-500' : 'text-[#A8A8A8] dark:text-[#636366]'}`}>
                {body.length}/{maxChars}
              </span>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || atLimit || !body.trim() || !topicId}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-base disabled:bg-indigo-300 dark:disabled:bg-indigo-900 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </form>
    </AppShell>
  );
}
