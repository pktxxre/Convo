'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import Avatar from '@/components/ui/Avatar';
import { useSession } from '@/context/SessionContext';
import { getCampusById, TOPICS } from '@/lib/filler';

export default function ProfilePage() {
  const { user, signOut } = useSession();
  const router = useRouter();
  const [notifPosts, setNotifPosts] = useState(true);
  const [notifReplies, setNotifReplies] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);

  const campus = user ? getCampusById(user.campusId) : undefined;
  const followedTopics = TOPICS.filter(t => user?.topicIds.includes(t.id));

  function handleSignOut() {
    signOut();
    router.replace('/auth');
  }

  if (!user) return null;

  return (
    <AppShell title="Profile">
      <div className="px-4 pt-4 pb-8 space-y-5">
        {/* Profile header card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="lg" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Campus', value: campus?.shortName ?? '—' },
              { label: 'Major', value: user.major || '—' },
              { label: 'Year', value: user.year },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{user.postsToday}</p>
              <p className="text-xs text-gray-500">Posts today</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{followedTopics.length}</p>
              <p className="text-xs text-gray-500">Topics</p>
            </div>
          </div>
        </div>

        {/* Interests */}
        {user.interests.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map(interest => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        {followedTopics.length > 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Following</h3>
            <div className="flex flex-wrap gap-2">
              {followedTopics.map(topic => (
                <span
                  key={topic.id}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
                >
                  {topic.icon} {topic.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notification settings */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: 'New posts in my topics', value: notifPosts, set: setNotifPosts },
              { label: 'Replies to my posts', value: notifReplies, set: setNotifReplies },
              { label: 'Daily digest email', value: notifDigest, set: setNotifDigest },
            ].map(({ label, value, set }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{label}</span>
                <button
                  onClick={() => set(v => !v)}
                  className={[
                    'relative w-11 h-6 rounded-full transition-colors',
                    value ? 'bg-indigo-600' : 'bg-gray-200',
                  ].join(' ')}
                  aria-checked={value}
                  role="switch"
                >
                  <span
                    className={[
                      'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform',
                      value ? 'translate-x-5' : 'translate-x-0',
                    ].join(' ')}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Other links */}
        <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <span>Data &amp; Privacy</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <span>Help &amp; Support</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          Sign out
        </button>

        <p className="text-center text-xs text-gray-400">Convo v0.1.0 · For .edu students</p>
      </div>
    </AppShell>
  );
}
