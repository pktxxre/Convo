import { requireAuth } from '@/lib/api/auth';
import { handleError, ApiError } from '@/lib/api/errors';
import { parseConversationBody } from '@/lib/api/validate';
import { createUserDbClient } from '@/lib/db/client';
import { assertDailyLimitNotReached, createConversation } from '@/lib/db/conversations';

// POST /api/v1/conversations
export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);

    const ct = request.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) {
      throw new ApiError(
        400,
        'VALIDATION_ERROR',
        'Content-Type must be application/json.',
      );
    }

    const rawBody = await request.json();
    const body = parseConversationBody(rawBody);

    // Campus must match the authenticated user's campus
    if (body.campusId !== user.campusId) {
      throw new ApiError(
        403,
        'FORBIDDEN',
        'campusId does not match your campus.',
      );
    }

    const db = createUserDbClient(user.token);

    // Check daily post limit before writing
    await assertDailyLimitNotReached(db, user.id);

    const conversation = await createConversation(db, {
      campusId: body.campusId,
      authorId: user.id,
      targetMajorId: body.targetMajorId,
      spinId: body.spinId,
      title: body.title,
      body: body.body,
      postType: body.postType,
    });

    return Response.json(conversation, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
