const renderLoop = (getClockState, publishClockState) => {
  let clockState = null;
  let loop = () => {
    try {
      const newClockState = getClockState();
      if (newClockState !== clockState) {
        renderClocks(newClockState, publishClockState);
        clockState = newClockState;
      } else if (clockState?.running != null) {
        document.querySelector("#clocks").children[clockState.running].querySelector(".time").textContent = formatTime(
          runningClockTime(clockState.clocks[clockState.running].time, clockState.timestamp)
        );
      }
    } finally {
      requestAnimationFrame(() => loop());
    }
  };
  requestAnimationFrame(() => loop());
  return {
    close: () => {
      loop = () => {};
    },
  };
};

const renderClocks = (clockState, publishClockState) => {
  if (clockState) {
    document.querySelector("#clocks").replaceChildren(
      ...clockState.clocks.map((clock, index) => {
        const running = index === clockState.running;
        const paused = index === clockState.paused;
        const name = clock.name;
        const time = running ? runningClockTime(clock.time, clockState.timestamp) : clock.time;
        const click = running ? () => publishClockState(nextClock(clockState)) : null;
        return createClock({ name, time, running, paused, click });
      })
    );
  } else {
    document.querySelector("#clocks").replaceChildren();
  }
  const running = clockState?.running != null;
  document.querySelector("#play-button").style.display =
    !running && clockState?.clocks?.length > 0 ? "inline-block" : "none";
  document.querySelector("#pause-button").style.display = running ? "inline-block" : "none";
};

const createClock = ({ name, time, running, paused, click }) => {
  const clock = document.querySelector("#clock").content.cloneNode(true).querySelector(".clock");
  if (running) {
    clock.classList.add("running");
  }
  if (paused) {
    clock.classList.add("paused");
  }
  if (click) {
    clock.addEventListener("click", click);
  }
  clock.querySelector(".name").textContent = name;
  clock.querySelector(".time").textContent = formatTime(time);
  return clock;
};

const runningClockTime = (time, asOfTimestamp) => {
  return time - Math.max(Date.now() - asOfTimestamp, 0);
};

const formatTime = (time) => {
  const signString = time < 0 ? "-" : "";
  time = Math.abs(time);

  const milliseconds = time % 1000;
  const millisecondString =
    time < 10 * 1000
      ? `.${Math.floor(milliseconds / 10)
          .toFixed(0)
          .padStart(2, "0")}`
      : "";

  time = (time - milliseconds) / 1000;
  const seconds = time % 60;
  const secondString = seconds.toFixed(0).padStart(2, "0");

  time = (time - seconds) / 60;
  const minutes = time % 60;
  const minuteString = `${minutes.toFixed(0).padStart(2, "0")}:`;

  time = (time - minutes) / 60;
  const hours = time;
  const hourString = time >= 0.5 ? `${hours.toFixed(0).padStart(2, "0")}:` : "";

  return `${signString}${hourString}${minuteString}${secondString}${millisecondString}`;
};
