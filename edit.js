const openEditMenu = (modifyEditMenu) => {
  const createClockMenu = document.querySelector("#create-clock").content.cloneNode(true);
  modifyEditMenu?.(createClockMenu);
  document.querySelector("#content").classList.add("hidden");
  document.querySelector("#edit").replaceChildren(createClockMenu);
};

const closeEditMenu = () => {
  document.querySelector("#edit").replaceChildren();
  document.querySelector("#content").classList.remove("hidden");
};

const getNewClockState = (playerString, timeMinutes, incrementSeconds) => {
  const players = playerString
    .split(/[\n,;]/)
    .map((name) => name.trim())
    .filter((name) => name)
    .map((name) => name.replace(/\s+/g, " "));
  if (players.length === 0) {
    return;
  }

  timeMinutes = timeMinutes.trim();
  if (!/^\d{1,10}$/.test(timeMinutes)) {
    return;
  }
  const timeMilliseconds = Number(timeMinutes) * 60 * 1000;

  incrementSeconds = incrementSeconds.trim();
  if (!/^\d{0,10}$/.test(incrementSeconds)) {
    return;
  }
  const incrementMilliseconds = Number(incrementSeconds) * 1000;

  return {
    timestamp: Date.now(),
    increment: incrementMilliseconds,
    clocks: players.map((name) => ({ name, time: timeMilliseconds })),
  };
};

const createNewClock = (publishClockState) => {
  const playerInput = document.querySelector("#player-input");
  const timeInput = document.querySelector("#time-input");
  const incrementInput = document.querySelector("#increment-input");

  const newClockState = getNewClockState(playerInput.innerText, timeInput.value, incrementInput.value);
  if (!newClockState) {
    return Promise.reject();
  }
  return publishClockState(newClockState).then(closeEditMenu);
};
