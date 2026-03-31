import { createClient } from '@supabase/supabase-js';
import { ApiError } from './errors';

// Singleton auth client — only used to verify JWTs, no user context needed.
const authClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
  { auth: { persistSession: false } },
);

export interface AuthUser {
  id: string;
  campusId: string;
  majorId: string | null;
  /** The raw JWT — used to create per-request DB clients that respect RLS */
  token: string;
}

/**
 * Extract and verify the Bearer token from the Authorization header.
 * Throws 401 ApiError on any failure.
 */
export async function requireAuth(request: Request): Promise<AuthUser> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(
      401,
      'UNAUTHORIZED',
      'Missing or invalid Authorization header. Expected: Bearer <token>',
    );
  }

  const token = authHeader.slice(7).trim();
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser(token);

  if (error || !user) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired token.');
  }

  // campus_id lives in app_metadata (set server-side on sign-up/onboarding)
  // Fallback to user_metadata for dev convenience.
  const campusId: string | undefined =
    user.app_metadata?.campus_id ?? user.user_metadata?.campus_id;

  if (!campusId) {
    throw new ApiError(
      401,
      'UNAUTHORIZED',
      'Token is missing campus_id claim. Complete onboarding first.',
    );
  }

  const majorId: string | null =
    user.app_metadata?.major_id ?? user.user_metadata?.major_id ?? null;

  return { id: user.id, campusId, majorId, token };
}
