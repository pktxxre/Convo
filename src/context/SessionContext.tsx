'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User, OnboardingData } from '@/types';

const SESSION_KEY = 'convo_session';

interface SessionContextType {
  user: User | null;
  mounted: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
  completeOnboarding: (data: OnboardingData) => void;
  bumpPostsToday: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

function readFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function writeToStorage(user: User | null): void {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUserState(readFromStorage());
    setMounted(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) {
        setUserState(e.newValue ? (JSON.parse(e.newValue) as User) : null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function setUser(u: User | null) {
    setUserState(u);
    writeToStorage(u);
  }

  async function signIn(email: string): Promise<void> {
    // Simulate magic link verification delay
    await new Promise(r => setTimeout(r, 1000));

    const namePart = email.split('@')[0];
    const name = namePart
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    setUser({
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      campusId: 'uw',        // always UW — gated by @uw.edu at the auth step
      major: '',
      year: 'Freshman',
      interests: [],
      topicIds: [],
      postsToday: 0,
      onboardingComplete: false,
    });
  }

  function signOut() {
    setUser(null);
  }

  function completeOnboarding(data: OnboardingData) {
    if (!user) return;
    setUser({
      ...user,
      campusId: data.campusId,
      major: data.major,
      interests: data.interests,
      topicIds: data.topicIds,
      onboardingComplete: true,
    });
  }

  function bumpPostsToday() {
    if (!user) return;
    setUser({ ...user, postsToday: user.postsToday + 1 });
  }

  return (
    <SessionContext.Provider
      value={{ user, mounted, signIn, signOut, completeOnboarding, bumpPostsToday }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
