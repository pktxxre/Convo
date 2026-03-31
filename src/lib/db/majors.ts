import type { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@/lib/api/errors';

export interface MajorRow {
  id: string;
  name: string;
  slug: string;
}

export interface GetMajorsOptions {
  campusId: string;
  userId: string;
  userMajorId: string | null;
  excludeOwnMajor: boolean;
  excludeRecentlySpun: boolean;
  recentWindowDays: number;
  limit: number;
}

/**
 * Returns the list of active majors eligible for the spin wheel.
 * Filtering happens in two passes:
 *   1. DB query for active majors (and optionally exclude own major)
 *   2. In-memory filter for recently spun majors (requires a second query)
 *
 * The campus is verified to exist inside this function to surface 404 early.
 */
export async function getMajorsForWheel(
  db: SupabaseClient,
  opts: GetMajorsOptions,
): Promise<MajorRow[]> {
  // Build base query
  let query = db
    .from('majors')
    .select('id, name, slug')
    .eq('campus_id', opts.campusId)
    .eq('is_active', true)
    .order('name')
    .limit(opts.excludeRecentlySpun ? 200 : opts.limit); // over-fetch if we need to filter

  if (opts.excludeOwnMajor && opts.userMajorId) {
    query = query.neq('id', opts.userMajorId);
  }

  const { data, error } = await query;

  if (error) {
    // PostgREST returns a specific code when the table/column doesn't exist.
    // Any other DB error is internal.
    throw new ApiError(500, 'INTERNAL_ERROR', 'Failed to fetch majors.');
  }

  // Verify the campus exists (if query returned empty we can't distinguish
  // "no active majors" from "campus not found" without a dedicated check).
  const { count: campusCount, error: campusError } = await db
    .from('campuses')
    .select('id', { count: 'exact', head: true })
    .eq('id', opts.campusId);

  if (campusError) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Failed to verify campus.');
  }
  if (!campusCount) {
    throw new ApiError(404, 'NOT_FOUND', `Campus ${opts.campusId} not found.`);
  }

  let majors = (data ?? []) as MajorRow[];

  if (opts.excludeRecentlySpun) {
    const windowStart = new Date(
      Date.now() - opts.recentWindowDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { data: recentSpins, error: spinsError } = await db
      .from('major_spin_events')
      .select('winner_major_id')
      .eq('user_id', opts.userId)
      .gte('created_at', windowStart);

    if (spinsError) {
      throw new ApiError(500, 'INTERNAL_ERROR', 'Failed to fetch recent spins.');
    }

    const recentIds = new Set(
      (recentSpins ?? []).map(
        (s: { winner_major_id: string }) => s.winner_major_id,
      ),
    );
    majors = majors.filter(m => !recentIds.has(m.id));
  }

  // Respect limit after in-memory filtering
  return majors.slice(0, opts.limit);
}
