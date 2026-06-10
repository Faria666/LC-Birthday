import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock confetti module before importing celebration
vi.mock('../../src/scripts/modules/confetti.js', () => ({
  launchBurst: vi.fn(),
}));

import { activate } from '../../src/scripts/modules/celebration.js';
import { launchBurst } from '../../src/scripts/modules/confetti.js';

describe('activate()', () => {
  beforeEach(() => {
    document.body.dataset['state'] = 'countdown';
    document.body.innerHTML = `
      <section class="countdown-screen"></section>
      <section class="celebration-screen" aria-hidden="true"></section>
    `;
    vi.clearAllMocks();
  });

  it('sets body data-state to celebration', () => {
    activate();
    expect(document.body.dataset['state']).toBe('celebration');
  });

  it('removes aria-hidden from celebration screen', () => {
    activate();
    const el = document.querySelector('.celebration-screen');
    expect(el?.getAttribute('aria-hidden')).toBeNull();
  });

  it('adds aria-hidden to countdown screen', () => {
    activate();
    const el = document.querySelector('.countdown-screen');
    expect(el?.getAttribute('aria-hidden')).toBe('true');
  });

  it('calls launchBurst once', () => {
    activate();
    expect(launchBurst).toHaveBeenCalledTimes(1);
  });

  it('is idempotent — calling twice does not fire launchBurst a second time', () => {
    activate();
    activate();
    expect(launchBurst).toHaveBeenCalledTimes(1);
  });
});
