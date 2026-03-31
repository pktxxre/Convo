import { requireAuth } from '@/lib/api/auth';
import { handleError, ApiError } from '@/lib/api/errors';
import { parseBoolParam, parseIntParam, requireUUID } from '@/lib/api/validate';
import { createUserDbClient } from '@/lib/db/client';
import { getMajorsForWheel } from '@/lib/db/majors';

// GET /api/v1/campuses/:campusId/majors-for-wheel
export async function GET(
  request: Request,
  { params }: { params: Promise<{ campusId: string }> },
) {
  try {
    const { campusId } = await params;
    requireUUID(campusId, 'campusId');

    const user = await requireAuth(request);

    // Users may only query their own campus
    if (user.campusId !== campusId) {
      throw new ApiError(
        403,
        'FORBIDDEN',
        'You do not have access to this campus.',
      );
    }

    const url = new URL(request.url);
    const sp = url.searchParams;

    const excludeOwnMajor = parseBoolParam(sp, 'excludeOwnMajor', true);
    const excludeRecentlySpun = parseBoolParam(sp, 'excludeRecentlySpun', false);
    const limit = parseIntParam(sp, 'limit', 50, 1, 100);

    const db = createUserDbClient(user.token);

    const majors = await getMajorsForWheel(db, {
      campusId,
      userId: user.id,
      userMajorId: user.majorId,
      excludeOwnMajor,
      excludeRecentlySpun,
      recentWindowDays: 7,
      limit,
    });

    return Response.json({
      campusId,
      userId: user.id,
      majors,
    });
  } catch (err) {
    return handleError(err);
  }
}
