import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTimeRemaining, pad, COUNTDOWN_TARGET_UTC_MS } from '../../src/scripts/modules/countdown.js';

describe('pad()', () => {
  it('pads single digits with a leading zero', () => {
    expect(pad(7, 2)).toBe('07');
    expect(pad(0, 2)).toBe('00');
  });

  it('leaves multi-digit numbers unchanged', () => {
    expect(pad(12, 2)).toBe('12');
    expect(pad(99, 2)).toBe('99');
    expect(pad(365, 3)).toBe('365');
  });
});

describe('getTimeRemaining()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns all zeros with isExpired true for a past target', () => {
    vi.setSystemTime(new Date(COUNTDOWN_TARGET_UTC_MS + 1000));
    const result = getTimeRemaining(COUNTDOWN_TARGET_UTC_MS);
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
  });

  it('returns isExpired true at exactly the target moment', () => {
    vi.setSystemTime(new Date(COUNTDOWN_TARGET_UTC_MS));
    const result = getTimeRemaining(COUNTDOWN_TARGET_UTC_MS);
    expect(result.isExpired).toBe(true);
  });

  it('returns non-zero values with isExpired false for a future target', () => {
    vi.setSystemTime(new Date(COUNTDOWN_TARGET_UTC_MS - 90_061_000)); // ~1 day 1 hour 1 min 1 sec before
    const result = getTimeRemaining(COUNTDOWN_TARGET_UTC_MS);
    expect(result.isExpired).toBe(false);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(1);
    expect(result.seconds).toBe(1);
  });

  it('returns correct units for a target exactly 1 day away', () => {
    vi.setSystemTime(new Date(COUNTDOWN_TARGET_UTC_MS - 86_400_000));
    const result = getTimeRemaining(COUNTDOWN_TARGET_UTC_MS);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.isExpired).toBe(false);
  });

  it('returns all non-negative values', () => {
    vi.setSystemTime(new Date(COUNTDOWN_TARGET_UTC_MS - 3_661_000));
    const result = getTimeRemaining(COUNTDOWN_TARGET_UTC_MS);
    expect(result.days).toBeGreaterThanOrEqual(0);
    expect(result.hours).toBeGreaterThanOrEqual(0);
    expect(result.minutes).toBeGreaterThanOrEqual(0);
    expect(result.seconds).toBeGreaterThanOrEqual(0);
  });
});
