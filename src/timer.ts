import type { SleepTimer } from './types.js';
import { SpotifyClient } from './spotify/client.js';

export class TimerManager {
  private timers: Map<string, SleepTimer> = new Map();
  private client: SpotifyClient;

  constructor(client: SpotifyClient) {
    this.client = client;
  }

  setTimer(durationMinutes: number): string {
    const timerId = `timer_${Date.now()}`;
    const durationMs = durationMinutes * 60 * 1000;

    const timeoutId = setTimeout(async () => {
      try {
        await this.client.pause();
        this.timers.delete(timerId);
      } catch (error) {
        console.error('Error pausing playback for timer:', error);
        this.timers.delete(timerId);
      }
    }, durationMs);

    const timer: SleepTimer = {
      id: timerId,
      duration: durationMinutes,
      scheduledAt: Date.now(),
      timeoutId,
    };

    this.timers.set(timerId, timer);
    return timerId;
  }

  cancelTimer(timerId: string): boolean {
    const timer = this.timers.get(timerId);
    if (!timer) {
      return false;
    }

    clearTimeout(timer.timeoutId);
    this.timers.delete(timerId);
    return true;
  }

  cancelAllTimers(): number {
    let count = 0;
    for (const [timerId, timer] of this.timers.entries()) {
      clearTimeout(timer.timeoutId);
      this.timers.delete(timerId);
      count++;
    }
    return count;
  }

  getTimer(timerId: string): SleepTimer | null {
    return this.timers.get(timerId) || null;
  }

  getActiveTimers(): SleepTimer[] {
    return Array.from(this.timers.values());
  }

  getRemainingTime(timerId: string): number | null {
    const timer = this.timers.get(timerId);
    if (!timer) {
      return null;
    }

    const elapsed = Date.now() - timer.scheduledAt;
    const remaining = (timer.duration * 60 * 1000) - elapsed;
    return Math.max(0, Math.floor(remaining / 1000));
  }
}

