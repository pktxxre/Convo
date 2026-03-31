import { describe, it, expect } from 'vitest';
import {
  isUUID,
  requireUUID,
  parseBoolParam,
  parseIntParam,
  parseSpinBody,
  parseConversationBody,
} from '../validate';
import { ApiError } from '../errors';

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('isUUID', () => {
  it('accepts a valid v4 UUID', () => expect(isUUID(VALID_UUID)).toBe(true));
  it('rejects a short string', () => expect(isUUID('abc')).toBe(false));
  it('rejects a number', () => expect(isUUID(42)).toBe(false));
  it('rejects undefined', () => expect(isUUID(undefined)).toBe(false));
});

describe('requireUUID', () => {
  it('passes through a valid UUID', () => {
    expect(requireUUID(VALID_UUID, 'id')).toBe(VALID_UUID);
  });
  it('throws 400 for an invalid value', () => {
    expect(() => requireUUID('not-a-uuid', 'id')).toThrow(ApiError);
    try {
      requireUUID('bad', 'targetId');
    } catch (e) {
      expect(e instanceof ApiError && e.status).toBe(400);
      expect(e instanceof ApiError && e.code).toBe('VALIDATION_ERROR');
      expect(e instanceof ApiError && e.message).toContain('targetId');
    }
  });
});

describe('parseBoolParam', () => {
  const make = (q: string) => new URLSearchParams(q);
  it('parses "true"', () => expect(parseBoolParam(make('x=true'), 'x', false)).toBe(true));
  it('parses "false"', () => expect(parseBoolParam(make('x=false'), 'x', true)).toBe(false));
  it('falls back to default when missing', () => {
    expect(parseBoolParam(make(''), 'x', true)).toBe(true);
    expect(parseBoolParam(make(''), 'x', false)).toBe(false);
  });
  it('falls back to default for unrecognized value', () => {
    expect(parseBoolParam(make('x=yes'), 'x', true)).toBe(true);
  });
});

describe('parseIntParam', () => {
  const make = (q: string) => new URLSearchParams(q);
  it('returns parsed integer within range', () => {
    expect(parseIntParam(make('n=5'), 'n', 1, 1, 100)).toBe(5);
  });
  it('returns default when param is missing', () => {
    expect(parseIntParam(make(''), 'n', 20, 1, 100)).toBe(20);
  });
  it('throws for out-of-range value', () => {
    expect(() => parseIntParam(make('n=0'), 'n', 20, 1, 100)).toThrow(ApiError);
    expect(() => parseIntParam(make('n=101'), 'n', 20, 1, 100)).toThrow(ApiError);
  });
  it('throws for NaN', () => {
    expect(() => parseIntParam(make('n=abc'), 'n', 20, 1, 100)).toThrow(ApiError);
  });
});

describe('parseSpinBody', () => {
  it('applies defaults for empty body', () => {
    const result = parseSpinBody({});
    expect(result).toEqual({
      excludeOwnMajor: true,
      excludeRecentlySpun: false,
      recentWindowDays: 7,
      allowedMajorIds: null,
    });
  });

  it('accepts null body (treated as {})', () => {
    const result = parseSpinBody(null);
    expect(result.excludeOwnMajor).toBe(true);
  });

  it('throws on empty allowedMajorIds array', () => {
    expect(() => parseSpinBody({ allowedMajorIds: [] })).toThrow(ApiError);
  });

  it('throws on invalid UUID in allowedMajorIds', () => {
    expect(() => parseSpinBody({ allowedMajorIds: ['not-a-uuid'] })).toThrow(ApiError);
  });

  it('accepts valid allowedMajorIds', () => {
    const result = parseSpinBody({ allowedMajorIds: [VALID_UUID] });
    expect(result.allowedMajorIds).toEqual([VALID_UUID]);
  });

  it('throws for non-object body', () => {
    expect(() => parseSpinBody('string body')).toThrow(ApiError);
  });
});

describe('parseConversationBody', () => {
  const valid = {
    campusId: VALID_UUID,
    targetMajorId: VALID_UUID,
    body: 'Hello Psychology students!',
    postType: 'prompt',
  };

  it('parses a minimal valid body', () => {
    const result = parseConversationBody(valid);
    expect(result.campusId).toBe(VALID_UUID);
    expect(result.postType).toBe('prompt');
    expect(result.spinId).toBeNull();
    expect(result.title).toBeNull();
  });

  it('defaults postType to "prompt" when omitted', () => {
    const result = parseConversationBody({ ...valid, postType: undefined });
    expect(result.postType).toBe('prompt');
  });

  it('throws for missing body', () => {
    expect(() => parseConversationBody({ ...valid, body: '' })).toThrow(ApiError);
  });

  it('throws for body over 10,000 chars', () => {
    expect(() =>
      parseConversationBody({ ...valid, body: 'x'.repeat(10001) }),
    ).toThrow(ApiError);
  });

  it('throws for invalid postType', () => {
    expect(() =>
      parseConversationBody({ ...valid, postType: 'video' }),
    ).toThrow(ApiError);
  });

  it('throws for title over 200 chars', () => {
    expect(() =>
      parseConversationBody({ ...valid, title: 'x'.repeat(201) }),
    ).toThrow(ApiError);
  });

  it('throws for non-object body', () => {
    expect(() => parseConversationBody(null)).toThrow(ApiError);
    expect(() => parseConversationBody('string')).toThrow(ApiError);
  });
});
