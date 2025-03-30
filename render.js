function renderLoop(getClockState, publishClockState) {
  let loop = () => {
    try {
      renderClocks(getClockState(), publishClockState);
    } finally {
      requestAnimationFrame(loop);
    }
  };
  return {
    start: () => loop(),
    stop: () => {
      loop = () => {};
    },
  };
}

function renderClocks(clockState, publishClockState) {
  const elapsed = Math.max(Date.now() - clockState.timestamp, 0);
  document.querySelector("#clocks").replaceChildren(
    ...clockState.clocks.map((clock, index) => {
      const running = index === clockState.running;
      const paused = index === clockState.paused;
      const name = clock.name;
      const time = running ? clock.time - elapsed : clock.time;
      const click = running ? () => publishClockState(nextClock(clockState)) : null;
      return createClock({ name, time, running, paused, click });
    })
  );
}

function createClock({ name, time, running, paused, click }) {
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

  const timeStr = `${signString}${hourString}${minuteString}${secondString}${millisecondString}`;
  clock.querySelector(".time").textContent = timeStr;
  return clock;
}
