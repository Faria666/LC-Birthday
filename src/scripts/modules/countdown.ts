import type { CountdownValue } from '../../types/index.js';

export const COUNTDOWN_TARGET_UTC_MS = Date.UTC(2026, 5, 12, 7, 45, 0);

export function getTimeRemaining(targetUtcMs: number): CountdownValue {
  const totalMs = Math.max(0, targetUtcMs - Date.now());

  if (totalMs === 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(totalMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((totalMs % (1000 * 60)) / 1000),
    isExpired: false,
  };
}

export function pad(value: number, width: number): string {
  return String(value).padStart(width, '0');
}

let countdownInterval: ReturnType<typeof setInterval> | undefined;

export function startCountdown(): void {
  if (countdownInterval !== undefined) return;

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  function tick(): void {
    const { days, hours, minutes, seconds, isExpired } = getTimeRemaining(COUNTDOWN_TARGET_UTC_MS);

    if (daysEl !== null) daysEl.textContent = pad(days, 2);
    if (hoursEl !== null) hoursEl.textContent = pad(hours, 2);
    if (minutesEl !== null) minutesEl.textContent = pad(minutes, 2);
    if (secondsEl !== null) secondsEl.textContent = pad(seconds, 2);

    if (isExpired) {
      clearInterval(countdownInterval);
      countdownInterval = undefined;
      document.dispatchEvent(new CustomEvent('countdown:expired'));
    }
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}
