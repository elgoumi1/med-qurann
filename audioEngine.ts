import { RepeatMode, Surah } from '../types';

export function formatAudioTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const totalSecs = Math.floor(seconds);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const hours = Math.floor(mins / 60);

  if (hours > 0) {
    const remMins = mins % 60;
    return `${hours}:${String(remMins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getNextSurahNumber(
  currentSurahNumber: number,
  totalSurahs: number = 114,
  shuffle: boolean = false,
  repeatMode: RepeatMode = 'none'
): number {
  if (repeatMode === 'one') {
    return currentSurahNumber;
  }

  if (shuffle) {
    let randomNum = Math.floor(Math.random() * totalSurahs) + 1;
    if (randomNum === currentSurahNumber && totalSurahs > 1) {
      randomNum = (randomNum % totalSurahs) + 1;
    }
    return randomNum;
  }

  if (currentSurahNumber >= totalSurahs) {
    return repeatMode === 'all' ? 1 : currentSurahNumber;
  }

  return currentSurahNumber + 1;
}

export function getPreviousSurahNumber(
  currentSurahNumber: number,
  totalSurahs: number = 114
): number {
  if (currentSurahNumber <= 1) {
    return totalSurahs;
  }
  return currentSurahNumber - 1;
}

export function getNextRepeatMode(current: RepeatMode): RepeatMode {
  switch (current) {
    case 'none':
      return 'all';
    case 'all':
      return 'one';
    case 'one':
      return 'none';
    default:
      return 'none';
  }
}

export function calculateKhatmaProgress(currentJuz: number, totalJuz: number = 30): {
  percentage: number;
  remainingJuz: number;
} {
  const safeJuz = Math.max(0, Math.min(totalJuz, currentJuz));
  const percentage = Math.round((safeJuz / totalJuz) * 100);
  const remainingJuz = totalJuz - safeJuz;
  return { percentage, remainingJuz };
}

export const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0] as const;
export type PlaybackSpeed = typeof PLAYBACK_SPEEDS[number];
