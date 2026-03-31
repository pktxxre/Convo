'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';

export default function RootPage() {
  const { user, mounted } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!mounted) return;
    if (!user) router.replace('/auth');
    else if (!user.onboardingComplete) router.replace('/onboarding');
    else router.replace('/feed');
  }, [user, mounted, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
