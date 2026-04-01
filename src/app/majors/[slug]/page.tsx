'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import PostCard from '@/components/feed/PostCard';
import { MAJORS, getPostsByMajor } from '@/lib/filler';
import { majorSlug, majorMemberCount, majorActiveUsers } from '@/lib/utils';
import { useSession } from '@/context/SessionContext';

export default function MajorRoomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useSession();

  const major = MAJORS.find(m => majorSlug(m) === slug);
  const posts = major
    ? [...getPostsByMajor(major)].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const isMyMajor = user?.major === major;
  const members = major ? majorMemberCount(major) : 0;
  const active = major ? majorActiveUsers(major) : 0;

  if (!major) {
    return (
      <AppShell title="Not Found" showBack>
        <div className="flex flex-col items-center justify-center px-6 py-20 gap-3">
          <p className="text-[16px] font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">Room not found</p>
          <Link href="/majors" className="text-indigo-500 text-[14px] hover:underline">Browse all majors</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={major} showBack>
      <div className="pb-8">

        {/* Room header */}
        <div className="px-4 pt-4 pb-5 border-b border-[#F0F0F0] dark:border-[#2C2C2E]">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#4B2E83] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#B7A57A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-bold text-[#1a1a1a] dark:text-[#F5F5F5] leading-tight">{major}</h2>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-[12px] text-[#A8A8A8] dark:text-[#636366]">
                  {members.toLocaleString()} members
                </span>
                <span className="text-[#DBDBDB] dark:text-[#48484A] text-[10px]">·</span>
                <span className="flex items-center gap-1 text-[12px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {active} active now
                </span>
              </div>
              {isMyMajor && (
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold uppercase tracking-wide">
                  Your major
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/compose?major=${encodeURIComponent(major)}&type=prompt`}
            className="mt-4 flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-[#F5F5F5] dark:bg-[#2C2C2E] text-[13px] text-[#A8A8A8] dark:text-[#636366] hover:bg-[#EBEBEB] dark:hover:bg-[#3A3A3C] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Post to {major}…
          </Link>
        </div>

        {/* Posts */}
        <div className="px-4 pt-4 space-y-2">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-[#F5F5F5] dark:bg-[#2C2C2E] flex items-center justify-center">
                <svg className="w-7 h-7 text-[#C7C7C7] dark:text-[#48484A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">No posts yet</p>
              <p className="text-[13px] text-[#737373] dark:text-[#ABABAB] max-w-[220px]">
                Be the first to start a conversation in the {major} room.
              </p>
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} showTopic />)
          )}
        </div>
      </div>
    </AppShell>
  );
}
