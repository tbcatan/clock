function nextClock(clockState) {
  return {
    ...updateClockState(clockState),
    running: (clockState.running != null && (clockState.running + 1) % clockState.clocks.length) || 0,
    paused: undefined,
  };
}

function pauseClock(clockState) {
  return {
    ...updateClockState(clockState),
    running: undefined,
    paused: clockState.running ?? clockState.paused,
  };
}

function resumeClock(clockState) {
  return {
    ...updateClockState(clockState),
    running: (clockState.running ?? clockState.paused) || 0,
    paused: undefined,
  };
}

function updateClockState(clockState) {
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
}
