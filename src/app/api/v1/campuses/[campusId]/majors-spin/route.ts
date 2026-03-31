import { requireAuth } from '@/lib/api/auth';
import { handleError, ApiError } from '@/lib/api/errors';
import { requireUUID, parseSpinBody } from '@/lib/api/validate';
import { createUserDbClient } from '@/lib/db/client';
import { getMajorsForWheel } from '@/lib/db/majors';
import { pickWinner, createSpinEvent } from '@/lib/db/spins';

// POST /api/v1/campuses/:campusId/majors-spin
export async function POST(
  request: Request,
  { params }: { params: Promise<{ campusId: string }> },
) {
  try {
    const { campusId } = await params;
    requireUUID(campusId, 'campusId');

    const user = await requireAuth(request);

    if (user.campusId !== campusId) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this campus.');
    }

    // Parse optional body — treat empty body as {}
    let rawBody: unknown = {};
    const ct = request.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
      const text = await request.text();
      if (text.trim()) rawBody = JSON.parse(text);
    }
    const spinOpts = parseSpinBody(rawBody);

    const db = createUserDbClient(user.token);

    // Compute eligible majors using the same logic as majors-for-wheel
    let eligibleMajors = await getMajorsForWheel(db, {
      campusId,
      userId: user.id,
      userMajorId: user.majorId,
      excludeOwnMajor: spinOpts.excludeOwnMajor,
      excludeRecentlySpun: spinOpts.excludeRecentlySpun,
      recentWindowDays: spinOpts.recentWindowDays,
      limit: 200, // fetch all eligible, allowedMajorIds filter may reduce this
    });

    // Intersect with allowedMajorIds if the client provided them
    if (spinOpts.allowedMajorIds) {
      const allowed = new Set(spinOpts.allowedMajorIds);
      eligibleMajors = eligibleMajors.filter(m => allowed.has(m.id));
    }

    if (eligibleMajors.length === 0) {
      throw new ApiError(
        409,
        'CONFLICT',
        'No eligible majors available. Try adjusting your filters (e.g., turn off excludeRecentlySpun).',
      );
    }

    const winnerMajor = pickWinner(eligibleMajors);
    const spin = await createSpinEvent(db, {
      userId: user.id,
      campusId,
      eligibleMajors,
      winnerMajor,
    });

    return Response.json(
      {
        spinId: spin.id,
        campusId: spin.campusId,
        userId: spin.userId,
        winnerMajor: spin.winnerMajor,
        eligibleMajors: spin.eligibleMajors,
        createdAt: spin.createdAt,
      },
      { status: 201 },
    );
  } catch (err) {
    return handleError(err);
  }
}
