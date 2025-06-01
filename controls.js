const nextClock = (clockState) => {
  if (clockState.running != null) {
    return jumpToClock(clockState, (clockState.running + 1) % clockState.clocks.length);
  }
};

const jumpToClock = (clockState, runningNext) => {
  clockState = updateClockState(clockState);
  if (clockState.running != null && runningNext !== clockState.running) {
    const runningClock = clockState.clocks[clockState.running];
    if (runningClock?.time >= 0) {
      runningClock.time += clockState.increment || 0;
    }
  }
  if (runningNext != null && runningNext !== clockState.running) {
    clockState.turn += 1;
  }
  clockState.running = runningNext;
  clockState.paused = undefined;
  return clockState;
};

const pauseClock = (clockState) => {
  clockState = updateClockState(clockState);
  clockState.paused = clockState.running ?? clockState.paused;
  clockState.running = undefined;
  return clockState;
};

const resumeClock = (clockState) => {
  clockState = updateClockState(clockState);
  clockState.running = clockState.running ?? clockState.paused;
  clockState.paused = undefined;
  return clockState;
};

const updateClockState = (clockState) => {
  const newTimestamp = Math.max(Date.now(), clockState.timestamp);
  const newClockState = {
    ...clockState,
    timestamp: newTimestamp,
    clocks: clockState.clocks.map((clock, index) =>
      index === clockState.running
        ? {
            ...clock,
            time: clock.time - (newTimestamp - clockState.timestamp),
          }
        : clock
    ),
  };
  return newClockState;
};
