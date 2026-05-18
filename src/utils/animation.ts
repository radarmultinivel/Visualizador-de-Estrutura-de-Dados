// Desenvolvido por L. A. Leandro - São José dos Campos - SP - 18/05/2026
export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export const SPEED_MS: Record<AnimationSpeed, number> = {
  slow: 800,
  normal: 400,
  fast: 150,
};

export function getSpeedMs(speed: AnimationSpeed): number {
  return SPEED_MS[speed];
}
