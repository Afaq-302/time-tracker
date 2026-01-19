import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const initialTimerState = {
  isRunning: false,
  isPaused: false,
  startTime: null,
  pausedAt: null,
  accumulatedTime: 0,
  projectId: null,
  description: '',
  billable: true,
};

export function useTimer(onComplete) {
  const [timerState, setTimerState] = useLocalStorage('tt-timer', initialTimerState);
  const [elapsed, setElapsed] = useState(0);

  // Calculate elapsed time
  useEffect(() => {
    if (!timerState.isRunning || timerState.isPaused) {
      setElapsed(timerState.accumulatedTime);
      return;
    }

    const updateElapsed = () => {
      if (timerState.startTime) {
        const now = Date.now();
        const started = new Date(timerState.startTime).getTime();
        setElapsed(timerState.accumulatedTime + Math.floor((now - started) / 1000));
      }
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.isPaused, timerState.startTime, timerState.accumulatedTime]);

  const start = useCallback((projectId, description = '', billable = true) => {
    setTimerState({
      isRunning: true,
      isPaused: false,
      startTime: new Date().toISOString(),
      pausedAt: null,
      accumulatedTime: 0,
      projectId,
      description,
      billable,
    });
  }, [setTimerState]);

  const pause = useCallback(() => {
    if (!timerState.isRunning || timerState.isPaused) return;

    const now = new Date();
    const started = new Date(timerState.startTime).getTime();
    const newAccumulated = timerState.accumulatedTime + Math.floor((now.getTime() - started) / 1000);

    setTimerState({
      ...timerState,
      isPaused: true,
      pausedAt: now.toISOString(),
      accumulatedTime: newAccumulated,
    });
  }, [timerState, setTimerState]);

  const resume = useCallback(() => {
    if (!timerState.isPaused) return;

    setTimerState({
      ...timerState,
      isRunning: true,
      isPaused: false,
      startTime: new Date().toISOString(),
      pausedAt: null,
    });
  }, [timerState, setTimerState]);

  const stop = useCallback(() => {
    if (!timerState.isRunning && !timerState.isPaused) return;

    const now = new Date();
    let totalDuration = timerState.accumulatedTime;
    
    if (!timerState.isPaused && timerState.startTime) {
      const started = new Date(timerState.startTime).getTime();
      totalDuration += Math.floor((now.getTime() - started) / 1000);
    }

    // Calculate actual start time based on total duration
    const actualStart = new Date(now.getTime() - totalDuration * 1000);

    const entry = {
      projectId: timerState.projectId,
      entryType: 'timer',
      description: timerState.description,
      startTime: actualStart.toISOString(),
      endTime: now.toISOString(),
      duration: totalDuration,
      billable: timerState.billable,
    };

    onComplete(entry);
    setTimerState(initialTimerState);
  }, [timerState, setTimerState, onComplete]);

  const discard = useCallback(() => {
    setTimerState(initialTimerState);
  }, [setTimerState]);

  const updateDescription = useCallback((description) => {
    setTimerState({
      ...timerState,
      description,
    });
  }, [timerState, setTimerState]);

  const updateProject = useCallback((projectId) => {
    setTimerState({
      ...timerState,
      projectId,
    });
  }, [timerState, setTimerState]);

  const updateBillable = useCallback((billable) => {
    setTimerState({
      ...timerState,
      billable,
    });
  }, [timerState, setTimerState]);

  return {
    ...timerState,
    elapsed,
    start,
    pause,
    resume,
    stop,
    discard,
    updateDescription,
    updateProject,
    updateBillable,
  };
}
