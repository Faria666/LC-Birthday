
import { startCountdown, getTimeRemaining, COUNTDOWN_TARGET_UTC_MS } from './modules/countdown.js';
import { activate } from './modules/celebration.js';

document.addEventListener('DOMContentLoaded', () => {
  const celebrationEl = document.querySelector<HTMLElement>('.celebration-screen');
  if (celebrationEl !== null) celebrationEl.style.display = 'none';

  if (getTimeRemaining(COUNTDOWN_TARGET_UTC_MS).isExpired) {
    activate();
  } else {
    startCountdown();
    document.addEventListener('countdown:expired', () => { activate(); }, { once: true });
  }
});
