const nextClock = (clockState) => {
  clockState = updateClockState(clockState);
  if (clockState.running != null) {
    const runningClock = clockState.clocks[clockState.running];
    if (runningClock?.time >= 0) {
      runningClock.time += clockState.increment || 0;
    }
  }
  return {
    ...clockState,
    running: (clockState.running != null && (clockState.running + 1) % clockState.clocks.length) || 0,
    paused: undefined,
  };
};

const pauseClock = (clockState) => ({
  ...updateClockState(clockState),
  running: undefined,
  paused: clockState.running ?? clockState.paused,
});

const resumeClock = (clockState) => ({
  ...updateClockState(clockState),
  running: (clockState.running ?? clockState.paused) || 0,
  paused: undefined,
});

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
