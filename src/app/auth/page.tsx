'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';

type AuthState = 'idle' | 'loading';

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

    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (!email.toLowerCase().endsWith('.edu')) {
      setError('Convo is only for students — use your .edu email.');
      return;
    }

    setState('loading');
    try {
      await signIn(email);
    } catch {
      setState('idle');
      setError('Something went wrong. Please try again.');
    }
  }

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 max-w-lg mx-auto">
      <div className="w-full space-y-8">
        {/* Brand */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-indigo-600 tracking-tight">Convo</h1>
          <p className="text-gray-500 text-lg">Your campus, connected.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              University email
            </label>
            <input
              id="email"
              type="email"
              autoFocus
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@university.edu"
              disabled={state === 'loading'}
              className={[
                'w-full px-4 py-3 rounded-xl border text-base transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                'disabled:bg-gray-50 placeholder:text-gray-400',
                error ? 'border-red-400 bg-red-50' : 'border-gray-300',
              ].join(' ')}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={state === 'loading' || !email.trim()}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {state === 'loading' ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending link…
              </>
            ) : (
              'Send magic link'
            )}
          </button>
        </form>

        {/* Divider + fine print */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">Only for .edu addresses</span>
            <hr className="flex-1 border-gray-200" />
          </div>
          <p className="text-center text-xs text-gray-400">
            By continuing, you agree to our{' '}
            <button className="text-indigo-500 hover:underline">Terms</button> and{' '}
            <button className="text-indigo-500 hover:underline">Privacy Policy</button>.
          </p>
        </div>
      </div>
    </div>
  );
}
