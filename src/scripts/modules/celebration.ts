import { launchBurst } from './confetti.js';

export function activate(): void {
  if (document.body.dataset['state'] === 'celebration') return;

  document.body.dataset['state'] = 'celebration';

  const celebrationScreen = document.querySelector<HTMLElement>('.celebration-screen');
  const countdownScreen = document.querySelector<HTMLElement>('.countdown-screen');

  if (celebrationScreen !== null) {
    celebrationScreen.removeAttribute('aria-hidden');
    celebrationScreen.style.display = 'flex';
    celebrationScreen.style.flexDirection = 'column';
  }
  if (countdownScreen !== null) {
    countdownScreen.setAttribute('aria-hidden', 'true');
    countdownScreen.style.display = 'none';
  }

  launchBurst();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
