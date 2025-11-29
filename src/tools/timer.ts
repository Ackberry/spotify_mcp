import { TimerManager } from '../timer.js';

export async function setSleepTimer(timerManager: TimerManager, durationMinutes: number) {
  if (durationMinutes <= 0) {
    throw new Error('Duration must be greater than 0');
  }

  const timerId = timerManager.setTimer(durationMinutes);
  const timer = timerManager.getTimer(timerId);
  
  if (!timer) {
    throw new Error('Failed to create timer');
  }

  return {
    success: true,
    message: `Sleep timer set for ${durationMinutes} minute(s)`,
    timerId,
    durationMinutes,
    scheduledAt: new Date(timer.scheduledAt).toISOString(),
  };
}

export async function cancelSleepTimer(timerManager: TimerManager, timerId?: string) {
  if (timerId) {
    const cancelled = timerManager.cancelTimer(timerId);
    if (!cancelled) {
      throw new Error(`Timer ${timerId} not found`);
    }
    return {
      success: true,
      message: `Timer ${timerId} cancelled`,
    };
  } else {
    const count = timerManager.cancelAllTimers();
    return {
      success: true,
      message: `Cancelled ${count} timer(s)`,
      cancelledCount: count,
    };
  }
}

export async function getActiveTimers(timerManager: TimerManager) {
  const timers = timerManager.getActiveTimers();
  
  return {
    success: true,
    timers: timers.map(timer => {
      const remaining = timerManager.getRemainingTime(timer.id);
      return {
        id: timer.id,
        durationMinutes: timer.duration,
        scheduledAt: new Date(timer.scheduledAt).toISOString(),
        remainingSeconds: remaining,
      };
    }),
  };
}

