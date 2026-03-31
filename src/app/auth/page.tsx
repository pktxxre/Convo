'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';

type AuthState = 'idle' | 'loading';

function validateUWEmail(email: string): string | null {
  if (!email.includes('@')) return 'Enter a valid email address.';
  if (!email.trim().toLowerCase().endsWith('@uw.edu')) {
    return 'Convo is currently only available to UW students — use your @uw.edu email.';
  }
  return null;
}

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<AuthState>('idle');
  const [error, setError] = useState('');
  const { user, mounted, signIn } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!mounted) return;
    if (user) router.replace(user.onboardingComplete ? '/feed' : '/onboarding');
  }, [user, mounted, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const validationError = validateUWEmail(email);
    if (validationError) { setError(validationError); return; }
    setState('loading');
    try {
      await signIn(email);
    } catch {
      setState('idle');
      setError('Something went wrong. Please try again.');
    }
  }

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-6 max-w-lg mx-auto">
      <div className="w-full space-y-8">

        {/* Brand */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-indigo-600 tracking-tight">Convo</h1>
          <p className="text-[#737373] dark:text-[#ABABAB] text-lg">The social app for Huskies.</p>
          {/* UW campus tag */}
          <div className="inline-flex items-center gap-1.5 bg-[#4B2E83]/10 dark:bg-[#4B2E83]/20 text-[#4B2E83] dark:text-[#B39DDB] text-xs font-semibold px-3 py-1 rounded-full">
            <span>🐾</span>
            <span>University of Washington · Seattle</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-[#1a1a1a] dark:text-[#F5F5F5]">
              UW email address
            </label>
            <input
              id="email"
              type="email"
              autoFocus
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@uw.edu"
              disabled={state === 'loading'}
              className={[
                'w-full px-4 py-3 rounded-xl border text-base transition-colors',
                'bg-white dark:bg-[#1C1C1E] text-[#1a1a1a] dark:text-[#F5F5F5]',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                'disabled:opacity-60 placeholder:text-[#A8A8A8] dark:placeholder:text-[#636366]',
                error
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'border-[#DBDBDB] dark:border-[#38383A]',
              ].join(' ')}
            />
            {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={state === 'loading' || !email.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 dark:disabled:bg-indigo-900 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {state === 'loading' ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending link…
              </>
            ) : 'Send magic link'}
          </button>
        </form>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-[#DBDBDB] dark:border-[#38383A]" />
            <span className="text-xs text-[#A8A8A8] dark:text-[#636366]">@uw.edu addresses only</span>
            <hr className="flex-1 border-[#DBDBDB] dark:border-[#38383A]" />
          </div>
          <p className="text-center text-xs text-[#A8A8A8] dark:text-[#636366]">
            By continuing, you agree to our{' '}
            <button className="text-indigo-500 hover:underline">Terms</button> and{' '}
            <button className="text-indigo-500 hover:underline">Privacy Policy</button>.
          </p>
        </div>

      </div>
    </div>
  );
}
