'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { UW_CAMPUS, UW_MAJORS_BY_COLLEGE, INTERESTS, TOPICS } from '@/lib/filler';
import type { OnboardingData } from '@/types';

export default function OnboardingPage() {
  const { user, mounted, completeOnboarding } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [major, setMajor] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (!mounted) return;
    if (!user) { router.replace('/auth'); return; }
    if (user.onboardingComplete) { router.replace('/feed'); return; }
  }, [user, mounted, router]);

  function handleFinish() {
    if (!major || selectedTopics.length < 1) return;
    const data: OnboardingData = {
      campusId: 'uw',
      major,
      interests: selectedInterests,
      topicIds: selectedTopics,
    };
    completeOnboarding(data);
    router.replace('/feed');
  }

  function toggleInterest(i: string) {
    setSelectedInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

  function toggleTopic(id: string) {
    setSelectedTopics(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  if (!mounted || !user) return <div className="min-h-screen bg-white dark:bg-black" />;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="px-6 pt-10 pb-4">
        <div className="flex gap-2 mb-2">
          {[1, 2].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                s <= step ? 'bg-indigo-600' : 'bg-[#E5E5E5] dark:bg-[#38383A]'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-[#A8A8A8] dark:text-[#636366]">Step {step} of 2</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10">

        {/* ── STEP 1: UW confirmation ────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">Welcome, Husky! 🐾</h2>
              <p className="text-[#737373] dark:text-[#ABABAB] mt-1 text-sm">
                We verified your UW email. Let&apos;s confirm your campus.
              </p>
            </div>

            {/* UW campus card — pre-selected, not interactive */}
            <div className="border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* UW W logo placeholder */}
                  <div className="w-14 h-14 rounded-xl bg-[#4B2E83] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#B7A57A] font-black text-2xl leading-none">W</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#1a1a1a] dark:text-[#F5F5F5] text-base">{UW_CAMPUS.name}</p>
                    <p className="text-sm text-[#737373] dark:text-[#ABABAB]">{UW_CAMPUS.location}</p>
                    <p className="text-xs text-[#A8A8A8] dark:text-[#636366] mt-0.5">@{UW_CAMPUS.domain}</p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <p className="text-xs text-[#A8A8A8] dark:text-[#636366]">
              Not a UW student?{' '}
              <button
                onClick={() => router.replace('/auth')}
                className="text-indigo-500 hover:underline"
              >
                Sign in with a different email.
              </button>
            </p>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              That&apos;s me — Continue
            </button>
          </div>
        )}

        {/* ── STEP 2: Major, interests, topics ──────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">Tell us about yourself</h2>
              <p className="text-[#737373] dark:text-[#ABABAB] mt-1 text-sm">
                We&apos;ll personalize your feed and Spin Convo matches.
              </p>
            </div>

            {/* Major — grouped by UW college */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">
                Major <span className="text-red-400">*</span>
              </label>
              <select
                value={major}
                onChange={e => setMajor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#DBDBDB] dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] text-[#1a1a1a] dark:text-[#F5F5F5] text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select your major</option>
                {UW_MAJORS_BY_COLLEGE.map(({ college, majors }) => (
                  <optgroup key={college} label={college}>
                    {majors.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">
                Interests <span className="text-[#A8A8A8] dark:text-[#636366] font-normal">(optional)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={[
                      'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                      selectedInterests.includes(interest)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-[#1C1C1E] text-[#1a1a1a] dark:text-[#E5E5E5] border-[#DBDBDB] dark:border-[#38383A] hover:border-indigo-300 dark:hover:border-indigo-500',
                    ].join(' ')}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Starter Topics */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">
                Follow some topics{' '}
                <span className="text-[#A8A8A8] dark:text-[#636366] font-normal">(pick at least 1)</span>
              </p>
              <div className="space-y-2">
                {TOPICS.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={[
                      'w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3',
                      selectedTopics.includes(topic.id)
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-[#DBDBDB] dark:border-[#38383A] hover:border-[#ABABAB] dark:hover:border-[#636366]',
                    ].join(' ')}
                  >
                    <span className="text-xl flex-shrink-0">{topic.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#F5F5F5]">{topic.name}</p>
                      <p className="text-xs text-[#737373] dark:text-[#ABABAB]">{topic.postCount} posts</p>
                    </div>
                    {selectedTopics.includes(topic.id) && (
                      <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 pb-4">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-xl border border-[#DBDBDB] dark:border-[#38383A] text-[#1a1a1a] dark:text-[#E5E5E5] font-semibold hover:bg-[#F5F5F5] dark:hover:bg-[#2C2C2E] transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={!major || selectedTopics.length === 0}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold disabled:bg-indigo-300 dark:disabled:bg-indigo-900 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
              >
                Go Huskies 🐾
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
