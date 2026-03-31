import { describe, it, expect, vi } from 'vitest';
import { pickWinner } from '../spins';

describe('pickWinner', () => {
  it('returns an element from the array', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const winner = pickWinner(items);
    expect(items).toContain(winner);
  });

  it('throws for an empty array', () => {
    expect(() => pickWinner([])).toThrow('Cannot pick from an empty list.');
  });

  it('always returns the only item in a single-element array', () => {
    const item = { id: 'only' };
    expect(pickWinner([item])).toBe(item);
  });

  it('distributes picks uniformly (chi-square smoke test)', () => {
    // 3 items, 3000 picks — each should land ~1000 times.
    // Chi-square critical value at p=0.001, df=2 is 13.8 — reject outside that.
    const items = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
    const counts: Record<string, number> = { A: 0, B: 0, C: 0 };
    const N = 3000;
    for (let i = 0; i < N; i++) {
      counts[pickWinner(items).id]++;
    }
    const expected = N / items.length;
    const chiSquare = Object.values(counts).reduce(
      (sum, obs) => sum + Math.pow(obs - expected, 2) / expected,
      0,
    );
    // chi-square should be well below 13.8 for a fair distribution
    expect(chiSquare).toBeLessThan(13.8);
  });

  it('respects a mocked Math.random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const items = [{ id: 'X' }, { id: 'Y' }, { id: 'Z' }];
    // Math.floor(0.99 * 3) = 2 → last item
    expect(pickWinner(items)).toEqual({ id: 'Z' });
    vi.restoreAllMocks();
  });
});
