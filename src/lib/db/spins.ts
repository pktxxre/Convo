import type { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@/lib/api/errors';
import type { MajorRow } from './majors';

export interface SpinEvent {
  id: string;
  campusId: string;
  userId: string;
  winnerMajor: MajorRow;
  eligibleMajors: MajorRow[];
  createdAt: string;
}

export interface SpinHistoryRow {
  spinId: string;
  campusId: string;
  winnerMajor: MajorRow;
  createdAt: string;
}

/**
 * Server-side random selection — uniform distribution.
 * Exported for unit testing.
 */
export function pickWinner<T>(items: T[]): T {
  if (items.length === 0) throw new Error('Cannot pick from an empty list.');
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Write a spin event and return the full SpinEvent record.
 */
export async function createSpinEvent(
  db: SupabaseClient,
  params: {
    userId: string;
    campusId: string;
    eligibleMajors: MajorRow[];
    winnerMajor: MajorRow;
  },
): Promise<SpinEvent> {
  const { data, error } = await db
    .from('major_spin_events')
    .insert({
      user_id: params.userId,
      campus_id: params.campusId,
      winner_major_id: params.winnerMajor.id,
      eligible_major_ids: params.eligibleMajors.map(m => m.id),
    })
    .select('id, created_at')
    .single();

  if (error || !data) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Failed to record spin event.');
  }

  return {
    id: data.id as string,
    campusId: params.campusId,
    userId: params.userId,
    winnerMajor: params.winnerMajor,
    eligibleMajors: params.eligibleMajors,
    createdAt: data.created_at as string,
  };
}

/**
 * Fetch the most recent spin events for a user.
 */
export async function getUserSpins(
  db: SupabaseClient,
  userId: string,
  limit: number,
): Promise<SpinHistoryRow[]> {
  const { data, error } = await db
    .from('major_spin_events')
    .select(`
      id,
      campus_id,
      created_at,
      winner_major:majors!winner_major_id (id, name, slug)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Failed to fetch spin history.');
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    spinId: row.id as string,
    campusId: row.campus_id as string,
    winnerMajor: row.winner_major as MajorRow,
    createdAt: row.created_at as string,
  }));
}
