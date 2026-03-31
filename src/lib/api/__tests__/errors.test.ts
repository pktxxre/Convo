import { describe, it, expect } from 'vitest';
import { ApiError, errorResponse, handleError } from '../errors';

describe('ApiError', () => {
  it('sets status, code, and message', () => {
    const err = new ApiError(404, 'NOT_FOUND', 'Thing not found');
    expect(err.status).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Thing not found');
    expect(err.name).toBe('ApiError');
    expect(err instanceof Error).toBe(true);
  });
});

describe('errorResponse', () => {
  it('returns a Response with the correct status and JSON shape', async () => {
    const res = errorResponse(400, 'VALIDATION_ERROR', 'Bad input');
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({
      error: { code: 'VALIDATION_ERROR', message: 'Bad input' },
    });
  });
});

describe('handleError', () => {
  it('maps ApiError to a proper response', async () => {
    const res = handleError(new ApiError(403, 'FORBIDDEN', 'Nope'));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error.code).toBe('FORBIDDEN');
  });

  it('maps unknown errors to 500 INTERNAL_ERROR', async () => {
    const res = handleError(new Error('boom'));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });

  it('maps non-Error throws to 500', async () => {
    const res = handleError('something weird');
    expect(res.status).toBe(500);
  });
});
