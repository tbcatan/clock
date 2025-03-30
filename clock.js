/*
// clock state
{
  timestamp: number; // milliseconds since epoch
  clocks: [
    {
      name: string;
      time: number; // milliseconds remaining as of timestamp
    }
  ];
  running: number; // running clock index or null
}
*/

function renderLoop(clockStateGetter) {
  let loop = () => {
    try {
      renderClocks(clockStateGetter());
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

function renderClocks(clockState) {
  const elapsed = Math.max(Date.now() - clockState.timestamp, 0);
  document.querySelector("#clocks").replaceChildren(
    ...clockState.clocks.map((clock, index) => {
      const running = index === clockState.running;
      const time = running ? clock.time - elapsed : clock.time;
      return createClock(clock.name, time, running);
    })
  );
}

function createClock(name, time, running) {
  const clock = document.querySelector("#clock").content.cloneNode(true);
  if (running) {
    clock.querySelector(".clock").classList.add("running");
  }
  clock.querySelector(".name").textContent = name;

  const signString = time < 0 ? "-" : "";
  time = Math.abs(time);

  const milliseconds = time % 1000;
  const millisecondString = time < 10 * 1000 ? `.${milliseconds.toFixed(2)}` : "";

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
