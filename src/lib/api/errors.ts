export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'DAILY_LIMIT_REACHED'
  | 'INTERNAL_ERROR';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorResponse(
  status: number,
  code: ErrorCode,
  message: string,
): Response {
  return Response.json({ error: { code, message } }, { status });
}

export function handleError(err: unknown): Response {
  if (err instanceof ApiError) {
    return errorResponse(err.status, err.code, err.message);
  }
  console.error('[API]', err);
  return errorResponse(500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
}
