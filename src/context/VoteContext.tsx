'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Post } from '@/types';

type VoteDir = 'up' | 'down';
type VoteMap = Record<string, VoteDir>;

const VOTE_KEY = 'convo_votes';

interface VoteContextType {
  getVote: (postId: string) => VoteDir | null;
  vote: (postId: string, dir: VoteDir) => void;
  getScore: (post: Post) => number;
  getUpvotes: (post: Post) => number;
  getDownvotes: (post: Post) => number;
}

const VoteContext = createContext<VoteContextType | null>(null);

export function VoteProvider({ children }: { children: React.ReactNode }) {
  const [votes, setVotes] = useState<VoteMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(VOTE_KEY);
      if (raw) setVotes(JSON.parse(raw) as VoteMap);
    } catch { /* ignore */ }
  }, []);

  function vote(postId: string, dir: VoteDir) {
    setVotes(prev => {
      const next = { ...prev };
      if (next[postId] === dir) {
        // toggle off
        delete next[postId];
      } else {
        next[postId] = dir;
      }
      try { localStorage.setItem(VOTE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  function getVote(postId: string): VoteDir | null {
    return votes[postId] ?? null;
  }

  function getUpvotes(post: Post): number {
    return post.upvotes + (votes[post.id] === 'up' ? 1 : 0);
  }

  function getDownvotes(post: Post): number {
    return post.downvotes + (votes[post.id] === 'down' ? 1 : 0);
  }

  function getScore(post: Post): number {
    return getUpvotes(post) - getDownvotes(post);
  }

  return (
    <VoteContext.Provider value={{ getVote, vote, getScore, getUpvotes, getDownvotes }}>
      {children}
    </VoteContext.Provider>
  );
}

export function useVotes(): VoteContextType {
  const ctx = useContext(VoteContext);
  if (!ctx) throw new Error('useVotes must be used within VoteProvider');
  return ctx;
}
