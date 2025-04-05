const clock = message("clock");

let connected = false;

sleep(250).then(() => {
  if (!connected) {
    document.querySelector("#content").classList.add("hidden");
    document.querySelector("#connecting").classList.remove("hidden");
  }
});

initMessages().then(() => {
  connected = true;
  document.querySelector("#connecting").classList.add("hidden");
  document.querySelector("#content").classList.remove("hidden");

  renderLoop(clock.state, clock.version, clock.publish);

  if (!clock.state()) {
    openEditMenu((createClockMenu) => {
      createClockMenu.querySelector("#cancel-create-clock").remove();
    });
  }
});
