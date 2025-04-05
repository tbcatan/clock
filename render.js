const renderLoop = (getClockState, getClockVersion, publishClockState) => {
  let clockState;
  let clockVersion;
  let loop = () => {
    try {
      const newClockState = getClockState();
      const newClockVersion = getClockVersion();
      if (newClockState !== clockState || newClockVersion !== clockVersion) {
        renderClocks(newClockState, newClockVersion, publishClockState);
        clockState = newClockState;
        clockVersion = newClockVersion;
      } else if (clockState?.running != null) {
        element("clock-state")
          .querySelector(".clocks")
          .children[clockState.running].querySelector(".time").textContent = formatTime(
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

const renderClocks = (clockState, clockVersion, publishClockState) => {
  const incrementInfo = createIncrementInfo(clockState?.increment);
  const info = [incrementInfo].filter((el) => el);
  const infoEl = info.length > 0 ? createElement("div", { class: "clock-info", children: info }) : null;

  const clocks = clockState?.clocks.map((clock, index) => {
    const running = index === clockState.running;
    const paused = index === clockState.paused;
    const name = clock.name;
    const time = running ? runningClockTime(clock.time, clockState.timestamp) : clock.time;

    const clockEl = createClock({ name, time, running, paused });
    if (running) {
      clockEl.addEventListener("click", () => publishClockState(nextClock(clockState), clockVersion));
    } else if (paused) {
      clockEl.addEventListener("click", () => publishClockState(resumeClock(clockState), clockVersion));
    } else {
      const jump = () => publishClockState(jumpToClock(clockState, index), clockVersion);
      clockEl.addEventListener("dblclick", jump);
      let touchTimeout;
      clockEl.addEventListener("touchstart", (event) => {
        event.preventDefault();
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
          jump();
        }, 500);
      });
      clockEl.addEventListener("touchend", () => {
        clearTimeout(touchTimeout);
      });
    }
    return clockEl;
  });
  const clocksEl = clocks?.length > 0 ? createElement("div", { class: "clocks", children: clocks }) : null;

  const controls = [];
  if (clockState?.running != null) {
    controls.push(template("pause-button"));
  } else if (clockState?.clocks.length > 0) {
    controls.push(template("play-button"));
  }
  controls.push(template("edit-button"));
  const controlsEl = createElement("div", { class: "controls", children: controls });

  element("clock-state").replaceChildren(...[infoEl, clocksEl, controlsEl].filter((el) => el));
};

const createClock = ({ name, time, running, paused }) => {
  const clock = template("clock").querySelector(".clock");
  if (running) {
    clock.classList.add("running");
  }
  if (paused) {
    clock.classList.add("paused");
  }
  clock.querySelector(".name").textContent = name;
  clock.querySelector(".time").textContent = formatTime(time);
  return clock;
};

const createIncrementInfo = (increment) => {
  if (!increment) {
    return;
  }
  const incrementSeconds = increment / 1000;
  if (!(incrementSeconds >= 0.5)) {
    return;
  }
  const incrementInfo = createElement("div");
  incrementInfo.textContent = `${incrementSeconds.toFixed(0)} second increment`;
  return incrementInfo;
};

const runningClockTime = (time, asOfTimestamp) => {
  return time - Math.max(Date.now() - asOfTimestamp, 0);
};

const formatTime = (time) => {
  const signString = time < 0 ? "-" : "";
  time = Math.abs(time);

  const milliseconds = time % 1000;
  const millisecondString = time < 10 * 1000 ? `.${Math.floor(milliseconds / 100).toFixed(0)}` : "";

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
