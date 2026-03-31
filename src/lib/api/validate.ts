import { ApiError } from './errors';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUUID(v: unknown): v is string {
  return typeof v === 'string' && UUID_RE.test(v);
}

export function requireUUID(value: unknown, field: string): string {
  if (!isUUID(value)) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      `${field} must be a valid UUID.`,
    );
  }
  return value;
}

/** Parse a query-string boolean: "true" → true, "false" → false, else default */
export function parseBoolParam(
  params: URLSearchParams,
  key: string,
  defaultValue: boolean,
): boolean {
  const raw = params.get(key);
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return defaultValue;
}

/** Parse a query-string integer within [min, max], falling back to defaultValue */
export function parseIntParam(
  params: URLSearchParams,
  key: string,
  defaultValue: number,
  min: number,
  max: number,
): number {
  const raw = params.get(key);
  if (raw === null) return defaultValue;
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < min || n > max) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      `${key} must be an integer between ${min} and ${max}.`,
    );
  }
  return n;
}

export interface SpinBody {
  excludeOwnMajor: boolean;
  excludeRecentlySpun: boolean;
  recentWindowDays: number;
  allowedMajorIds: string[] | null;
}

export function parseSpinBody(raw: unknown): SpinBody {
  if (raw !== null && typeof raw !== 'object') {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Request body must be a JSON object.');
  }
  const body = (raw ?? {}) as Record<string, unknown>;

  const excludeOwnMajor =
    body.excludeOwnMajor === undefined ? true : Boolean(body.excludeOwnMajor);
  const excludeRecentlySpun =
    body.excludeRecentlySpun === undefined ? false : Boolean(body.excludeRecentlySpun);
  const recentWindowDays =
    body.recentWindowDays === undefined
      ? 7
      : parseBodyInt(body.recentWindowDays, 'recentWindowDays', 1, 90);

  let allowedMajorIds: string[] | null = null;
  if (body.allowedMajorIds !== undefined) {
    if (!Array.isArray(body.allowedMajorIds)) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'allowedMajorIds must be an array.');
    }
    if (body.allowedMajorIds.length === 0) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'allowedMajorIds must not be empty.');
    }
    allowedMajorIds = body.allowedMajorIds.map((v, i) => {
      if (!isUUID(v)) {
        throw new ApiError(
          400,
          'VALIDATION_ERROR',
          `allowedMajorIds[${i}] is not a valid UUID.`,
        );
      }
      return v;
    });
  }

  return { excludeOwnMajor, excludeRecentlySpun, recentWindowDays, allowedMajorIds };
}

export interface ConversationBody {
  campusId: string;
  targetMajorId: string;
  spinId: string | null;
  title: string | null;
  body: string;
  postType: 'short' | 'long' | 'prompt';
}

export function parseConversationBody(raw: unknown): ConversationBody {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Request body must be a JSON object.');
  }
  const b = raw as Record<string, unknown>;

  const campusId = requireUUID(b.campusId, 'campusId');
  const targetMajorId = requireUUID(b.targetMajorId, 'targetMajorId');

  let spinId: string | null = null;
  if (b.spinId !== undefined && b.spinId !== null) {
    spinId = requireUUID(b.spinId, 'spinId');
  }

  let title: string | null = null;
  if (b.title !== undefined && b.title !== null) {
    if (typeof b.title !== 'string') {
      throw new ApiError(400, 'VALIDATION_ERROR', 'title must be a string.');
    }
    if (b.title.length > 200) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'title must be 200 characters or fewer.');
    }
    title = b.title.trim() || null;
  }

  if (!b.body || typeof b.body !== 'string' || b.body.trim().length === 0) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'body is required.');
  }
  if (b.body.length > 10000) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'body must be 10,000 characters or fewer.');
  }

  const VALID_TYPES = ['short', 'long', 'prompt'] as const;
  const postType: 'short' | 'long' | 'prompt' =
    b.postType === undefined
      ? 'prompt'
      : VALID_TYPES.includes(b.postType as 'short' | 'long' | 'prompt')
        ? (b.postType as 'short' | 'long' | 'prompt')
        : (() => {
            throw new ApiError(
              400,
              'VALIDATION_ERROR',
              `postType must be one of: ${VALID_TYPES.join(', ')}.`,
            );
          })();

  return { campusId, targetMajorId, spinId, title, body: b.body.trim(), postType };
}

function parseBodyInt(v: unknown, field: string, min: number, max: number): number {
  const n = typeof v === 'number' ? v : parseInt(String(v), 10);
  if (isNaN(n) || n < min || n > max) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      `${field} must be an integer between ${min} and ${max}.`,
    );
  }
  return n;
}
