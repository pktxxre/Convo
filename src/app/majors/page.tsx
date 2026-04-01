'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { MAJORS, UW_MAJORS_BY_COLLEGE, getPostsByMajor } from '@/lib/filler';
import { majorSlug, majorMemberCount, majorActiveUsers } from '@/lib/utils';

export default function MajorsPage() {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? MAJORS.filter(m => m.toLowerCase().includes(query.toLowerCase()))
    : null;

  return (
    <AppShell title="Major Rooms">
      <div className="px-4 pt-4 pb-8 space-y-4">

        <p className="text-[13px] text-[#737373] dark:text-[#ABABAB]">
          Browse what Huskies in each major are talking about.
        </p>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A8A8] dark:text-[#636366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search majors…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F5F5F5] dark:bg-[#2C2C2E] text-[14px] text-[#1a1a1a] dark:text-[#F5F5F5] placeholder:text-[#A8A8A8] dark:placeholder:text-[#636366] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {filtered ? (
          <div className="space-y-2">
            {filtered.length === 0 && (
              <p className="text-[13px] text-[#A8A8A8] dark:text-[#636366] text-center py-6">No majors found.</p>
            )}
            {filtered.map(major => (
              <MajorRow key={major} major={major} />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {UW_MAJORS_BY_COLLEGE.map(({ college, majors }) => (
              <div key={college}>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#A8A8A8] dark:text-[#636366] mb-2 px-1">
                  {college}
                </p>
                <div className="space-y-1.5">
                  {majors.map(major => (
                    <MajorRow key={major} major={major} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function MajorRow({ major }: { major: string }) {
  const members = majorMemberCount(major);
  const active = majorActiveUsers(major);
  const posts = getPostsByMajor(major).length;

  return (
    <Link
      href={`/majors/${majorSlug(major)}`}
      className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1C1C1E] border border-[#DBDBDB] dark:border-[#38383A] rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 active:scale-[.99] transition-all group"
    >
      <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
        <svg className="w-[18px] h-[18px] text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#1a1a1a] dark:text-[#F5F5F5] truncate">{major}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-[#A8A8A8] dark:text-[#636366]">
            {members.toLocaleString()} members
          </span>
          <span className="text-[#DBDBDB] dark:text-[#48484A] text-[10px]">·</span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            {active} active
          </span>
          {posts > 0 && (
            <>
              <span className="text-[#DBDBDB] dark:text-[#48484A] text-[10px]">·</span>
              <span className="text-[11px] text-[#A8A8A8] dark:text-[#636366]">
                {posts} {posts === 1 ? 'post' : 'posts'}
              </span>
            </>
          )}
        </div>
      </div>
      <svg className="w-4 h-4 text-[#C7C7C7] dark:text-[#48484A] group-hover:text-indigo-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
