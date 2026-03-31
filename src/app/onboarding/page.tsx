'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';
import { CAMPUSES, MAJORS, INTERESTS, TOPICS, detectCampusByEmail } from '@/lib/filler';
import type { OnboardingData } from '@/types';

export default function OnboardingPage() {
  const { user, mounted, completeOnboarding } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [campusId, setCampusId] = useState('');
  const [major, setMajor] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (!mounted) return;
    if (!user) { router.replace('/auth'); return; }
    if (user.onboardingComplete) { router.replace('/feed'); return; }

    const detected = detectCampusByEmail(user.email);
    if (detected && !campusId) setCampusId(detected.id);
  }, [user, mounted, router]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleFinish() {
    if (!campusId || !major || selectedTopics.length < 1) return;
    const data: OnboardingData = { campusId, major, interests: selectedInterests, topicIds: selectedTopics };
    completeOnboarding(data);
    router.replace('/feed');
  }

  function toggleInterest(i: string) {
    setSelectedInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  }

  function toggleTopic(id: string) {
    setSelectedTopics(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  if (!mounted || !user) return <div className="min-h-screen bg-white" />;

  const detectedCampus = detectCampusByEmail(user.email);

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-lg mx-auto">
      {/* Top progress bar */}
      <div className="px-6 pt-10 pb-4">
        <div className="flex gap-2 mb-2">
          {[1, 2].map(s => (
            <div
              key={s}
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${s <= step ? 'bg-indigo-600' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400">Step {step} of 2</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-10">
        {/* ── STEP 1: Campus ────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Where do you study?</h2>
              <p className="text-gray-500 mt-1 text-sm">
                {detectedCampus
                  ? `We detected ${detectedCampus.name} from your email.`
                  : 'Select your university to get started.'}
              </p>
            </div>

            <div className="space-y-2">
              {CAMPUSES.map(campus => (
                <button
                  key={campus.id}
                  onClick={() => setCampusId(campus.id)}
                  className={[
                    'w-full text-left p-4 rounded-xl border-2 transition-all',
                    campusId === campus.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 active:bg-gray-50',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{campus.name}</p>
                      {campus.location && <p className="text-sm text-gray-500">{campus.location}</p>}
                    </div>
                    {campusId === campus.id && (
                      <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!campusId}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* ── STEP 2: Profile ───────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
              <p className="text-gray-500 mt-1 text-sm">We&apos;ll personalize your feed and recommendations.</p>
            </div>

            {/* Major */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Major <span className="text-red-400">*</span>
              </label>
              <select
                value={major}
                onChange={e => setMajor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">Select your major</option>
                {MAJORS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Interests <span className="text-gray-400 font-normal">(optional)</span>
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
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300 active:bg-gray-50',
                    ].join(' ')}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Starter Topics */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Follow some topics <span className="text-gray-400 font-normal">(pick at least 1)</span>
              </p>
              <div className="space-y-2">
                {TOPICS.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={[
                      'w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3',
                      selectedTopics.includes(topic.id)
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300',
                    ].join(' ')}
                  >
                    <span className="text-xl flex-shrink-0">{topic.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{topic.name}</p>
                      <p className="text-xs text-gray-500">{topic.postCount} posts</p>
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
                className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={!major || selectedTopics.length === 0}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
              >
                Get started 🎉
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
