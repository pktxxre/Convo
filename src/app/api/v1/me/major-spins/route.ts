import { requireAuth } from '@/lib/api/auth';
import { handleError } from '@/lib/api/errors';
import { parseIntParam } from '@/lib/api/validate';
import { createUserDbClient } from '@/lib/db/client';
import { getUserSpins } from '@/lib/db/spins';

// GET /api/v1/me/major-spins
export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);

    const url = new URL(request.url);
    const limit = parseIntParam(url.searchParams, 'limit', 20, 1, 100);

    const db = createUserDbClient(user.token);
    const spins = await getUserSpins(db, user.id, limit);

    return Response.json({ userId: user.id, spins });
  } catch (err) {
    return handleError(err);
  }
}
