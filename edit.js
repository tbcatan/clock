const openEditMenu = (modifyEditMenu) => {
  const createClockMenu = document.querySelector("#create-clock").content.cloneNode(true);
  modifyEditMenu?.(createClockMenu);
  document.querySelector("#content").classList.add("hidden");
  document.querySelector("#edit").replaceChildren(createClockMenu);
  document.querySelector("#player-input").focus();
};

const stopEditing = () => {
  document.querySelector("#content").classList.remove("hidden");
  document.querySelector("#edit").replaceChildren();
};

const getNewClockState = (playerString, timeMinutes) => {
  const players = playerString
    .split(/[\n,;]/)
    .map((name) => name.trim())
    .filter((name) => name)
    .map((name) => name.replace(/\s+/g, " "));
  if (players.length === 0) {
    return;
  }
  timeMinutes = timeMinutes.trim();
  if (!/^\d{1,11}$/.test(timeMinutes)) {
    return;
  }
  const timeMilliseconds = Number(timeMinutes) * 60 * 1000;
  return {
    timestamp: Date.now(),
    clocks: players.map((name) => ({ name, time: timeMilliseconds })),
  };
};

const createNewClock = (publishClockState) => {
  const playerInput = document.querySelector("#player-input");
  const timeInput = document.querySelector("#time-input");
  const newClockState = getNewClockState(playerInput.innerText, timeInput.value);
  if (newClockState) {
    publishClockState(newClockState).then(stopEditing);
  }
};
