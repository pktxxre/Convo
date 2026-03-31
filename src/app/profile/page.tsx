'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import Avatar from '@/components/ui/Avatar';
import { useSession } from '@/context/SessionContext';
import { useTheme } from '@/context/ThemeContext';
import { getCampusById, TOPICS } from '@/lib/filler';

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={value}
      className={[
        'relative w-11 h-6 rounded-full transition-colors duration-200',
        value ? 'bg-indigo-600' : 'bg-[#E5E5E5] dark:bg-[#48484A]',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
          value ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}

export default function ProfilePage() {
  const { user, signOut } = useSession();
  const { theme, toggle: toggleTheme } = useTheme();
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

        {/* Profile header */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-[#DBDBDB] dark:border-[#38383A] rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="lg" />
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">{user.name}</h2>
              <p className="text-sm text-[#737373] dark:text-[#ABABAB]">{user.email}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Campus', value: campus?.shortName ?? '—' },
              { label: 'Major', value: user.major || '—' },
              { label: 'Year', value: user.year },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#F5F5F5] dark:bg-[#2C2C2E] rounded-xl p-3 text-center">
                <p className="text-xs text-[#737373] dark:text-[#ABABAB]">{label}</p>
                <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] mt-0.5 truncate">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-[#F0F0F0] dark:border-[#2C2C2E] pt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">{user.postsToday}</p>
              <p className="text-xs text-[#737373] dark:text-[#ABABAB]">Posts today</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">{followedTopics.length}</p>
              <p className="text-xs text-[#737373] dark:text-[#ABABAB]">Topics</p>
            </div>
          </div>
        </div>

        {/* Interests */}
        {user.interests.length > 0 && (
          <div className="bg-white dark:bg-[#1C1C1E] border border-[#DBDBDB] dark:border-[#38383A] rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map(interest => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        {followedTopics.length > 0 && (
          <div className="bg-white dark:bg-[#1C1C1E] border border-[#DBDBDB] dark:border-[#38383A] rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] mb-3">Following</h3>
            <div className="flex flex-wrap gap-2">
              {followedTopics.map(topic => (
                <span
                  key={topic.id}
                  className="px-3 py-1 bg-[#F5F5F5] dark:bg-[#2C2C2E] text-[#1a1a1a] dark:text-[#E5E5E5] text-sm font-medium rounded-full"
                >
                  {topic.icon} {topic.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Appearance */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-[#DBDBDB] dark:border-[#38383A] rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] mb-3">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
              <div>
                <p className="text-sm text-[#1a1a1a] dark:text-[#F5F5F5] font-medium">
                  {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </p>
                <p className="text-[11px] text-[#A8A8A8] dark:text-[#636366] mt-0.5">
                  {theme === 'dark' ? 'Easy on the eyes at night' : 'Bright and clear'}
                </p>
              </div>
            </div>
            <Toggle value={theme === 'dark'} onChange={toggleTheme} />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-[#DBDBDB] dark:border-[#38383A] rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] mb-3">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: 'New posts in my topics', value: notifPosts, set: setNotifPosts },
              { label: 'Replies to my posts', value: notifReplies, set: setNotifReplies },
              { label: 'Daily digest email', value: notifDigest, set: setNotifDigest },
            ].map(({ label, value, set }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-[#1a1a1a] dark:text-[#E5E5E5]">{label}</span>
                <Toggle value={value} onChange={() => set(v => !v)} />
              </div>
            ))}
          </div>
        </div>

        {/* Other links */}
        <div className="bg-white dark:bg-[#1C1C1E] border border-[#DBDBDB] dark:border-[#38383A] rounded-2xl divide-y divide-[#F0F0F0] dark:divide-[#2C2C2E]">
          {['Data & Privacy', 'Help & Support'].map(label => (
            <button
              key={label}
              className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-[#1a1a1a] dark:text-[#E5E5E5] hover:bg-[#F5F5F5] dark:hover:bg-[#2C2C2E] transition-colors"
            >
              <span>{label}</span>
              <svg className="w-4 h-4 text-[#C7C7C7] dark:text-[#48484A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="w-full py-3 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Sign out
        </button>

        <p className="text-center text-xs text-[#A8A8A8] dark:text-[#636366]">Convo v0.1.0 · For .edu students</p>
      </div>
    </AppShell>
  );
}
