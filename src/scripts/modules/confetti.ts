import confetti from 'canvas-confetti';

export function launchBurst(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
  const particleCount = 40;

  const randomInRange = (min: number, max: number): number =>
    Math.random() * (max - min) + min;

  setInterval(() => {
    void confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    void confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}
