import type { SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from '@/lib/api/errors';

const DAILY_POST_LIMIT = 5;

export interface ConversationRecord {
  conversationId: string;
  campusId: string;
  authorId: string;
  targetMajor: { id: string; name: string; slug: string };
  title: string | null;
  body: string;
  postType: string;
  createdAt: string;
}

/**
 * Check whether the user has reached their daily post limit.
 * Throws 409 DAILY_LIMIT_REACHED if they have.
 */
export async function assertDailyLimitNotReached(
  db: SupabaseClient,
  authorId: string,
): Promise<void> {
  // Midnight UTC today
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count, error } = await db
    .from('conversations')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', authorId)
    .gte('created_at', startOfDay.toISOString());

  if (error) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Failed to check daily post limit.');
  }

  if ((count ?? 0) >= DAILY_POST_LIMIT) {
    throw new ApiError(
      409,
      'DAILY_LIMIT_REACHED',
      `You've reached your limit of ${DAILY_POST_LIMIT} posts per day. Come back tomorrow.`,
    );
  }
}

/**
 * Verify a major exists, is active, and belongs to the given campus.
 * Throws 404 if not found.
 */
export async function assertMajorExists(
  db: SupabaseClient,
  majorId: string,
  campusId: string,
): Promise<{ id: string; name: string; slug: string }> {
  const { data, error } = await db
    .from('majors')
    .select('id, name, slug')
    .eq('id', majorId)
    .eq('campus_id', campusId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    throw new ApiError(
      404,
      'NOT_FOUND',
      `Major ${majorId} not found or is not active for this campus.`,
    );
  }

  return data as { id: string; name: string; slug: string };
}

/**
 * Insert a conversation row and return the full record.
 */
export async function createConversation(
  db: SupabaseClient,
  params: {
    campusId: string;
    authorId: string;
    targetMajorId: string;
    spinId: string | null;
    title: string | null;
    body: string;
    postType: string;
  },
): Promise<ConversationRecord> {
  const major = await assertMajorExists(db, params.targetMajorId, params.campusId);

  const { data, error } = await db
    .from('conversations')
    .insert({
      campus_id: params.campusId,
      author_id: params.authorId,
      target_major_id: params.targetMajorId,
      spin_id: params.spinId,
      title: params.title,
      body: params.body,
      post_type: params.postType,
    })
    .select('id, created_at')
    .single();

  if (error || !data) {
    throw new ApiError(500, 'INTERNAL_ERROR', 'Failed to create conversation.');
  }

  return {
    conversationId: data.id as string,
    campusId: params.campusId,
    authorId: params.authorId,
    targetMajor: major,
    title: params.title,
    body: params.body,
    postType: params.postType,
    createdAt: data.created_at as string,
  };
}
